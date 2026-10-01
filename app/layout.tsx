import React from 'react';

export const metadata = {
  title: 'SecureContract AI - Smart Contract Auditor',
  description: 'AI-Powered Smart Contract Security Auditing Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
