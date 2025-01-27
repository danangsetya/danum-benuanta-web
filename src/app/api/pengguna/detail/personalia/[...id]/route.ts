import { pelatihan } from "./../../../../../../../prisma/generated/client1/index.d";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { httpStatus, toJson } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: httpStatus.Unauthorized }
    );
  const x = request.nextUrl.toString();
  const y = x.split("personalia/");
  console.log("url->", y[1]);
  if (y.length > 0) {
    const dataKeluarga = await prisma.keluarga.findMany({
      where: {
        id_personalia: parseInt(y[1]),
      },
    });
    const dataPelatihan = await prisma.pelatihan.findMany({
      where: {
        id_personalia: parseInt(y[1]),
      },
    });
    const dataPendidikan = await prisma.pendidikan.findMany({
      where: {
        id_personalia: parseInt(y[1]),
      },
    });
    const dataSk = await prisma.sk.findMany({
      where: {
        id_personalia: parseInt(y[1]),
      },
    });
    const dataKarir = await prisma.karir.findMany({
      where: {
        id_personalia: parseInt(y[1]),
      },
    });
    console.log("dataPelatihan->", dataPelatihan);
    return NextResponse.json(
      {
        message: "Ok",
        pendidikan: toJson(dataPendidikan),
        keluarga: toJson(dataKeluarga),
        pelatihan: toJson(dataPelatihan),
        sk: toJson(dataSk),
        karir: toJson(dataKarir),
      },
      { status: httpStatus.Accepted }
    );
  }
  return NextResponse.json(
    { message: "End" },
    { status: httpStatus.BadRequest }
  );
}
