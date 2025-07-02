import { Navbar } from "@/components/Navbar/Navbar";
import "./globals.css";
import { Providers } from "./providers";

import localFont from "next/font/local";
import Footer from "@/components/Footer";

const integral = localFont({
  src: "./fonts/Integral_CF/Fontspring-DEMO-integralcf-bold.otf",
  variable: "--font-integral",
  display: "swap",
});
const satoshi = localFont({
  src: "./fonts/Satoshi/Satoshi-Medium.otf",
  variable: "--font-satoshi",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${integral.variable} ${satoshi.variable}`}>
      <body className="font-satoshi bg-background text-primary ">
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
