import { Metadata, Viewport } from "next";

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
  description: "让你使用 LLMs 更容易、更高效、更符合预期",

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function Home() {
  return <section className="flex flex-col justify-around w-full items-center gap-10"></section>;
}
