import { MobileBottomNav } from "@/features/feed/components/mobile-bottom-nav";
import { MobileHeader } from "@/features/feed/components/mobile-header";
import { Navbar } from "@/features/feed/components/navbar";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <Navbar />
      <MobileHeader />

      {children}

      <MobileBottomNav />
    </div>
  );
}
