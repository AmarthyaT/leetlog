import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LeetLog — Stop Forgetting What You Solve',
  description: 'Auto-track your LeetCode solves, get AI revision cards, never forget a pattern.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-bg text-white antialiased">{children}</body>
    </html>
  )
}
