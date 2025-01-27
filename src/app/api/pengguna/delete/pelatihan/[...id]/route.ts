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
  const y = x.split("pelatihan/");
  if (y.length > 0) {
    const dataPelatihan = await prisma.pelatihan.findFirst({
      where: {
        id: parseInt(y[1]),
      },
    });
    console.log("dataPelatihan->", dataPelatihan);
    if (dataPelatihan) {
      const idPersonalia = dataPelatihan.id_personalia;
      if (dataPelatihan.file_pelatihan !== null) {
        const z = dataPelatihan.file_pelatihan?.split("/");
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
      await prisma.pelatihan.delete({
        where: {
          id: dataPelatihan.id,
        },
      });
      const pelatihanRes = await prisma.pelatihan.findMany({
        where: {
          id_personalia: idPersonalia,
        },
      });
      return NextResponse.json({
        message: "Ok",
        pelatihan: toJson(pelatihanRes),
      });
    }
  }

  return NextResponse.json({ message: "End" });
}
