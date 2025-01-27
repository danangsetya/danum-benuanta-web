import MenuLeft, { MenuBottom } from "@/components/menu";
import { Toaster } from "@/components/ui/toaster";
import { authOptions } from "@/lib/auth";
import { Providers } from "@/redux/providers";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="flex flex-col-reverse md:flex-row bg-lime-700">
        <MenuLeft />
        {/* <div className="w-[200px] flex flex-col bg-red-400">
              <h1>TES</h1>
              <h1>TES</h1>
              <h1>TES</h1>
            </div> */}
        {/* <div className="flex-1 bg-yellow-300">tes</div> */}
        <section className="flex-1 bg-white pb-10 md:pb-0">{children}</section>
      </div>
      <MenuBottom />
      <Toaster />
    </Providers>
  );
}
