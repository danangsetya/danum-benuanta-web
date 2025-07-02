import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const req:{hash:string} = await request.json();


  return NextResponse.json({ message: "End" });
}
