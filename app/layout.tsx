import type { Metadata } from "next";
import { Tajawal, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/provider";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Pearl and the Loom · الَّلؤلؤة والنّول",
  description:
    "A UAE-themed gamified learning path. Grade 4 Math at the Sadu loom and Grade 8 Science in the pearling sea — braided through one family's story.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${tajawal.variable} ${cormorant.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh flex flex-col">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
