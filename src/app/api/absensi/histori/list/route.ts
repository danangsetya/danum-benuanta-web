import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { httpStatus } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: httpStatus.Unauthorized }
    );

  const req: { page: number; param: string; uname: string } =
    await request.json();
  console.log(req);
  const newParam = "%" + req.param + "%";
  const page = req.page;
  const limit = 10;
  const startIndex = (page - 1) * limit;
  console.log("startIndex->", startIndex);
  // return NextResponse.json(
  //   {
  //     error: [],
  //     message: "dev",
  //     req,
  //     query: `SELECT
  // benuanta_pegawai.users.id,benuanta_pegawai.users.email,benuanta_pegawai.users.username,benuanta_pegawai.users.profil_image,benuanta_pegawai.users.reset_hash,benuanta_pegawai.users.reset_at,benuanta_pegawai.users.reset_expires,benuanta_pegawai.users.activate_hash,benuanta_pegawai.users.status,benuanta_pegawai.users.status_message,benuanta_pegawai.users.active,benuanta_pegawai.users.force_pass_reset,benuanta_pegawai.users.created_at,benuanta_pegawai.users.updated_at,benuanta_pegawai.users.deleted_at,benuanta_pegawai.users.id_personalia,benuanta_pegawai.users.last_uuid,benuanta_pegawai.users.v2_hash,benuanta_pegawai.personalia.nama,benuanta_pegawai.personalia.id as user_id,benuanta_pegawai.personalia.nik,benuanta_pegawai.personalia.tempat_lahir,benuanta_pegawai.personalia.tanggal_lahir,benuanta_pegawai.personalia.tmt,benuanta_pegawai.personalia.jenis_kelamin,benuanta_pegawai.personalia.pendidikan,benuanta_pegawai.personalia.status_kawin,benuanta_pegawai.personalia.jumlah_anak,benuanta_pegawai.personalia.jabatan,benuanta_pegawai.personalia.unit_kerja,benuanta_pegawai.personalia.bagian,benuanta_pegawai.personalia.klasifikasi,benuanta_pegawai.personalia.gol,benuanta_pegawai.personalia.pangkat,benuanta_pegawai.personalia.masa_kerja,benuanta_pegawai.personalia.masa_kerja_gol,benuanta_pegawai.personalia.sisa_masa_kerja,benuanta_pegawai.personalia.umur,benuanta_pegawai.personalia.tanggal_pensiun,benuanta_pegawai.personalia.email,benuanta_pegawai.personalia.kk,benuanta_pegawai.personalia.ktp,benuanta_pegawai.personalia.efin,benuanta_pegawai.personalia.bpjskt,benuanta_pegawai.personalia.bpjs,benuanta_pegawai.personalia.dapenmapamsi,benuanta_pegawai.personalia.polis,benuanta_pegawai.personalia.hp,benuanta_pegawai.personalia.telpon,benuanta_pegawai.personalia.simc,benuanta_pegawai.personalia.paspor,benuanta_pegawai.personalia.simpeda,benuanta_pegawai.personalia.gol_darah,benuanta_pegawai.personalia.agama,benuanta_pegawai.personalia.nama_ibu,benuanta_pegawai.personalia.nama_ayah,benuanta_pegawai.personalia.anak_nomor,benuanta_pegawai.personalia.jml_saudara,benuanta_pegawai.personalia.alamat,benuanta_pegawai.personalia.status_pegawai,benuanta_pegawai.personalia.profil_image,benuanta_pegawai.personalia.npwp,benuanta_pegawai.personalia.simab,benuanta_pegawai.personalia.tanggal_menikah,benuanta_pegawai.personalia.username,benuanta_pegawai.personalia.hash,benuanta_pegawai.personalia.level,benuanta_pegawai.personalia.mk_gaji,benuanta_pegawai.personalia.id_mesin_absen,benuanta_pegawai.personalia.tanggal_menikah,benuanta_pegawai.personalia.id_lokasi FROM benuanta_pegawai.users INNER JOIN benuanta_pegawai.personalia ON benuanta_pegawai.users.id_personalia=benuanta_pegawai.personalia.id WHERE benuanta_pegawai.users.username LIKE ${newParam} OR benuanta_pegawai.users.email LIKE ${newParam} OR benuanta_pegawai.personalia.nama LIKE ${newParam} LIMIT ${startIndex},${limit}`,
  //   },
  //   { status: httpStatus.BadRequest }
  // );
  const dataPersonalia = await prisma.personalia.findFirst({
    where: {
      username: req.uname,
    },
  });
  if (dataPersonalia != null) {
    const dataAbsensi =
      await prisma.$queryRaw`SELECT * FROM benuanta_pegawai.absensi WHERE benuanta_pegawai.absensi.id_personalia=${dataPersonalia.id} ORDER BY id DESC LIMIT ${startIndex},${limit} `;
    const dataAbsensiSON = JSON.parse(
      JSON.stringify(dataAbsensi, (key, value) =>
        typeof value === "bigint" ? parseInt(value.toString()) : value
      )
    );
    if (dataAbsensiSON) {
      // console.log("data->", dataAbsensiSON);
      return NextResponse.json(
        { error: [], message: "ok", data: dataAbsensiSON, req },
        { status: httpStatus.Accepted }
      );
    }
  }

  return NextResponse.json(
    { error: [], message: "dev", req },
    { status: httpStatus.BadRequest }
  );
}
