// import { prisma2 } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { httpStatus } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: httpStatus.Unauthorized }
      );
  // return NextResponse.json({ data: process.env.WAPHP_URL });
  const nosamw = await request.nextUrl.searchParams.get("nosamw");
  if (nosamw) {
    let data = null;
    const result = await fetch(
      process.env.WAPHP_URL + "/pdamkerja/api/nosamw/" + nosamw,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => res.json());
    if (result.data) {
      return NextResponse.json(result.data);
    }
    // .then((res) => {
    //   console.log(res.data);

    //   data = res.data;
    // })
    // .catch((err) => console.log("err->", err));
  }
  return NextResponse.json({ data: null });
}
