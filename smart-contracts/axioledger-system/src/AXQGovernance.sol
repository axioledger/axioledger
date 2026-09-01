// SPDX-License-Identifier: BSL-1.1
// AXIOLEDGER ($AXQ) — DAO Governance Core
//
// Tri-partite governance model:
//   Legislative:  Quadratic Voting (votes = √tokens)
//   Judicial:     Guardian Council (5 seats, 4/5 veto)
//   Executive:    Time-Lock (7 days) + Emergency Escape Hatch
//
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title AXQGovernance — AXIOLEDGER DAO Governance Core
/// @notice Quadratic voting + Guardian Council veto + 7-day time-lock.
contract AXQGovernance is ReentrancyGuard {

    // ── Types ────────────────────────────────────────────────────────────────

    enum ProposalState { Pending, Active, Vetoed, Queued, Executed, Cancelled, Defeated }

    struct Proposal {
        uint256 id;
        address proposer;
        string  description;
        bytes   callData;
        address target;
        uint256 value;
        uint64  voteStart;
        uint64  voteEnd;
        uint64  executionTime;   // voteEnd + TIME_LOCK_PERIOD
        uint256 votesFor;        // quadratic-weighted
        uint256 votesAgainst;
        bool    executed;
        bool    vetoed;
    }

    struct VetoVote {
        address guardian;
        bool    inFavor;         // true = veto this proposal
    }

    // ── Constants ────────────────────────────────────────────────────────────

    uint64  public constant VOTING_PERIOD     = 3 days;
    uint64  public constant TIME_LOCK_PERIOD  = 7 days;
    uint256 public constant PROPOSAL_THRESHOLD = 100_000e18;  // 100k $AXQ to propose
    uint256 public constant QUORUM_VOTES      = 1_000_000e18; // 1M quadratic-weighted votes
    uint8   public constant GUARDIAN_SEATS    = 5;
    uint8   public constant VETO_THRESHOLD    = 4;            // 4-of-5 guardians

    // ── State ────────────────────────────────────────────────────────────────

    IERC20  public immutable AXQ_TOKEN;
    address public treasury;

    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    // Guardian Council
    address[GUARDIAN_SEATS] public guardians;
    mapping(uint256 => mapping(address => bool)) public guardianVetoed;
    mapping(uint256 => uint8) public vetoCount;

    // ── Events ───────────────────────────────────────────────────────────────

    event ProposalCreated(uint256 indexed id, address proposer, string description);
    event VoteCast(uint256 indexed id, address voter, bool support, uint256 weight);
    event ProposalVetoed(uint256 indexed id, address guardian, uint8 vetoCount);
    event ProposalQueued(uint256 indexed id, uint64 executionTime);
    event ProposalExecuted(uint256 indexed id);
    event ProposalCancelled(uint256 indexed id);

    // ── Errors ───────────────────────────────────────────────────────────────

    error GOV_BelowThreshold();
    error GOV_NotActive();
    error GOV_AlreadyVoted();
    error GOV_NotQueued();
    error GOV_TimeLockNotExpired();
    error GOV_NotGuardian();
    error GOV_AlreadyVetoed();
    error GOV_ExecutionFailed();
    error GOV_ZeroAddress();

    // ── Constructor ──────────────────────────────────────────────────────────

    constructor(
        address _axqToken,
        address _treasury,
        address[GUARDIAN_SEATS] memory _guardians
    ) {
        if (_axqToken  == address(0)) revert GOV_ZeroAddress();
        if (_treasury  == address(0)) revert GOV_ZeroAddress();

        AXQ_TOKEN = IERC20(_axqToken);
        treasury  = _treasury;
        guardians = _guardians;
    }

    // ── Proposal lifecycle ───────────────────────────────────────────────────

    /// @notice Create a new governance proposal.
    function propose(
        address target,
        uint256 value,
        bytes calldata callData,
        string calldata description
    ) external returns (uint256) {
        uint256 balance = AXQ_TOKEN.balanceOf(msg.sender);
        if (balance < PROPOSAL_THRESHOLD) revert GOV_BelowThreshold();

        unchecked { proposalCount++; }
        uint256 id = proposalCount;

        proposals[id] = Proposal({
            id:            id,
            proposer:      msg.sender,
            description:   description,
            callData:      callData,
            target:        target,
            value:         value,
            voteStart:     uint64(block.timestamp),
            voteEnd:       uint64(block.timestamp) + VOTING_PERIOD,
            executionTime: uint64(block.timestamp) + VOTING_PERIOD + TIME_LOCK_PERIOD,
            votesFor:      0,
            votesAgainst:  0,
            executed:      false,
            vetoed:        false
        });

        emit ProposalCreated(id, msg.sender, description);
        return id;
    }

    /// @notice Cast a quadratic-weighted vote.
    /// @param id Proposal ID
    /// @param support true = for, false = against
    function castVote(uint256 id, bool support) external {
        Proposal storage p = proposals[id];
        if (block.timestamp < p.voteStart || block.timestamp > p.voteEnd || p.vetoed)
            revert GOV_NotActive();
        if (hasVoted[id][msg.sender]) revert GOV_AlreadyVoted();

        hasVoted[id][msg.sender] = true;

        uint256 balance = AXQ_TOKEN.balanceOf(msg.sender);
        // Quadratic weight: votes = sqrt(balance / 1e18) — integer sqrt
        uint256 weight  = _sqrt(balance / 1e18);

        if (support) {
            p.votesFor     += weight;
        } else {
            p.votesAgainst += weight;
        }

        emit VoteCast(id, msg.sender, support, weight);
    }

    /// @notice Queue a passed proposal for time-locked execution.
    function queue(uint256 id) external {
        Proposal storage p = proposals[id];
        if (block.timestamp <= p.voteEnd)     revert GOV_NotActive();
        if (p.vetoed || p.executed)           revert GOV_NotQueued();
        if (p.votesFor <= p.votesAgainst)     revert GOV_NotQueued();
        if (p.votesFor < QUORUM_VOTES)        revert GOV_NotQueued();

        emit ProposalQueued(id, p.executionTime);
    }

    /// @notice Execute a queued proposal after time-lock expires.
    function execute(uint256 id) external payable nonReentrant {
        Proposal storage p = proposals[id];
        if (block.timestamp < p.executionTime)  revert GOV_TimeLockNotExpired();
        if (p.executed || p.vetoed)             revert GOV_NotQueued();
        if (p.votesFor <= p.votesAgainst)       revert GOV_NotQueued();

        p.executed = true;

        (bool ok, ) = p.target.call{ value: p.value }(p.callData);
        if (!ok) revert GOV_ExecutionFailed();

        emit ProposalExecuted(id);
    }

    // ── Guardian Council ─────────────────────────────────────────────────────

    /// @notice Guardian casts veto vote. 4-of-5 required to block proposal.
    function vetoVote(uint256 id) external {
        bool isGuardian = false;
        for (uint8 i = 0; i < GUARDIAN_SEATS; ) {
            if (guardians[i] == msg.sender) { isGuardian = true; break; }
            unchecked { i++; }
        }
        if (!isGuardian)                    revert GOV_NotGuardian();
        if (guardianVetoed[id][msg.sender]) revert GOV_AlreadyVetoed();

        Proposal storage p = proposals[id];
        if (block.timestamp > p.voteEnd)    revert GOV_NotActive();

        guardianVetoed[id][msg.sender] = true;
        vetoCount[id]++;

        emit ProposalVetoed(id, msg.sender, vetoCount[id]);

        if (vetoCount[id] >= VETO_THRESHOLD) {
            p.vetoed = true;
        }
    }

    // ── Emergency Escape Hatch ───────────────────────────────────────────────

    /// @notice Emergency withdrawal — requires 4-of-5 guardians to have signed off on proposal.
    /// @dev In production this would be a separate multi-sig — stub for now.
    function emergencyWithdraw(address token, address to, uint256 amount) external {
        // Requires all guardian vetoes to be used on a special ESCAPE_HATCH proposal
        // Implementation: Phase 3 DAO contracts
        revert("not implemented — Phase 3");
    }

    // ── Internal ─────────────────────────────────────────────────────────────

    /// @dev Integer square root (Babylonian method).
    function _sqrt(uint256 x) internal pure returns (uint256) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }
}
