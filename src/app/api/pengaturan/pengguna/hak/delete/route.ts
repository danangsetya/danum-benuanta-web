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

  const id = await request.nextUrl.searchParams.get("id");
  const gid = await request.nextUrl.searchParams.get("gid");
  if (id && gid) {
    const del =
      await prisma.$queryRaw`DELETE FROM benuanta_pegawai.auth_groups_users WHERE benuanta_pegawai.auth_groups_users.group_id=${gid} AND benuanta_pegawai.auth_groups_users.user_id=${id}`;

    if (del)
      return NextResponse.json(
        { message: "Pesan Di Hapus" },
        { status: httpStatus.Ok }
      );
  }
  return NextResponse.json(
    { message: "Bad Request" },
    { status: httpStatus.BadRequest, statusText: "Bad Request" }
  );
}
