import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = "https://aipetsagent.com";
const title = "Codex Pets｜给 Codex 选一位会动的伙伴";
const description =
  "浏览原创 Codex 桌面伙伴系列，试玩角色动作，并通过 ZIP 或 Codex 协助方式安全安装。";

export const viewport: Viewport = {
  themeColor: "#f7f1e5",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    "Codex Pets",
    "Codex Desktop",
    "AI desktop pet",
    "桌面宠物",
    "Hatch Pet Skill",
  ],
  authors: [{ name: "Codex Pets" }],
  alternates: { canonical: siteUrl },
  openGraph: {
    title,
    description,
    type: "website",
    url: siteUrl,
    locale: "zh_CN",
    alternateLocale: ["en_US"],
    images: [
      {
        url: "/og-series.png",
        width: 1672,
        height: 941,
        alt: "Codex Pets desktop companions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-series.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
