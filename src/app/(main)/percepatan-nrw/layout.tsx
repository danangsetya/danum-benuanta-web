import ContentDefault from "@/components/content";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function PenggunaLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  return (
    <section>
      <ContentDefault />
      <div className="flex flex-col mx-5">
        <div className="flex flex-row -ml-5">
          <Link
            href={"/percepatan-nrw/baru"}
            className="py-2 px-4 bg-lime-700 font-thin text-slate-50 rounded-r-full border-r-4 border-yellow-400 z-40 hover:bg-lime-600"
          >
            Nrw Baru
          </Link>
          <Link
            href={"/percepatan-nrw"}
            className="py-2 px-4 bg-lime-700 font-thin text-slate-50 rounded-r-full border-r-4 border-yellow-400 z-30 -ml-3 hover:bg-lime-600"
          >
            Semua Data Percepatan
          </Link>
        </div>
        {children}
      </div>
    </section>
  );
}
