import ContentDefault from "@/components/content";
import Link from "next/link";
import { ReactNode } from "react";

export default function LevelLayout({ children }: { children: ReactNode }) {
  return (
    <section>
      <ContentDefault />
      <div className="flex flex-col mx-5">
        <div className="flex flex-row -ml-5">
          <Link
            href={"/pengaturan/pengguna/hak"}
            className="py-2 px-4 bg-lime-700 font-thin text-slate-50 rounded-r-full border-r-4 border-yellow-400 z-40 hover:bg-lime-600 cursor-pointer"
          >
            Daftar Hak Akses Pengguna
          </Link>
          <Link
            href={"/pengaturan/pengguna/hak/baru"}
            className="py-2 px-4 bg-lime-700 font-thin text-slate-50 rounded-r-full border-r-4 border-yellow-400 z-30 -ml-3 hover:bg-lime-600 cursor-pointer"
          >
            Hak Pengguna Baru
          </Link>
        </div>
        {children}
      </div>
    </section>
  );
}
