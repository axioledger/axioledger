'use strict';
/**
 * @axioledger/axq-sdk — AXIOLEDGER TypeScript/JS Client SDK
 *
 * Provides typed interfaces for:
 *   - ANS domain resolution
 *   - AXQ token interactions
 *   - VPX Oracle price feeds
 *   - KPX DEX swaps
 *   - VRQ ZK-proof verification
 */

/**
 * Supported ANS TLDs.
 * @readonly
 */
const ANS_TLDS = Object.freeze(['axq', 'vpx', 'sqx', 'kpx', 'vrq']);

/**
 * Default RPC endpoints per network.
 * @readonly
 */
const DEFAULT_RPC = Object.freeze({
  mainnet: 'https://rpc.axqprotocol.axq',
  sepolia: 'https://eth-sepolia.g.alchemy.com/v2/demo',
  localnet: 'http://127.0.0.1:8545',
});

/**
 * AXIOLEDGER SDK — main entry point.
 */
class AxioledgerSDK {
  /**
   * @param {object} config
   * @param {string} config.rpcUrl
   * @param {object} [config.contracts] — override deployed contract addresses
   */
  constructor(config = {}) {
    this.rpcUrl   = config.rpcUrl || DEFAULT_RPC.sepolia;
    this.contracts = {
      ansRegistry:    config.contracts?.ansRegistry    ?? null,
      axqToken:       config.contracts?.axqToken       ?? null,
      kpxRouter:      config.contracts?.kpxRouter      ?? null,
      vpxOracle:      config.contracts?.vpxOracle      ?? null,
      vrqValidator:   config.contracts?.vrqValidator   ?? null,
      ...config.contracts,
    };
  }

  /**
   * Resolve an ANS domain to an address.
   * @param {string} label  e.g. "alice"
   * @param {string} tld    e.g. "axq"
   * @returns {Promise<string>} resolved address
   */
  async resolveANS(label, tld) {
    if (!ANS_TLDS.includes(tld)) throw new Error(`Unsupported TLD: .${tld}`);
    if (!this.contracts.ansRegistry) throw new Error('ansRegistry address not configured');
    // TODO: call ANSRegistry.resolve(label, tld) via viem
    throw new Error('Not implemented — Phase 5');
  }

  /**
   * Get latest VPX oracle price for an asset.
   * @param {string} symbol  e.g. "ETH", "BTC", "AXQ"
   * @returns {Promise<{price: bigint, timestamp: bigint, roundId: bigint}>}
   */
  async getOraclePrice(symbol) {
    if (!this.contracts.vpxOracle) throw new Error('vpxOracle address not configured');
    // TODO: call VPXOracleFeed.getLatestPrice(bytes32(symbol)) via viem
    throw new Error('Not implemented — Phase 5');
  }

  /**
   * Estimate swap output for `amountIn` of `tokenIn` → `tokenOut`.
   * @returns {Promise<bigint>} estimated amountOut
   */
  async estimateSwap(tokenIn, tokenOut, amountIn) {
    if (!this.contracts.kpxRouter) throw new Error('kpxRouter address not configured');
    // TODO: call KPXRouterGateway quoting functions via viem
    throw new Error('Not implemented — Phase 5');
  }
}

module.exports = { AxioledgerSDK, ANS_TLDS, DEFAULT_RPC };
