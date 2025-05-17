import { platform } from "os";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  console.log("session->", session);
  if (!session) {
    return NextResponse.json(
      { message: "Bad Request" },
      { statusText: "Bad Request" }
    );
  }
  type dataG = {
    uuid: string;
    device: string;
    platform: string;
    lat: number;
    lon: number;
  };
  const req: dataG = await request.json();
  console.log("request->", req);
  const uri = process.env.BACK_URL + "verify_lokasi/2";
  console.log("uri->", uri, {
    uname: session.user?.name,
    // device: req.device,
    // platform: req.platform,
    lat: req.lat,
    lon: req.lon,
  });
  const res = await fetch(uri, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uname: session.user?.name,
      // device: req.device,
      // platform: req.platform,
      lat: req.lat,
      lon: req.lon,
    }),
  }).then((res) => res.json());
  if (res) {
    return NextResponse.json(
      {
        message: res.message,
        distance: res.distance,
        nama_lokasi: res.nama_lokasi,
      },
      { statusText: "Ok" }
    );
  }
  // .then((res) => res.json())
  //   .then((res) => {
  //     console.log("res verify->", res);
  //     return NextResponse.json(
  //       {
  //         message: res.message,
  //         distance: res.distance,
  //         nama_lokasi: res.nama_lokasi,
  //       },
  //       { statusText: "Ok" }
  //     );
  //   })
  //   .finally(() => {
  //     return NextResponse.json(
  //       { message: "Ok" },
  //       { statusText: "Bad Request" }
  //     );
  //   });
  return NextResponse.json({ message: "End" }, { statusText: "End" });
}
