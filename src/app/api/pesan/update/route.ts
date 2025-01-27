import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { httpStatus } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { getCsrfToken } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  type reqType = {
    id: number;
    jenis: string;
    smb_stat: string;
    kec: string;
    tunggakan: number;
    daerah: string;
    tanggal_awal: string;
    tanggal_akhir: string;
    pesan: string;
    rutin: number;
    aktif: number;
  };
  const req: reqType = await request.json();
  const session = await getServerSession(authOptions);
  // return NextResponse.json(
  //   {
  //     message: "Unauthorized",
  //     req,
  //     error: [],
  //     cekgu: {
  //       pesan: req.pesan.replace(/\n/g, "\\n"),
  //       pembuat: session?.user?.name as string,
  //       daerah: req.daerah,
  //       kecamatan: req.kec,
  //       tunggakan: req.tunggakan,
  //       tanggal_awal: new Date(req.tanggal_awal),
  //       tanggal_akhir: new Date(req.tanggal_akhir),
  //       jenis: req.jenis,
  //       smb_stat: req.smb_stat,
  //       log: "Mengirim Pesan ke Masyarakat...",
  //       rutin: req.rutin ? 1 : 0,
  //       aktif: req.aktif,
  //     },
  //   },
  //   { status: httpStatus.BadRequest }
  // );

  // if (!session)
  //   return NextResponse.json(
  //     { message: "Unauthorized" },
  //     { status: httpStatus.Unauthorized }
  //   );

  let error = {
    pesan: "",
    tgl_awal: "",
    tgl_akhir: "",
    jenis: "",
  };
  let message;

  if (req.jenis == "") error.jenis = "Pilih Jenis Broadcast";
  if (req.pesan == "") {
    error.pesan = "Tidak Boleh Kosong";
  }
  const tgl_awal = new Date(req.tanggal_awal);
  const tgl_akhir = new Date(req.tanggal_akhir);
  // console.log(tgl_akhir);
  const now = new Date();
  // if (tgl_awal.getDate() < now.getDate()) {
  //   error.tgl_awal = "Tanggal Setidaknya hari ini atau hari berikutnya";
  // }
  // if (tgl_akhir.getDate() < now.getDate()) {
  //   error.tgl_akhir = "Tanggal Setidaknya hari ini atau hari berikutnya";
  // } else if (tgl_awal.getDate() > tgl_akhir.getDate()) {
  //   error.tgl_akhir = "Tanggal Hingga Setidaknya hari ini atau hari berikutnya";
  // }
  // if (error.pesan || error.tgl_awal || error.tgl_akhir || error.jenis) {
  //   return NextResponse.json(
  //     {
  //       message: "",
  //       data: req,
  //       error,
  //       // tgl_awal: tgl_awal + " < " + now,
  //       // stat_tgl: tgl_awal.getDate() == now.getDate(),
  //     },
  //     { status: httpStatus.Ok }
  //   );
  // } else {
  // console.log("req->", req);
  try {
    const simpan = await prisma.pesan.update({
      where: {
        id: req.id,
      },
      data: {
        pesan: req.pesan.replace(/\n/g, "\\n"),
        pembuat: session?.user?.name as string,
        daerah: req.daerah,
        kecamatan: req.kec,
        tunggakan: req.tunggakan,
        tanggal_awal: new Date(req.tanggal_awal),
        tanggal_akhir: new Date(req.tanggal_akhir),
        jenis: req.jenis,
        smb_stat: req.smb_stat,
        log: "Mengirim Pesan ke Masyarakat...",
        rutin: req.rutin == 1 ? true : false,
        aktif: req.aktif == 1 ? true : false,
      },
    });
    if (simpan) {
      return NextResponse.json(
        {
          message: "Pesan Berhasil di Perbaharui",
          data: req,
          error: {},
          // tgl_awal: tgl_awal + " < " + now,
          // stat_tgl: tgl_awal.getDate() == now.getDate(),
        },
        { status: httpStatus.Ok }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Bad Request", data: req, error: error },
      { status: httpStatus.Forbidden }
    );
  }

  // .then((res) => {
  //   console.log("simpan pesan->", res);

  // })
  // .catch((err) => console.error(err));
  // }

  return NextResponse.json(
    { message: "", data: req, error },
    { status: httpStatus.Forbidden }
  );
}
