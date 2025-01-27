import DetailAbsensi from "@/components/pages/detailAbsensi";
import { authOptions } from "@/lib/auth";
import { permissionT } from "@/lib/types";
import { getServerSession } from "next-auth";

export default async function Page({
  params,
}: {
  params: { id_personalia: number; from: string; to: string };
}) {
  const place = "kepegawaian";
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
      <DetailAbsensi
        id_personalia={params.id_personalia}
        from={params.from}
        to={params.to}
      />
    </>
  );
}
