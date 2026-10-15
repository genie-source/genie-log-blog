import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'genie.log',
  description: '이진경의 개발 블로그와 포트폴리오 — RAG · Agent · NLP',
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
