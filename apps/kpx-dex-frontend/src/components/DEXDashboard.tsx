/**
 * DEXDashboard — main page component for the KPX DEX Frontend.
 *
 * Connects wallet, reads KPXRouterGateway contract metadata, and renders
 * the SwapPanel + PoolStats for the configured localnet pool.
 *
 * Contract addresses come from apps/kpx-dex-frontend/.env.local via
 * apps/kpx-dex-frontend/src/lib/config.ts.
 */

'use client';

import { useAccount, useConnect, useDisconnect, useReadContract } from 'wagmi';
import { injected, metaMask } from 'wagmi/connectors';
import { KPX_ROUTER_GATEWAY_ABI } from '../../../../packages/evm-interop/src/abis';
import { CONTRACT_ADDRESSES, networkLabel } from '../lib/config';
import { SwapPanel }  from './SwapPanel';
import { PoolStats }  from './PoolStats';
import type { Address } from 'viem';

// ── WalletBar ─────────────────────────────────────────────────────────────────

function WalletBar() {
  const { address, isConnected } = useAccount();
  const { connect }    = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div style={styles.walletRow}>
        <span style={styles.walletAddr}>
          {address.slice(0, 8)}…{address.slice(-6)}
        </span>
        <button style={styles.btn} onClick={() => disconnect()}>Disconnect</button>
      </div>
    );
  }

  return (
    <div style={styles.walletRow}>
      <button style={{ ...styles.btn, ...styles.btnPrimary }}
        onClick={() => connect({ connector: injected() })}>
        Connect (injected)
      </button>
      <button style={{ ...styles.btn, ...styles.btnSecondary }}
        onClick={() => connect({ connector: metaMask() })}>
        MetaMask
      </button>
    </div>
  );
}

// ── RouterInfo ────────────────────────────────────────────────────────────────

function RouterInfo() {
  const routerAddress = CONTRACT_ADDRESSES.kpxRouter;
  const configured    = routerAddress.length > 2;

  const { data: feeRate } = useReadContract({
    address:      routerAddress,
    abi:          KPX_ROUTER_GATEWAY_ABI,
    functionName: 'feeRate',
    query:        { enabled: configured },
  });

  const { data: vrqVerifier } = useReadContract({
    address:      routerAddress,
    abi:          KPX_ROUTER_GATEWAY_ABI,
    functionName: 'vrqVerifier',
    query:        { enabled: configured },
  });

  if (!configured) {
    return (
      <div style={styles.warning}>
        ⚠️ Set <code>NEXT_PUBLIC_KPX_ROUTER</code> in <code>.env.local</code> to enable.
      </div>
    );
  }

  const feeDisplay = feeRate !== undefined
    ? `${(Number(feeRate) / 100).toFixed(2)}%`
    : '—';

  return (
    <div style={styles.infoRow}>
      {[
        { label: 'Router',      value: `${routerAddress.slice(0, 10)}…${routerAddress.slice(-6)}` },
        { label: 'Protocol Fee', value: feeDisplay },
        { label: 'VRQ Verifier', value: vrqVerifier ? `${(vrqVerifier as string).slice(0, 10)}…` : '—' },
        { label: 'Network',      value: networkLabel() },
      ].map(({ label, value }) => (
        <div key={label} style={styles.infoBox}>
          <p style={styles.infoLabel}>{label}</p>
          <p style={styles.infoValue}><code style={styles.code}>{value}</code></p>
        </div>
      ))}
    </div>
  );
}

// ── DEXDashboard ──────────────────────────────────────────────────────────────

