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

  return NextResponse.json({ message: "End" });
}
