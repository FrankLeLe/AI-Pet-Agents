import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = "https://aipetsagent.com";
const title = "Codex Pets｜会回应工作的桌面搭子";
const description =
  "在星铠港遇见 12 只原创星座守护鸭与青铜见习守护猫，为 Codex Desktop 预览、下载并安装一只会陪你工作、等待与庆祝完成的桌面宠物。";

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
        url: "/og-v2.png",
        width: 1600,
        height: 900,
        alt: "Codex Pets desktop companions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-v2.png"],
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
