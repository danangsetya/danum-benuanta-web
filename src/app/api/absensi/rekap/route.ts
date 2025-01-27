import { prisma } from "@/lib/prisma";
import { httpStatus } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const req = await request.json();
  const dataCari =
    await prisma.$queryRaw`SELECT benuanta_pegawai.personalia.id as id_personalia,benuanta_pegawai.absensi.id as id_absensi,benuanta_pegawai.personalia.nik,benuanta_pegawai.personalia.nama,benuanta_pegawai.personalia.bagian,benuanta_pegawai.absensi.tanggal, IF(benuanta_pegawai.absensi.id is NOT NULL,1,NULL) as cuk, SUM(IF(benuanta_pegawai.absensi.jam_masuk IS NOT NULL,	IF(benuanta_pegawai.absensi.jam_keluar IS NOT NULL,IF(benuanta_pegawai.absensi.jam_keluar<benuanta_pegawai.absensi.jam_masuk,(236000-benuanta_pegawai.absensi.jam_masuk)+benuanta_pegawai.absensi.jam_keluar,benuanta_pegawai.absensi.jam_keluar-benuanta_pegawai.absensi.jam_masuk),NULL),NULL	)) as total_jam, SUM(IF(benuanta_pegawai.absensi.jam_lembur_masuk IS NOT NULL,	IF(benuanta_pegawai.absensi.jam_lembur_keluar IS NOT NULL,IF(benuanta_pegawai.absensi.jam_lembur_keluar<benuanta_pegawai.absensi.jam_lembur_masuk,(236000-benuanta_pegawai.absensi.jam_lembur_masuk)+benuanta_pegawai.absensi.jam_lembur_keluar,benuanta_pegawai.absensi.jam_lembur_keluar-benuanta_pegawai.absensi.jam_lembur_masuk),NULL)	,NULL	)) as total_lembur, COUNT(IF(benuanta_pegawai.absensi.terlambat = 'y',1,NULL)) as terlambat FROM benuanta_pegawai.personalia  LEFT JOIN benuanta_pegawai.absensi ON benuanta_pegawai.personalia.id=benuanta_pegawai.absensi.id_personalia WHERE benuanta_pegawai.absensi.tanggal IS NULL OR benuanta_pegawai.absensi.tanggal BETWEEN ${req.from} AND ${req.to} GROUP BY benuanta_pegawai.personalia.id`;
  const dataToJSON = JSON.parse(
    JSON.stringify(dataCari, (_, value) =>
      typeof value == "bigint" ? value.toString() : value
    )
  );
  if (dataToJSON) {
    // console.log("data->", dataToJSON);
    return NextResponse.json(
      { message: "Ok", data: dataToJSON },
      { status: httpStatus.Ok, statusText: "Ok" }
    );
  }
  return NextResponse.json(
    { message: "Bad Request" },
    { status: httpStatus.BadRequest, statusText: "Bad Request" }
  );
}
