import type { Metadata } from "next";
import { Tajawal, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/provider";
import { AchievementWatcher } from "@/components/achievements/AchievementWatcher";
import { HeirloomCeremony } from "@/components/ceremony/HeirloomCeremony";
import { RouteScrollReset } from "@/components/layout/RouteScrollReset";
import { RouteTransition } from "@/components/layout/RouteTransition";

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
  icons: {
    // Order matters — modern browsers pick the first they support; older
    // browsers fall through to the PNGs.
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-256.png", sizes: "256x256", type: "image/png" },
    ],
    shortcut: "/favicon-32.png",
    apple: [
      { url: "/favicon-256.png", sizes: "256x256", type: "image/png" },
    ],
  },
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
      <body className="min-h-dvh flex flex-col" suppressHydrationWarning>
        <I18nProvider>
          <RouteTransition>{children}</RouteTransition>
          <RouteScrollReset />
          <AchievementWatcher />
          <HeirloomCeremony />
        </I18nProvider>
      </body>
    </html>
  );
}
