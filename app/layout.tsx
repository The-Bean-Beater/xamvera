import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "XamVera",
  description: "XamVera is an AP study platform for trusted practice, review, and progress tracking.",
  icons: {
    icon: "/assets/favicon-white.png",
    apple: "/assets/xanvera-mark-tight-192.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Script id="xamvera-theme" strategy="beforeInteractive">
          {`
            const savedTheme = localStorage.getItem("xamvera-theme");
            if (savedTheme === "light" || savedTheme === "dark") {
              document.documentElement.dataset.theme = savedTheme;
            }
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
