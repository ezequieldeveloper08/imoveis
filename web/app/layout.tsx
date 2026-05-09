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
            theme="dark" 
            richColors 
            closeButton
            toastOptions={{
              style: { background: '#1A1A1A', border: '1px solid #262626', color: '#FFFFFF' }
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
