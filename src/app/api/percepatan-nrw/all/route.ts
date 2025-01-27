import { prisma } from "@/lib/prisma";
import { percepatan_nrw } from "./../../../../../prisma/generated/client1/index.d";
import { authOptions } from "@/lib/auth";
import { httpStatus } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: httpStatus.Unauthorized }
    );
  const dataPercepatan =
    await prisma.$queryRaw`SELECT * FROM benuanta_pegawai.percepatan_nrw`;
  const dataPercepatanJSON = JSON.parse(
    JSON.stringify(dataPercepatan, (key, value) =>
      typeof value === "bigint" ? parseInt(value.toString()) : value
    )
  );
  if (dataPercepatanJSON) {
    // console.log("data->", dataPenggunaJSON);
    return NextResponse.json(
      { error: [], message: "Ok", data: dataPercepatanJSON },
      { status: httpStatus.Accepted }
    );
  }
  return NextResponse.json(
    { error: [], message: "End" },
    { status: httpStatus.BadRequest }
  );
}
