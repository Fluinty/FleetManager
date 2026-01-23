import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk"
});

export const metadata: Metadata = {
  title: "Fleet Manager by Fluinty",
  description: "Fleet management dashboard powered by Fluinty",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className="h-full">
      <body className={`${inter.className} ${spaceGrotesk.variable} h-full overflow-hidden`}>
        <div className="flex h-full">
          <Sidebar />
          {/* Main content - add top padding on mobile for fixed header */}
          <main className="flex-1 overflow-y-auto p-4 pt-20 md:p-6 md:pt-6 lg:p-8">
            <div className="glass rounded-2xl min-h-full p-4 md:p-6 lg:p-8">
              {children}
            </div>
          </main>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
