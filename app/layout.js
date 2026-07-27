import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Xarajat Tracker — Kunlik Byudjet',
  description: 'Kunlik xarajatlaringizni oson va qulay kuzatib boring. Kategoriyalar, grafiklar va statistika.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="uz">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
