import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'genie.log',
  description: '이진경의 개발 블로그 — 백엔드 · DBA · 서버',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
