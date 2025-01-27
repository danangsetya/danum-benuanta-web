import { authOptions } from "@/lib/auth";
import { httpStatus } from "@/lib/utils";
import { createReadStream } from "fs";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // const session = await getServerSession(authOptions);
  // if (!session)
  //   return NextResponse.json(
  //     { message: "Unauthorized" },
  //     { status: httpStatus.Unauthorized }
  //   );
  const x = request.nextUrl.toString();
  const y = x.split("/image");
  const requestUrl = new URL(request.url).searchParams;
  const responseHeader = new Headers(request.headers);
  responseHeader.set("Content-Type", "image/jpeg");
  const MEDIA_ROOT_PATH = "./public";
  // console.log("xxx->", y, y[1]);
  const image = y[1].replace("%20", " ");
  const stream = createReadStream(MEDIA_ROOT_PATH + image);
  // return NextResponse.json({ message: y[1] });
  return new Response(stream as any, { headers: responseHeader });
}
