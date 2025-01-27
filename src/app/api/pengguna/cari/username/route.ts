import { prisma } from "@/lib/prisma";
import { httpStatus } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const uname = await request.nextUrl.searchParams.get("uname");
  // const wname = "%" + uname + "%";
  try {
    // const dataName =
    //   await prisma.$queryRaw`SELECT * FROM  benuanta_pegawai.users WHERE username LIKE ${wname}`;
    const dataName = await prisma.users.findUnique({
      where: {
        username: uname as string,
      },
    });
    // console.log("username", uname);

    const dataJson = JSON.parse(
      JSON.stringify(dataName, (_, v) =>
        typeof v === "bigint" ? v.toString : v
      )
    );
    // console.log("data->", dataJson);
    return NextResponse.json(
      { message: "ok", data: dataJson },
      { status: httpStatus.Ok }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Bad Request" },
      { status: httpStatus.BadRequest }
    );
  }
}
