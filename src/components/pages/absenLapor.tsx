"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription } from "../ui/dialog";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";

export default function AbsenLapor({
  bUrl,
  stamp,
  fid,
  user_id,
  id,
  status,
}: {
  bUrl: string;
  stamp: string;
  fid: string;
  user_id: number;
  id: number;
  status: string;
}) {
  const [dialog, setDialog] = useState(false);
  const route = useRouter();
  // useLayoutEffect(() => {
    
  // }, []);
  let x=1;
  useEffect(()=>{
    if (x==1){
      x=2;
      fetch("/api/absensi/back/" + status, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        stamp,
        fid,
        user_id,
        id,
        url: bUrl + "absen_" + status + "2",
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("res absen datang->", res);
        if (res.message == "Ok") {
          // alert("Absen Berhasil di catat oleh Sistem");
          setDialog(true);
          setTimeout(() => {
            console.log("redirect");
            route.replace("/absensi/histori");
            // redirect("/absensi/histori");
          }, 2000);
        }
      })
      .catch((err) => console.log("err absen datang->", err));
    }
  },[])
  return (
    <div>
      <Dialog
        open={dialog}
        onOpenChange={() => {
          route.replace("/absensi/histori");
        }}
      >
        <DialogContent className="w-3/4">
          <DialogDescription className="flex flex-col space-y-2">
            <h1 className="text-xl font-bold">
              Absen Berhasil di Catat di sistem
            </h1>
            <Link
              href="/absensi/histori"
              className="bg-green-700 text-slate-50 font-bold p-2 rounded-xl text-center"
            >
              Histori Absen
            </Link>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}
