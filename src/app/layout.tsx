import "./globals.css"
import { AuthProvider } from "../context/authContext"
import Navbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}