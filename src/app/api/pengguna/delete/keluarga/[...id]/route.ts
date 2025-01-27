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
  const y = x.split("keluarga/");
  if (y.length > 0) {
    const dataKeluarga = await prisma.keluarga.findFirst({
      where: {
        id: parseInt(y[1]),
      },
    });
    console.log("dataKeluarga->", dataKeluarga);
    if (dataKeluarga) {
      const idPersonalia = dataKeluarga.id_personalia;

      await prisma.keluarga.delete({
        where: {
          id: dataKeluarga.id,
        },
      });
      const keluargaRes = await prisma.keluarga.findMany({
        where: {
          id_personalia: idPersonalia,
        },
      });
      return NextResponse.json({
        message: "Ok",
        keluarga: toJson(keluargaRes),
      });
    }
  }

  return NextResponse.json({ message: "End" });
}
