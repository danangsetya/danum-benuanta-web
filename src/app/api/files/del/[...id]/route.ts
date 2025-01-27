import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { httpStatus } from "@/lib/utils";
import { rm } from "fs/promises";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: httpStatus.Unauthorized }
    );

  const x = request.nextUrl.toString();
  const y = x.split("del/");
  if (y.length > 0) {
    const dataFiles = await prisma.files.findFirst({
      where: {
        id: parseInt(y[1]),
      },
    });
    if (dataFiles) {
      const dataFilesAl = await prisma.files.findMany({
        where: {
          alias: dataFiles.alias,
        },
      });
      if (dataFilesAl) {
        dataFilesAl.forEach(async (item) => {
          try {
            const de = await rm(`public${item.path}`);
            console.log("success delete->", de);
          } catch (error) {
            console.log("error delete->", error);
          }
          await prisma.files.delete({
            where: {
              id: item.id,
            },
          });
        });
        return NextResponse.json({
          message: "Ok",
        });
      }
    }
  }
  return NextResponse.json({ message: "End" });
}
