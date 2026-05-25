import { cookies } from "next/headers";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import ReduxProvider from "../provider/ReduxProvider";
import ThemeProvider from "../provider/ThemeProvider";
import Preloader from "@/components/shared/Preloader";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const hasVisited = cookieStore.get("onyx_first_visit");
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
            <ReduxProvider>
              <Preloader hasVisited={!!hasVisited}>{children}</Preloader>
            </ReduxProvider>
          </TooltipProvider>
        </ThemeProvider>
        <Toaster
          position="top-center"
          expand={true}
          richColors
          closeButton
          theme="dark"
          duration={3000}
        />
      </body>
    </html>
  );
}
