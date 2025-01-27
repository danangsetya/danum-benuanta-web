import { authOptions } from "@/lib/auth";
import { httpStatus, now, nowTrim } from "@/lib/utils";
import md5 from "md5";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: httpStatus.Unauthorized }
    );

  const req: { data: string } = await request.json();
  // const param = "0853";
  // const page = 1;
  // const token = "e79ba647ff4ec37523b2f67f802737e7";
  // const plain = `${param}-${page}-${nowTrim}`;
  const date = new Date();
  const nowTrimL = `${date.getFullYear()}${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`;
  const timeL = `${date.getHours().toString()}:${date
    .getMinutes()
    .toString()}:${date.getSeconds().toString()}`;
  const token = md5(`${req.data}-${nowTrimL}`);
  console.log(`${req.data}-${nowTrimL}-${timeL}`);
  try {
    const result = await fetch(
      "https://tirtaalamtarakan.co.id/my/public/tirtaalamku/resetpass",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: req.data, token }),
      }
    ).then((res) => res.json());
    if (result) console.log("res reset->", result);
    if (result.response == 200) {
      return NextResponse.json(
        { message: "Ok", response: 200 },
        { status: httpStatus.Ok }
      );
    }
  } catch (error) {
    console.log("fetch error->", error);
  }
  // .then((res) => {
  //   if (res.data) {
  //     console.log("res", res.data);
  //     return NextResponse.json(
  //       { message: "Ok", data: res.data },
  //       { status: httpStatus.BadRequest }
  //     );
  //   }
  // })
  // .catch((err) => console.log("err", err))
  // .finally(() => {});
  return NextResponse.json(
    { message: "Bad Request" },
    { status: httpStatus.BadRequest }
  );
}
