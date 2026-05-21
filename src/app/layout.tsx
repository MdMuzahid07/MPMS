import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ReduxProvider from "../provider/ReduxProvider";
import ThemeProvider from "../provider/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MPMS",
    template: "%s | MPMS",
  },
  description:
    "Plan sprints, assign tasks, and ship projects — built for teams that move fast.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
          storageKey="MPMS-theme-v2"
        >
          <TooltipProvider>
            <ReduxProvider>{children}</ReduxProvider>
          </TooltipProvider>
        </ThemeProvider>
        <Toaster
          position="top-center"
          expand={true}
          richColors
          closeButton
          theme="light"
          duration={3000}
        />
      </body>
    </html>
  );
}
