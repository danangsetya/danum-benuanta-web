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
  const dataPengguna =
    await prisma.$queryRaw`SELECT benuanta_pegawai.users.id,benuanta_pegawai.users.username,benuanta_pegawai.users.email,benuanta_pegawai.personalia.nama FROM benuanta_pegawai.users INNER JOIN benuanta_pegawai.personalia ON benuanta_pegawai.users.id_personalia=benuanta_pegawai.personalia.id LEFT JOIN (SELECT benuanta_pegawai.auth_groups_users.* FROM benuanta_pegawai.auth_groups_users) ags ON benuanta_pegawai.users.id=ags.user_id WHERE ags.user_id IS NULL AND (benuanta_pegawai.users.username LIKE ${newParam} OR benuanta_pegawai.users.email LIKE ${newParam} OR benuanta_pegawai.personalia.nama LIKE ${newParam}) LIMIT ${startIndex},${limit} `;
  const dataPenggunaJSON = JSON.parse(
    JSON.stringify(dataPengguna, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
  if (dataPenggunaJSON) {
    // console.log("data->", dataPenggunaJSON);
    return NextResponse.json(
      { error: [], message: "ok", data: dataPenggunaJSON, req },
      { status: httpStatus.Accepted }
    );
  }
  return NextResponse.json(
    { error: [], message: "dev", req },
    { status: httpStatus.BadRequest }
  );
}
