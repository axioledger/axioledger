/**
 * WalletHome v2 — uses @axioledger/axio-design-system components.
 *
 * Components used:
 *   <Button>         — all interactive CTAs
 *   <PasskeyButton>  — WebAuthn register/authenticate
 *   <AddressDisplay> — ANS-resolved address + TLP badge + copy
 *   <NamespaceBadge> — protocol identity labels
 *   <BalanceDisplay> — $AXQ balance tile with show/hide
 *   <Alert>          — env-config warning banner
 *   useToast()       — transaction feedback
 */

'use client';

import { useAccount, useConnect, useDisconnect, useReadContract } from 'wagmi';
import { injected } from 'wagmi/connectors';
import {
  Button,
  PasskeyButton,
  AddressDisplay,
  NamespaceBadge,
  BalanceDisplay,
  Alert,
  useToast,
  type QuickAction,
} from '@axioledger/axio-design-system';
import { AXQ_TOKEN_ABI }        from '../../../../packages/evm-interop/src/abis';
import { ValidatorStatus }       from './ValidatorStatus';
import { InstallValidatorPanel } from './InstallValidatorPanel';
import { CONTRACT_ADDRESSES }    from '../lib/config';

// ── WalletHome ────────────────────────────────────────────────────────────────

export function WalletHome() {
  const { address, isConnected } = useAccount();
  const { connect }    = useConnect();
  const { disconnect } = useDisconnect();
  const { toast }      = useToast();

  const vrqConfigured = CONTRACT_ADDRESSES.vrqValidator.length > 2;
  const axqConfigured = CONTRACT_ADDRESSES.axqToken.length     > 2;

  const { data: balanceRaw } = useReadContract({
    address:      CONTRACT_ADDRESSES.axqToken,
    abi:          AXQ_TOKEN_ABI,
    functionName: 'balanceOf',
    args:         [address ?? '0x0000000000000000000000000000000000000000'],
    query:        { enabled: axqConfigured && isConnected && !!address },
  });

  const balanceFiat = balanceRaw !== undefined
    ? `${(Number(balanceRaw) / 1e18).toLocaleString(undefined, { maximumFractionDigits: 4 })} AXQ`
    : '—';

  // Quick actions for BalanceDisplay
  const quickActions: QuickAction[] = [
    {
      label: 'Send',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 14V6m0 0L6 10m4-4l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      ),
      onClick: () => toast.info('Send — coming in Phase 5'),
    },
    {
      label: 'Receive',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 6v8m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      ),
      onClick: () => toast.info('Receive — coming in Phase 5'),
    },
    {
      label: 'Swap',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M13 4l3 3-3 3M7 16l-3-3 3-3M16 7H8M4 13h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      ),
      onClick: () => toast.info('Swap — coming in Phase 5'),
    },
  ];

  // WebAuthn challenge — in production this comes from the server
  const MOCK_CHALLENGE = 'Y2hhbGxlbmdlX2J5dGVzX2hlcmVfMzI=';

  return (
    <div style={styles.page}>

      {/* ── Header ── */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Axiopass</h1>
          <p style={styles.subtitle}>Passkey-native smart wallet · ERC-7579 · ZK-DID</p>
        </div>

        {isConnected && address ? (
          <div style={styles.walletRow}>
            <AddressDisplay address={address} showBadge showCopy />
            <Button
              variant="outlined"
              color="black"
              size="small"
              onClick={() => { disconnect(); toast.info('Wallet disconnected'); }}
            >
              Disconnect
            </Button>
          </div>
        ) : (
          <Button
            variant="filled"
            color="navy"
            size="medium"
            onClick={() => connect({ connector: injected() })}
          >
            Connect Wallet
          </Button>
        )}
      </header>

      {/* ── Config notice ── */}
      {!vrqConfigured && (
        <div style={{ marginBottom: 20 }}>
          <Alert variant="warning" title="Contracts not configured">
            Set <code>NEXT_PUBLIC_VRQ_VALIDATOR</code> and{' '}
            <code>NEXT_PUBLIC_AXQ_TOKEN</code> in <code>.env.local</code>{' '}
            to enable passkey module integration.
          </Alert>
        </div>
      )}

      {/* ── $AXQ balance tile ── */}
      {isConnected && axqConfigured && (
        <div style={styles.balanceTile}>
          <BalanceDisplay
            fiatAmount={balanceFiat}
            balanceLabel="$AXQ Balance"
            actions={quickActions}
          />
        </div>
      )}

      {/* ── Passkey onboarding (not yet connected) ── */}
      {!isConnected && (
        <div style={styles.onboarding}>
          <p style={styles.onboardingTitle}>Your wallet. Your face.</p>
          <p style={styles.onboardingBody}>
            No seed phrase. No MetaMask. Sign transactions with Face ID or Touch ID —
            secured by P-256 cryptography and ZK compliance (VRQ).
          </p>
          <PasskeyButton
            action="register"
            challenge={MOCK_CHALLENGE}
            userName="Axiopass User"
            userId="QXhpb3Bhc3NVc2Vy"
            onSuccess={(cred) => {
              toast.success(`Passkey registered — ID: ${cred.id.slice(0, 12)}…`);
              connect({ connector: injected() });
            }}
            onError={(msg) => toast.error(`Passkey failed: ${msg}`)}
            label="Create Wallet with Face ID / Touch ID"
          />
          <p style={styles.orDivider}>— or —</p>
          <Button
            variant="ghost"
            color="blue"
            size="medium"
            fullWidth
            onClick={() => connect({ connector: injected() })}
          >
            Connect existing wallet
          </Button>
        </div>
      )}

      {/* ── Validator section ── */}
      {isConnected && vrqConfigured && address && (
        <>
          <ValidatorStatus
            validatorAddress={CONTRACT_ADDRESSES.vrqValidator}
            smartAccount={address}
          />
          <InstallValidatorPanel
            validatorAddress={CONTRACT_ADDRESSES.vrqValidator}
            onInstalled={(x, y) =>
              toast.success(`VRQPasskeyValidator installed — PubKey X: 0x${x.toString(16).slice(0, 8)}…`)
            }
          />
        </>
      )}

      {/* ── Protocol info cards ── */}
      <section style={styles.infoGrid}>
        {INFO_CARDS.map(({ title, body, badge }) => (
          <InfoCard key={title} title={title} body={body} badge={badge} />
        ))}
      </section>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function InfoCard({ title, body, badge }: { title: string; body: string; badge?: string }) {
  return (
    <div style={styles.infoCard}>
      {badge && (
        <span style={{ marginBottom: 8, display: 'block' }}>
          <NamespaceBadge name={badge} />
        </span>
      )}
      <p style={{ margin: '0 0 6px', fontWeight: 700, fontSize: 13, color: 'var(--color-text-primary)' }}>
        {title}
      </p>
      <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
        {body}
      </p>
    </div>
  );
}

const INFO_CARDS = [
  { title: 'ERC-7579 Validator',    badge: 'validator.vrq',   body: 'Modular smart-account plugin for ZeroDev Kernel. Replaces seed phrases with biometric passkeys.' },
  { title: 'Dual-Gate Security',    badge: 'compliance.vrq',  body: 'Gate 1: VRQ ZK compliance (anti-sanction). Gate 2: P-256 / WebAuthn on-chain signature.' },
  { title: 'P256 Daimo Verifier',   badge: 'pool.kpx',        body: '0xc2b7…De4 — deterministic CREATE2. No trusted setup, no admin key.' },
  { title: 'ERC-4337 Compatible',   badge: 'node.axq',        body: 'EntryPoint v0.9 compatible. KPXRouterGateway used for gasless swaps via paymaster.' },
];

// ── Styles (CSS variables only — dark mode safe) ──────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 640,
    margin: '0 auto',
    padding: '32px 16px',
    fontFamily: 'var(--font-family-base)',
    fontSize: 14,
    lineHeight: 1.6,
    color: 'var(--color-text-primary)',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: 24, flexWrap: 'wrap', gap: 12,
  },
  title:     { margin: 0, fontSize: 24, fontWeight: 700 },
  subtitle:  { margin: '4px 0 0', fontSize: 13, color: 'var(--color-text-secondary)' },
  walletRow: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  balanceTile: {
    background: 'var(--gradient-crypto-card)',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },
  onboarding: {
    border: '1.5px dashed var(--color-border-default)',
    borderRadius: 16, padding: '32px 24px', textAlign: 'center', marginBottom: 24,
  },
  onboardingTitle: { margin: '0 0 8px', fontSize: 20, fontWeight: 700 },
  onboardingBody:  { margin: '0 0 24px', color: 'var(--color-text-secondary)', fontSize: 14, lineHeight: 1.6 },
  orDivider:       { color: 'var(--color-text-secondary)', fontSize: 12, margin: '12px 0' },
  infoGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: 12, marginTop: 32,
    borderTop: '1px solid var(--color-border-default)', paddingTop: 24,
  },
  infoCard: {
    background: 'var(--color-surface-raised)',
    border: '1px solid var(--color-border-default)',
    borderRadius: 10, padding: '14px 16px',
  },
};
