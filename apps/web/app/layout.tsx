import type { Metadata } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces' });

export const metadata: Metadata = {
  title: 'Monprefac - Prepare ton concours avec de vrais profs',
  description:
    "Monprefac connecte les eleves de terminale a des professeurs qualifies pour preparer les concours d'admission a l'universite.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="antialiased">
        <div className="aurora-bg" />
        {children}
      </body>
    </html>
  );
}