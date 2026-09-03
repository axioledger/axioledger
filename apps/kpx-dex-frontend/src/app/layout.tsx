import type { ReactNode } from 'react';
import { Providers }    from '../components/Providers';

export const metadata = {
  title:       'KPX DEX — Axioledger',
  description: 'Gasless token swaps · AMM · RWA markets via KPXRouterGateway',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: '-apple-system, "Segoe UI", system-ui, sans-serif' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
