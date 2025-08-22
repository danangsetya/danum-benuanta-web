"use client";

import { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { absensiT } from "@/lib/types";
import { useDownloadExcel } from "react-export-table-to-excel";

export default function DetailAbsensi({
  id_personalia,
  from,
  to,
}: {
  id_personalia: number;
  from: string;
  to: string;
}) {
  const tableRef = useRef(null);
  const [loading, setWait] = useState(false);
  const [absensi, setAbsensi] = useState<absensiT[]>();
  const [profil, setProfil] = useState({ nama: "", nik: "" });
  useEffect(() => {
    if (id_personalia > 0 && from !== "" && to !== "") {
      setWait(true);
      if (loading == false) {
        console.log("started");
        fetch("/api/absensi/detail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id_personalia, from, to }),
        })
          .then((res) => res.json())
          .then((res: any) => {
            console.log("res started->", res);
            if (res.profil) {
              setProfil(res.profil);
            }
            if (res.absensi) {
              setAbsensi(res.absensi);
            }
          })
          .catch((err) => console.log("res err->", err))
          .finally(() => setWait(false));
      }
    }
  }, [id_personalia, from, to]);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Detail Absensi " + profil.nama + from + "-" + to,
    sheet: from + "-" + to,
  });
  return (
    <>
      <h1 className="text-center text-lg font-bold mt-5">Detail Absensi</h1>
      <button
        className={
          "bg-lime-600 py-2 px-4 font-bold text-slate-50 rounded-lg ml-4 " +
          (absensi == undefined && "hidden")
        }
        onClick={() => {
          if (from !== "" && to !== "") {
            onDownload();
          } else {
            alert("Mohon Pilih Range Tanggal Rekap Absensi");
          }
          // fetch("/api/absensi/rekap", {
          //   method: "POST",
          //   headers: {
          //     "Content-Type": "application/json",
          //   },
          //   body: JSON.stringify({ from: date?.from, to: date?.to }),
          // })
          //   .then((res) => res.json())
          //   .then((res: any) => {
          //     console.log("res->", res);
          //   })
          //   .catch((err: any) => {
          //     console.log("err->", err);
          //   });
        }}
      >
        Export Excel
      </button>

      <Table ref={tableRef}>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead className="text-black font-bold">
              {" : " + profil.nama}
            </TableHead>
          </TableRow>
          <TableRow>
            <TableHead>Nik</TableHead>
            <TableHead className="text-black font-bold">
              {" : " + profil.nik}
            </TableHead>
          </TableRow>
          <TableRow>
            <TableHead>Periode</TableHead>
            <TableHead className="text-black font-bold">
              {" : " + from + " - " + to}
            </TableHead>
          </TableRow>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>Jam Masuk</TableHead>
            <TableHead>Jam Keluar</TableHead>
            <TableHead>Jam Lembur Masuk</TableHead>
            <TableHead>Jam Lembur Keluar</TableHead>
            <TableHead>Telat</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={16}>
                <div className="flex flex-row w-full justify-center  space-x-5">
                  <div className="w-4 h-10 bg-sky-500 animate-bounce rounded-sm"></div>
                  <div className="w-4 h-10 bg-sky-500 animate-bounce delay-100 rounded-sm"></div>
                  <div className="w-4 h-10 bg-sky-500 animate-bounce delay-200 rounded-sm"></div>
                </div>
              </TableCell>
            </TableRow>
          )}
          {absensi?.map((item, index) => {
            return (
              <TableRow key={index}>
                <TableCell>{item.tanggal.substring(0, 10)}</TableCell>
                <TableCell>
                  {item.jam_masuk !== null && item.jam_masuk !== ""
                    ? item.jam_masuk.substring(11, 19)
                    : "-"}
                </TableCell>
                <TableCell>
                  {item.jam_keluar !== null && item.jam_keluar !== ""
                    ? item.jam_keluar.substring(11, 19)
                    : "-"}
                </TableCell>
                <TableCell>
                  {item.jam_lembur_masuk !== null &&
                  item.jam_lembur_masuk !== ""
                    ? item.jam_lembur_masuk.substring(11, 19)
                    : "-"}
                </TableCell>
                <TableCell>
                  {item.jam_lembur_keluar !== null &&
                  item.jam_lembur_keluar !== ""
                    ? item.jam_lembur_keluar.substring(11, 19)
                    : "-"}
                </TableCell>
                <TableCell>{item.terlambat}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
