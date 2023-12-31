import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthProvider from "./components/AuthProvider";
import { ContextProvider } from "./Context";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sauce Apparel",
  description: "Testing transactions and storing user's credit cards",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ContextProvider>
        <html lang="en">
          <body className={inter.className}>
            <Navbar />
            {children}
            <Footer />
          </body>
        </html>
      </ContextProvider>
    </AuthProvider>
  );
}
