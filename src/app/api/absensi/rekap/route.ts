import { prisma } from "@/lib/prisma";
import { httpStatus } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const req = await request.json();
  
  // const dataCari =
  //   await prisma.$queryRaw`SELECT benuanta_pegawai.personalia.id as id_personalia,benuanta_pegawai.absensi.id as id_absensi,benuanta_pegawai.personalia.nik,benuanta_pegawai.personalia.nama,benuanta_pegawai.personalia.bagian,benuanta_pegawai.absensi.tanggal, IF(benuanta_pegawai.absensi.id is NOT NULL,1,NULL) as cuk, SUM(IF(benuanta_pegawai.absensi.jam_masuk IS NOT NULL,	IF(benuanta_pegawai.absensi.jam_keluar IS NOT NULL,IF(benuanta_pegawai.absensi.jam_keluar<benuanta_pegawai.absensi.jam_masuk,(236000-benuanta_pegawai.absensi.jam_masuk)+benuanta_pegawai.absensi.jam_keluar,benuanta_pegawai.absensi.jam_keluar-benuanta_pegawai.absensi.jam_masuk),NULL),NULL	)) as total_jam, SUM(IF(benuanta_pegawai.absensi.jam_lembur_masuk IS NOT NULL,	IF(benuanta_pegawai.absensi.jam_lembur_keluar IS NOT NULL,IF(benuanta_pegawai.absensi.jam_lembur_keluar<benuanta_pegawai.absensi.jam_lembur_masuk,(236000-benuanta_pegawai.absensi.jam_lembur_masuk)+benuanta_pegawai.absensi.jam_lembur_keluar,benuanta_pegawai.absensi.jam_lembur_keluar-benuanta_pegawai.absensi.jam_lembur_masuk),NULL)	,NULL	)) as total_lembur, COUNT(IF(benuanta_pegawai.absensi.terlambat = 'y',1,NULL)) as terlambat FROM benuanta_pegawai.personalia  LEFT JOIN benuanta_pegawai.absensi ON benuanta_pegawai.personalia.id=benuanta_pegawai.absensi.id_personalia WHERE benuanta_pegawai.absensi.tanggal IS NULL OR benuanta_pegawai.absensi.tanggal BETWEEN ${req.from} AND ${req.to} GROUP BY benuanta_pegawai.personalia.id`;
    const dataCari= await prisma.$queryRaw`SELECT p.id AS id_personalia,p.nik,p.nama,p.bagian,ab.total_jam,ab.total_lembur,ab.terlambat,si.jam_masuk,si.jam_keluar,si.jam_lembur_masuk,si.jam_lembur_keluar FROM benuanta_pegawai.personalia AS  p 
LEFT JOIN  (SELECT  a.id_personalia,SUM(IF(a.jam_masuk IS NOT NULL, IF(a.jam_keluar IS NOT NULL,IF(a.jam_keluar<a.jam_masuk,(236000-a.jam_masuk)+a.jam_keluar,a.jam_keluar-a.jam_masuk),NULL),NULL)) as total_jam, SUM(IF(a.jam_lembur_masuk IS NOT NULL,  IF(a.jam_lembur_keluar IS NOT NULL,IF(a.jam_lembur_keluar<a.jam_lembur_masuk,(236000-a.jam_lembur_masuk)+a.jam_lembur_keluar,a.jam_lembur_keluar-a.jam_lembur_masuk),NULL) ,NULL   )) as total_lembur, COUNT(IF(a.terlambat = 'y',1,NULL)) as terlambat 
FROM benuanta_pegawai.absensi as a WHERE a.tanggal BETWEEN ${req.from} AND ${req.to} GROUP BY a.id_personalia) AS ab
ON p.id=ab.id_personalia
LEFT JOIN (SELECT id_personalia,jam_masuk,jam_keluar,jam_lembur_masuk,jam_lembur_keluar FROM absensi WHERE tanggal=${req.from}) AS si
ON p.id=si.id_personalia`
console.log(`SELECT p.id AS id_personalia,p.nik,p.nama,p.bagian,ab.total_jam,ab.total_lembur,ab.terlambat,si.jam_masuk,si.jam_keluar,si.jam_lembur_masuk,si.jam_lembur_keluar FROM benuanta_pegawai.personalia AS  p 
LEFT JOIN  (SELECT  a.id_personalia,SUM(IF(a.jam_masuk IS NOT NULL, IF(a.jam_keluar IS NOT NULL,IF(a.jam_keluar<a.jam_masuk,(236000-a.jam_masuk)+a.jam_keluar,a.jam_keluar-a.jam_masuk),NULL),NULL)) as total_jam, SUM(IF(a.jam_lembur_masuk IS NOT NULL,  IF(a.jam_lembur_keluar IS NOT NULL,IF(a.jam_lembur_keluar<a.jam_lembur_masuk,(236000-a.jam_lembur_masuk)+a.jam_lembur_keluar,a.jam_lembur_keluar-a.jam_lembur_masuk),NULL) ,NULL   )) as total_lembur, COUNT(IF(a.terlambat = 'y',1,NULL)) as terlambat 
FROM benuanta_pegawai.absensi as a WHERE a.tanggal BETWEEN ${req.from} AND ${req.to} GROUP BY a.id_personalia) AS ab
ON p.id=ab.id_personalia
LEFT JOIN (SELECT id_personalia,jam_masuk,jam_keluar,jam_lembur_masuk,jam_lembur_keluar FROM absensi WHERE tanggal=${req.from}) AS si
ON p.id=si.id_personalia`)
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
