import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Alfian NFR | Portfolio',
  description:
    'Portfolio of Alfian Nur Fazar Rizky, a Backend Developer and Technical Writer building robust systems and clear documentation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Gochi+Hand&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Figtree:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-eggshell antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
