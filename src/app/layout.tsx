import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // Keep Geist_Mono as it's used later
import "./globals.css";
import { AppProvider } from "@/lib/context";
import { BottomNav } from "@/components/BottomNav";
import { PageTransition } from "@/components/PageTransition";
import { InstallPrompt } from "@/components/InstallPrompt";
import { ToastProvider } from "@/components/ui/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mercado de Missões",
  description: "Complete missões, ganhe recompensas.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Missões",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider>
          <AppProvider>
            <div className="flex min-h-screen flex-col bg-background text-foreground relative pb-16 md:pb-0">
              <PageTransition>
                {children}
              </PageTransition>
              <BottomNav />
              <InstallPrompt />
            </div>
          </AppProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
