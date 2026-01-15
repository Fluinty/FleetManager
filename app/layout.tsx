import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Art-Tim Fleet Manager",
  description: "Fleet management dashboard for Art-Tim",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className="h-full bg-gray-50">
      <body className={`${inter.className} h-full overflow-hidden`}>
        <div className="flex h-full">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6 md:p-8">
            {children}
          </main>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
