import { jabatan } from "./../../../../../prisma/generated/client1/index.d";
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
  if (session.user !== undefined && session.user.email) {
    const sessJ = JSON.parse(session.user?.email);
    // console.log("session->", sessJ);
    const req = await request.json();
    // console.log(req);
    const newParam = "%" + req.param + "%";
    const page = req.page;
    const limit = 10;
    const startIndex = (page - 1) * limit;
    // console.log("startIndex->", startIndex);
    const bagian = sessJ.profil.bagian;
    const unit = sessJ.profil.unit_kerja;
    const nama = sessJ.profil.nama;
    const jabatan = sessJ.profil.jabatan;
    // console.log(`SELECT * FROM benuanta_pegawai.files WHERE alias LIKE ${newParam} AND (
    //     (benuanta_pegawai.files.public=1 AND benuanta_pegawai.files.nama_unit IS NULL AND benuanta_pegawai.files.nama_bagian IS NULL AND benuanta_pegawai.files.jabatan IS NULL) OR
    //     ( benuanta_pegawai.files.public=0 AND benuanta_pegawai.files.nama_bagian=${bagian} AND benuanta_pegawai.files.nama_unit IS NULL AND benuanta_pegawai.files.jabatan IS NULL) OR
    //     ( benuanta_pegawai.files.public=0 AND benuanta_pegawai.files.nama_bagian IS NULL AND benuanta_pegawai.files.nama_unit=${unit} AND benuanta_pegawai.files.jabatan IS NULL) OR
    //     ( benuanta_pegawai.files.public=0 AND benuanta_pegawai.files.nama_bagian IS NULL AND benuanta_pegawai.files.nama_unit IS NULL AND benuanta_pegawai.files.jabatan=${jabatan})  OR
    //     ( benuanta_pegawai.files.public=0 AND benuanta_pegawai.files.nama_bagian=${bagian} AND benuanta_pegawai.files.nama_unit IS NULL AND benuanta_pegawai.files.jabatan=${jabatan}) OR
    //     ( benuanta_pegawai.files.public=0 AND benuanta_pegawai.files.nama_bagian=${bagian} AND benuanta_pegawai.files.nama_unit=${unit} AND benuanta_pegawai.files.jabatan IS NULL) OR
    //     ( benuanta_pegawai.files.public=0 AND benuanta_pegawai.files.nama_bagian IS NULL AND benuanta_pegawai.files.nama_unit=${unit} AND benuanta_pegawai.files.jabatan=${jabatan}) OR
    //     ( benuanta_pegawai.files.public=0 AND benuanta_pegawai.files.nama_bagian=${bagian} AND benuanta_pegawai.files.nama_unit=${unit} AND benuanta_pegawai.files.jabatan=${jabatan}) OR
    //     ( benuanta_pegawai.files.nama_personalia=${nama})
    //     ) GROUP BY benuanta_pegawai.files.alias ORDER BY benuanta_pegawai.files.id DESC LIMIT ${startIndex},${limit}`);
    const dataFiles =
      await prisma.$queryRaw`SELECT * FROM benuanta_pegawai.files WHERE alias LIKE ${newParam} AND (
        (benuanta_pegawai.files.public=1 AND benuanta_pegawai.files.nama_unit IS NULL AND benuanta_pegawai.files.nama_bagian IS NULL AND benuanta_pegawai.files.jabatan IS NULL) OR 
        ( benuanta_pegawai.files.public=1 AND benuanta_pegawai.files.nama_bagian=${bagian} AND benuanta_pegawai.files.nama_unit IS NULL AND benuanta_pegawai.files.jabatan IS NULL) OR 
        ( benuanta_pegawai.files.public=1 AND benuanta_pegawai.files.nama_bagian IS NULL AND benuanta_pegawai.files.nama_unit=${unit} AND benuanta_pegawai.files.jabatan IS NULL) OR 
        ( benuanta_pegawai.files.public=1 AND benuanta_pegawai.files.nama_bagian IS NULL AND benuanta_pegawai.files.nama_unit IS NULL AND benuanta_pegawai.files.jabatan=${jabatan})  OR 
        ( benuanta_pegawai.files.public=1 AND benuanta_pegawai.files.nama_bagian=${bagian} AND benuanta_pegawai.files.nama_unit IS NULL AND benuanta_pegawai.files.jabatan=${jabatan}) OR 
        ( benuanta_pegawai.files.public=1 AND benuanta_pegawai.files.nama_bagian=${bagian} AND benuanta_pegawai.files.nama_unit=${unit} AND benuanta_pegawai.files.jabatan IS NULL) OR 
        ( benuanta_pegawai.files.public=1 AND benuanta_pegawai.files.nama_bagian IS NULL AND benuanta_pegawai.files.nama_unit=${unit} AND benuanta_pegawai.files.jabatan=${jabatan}) OR 
        ( benuanta_pegawai.files.public=1 AND benuanta_pegawai.files.nama_bagian=${bagian} AND benuanta_pegawai.files.nama_unit=${unit} AND benuanta_pegawai.files.jabatan=${jabatan}) OR 
        ( benuanta_pegawai.files.nama_personalia=${nama})
        ) GROUP BY benuanta_pegawai.files.alias ORDER BY benuanta_pegawai.files.id DESC LIMIT ${startIndex},${limit}`;

    const dataFilesJSON = JSON.parse(
      JSON.stringify(dataFiles, (key, value) =>
        typeof value === "bigint" ? parseInt(value.toString()) : value
      )
    );
    if (dataFilesJSON) {
      // console.log("data->", dataPenggunaJSON);
      return NextResponse.json(
        { error: [], message: "ok", data: dataFilesJSON, req },
        { status: httpStatus.Accepted }
      );
    }
  }

  return NextResponse.json(
    { error: [], message: "End" },
    { status: httpStatus.BadRequest }
  );
}
