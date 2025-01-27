"use client";

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getToken } from "next-auth/jwt";
import { getCsrfToken, getSession } from "next-auth/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Terminal } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";
import { Button } from "../ui/button";
import { now } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function PesanPage() {
  const [menu, setMenu] = useState("");

  if (menu == "") return <FormPesan />;
  return <DaftarPesan />;
}
function FormPesan() {
  type dataPesanType = {
    jenis: string;
    smb_stat: string;
    kec: string;
    tunggakan: number;
    daerah: string;
    tanggal_awal: string;
    tanggal_akhir: string;
    pesan: string;
    rutin: boolean;
  };

  // const now = `${date.getDay().toString().padStart(2, "0")}/${(
  //   date.getMonth() + 1
  // )
  //   .toString()
  //   .padStart(2, "0")}/${date.getFullYear()}`;

  // console.log("now->", now);
  const dataPesan: dataPesanType = {
    jenis: "",
    smb_stat: "0",
    kec: "",
    tunggakan: 0,
    daerah: "",
    tanggal_akhir: now,
    tanggal_awal: now,
    pesan: "",
    rutin: false,
  };
  type errorDataPesanT = {
    pesan: string;
    tgl_awal: string;
    tgl_akhir: string;
    jenis: string;
  };
  const errorData: errorDataPesanT = {
    pesan: "",
    tgl_awal: "",
    tgl_akhir: "",
    jenis: "",
  };
  const router = useRouter();
  const { toast } = useToast();
  const [data, setData] = useState<dataPesanType>(dataPesan);
  const [error, setError] = useState<errorDataPesanT>(errorData);
  const [rutin, setRutin] = useState(false);
  const [loadingNew, setLoadingNew] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const jenisRef = useRef<HTMLSelectElement>(null);
  const smbRef = useRef<HTMLSelectElement>(null);
  const kec1Ref = useRef<HTMLInputElement>(null);
  const kec2Ref = useRef<HTMLInputElement>(null);
  const kec3Ref = useRef<HTMLInputElement>(null);
  const kec4Ref = useRef<HTMLInputElement>(null);
  const tunggakanRef = useRef<HTMLInputElement>(null);
  const daerahRef = useRef<HTMLInputElement>(null);
  const tanggalAwalRef = useRef<HTMLInputElement>(null);
  const tanggalAkhirRef = useRef<HTMLInputElement>(null);
  const pesanRef = useRef<HTMLTextAreaElement>(null);
  async function getTokenC() {
    const token = await getSession();
    return token;
  }
  useEffect(() => {
    // getTokenC().then((res) => console.log("session", res));
    console.log("error->", error);
  }, [error]);
  useEffect(() => {
    console.log("data->", data);
  }, [data]);
  function handleKec(t: ChangeEvent<HTMLInputElement>) {
    console.log("kec->", kec1Ref.current?.checked);
    let d = "";
    if (kec1Ref.current?.checked)
      d += `${d !== "" ? "," : ""}${kec1Ref.current.value}`;
    if (kec2Ref.current?.checked)
      d += `${d !== "" ? "," : ""}${kec2Ref.current.value}`;
    if (kec3Ref.current?.checked)
      d += `${d !== "" ? "," : ""}${kec3Ref.current.value}`;
    if (kec4Ref.current?.checked)
      d += `${d !== "" ? "," : ""}${kec4Ref.current.value}`;
    // if (data.kec !== "") {
    //   d = data.kec + "," + t.target.value;
    // } else {
    //   d = t.target.value;
    // }
    setData((old) => {
      return { ...old, kec: d };
    });
    // console.log(t.target.value);
  }
  const tg = new Date(data.tanggal_awal).toString();
  return (
    <>
      <h1 className="text-center text-slate-300 -mt-4 text-lg">
        Pesan Broadcast Baru
      </h1>
      <div className="flex flex-col">
        <div className="flex flex-col">
          <span className="text-[11px] text-red-600 -mb-1">{error.jenis}</span>
          <select
            ref={jenisRef}
            className={
              "border-2 p-2 rounded-lg" + (error.jenis && " border-red-600")
            }
            name="jenis"
            defaultValue={""}
            // value={data.jenis}
            required
            onChange={(t) => {
              setData((old) => {
                return { ...old, [t.target.name]: t.target.value };
              });
              // console.log(t.target.value);
            }}
          >
            <option disabled value="">
              Jenis Pesan Broadcast
            </option>
            <option value="Tagihan">Tagihan</option>
            <option value="Pemberitahuan">Pemberitahuan</option>
          </select>
          <span className="text-red-600 text-sm">
            Jenis Pesan Broadcast Harus di Pilih
          </span>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-col">
          <select
            ref={smbRef}
            name="smb_stat"
            className="border-2 p-2 rounded-lg"
            defaultValue={"0"}
            // value={data.smb_stat}
            onChange={(t) => {
              setData((old) => {
                return { ...old, [t.target.name]: t.target.value };
              });
              // console.log(t.target.value);
            }}
          >
            <option value="0">0 |Semua Status Sambungan Pelanggan </option>
            <option value="00">00|Input Data Registrasi Sambungan Baru</option>
            <option value="10">10|Registrasi Sambungan Baru</option>
            <option value="11">11|Penetapan RAB</option>
            <option value="12">12|BPPI</option>
            <option value="13">13|Bayar Sambungan Baru</option>
            <option value="14">14|Proses Aktivasi Sambungan Baru</option>
            <option value="20">20|Segel</option>
            <option value="21">21|Registrasi Buka Kembali</option>
            <option value="22">22|Proses Aktifasi Buka Kembali</option>
            <option value="23">23|DOP Administrasi</option>
            <option value="30">30|Aktif</option>
            <option value="31">31|Aktif (Lebih Bayar)</option>
            <option value="40">40|Cabut Meter</option>
            <option value="41">41|Registrasi Buka Kembali Pasang Baru</option>
            <option value="42">42|Proses Aktifasi BKPB</option>
            <option value="43">43|Bayar BKPB</option>
            <option value="50">50|Daftar Segel</option>
            <option value="61">61|Registrasi Balik Nama</option>
            <option value="62">62|Proses Balik Nama</option>
            <option value="70">70|Lebih Bayar</option>
            <option value="81">81|Proses Aktivasi Penggantian Meter</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col flex-wrap md:flex-row my-2">
        <div className="flex flex-row md:w-1/2 justify-between">
          <div className="flex flex-col bg-slate-100/50 p-1 rounded-lg w-1/2 ">
            Pilih Kecamatan
            <div className="flex flex-row items-center">
              <input
                ref={kec2Ref}
                className="form-check-input"
                type="checkbox"
                value="Tarakan Barat"
                id="kec02"
                name="kec02"
                onChange={handleKec}
              />
              <label htmlFor="kec02" className="text-[12px] md:text-lg">
                Tarakan Barat
              </label>
            </div>
            <div className="flex flex-row items-center ">
              <input
                ref={kec1Ref}
                className="form-check-input"
                type="checkbox"
                value="Tarakan Tengah"
                id="kec01"
                name="kec01"
                onChange={handleKec}
              />
              <label htmlFor="kec01" className="text-[12px]  md:text-lg">
                Tarakan Tengah
              </label>
            </div>
            <div className="flex flex-row items-center">
              <input
                className="form-check-input"
                type="checkbox"
                value="Tarakan Timur"
                id="kec03"
                name="kec03"
                ref={kec3Ref}
                onChange={handleKec}
              />
              <label htmlFor="kec03" className="text-[12px]  md:text-lg">
                Tarakan Timur
              </label>
            </div>
            <div className="flex flex-row items-center">
              <input
                className="form-check-input"
                type="checkbox"
                value="Tarakan Utara"
                id="kec04"
                name="kec04"
                ref={kec4Ref}
                onChange={handleKec}
              />
              <label htmlFor="kec04" className="text-[12px]  md:text-lg">
                Tarakan Utara
              </label>
            </div>
          </div>
          <div className="w-1/2 flex flex-col ">
            <label>Tunggakan Lebih Dari</label>
            <div className="flex flex-row w-full">
              <input
                type="number"
                id="tunggakan"
                name="tunggakan"
                className="w-[100px] border-2 p-1 rounded-l-lg"
                value={data.tunggakan}
                ref={tunggakanRef}
                onChange={(t) => {
                  setData((old) => {
                    return {
                      ...old,
                      [t.target.name]: parseInt(t.target.value),
                    };
                  });
                  // console.log(t.target.value);
                }}
              />
              <span className="p-1 border-y-2 border-r-2 rounded-r-lg">
                Bulan
              </span>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col md:w-1/2">
          <span>Daerah pisah dengan (,)</span>
          <input
            type="text"
            className="p-1 border-2 w-full rounded-lg"
            placeholder="Daerah contoh: sebengkok, sebengkok tiram, ladang"
            name="daerah"
            ref={daerahRef}
            value={data.daerah}
            onChange={(t) => {
              setData((old) => {
                return { ...old, [t.target.name]: t.target.value };
              });
              // console.log(t.target.value);
            }}
          />
        </div>
      </div>

      <div className="flex flex-col">
        <span className="text-[11px] text-red-600 -mb-3">{error.pesan}</span>
        <textarea
          className={
            "border-2 p-2 rounded-lg my-2 " +
            (error.pesan && "border-2 border-red-600")
          }
          rows={5}
          name="pesan"
          ref={pesanRef}
          placeholder="Isi Pesan Broadcast ..."
          required
          value={data.pesan}
          onChange={(t) => {
            setData((old) => {
              return { ...old, [t.target.name]: t.target.value };
            });
            // console.log(t.target.value);
          }}
        ></textarea>
        <span className="text-red-600 text-sm">Isi Pesan Harus Diisi</span>
      </div>
      <div className="flex flex-row flex-wrap w-full ">
        <div className="flex flex-col w-full md:w-1/3  justify-center">
          <div className="flex flex-row ">
            <input
              type="checkbox"
              name="rutin"
              id="rutin"
              className="mr-2 w-[40px]"
              onChange={(e) => {
                // console.log(e.target.checked);
                setRutin(e.target.checked);
                setData((old) => {
                  return { ...old, rutin: e.target.checked };
                });
              }}
            />
            <label htmlFor="rutin" className="text-lg font-semibold">
              <span className="text-red-600">(centang)</span> jika pesan dikirim
              setiap Tanggal {data.tanggal_awal.substring(8, 10)}
            </label>
          </div>
        </div>
        <div className="flex flex-col w-1/2 md:w-1/3">
          <div className="">Waktu Awal Terbit</div>
          <span className="text-[11px] text-red-600 -mb-1">
            {error.tgl_awal}
          </span>
          <input
            type="date"
            className={
              "border-2 p-2 rounded-lg mr-5" +
              (error.tgl_awal && " border-red-600")
            }
            name="tanggal_awal"
            placeholder="Waktu Awal Terbit"
            // value="2023-07-12"
            // placeholder="12/07/2023"
            required
            ref={tanggalAwalRef}
            value={data.tanggal_awal}
            onChange={(t) => {
              setData((old) => {
                return { ...old, [t.target.name]: t.target.value };
              });
              // console.log(t.target.value);
            }}
            disabled={rutin}
          />
          <span className="text-red-600 text-sm">
            Tanggal Awal Terbit Harus Disetting
          </span>
        </div>

        <div className="flex flex-col w-1/2 md:w-1/3">
          <div className="">Hingga</div>
          <span className="text-[11px] text-red-600 -mb-1">
            {error.tgl_akhir}
          </span>
          <input
            type="date"
            className={
              "border-2 p-2 rounded-lg mr-5" +
              (error.tgl_akhir && " border-red-600")
            }
            name="tanggal_akhir"
            placeholder="Waktu Akhir Terbit"
            value={data.tanggal_akhir}
            ref={tanggalAkhirRef}
            onChange={(t) => {
              setData((old) => {
                return { ...old, [t.target.name]: t.target.value };
              });
              // console.log(t.target.value);
            }}
            disabled={rutin}
          />
          <span className="text-red-600 text-sm">
            Jika Waktu Akhir Tidak diisi, maka pesan berlaku 1 hari
          </span>
        </div>
      </div>
      <div className="flex flex-row mt-2 text-center justify-evenly">
        <button
          className={"p-3 bg-lime-700  text-slate-50 rounded-lg min-w-[100px]"}
          type="button"
          name="btn_new"
          onClick={() => {
            setData((old) => {
              return { ...old, aktif: true };
            });
            setLoadingNew(true);
            fetch("api/pesan", {
              cache: "no-store",
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                jenis: data.jenis,
                smb_stat: data.smb_stat,
                kec: data.kec,
                tunggakan: data.tunggakan,
                daerah: data.daerah,
                tanggal_akhir: data.tanggal_akhir,
                tanggal_awal: data.tanggal_awal,
                pesan: data.pesan,
                rutin: data.rutin,
                aktif: true,
              }),
            })
              .then((res) => res.json())
              .then((res) => {
                console.log("res->", res);
                // if (res.error.pesan) {
                // console.warn("pesan");
                setError((old) => {
                  return { ...old, pesan: res.error.pesan };
                });
                // }
                // if (res.error.tgl_awal) {
                setError((old) => {
                  return { ...old, tgl_awal: res.error.tgl_awal };
                });
                // }
                // if (res.error.tgl_akhir) {
                setError((old) => {
                  return { ...old, tgl_akhir: res.error.tgl_akhir };
                });
                setError((old) => {
                  return { ...old, jenis: res.error.jenis };
                });
                if (res.message == "Pesan Berhasil di Proses") {
                  toast({
                    duration: 2000,
                    className: "bg-green-500 text-slate-50",
                    title: "Penyimpanan Berhasil di Proses",
                    description: "Robot Akan memulai Pekerjaan",
                  });
                  router.push("/pesan/semua");
                }
                setLoadingNew(false);

                // }
              })
              .catch((err) => setLoadingNew(false));
          }}
        >
          {loadingNew ? (
            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
          ) : (
            "Kirim Pesan"
          )}
        </button>
        <button
          className="p-3 bg-lime-700  text-slate-50 rounded-lg "
          type="button"
          name="btn_new"
          onClick={() => {
            setLoadingDraft(true);
            fetch("api/pesan", {
              cache: "no-store",
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                jenis: data.jenis,
                smb_stat: data.smb_stat,
                kec: data.kec,
                tunggakan: data.tunggakan,
                daerah: data.daerah,
                tanggal_akhir: data.tanggal_akhir,
                tanggal_awal: data.tanggal_awal,
                pesan: data.pesan,
                rutin: data.rutin,
                aktif: false,
              }),
            })
              .then((res) => res.json())
              .then((res) => {
                console.log("res->", res);
                // if (res.error.pesan) {
                // console.warn("pesan");
                setError((old) => {
                  return { ...old, pesan: res.error.pesan };
                });
                // }
                // if (res.error.tgl_awal) {
                setError((old) => {
                  return { ...old, tgl_awal: res.error.tgl_awal };
                });
                // }
                // if (res.error.tgl_akhir) {
                setError((old) => {
                  return { ...old, tgl_akhir: res.error.tgl_akhir };
                });
                setError((old) => {
                  return { ...old, jenis: res.error.jenis };
                });
                if (res.message == "Pesan Berhasil di Proses") {
                  toast({
                    duration: 2000,
                    className: "bg-green-500 text-slate-50",
                    title: "Penyimpanan Di Simpan",
                    description:
                      "Pesan dapat di edit/ di Aktifkan di Daftar Semua Pesan",
                  });
                  router.push("/pesan/semua");
                }
                setLoadingDraft(false);

                // }
              })
              .catch((err) => setLoadingDraft(false));
          }}
        >
          {loadingDraft ? (
            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
          ) : (
            "Simpan Konsep"
          )}
        </button>

        <button className="p-3 bg-yellow-400 rounded-lg min-w-[100px] font-bold ">
          Reset
        </button>
      </div>
      <div className="row">
        <div className="col text-danger">Catatan :</div>
      </div>
      <div className="row">
        <div className="col text-danger">
          - Gunakan &apos;[&apos; untuk membuka dan &apos;]&apos; untuk menutup
          field auto di dalam pesan
        </div>
      </div>
      <div className="row">
        <div className="col text-danger">
          - Gunakan &apos;\\n&apos; untuk membuat baris baru di pesan boardcast
          nantinya
        </div>
      </div>
    </>
  );
}
function DaftarPesan() {
  return (
    <>
      <h1>daftar semua pesan</h1>
    </>
  );
}
