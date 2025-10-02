import type { Metadata } from "next";
import "./globals.css";

// 使用系统字体替代 Google Fonts，避免网络连接问题
const fontVariables = {
  "--font-geist-sans":
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  "--font-geist-mono":
    "'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace",
};

export const metadata: Metadata = {
  title: "SmartApp - 现代化全栈应用平台",
  description:
    "一个集成了智能文件上传、用户认证和数据分析功能的现代化全栈应用平台。支持大文件分片上传、断点续传、秒传功能。",
  keywords: [
    "文件上传",
    "用户认证",
    "数据仪表板",
    "Next.js",
    "React",
    "TypeScript",
  ],
  authors: [{ name: "SmartApp Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
        style={fontVariables as React.CSSProperties}
      >
        {children}
      </body>
    </html>
  );
}
