import PengaturanHakPenggunaAll from "@/components/pages/pengaturanHakPenggunaAll";
import { authOptions } from "@/lib/auth";
import { permissionT } from "@/lib/types";
import { getServerSession } from "next-auth";

export default async function Page() {
  const place = "kepegawaian/pengaturan";
  const place2 = "admin/pengaturan";
  const session = await getServerSession(authOptions);
  const data = JSON.parse(session?.user?.email as string);
  if (data.permissions) {
    const l = data.permissions as permissionT[];
    if (l.find((el) => el.name === place) === undefined) {
      if (l.find((el) => el.name === place2) === undefined) {
        return (
          <h1 className="font-bold mt-10 text-center text-lg text-red-600">
            Anda Tidak Memiliki Akses ke Menu ini
          </h1>
        );
      }
    }
  }
  return <PengaturanHakPenggunaAll />;
}
