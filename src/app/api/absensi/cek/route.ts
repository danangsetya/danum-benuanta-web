import { authOptions } from "@/lib/auth";
import { permissionT, profilT } from "@/lib/types";
import { httpStatus } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session=await getServerSession(authOptions)
   if (!session)
          return NextResponse.json(
            { message: "Unauthorized" },
            { status: httpStatus.Unauthorized }
          );
  const userData:{permissions:permissionT[],profil:profilT} = JSON.parse(session?.user?.email as string);
  
  return NextResponse.json({ message: "End" });
}
