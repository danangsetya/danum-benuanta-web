import BankDataAll from "@/components/pages/bankDataAll";
import { prisma } from "@/lib/prisma";
import { helperType } from "@/lib/types";

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
  // console.log("helper->", helper);
  const helper = await getHelper();
  return <BankDataAll helper={helper} />;
}
