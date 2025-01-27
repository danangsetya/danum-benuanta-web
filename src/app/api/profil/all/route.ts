import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { httpStatus, toJson } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: httpStatus.Unauthorized }
    );

  if (session) {
    const t = JSON.parse(session.user?.email as string);
    // console.log(t.profil);
    const dPersonalia = await prisma.personalia.findFirst({
      where: {
        username: t.profil.uname,
      },
    });
    // console.log("dPersonalia->", dPersonalia);
    if (dPersonalia) {
      const dataKeluarga = await prisma.keluarga.findMany({
        where: {
          id_personalia: dPersonalia.id,
        },
      });
      const dataPelatihan = await prisma.pelatihan.findMany({
        where: {
          id_personalia: dPersonalia.id,
        },
      });
      const dataPendidikan = await prisma.pendidikan.findMany({
        where: {
          id_personalia: dPersonalia.id,
        },
      });
      const dataSk = await prisma.sk.findMany({
        where: {
          id_personalia: dPersonalia.id,
        },
      });
      const dataKarir = await prisma.karir.findMany({
        where: {
          id_personalia: dPersonalia.id,
        },
      });
      // console.log("dataPelatihan->", dataPelatihan);
      return NextResponse.json(
        {
          message: "Ok",
          personalia: toJson(dPersonalia),
          pendidikan: toJson(dataPendidikan),
          keluarga: toJson(dataKeluarga),
          pelatihan: toJson(dataPelatihan),
          sk: toJson(dataSk),
          karir: toJson(dataKarir),
        },
        { status: httpStatus.Ok }
      );
    }
    return NextResponse.json(
      { message: "Ok" },
      { status: httpStatus.Accepted }
    );
  }
  return NextResponse.json({ message: "End" }, { status: httpStatus.Accepted });
}
