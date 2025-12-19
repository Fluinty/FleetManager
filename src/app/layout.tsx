import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FlotaAlert - Automatyzacja Zarządzania Flotą",
  description: "Unikaj strat finansowych dzięki automatycznym alertom o polisach i przeglądach.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className="dark">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
