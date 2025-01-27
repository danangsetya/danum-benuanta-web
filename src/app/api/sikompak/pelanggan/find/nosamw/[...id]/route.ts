import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const req = await request.nextUrl.toString();
  const pr = req.split("nosamw/");
  if (pr.length > 1) {
    console.log("req->", pr[1]);
  }

  return NextResponse.json({ message: "End" });
}
