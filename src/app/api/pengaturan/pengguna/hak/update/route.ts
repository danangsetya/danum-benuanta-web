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
  type reqT = { gid: number; id: number };
  const req: reqT = await request.json();
  const idI: number = req.id * 1;

  if (req.gid !== 0 && req.id !== 0) {
    // const levelUpdate = await prisma.auth_groups_users.update({
    //   data: {
    //     group_id: req.gid,
    //   },
    //   where: {
    //     user_id: req.id,
    //     group_id: req.gid,
    //   },
    // });
    const update =
      await prisma.$queryRaw`UPDATE benuanta_pegawai.auth_groups_users SET benuanta_pegawai.auth_groups_users.group_id=${req.gid} WHERE benuanta_pegawai.auth_groups_users.user_id=${req.id}`;
    if (update) {
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
