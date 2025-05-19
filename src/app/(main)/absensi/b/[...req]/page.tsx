import AbsenLapor from "@/components/pages/absenLapor";
import { authOptions } from "@/lib/auth";
import { nowTrimDateTimeHM } from "@/lib/utils";
import { parse } from "date-fns/fp";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { req: string[] } }) {
  const status = atob(params.req[0].toString().replaceAll("%3D", "="));
  const name = atob(params.req[1].toString().replaceAll("%3D", "="));
  const personalia_id = atob(params.req[2].toString().replaceAll("%3D", "="));
  const user_id = atob(params.req[3].toString().replaceAll("%3D", "="));
  const facial_id = params.req[4].toString();
  const timestamp = atob(params.req[5].toString());
  const session = await getServerSession(authOptions);
  const tmp = JSON.parse(session?.user?.email as string);

  console.log("profil->", tmp.profil);
  // console.log("session->", session);
  console.log(tmp.profil.nama);
  console.log(name);
  const itimestamp = parseInt(timestamp);
  const inow = parseInt(nowTrimDateTimeHM());
  console.log("timestamp->", timestamp, nowTrimDateTimeHM());
  const aSelisih =
    itimestamp - inow < 0 ? (itimestamp - inow) * -1 : itimestamp - inow;
  console.log("selisih", aSelisih);
  if (aSelisih > 2) {
    return (
      <div className="flex flex-col min-h-[90vh]  justify-center items-center p-3 space-y-2.5">
        <h1 className="text-center">Absen Gagal/Kadaluarsa Mohon Coba Lagi</h1>
        <Link
          href="/absensi/personal"
          className="bg-green-700 text-slate-50 font-bold p-2 rounded-xl"
        >
          Coba Lagi
        </Link>
      </div>
    );
  } else {
    if (tmp.profil.nama == name) {
      console.log("sama");

      return (
        <div className="flex flex-col min-h-[90vh]  justify-center items-center p-3 space-y-2.5">
          <h1 className="text-center">Absen Processing...</h1>
          <AbsenLapor
            bUrl={process.env.BACK_URL as string}
            status={status}
            stamp={nowTrimDateTimeHM()}
            fid={facial_id}
            user_id={parseInt(user_id)}
            id={parseInt(personalia_id)}
          />
          {/* <Link
              href="/absensi/personal"
              className="bg-green-700 text-slate-50 font-bold p-2 rounded-xl"
            >
              Kembali
            </Link> */}
        </div>
      );
    } else {
      return (
        <div className="flex flex-col min-h-[90vh]  justify-center items-center p-3 space-y-2.5">
          <h1 className="text-center">
            Absen Gagal, karena menggunakan matrix wajah {name}
          </h1>
          <Link
            href="/absensi/personal"
            className="bg-green-700 text-slate-50 font-bold p-2 rounded-xl"
          >
            Kembali
          </Link>
        </div>
      );
    }
    return <div></div>;
  }
}
