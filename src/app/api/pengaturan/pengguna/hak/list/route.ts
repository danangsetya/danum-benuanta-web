import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { httpStatus } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // const session = await getServerSession(authOptions);
  // if (!session)
  //   return NextResponse.json(
  //     { message: "Unauthorized" },
  //     { status: httpStatus.Unauthorized }
  //   );

  const req = await request.json();
  console.log(req);
  const newParam = "%" + req.param + "%";
  const page = req.page;
  const limit = 10;
  const startIndex = (page - 1) * limit;
  console.log("startIndex->", startIndex);
  const dataLevel =
    await prisma.$queryRaw`SELECT benuanta_pegawai.auth_groups.name,benuanta_pegawai.auth_groups_users.group_id,benuanta_pegawai.users.id,benuanta_pegawai.users.email,benuanta_pegawai.users.username,benuanta_pegawai.users.active FROM benuanta_pegawai.auth_groups_users,benuanta_pegawai.users,benuanta_pegawai.auth_groups WHERE benuanta_pegawai.auth_groups_users.user_id=benuanta_pegawai.users.id AND benuanta_pegawai.auth_groups_users.group_id=benuanta_pegawai.auth_groups.id AND (benuanta_pegawai.auth_groups.name LIKE ${newParam} OR benuanta_pegawai.users.username LIKE ${newParam}) LIMIT ${startIndex},${limit}`;
  const dataLevelJSON = JSON.parse(
    JSON.stringify(dataLevel, (_, value) =>
      typeof value == "bigint" ? value.toString() : value
    )
  );
  if (dataLevelJSON) {
    // console.log("data->", dataLevelJSON);
    //query: `SELECT benuanta_pegawai.auth_groups.name,benuanta_pegawai.auth_groups_users.group_id,benuanta_pegawai.users.id,benuanta_pegawai.users.email,benuanta_pegawai.users.username,benuanta_pegawai.users.active FROM benuanta_pegawai.auth_groups_users,benuanta_pegawai.users,benuanta_pegawai.auth_groups WHERE benuanta_pegawai.auth_groups_users.user_id=benuanta_pegawai.users.id AND benuanta_pegawai.auth_groups_users.group_id=benuanta_pegawai.auth_groups.id AND benuanta_pegawai.auth_groups.name LIKE ${newParam} OR benuanta_pegawai.users.username LIKE ${newParam} LIMIT ${startIndex},${limit}`,
    return NextResponse.json(
      {
        error: [],
        message: "ok",
        data: dataLevelJSON,
        req,
      },
      { status: httpStatus.Accepted }
    );
  }
  return NextResponse.json(
    { error: [], message: "dev", req },
    { status: httpStatus.BadRequest }
  );
}
