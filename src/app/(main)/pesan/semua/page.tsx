import ContentDefault from "@/components/content";
import PesanAllPage from "@/components/pages/pesanAll";
import { authOptions } from "@/lib/auth";
import { permissionT } from "@/lib/types";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Page() {
  const place = "broadcast";
  const session = await getServerSession(authOptions);
  const data = JSON.parse(session?.user?.email as string);
  if (data.permissions) {
    const l = data.permissions as permissionT[];
    if (l.find((el) => el.name === place) === undefined) {
      return (
        <h1 className="font-bold mt-10 text-center text-lg text-red-600">
          Anda Tidak Memiliki Akses ke Menu ini
        </h1>
      );
    }
  }
  return (
    <section>
      <ContentDefault />
      <div className="flex flex-col md:mx-5">
        <div className="flex flex-row md:-ml-5">
          <Link
            href={"/pesan"}
            className="py-2 px-4 bg-lime-700 font-thin text-slate-50 rounded-r-full border-r-4 border-yellow-400 z-40 hover:bg-lime-600"
          >
            Pesan Baru
          </Link>
          <Link
            href={"/pesan/semua"}
            className="py-2 px-4 bg-lime-700 font-thin text-slate-50 rounded-r-full border-r-4 border-yellow-400 z-30 -ml-3 hover:bg-lime-600"
          >
            Daftar Semua Pesan
          </Link>
        </div>
        <h1 className="text-center my-3 font-bold">
          Sistem Broadcast Pesan Pelanggan{" "}
          <span className="text-yellow-400">|</span>
          <span className="text-sky-400"> SI BAPAG</span>
        </h1>
        <PesanAllPage />
      </div>
    </section>
  );
}
