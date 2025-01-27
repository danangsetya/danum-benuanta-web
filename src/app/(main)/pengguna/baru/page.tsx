import ContentDefault from "@/components/content";
import PenggunaForm from "@/components/pages/penggunaForm";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { helperType, permissionT } from "@/lib/types";
import { getServerSession } from "next-auth";
async function getHelper() {
  const dataGol = await prisma.golongan.findMany();
  const dataStatus = await prisma.status.findMany();
  const statusJson = JSON.parse(JSON.stringify(dataStatus));
  const golJson = JSON.parse(
    JSON.stringify(dataGol, (_, v) => {
      return typeof v === "bigint" ? v.toString() : v;
    })
  );
  const dataUnitKerja = await prisma.unitkerja.findMany();
  const unitKerjaJson = JSON.parse(
    JSON.stringify(dataUnitKerja, (_, v) =>
      typeof v === "bigint" ? v.toString() : v
    )
  );
  const dataJabatan = await prisma.jabatan.findMany();
  const jabatanJson = JSON.parse(
    JSON.stringify(dataJabatan, (_, v) =>
      typeof v === "bigint" ? v.toString() : v
    )
  );
  // console.log(dataStatus);
  const dataBagian = await prisma.bagian.findMany();
  const bagianJson = JSON.parse(
    JSON.stringify(dataBagian, (_, v) =>
      typeof v === "bigint" ? v.toString() : v
    )
  );
  const dataPangkat = await prisma.pangkat.findMany();
  const pangkatJson = JSON.parse(
    JSON.stringify(dataPangkat, (_, v) =>
      typeof v === "bigint" ? v.toString() : v
    )
  );
  const dataLokasi = await prisma.lokasi_absen.findMany();
  const lokasiJson = JSON.parse(
    JSON.stringify(dataLokasi, (_, v) =>
      typeof v === "bigint" ? v.toString() : v
    )
  );
  return {
    message: "ok",
    status: statusJson,
    golongan: golJson,
    unitKerja: unitKerjaJson,
    jabatan: jabatanJson,
    bagian: bagianJson,
    pangkat: pangkatJson,
    lokasi: lokasiJson,
  } as helperType;
}

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
  const helper = await getHelper();
  return <PenggunaForm helper={helper} />;
}
