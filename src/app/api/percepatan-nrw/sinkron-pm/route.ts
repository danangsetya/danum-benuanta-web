import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { percepatanNrwType } from "@/lib/types";
import { httpStatus } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: httpStatus.Unauthorized }
    );

  const pmkosong: percepatanNrwType[] =
    await prisma.$queryRaw`SELECT * FROM benuanta_pegawai.percepatan_nrw WHERE petugas IS NULL`;
  if (pmkosong.length > 0) {
    pmkosong.map(async (item, index) => {
      // console.log("nrw->", item.id, item.nama, item.nosamw);
      const result = await fetch(
        process.env.WAPHP_URL + "/pdamkerja/api/nosamw/" + item.nosamw,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((res) => res.json());
      if (result.data) {
        console.log("res=>", result);
        const update =
          await prisma.$queryRaw`UPDATE benuanta_pegawai.percepatan_nrw SET petugas=${result.data.petugas} WHERE nosamw=${item.nosamw}`;
      }
    });
    return NextResponse.json(
      { error: [], message: "Ok" },
      { status: httpStatus.Accepted }
    );
  }
  return NextResponse.json(
    { error: [], message: "End" },
    { status: httpStatus.BadRequest }
  );
}
