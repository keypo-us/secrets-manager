import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { PrivyWrapper } from "../components/auth/privy-provider";
import { WalletClientProvider } from "../components/auth/WalletClientProvider";
import { Analytics } from "@vercel/analytics/react";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: ".Env Manager",
  description: "Manage your .env files",
  icons: {
    icon: {
      url: "/key.svg",
      type: "image/svg+xml",
    }
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${jetbrainsMono.variable} font-mono`}>
        <PrivyWrapper>
          <WalletClientProvider>
            {children}
            <Analytics />
          </WalletClientProvider>
        </PrivyWrapper>
      </body>
    </html>
  );
}
