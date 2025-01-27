import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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

  const req = await request.nextUrl.searchParams.get("id");
  if (req) {
    const deletePesan = await prisma.pesan.delete({
      where: {
        id: parseInt(req),
      },
    });
    if (deletePesan)
      return NextResponse.json(
        { message: "Pesan Di Hapus" },
        { status: httpStatus.Ok }
      );
  }

  // console.log("req get->", req);
  return NextResponse.json(
    { message: "Unauthorized" },
    { status: httpStatus.Unauthorized }
  );
}
