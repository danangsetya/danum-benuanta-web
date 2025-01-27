import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { httpStatus, toJson, validateEmail } from "@/lib/utils";
import { genSalt, hash } from "bcryptjs";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import md5 from "md5";
import { personaliaType, usersType } from "@/lib/types";
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: httpStatus.Unauthorized }
    );
  const uid = md5(JSON.stringify(session));
  // console.log(md5(JSON.stringify(session)));
  const req: {
    personalia: personaliaType;
    users: usersType;
  } = await request.json();
  let error: any = {};
  if (!validateEmail(req.personalia.email)) error.email = "Tidak Valid";
  if (req.personalia.nama.length < 3) {
    error.nama = "Tidak Boleh Kosong";
  }
  console.log("email->", validateEmail(req.personalia.email));
  if (req.personalia.telpon.length <= 10) error.telpon = "Tidak Boleh Kosong";
  if (req.personalia.username == "") {
    error.username = "Tidak Boleh Kosong";
  } else {
    const cariUsername = await prisma.users.findUnique({
      where: {
        username: req.personalia.username,
      },
    });
    if (cariUsername !== null) {
      error.username = "Username Tidak Tersedia";
    }
    // const cariUsrJson = JSON.parse(
    //   JSON.stringify(cariUsername, (_, v) =>
    //     typeof v === "bigint" ? v.toString() : v
    //   )
    // );
  }
  if (
    req.personalia.password.length <= 5 ||
    req.personalia.password !== req.personalia.konfirm_password
  ) {
    error.password = " Harus Lebih dari 6 Karakter";
  }
  // console.log(Object.keys(error).length);
  // return NextResponse.json({ tes: "tes" }, { status: httpStatus.Ok });
  if (Object.keys(error).length > 0) {
    return NextResponse.json({ req, error }, { status: httpStatus.Ok });
  }
  const salt = await genSalt(10);
  const password_hash = await hash(req.personalia.password, salt);
  if (req.personalia) {
    // console.log(session);
    // return NextResponse.json({ req }, { status: httpStatus.Ok });
    try {
      const personaliaAdd = await prisma.personalia.create({
        data: {
          // username: req.personalia.username,
          // email: req.personalia.email,
          // nama: req.personalia.nama.toUpperCase(),
          // telpon: req.personalia.telpon,
          // hash: password_hash,
          level: "2",
          // tanggal_menikah: "",
          nama: req.personalia.nama.toUpperCase(),
          nik: req.personalia.nik,
          email: req.personalia.email,
          status_kawin: req.personalia.status_kawin,
          tanggal_menikah:
            req.personalia.tanggal_menikah !== ""
              ? new Date(req.personalia.tanggal_menikah)
              : new Date(),
          telpon: req.personalia.hp,
          hp: req.personalia.hp,
          tempat_lahir: req.personalia.tempat_lahir,
          tanggal_lahir:
            req.personalia.tanggal_lahir !== ""
              ? new Date(req.personalia.tanggal_lahir)
              : new Date(),
          jenis_kelamin: req.personalia.jenis_kelamin,
          gol_darah: req.personalia.gol_darah,
          agama: req.personalia.agama,
          alamat: req.personalia.alamat,
          username: req.personalia.username,
          hash: "",
          mk_gaji: req.personalia.mk_gaji * 1,
          status_pegawai: req.personalia.status_pegawai,
          gol: req.personalia.gol,
          unit_kerja: req.personalia.unit_kerja,
          jabatan: req.personalia.jabatan,
          bagian: req.personalia.bagian,
          pangkat: req.personalia.pangkat,
          pendidikan: req.personalia.pendidikan,
          kk: req.personalia.kk,
          ktp: req.personalia.ktp,
          npwp: req.personalia.npwp,
          efin: req.personalia.efin,
          bpjskt: req.personalia.bpjskt,
          bpjs: req.personalia.bpjs,
          dapenmapamsi: req.personalia.dapenmapamsi,
          polis: req.personalia.polis,
          simc: req.personalia.simc,
          simab: req.personalia.simab,
          paspor: req.personalia.paspor,
          simpeda: req.personalia.simpeda,
          nama_ayah: req.personalia.nama_ayah,
          nama_ibu: req.personalia.nama_ibu,
          anak_nomor: req.personalia.anak_nomor,
          jml_saudara: req.personalia.jml_saudara,
          id_lokasi: req.personalia.id_lokasi * 1,
        },
      });
      if (personaliaAdd) {
        const jsonP = toJson(personaliaAdd);
        const usersAdd = await prisma.users.create({
          data: {
            v2_hash: "",
            username: req.personalia.username,
            password_hash: password_hash,
            email: req.personalia.email,
            active: true,
            force_pass_reset: false,
            id_personalia: personaliaAdd.id,
            last_uuid: uid,
          },
        });
        if (usersAdd)
          return NextResponse.json(
            { message: "Data Tersimpan" },
            { status: httpStatus.Ok }
          );
      }
      // console.log("personalia add->", personaliaAdd);
    } catch (error) {
      console.error(error);
    }
  }
  return NextResponse.json(
    { message: "Bad Request" },
    { status: httpStatus.BadRequest }
  );
}
