import './globals.css';

export const metadata = {
  title: 'Elbil vs. Benzinbil | Danmarks Ultimative TCO Beregner',
  description: 'Beregn din præcise besparelse ved at skifte fra benzin til elbil. Live elpriser for Vestdanmark (DK1), populære bilmodeller og komplet TCO-analyse.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0e17',
};

export default function RootLayout({ children }) {
  return (
    <html lang="da">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <main className="mobile-app-container">
          {children}
        </main>
      </body>
    </html>
  );
}
