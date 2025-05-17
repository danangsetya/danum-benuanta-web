"use client";

import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";

export default function PengaturanAksesPenggunaForm({
  pNama = "",
  pDes = "",
  pId = 0,
  callback = () => {},
}: {
  pNama?: string;
  pDes?: string;
  pId?: number;
  callback?: (x: boolean) => void;
}) {
  const namaRef = useRef<HTMLInputElement>(null);
  const desRef = useRef<HTMLInputElement>(null);
  const [alert, setAlert] = useState({
    state: false,
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const handleTambah = () => {
    const nama = namaRef.current?.value;
    const desk = desRef.current?.value;
    if (nama == "" || desk == "") {
      setAlert((old) => {
        return {
          ...old,
          state: true,
          title: "Validasi Input",
          description: "Nama dan Deskripsi Tidak Boleh Kosong",
        };
      });
    } else {
      setLoading(true);
      if (pId !== 0 && pNama !== "" && pDes !== "") {
        fetch("/api/pengaturan/pengguna/akses/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: pId, nama, desk }),
        })
          .then((res) => res.json())
          .then((res) => {
            console.log("tambah->", res);
            if (res.message == "Data Tersimpan") {
              toast({
                duration: 2000,
                className: "bg-green-500 text-slate-50",
                title: "Penyimpanan ",
                description: "Level Pengguna Berhasil di Ubah",
              });
              callback(true);
              // router.replace("/pengaturan/pengguna/level");
            }
          })
          .catch((err) => console.error(err))
          .finally(() => setLoading(false));
      } else {
        fetch("/api/pengaturan/pengguna/akses/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nama, desk }),
        })
          .then((res) => res.json())
          .then((res) => {
            console.log("tambah->", res);
            if (res.message == "Data Tersimpan") {
              toast({
                duration: 2000,
                className: "bg-green-500 text-slate-50",
                title: "Penyimpanan ",
                description: "Level Pengguna Berhasil di Tambahkan",
              });
              router.replace("/pengaturan/pengguna/akses");
            }
          })
          .catch((err) => console.error(err))
          .finally(() => setLoading(false));
      }
    }
    // console.log("input->", nama, desk);
  };
  const setAlertState = (v: boolean) => {
    setAlert((old) => {
      return { ...old, state: v };
    });
  };
  const [nama, setNama] = useState(pNama);
  const [des, setDes] = useState(pDes);
  return (
    <div className="flex flex-col">
      <Dialog open={alert.state} onOpenChange={setAlertState}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{alert.title}</DialogTitle>
            <DialogDescription>{alert.description}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <h1 className="text-center font-bold text-xl">
        Akses Pengguna {pNama == "" && "Baru"}
      </h1>
      <div
        className={pNama !== "" ? "flex flex-col mt-4" : "flex flex-row mt-4"}
      >
        <div className="flex flex-col flex-1 px-2">
          <span>Nama Level</span>
          <input
            className="p-1 border-[1px] border-lime-600 rounded-lg"
            type="text"
            placeholder="Masukkan Nama Akses"
            value={nama}
            onChange={(e) => {
              setNama(e.target.value);
            }}
            ref={namaRef}
          ></input>
        </div>
        <div className="flex flex-col flex-1 px-2">
          <span>Deskripsi Akses</span>
          <input
            className="p-1 border-[1px] border-lime-600 rounded-lg"
            type="text"
            placeholder="Masukkan Deskripsi Level"
            value={des}
            ref={desRef}
            onChange={(e) => {
              setDes(e.target.value);
            }}
          ></input>
        </div>
        <div
          className={
            pNama == "" ? "flex items-end" : "flex  justify-center mt-2"
          }
        >
          <button
            className={
              "w-52 h-10 justify-center items-center bg-lime-600 rounded-xl font-bold text-slate-50 hover:bg-green-600 active:bg-sky-500 "
            }
            onClick={() => handleTambah()}
          >
            {loading ? (
              <FontAwesomeIcon
                icon={faSpinner}
                className="text-lg animate-spin"
              />
            ) : pNama == "" ? (
              "Tambah"
            ) : (
              "Ubah"
            )}
          </button>
        </div>
      </div>
      <div className="flex flex-row  mt-4"></div>
    </div>
  );
}
