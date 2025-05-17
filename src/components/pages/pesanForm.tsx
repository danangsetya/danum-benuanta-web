import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "../ui/use-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import type { dataPesanType } from "./pesanAll";
import { setTimeout } from "timers";
// import type { dataPesanType } from "./pesanAll";
// type dataPesanType = {
//   id?: number;
//   jenis: string;
//   smb_stat: string;
//   kecamatan: string;
//   tunggakan: number;
//   daerah: string;
//   tanggal_awal: string;
//   tanggal_akhir: string;
//   pesan: string;
//   rutin: number;
// };
export default function FormPesan({
  dataFrom,
  kembali,
}: {
  dataFrom: dataPesanType;
  kembali: any;
}) {
  console.log("dataform->", dataFrom);
  const router = useRouter();
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
  const date = new Date();
  // type dataPesanType = {
  //   id?: number;
  //   jenis: string;
  //   smb_stat: string;
  //   kec: string;
  //   tunggakan: number;
  //   daerah: string;
  //   tanggal_awal: string;
  //   tanggal_akhir: string;
  //   pesan: string;
  //   rutin: boolean;
  // };
  const now = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  const dataPesan: dataPesanType = {
    id: 0,
    jenis: "",
    smb_stat: "0",
    kecamatan: "",
    tunggakan: 0,
    daerah: "",
    tanggal_akhir: now,
    tanggal_awal: now,
    pesan: "",
    rutin: 1,
    aktif: 0,
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
  const [data, setData] = useState<dataPesanType>(dataPesan);
  const [error, setError] = useState<errorDataPesanT>(errorData);
  const [loadingNew, setLoadingNew] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [loadingAktif, setLoadingAktif] = useState(false);
  const [rutin, setRutin] = useState(false);
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
  function isTarakan(kec: string) {
    let stat = false;
    if (dataFrom.kecamatan) {
      const kecList = dataFrom.kecamatan.split(",");
      kecList.map((item) => {
        // console.log("item self->", item);
        if (kec == item) stat = true;
      });
      // console.log("isTarakan->", kecList);
    }
    // console.log(stat);
    return stat;
  }
  useEffect(() => {
    setData(dataFrom);
  }, []);
  // useEffect(() => {
  //   setData(dataFrom);
  // }, [data.tanggal_awal, data.tanggal_akhir]);
  return (
    <>
      <h1 className="text-center text-slate-300 -mt-4 text-lg">
        Ubah Pesan Broadcast
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
            // defaultValue={data.jenis}
            value={data.jenis}
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
            // defaultValue={"0"}
            value={data.smb_stat}
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
                checked={isTarakan("Tarakan Barat")}
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
                checked={isTarakan("Tarakan Tengah")}
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
                checked={isTarakan("Tarakan Timur")}
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
                checked={isTarakan("Tarakan Utara")}
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
          value={data.pesan.replaceAll("\\n", "\r\n")}
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
                  return { ...old, rutin: e.target.checked ? 1 : 0 };
                });
              }}
              checked={data.rutin == 1 ? true : false}
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
            //"2023-07-23"
            required
            ref={tanggalAwalRef}
            value={data.tanggal_awal.substring(0, 10)}
            onChange={(t) => {
              setData((old) => {
                return {
                  ...old,
                  [t.target.name]: t.target.value,
                  tanggal_akhir: t.target.value,
                };
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
            value={data.tanggal_akhir.substring(0, 10)}
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
          className={"p-3 bg-green-600  text-slate-50 rounded-lg min-w-[100px]"}
          type="button"
          onClick={() => {
            // setData((old) => {
            //   return { ...old, aktif: 1 };
            // });
            setLoadingNew(true);
            fetch("/api/pesan/update", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: data.id,
                jenis: data.jenis,
                smb_stat: data.smb_stat,
                kec: data.kecamatan,
                tunggakan: data.tunggakan,
                daerah: data.daerah,
                tanggal_akhir: data.tanggal_akhir,
                tanggal_awal: data.tanggal_awal,
                pesan: data.pesan,
                rutin: data.rutin,
                aktif: data.aktif,
              }),
            })
              .then((res) => res.json())
              .then((res) => {
                console.log("res non aktif->", res);

                setError((old) => {
                  return { ...old, jenis: res.error.jenis };
                });
                if (res.message == "Pesan Berhasil di Perbaharui") {
                  toast({
                    duration: 2000,
                    className: "bg-green-500 text-slate-50",
                    title: "Penyimpanan ",
                    description: "Pesan Berhasil di Perbaharui",
                  });
                }
                kembali(true);
              })
              .catch((err) => {
                console.log("err non aktif->", err);
              })
              .finally(() => {
                setLoadingAktif(false);
              });
          }}
        >
          {loadingNew ? (
            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
          ) : (
            "Update"
          )}
        </button>

        <button
          className={
            "p-3 text-slate-50 rounded-lg min-w-[100px] font-bold  " +
            (data.aktif == 1 ? "bg-red-600" : "bg-lime-600")
          }
          onClick={() => {
            setLoadingAktif(true);
            // setData((old) => {
            //   return { ...old, aktif: 0 };
            // });

            // setTimeout(() => {
            fetch("/api/pesan/update", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: data.id,
                jenis: data.jenis,
                smb_stat: data.smb_stat,
                kec: data.kecamatan,
                tunggakan: data.tunggakan,
                daerah: data.daerah,
                tanggal_akhir: data.tanggal_akhir,
                tanggal_awal: data.tanggal_awal,
                pesan: data.pesan,
                rutin: data.rutin,
                aktif: data.aktif ? 0 : 1,
              }),
            })
              .then((res) => res.json())
              .then((res) => {
                console.log("res non aktif->", res);

                setError((old) => {
                  return { ...old, jenis: res.error.jenis };
                });
                if (res.message == "Pesan Berhasil di Perbaharui") {
                  toast({
                    duration: 2000,
                    className: "bg-green-500 text-slate-50",
                    title: "Penyimpanan ",
                    description: "Pesan Berhasil di Perbaharui",
                  });
                }
                kembali(true);
              })
              .catch((err) => {
                console.log("err non aktif->", err);
              })
              .finally(() => {
                setLoadingAktif(false);
              });
            // }, 500);
            // setTimeout;
          }}
        >
          {loadingAktif ? (
            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
          ) : data.aktif == 1 ? (
            "Non Aktifkan"
          ) : (
            "Aktifkan"
          )}
        </button>
        <button
          className="p-3 bg-yellow-400 rounded-lg min-w-[100px] font-bold "
          onClick={() => {
            kembali(true);
          }}
        >
          Kembali
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
