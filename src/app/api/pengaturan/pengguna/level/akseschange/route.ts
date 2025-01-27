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

  const req: { gid: number | null; pid: number | null; id: number } =
    await request.json();
  if (req.gid == 0 && req.id != 0 && req.pid !== 0) {
    // const dataGP = await prisma.auth_groups_permissions.findFirst({
    //   where: {
    //     group_id: req.id,
    //     permission_id: req.pid as number,
    //   },
    // });
    // if (dataGP) {
    // const del = await prisma.auth_groups_permissions.delete({
    //   where: {
    //     group_id: req.id,
    //     permission_id: req.pid as number,
    //   },
    // });

    // } else {
    const simpan = await prisma.auth_groups_permissions.create({
      data: {
        group_id: req.id,
        permission_id: req.pid as number,
      },
    });
    return NextResponse.json(
      { message: "Data Tersimpan", req },
      { status: httpStatus.Ok }
    );
    // }
  } else {
    const del =
      await prisma.$queryRaw`DELETE FROM benuanta_pegawai.auth_groups_permissions WHERE benuanta_pegawai.auth_groups_permissions.group_id=${req.id} AND benuanta_pegawai.auth_groups_permissions.permission_id=${req.pid}`;
    return NextResponse.json(
      { message: "Data Terhapus", req },
      { status: httpStatus.Ok }
    );
  }

  return NextResponse.json(
    { message: "Unauthorized", req },
    { status: httpStatus.Unauthorized }
  );
  //   if(req.id!==0){
  // const changeAkses=await prisma.auth_groups_permissions.findMany({where:{
  //   group_id
  // })
  // }
}
