import { prisma } from "@/lib/prisma";
import { percepatan_nrw } from "./../../../../../prisma/generated/client1/index.d";
import { authOptions } from "@/lib/auth";
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
  const req = await request.json();
  const newParam = "%" + req.param + "%";
  const page = req.page;
  const limit = 10;
  const startIndex = (page - 1) * limit;
  const dataPercepatan =
    await prisma.$queryRaw`SELECT * FROM benuanta_pegawai.percepatan_nrw where benuanta_pegawai.percepatan_nrw.nosamw LIKE ${newParam} OR benuanta_pegawai.percepatan_nrw.nama LIKE ${newParam} OR benuanta_pegawai.percepatan_nrw.telp LIKE ${newParam} OR benuanta_pegawai.percepatan_nrw.permasalahan LIKE ${newParam} OR benuanta_pegawai.percepatan_nrw.username LIKE ${newParam} LIMIT ${startIndex},${limit}`;
  const dataPercepatanJSON = JSON.parse(
    JSON.stringify(dataPercepatan, (key, value) =>
      typeof value === "bigint" ? parseInt(value.toString()) : value
    )
  );
  if (dataPercepatanJSON) {
    // console.log("data->", dataPenggunaJSON);
    return NextResponse.json(
      { error: [], message: "ok", data: dataPercepatanJSON, req },
      { status: httpStatus.Accepted }
    );
  }
  return NextResponse.json(
    { error: [], message: "dev", req },
    { status: httpStatus.BadRequest }
  );
}
