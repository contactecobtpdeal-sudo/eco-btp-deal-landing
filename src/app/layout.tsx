import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Éco BTP Deal - Plateforme de mise en relation BTP écologique',
  description: 'Connectez-vous avec des professionnels du bâtiment écologique. Trouvez des artisans certifiés, des matériaux durables et des solutions de construction responsable.',
  keywords: 'BTP écologique, construction durable, artisans éco-responsables, matériaux durables, bâtiment vert',
  openGraph: {
    title: 'Éco BTP Deal - Plateforme BTP Écologique',
    description: 'La plateforme de référence pour le bâtiment écologique',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
