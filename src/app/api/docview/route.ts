// import { NextResponse } from "next/server";
// import { pdf2base64 } from "pdf-to-base64";

import { NextResponse } from "next/server";

// type pdf2base64 = any;
export function GET() {
  return NextResponse.json(
    { message: "document" },
    { status: 200, statusText: "ok" }
  );
  //   pdf2base64("/document/sampe.pdf")
  //     .then((res: any) => console.log("doc->", res))
  //     .catch((err: any) => console.error("doc->", err));
  //   return new NextResponse(`<h1>tes</h1>`, {
  //     status: 200,
  //     headers: { "content-type": "text/html" },
  //   });
}
