"use client";

import { fileT, percepatanNrwE } from "@/lib/types";
import { faCamera, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AlertDialog } from "../ui/alert-dialog";
import { Alert } from "../ui/alert";
import axios from "axios";
import { toast } from "../ui/use-toast";

export default function PercepatanNrwAdd() {
  const fotoRumahRef = useRef<HTMLInputElement>(null);
  const fotoSrRef = useRef<HTMLInputElement>(null);
  const [fileRumah, setFileRumah] = useState<fileT>();
  const [fileSr, setFileSr] = useState<fileT>();
  const [data, setData] = useState(percepatanNrwE);
  const [error, setError] = useState(percepatanNrwE);
  const nosamwRef = useRef<HTMLInputElement>(null);
  const namaRef = useRef<HTMLInputElement>(null);
  const permasalahanRef = useRef<HTMLInputElement>(null);
  const tindakLanjutRef = useRef<HTMLInputElement>(null);
  const telpRef = useRef<HTMLInputElement>(null);
  const [loading, setWait] = useState(false);
  const [percent, setPercent] = useState(0);
  const handleEnter = (event: any) => {
    // console.log('[keyboard]', event.key.toLowerCase());
    if (event.key.toLowerCase() === "enter") {
      event.preventDefault();
      const form = event.target.form;
      const index = [...form].indexOf(event.target);
      form.elements[index + 1].focus();
    }
    if (event.key.toLowerCase() === "escape") {
    }
  };
  const fetch_nosamw = () => {
    if (loading == false) {
      setWait(true);
      fetch("/api/percepatan-nrw/find-nosamw?nosamw=" + data.nosamw, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.nosamw) {
            setData((old) => {
              return {
                ...old,
                nama: res.nama,
                alamat: res.alamat,
                telp: res.telp,
                petugas: res.petugas,
              };
            });
          } else
            alert("No Sambung Tidak di temukan, Periksa kembali No Sambung");
        })
        .catch((err) => console.error(err))
        .finally(() => setWait(false));
    }
  };
  const handleCariNosamw = (event: any) => {
    // console.log(event);
    if (event.key.toLowerCase() === "enter") {
      fetch_nosamw();
      // alert("api/percepatan-nrw/find-nosamw?nosamw=" + data.nosamw);
    }
  };

  const uploadContent = async (fileR: File, fileS: File) => {
    console.log("file start->", fileR);
    if (fileR?.name !== undefined && fileS?.name !== undefined) {
      if (
        fileR.name !== "" &&
        fileR.size > 0 &&
        fileS.name !== "" &&
        fileS.size > 0
      ) {
        // const reFile = file;
        // delete reFile["blob"];
        // console.log("file here->", reFile);
        const formData = new FormData();

        // Array.from(event.target.files).forEach((file) => {
        formData.append("fileR", fileR);
        formData.append("fileS", fileS);
        formData.append("nosamw", data.nosamw);
        formData.append("nama", data.nama);
        formData.append("permasalahan", data.permasalahan);
        formData.append("telp", data.telp);
        formData.append("lat", data.lat + "");
        formData.append("lon", data.lon + "");
        formData.append("lat_rumah", data.lat_rumah + "");
        formData.append("lon_rumah", data.lon_rumah + "");
        formData.append("tindak_lanjut", data.tindak_lanjut + "");
        formData.append("lon_rumah", data.lon_rumah + "");
        formData.append("petugas", data.petugas + "");
        // });
        const config = {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (event: any) => {
            const progress = Math.round((event.loaded * 100) / event.total);
            setPercent(Math.floor(progress / 10) * 10);
            console.log(
              `Current progress:`,
              progress,
              Math.floor(progress / 10) * 10
            );
            // setPercent(((event.loaded * 100) % 10) * 10);
          },
        };

        const response = await axios.post(
          "/api/percepatan-nrw/simpan",
          formData,
          config
        );
        if (response.data.message == "Ok") {
          setWait(false);
          toast({
            duration: 2000,
            className: "bg-green-500 text-slate-50",
            title: "Penyimpanan ",
            description: "Percepatan Berhasil di Tambahkan",
          });
          setData(percepatanNrwE);
          setFileRumah(undefined);
          setFileSr(undefined);
        }
        console.log("response", response.data);
      }
    }
  };
  useEffect(() => {
    if (percent >= 100) {
    }
  }, [percent]);
  useEffect(() => {
    console.log("fileRumah=>", fileRumah);
  }, [fileRumah]);
  // useEffect(() => {
  //   console.log("data=>", data);
  // }, [data]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API

      navigator.geolocation.getCurrentPosition(({ coords }) => {
        // alert(coords.latitude);
        setData({ ...data, lat: coords.latitude, lon: coords.longitude });
        console.log(coords);
        // const { latitude, longitude } = coords;
        // setLocation({ latitude, longitude });
      });
    }
    // console.log(getCurrentPosition());
  }, []);
  return (
    <section className="flex flex-col">
      <h1 className="font-bold text-xl text-center">
        Data Percepatan NRW Baru
      </h1>
      <form>
        <div className="flex flex-col z-30 px-2 md:px-0 items-center md:items-stretch">
          <div className="flex flex-col md:flex-row w-full">
            <div className="relative ">
              <h1 className="text-center text-md  rounded-t-lg bg-yellow-400 text-lime-600 py-1 font-semibold w-full md:w-auto">
                Foto Rumah
              </h1>
              <input
                type="file"
                className="hidden"
                accept="image/jpeg,image/png"
                ref={fotoRumahRef}
                onChange={(e) => {
                  if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition(({ coords }) => {
                      setData({
                        ...data,
                        lat_rumah: coords.latitude,
                        lon_rumah: coords.longitude,
                      });
                    });
                  }
                  // console.log(e.target.files);
                  if (e.target.files !== undefined) {
                    if (e.target.files?.length) {
                      // console.log(URL.createObjectURL(e.target?.files[0]));
                      let tmp: fileT = e.target?.files[0];
                      tmp.blobString = URL.createObjectURL(e.target?.files[0]);
                      setFileRumah(tmp);
                    }
                  }
                }}
              />
              <div
                className="h-52  bg-slate-5 border-x-2 border-yellow-400 rounded-b-xl flex flex-col justify-center items-center overflow-hidden relative w-full md:w-40"
                onClick={() => fotoRumahRef.current?.click()}
              >
                {fileRumah ? (
                  <>
                    <Image
                      src={fileRumah.blobString as string}
                      alt="foto rumah"
                      // width={200}
                      // height={200}
                      fill={true}
                      objectFit="cover"
                    />
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon
                      icon={faCamera}
                      fontSize={75}
                      className="text-slate-200"
                    />
                    <span className="text-center text-[10px] text-slate-400">
                      Klik disini untuk ganti foto
                    </span>
                  </>
                )}
              </div>
            </div>
            <div>
              <h1 className="text-center text-md  rounded-t-lg bg-yellow-400 text-lime-600 py-1 font-semibold w-full md:w-auto">
                Foto SR/Lahan
              </h1>
              <input
                type="file"
                className="hidden"
                accept="image/jpeg,image/png"
                ref={fotoSrRef}
                onChange={(e) => {
                  if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition(({ coords }) => {
                      setData({
                        ...data,
                        lat: coords.latitude,
                        lon: coords.longitude,
                      });
                    });
                  }
                  // console.log(e.target.files);
                  if (e.target.files !== undefined) {
                    if (e.target.files?.length) {
                      // console.log(URL.createObjectURL(e.target?.files[0]));
                      let tmp: fileT = e.target?.files[0];
                      tmp.blobString = URL.createObjectURL(e.target?.files[0]);
                      setFileSr(tmp);
                      // setFileSr(URL.createObjectURL(e.target?.files[0]));
                    }
                  }
                }}
              />
              <div
                className="h-52 bg-slate-5 border-x-2 border-yellow-400 rounded-b-xl flex flex-col justify-center items-center overflow-hidden relative w-full md:w-40"
                onClick={() => fotoSrRef.current?.click()}
              >
                {fileSr ? (
                  <>
                    <span>tes</span>
                    <Image
                      src={fileSr.blobString as string}
                      alt="foto sr"
                      // width={200}
                      // height={200}
                      fill={true}
                      objectFit="cover"
                    />
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon
                      icon={faCamera}
                      fontSize={75}
                      className="text-slate-200"
                    />
                    <span className="text-center text-[10px] text-slate-400">
                      Klik disini untuk ganti foto SR
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="flex  flex-col flex-1 ">
              <div className="flex flex-col md:flex-row">
                <div className="flex flex-col flex-1 px-3">
                  <label className="-mb-1 text-sm text-lime-600">
                    Nomor Sambung
                    <span className="text-red-600 italic">{error.nosamw}</span>
                  </label>
                  <div className="flex flex-row">
                    <input
                      type="text"
                      ref={nosamwRef}
                      className="p-1 border-[1px] border-lime-600 rounded-l-lg"
                      placeholder="di isi No Sambung"
                      onKeyDown={handleCariNosamw}
                      value={data.nosamw}
                      onChange={(e) => {
                        setData((old: any) => {
                          return { ...old, nosamw: e.target.value };
                        });
                      }}
                    />
                    <button
                      className="bg-blue-800 text-white font-bold px-3 rounded-r-lg"
                      type="button"
                      onClick={fetch_nosamw}
                    >
                      {loading ? (
                        <FontAwesomeIcon
                          icon={faSpinner}
                          fontSize={25}
                          className="text-slate-200 animate-spin"
                        />
                      ) : (
                        "Cari"
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col flex-1 px-3">
                  <label className="-mb-1 text-sm text-lime-600">
                    Nama Pelanggan
                  </label>
                  <label>{data.nama}</label>
                </div>
              </div>
              <div className="flex flex-row">
                <div className="flex flex-col flex-1 px-3">
                  <label className="-mb-1 text-sm text-lime-600">
                    Alamat
                    <span className="text-red-600 italic">{error.nosamw}</span>
                  </label>
                  {data.alamat}
                </div>
                <div className="flex flex-col flex-1 px-3">
                  <label className="-mb-1 text-sm text-lime-600">
                    Nomor telpon
                    <span className="text-red-600 italic">{error.nosamw}</span>
                  </label>
                  <input
                    type="text"
                    ref={telpRef}
                    className="p-1 border-[1px] border-lime-600 rounded-lg"
                    placeholder="di isi Nomor Telpon"
                    onKeyDown={handleEnter}
                    value={data.telp}
                    onChange={(e) => {
                      setData((old: any) => {
                        return { ...old, telp: e.target.value };
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-row">
                <div className="flex flex-col flex-1 px-3 min-h-12">
                  <label className="-mb-1 text-sm text-lime-600">
                    Nama Pembaca Meter
                    <span className="text-red-600 italic">{error.nosamw}</span>
                  </label>
                  {data.petugas}
                </div>
              </div>
              <div className="flex flex-col flex-1 px-3">
                <label className="-mb-1 text-sm text-lime-600">
                  Permasalahan
                  <span className="text-red-600 italic">{error.nosamw}</span>
                </label>
                <input
                  type="text"
                  ref={permasalahanRef}
                  className="p-1 border-[1px] border-lime-600 rounded-lg"
                  placeholder="di isi Permasalahan"
                  onKeyDown={handleEnter}
                  value={data.permasalahan}
                  onChange={(e) => {
                    setData((old: any) => {
                      return { ...old, permasalahan: e.target.value };
                    });
                  }}
                />
              </div>
              <div className="flex flex-col flex-1 px-3">
                <label className="-mb-1 text-sm text-lime-600">
                  Tindak Lanjut
                  <span className="text-red-600 italic">{error.nosamw}</span>
                </label>
                <input
                  type="text"
                  ref={tindakLanjutRef}
                  className="p-1 border-[1px] border-lime-600 rounded-lg"
                  placeholder="di isi Tindak Lanjut"
                  onKeyDown={handleEnter}
                  value={data.tindak_lanjut}
                  onChange={(e) => {
                    setData((old: any) => {
                      return { ...old, tindak_lanjut: e.target.value };
                    });
                  }}
                />
              </div>
              <div className="flex flex-row justify-evenly m-3">
                <button
                  className="bg-blue-900 text-white py-2 px-5 font-bold rounded-xl text-lg"
                  type="button"
                  onClick={() => {
                    let error = [];
                    if (data.nosamw == "") error.push("No Sambung Harus Diisi");
                    if (data.nama == "") error.push("Jadi Nama Tidak Tampil");
                    if (data.permasalahan == "") error.push("Isi Permasalahan");
                    if (loading == false) {
                      setWait(false);
                      const allowedFileTypes = ["image/png", "image/jpeg"];
                      const allowSr = allowedFileTypes.includes(
                        fileSr?.type as string
                      );
                      const allowRmh = allowedFileTypes.includes(
                        fileRumah?.type as string
                      );
                      if (allowSr == false)
                        error.push("Foto SR/Lahan belum dipilih");
                      if (allowRmh == false)
                        error.push("Foto Rumah belum dipilih");
                      if (error.length > 0) {
                        alert(error.join("\n"));
                        return false;
                      }
                      setWait(true);

                      uploadContent(fileRumah as File, fileSr as File);
                      // alert(fileSr.type);
                      // fetch("/api/percepatan-nrw/simpan", {
                      //   method: "POST",
                      //   headers: {
                      //     "Content-Type": "application/json",
                      //   },
                      //   body: JSON.stringify({
                      //     nosamw: data.nosamw,
                      //     nama: data.nama,
                      //     telp: data.telp,
                      //     permasalahan: data.permasalahan,
                      //   }),
                      // })
                      //   .then((res) => res.json())
                      //   .then((res) => {
                      //     if (res.message === "Ok") {
                      //       setData(percepatanNrwE);
                      //       alert("Data Percepatan Berhasil di tambahkan");
                      //     }
                      //   })
                      //   .catch((err) => console.error(err));
                    }
                  }}
                >
                  {loading ? (
                    <FontAwesomeIcon
                      icon={faSpinner}
                      fontSize={25}
                      className="text-slate-200 animate-spin"
                    />
                  ) : (
                    "Simpan"
                  )}
                </button>
                <button
                  className="bg-blue-900 text-white py-2 px-5 font-bold rounded-xl text-lg"
                  type="button"
                  onClick={() => {
                    setData(percepatanNrwE);
                    setFileRumah(undefined);
                    setFileSr(undefined);
                  }}
                >
                  Kosongkan
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
