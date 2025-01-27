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
        fetch(
          "https://api.faceio.net/deletefacialid/?key=ac17a21050d3920097a86986c8bbd6b4&fid=" +
            req.face,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((resC) => resC.json())
          .then(async (resCek) => {
            if (resCek.status) {
              await prisma.users.update({
                where: {
                  id: parseInt(req.id),
                },
                data: {
                  activate_hash: "",
                  v2_hash: "",
                },
              });
              await prisma.personalia.update({
                where: {
                  id: dataUsers.id_personalia,
                },
                data: {
                  hash: "",
                },
              });
            }
            // console.log("test->", res);
          })
          .catch((err) => console.log("err test->", err));
      }
      // await prisma.personalia.update()
      // console.log(dataUpdate);
      return NextResponse.json(
        { message: "Matrix Wajah Berhasil di Hapus" },
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
