import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { httpStatus } from "@/lib/utils";
import { genSalt } from "bcryptjs";
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
  // console.log(req)
  if (req.id !== "") {
    // const salt = await genSalt(10);
    // const userHash = await hash("123456", salt);
    try {
      const dataUsers = await prisma.users.findFirst({
        where: {
          id: parseInt(req.id),
        },
      });
      // console.log(dataUsers?.id_personalia);

      if (dataUsers) {
        // await prisma.users.update({
        //   where: {
        //     id: parseInt(req.id),
        //   },
        //   data: {
        //     activate_hash: "",
        //     v2_hash: "",
        //   },
        // });
        await prisma.personalia.update({
          where: {
            id: dataUsers.id_personalia,
          },
          data: {
            id_mesin_absen: "valid",
          },
        });
      }
      // await prisma.personalia.update()
      // console.log(dataUpdate);
      return NextResponse.json(
        { message: "Device Berhasil di Verifikasi" },
        { status: httpStatus.Ok }
      );
    } catch (error) {
      return NextResponse.json(
        { req, error },
        { status: httpStatus.BadRequest }
      );
    }
  }
  return NextResponse.json({ req }, { status: httpStatus.BadRequest });
}
