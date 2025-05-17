import { Providers } from "@/redux/providers";
import "./globals.css";
import { Inter } from "next/font/google";
import MenuLeft, { MenuBottom } from "@/components/menu";
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DANUM BENUANTA",
  description: "PDAM DANUM BENUANTA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* <div className="flex flex-col-reverse md:flex-row bg-green-600">
          <MenuLeft /> */}
        {/* <div className="w-[200px] flex flex-col bg-red-400">
              <h1>TES</h1>
              <h1>TES</h1>
              <h1>TES</h1>
            </div> */}
        {/* <div className="flex-1 bg-yellow-300">tes</div> */}
        {/* <section className="flex-1 bg-white pb-10 md:pb-0">
            {children}
          </section>
        </div>
        <MenuBottom />
        <Toaster /> */}
      </body>
    </html>
  );
}
