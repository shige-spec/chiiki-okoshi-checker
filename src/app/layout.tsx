import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "地域おこし協力隊 地域要件 判定ツール",
  description:
    "転出地と転入地を選ぶだけで、地域おこし協力隊の特別交付税措置の対象かどうかを○△▲□×で判定。△判定時の条件不利区域チェックにも対応。",
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSans.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">{children}</body>
    </html>
  );
}
