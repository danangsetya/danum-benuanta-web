import ContentDefault from "@/components/content";
import ProfilC from "@/components/pages/profil";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { helperType } from "@/lib/types";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default async function Page() {
  const session = await getServerSession(authOptions);
  const data = JSON.parse(session?.user?.email as string);
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
  const helper = await getHelper();
  return (
    <section>
      <ContentDefault />
      <div className="flex flex-col mx-10">
        <h1 className="text-center my-3 font-bold">Profil Pengguna</h1>
        <h1 className="uppercase font-bold text-center">
          {data.profil.nama} ({data.profil.gol})
        </h1>
        <h1 className="uppercase underline font-light text-center">
          {data.profil.pangkat}
        </h1>
        <h1 className="uppercase  font-light text-center">
          BAGIAN {data.profil.bagian}
        </h1>
        <ProfilC helper={helper} />
      </div>
    </section>
  );
}
