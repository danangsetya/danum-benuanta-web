import ContentDefault from "@/components/content";
import PengaturanLevelPenggunaAll from "@/components/pages/pengaturanLevelPenggunaAll";
import PengaturanLevelPenggunaForm from "@/components/pages/pengaturanLevelPenggunaAll";
import { authOptions } from "@/lib/auth";
import { permissionT } from "@/lib/types";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Page() {
  const place = "admin/pengaturan";
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
    <>
      <PengaturanLevelPenggunaAll />
    </>
  );
  //(
  // <section>
  {
    /* <ContentDefault /> */
  }
  {
    /* <div className="flex flex-col mx-5"> */
  }
  {
    /* <div className="flex flex-row -ml-5">
          <Link
            href={"/pengaturan/pengguna/level"}
            className="py-2 px-4 bg-green-600 font-thin text-slate-50 rounded-r-full border-r-4 border-yellow-400 z-40 hover:bg-lime-600 cursor-pointer"
          >
            Level Pengguna
          </Link>
          <Link
            href={"/pengaturan/pengguna/level/baru"}
            className="py-2 px-4 bg-green-600 font-thin text-slate-50 rounded-r-full border-r-4 border-yellow-400 z-30 -ml-3 hover:bg-lime-600 cursor-pointer"
          >
            Level Pengguna Baru
          </Link>
        </div> */
  }
  {
    /* </div> */
  }
  // </section>
  //);
}
