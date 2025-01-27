import { httpStatus } from "@/lib/utils";
import { createReadStream } from "fs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const responseHeader = new Headers(request.headers);
  const requestUrl = new URL(request.url).searchParams;
  const path = requestUrl.get("im");
  const MEDIA_ROOT_PATH = "./public";

  responseHeader.set("Content-Type", "image/jpeg");
  const stream = createReadStream(
    MEDIA_ROOT_PATH + "/content/2024/07/happy-new-1080x.jpeg"
  );
  return new Response(stream as any, { headers: responseHeader });
  // const data = {
  //   user: 66,
  //   name: "danang",
  // };
  // const stringi = JSON.stringify(data);
  // const x = btoa(stringi);
  // return NextResponse.json(
  //   {
  //     message: x,
  //   },
  //   { status: httpStatus.Forbidden }
  // );
}
