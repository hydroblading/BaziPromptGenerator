import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '八字Prompt生成器 - Bazi Prompt Generator',
  description: '输入出生信息，生成格式化的八字数据，可直接用作GPT/DS等AI模型的输入Prompt',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}

