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
  const req: { nama: string; desk: string } = await request.json();
  if (req.nama !== "" && req.desk !== "") {
    const levelAdd = await prisma.auth_permissions.create({
      data: {
        name: req.nama,
        description: req.desk,
      },
    });
    if (levelAdd) {
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
