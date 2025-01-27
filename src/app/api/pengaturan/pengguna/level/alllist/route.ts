import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { httpStatus } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: httpStatus.Unauthorized }
    );
  // return NextResponse.json(
  //   { error: [], message: "xxx" },
  //   { status: httpStatus.BadRequest }
  // );
  const dataLevel =
    await prisma.$queryRaw`SELECT benuanta_pegawai.auth_groups.* FROM benuanta_pegawai.auth_groups`;
  const dataLevelJSON = JSON.parse(
    JSON.stringify(dataLevel, (_, value) =>
      typeof value == "bigint" ? value.toString() : value
    )
  );
  if (dataLevelJSON) {
    // console.log("data->", dataLevelJSON);
    return NextResponse.json(
      { error: [], message: "ok", data: dataLevelJSON },
      { status: httpStatus.Accepted }
    );
  }
  return NextResponse.json(
    { error: [], message: "dev" },
    { status: httpStatus.BadRequest }
  );
}
