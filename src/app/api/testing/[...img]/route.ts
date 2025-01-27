import { createReadStream } from "fs";
import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
  const x = request.nextUrl.toString();
  const y = x.split("testing");
  const requestUrl = new URL(request.url).searchParams;
  const responseHeader = new Headers(request.headers);
  responseHeader.set("Content-Type", "image/jpeg");
  const MEDIA_ROOT_PATH = "./public";
  const stream = createReadStream(MEDIA_ROOT_PATH + y[1]);
  // return NextResponse.json({ message: y[1] });
  return new Response(stream as any, { headers: responseHeader });
}
