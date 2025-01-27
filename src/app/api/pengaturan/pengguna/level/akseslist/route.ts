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

  const req = await request.json();
  console.log(req);
  const newParam = "%" + req.param + "%";
  const page = req.page;
  const limit = 10;
  const startIndex = (page - 1) * limit;
  console.log("startIndex->", startIndex);

  // return NextResponse.json(
  //   { error: [], message: "here", req, query },
  //   { status: httpStatus.BadRequest }
  // );

  const dataLevel =
    await prisma.$queryRaw`SELECT benuanta_pegawai.auth_permissions.name,benuanta_pegawai.auth_permissions.description,benuanta_pegawai.auth_permissions.id,ag.group_id,ag.permission_id FROM benuanta_pegawai.auth_permissions LEFT JOIN (SELECT benuanta_pegawai.auth_groups_permissions.* FROM benuanta_pegawai.auth_groups_permissions WHERE benuanta_pegawai.auth_groups_permissions.group_id=${req.id}) ag ON benuanta_pegawai.auth_permissions.id=ag.permission_id WHERE benuanta_pegawai.auth_permissions.name LIKE ${newParam} OR benuanta_pegawai.auth_permissions.description LIKE ${newParam} LIMIT ${startIndex},${limit}`;

  // return NextResponse.json(
  //   { error: [], message: "heree", dataLevel },
  //   { status: httpStatus.BadRequest }
  // );
  const dataLevelJSON = JSON.parse(
    JSON.stringify(dataLevel, (_, value) =>
      typeof value == "bigint" ? value.toString() : value
    )
  );
  if (dataLevelJSON) {
    console.log("data->", dataLevelJSON);
    return NextResponse.json(
      { error: [], message: "ok", data: dataLevelJSON, req },
      { status: httpStatus.Accepted }
    );
  }
  return NextResponse.json(
    { error: [], message: "dev", req },
    { status: httpStatus.BadRequest }
  );
}
