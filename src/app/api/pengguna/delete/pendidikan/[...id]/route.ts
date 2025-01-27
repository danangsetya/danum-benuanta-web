import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { httpStatus, toJson } from "@/lib/utils";
import { rm } from "fs/promises";
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
  const y = x.split("pendidikan/");
  if (y.length > 0) {
    const dataPendidikan = await prisma.pendidikan.findFirst({
      where: {
        id: parseInt(y[1]),
      },
    });
    console.log("dataPendidikan->", dataPendidikan);
    if (dataPendidikan) {
      const idPersonalia = dataPendidikan.id_personalia;
      if (dataPendidikan.file_pendidikan !== null) {
        const z = dataPendidikan.file_pendidikan?.split("/");
        if (z?.length > 0) {
          const namaFile = z[z.length - 1];
          console.log("namaFile->", namaFile);
          const dataFiles = await prisma.files.findMany({
            where: {
              alias: namaFile,
            },
          });
          if (dataFiles.length > 0) {
            console.log("allDataFiles->", dataFiles);
            dataFiles.forEach(async (item) => {
              console.log("item->", item);
              try {
                const de = await rm(`public${item.path}`);
                console.log("success delete->", de);
              } catch (error) {
                console.log("error delete->", error);
              }
              await prisma.files.delete({
                where: {
                  id: item.id,
                },
              });
            });
          }
        }
      }
      await prisma.pendidikan.delete({
        where: {
          id: dataPendidikan.id,
        },
      });
      const pendidikanRes = await prisma.pendidikan.findMany({
        where: {
          id_personalia: idPersonalia,
        },
      });
      return NextResponse.json({
        message: "Ok",
        pendidikan: toJson(pendidikanRes),
      });
    }
  }

  return NextResponse.json({ message: "End" });
}
