import { prisma } from "@/lib/prisma";
import { httpStatus } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const req = await request.json();
  if (req.id_personalia && req.from && req.to) {
    if (req.id_personalia !== 0 && req.from !== "" && req.to !== "") {
      const dataAbsen =
        await prisma.$queryRaw`SELECT * FROM benuanta_pegawai.absensi WHERE id_personalia=${req.id_personalia} AND benuanta_pegawai.absensi.tanggal BETWEEN ${req.from} AND ${req.to}`;
      const dataAbsenToJson = JSON.parse(
        JSON.stringify(dataAbsen, (_, value) =>
          typeof value == "bigint" ? value.toString() : value
        )
      );
      const dataPersonalia = await prisma.personalia.findFirst({
        select: {
          nama: true,
          nik: true,
        },
        where: {
          id: parseInt(req.id_personalia),
        },
      });
      const dataPersonaliaToJson = JSON.parse(
        JSON.stringify(dataPersonalia, (_, value) =>
          typeof value == "bigint" ? value.toString() : value
        )
      );
      return NextResponse.json(
        { req: req, absensi: dataAbsenToJson, profil: dataPersonaliaToJson },
        { status: httpStatus.Ok, statusText: "Ok" }
      );
    }
  }
  return NextResponse.json(
    { message: "Bad Request" },
    { status: httpStatus.BadRequest, statusText: "Bad Request" }
  );
}
