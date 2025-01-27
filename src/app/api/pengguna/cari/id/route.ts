import { prisma } from "@/lib/prisma";
import { httpStatus } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  const req: { user: number; name: string } = await request.json();
  console.log(req);
  const userData = await prisma.personalia.findUnique({
    where: { username: req.name, id: req.user * 1 },
  });
  if (userData) {
    const dataJson = JSON.parse(
      JSON.stringify(userData, (_, v) =>
        typeof v === "bigint" ? v.toString : v
      )
    );
    console.log("userData->", {
      personalia: dataJson.id,
      hash: dataJson.hash,
    });
    return NextResponse.json(
      {
        personalia: dataJson.id,
        hash: dataJson.hash,
        id_mesin_absen: dataJson.id_mesin_absen,
      },
      { status: httpStatus.Accepted }
    );
  } else {
    return NextResponse.json(
      { personalia: null, hash: null, id_mesin_absen: null },
      { status: httpStatus.BadRequest }
    );
  }
}
