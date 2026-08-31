# AXIOLEDGER ($AXQ)

<!-- BADGES -->
[![License: BSL-1.1](https://img.shields.io/badge/License-BSL--1.1-blue.svg)](LICENSE)
[![Status: Genesis v0.0.0](https://img.shields.io/badge/Status-Genesis%20v0.0.0-orange.svg)](#lộ-trình)
[![Token: $AXQ](https://img.shields.io/badge/Token-%24AXQ-gold.svg)](#tokenomics)
[![TPS: 600K+](https://img.shields.io/badge/TPS-600K%2B-brightgreen.svg)](#zk-obft--đồng-thuận-lai-ghép)
[![Consensus: ZK-OBFT](https://img.shields.io/badge/Consensus-ZK--OBFT-purple.svg)](#zk-obft--đồng-thuận-lai-ghép)

---

> **"AXIOLEDGER không cạnh tranh từng tính năng nhỏ lẻ — nó định hình lại toàn bộ cơ sở hạ tầng Web3 bằng Logic Toán học, Kỷ luật DevOps và Tôn chỉ Pháp luật."**

---

## Mục lục

1. [Executive Summary — Ba Trụ cột](#executive-summary--ba-trụ-cột)
2. [Pain Points & Giải pháp](#pain-points--giải-pháp)
3. [Kiến trúc 1 Hub & 4 Pillars](#kiến-trúc-1-hub--4-pillars)
4. [ZK-OBFT — Đồng thuận Lai ghép](#zk-obft--đồng-thuận-lai-ghép)
5. [Tokenomics — 10.000 Tỷ $AXQ](#tokenomics--10000-tỷ-axq)
6. [Lộ trình 4 Giai đoạn](#lộ-trình-4-giai-đoạn)
7. [Hội đồng Nguyên tắc (Grand Council)](#hội-đồng-nguyên-tắc-grand-council)
8. [8 Điều Bất Khả Xâm Phạm](#8-điều-bất-khả-xâm-phạm)
9. [Quick Start](#quick-start)
10. [Tài liệu & Design System](#tài-liệu--design-system)
11. [Đóng góp & Quy tắc Ứng xử](#đóng-góp--quy-tắc-ứng-xử)
12. [Bảo mật & Giấy phép](#bảo-mật--giấy-phép)

---

## Executive Summary — Ba Trụ cột

**AXIOLEDGER ($AXQ)** là hệ sinh thái blockchain thế hệ mới được kiến trúc trên ba nền tảng không thể tách rời, phối hợp như các trụ cột chịu lực của một công trình vĩnh cửu:

### 🔢 Trụ cột I — Logic Toán học

Quyền lực trong mạng lưới AXIOLEDGER không đến từ việc nắm giữ vốn đơn thuần. Mỗi Validator phải chứng minh đóng góp kỹ thuật thực tế — uptime, băng thông, tính trung thực — thông qua hàm Reputation VP ràng buộc toán học. Thuật toán đồng thuận **ZK-OBFT** nén hàng nghìn chữ ký thành một bằng chứng ZK-SNARKs 284 bytes, cho phép mọi node xác minh trong thời gian O(1) mà không cần trao đổi hàng triệu tin nhắn Gossip. Phương trình phát thải `Emission(t) = κ · ln(1 + ΔTVL_RWA) + μ · V(t) − B(t)` đảm bảo lạm phát **dừng tự động** khi không có vốn thực mới chảy vào — một đặc tính chưa từng có trong lịch sử tokenomics.

### ⚙️ Trụ cột II — Kỹ thuật DevOps

Tầng thực thi **SEQUENTICHAIN ($SQX)** đạt **600.000+ TPS** nhờ AF_XDP NIC Bypass — gói tin đi thẳng từ card mạng vào RAM, bỏ qua toàn bộ Linux network stack. State Database nằm hoàn toàn trên RAMDISK; NVMe chỉ lưu Ledger bất biến. Môi trường đa máy khách (Rust + C++) loại bỏ rủi ro điểm thất bại đơn lẻ mà Solana từng đối mặt. Toàn bộ hạ tầng vận hành theo chuẩn **PCI DSS Level 1**, phân quyền RBAC/IAM nghiêm ngặt trên phân vùng ảo cô lập `Q:\`.

### ⚖️ Trụ cột III — Tôn chỉ Pháp luật

**VERACIPHERS ($VRQ)** cung cấp **ZK-DID** — danh tính số ẩn danh cho 99,9% người dùng lương thiện, trong khi **Regulator Gateway** với hội đồng 5/7 multisig chữ ký kiểm toán độc lập cho phép giải mã *có điều kiện* khi cần thiết theo yêu cầu pháp lý. Supply Chain Scanner giám sát toàn bộ DApp và thư viện npm 24/7, ngăn chặn Typosquatting và tấn công chuỗi cung ứng ngay tại cấp Protocol — trước khi giao dịch được đóng khối. Tuân thủ đầy đủ **AML/KYC/FATF/MiCA/GDPR/ISO 27001**.

> Xem chi tiết: [`docs/AXIOLEDGER-OFFICIAL-CHARTER.md`](docs/AXIOLEDGER-OFFICIAL-CHARTER.md) · [`docs/Whitepaper AXIOLEDGER ($AXQ).md`](<docs/Whitepaper AXIOLEDGER ($AXQ).md>)

---

## Pain Points & Giải pháp

AXIOLEDGER được xây dựng từ quá trình rà soát và quét sâu (deep scan) những "nỗi đau" cốt lõi của hạ tầng Web3 và tài chính truyền thống hiện tại:

| Hệ thống Tiền nhiệm | Nỗi đau Cốt lõi | Giải pháp Kiến trúc AXIOLEDGER |
|---|---|---|
| **Ethereum (ETH)** | Phí gas biến động cực đoan; chờ 7 ngày finality trên Optimism L2; phân mảnh thanh khoản đa-L2 | ZK-Rollup Settlement finality < 3 phút; Volition DA lai ghép; Hub $AXQ hợp nhất thanh khoản |
| **Solana (SOL)** | Áp lực chi phí phần cứng Validator và phí bỏ phiếu cực cao; sập mạng do phụ thuộc single-client | RAMDISK I/O tối ưu; VPX Validator Subsidy Fund; đa máy khách Rust/C++ độc lập |
| **Arbitrum/OP Sequencer** | Sequencer tập trung — một điểm thất bại duy nhất kiểm soát thứ tự giao dịch; MEV toàn quyền | SVM Rollup phi tập trung — Leader được bầu qua ZK-OBFT trong mỗi Micro-epoch |
| **MetaMask** | Tấn công Typosquatting và Phishing qua extension giả mạo; đánh cắp Private Key qua browser | Supply Chain Scanner cấp Protocol — Validator Reject mã độc ngay khi đóng khối |
| **npm / Chuỗi cung ứng phần mềm** | Mã độc chèn vào thư viện phổ biến; developer bị tấn công mà không hay biết | VRQ Node quét toàn bộ DApp/npm 24/7 với AI dự đoán hành vi độc hại, không chỉ blacklist |
| **TradFi (Tài chính Truyền thống)** | Thanh toán quốc tế SWIFT mất 3–5 ngày; phí 3–7%; không minh bạch; giờ nghỉ cuối tuần | SEQUENTICHAIN xử lý 600K+ TPS, phí < $0.0001, finality dưới 3 phút, 24/7/365 |
| **Thị trường Web3 chung** | Mâu thuẫn cơ bản giữa ẩn danh Web3 và yêu cầu KYC/AML của chính phủ | ZK-DID + Regulator Gateway: Compliant Privacy — ẩn danh tuyệt đối cho người dùng lương thiện |

---

## Kiến trúc 1 Hub & 4 Pillars

AXIOLEDGER áp dụng thiết kế phân rã chức năng (Modular Architecture) — một Lõi Trung tâm điều phối 4 Trụ cột chuyên biệt không chồng lấn nhiệm vụ:

```
          ╔══════════════════════════════════════════════════════╗
          ║               AXIOLEDGER ($AXQ)                     ║
          ║           [ Tổ chức Quản trị Lõi / Hub ]            ║
          ║                                                      ║
          ║  • Sổ cái bất biến — Immutable Settlement Layer      ║
          ║  • Treasury DAO — quản trị on-chain 100%             ║
          ║  • ZK-Rollup Settlement từ tất cả 4 Pillars          ║
          ║  • Hậu lượng tử: Lattice-based cryptography (NIST)   ║
          ║  • Cơ chế phát thải neo giá trị tự động              ║
          ╚═══════════════════════════╦══════════════════════════╝
                                     ║
          ╔══════════════════════════╬══════════════════════════╗
          ║              ╔══════════╩═══════════╗              ║
          ▼              ▼                      ▼              ▼
╔═══════════════╗ ╔═══════════════╗ ╔════════════════╗ ╔═════════════════╗
║ VALIPRECISION ║ ║ SEQUENTICHAIN ║ ║ KINETOPROTOCOL ║ ║   VERACIPHERS   ║
║    ($VPX)     ║ ║    ($SQX)     ║ ║    ($KPX)      ║ ║     ($VRQ)      ║
╠═══════════════╣ ╠═══════════════╣ ╠════════════════╣ ╠═════════════════╣
║ Consensus &   ║ ║ High-Speed    ║ ║ DeFi Engine &  ║ ║ ZK-Security &   ║
║ Validation    ║ ║ L2 Execution  ║ ║ Liquidity      ║ ║ Compliance      ║
║               ║ ║               ║ ║                ║ ║                 ║
║ • Multi-      ║ ║ • SVM Rollup  ║ ║ • AMM Pool     ║ ║ • ZK-Proof      ║
║   client      ║ ║ • AF_XDP      ║ ║ • Cross-chain  ║ ║ • ZK-DID / KYC  ║
║   Rust + C++  ║ ║   NIC Bypass  ║ ║   Bridge       ║ ║ • Regulator     ║
║ • RAMDISK     ║ ║ • 600K+ TPS   ║ ║ • RWA          ║ ║   Gateway       ║
║   I/O opt     ║ ║ • ZK-Rollup   ║ ║   Treasury     ║ ║ • Supply Chain  ║
║ • NVMe        ║ ║   Settlement  ║ ║ • Dark Pool    ║ ║   Scanner       ║
║   partitioned ║ ║ • < 3 min     ║ ║ • LP Market    ║ ║ • Confidential  ║
║ • ZK-OBFT     ║ ║   Finality    ║ ║ • Auto Rebal.  ║ ║   Transfer      ║
║ • Slashing    ║ ║ • Batch TX    ║ ║ • Yield Engine ║ ║ • AML / FATF    ║
╚═══════════════╝ ╚═══════════════╝ ╚════════════════╝ ╚═════════════════╝
```

### Phân bổ Chức năng Theo Trụ cột

| Trụ cột | Mã Token | Chức năng Cốt lõi | Giải quyết Pain Point |
|---|---|---|---|
| **Hub** | `$AXQ` | Sổ cái quyết toán, Treasury DAO, Quản trị on-chain | Immutable Settlement, kháng lượng tử |
| **VALIPRECISION** | `$VPX` | Đồng thuận ZK-OBFT, quản lý Validator, RAMDISK | Áp lực phần cứng Solana, tập trung hóa |
| **SEQUENTICHAIN** | `$SQX` | L2 siêu tốc, SVM Rollup, AF_XDP, ZK-Settlement | Sequencer tập trung, độ trễ 7 ngày Optimism |
| **KINETOPROTOCOL** | `$KPX` | AMM Pool, Cross-chain Bridge, RWA Treasury, Dark Pool | Phân mảnh thanh khoản, Front-running thể chế |
| **VERACIPHERS** | `$VRQ` | ZK-DID, KYC/AML, Supply Chain Scanner, Regulator Gateway | Ẩn danh vs Tuân thủ, Typosquatting MetaMask |

---

## ZK-OBFT — Đồng thuận Lai ghép

Thay vì PoS thuần túy (tạo ra nền tài phiệt token) hoặc pBFT truyền thống (chậm, không mở rộng được), AXIOLEDGER đề xuất hệ thống đồng thuận lai ghép độc quyền tại lớp `$VPX`: **Zero-Knowledge Optimized Byzantine Fault Tolerance (ZK-OBFT)**.

### Phương trình Trọng số Bỏ phiếu (Reputation-based VP)

Quyền lực mạng lưới bị ràng buộc bởi đóng góp kỹ thuật thực tế, không phải vốn đơn thuần:

```
VP_i(t) = S_i(t) × R_i(t)

Trong đó:
  VP_i(t)  = Quyền biểu quyết của Validator i tại thời điểm t
  S_i(t)   = Số lượng token $VPX đã khóa (staked)
  R_i(t)   = α · U_i(t) + β · ln(1 + γ · B_i(t))
  U_i(t)   = Tỷ lệ Uptime — phạt theo hàm mũ nếu node offline
  B_i(t)   = Băng thông thực tế đóng góp cho mạng lưới
               (hàm ln triệt tiêu độc quyền phần cứng siêu cao cấp)
  α, β, γ  = Hệ số điều chỉnh bởi Treasury DAO theo từng epoch
```

**Tại sao điều này quan trọng:** Một thực thể dù nắm giữ 30% tổng $VPX cũng **không thể** chi phối mạng lưới nếu uptime thấp hoặc băng thông kém. Quyền lực sẽ tự động phân tán về các node thực sự phục vụ cộng đồng.

### Nén Chữ ký bằng ZK-SNARKs

Thay vì hàng trăm triệu tin nhắn Gossip khi mạng có hàng nghìn node:

1. **Leader** gom hàng nghìn chữ ký đa hình (Multi-signatures) trong một Micro-epoch
2. **ZK-Circuit** kiểm tra điều kiện đồng thuận: `∑VP_voters > 2/3 × ∑VP_total`
3. **Bằng chứng π** siêu nhẹ (~284 bytes) được xuất ra — mọi node xác minh trong O(1)

**Kết quả:** Giảm 99% tải Gossip network so với pBFT truyền thống. Finality < 3 phút.

### Instant Slashing — Đao Phủ Thuật Toán

Bất kỳ hành vi ký đúp (Double-signing) bị phát hiện đều kích hoạt chuỗi trừng phạt tức thì:

```rust
// AXIOLEDGER VPX — Instant Slashing (Rust pseudocode)
// Tài liệu tham chiếu: docs/AXIOLEDGER-OFFICIAL-CHARTER.md §3.3

pub fn execute_instant_slash(
    ctx: Context<SlashValidator>,
    evidence: DoubleSignEvidence,
) -> Result<()> {
    // Bước 1: Xác minh bằng chứng double-signing on-chain
    require!(
        verify_double_sign_proof(&evidence),
        AxioError::InvalidSlashEvidence
    );

    let validator = &mut ctx.accounts.validator_state;
    let vault     = &mut ctx.accounts.vpx_stake_vault;

    // Bước 2: Đốt 100% token $VPX bị khóa — trong cùng block, không có giai đoạn thử thách
    let slash_amount = vault.locked_vpx;
    vault.locked_vpx = 0;
    token::burn(ctx.accounts.into_burn_context(), slash_amount)?;

    // Bước 3: Reset chỉ số Uy tín về 0 vĩnh viễn
    validator.reputation_score = 0;
    validator.voting_power     = 0;

    // Bước 4: Đánh dấu loại khỏi tập Validator — không thể khôi phục
    validator.status = ValidatorStatus::PermanentlyBanned;

    // Bước 5: Phát sự kiện on-chain để toàn mạng ghi nhận
    emit!(InstantSlashEvent {
        validator:    validator.pubkey,
        slashed_vpx:  slash_amount,
        block_height: Clock::get()?.slot,
        reason:       SlashReason::DoubleSigning,
    });

    Ok(())
}
```

> Không có thời gian thử thách. Không có kháng cáo. Không có ngoại lệ.
> Đây là tôn chỉ bất biến — Liveness và Safety của mạng lưới được đặt trên mọi lợi ích cá nhân.

### Kháng DDoS Toán học

Khi kẻ thù tấn công và làm sập 33% node lớn nhất:
- `U_i` của node bị tấn công lao dốc → `VP_i` bốc hơi theo hàm mũ trong một Micro-epoch
- Các node sống sót tái chiếm > 2/3 tổng VP mới một cách tự động
- Mạng **tự chữa lành trong vài giây** — Liveness và Safety được bảo toàn

### Kháng Lượng tử (Post-Quantum)

Tích hợp song song ZK-SNARKs và **Post-Quantum Signatures** (chuẩn NIST Level 5 — Lattice-based CRYSTALS-Dilithium). 10.000 tỷ token $AXQ vĩnh viễn không thể bị in khống bởi máy tính lượng tử thế hệ tương lai.

---

## Tokenomics — 10.000 Tỷ $AXQ

> *"Đừng để 10.000 tỷ token trở thành gánh nặng, hãy biến nó thành một lỗ đen hấp thụ giá trị."*
> — Thống đốc Ngân hàng Trung ương, Hội nghị Thượng đỉnh Diên Hồng Kỹ thuật số

**Tổng cung tối đa:** `10,000,000,000,000 $AXQ` — không thể thay đổi, được mã hóa vào Genesis Block.

### Phân bổ Nguồn cung

| Nhóm Phân bổ | Tỷ lệ | Số lượng Tuyệt đối | Cơ chế Khóa & Mục đích |
|---|---|---|---|
| **Thanh khoản RWA & Dự trữ Thể chế** | **30%** | 3,000,000,000,000 | Mỏ neo thanh khoản trên KPX. Tài sản đối ứng khi ngân hàng token hóa trái phiếu, chứng chỉ tiền gửi, nợ chính phủ |
| **Validator & Khai thác $VPX** | **25%** | 2,500,000,000,000 | Khóa Smart Contract, trả thưởng theo thuật toán suy giảm logarit trong **50 năm** |
| **Treasury DAO & Hàng hóa Công cộng** | **20%** | 2,000,000,000,000 | Quản trị on-chain 100% — tài trợ RetroPGF cho nhà phát triển hệ sinh thái và mã nguồn mở |
| **Cộng đồng & Airdrop** | **15%** | 1,500,000,000,000 | Người dùng sớm, chiến dịch mở rộng mạng lưới, thanh khoản khởi tạo |
| **Đội ngũ Cốt lõi & Đối tác** | **10%** | 1,000,000,000,000 | Vesting cliff **5 năm** — lợi ích dài hạn gắn chặt với sự sống còn của mạng lưới |

### Phương trình Phát thải Neo Giá trị (Value-Pegged Emission)

```
Emission(t) = κ · ln(1 + ΔTVL_RWA) + μ · TransactionVolume(t) − Burn(t)

Nếu ΔTVL_RWA = 0:   ln(1 + 0) = 0
→ Lạm phát từ phân mảng RWA DỪ TỰ ĐỘNG — không cần bỏ phiếu quản trị.

Các hệ số κ, μ được tự động điều chỉnh bởi AI của Treasury DAO theo từng epoch.
```

### Động cơ Đốt Thuật toán (Deflationary Engine)

| Cơ chế | Mô tả Chi tiết | Tỷ lệ Đốt |
|---|---|---|
| **Gas Burn** | 70% phí giao dịch cơ sở trên SEQUENTICHAIN bị đốt vĩnh viễn mỗi block | **70% phí cơ sở** |
| **RWA Yield Buyback** | Smart Contract trích 10% lợi nhuận từ RWA Treasury để mua lại $AXQ trên thị trường mở và thiêu hủy | **10% lợi nhuận RWA** |
| **Instant Slashing** | Token $VPX của Validator vi phạm double-signing bị đốt 100% trong cùng block | **100% bị phạt** |
| **ZK-Privacy Tax** | Mọi Confidential Transfer tại VRQ đốt một khoản $AXQ cố định theo khối lượng giao dịch | Phí biến động |
| **RWA Collateral Lock** | Định chế phát hành RWA on-chain phải khóa 15% $AXQ làm bảo chứng rủi ro dài hạn | Khóa vĩnh viễn |

### Phương trình Giảm phát Trạng thái

```
S(t) = S₀ + ∫₀ᵗ (M(x) − B(x)) dx

Trong đó:
  S₀   = Cung lưu hành ban đầu tại TGE (10% = 1.000 tỷ $AXQ)
  M(x) = Tốc độ đúc token thưởng Validator (hàm suy giảm logarit)
  B(x) = Tốc độ đốt từ Gas + RWA Yield Buyback + Slashing + Privacy Tax

Điểm bùng phát dự kiến (Năm 3):  B(x) > M(x)
→ $AXQ chính thức bước vào trạng thái GIẢM PHÁT VĨNH VIỄN
```

---

## Lộ trình 4 Giai đoạn

> Mỗi giai đoạn chỉ được khởi động khi và chỉ khi tất cả **Gate Conditions** của giai đoạn trước được xác minh on-chain.

### ⚡ Giai đoạn 1 — Khởi tạo Hạt nhân & Đồng thuận (Tháng 1–6)

**Trọng tâm:** `$AXQ Hub` + `VALIPRECISION ($VPX)`

- [ ] Triển khai Hub `$AXQ` — Sổ cái bất biến, Treasury DAO, không admin key
- [ ] Mã hóa luật lạm phát và phương trình phát thải vào Genesis Block
- [ ] Triển khai cơ chế đồng thuận ZK-OBFT — VP = S × R, ZK-SNARKs circuit
- [ ] Cấu hình RAMDISK + NVMe partitioned cho tất cả node $VPX
- [ ] Mở VPX Subsidy Fund — hỗ trợ chi phí phần cứng cho Validator độc lập
- [ ] Vận hành song song client Rust và C++ — loại bỏ single-client risk
- [ ] Kiểm tra bảo mật: Instant Slashing, kháng DDoS toán học, kháng lượng tử

**🔒 Gate Condition G1:** `5.000 Validator độc lập đang hoạt động` + `Nakamoto Coefficient > 100`

---

### 🚀 Giai đoạn 2 — Lớp Thực thi Siêu tốc (Tháng 7–12)

**Trọng tâm:** `SEQUENTICHAIN ($SQX)`

- [ ] Tích hợp AF_XDP NIC Bypass — kernel-level, bypass Linux network stack hoàn toàn
- [ ] Triển khai SVM Rollup — máy ảo Solana trên môi trường Rollup, xử lý song song
- [ ] Kích hoạt ZK Settlement — hàng triệu TX trên SQX → 1 ZK proof → Hub $AXQ
- [ ] Kiểm tra Batch Transaction — Approve + Transfer thành 1 lệnh nguyên tử
- [ ] Testnet public với tải thực tế từ cộng đồng

**🔒 Gate Condition G2:** `Testnet đạt 600.000+ TPS` + `Finality < 3 phút` + `Zero chain halt trong 30 ngày liên tiếp`

---

### 🏦 Giai đoạn 3 — Thanh khoản & Dòng vốn Thể chế (Năm 2)

**Trọng tâm:** `KINETOPROTOCOL ($KPX)` + `RWA Treasury`

- [ ] Triển khai Cross-chain Bridge phi tập trung — hút thanh khoản từ ETH/ARB/SOL
- [ ] Ra mắt RWA Treasury — token hóa Trái phiếu, Chứng chỉ tiền gửi, Nợ Chính phủ
- [ ] Khai trương AXIO Dark Pool — hồ bơi thanh khoản ẩn cho Block Trades thể chế
- [ ] Tích hợp AMM Pool với Anti-slippage routing tự động
- [ ] Ký kết đối tác với ít nhất 3 ngân hàng/quỹ đầu tư quốc tế

**🔒 Gate Condition G3:** `TVL ≥ $10 Tỷ USD` + `≥ 3 ngân hàng/quỹ ký kết chính thức` + `Smart contract audit sạch 100%`

---

### 🛡️ Giai đoạn 4 — Bảo mật ZK, Định danh & UX Đại Chúng (Năm 3)

**Trọng tâm:** `VERACIPHERS ($VRQ)` + `AXIO Vault`

- [ ] Ra mắt ZK-DID — danh tính số ẩn danh, xác thực định chế không phơi bày dữ liệu
- [ ] Kích hoạt Regulator Gateway — Compliance Key 5/7 multisig, hội đồng kiểm toán độc lập
- [ ] Triển khai AXIO Vault Wallet — Gasless, không seed phrase, Native Account Abstraction
- [ ] Tích hợp Social Recovery (FaceID / 3 Guardian)
- [ ] Vận hành Supply Chain Scanner toàn thời gian với AI dự đoán mã độc
- [ ] Mainnet launch — mở cửa cho người dùng đại chúng toàn cầu

**🔒 Gate Condition G4:** `100 triệu ví kích hoạt` + `Zero hack do lộ Private Key` + `Điểm giảm phát B(x) > M(x) xác nhận on-chain`

---

## Hội đồng Nguyên tắc (Grand Council)

AXIOLEDGER không tồn tại trong chân không. Nó được truyền cảm hứng và định hướng bởi những di sản trí tuệ vĩ đại nhất của lịch sử công nghệ tài chính phi tập trung. **Grand Council** là hội đồng nguyên tắc hư cấu — không phải cố vấn pháp lý — đại diện cho các giá trị nền tảng mà AXIOLEDGER cam kết kế thừa và phát triển:

| Cố vấn Nguyên tắc | Di sản Đóng góp | Nguyên tắc Kế thừa trong AXIOLEDGER |
|---|---|---|
| **Satoshi Nakamoto** — Bitcoin | Chứng minh rằng một hệ thống tài chính không cần ngân hàng trung ương là khả thi về mặt toán học và thực tiễn. Sổ cái bất biến, không có admin key, kiểm duyệt bất khả | Treasury DAO không có admin key. Hub $AXQ là sổ cái bất biến. Không một thực thể nào — kể cả team sáng lập — có thể đảo ngược giao dịch đã finalize |
| **Vitalik Buterin** — Ethereum | Mở rộng Bitcoin thành máy tính trạng thái toàn cầu. Smart contract, turing-complete VM, nền tảng cho toàn bộ DeFi/NFT/DAO. Tầm nhìn về scalability trilemma | AXIOLEDGER giải quyết bộ ba bất khả thi bằng ZK-OBFT + SVM Rollup + modular architecture. Kế thừa tương thích EVM/SVM, không yêu cầu viết lại DApp |
| **Anatoly Yakovenko** — Solana | Phá vỡ giới hạn TPS bằng Proof of History và xử lý song song. Chứng minh rằng blockchain có thể cạnh tranh tốc độ với hệ thống tập trung | 600K+ TPS kế thừa từ SVM architecture và bài học từ những lần sập mạng Solana. AXIOLEDGER thêm RAMDISK, đa client, và ZK-OBFT để loại bỏ điểm thất bại đơn lẻ |
| **Gavin Wood** — Polkadot | Phát minh Substrate, Parachains và mô hình interoperability giữa các blockchain chuyên biệt. Tầm nhìn về Web3 như một internet phi tập trung thực sự | Mô hình 1 Hub & 4 Pillars chuyên biệt kế thừa trực tiếp từ triết học Relay Chain & Parachain. Mỗi Pillar là một môi trường chuyên dụng, Hub $AXQ là lớp settlement cuối cùng |
| **Phong trào Cypherpunk** — 1980s–1990s | "Privacy is necessary for an open society in the electronic age." Mật mã học là vũ khí bảo vệ quyền tự do cá nhân khỏi sự kiểm soát của tập đoàn và nhà nước | ZK-DID đảm bảo 99,9% người dùng lương thiện vĩnh viễn ẩn danh. Confidential Transfer ẩn số dư bằng ZK-Proofs. Chỉ Regulator Gateway với 5/7 multisig mới có thể yêu cầu giải mã có điều kiện |

---

## 8 Điều Bất Khả Xâm Phạm

Tám nguyên tắc sau đây được mã hóa vào Genesis Block và **không thể bị bỏ phiếu bãi bỏ** bởi bất kỳ phần trăm quản trị DAO nào — dù đạt 99% đồng thuận. Chúng là DNA không thể thay đổi của AXIOLEDGER:

> **Điều I — Tính Bất biến Tuyệt đối**
> Không một giao dịch đã được finalize trên Hub $AXQ nào có thể bị đảo ngược, xóa bỏ, hoặc chỉnh sửa bởi bất kỳ thực thể nào — kể cả đội ngũ sáng lập, chính phủ, hay đa số tuyệt đối của DAO.

> **Điều II — Không Có Admin Key**
> Không tồn tại bất kỳ private key quản trị đặc quyền nào có thể mint token ngoài phương trình phát thải đã được mã hóa, hoặc thay đổi tham số cốt lõi ngoài quy trình quản trị on-chain.

> **Điều III — Nakamoto Coefficient Tối thiểu**
> Hệ số Nakamoto của mạng lưới phải duy trì ≥ 100 node độc lập. Nếu hệ số này rơi xuống dưới ngưỡng, giao thức tự động kích hoạt VPX Subsidy Emergency Fund để thu hút Validator mới.

> **Điều IV — Không Có Thị trường Đen Quyền Bỏ phiếu**
> Việc chuyển nhượng, bán, hoặc ủy quyền Voting Power `VP_i` ngoài cơ chế delegation on-chain chính thức là hành vi bị coi là gian lận và kích hoạt Instant Slashing tự động.

> **Điều V — Privacy là Mặc định**
> Mọi người dùng đều được bảo vệ bởi ZK-DID mặc định. Không có bất kỳ tính năng nào của giao thức yêu cầu phơi bày danh tính trừ khi người dùng chủ động lựa chọn hoặc có lệnh từ Regulator Gateway hợp lệ.

> **Điều VI — Nguồn Mở Vĩnh Viễn**
> Toàn bộ mã nguồn lõi của AXIOLEDGER — bao gồm consensus engine, ZK circuits, và smart contract cốt lõi — sẽ luôn công khai và kiểm tra được. Không có "black box" trong hạ tầng tài chính mang tính hạ tầng công cộng.

> **Điều VII — Phí Giao dịch Tối đa**
> Phí giao dịch cơ sở trên SEQUENTICHAIN không bao giờ vượt quá `$0.001 USD` quy đổi. Mọi đề xuất quản trị vi phạm điều này bị từ chối tự động ở cấp giao thức.

> **Điều VIII — Chủ quyền Cộng đồng**
> Treasury DAO nắm giữ 20% tổng cung. Không có đội ngũ sáng lập, nhà đầu tư, hay liên minh nào — dù nắm giữ bao nhiêu token — có thể đơn phương chuyển hoặc sử dụng khoản này mà không có đa số quản trị cộng đồng hợp lệ.

---

## Quick Start

### 1. Cài đặt AXIO SDK

```bash
# Cài đặt AXIO SDK qua npm
npm install @axioledger/sdk

# Hoặc dùng yarn
yarn add @axioledger/sdk

# Hoặc dùng pnpm
pnpm add @axioledger/sdk
```

### 2. Khởi chạy Validator Node ($VPX)

```bash
# Clone repository
git clone https://github.com/axioledger/axioledger-node.git
cd axioledger-node

# Cài đặt dependencies (yêu cầu Rust 1.78+ và cargo)
cargo build --release --features vpx-validator

# Cấu hình RAMDISK cho State Database (Linux — yêu cầu root)
sudo mkdir -p /mnt/axio-state
sudo mount -t tmpfs -o size=32G tmpfs /mnt/axio-state

# Cấu hình NVMe cho Ledger storage
export AXIO_STATE_DIR=/mnt/axio-state
export AXIO_LEDGER_DIR=/mnt/nvme/axio-ledger

# Khởi tạo identity key cho Validator
./target/release/axio-validator init-identity \
  --keypair ~/.config/axio/validator-identity.json \
  --network mainnet-genesis

# Chạy Validator node với ZK-OBFT
./target/release/axio-validator run \
  --identity ~/.config/axio/validator-identity.json \
  --vote-account ~/.config/axio/vote-account.json \
  --ledger $AXIO_LEDGER_DIR \
  --state $AXIO_STATE_DIR \
  --rpc-port 8899 \
  --entrypoint bootstrap.mainnet.axioledger.io:8001
```

### 3. AXIO Vault — TypeScript SDK Snippet

```typescript
import { AxioVault, Network, TransferMode } from '@axioledger/sdk';

// Khởi tạo AXIO Vault — không cần seed phrase
const vault = await AxioVault.connect({
  network: Network.MAINNET,
  auth:    { type: 'webauthn', rpId: 'yourapp.io' }, // FaceID / TouchID
});

// Kiểm tra số dư (Confidential Transfer — ẩn danh bởi ZK-Proof)
const balance = await vault.getBalance({
  token:  'AXQ',
  mode:   TransferMode.CONFIDENTIAL, // VRQ ZK-DID Privacy
});
console.log(`Số dư: ${balance.display}`); // Giá trị thực được mã hóa ZK

// Giao dịch Gasless — phí trả bằng USDC qua Paymaster
const tx = await vault.transfer({
  to:        'RECIPIENT_ADDRESS',
  amount:    '1000',
  token:     'AXQ',
  gasToken:  'USDC', // Paymaster tự động convert
  mode:      TransferMode.CONFIDENTIAL,
});

// Chờ finality trên SEQUENTICHAIN (< 3 phút)
const receipt = await tx.waitForFinality();
console.log(`Giao dịch đã được chốt sổ tại block: ${receipt.blockHeight}`);
console.log(`ZK Proof hash: ${receipt.zkProofHash}`);

// Institutional: Multi-sig transaction
const institutionalTx = await vault.createMultiSigProposal({
  to:         'TREASURY_ADDRESS',
  amount:     '50000000',
  token:      'AXQ',
  requiredSigs: 3,           // Cần 3/5 chữ ký phê duyệt
  signers:    BOARD_MEMBERS, // Địa chỉ ví của hội đồng
  expiry:     '24h',
});

console.log(`Proposal ID: ${institutionalTx.proposalId}`);
// Giao dịch sẽ tự động thực thi khi đủ 3 chữ ký
```

---

## Tài liệu & Design System

### Tài liệu Kỹ thuật Chính thức

| Tài liệu | Mô tả |
|---|---|
| [`docs/AXIOLEDGER-OFFICIAL-CHARTER.md`](docs/AXIOLEDGER-OFFICIAL-CHARTER.md) | Điều lệ chính thức v2.0 — Genesis Pact Edition. Kiến trúc đầy đủ, RACI Matrix, vai trò và quyền hạn các trụ cột |
| [`docs/Whitepaper AXIOLEDGER ($AXQ).md`](<docs/Whitepaper AXIOLEDGER ($AXQ).md>) | Sách Trắng kỹ thuật v2.0 — Bản đệ trình chính phủ và định chế tài chính toàn cầu |
| [`design-system/README.md`](design-system/README.md) | Hệ thống thiết kế AXIO — Design Tokens, Component Library, Accessibility Guidelines |

### Design System & Assets

| Thư mục | Nội dung |
|---|---|
| [`design-system/tokens/`](design-system/tokens/) | Design Tokens JSON — màu sắc, typography, spacing cho toàn bộ hệ sinh thái AXIO |
| [`design-system/components/`](design-system/components/) | Component Library — AXIO Vault UI, Dashboard, KYC Flow, Institutional Portal |
| [`design-system/guidelines/`](design-system/guidelines/) | Accessibility (WCAG 2.1 AA), Brand Guidelines, Dark Pattern Prohibition |
| [`asset/icon/linear/`](asset/icon/linear/) | Icon set dạng Linear (outline) — SVG chuẩn, pixel-perfect tại 24px |
| [`asset/icon/bold/`](asset/icon/bold/) | Icon set dạng Bold (filled) — SVG chuẩn, cho trạng thái active/selected |

> **Lưu ý cho Contributors:** Mọi Pull Request liên quan đến giao diện **phải** sử dụng đúng icon từ [`asset/icon/`](asset/icon/) và tuân thủ Design Tokens tại [`design-system/tokens/`](design-system/tokens/). Không dùng icon từ nguồn ngoài. Không hardcode giá trị màu sắc. Xem [`design-system/README.md`](design-system/README.md) để biết hướng dẫn đầy đủ.

---

## Đóng góp & Quy tắc Ứng xử

AXIOLEDGER là mã nguồn mở theo cam kết bất khả xâm phạm **Điều VI**. Mọi đóng góp đều được chào đón — từ báo cáo lỗi, cải tiến tài liệu, đến xây dựng tính năng mới.

### Quy trình Đóng góp

1. **Fork** repository và tạo branch từ `develop`
2. Đảm bảo code pass toàn bộ tests: `cargo test --all` (Rust) / `npm test` (TypeScript)
3. Chạy lint: `cargo clippy -- -D warnings` và `eslint . --ext .ts,.tsx`
4. Tạo Pull Request với mô tả rõ ràng về thay đổi và lý do
5. Đợi review từ ít nhất 2 core maintainer

### Tài liệu Cộng đồng

| Tài liệu | Mô tả |
|---|---|
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Hướng dẫn đóng góp đầy đủ — coding standards, commit convention, PR template |
| [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) | Quy tắc ứng xử cộng đồng — dựa trên Contributor Covenant v2.1 |

### Báo cáo Lỗi & Đề xuất

- **Bug report:** Mở [GitHub Issue](https://github.com/axioledger/axioledger/issues) với template `bug_report`
- **Feature request:** Mở [GitHub Discussion](https://github.com/axioledger/axioledger/discussions) với category `Ideas`
- **Governance proposal:** Đề xuất on-chain thông qua Treasury DAO — xem [`docs/AXIOLEDGER-OFFICIAL-CHARTER.md`](docs/AXIOLEDGER-OFFICIAL-CHARTER.md) §6

---

## Bảo mật & Giấy phép

### Bảo mật

AXIOLEDGER áp dụng chính sách **Responsible Disclosure**. Nếu bạn phát hiện lỗ hổng bảo mật:

- **KHÔNG** mở public GitHub Issue cho các vấn đề bảo mật nghiêm trọng
- Gửi báo cáo riêng tư đến email bảo mật hoặc qua [`SECURITY.md`](SECURITY.md)
- Bug Bounty Program: Lỗ hổng Critical được thưởng từ Treasury DAO — mức thưởng tương ứng mức độ nghiêm trọng

| Tài liệu | Nội dung |
|---|---|
| [`SECURITY.md`](SECURITY.md) | Chính sách bảo mật, quy trình Responsible Disclosure, Bug Bounty Program |

### Giấy phép

```
AXIOLEDGER ($AXQ) — Core Infrastructure
Copyright (c) AXIOLEDGER Foundation

Licensed under the Business Source License 1.1 (BSL-1.1).

Phần mềm này có thể được sử dụng tự do cho mục đích phi thương mại,
nghiên cứu, và đóng góp vào hệ sinh thái AXIOLEDGER. Sử dụng thương mại
trực tiếp cạnh tranh với dịch vụ AXIOLEDGER yêu cầu giấy phép thương mại.

Sau ngày Change Date (4 năm kể từ ngày phát hành từng phiên bản),
phần mềm được tự động chuyển sang giấy phép Apache 2.0.

Xem chi tiết tại: LICENSE
```

| Tài liệu | Nội dung |
|---|---|
| [`LICENSE`](LICENSE) | Nội dung đầy đủ BSL-1.1, Change Date, và điều khoản sử dụng |

---

### KPI Cốt lõi — Mục tiêu Mạng lưới

| Chỉ số | Mục tiêu |
|---|---|
| Thông lượng (SEQUENTICHAIN) | **600.000+ TPS** |
| Thời gian Chốt sổ (Finality) | **< 3 phút** |
| Hệ số Nakamoto | **> 100** |
| Số lượng Validator | **5.000+** |
| Tổng Thanh khoản (TVL) | **$10 Tỷ USD** (Giai đoạn 3) |
| Người dùng Ví AXIO Vault | **100 Triệu** (Giai đoạn 4) |
| Điểm Bùng phát Giảm phát | **Năm 3** — B(x) > M(x) vĩnh viễn |
| Phí Giao dịch Tối đa | **< $0.001 USD** |

---

<div align="center">

**AXIOLEDGER ($AXQ)** — Quốc gia Kỹ thuật số Phi biên giới

*Hạ tầng Tài chính Cốt lõi của Internet Thế hệ Mới*

[`docs/`](docs/) · [`design-system/`](design-system/) · [`CONTRIBUTING.md`](CONTRIBUTING.md) · [`SECURITY.md`](SECURITY.md) · [`LICENSE`](LICENSE)

</div>
