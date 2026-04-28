import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Pokedex Lite",
  description: "A premium Pokedex web application",
};

import Header from '@/components/Header/Header';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="layout-container">
          <Header />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
