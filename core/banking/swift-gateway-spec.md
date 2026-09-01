# SWIFT → AXIOLEDGER KPX Gateway — Integration Spec v0.0.0

> **Phạm vi:** Tích hợp SWIFT gpi + ISO-20022 (pacs.008 / MT103) vào KINETOPROTOCOL ($KPX)  
> **Trigger:** Giai đoạn 3 — v1.1.0 (H2 2028) — sau khi RWA Treasury deploy  
> **Trạng thái:** SDK installed, architecture spec done. Implementation pending.

---

## Kiến Trúc Tổng Thể

```
[SWIFT Network / Correspondent Bank]
         │
         │ MT103 / pacs.008 (ISO-20022) over HTTPS/mTLS
         ▼
[SWIFT Microgateway — /mnt/q/core/banking/swift-gateway/mgw/]
  • Proxy layer: SWIFT Network ↔ Internal API
  • TLS termination + OAuth2 token management
  • Log tất cả inbound/outbound messages
         │
         │ REST + SWIFT Security SDK (OAuth Bearer + mTLS)
         ▼
[AXIO Banking Translator Service — Spring Boot]
  Package: com.axioledger.banking.translator
  Libs:    swift-messaging-sdk.jar + swift-security-sdk.jar
  Role:    Parse ISO-20022 → validate → emit KPX event
         │
         ├── MT103 / pacs.008 → RWA Deposit instruction
         ├── MT202 / camt.056 → Cross-chain Bridge trigger
         └── MT950 / camt.053 → Balance reconciliation
         │
         ▼
[AXIOLEDGER KPX Router Gateway — KPXRouterGateway.sol]
  ZK-Proof (from VRQ) + KYC commitment ← linked to SWIFT sender BIC
  depositRWA() ← triggered by pacs.008 credit notification
  bridgeOut()  ← triggered by MT202 institutional transfer
```

---

## Message Flow: pacs.008 → RWA Token Mint

```
1. Correspondent Bank sends pacs.008 (Credit Transfer) via SWIFT gpi
2. SWIFT MGW receives, validates HMAC signature, logs uetr (tracking ID)
3. Translator Service:
   a. Parse pacs.008 → extract: uetr, amount, currency, creditor BIC, debtorAgent
   b. Call VRQ KYC API: verifyCompliance(senderBIC, kycCommitment)
   c. Build ZK-proof request to VERACIPHERS
   d. Call KPXRouterGateway.depositRWA(assetId, amount, axqCollateral, zkProof)
4. KPX mints RWA Token on-chain
5. Translator emits ISO-20022 confirmation (camt.054) back via MGW
```

---

## Cấu Hình MGW (`config-swift-sdk.yaml`)

```yaml
# /mnt/q/core/banking/swift-gateway/config/config-swift-sdk.yaml
# KHÔNG COMMIT file này — chứa credentials

swift:
  connectivity:
    environment: sandbox    # sandbox | live
    bic8: "AXIQBEB0"       # AXIOLEDGER BIC (placeholder — cần đăng ký SWIFT)
    endpoint: "https://sandbox.swift.com/oauth2/v1"

  auth:
    type: oauth2
    client_id: "${SWIFT_CLIENT_ID}"       # Từ SWIFT Developer Portal
    client_secret: "${SWIFT_CLIENT_SECRET}"
    cert_path: "/mnt/q/core/banking/swift-gateway/keys/client.crt"
    key_path:  "/mnt/q/core/banking/swift-gateway/keys/client.key"
    ca_path:   "/mnt/q/core/banking/swift-gateway/keys/swift-ca.crt"

  mgw:
    host: "127.0.0.1"
    port: 8443
    api_key: "${SWIFT_MGW_API_KEY}"

axioledger:
  kpx_router: "0x_KPX_ROUTER_ADDRESS"    # KPXRouterGateway.sol address
  vrq_api:    "https://api.axioledger.axq/vrq/"
  rpc_url:    "https://rpc.axq/"
  min_axq_collateral_pct: 15             # 15% AXQ collateral for RWA
```

