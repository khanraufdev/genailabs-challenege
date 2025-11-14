import { Providers } from "@/components/providers";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.BETTER_AUTH_URL ?? "http://localhost:3000"),
  title: {
    default: "GenAI Labs",
    template: "%s · GenAI Labs",
  },
  description: "Private LLM workspace. Compare models, prompts, and metrics.",
  applicationName: "GenAI Labs",
  icons: {
    icon: "/favicon.ico",
  },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "GenAI Labs",
    url: "/",
    title: "GenAI Labs",
    description: "Private LLM workspace. Compare models, prompts, and metrics.",
    images: ["/vercel.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "GenAI Labs",
    description: "Private LLM workspace. Compare models, prompts, and metrics.",
    images: ["/vercel.svg"],
  },
  robots: { index: true, follow: true },
  keywords: ["ai", "chatbot", "llm", "genailabs"],
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
