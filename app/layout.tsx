
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '保育園シフト管理ツール (Sunny Nursery Shift)',
  description: '保育士の雇用形態別管理、1週間単位のタイムライン表示、祝日対応、および必要最低人員設定機能を備えた高度なシフト管理アプリケーションです。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
