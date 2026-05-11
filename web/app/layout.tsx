import { Urbanist } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
})

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", "font-sans", urbanist.variable)}
    >
      <body>
        <ThemeProvider>
          {children}
          <Toaster 
            position="top-right" 
            theme="system" 
            richColors 
            closeButton
            toastOptions={{
              style: { background: 'var(--theme-grey-10)', border: '1px solid var(--theme-grey-15)', color: 'var(--theme-white)' }
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
