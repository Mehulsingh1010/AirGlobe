import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { ThemeProvider } from '@/providers/theme-provider';
import { LocationProvider } from '../components/LocationContext'; // Adjust the path as needed

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.APP_URL
      ? `${process.env.APP_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:${process.env.PORT || 3000}`
  ),
  title: 'AirGlobe: Your World, Mapped and Updated',
  description:
    'Explore interactive global maps and get real-time weather updates. Your ultimate resource for geographic insights and weather information worldwide',
  alternates: {
    canonical: '/'
  },
  openGraph: {
    url: '/',
    title: 'AirGlobe: Your World, Mapped and Updated',
    description:
      'Explore interactive global maps and get real-time weather updates. Your ultimate resource for geographic insights and weather information worldwide',
    type: 'website',
    images: [
      {
        url: '/logo.png', 
        width: 1200,
        height: 630,
        alt: 'AirGlobe: Interactive global maps and real-time weather updates'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AirGlobe: Your World, Mapped and Updated',
    description:
      'Explore interactive global maps and get real-time weather updates. Your ultimate resource for geographic insights and weather information worldwide',
    images: ['/logo.png'] 
  }
};


export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  
    <html className='' lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LocationProvider>
            {children}
          </LocationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
