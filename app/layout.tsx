import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Happy_Monkey,
  DM_Sans,
  Indie_Flower,
} from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/react";
import ClientThemeProvider from "./_components/miscellaneous/theme-provider";

const geistSans = Geist({
  variable: "--paragraph",
  subsets: ["latin"],
});

const geistMono = DM_Sans({
  variable: "--heading",
});
const logo = Happy_Monkey({
  variable: "--logo",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Locallens",
  description: "Locallens",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${logo.variable} antialiased`}
      >
        <ClientThemeProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </ClientThemeProvider>
      </body>
    </html>
  );
}
