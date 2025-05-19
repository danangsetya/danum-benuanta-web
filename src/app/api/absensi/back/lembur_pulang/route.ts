import { authOptions } from "@/lib/auth";
import { httpStatus } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const req: {
    stamp: string;
    fid: string;
    user_id: number;
    id: number;
    url: string;
  } = await request.json();
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: httpStatus.Unauthorized }
    );
  try {
    const result = await fetch(req.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        stamp: req.stamp,
        fid: req.fid,
        user_id: req.user_id,
        id: req.id,
      }),
    }).then((res) => res.json());
    if (result.message == "Ok") {
      return NextResponse.json({ message: "Ok" });
      //   // alert("Absen Berhasil di catat oleh Sistem");
      //   setDialog(true);
      //   setTimeout(() => {
      //     console.log("redirect");
      //     redirect("/absensi/histori");
      //   }, 1000);
    }
  } catch (error) {
    console.log("err absen datang->", error);
  }

  return NextResponse.json({ message: "End" }, { statusText: "Bad Request" });
}
