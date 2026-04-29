import { IBM_Plex_Sans, IBM_Plex_Mono, DM_Serif_Display } from 'next/font/google';
import './globals.css';

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-ibm-plex',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-dm-serif',
  display: 'swap',
});

export const metadata = {
  title: 'KILAS — Jakarta Angkasa',
  description: 'KILAS · Monitoring Kinerja Unit Jakarta Angkasa · Bank Mandiri',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} ${dmSerifDisplay.variable}`}
    >
      <body className="font-sans antialiased">
        {/* Grain texture overlay — pointer-events:none so it never blocks interaction */}
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23g)'/%3E%3C/svg%3E")`,
            opacity: 0.02,
            zIndex: 9999,
          }}
        />
        {children}
      </body>
    </html>
  );
}
