import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Social Selling Gym - Master Your Sales Skills",
  description: "Gamified platform for practising social selling with AI feedback",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-GB">
      <body className={`${inter.className} font-sans antialiased`}>
        <Header />
        <Navigation />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
