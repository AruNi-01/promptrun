import { Footer } from "@/components/Footer";
import Header from "@/components/Header";
import { fontSans } from "@/config/fonts";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import clsx from "clsx";
import { Metadata, Viewport } from "next";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "PromptRun",
    template: `%s - PromptRun`,
  },
  description: "让您使用 LLMs 更容易、更高效、更符合预期",

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={clsx("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <main className="flex flex-col gap-5 bg-gradient-to-tr from-[#010513] via-black to-[#010513] ">
            <Header />
            <center className="flex-1 overflow-y-auto min-h-screen">{children}</center>
            <Footer />

            <Toaster />
            <Analytics />
            <SpeedInsights />
          </main>
        </Providers>
      </body>
    </html>
  );
}