---

## Spring Boot Translator Service — Skeleton

```java
// Package: com.axioledger.banking.translator
// File: SwiftMessageTranslator.java
// Phase: v0.0.0 skeleton — implementation in v1.1.0

@Service
@Slf4j
public class SwiftMessageTranslator {

    private final SwiftSDKClient swiftClient;         // swift-sdk-openapi.jar
    private final SwiftSecuritySDK securitySDK;       // swift-security-sdk.jar
    private final KPXRouterClient kpxRouter;          // KPXRouterGateway.sol wrapper
    private final VRQComplianceClient vrqClient;      // VERACIPHERS VRQ API

    /**
     * Process incoming pacs.008 (FI Credit Transfer Initiation)
     * ISO-20022 → RWA Token Mint on KPX
     */
    @EventListener
    public void onPacs008Received(Pacs008Event event) {
        String uetr = event.getUetr();
        log.info("[SWIFT] pacs.008 received: uetr={}", uetr);

        // 1. Validate SWIFT message signature
        securitySDK.verifyMessageSignature(event.getRawMessage());

        // 2. Extract settlement details
        String senderBIC  = event.getDebtorAgent().getBic();
        BigDecimal amount = event.getInterbankSettlementAmount();
        String currency   = event.getInterbankSettlementDate().getCurrency();

        // 3. ZK compliance check via VERACIPHERS
        ZKProof zkProof = vrqClient.getComplianceProof(senderBIC, amount, currency);
        if (!zkProof.isValid()) {
            log.warn("[SWIFT] Compliance failed for BIC: {}", senderBIC);
            sendSwiftNack(uetr, "AML/KYC_FAILED");
            return;
        }

        // 4. Mint RWA Token on KPX
        String assetId = "SWIFT_" + uetr;
        BigInteger axqCollateral = calculateAXQCollateral(amount, 15); // 15%
        TransactionReceipt receipt = kpxRouter.depositRWA(
            assetId, amount, axqCollateral,
            zkProof.getBytes(), zkProof.getPubInputs()
        );

        log.info("[KPX] RWA minted: assetId={} txHash={}", assetId, receipt.getTxHash());

        // 5. Send ISO-20022 confirmation back
        sendSwiftAck(uetr, receipt.getTxHash());
    }
}
```

---

## OAS Specs Có Sẵn (từ SDK)

| File | Mô tả |
|---|---|
| `oas/internal/SWIFT-API-mgw-configuration-api-2.0.0-swagger.json` | MGW config API |
| `oas/internal/SWIFT-API-mgw-management-api-1.0.4-swagger.json` | MGW management |
| `oas/internal/SWIFT-API-mgw-monitoring-api-1.0.0-swagger.json` | MGW monitoring |
| `security/sample/oas/SWIFT-API-session-1.0.3-resolved.yaml` | OAuth session |
| `security/sample/oas/SWIFT-API-gpi-transaction-details-devportal-5.0.5-resolved.yaml` | GPI Tracker |

---

## Lộ Trình Tích Hợp

| Giai đoạn | Version | Milestone |
|---|---|---|
| **Install** | v0.0.0 ✅ | SDK extracted tại `/mnt/q/core/banking/` |
| **Config** | v0.1.0 | Đăng ký SWIFT Developer Portal, lấy BIC8, setup sandbox |
| **Auth** | v0.2.0 | OAuth2 + mTLS handshake với SWIFT Sandbox thành công |
| **Parse** | v0.3.0 | Parse pacs.008/MT103 → Java POJO thành công |
| **Bridge** | v1.0.0 | VRQ compliance check + KPX depositRWA() trên Testnet |
| **Live** | v1.1.0 | Mainnet — H2 2028 (Gate G3: TVL ≥ $10B) |

---

*AXIOLEDGER SWIFT Integration Spec v0.0.0 — Genesis Pact Edition*  
*Ref: Whitepaper §11.10 · KPXRouterGateway.sol · idead/Global.md §IV*
