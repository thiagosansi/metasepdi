import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Sidebar } from '@/components/layout/Sidebar'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: 'MetaSepdi — OKR & PDI',
  description: 'Gestão de metas, OKRs e desenvolvimento individual do time',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geist.variable} h-full antialiased`}>
      <body className="flex h-full bg-slate-50">
        <Sidebar />
        <main className="flex-1 overflow-auto p-8">{children}</main>
      </body>
    </html>
  )
}
