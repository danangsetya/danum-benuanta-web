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
  const req = await request.json();
  console.log(req);
  const newParam = "%" + req.param + "%";
  const page = req.page;
  const limit = 10;
  const startIndex = (page - 1) * limit;
  const dataPesan =
    await prisma.$queryRaw`SELECT billtarakan.pesan.*, count(wa_log.id) as terkirim FROM billtarakan.pesan LEFT JOIN billtarakan.wa_log ON billtarakan.pesan.id=billtarakan.wa_log.id_pesan  WHERE pesan LIKE ${newParam} GROUP BY billtarakan.pesan.id ORDER BY id DESC LIMIT ${startIndex},${limit} `;

  // );
  const dataPesanJSON = JSON.parse(
    JSON.stringify(dataPesan, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
  if (dataPesanJSON) {
    // console.log("data->", dataPesanJSON);
    return NextResponse.json(
      { error: [], message: "ok", data: dataPesanJSON, req },
      { status: httpStatus.Accepted }
    );
  }

  //data: dataPesan,
  return NextResponse.json(
    { error: [], message: "end", data: [] },
    { status: httpStatus.BadRequest }
  );
}
