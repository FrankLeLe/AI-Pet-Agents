import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";

const title = "Codex Pets｜会回应工作的桌面搭子";
const description =
  "为 Codex Desktop 挑选、预览并安装一只会陪你工作、等待与庆祝完成的原创桌面宠物。";

export const viewport: Viewport = {
  themeColor: "#f7f1e5",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
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
    openGraph: {
      title,
      description,
      type: "website",
      url: origin,
      locale: "zh_CN",
      alternateLocale: ["en_US"],
      images: [
        {
          url: `${origin}/og-v2.png`,
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
      images: [`${origin}/og-v2.png`],
    },
    robots: { index: true, follow: true },
  };
}

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
