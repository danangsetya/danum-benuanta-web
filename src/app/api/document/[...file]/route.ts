import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { httpStatus } from "@/lib/utils";
import { createReadStream } from "fs";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // console.log("x");
  // return NextResponse.json({ message: "Ok" }, { status: httpStatus.Accepted });

  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: httpStatus.Unauthorized }
    );

  const x = request.nextUrl.toString();
  const y = x.split("document");
  const z = y[1].split("/");
  const namaFileWType = z[z.length - 1];
  // const namaFile = namaFileWType.split(".")[0];
  const namaFile = namaFileWType;
  // console.log(y);
  // console.log(namaFile);
  const dataFile = await prisma.files.findFirst({
    where: {
      nama_file: {
        startsWith: namaFile,
      },
    },
  });
  // console.log(dataFile);
  if (dataFile && dataFile.type) {
    // const requestUrl = new URL(request.url).searchParams;
    const responseHeader = new Headers(request.headers);
    responseHeader.set("Content-Type", "image/jpeg");
    const MEDIA_ROOT_PATH = "./public";
    // const image = y[1].replace("%20", " ");
    // console.log("media_root_path",MEDI)
    const stream = createReadStream(MEDIA_ROOT_PATH + dataFile.path);
    return new Response(stream as any, { headers: responseHeader });

    // return NextResponse.json({ message: y[1] });
  }
  return NextResponse.json({ message: "Ok" }, { status: httpStatus.Accepted });
}