export function DEXDashboard() {
  const routerConfigured = CONTRACT_ADDRESSES.kpxRouter.length > 2;
  const darkPool         = CONTRACT_ADDRESSES.darkPool;
  const hasPool          = darkPool.length > 2;

  return (
    <div style={styles.page}>

      {/* ── Header ── */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>KPX DEX</h1>
          <p style={styles.subtitle}>
            Gasless swaps · AMM · RWA markets · Cross-chain bridge
          </p>
        </div>
        <WalletBar />
      </header>

      {/* ── Router metadata ── */}
      <RouterInfo />

      {/* ── Swap + Pool side-by-side ── */}
      {routerConfigured && (
        <div style={styles.twoCol}>

          {/* Swap panel */}
          {hasPool ? (
            <SwapPanel poolAddress={darkPool as Address} />
          ) : (
            <div style={styles.notice}>
              Set <code>NEXT_PUBLIC_KPX_DARK_POOL</code> for a live swap pool.
            </div>
          )}

          {/* Pool stats */}
          {hasPool && (
            <PoolStats
              poolAddress={darkPool as Address}
              tokenASymbol="AXQ"
              tokenBSymbol="Pool-B"
            />
          )}
        </div>
      )}

      {/* ── Protocol info ── */}
      <section style={styles.cards}>
        {INFO_CARDS.map(({ title, body }) => (
          <div key={title} style={styles.infoCard}>
            <p style={styles.cardTitle}>{title}</p>
            <p style={styles.cardBody}>{body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

// ── Static content ────────────────────────────────────────────────────────────

const INFO_CARDS = [
  {
    title: 'Gasless Swaps',
    body:  'KPXRouterGateway routes orders through the AMM pool, wrapping ERC-20 approval and swap in a single meta-transaction.',
  },
  {
    title: 'RWA Markets',
    body:  'Real-world assets are tokenised and deposited via depositRWA() after a VRQ ZK-compliance check.',
  },
  {
    title: 'Cross-chain Bridge',
    body:  'Lock-mint mechanism bridges assets across EVM chains. SQX L2 support activates Phase 6.',
  },
  {
    title: 'VRQ Compliance Gate',
    body:  'All swaps pass through vrqVerifier — a ZK proof that the sender is AML-compliant without exposing PII.',
  },
];

// ── Styles (CSS variables — dark mode safe) ───────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '32px 16px',
    fontFamily: '-apple-system, "Segoe UI", system-ui, sans-serif',
    fontSize: 14,
    lineHeight: 1.6,
    color: 'var(--color-text-primary, #1f2328)',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: 24, flexWrap: 'wrap', gap: 12,
  },
  title:    { margin: 0, fontSize: 26, fontWeight: 800, color: 'inherit' },
  subtitle: { margin: '4px 0 0', fontSize: 13, color: 'var(--color-text-secondary, #57606a)' },
  warning: {
    marginBottom: 20, padding: '12px 16px', borderRadius: 8,
    background: '#fff8e1', border: '1px solid #f9a825',
    color: '#6d4c00', fontSize: 13,
  },
  notice: {
    padding: '12px 16px', borderRadius: 8, fontSize: 13,
    border: '1px solid var(--color-border-default, #e5e7eb)',
    background: 'var(--color-surface-raised, #f7f8fa)',
  },
  infoRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: 12, marginBottom: 24,
  },
  infoBox: {
    background: 'var(--color-surface-raised, #f7f8fa)',
    border: '1px solid var(--color-border-default, #e5e7eb)',
    borderRadius: 8, padding: '10px 14px',
  },
  infoLabel: { margin: 0, fontSize: 11, color: 'var(--color-text-secondary, #57606a)', textTransform: 'uppercase', letterSpacing: '0.8px' },
  infoValue: { margin: '4px 0 0', fontWeight: 700, fontSize: 13, color: 'var(--color-text-primary, #1f2328)' },
  code:      { fontFamily: 'monospace' },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: 16, marginBottom: 24,
    alignItems: 'start',
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 12, marginTop: 8,
    borderTop: '1px solid var(--color-border-default, #e5e7eb)', paddingTop: 24,
  },
  infoCard: {
    background: 'var(--color-surface-raised, #f7f8fa)',
    border: '1px solid var(--color-border-default, #e5e7eb)',
    borderRadius: 10, padding: '14px 16px',
  },
  cardTitle: { margin: '0 0 6px', fontWeight: 700, fontSize: 13, color: 'var(--color-text-primary, #1f2328)' },
  cardBody:  { margin: 0, fontSize: 12, color: 'var(--color-text-secondary, #57606a)', lineHeight: 1.5 },
  walletRow: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  walletAddr: { fontFamily: 'monospace', fontSize: 13, color: 'var(--color-text-secondary, #57606a)' },
  btn: {
    padding: '6px 14px', borderRadius: 6, border: '1px solid var(--color-border-default, #e5e7eb)',
    cursor: 'pointer', fontSize: 13, fontWeight: 600,
    background: 'var(--color-surface-raised, #f7f8fa)', color: 'var(--color-text-primary, #1f2328)',
  },
  btnPrimary: {
    background: 'var(--color-action-primary-default, #3b82d4)',
    color: '#fff', border: 'none',
  },
  btnSecondary: {
    background: 'var(--color-surface-default, #fff)',
  },
};
