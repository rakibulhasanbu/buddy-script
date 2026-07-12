import { Poppins } from "next/font/google";

import "./globals.css";

import { Providers } from "@/providers";

import { cn } from "@/lib/utils";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("antialiased", "font-sans", poppins.variable)}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
