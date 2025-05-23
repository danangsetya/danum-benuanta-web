import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { httpStatus } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { StringLiteral } from "typescript";
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: httpStatus.Unauthorized }
    );
  type reqT = { nama: string; desk: string; id: number };
  const req: reqT = await request.json();
  const idI: number = req.id * 1;
  if (req.nama !== "" && req.desk !== "" && req.id !== 0) {
    const levelUpdate = await prisma.auth_permissions.update({
      data: {
        name: req.nama,
        description: req.desk,
      },
      where: {
        id: idI,
      },
    });
    if (levelUpdate) {
      return NextResponse.json(
        { message: "Data Tersimpan" },
        { status: httpStatus.Ok }
      );
    }
  }
  return NextResponse.json(
    { message: "Bad Request", req },
    { status: httpStatus.BadRequest, statusText: "Bad Request" }
  );
}
