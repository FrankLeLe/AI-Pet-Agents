import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";

const title = "Codex Pets — Desktop companions hatched for work";
const description =
  "浏览、预览并安装原创 Codex Desktop v2 宠物，或下载 Hatch Pet Skill 孵化自己的桌面搭子。Browse, preview, and install original Codex Desktop pets.";

export const viewport: Viewport = {
  themeColor: "#f4f0e7",
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
      "Codex pet",
      "Codex Desktop",
      "AI pet",
      "desktop companion",
      "Hatch Pet",
      "Codex 宠物",
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
          url: `${origin}/og.png`,
          alt: "Codex Pets — a star-armored cat and three golden guardian duck companions",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${origin}/og.png`],
    },
    robots: {
      index: true,
      follow: true,
    },
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
