import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { httpStatus } from "@/lib/utils";
import { genSalt, hash } from "bcryptjs";
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
    const salt = await genSalt(10);
    const userHash = await hash("123456", salt);
    try {
      const data = await prisma.users.findFirst({
        where: {
          id: parseInt(req.id),
        },
      });
      if (data?.username !== undefined && data?.username !== "") {
        const del = await prisma.sessions.deleteMany({
          where: {
            username: data?.username as string,
          },
        });
        console.log(data?.username);
        return NextResponse.json({ message: "Ok" }, { status: httpStatus.Ok });
      }
      // const dataUpdate = await prisma.users.update({
      //   where: {
      //     id: parseInt(req.id),
      //   },
      //   data: {
      //     password_hash: userHash,
      //   },
      // });
      console.log(data?.username);
      return NextResponse.json({ message: "gagal" }, { status: httpStatus.Ok });
    } catch (error) {
      return NextResponse.json(
        { req, error },
        { status: httpStatus.BadRequest }
      );
    }
  }
  return NextResponse.json({ req }, { status: httpStatus.BadRequest });
}
