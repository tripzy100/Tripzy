import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { AppProvider } from "@/providers/app-provider";
import { constructMetadata } from "@/utils/metadata";
import "@/styles/globals.css";

const sansFont = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const displayFont = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

import { WhatsAppFloatingButton } from "@/components/layout/whatsapp-button";

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sansFont.variable} ${displayFont.variable} bg-background text-foreground antialiased app-bg`}
      >
        <AppProvider>
          {children}
          <WhatsAppFloatingButton />
        </AppProvider>
      </body>
    </html>
  );
}
