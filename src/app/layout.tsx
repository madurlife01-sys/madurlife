import type { Metadata } from "next";
import { Inter, Playfair_Display, Noto_Sans_Kannada } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ClientProviders } from "@/components/client-providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const notoKannada = Noto_Sans_Kannada({
  variable: "--font-noto-kannada",
  subsets: ["kannada"],
});

export const metadata: Metadata = {
  title: "Madur Life — Pure & Fresh Staples",
  description:
    "Premium flours, grains, and spices delivered across Karnataka. Authentic quality from our family to yours.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        data-scroll-behavior="smooth"
        className={`${inter.variable} ${playfair.variable} ${notoKannada.variable}`}
      >
        <body className="min-h-screen flex flex-col font-sans antialiased">
          <ClientProviders>{children}</ClientProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
