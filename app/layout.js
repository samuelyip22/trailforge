// app/layout.js
// This is the "root layout" — it wraps every single page on the site.
// Think of it like the outer shell: navbar, fonts, and global styles all live here.

import { Geist } from "next/font/google"
import "./globals.css"
import NavBar from "@/components/NavBar"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })

export const metadata = {
  title: "TrailForge — Utah Mountain Biking",
  description: "Your personal Utah mountain biking guide. Explore trails, track rides, and maintain your bike.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geist.variable} font-sans bg-stone-50 text-stone-900 antialiased`}>
        {/* NavBar appears on every page */}
        <NavBar />
        {/* children = whatever page the user is currently on */}
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}
