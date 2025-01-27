import PengaturanLevelAksesPenggunaAll from "@/components/pages/pengaturanLevelAksesPenggunaAll";
import { authOptions } from "@/lib/auth";
import { permissionT } from "@/lib/types";
import { getServerSession } from "next-auth";
import nextBase64 from "next-base64";

export default async function Page({ params }: { params: { akses: string } }) {
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
  const akses = nextBase64.decode(params.akses.replaceAll("%3D", "="));
  return (
    <>
      <PengaturanLevelAksesPenggunaAll id={parseInt(akses)} />
    </>
  );
}
