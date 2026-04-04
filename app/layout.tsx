import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShrimathDasbodh",
  description:
    "A modern, minimal, spiritual reading web app for Srimath Dasbodh. Explore the 17th-century life changing wisdom of Samarth Ramdas with Dashak/Samas navigation and Ovi reading experience.",
  keywords: [
    "Dasbodh",
    "Samarth Ramdas",
    "spiritual",
    "reading app",
    "Marathi",
    "philosophy",
    "self-realization",
  ],
  authors: [{ name: "Kaustubh Jogle" }],
  openGraph: {
    title: "ShrimathDasbodh - Srimath Dasbodh Reader",
    description:
      "A modern, minimal, spiritual reading web app for Srimath Dasbodh",
    type: "website",
    siteName: "ShrimathDasbodh",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShrimathDasbodh - Srimath Dasbodh Reader",
    description:
      "A modern spiritual reading app for exploring Srimath Dasbodh",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
