import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { httpStatus } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // const session = await getServerSession(authOptions);
  // if (!session)
  //   return NextResponse.json(
  //     { message: "Unauthorized" },
  //     { status: httpStatus.Unauthorized }
  //   );

  const req = await request.nextUrl.searchParams.get("id");
  if (req) {
    const id = parseInt(req);
    const countPesan =
      await prisma.$queryRaw`SELECT count(id) as jumlah FROM billtarakan.wa_log WHERE nosamw!='-' AND id_pesan=${id} GROUP BY id_pesan`;
    // console.log(countPesan);
    if (countPesan) {
      const countPesanJSON = JSON.parse(
        JSON.stringify(countPesan, (key, value) => {
          // console.log(value);
          return typeof value === "bigint" ? value.toString() : value;
        })
      );
      if (countPesanJSON[0] !== undefined) {
        return NextResponse.json(
          { message: "Ok", terkirim: countPesanJSON[0].jumlah },
          { status: httpStatus.Ok }
        );
      } else {
        return NextResponse.json(
          { message: "Ok", terkirim: 0 },
          { status: httpStatus.Ok }
        );
      }
    }
    // const deletePesan = await prisma.pesan.delete({
    //   where: {
    //     id: parseInt(req),
    //   },
    // });
    // if (deletePesan)
    //   return NextResponse.json(
    //     { message: "Pesan Di Hapus" },
    //     { status: httpStatus.Ok }
    //   );
  }

  // console.log("req get->", req);
  return NextResponse.json(
    { message: "Unauthorized" },
    { status: httpStatus.Unauthorized }
  );
}
