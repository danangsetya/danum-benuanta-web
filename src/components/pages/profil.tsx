"use client";

import {
  helperType,
  karirT,
  keluargaT,
  pelatihanT,
  pendidikanT,
  personaliaType,
  skT,
} from "@/lib/types";
import {
  faAddressCard,
  faFile,
  faGraduationCap,
  faPaperclip,
  faPersonArrowUpFromLine,
  faRotateLeft,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLayoutEffect, useState } from "react";
import { TabMenu } from "./penggunaForm";
import Image from "next/image";
import ThumbnailPdf from "../helper/thumbnailPdf";
import Link from "next/link";

export default function ProfilC({ helper }: { helper?: helperType }) {
  const [personalia, setPersonalia] = useState<personaliaType>();
  const [pendidikanI, setPendidikanI] = useState<pendidikanT[]>();
  const [keluargaI, setKeluargaI] = useState<keluargaT[]>();
  const [pelatihanI, setPelatihanI] = useState<pelatihanT[]>();
  const [skI, setSkI] = useState<skT[]>();
  const [karirI, setKarirI] = useState<karirT[]>();
  const [tab, setTab] = useState<"diri" | "personal" | "pendidikan" | "sk">(
    "diri"
  );
  const [lokasiAbsen, setLokasiAbsen] = useState("");
  useLayoutEffect(() => {
    fetch("/api/profil/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("res->", res);
        if (res.personalia) {
          console.log(
            "lokasiA->",
            helper?.lokasi.find((i) => i.id == res.personalia.id_lokasi)
          );
          const lokasiF = helper?.lokasi.find(
            (i) => i.id == res.personalia.id_lokasi
          );
          if (
            lokasiF?.nama_lokasi !== undefined &&
            lokasiF.nama_lokasi !== ""
          ) {
            setLokasiAbsen(lokasiF.nama_lokasi);
          }
          setPersonalia(res.personalia);
        }
        if (res.keluarga) {
          setKeluargaI(res.keluarga);
        }
        if (res.pendidikan) {
          setPendidikanI(res.pendidikan);
        }
        if (res.pelatihan) {
          setPelatihanI(res.pelatihan);
        }
        if (res.sk) {
          setSkI(res.sk);
        }
        if (res.karir) {
          setKarirI(res.karir);
        }
      })
      .catch((err) => console.log("err->", err));
  }, []);
  if (personalia == undefined) {
    return (
      <div className="flex flex-col  items-center w-full my-5">
        <div className="flex flex-row w-full justify-center  space-x-5">
          <div className="w-4 h-10 bg-sky-500 animate-bounce rounded-sm"></div>
          <div className="w-4 h-10 bg-sky-500 animate-bounce delay-100 rounded-sm"></div>
          <div className="w-4 h-10 bg-sky-500 animate-bounce delay-200 rounded-sm"></div>
        </div>
        <button
          className="bg-gradient-to-br from-sky-400 to-yellow-400 w-[90px] py-2 px-3 rounded-lg text-sm font-semibold text-slate-50 shadow-lg"
          onClick={() => {
            // setFile(undefined);
            setKeluargaI(undefined);
            setPendidikanI(undefined);
            setPelatihanI(undefined);
            setSkI(undefined);
            setKarirI(undefined);
            setPersonalia(undefined);
            // setUsers(emptyUsers);
            // callback(false);
            // setLoadingSimpan(false);
          }}
        >
          Kembali <FontAwesomeIcon icon={faRotateLeft} />
        </button>
      </div>
    );
  } else {
    return (
      <>
        {/* menu Tabmenu */}
        <div className="flex flex-col z-50">
          <div className="fixed  md:relative top-12 md:top-0 right-0  flex flex-col md:flex-row md:mt-5 ">
            <TabMenu
              onClick={() => {
                setTab("diri");
              }}
              aktif={tab == "diri" ? true : false}
            >
              <FontAwesomeIcon icon={faUser} />{" "}
              <span className="text-sm mr-2 ">Data Diri</span>
            </TabMenu>
            <TabMenu
              onClick={() => {
                setTab("personal");
              }}
              aktif={tab == "personal" ? true : false}
            >
              <FontAwesomeIcon icon={faAddressCard} />{" "}
              <span className="text-sm mr-2">Data Personal</span>
            </TabMenu>
            <TabMenu
              onClick={() => {
                setTab("pendidikan");
              }}
              aktif={tab == "pendidikan" ? true : false}
            >
              <FontAwesomeIcon icon={faGraduationCap} />
              <span className="text-[9px] md:text-sm mr-2 ">
                Pendidikan, Keluarga & Pelatihan
              </span>
            </TabMenu>
            <TabMenu
              onClick={() => {
                setTab("sk");
              }}
              aktif={tab == "sk" ? true : false}
            >
              <FontAwesomeIcon icon={faPersonArrowUpFromLine} />
              <span className="text-[11px] md:text-sm">SK & Jenjang Karir</span>
            </TabMenu>
          </div>
          <div className="h-1 w-full bg-lime-600 hidden md:block"></div>
        </div>
        <form>
          {/* bagian data diri */}
          <section className={tab !== "diri" ? "hidden" : ""}>
            <div className="flex flex-col md:flex-row md:mt-2 mr-3 md:mr-0">
              <div className="flex flex-col z-30 px-2 md:px-0 items-center md:items-stretch">
                <h1 className="text-center text-md  rounded-t-lg bg-yellow-400 text-lime-600 py-1 font-semibold w-full md:w-auto">
                  Foto Personalia
                </h1>
                {/* <input
                type="file"
                className="hidden"
                accept="image/jpeg,image/png"
                ref={inFileRef}
                onChange={(e) => {
                  // console.log(e.target.files);
                  if (e.target.files !== undefined) {
                    if (e.target.files?.length) {
                      let tmp: fileT = e.target.files[0];
                      tmp.blobString = URL.createObjectURL(e.target?.files[0]);
                      // console.log(URL.createObjectURL(e.target?.files[0]));
                      setFile(tmp);
                    }
                  }
                }}
              /> */}
                <div
                  className="h-52 w-40 bg-slate-5 border-x-2 border-yellow-400 rounded-b-xl flex flex-col justify-center items-center overflow-hidden relative z-0"
                  // onClick={() => inFileRef.current?.click()}
                >
                  {/* <div
                  className={
                    "h-5 w-full bg-slate-400 flex justify-start items-center z-50 " +
                    (progress == 0 && "hidden")
                  }
                >
                  <div
                    className={
                      `h-3 w-1/12 bg-green-600 rounded-2xl ` +
                      (progress == 1 ? "" : "hidden")
                    }
                  ></div>
                  <div
                    className={
                      `h-3 w-2/12 bg-green-600 rounded-2xl ` +
                      (progress == 2 ? "" : "hidden")
                    }
                  ></div>
                  <div
                    className={
                      `h-3 w-3/12 bg-green-600 rounded-2xl ` +
                      (progress == 3 ? "" : "hidden")
                    }
                  ></div>
                  <div
                    className={
                      `h-3 w-4/12 bg-green-600 rounded-2xl ` +
                      (progress == 4 ? "" : "hidden")
                    }
                  ></div>
                  <div
                    className={
                      `h-3 w-5/12 bg-green-600 rounded-2xl ` +
                      (progress == 5 ? "" : "hidden")
                    }
                  ></div>
                  <div
                    className={
                      `h-3 w-6/12 bg-green-600 rounded-2xl ` +
                      (progress == 6 ? "" : "hidden")
                    }
                  ></div>
                  <div
                    className={
                      `h-3 w-7/12 bg-green-600 rounded-2xl ` +
                      (progress == 7 ? "" : "hidden")
                    }
                  ></div>
                  <div
                    className={
                      `h-3 w-8/12 bg-green-600 rounded-2xl ` +
                      (progress == 8 ? "" : "hidden")
                    }
                  ></div>
                  <div
                    className={
                      `h-3 w-9/12 bg-green-600 rounded-2xl ` +
                      (progress == 9 ? "" : "hidden")
                    }
                  ></div>
                  <div
                    className={
                      `h-3 w-10/12 bg-green-600 rounded-2xl ` +
                      (progress == 10 ? "" : "hidden")
                    }
                  ></div>
                  <div
                    className={
                      `h-3 w-11/12 bg-green-600 rounded-2xl ` +
                      (progress == 11 ? "" : "hidden")
                    }
                  ></div>
                  <div
                    className={
                      `h-3 w-12/12 bg-green-600 rounded-2xl ` +
                      (progress == 12 ? "" : "hidden")
                    }
                  ></div>
                </div> */}
                  {personalia.data_profil_image !== null &&
                  personalia.data_profil_image !== "" ? (
                    <Image
                      src={
                        process.env.MAIN_URL +
                        "/api/image" +
                        personalia.data_profil_image
                      }
                      alt="foto personalia"
                      // width={200}
                      // height={200}
                      fill={true}
                      objectFit="cover"
                    />
                  ) : (
                    <div className="flex flex-col">
                      <FontAwesomeIcon
                        icon={faUser}
                        fontSize={75}
                        className="text-slate-200"
                      />
                      <span className="text-center text-[10px] text-slate-400">
                        Belum Ada Foto
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col flex-1 px-3">
                <label className="-mb-1 text-sm text-lime-600">
                  Nama{" "}
                  {/* <span className="text-red-600 italic">
                  {errorPersonalia.nama}
                </span> */}
                </label>
                <label className="p-1 border-[1px] border-lime-600 rounded-lg">
                  {personalia?.nama}
                </label>
                {/* <input
                type="text"
                ref={namaRef}
                className="p-1 border-[1px] border-lime-600 rounded-lg"
                placeholder="di isi Nama"
                onKeyDown={handleEnter}
                value={personalia?.nama}
                onChange={(e) => {
                  setPersonalia((old: any) => {
                    return { ...old, nama: e.target.value };
                  });
                }}
                /> */}
                <label className="-mb-1 text-sm text-lime-600">Nik</label>
                <label className="p-1 border-[1px] border-lime-600 rounded-lg">
                  {personalia?.nik}
                </label>
                {/* <input
                type="number"
                className="p-1 border-[1px] border-lime-600 rounded-lg"
                placeholder="di isi Nik"
                onKeyDown={handleEnter}
                value={personalia?.nik}
                onChange={(e) => {
                  setPersonalia((old: any) => {
                    return { ...old, nik: e.target.value };
                  });
                }}
                /> */}
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <label className="-mb-1 text-sm text-lime-600">
                      Status Pernikahan
                    </label>
                    <label className="p-1 border-[1px] border-lime-600 rounded-lg">
                      {personalia.status_kawin}
                    </label>
                    {/* <select
                    className="p-1 border-[1px] border-lime-600 rounded-lg"
                    defaultValue={""}
                    value={personalia.status_kawin}
                    onKeyDown={handleEnter}
                    onChange={(e) => {
                      setPersonalia((old: any) => {
                        return { ...old, status_kawin: e.target.value };
                      });
                    }}
                  >
                    <option value={""} disabled>
                      Pilih Status Pernikahan
                    </option>
                    <option
                      value={"Kawin"}
                      // selected={
                      //   personalia.status_kawin == "Kawin" ? true : false
                      // }
                    >
                      Kawin
                    </option>
                    <option
                      value={"Belum Kawin"}
                      // selected={
                      //   personalia.status_kawin == "Belum Kawin" ? true : false
                      // }
                    >
                      Belum Kawin
                    </option>
                  </select> */}
                  </div>
                  {personalia.status_kawin == "Kawin" && (
                    <div className="flex flex-col">
                      <label className="-mb-1 text-sm text-lime-600">
                        Tgl Pernikahan
                      </label>
                      <label className="p-1 border-[1px] border-lime-600 rounded-lg">
                        {personalia.tanggal_menikah.substring(0, 10)}
                      </label>
                      {/* <input
                      type="date"
                      className="p-1 border-[1px] border-lime-600 rounded-lg"
                      placeholder="di isi Tanggal Pernikahan"
                      onKeyDown={handleEnter}
                      onChange={(e) => {
                        setPersonalia((old: any) => {
                          return { ...old, tanggal_menikah: e.target.value };
                        });
                      }}
                      value={
                        personalia.tanggal_menikah !== null
                          ? personalia.tanggal_menikah.substring(0, 10)
                          : ""
                      }
                    /> */}
                    </div>
                  )}
                </div>
                <label className="-mb-1 text-sm text-lime-600">
                  Tanggal lahir
                </label>
                <label className="p-1 border-[1px] border-lime-600 rounded-lg">
                  {personalia.tanggal_lahir.substring(0, 10)}
                </label>
                {/* <input
                type="date"
                className="p-1 border-[1px] border-lime-600 rounded-lg"
                onKeyDown={handleEnter}
                onChange={(e) => {
                  setPersonalia((old: any) => {
                    return { ...old, tanggal_lahir: e.target.value };
                  });
                }}
                value={personalia.tanggal_lahir.substring(0, 10)}
                /> */}
                <label className="-mb-1 text-sm text-lime-600">
                  Golongan Darah
                </label>
                <label className="p-1 border-[1px] border-lime-600 rounded-lg">
                  {personalia.gol_darah}
                </label>
                {/* <select
                className="p-1 border-[1px] border-lime-600 rounded-lg"
                defaultValue={""}
                value={personalia.gol_darah}
                onKeyDown={handleEnter}
                onChange={(e) => {
                  setPersonalia((old: any) => {
                    return { ...old, gol_darah: e.target.value };
                  });
                }}
                >
                <option value={""} disabled>
                  Pilih Golongan Darah
                </option>
                <option
                  value={"A"}
                  // selected={personalia.gol_darah == "A" ? true : false}
                >
                  A
                </option>
                <option
                  value={"B"}
                  // selected={personalia.gol_darah == "B" ? true : false}
                >
                  B
                </option>
                <option
                  value={"AB"}
                  // selected={personalia.gol_darah == "AB" ? true : false}
                >
                  AB
                </option>
                <option
                  value={"O"}
                  // selected={personalia.gol_darah == "O" ? true : false}
                >
                  O
                </option>
                </select> */}
              </div>
              <div className="flex flex-col flex-1 px-3">
                <label className="-mb-1 text-sm text-lime-600">
                  Email{" "}
                  {/* <span className="text-red-600 italic">
                  {errorPersonalia.email}
                </span> */}
                </label>
                <label className="p-1 border-[1px] border-lime-600 rounded-lg">
                  {personalia.email}
                </label>
                {/* <input
                ref={emailRef}
                type="email"
                className="p-1 border-[1px] border-lime-600 rounded-lg required:border-red-600"
                placeholder="di isi email@contoh.com"
                onKeyDown={handleEnter}
                onChange={(e) => {
                  setPersonalia((old: any) => {
                    return { ...old, email: e.target.value };
                  });
                }}
                value={personalia.email}
              /> */}
                <label className="-mb-1 text-sm text-lime-600">
                  Nomor Hp / WA{" "}
                  {/* <span className="text-red-600 italic">
                  {errorPersonalia.telpon}
                </span> */}
                </label>
                <label className="p-1 border-[1px] border-lime-600 rounded-lg">
                  {personalia.hp}
                </label>
                {/* <input
                ref={telponRef}
                type="number"
                className="p-1 border-[1px] border-lime-600 rounded-lg"
                placeholder="di isi Nomor Handphone"
                onKeyDown={handleEnter}
                onChange={(e) => {
                  setPersonalia((old: any) => {
                    return {
                      ...old,
                      telpon: e.target.value,
                      hp: e.target.value,
                    };
                  });
                }}
                value={personalia.hp}
              /> */}
                <label className="-mb-1 text-sm text-lime-600">
                  Tempat Lahir
                </label>
                <label className="p-1 border-[1px] border-lime-600 rounded-lg">
                  {personalia.tempat_lahir}
                </label>
                {/* <input
                type="text"
                className="p-1 border-[1px] border-lime-600 rounded-lg"
                placeholder="di isi Kota Kelahiran"
                onKeyDown={handleEnter}
                onChange={(e) => {
                  setPersonalia((old: any) => {
                    return { ...old, tempat_lahir: e.target.value };
                  });
                }}
                value={personalia.tempat_lahir}
              /> */}
                <label className="-mb-1 text-sm text-lime-600">
                  Jenis Kelamin
                </label>
                <label className="p-1 border-[1px] border-lime-600 rounded-lg">
                  {personalia.jenis_kelamin}
                </label>
                {/* <select
                className="p-1 border-[1px] border-lime-600 rounded-lg"
                onKeyDown={handleEnter}
                defaultValue={""}
                value={personalia.jenis_kelamin}
                onChange={(e) => {
                  setPersonalia((old: any) => {
                    return { ...old, jenis_kelamin: e.target.value };
                  });
                }}
              >
                <option value={""} disabled>
                  Pilih Jenis Kelamin
                </option>
                <option
                  value={"Laki-Laki"}
                  selected={
                    personalia.jenis_kelamin.toLowerCase() == "laki-laki"
                      ? true
                      : false
                  }
                >
                  Laki-Laki
                </option>
                <option
                  value={"Perempuan"}
                  selected={
                    personalia.jenis_kelamin.toLowerCase() == "perempuan"
                      ? true
                      : false
                  }
                >
                  Perempuan
                </option>
              </select> */}
                <label className="-mb-1 text-sm text-lime-600">Agama</label>
                <label className="p-1 border-[1px] border-lime-600 rounded-lg">
                  {personalia.agama}
                </label>
                {/* <select
                className="p-1 border-[1px] border-lime-600 rounded-lg"
                onKeyDown={handleEnter}
                defaultValue={""}
                value={personalia.agama}
                onChange={(e) => {
                  setPersonalia((old: any) => {
                    return { ...old, agama: e.target.value };
                  });
                }}
              >
                <option value={""} disabled>
                  Pilih Agama
                </option>
                <option
                  value={"Islam"}
                  // selected={personalia.agama == "Islam" ? true : false}
                >
                  Islam
                </option>
                <option
                  value={"Protestan"}
                  // selected={personalia.agama == "Protestan" ? true : false}
                >
                  Protestan
                </option>
                <option
                  value={"Katolik"}
                  // selected={personalia.agama == "Katolik" ? true : false}
                >
                  Katolik
                </option>
                <option
                  value={"Hindu"}
                  // selected={personalia.agama == "Hindu" ? true : false}
                >
                  Hindu
                </option>
                <option
                  value={"Budha"}
                  // selected={personalia.agama == "Budha" ? true : false}
                >
                  Budha
                </option>
                <option
                  value={"Khonghucu"}
                  // selected={personalia.agama == "Khonghucu" ? true : false}
                >
                  Khonghucu
                </option>
              </select> */}
              </div>
            </div>
            <div className="flex flex-row mt-2 space-x-3 px-3 md:px-0">
              <div className="flex-1 flex flex-col pr-3 md:pr-0">
                <label className="-mb-1 text-sm text-lime-600">
                  Alamat Rumah
                </label>
                <label className="p-1 border-[1px] border-lime-600 rounded-lg">
                  {personalia.alamat}
                </label>
                {/* <input
                type="text"
                className="p-1 border-[1px] border-lime-600 rounded-lg"
                placeholder="di isi Alamat Rumah"
                onKeyDown={handleEnter}
                onChange={(e) => {
                  setPersonalia((old: any) => {
                    return { ...old, alamat: e.target.value };
                  });
                }}
                value={personalia.alamat}
              /> */}
              </div>
            </div>
            <div className="flex flex-col md:flex-row mt-2 px-3 md:px-0 md:space-x-3 ">
              <div className="flex-1 flex flex-col pr-3 md:pr-0">
                <label className="-mb-1 text-sm text-lime-600">
                  Username Login{" "}
                  {/* <span className="text-[10px] text-red-600 underline">
                  {!allowName && "Username Tidak di Izinkan"}
                </span> */}
                  {/* <span className="text-[10px] text-red-600 italic">
                  {errorPersonalia.username
                    ? "/" + errorPersonalia.username
                    : ""}
                </span> */}
                </label>
                <div className="flex flex-row">
                  <label className="p-1 border-[1px] border-lime-600 rounded-lg">
                    {personalia.username}
                  </label>
                  {/* <input
                  type="text"
                  ref={usernameRef}
                  className="p-1 border-y-[1px] border-l-[1px] border-lime-600  rounded-l-lg"
                  placeholder="di isi Username Login"
                  onChange={(e) => {
                    // if (personalia.id == undefined) {
                    setSearchName(e.target.value);
                    setUsers((old: any) => {
                      return { ...old, username: e.target.value };
                    });
                    setPersonalia((old: any) => {
                      return { ...old, username: e.target.value };
                    });
                    // }
                  }}
                  onKeyDown={handleEnter}
                  value={personalia.username}
                /> */}
                  {/* <div className="w-7  h-full border-r-[1px] border-y-[1px] border-lime-600 rounded-r-lg flex justify-center items-center"> */}
                  {/* {searchName !== "" && searchName.length >= 4 && allowName && (
                  <FontAwesomeIcon icon={faCheck} className="text-green-600" />
                )} */}
                  {/* {searchLoading ? (
                    <FontAwesomeIcon
                      icon={faCircleNotch}
                      className="text-lime-600 animate-spin"
                    />
                  ) : searchName !== "" && searchName.length >= 4 ? (
                    allowName ? (
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="text-green-600"
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faXmark}
                        className="text-red-600"
                      />
                    )
                  ) : pengguna?.username == personalia.username && allowName ? (
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="text-green-600"
                    />
                  ) : (
                    <FontAwesomeIcon icon={faXmark} className="text-red-600" />
                  )} */}
                  {/* </div> */}
                </div>
              </div>
              {/* <div className="flex-1 flex flex-col pr-3 md:pr-0">
              <label className="-mb-1 text-sm text-lime-600">
                Password{" "}
                <span className="text-red-600 italic">
                  {errorPersonalia.password}
                </span>
              </label>
              <div className="flex flex-row">
                <input
                  type={lookPass ? "text" : "password"}
                  ref={passwordRef}
                  className="p-1 border-l-[1px] border-y-[1px] border-lime-600 rounded-l-lg"
                  placeholder="di isi Password Login"
                  onKeyDown={handleEnter}
                  onChange={(e) => {
                    setPersonalia((old: any) => {
                      return { ...old, password: e.target.value };
                    });
                  }}
                />
                <div
                  className="w-8 h-full flex justify-center items-center rounded-r-lg border-r-[1px] border-y-[1px] border-lime-600 "
                  onClick={() => {
                    setLookPass((p) => !p);
                  }}
                >
                  {lookPass ? (
                    <FontAwesomeIcon icon={faEye} />
                  ) : (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  )}
                </div>
              </div>
            </div> */}
              {/* <div className="flex-1 flex flex-col pr-3 md:pr-0">
              <label className="-mb-1 text-sm text-lime-600">
                Konfirmasi Password{" "}
                <span className="text-red-600 italic">
                  {errorPersonalia.password}
                </span>
              </label>

              <div className="flex flex-row">
                <input
                  type={lookPass ? "text" : "password"}
                  className="p-1  border-l-[1px] border-y-[1px] border-lime-600 rounded-l-lg"
                  placeholder="di isi Harus Sama dengan Password"
                  onKeyDown={handleEnter}
                  onChange={(e) => {
                    setPersonalia((old: any) => {
                      return { ...old, konfirm_password: e.target.value };
                    });
                  }}
                />
                <div
                  className="w-8 h-full flex justify-center items-center rounded-r-lg border-r-[1px] border-y-[1px] border-lime-600 "
                  onClick={() => {
                    setLookPass((p) => !p);
                  }}
                >
                  {lookPass ? (
                    <FontAwesomeIcon icon={faEye} />
                  ) : (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  )}
                </div>
              </div>
            </div> */}
            </div>
            <div className="mt-2 w-full border-b-2 border-lime-600 ">
              <div className="flex flex-row hover:cursor-pointer group/tab">
                <div
                  className={
                    "h-10 rounded-t-xl p-2 text-slate-50 text-sm " +
                    "bg-lime-600 "
                  }
                >
                  INFO PERSONALIA PERUSAHAAN
                </div>
                <div className={"h-10 w-5 " + "bg-lime-600 "}>
                  <div className="bg-white h-10 w-5 rounded-bl-full"></div>
                </div>
              </div>
            </div>
            <div className="flex flex-row mt-2 space-x-3 px-3 md:px-0">
              <div className="flex-1 flex flex-col"></div>
            </div>
            <div className="flex flex-col md:flex-row  mt-2 px-3 md:px-0 md:space-x-3">
              <div className="flex-1 flex flex-col pr-3 md:pr-0">
                <label className="-mb-1 text-sm text-lime-600">
                  Status Pegawai
                </label>
                <label className="p-1 border-[1px] border-lime-600 rounded-lg">
                  {personalia.status_pegawai}
                </label>
                {/* <select
                className="p-1 border-[1px] border-lime-600 rounded-lg"
                onKeyDown={handleEnter}
                defaultValue={""}
                value={personalia.status_pegawai}
                onChange={(e) => {
                  setPersonalia((old: any) => {
                    return { ...old, status_pegawai: e.target.value };
                  });
                }}
              >
                <option value={""} disabled>
                  Pilih Status Pegawai
                </option>
                {helper.status.map((item, key) => {
                  return (
                    <option
                      key={key}
                      // selected={
                      //   personalia.status_pegawai == item.nama_status
                      //     ? true
                      //     : false
                      // }
                    >
                      {item.nama_status}
                    </option>
                  );
                })}
              </select> */}
              </div>
              <div className="flex-1 flex flex-col pr-3 md:pr-0">
                <label className="-mb-1 text-sm text-lime-600">
                  Lokasi Absen
                </label>
                <label className="p-1 border-[1px] border-lime-600 rounded-lg">
                  {lokasiAbsen}
                </label>
              </div>
              <div className="flex-1 flex flex-col pr-3 md:pr-0">
                <label className="-mb-1 text-sm text-lime-600">Golongan</label>
                <label className="p-1 border-[1px] border-lime-600 rounded-lg">
                  {personalia.gol}
                </label>
                {/* <select
                className="p-1 border-[1px] border-lime-600 rounded-lg"
                defaultValue={""}
                value={personalia.gol}
                onKeyDown={handleEnter}
                onChange={(e) => {
                  setPersonalia((old: any) => {
                    return { ...old, gol: e.target.value };
                  });
                }}
              >
                <option value={""} disabled>
                  Pilih Golongan
                </option>
                {helper.golongan.map((item, key) => {
                  return (
                    <option
                      key={key}
                      // selected={
                      //   personalia.gol == item.nama_golongan ? true : false
                      // }
                    >
                      {item.nama_golongan}
                    </option>
                  );
                })}
              </select> */}
              </div>
              <div className="flex-1 flex flex-col pr-3 md:pr-0">
                <div>
                  <label className="-mb-1 text-sm text-lime-600">
                    Unit Kerja
                  </label>
                  {/* <span className="text-red-600 italic">
                  {errorPersonalia.unit_kerja}
                </span> */}
                </div>
                <label className="p-1 border-[1px] border-lime-600 rounded-lg">
                  {personalia.unit_kerja}
                </label>
                {/* <select
                className="p-1 border-[1px] border-lime-600 rounded-lg"
                defaultValue={""}
                value={personalia.unit_kerja}
                onKeyDown={handleEnter}
                onChange={(e) => {
                  setPersonalia((old: any) => {
                    return { ...old, unit_kerja: e.target.value };
                  });
                }}
              >
                <option value={""} disabled>
                  Pilih Unit Kerja
                </option>
                {helper.unitKerja.map((item, key) => {
                  return (
                    <option
                      key={key}
                      // selected={
                      //   personalia.unit_kerja == item.nama_unit ? true : false
                      // }
                    >
                      {item.nama_unit}
                    </option>
                  );
                })}
              </select> */}
              </div>
            </div>
            <div className="flex flex-col md:flex-row  mt-2 px-3 md:px-0 md:space-x-3">
              <div className="flex-1 flex flex-col pr-3 md:pr-0">
                <div>
                  <label className="-mb-1 text-sm text-lime-600">Jabatan</label>{" "}
                  {/* <span className="text-red-600 italic">
                  {errorPersonalia.jabatan}
                </span> */}
                </div>
                <label className="p-1 border-[1px] border-lime-600 rounded-lg">
                  {personalia.jabatan}
                </label>
                {/* <select
                className="p-1 border-[1px] border-lime-600 rounded-lg"
                defaultValue={""}
                value={personalia.jabatan}
                onKeyDown={handleEnter}
                onChange={(e) => {
                  setPersonalia((old: any) => {
                    return { ...old, jabatan: e.target.value };
                  });
                }}
              >
                <option value={""} disabled>
                  Pilih Jabatan
                </option>
                {helper.jabatan.map((item, key) => {
                  return (
                    <option
                      key={key}
                      // selected={
                      //   personalia.jabatan == item.jabatan ? true : false
                      // }
                    >
                      {item.jabatan}
                    </option>
                  );
                })}
              </select> */}
              </div>
              <div className="flex-1 flex flex-col pr-3 md:pr-0">
                <div>
                  <label className="-mb-1 text-sm text-lime-600">
                    Bagian / Bidang
                  </label>
                  {/* <span className="text-red-600 italic">
                  {errorPersonalia.bagian}
                </span> */}
                </div>
                <label className="p-1 border-[1px] border-lime-600 rounded-lg">
                  {personalia.bagian}
                </label>
                {/* <select
                className="p-1 border-[1px] border-lime-600 rounded-lg"
                defaultValue={""}
                value={personalia.bagian}
                onKeyDown={handleEnter}
                onChange={(e) => {
                  setPersonalia((old: any) => {
                    return { ...old, bagian: e.target.value };
                  });
                }}
              >
                <option value={""} disabled>
                  Pilih Bagian/ Bidang
                </option>
                {helper.bagian.map((item, key) => {
                  return (
                    <option
                      key={key}
                      // selected={
                      //   personalia.bagian == item.nama_bagian ? true : false
                      // }
                    >
                      {item.nama_bagian}
                    </option>
                  );
                })}
              </select> */}
              </div>
              <div className="flex-1 flex flex-col pr-3 md:pr-0">
                <label className="-mb-1 text-sm text-lime-600">Pangkat</label>
                <label className="p-1 border-[1px] border-lime-600 rounded-lg">
                  {personalia.pangkat}
                </label>
                {/* <select
                className="p-1 border-[1px] border-lime-600 rounded-lg"
                defaultValue={""}
                value={personalia.pangkat}
                onKeyDown={handleEnter}
                onChange={(e) => {
                  setPersonalia((old: any) => {
                    return { ...old, pangkat: e.target.value };
                  });
                }}
              >
                <option value={""} disabled>
                  Pilih Pangkat
                </option>
                {helper.pangkat.map((item, key) => {
                  return (
                    <option
                      key={key}
                      // selected={
                      //   personalia.pangkat == item.nama_pangkat ? true : false
                      // }
                    >
                      {item.nama_pangkat}
                    </option>
                  );
                })}
              </select> */}
              </div>
            </div>
          </section>
          {/* akhir bagian data diri */}
          {/* bagian personal  */}
          <section className={tab !== "personal" ? "hidden" : ""}>
            <div className="flex flex-col md:flex-row mt-2 px-3 md:px-0 md:space-x-3 ">
              <div className="flex-1 flex flex-col pr-3 md:pr-0">
                <label className="-mb-1 text-sm text-lime-600">
                  Pendidikan Terakhir
                </label>
                <label className="p-1 border-[1px] border-lime-600 rounded-lg">
                  {personalia.pendidikan}
                </label>
                {/* <input
                type="text"
                className="p-1 border-[1px] border-lime-600 rounded-lg"
                placeholder="di isi Pendidikan Terakhir"
                onKeyDown={handleEnter}
                onChange={(e) => {
                  setPersonalia((old: any) => {
                    return { ...old, pendidikan: e.target.value };
                  });
                }}
                value={personalia.pendidikan}
              /> */}
              </div>
              <div className="flex-1 flex flex-col pr-3 md:pr-0">
                <label className="-mb-1 text-sm text-lime-600">
                  No Kartu Kerluarga
                </label>
                <label className="p-1 border-[1px] border-lime-600 rounded-lg">
                  {personalia.kk}
                </label>
                {/* <input
                type="number"
                className="p-1 border-[1px] border-lime-600 rounded-lg"
                placeholder="di isi No Kartu Kerluarga"
                onKeyDown={handleEnter}
                onChange={(e) => {
                  setPersonalia((old: any) => {
                    return { ...old, kk: e.target.value };
                  });
                }}
                value={personalia.kk}
              /> */}
              </div>
              <div className="flex-1 flex flex-col pr-3 md:pr-0">
                <label className="-mb-1 text-sm text-lime-600">Nomor KTP</label>
                <label className="p-1 border-[1px] border-lime-600 rounded-lg">
                  {personalia.ktp}
                </label>
                {/* <input
                type="number"
                className="p-1 border-[1px] border-lime-600 rounded-lg"
                placeholder="di isi Nomor KTP"
                onKeyDown={handleEnter}
                onChange={(e) => {
                  setPersonalia((old: any) => {
                    return { ...old, ktp: e.target.value };
                  });
                }}
                value={personalia.ktp}
              /> */}
              </div>
            </div>
            <div className="flex flex-col md:flex-row mt-2 px-3 md:px-0 md:space-x-3 ">
              <div className="flex-1 flex flex-col pr-3 md:pr-0">
                <label className="-mb-1 text-sm text-lime-600">NPWP</label>
                <label className="p-1 border-[1px] border-lime-600 rounded-lg">
                  {personalia.npwp}
                </label>
                {/* <input
                type="text"
                className="p-1 border-[1px] border-lime-600 rounded-lg"
                placeholder="di isi No NPWP"
                onKeyDown={handleEnter}
                onChange={(e) => {
                  setPersonalia((old: any) => {
                    return { ...old, npwp: e.target.value };
                  });
                }}
                value={personalia.npwp}
              /> */}
              </div>
              <div className="flex-1 flex flex-col pr-3 md:pr-0">
                <label className="-mb-1 text-sm text-lime-600">
                  EFIN PAJAK
                </label>
                <label className="p-1 border-[1px] border-lime-600 rounded-lg">
                  {personalia.efin}
                </label>
                {/* <input
                type="text"
                className="p-1 border-[1px] border-lime-600 rounded-lg"
                placeholder="di isi No EFIN PAJAK"
                onKeyDown={handleEnter}
                onChange={(e) => {
                  setPersonalia((old: any) => {
                    return { ...old, efin: e.target.value };
                  });
                }}
                value={personalia.efin}
              /> */}
              </div>
              <div className="flex-1 flex flex-col pr-3 md:pr-0">
                <label className="-mb-1 text-sm text-lime-600">
                  BPJS Ketenagakerjaan
                </label>
                <label className="p-1 border-[1px] border-lime-600 rounded-lg">
                  {personalia.bpjskt}
                </label>
                {/* <input
                type="number"
                className="p-1 border-[1px] border-lime-600 rounded-lg"
                placeholder="di isi No BPJS Ketenagakerjaan"
                onKeyDown={handleEnter}
                onChange={(e) => {
                  setPersonalia((old: any) => {
                    return { ...old, bpjskt: e.target.value };
                  });
                }}
                value={personalia.bpjskt}
              /> */}
              </div>
            </div>
            <div className="flex flex-col md:flex-row mt-2 px-3 md:px-0 md:space-x-3 ">
              <div className="flex-1 flex flex-col pr-3 md:pr-0">
                <label className="-mb-1 text-sm text-lime-600">
                  Bpjs Kesehatan
                </label>
                <label className="p-1 border-[1px] border-lime-600 rounded-lg">
                  {personalia.bpjs}
                </label>
                {/* <input
                type="number"
                className="p-1 border-[1px] border-lime-600 rounded-lg"
                placeholder="di isi No Bpjs Kesehatan"
                onKeyDown={handleEnter}
                onChange={(e) => {
                  setPersonalia((old: any) => {
                    return { ...old, bpjs: e.target.value };
                  });
                }}
                value={personalia.bpjs}
              /> */}
              </div>
              <div className="flex-1 flex flex-col pr-3 md:pr-0">
                <label className="-mb-1 text-sm text-lime-600">
                  Dapenma Pamsi
                </label>
                <label className="p-1 border-[1px] border-lime-600 rounded-lg">
                  {personalia.dapenmapamsi}
                </label>
                {/* <input
                type="number"
                className="p-1 border-[1px] border-lime-600 rounded-lg"
                placeholder="di isi No Dapenma Pamsi"
                onKeyDown={handleEnter}
                onChange={(e) => {
                  setPersonalia((old: any) => {
                    return { ...old, dapenmapamsi: e.target.value };
                  });
                }}
                value={personalia.dapenmapamsi}
              /> */}
              </div>
              <div className="flex-1 flex flex-col pr-3 md:pr-0">
                <label className="-mb-1 text-sm text-lime-600">
                  Polis Axa Mandiri
                </label>
                <label className="p-1 border-[1px] border-lime-600 rounded-lg">
                  {personalia.polis}
                </label>
                {/* <input
                type="number"
                className="p-1 border-[1px] border-lime-600 rounded-lg"
                placeholder="di isi No Polis Axa"
                onKeyDown={handleEnter}
                onChange={(e) => {
                  setPersonalia((old: any) => {
                    return { ...old, polis: e.target.value };
                  });
                }}
                value={personalia.polis}
              /> */}
              </div>
            </div>
            <div className="flex flex-col md:flex-row mt-2 px-3 md:px-0 md:space-x-3 ">
              <div className="flex-1 flex flex-col pr-3 md:pr-0">
                <label className="-mb-1 text-sm text-lime-600">Sim C</label>
                <label className="p-1 border-[1px] border-lime-600 rounded-lg">
                  {personalia.simc}
                </label>
                {/* <input
                type="number"
                className="p-1 border-[1px] border-lime-600 rounded-lg"
                placeholder="di isi No Sim C"
                onKeyDown={handleEnter}
                onChange={(e) => {
                  setPersonalia((old: any) => {
                    return { ...old, simc: e.target.value };
                  });
                }}
                value={personalia.simc}
              /> */}
              </div>
              <div className="flex-1 flex flex-col pr-3 md:pr-0">
                <label className="-mb-1 text-sm text-lime-600">Sim A/B</label>
                <label className="p-1 border-[1px] border-lime-600 rounded-lg">
                  {personalia.simab}
                </label>
                {/* <input
                type="number"
                className="p-1 border-[1px] border-lime-600 rounded-lg"
                placeholder="di isi No Sim A/B"
                onKeyDown={handleEnter}
                onChange={(e) => {
                  setPersonalia((old: any) => {
                    return { ...old, simab: e.target.value };
                  });
                }}
                value={personalia.simab}
              /> */}
              </div>
              <div className="flex-1 flex flex-col pr-3 md:pr-0">
                <label className="-mb-1 text-sm text-lime-600">Paspor</label>
                <label className="p-1 border-[1px] border-lime-600 rounded-lg">
                  {personalia.paspor}
                </label>
                {/* <input
                type="number"
                className="p-1 border-[1px] border-lime-600 rounded-lg"
                placeholder="di isi No Paspor"
                onKeyDown={handleEnter}
                onChange={(e) => {
                  setPersonalia((old: any) => {
                    return { ...old, paspor: e.target.value };
                  });
                }}
                value={personalia.paspor}
              /> */}
              </div>
            </div>
            <div className="flex flex-col md:flex-row mt-2 px-3 md:px-0 md:space-x-3 ">
              <div className="flex-1 flex flex-col pr-3 md:pr-0">
                <label className="-mb-1 text-sm text-lime-600">Simpeda</label>
                <label className="p-1 border-[1px] border-lime-600 rounded-lg">
                  {personalia.simpeda}
                </label>
                {/* <input
                type="text"
                className="p-1 border-[1px] border-lime-600 rounded-lg"
                placeholder="di isi No Simpeda"
                onKeyDown={handleEnter}
                onChange={(e) => {
                  setPersonalia((old: any) => {
                    return { ...old, simpeda: e.target.value };
                  });
                }}
                value={personalia.simpeda}
              /> */}
              </div>
              <div className="flex-1 flex flex-col pr-3 md:pr-0"></div>
              <div className="flex-1 flex flex-col pr-3 md:pr-0"></div>
            </div>
            <div className="mt-2 w-full border-b-2 border-lime-600 ">
              <div className="flex flex-row hover:cursor-pointer group/tab">
                <div
                  className={
                    "h-10 rounded-t-xl p-2 text-slate-50 text-sm " +
                    "bg-lime-600 "
                  }
                >
                  DATA PENDUKUNG
                </div>
                <div className={"h-10 w-5 " + "bg-lime-600 "}>
                  <div className="bg-white h-10 w-5 rounded-bl-full"></div>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row mt-2 px-3 md:px-0 md:space-x-3 ">
              <div className="flex-1 flex flex-col pr-3 md:pr-0">
                <label className="-mb-1 text-sm text-lime-600">Nama Ayah</label>
                <label className="p-1 border-[1px] border-lime-600 rounded-lg">
                  {personalia.nama_ayah}
                </label>
                {/* <input
                type="text"
                className="p-1 border-[1px] border-lime-600 rounded-lg"
                placeholder="di isi Nama Ayah"
                onKeyDown={handleEnter}
                onChange={(e) => {
                  setPersonalia((old: any) => {
                    return { ...old, nama_ayah: e.target.value };
                  });
                }}
                value={personalia.nama_ayah}
              /> */}
              </div>
              <div className="flex-1 flex flex-col pr-3 md:pr-0">
                <label className="-mb-1 text-sm text-lime-600">Nama Ibu</label>
                <label className="p-1 border-[1px] border-lime-600 rounded-lg">
                  {personalia.nama_ibu}
                </label>
                {/* <input
                type="text"
                className="p-1 border-[1px] border-lime-600 rounded-lg"
                placeholder="di isi Nama Ibu"
                onKeyDown={handleEnter}
                onChange={(e) => {
                  setPersonalia((old: any) => {
                    return { ...old, nama_ibu: e.target.value };
                  });
                }}
                value={personalia.nama_ibu}
              /> */}
              </div>
              <div className="flex-1 flex flex-col pr-3 md:pr-0">
                <label className="-mb-1 text-sm text-lime-600">Anak No.</label>
                <label className="p-1 border-[1px] border-lime-600 rounded-lg">
                  {personalia.anak_nomor}
                </label>
                {/* <input
                type="number"
                className="p-1 border-[1px] border-lime-600 rounded-lg"
                placeholder="Kamu Anak ke Berapa ?"
                onKeyDown={handleEnter}
                onChange={(e) => {
                  setPersonalia((old: any) => {
                    return { ...old, anak_nomor: e.target.value };
                  });
                }}
                value={personalia.anak_nomor}
              /> */}
              </div>
            </div>
            <div className="flex flex-col md:flex-row mt-2 px-3 md:px-0 md:space-x-3 ">
              <div className="flex-1 flex flex-col pr-3 md:pr-0">
                <label className="-mb-1 text-sm text-lime-600">
                  Jumlah Saudara
                </label>
                <label className="p-1 border-[1px] border-lime-600 rounded-lg">
                  {personalia.jml_saudara}
                </label>
                {/* <input
                type="number"
                className="p-1 border-[1px] border-lime-600 rounded-lg"
                placeholder="di isi Berapa Saudara"
                onKeyDown={handleEnter}
                onChange={(e) => {
                  setPersonalia((old: any) => {
                    return { ...old, jml_saudara: e.target.value };
                  });
                }}
                value={personalia.jml_saudara}
              /> */}
              </div>
              <div className="flex-1 flex flex-col pr-3 md:pr-0"></div>
              <div className="flex-1 flex flex-col pr-3 md:pr-0"></div>
            </div>
          </section>
          {/* akhir bagian personal  */}
          {/* bagian keluarga  */}
          <section className={tab !== "pendidikan" ? "hidden" : ""}>
            <div className="mt-2 w-full border-b-2 border-lime-600 ">
              <div className="flex flex-row hover:cursor-pointer group/tab">
                <div className="h-8 rounded-t-xl px-2 py-1 text-slate-50 text-sm bg-lime-600 ">
                  KELUARGA
                </div>
                <div className={"h-8 w-5 bg-lime-600 "}>
                  <div className="bg-white h-8 w-5 rounded-bl-full"></div>
                </div>
                {/* <div className="flex-1">
                <button
                  type="button"
                  className="p-1"
                  onClick={() => {
                    if (keluargaI == undefined) {
                      setKeluargaI([keluargaE]);
                    } else {
                      setKeluargaI((prev) => [
                        ...(prev as keluargaT[]),
                        keluargaE,
                      ]);
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} />{" "}
                </button>
              </div> */}
              </div>
            </div>
            {keluargaI !== undefined &&
              keluargaI.map((item, index) => {
                return (
                  <div
                    className="mt-2 w-full  flex flex-wrap space-x-2"
                    key={index}
                  >
                    <div className="flex flex-col">
                      <span className="text-[11px]">Nama Keluarga</span>
                      <label className="bg-slate-50 rounded-lg border-[1px] py-1 px-2">
                        {item.nama}
                      </label>
                      {/* <input
                      type="text"
                      placeholder="Isi Nama Keluarga"
                      className="bg-slate-50 rounded-lg border-[1px] py-1 px-2"
                      value={item.nama}
                      onChange={(e) => {
                        keluargaI[index].nama = e.target.value;
                        setKeluargaI(() => [...keluargaI]);
                        // setPersonalia((old: any) => {
                        //   return { ...old, jenis_kelamin: e.target.value };
                        // });
                      }}
                      onKeyDown={handleEnter}
                    /> */}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px]">Tempat Lahir</span>
                      <label className="bg-slate-50 rounded-lg border-[1px] py-1 px-2">
                        {item.tempat_lahir}
                      </label>
                      {/* <input
                      type="text"
                      placeholder="Isi Tempat Lahir"
                      className="bg-slate-50 rounded-lg border-[1px] py-1 px-2"
                      value={item.tempat_lahir}
                      onChange={(e) => {
                        keluargaI[index].tempat_lahir = e.target.value;
                        setKeluargaI(() => [...keluargaI]);
                        // setPersonalia((old: any) => {
                        //   return { ...old, jenis_kelamin: e.target.value };
                        // });
                      }}
                      onKeyDown={handleEnter}
                    /> */}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px]">Tanggal Lahir</span>
                      <label className="bg-slate-50 rounded-lg border-[1px] py-1 px-2">
                        {item.tanggal_lahir}
                      </label>
                      {/* <input
                      type="date"
                      placeholder="Isi Tanggal Lahir"
                      className="bg-slate-50 rounded-lg border-[1px] py-1 px-2"
                      value={
                        item.tanggal_lahir == null
                          ? ""
                          : item.tanggal_lahir.includes("T") &&
                            item.tanggal_lahir.includes("Z")
                          ? item.tanggal_lahir.substring(0, 10)
                          : item.tanggal_lahir
                      }
                      onChange={(e) => {
                        keluargaI[index].tanggal_lahir = e.target.value;
                        setKeluargaI(() => [...keluargaI]);
                      }}
                      onKeyDown={handleEnter}
                    /> */}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px]">Jenis Kelamin</span>
                      <label className="bg-slate-50 rounded-lg border-[1px] py-1 px-2">
                        {item.jenis_kelamin}
                      </label>
                      {/* <select
                      className="p-1 border-[1px] border-lime-600 rounded-lg"
                      onKeyDown={handleEnter}
                      defaultValue={""}
                      value={item.jenis_kelamin}
                      onChange={(e) => {
                        keluargaI[index].jenis_kelamin = e.target.value;
                        setKeluargaI(() => [...keluargaI]);
                        // setPersonalia((old: any) => {
                        //   return { ...old, jenis_kelamin: e.target.value };
                        // });
                      }}
                    >
                      <option value={""} disabled>
                        Pilih Jenis Kelamin
                      </option>
                      <option value={"Laki-Laki"}>Laki-Laki</option>
                      <option value={"Perempuan"}>Perempuan</option>
                    </select> */}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px]">Nomor KTP</span>
                      <label className="bg-slate-50 rounded-lg border-[1px] py-1 px-2">
                        {item.nomor_ktp}
                      </label>
                      {/* <input
                      type="number "
                      placeholder="Isi Nomor KTP"
                      className="bg-slate-50 rounded-lg border-[1px] py-1 px-2"
                      value={item.nomor_ktp}
                      onChange={(e) => {
                        keluargaI[index].nomor_ktp = e.target.value;
                        setKeluargaI(() => [...keluargaI]);
                      }}
                      onKeyDown={handleEnter}
                    /> */}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px]">Pekerjaan</span>
                      <label className="bg-slate-50 rounded-lg border-[1px] py-1 px-2">
                        {item.pekerjaan}
                      </label>
                      {/* <input
                      type="text"
                      placeholder="Isi Pekerjaan"
                      className="bg-slate-50 rounded-lg border-[1px] py-1 px-2"
                      value={item.pekerjaan}
                      onChange={(e) => {
                        keluargaI[index].pekerjaan = e.target.value;
                        setKeluargaI(() => [...keluargaI]);
                      }}
                      onKeyDown={handleEnter}
                    /> */}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px]">Agama</span>
                      <label className="bg-slate-50 rounded-lg border-[1px] py-1 px-2">
                        {item.agama}
                      </label>
                      {/* <select
                      className="p-1 border-[1px] border-lime-600 rounded-lg"
                      onKeyDown={handleEnter}
                      defaultValue={""}
                      value={item.agama}
                      onChange={(e) => {
                        keluargaI[index].agama = e.target.value;
                        setKeluargaI(() => [...keluargaI]);
                        // setPersonalia((old: any) => {
                        //   return { ...old, jenis_kelamin: e.target.value };
                        // });
                      }}
                    >
                      <option value={""} disabled>
                        Pilih Agama
                      </option>
                      <option value={"Islam"}>Islam</option>
                      <option value={"Protestan"}>Protestan</option>
                      <option value={"Katolik"}>Katolik</option>
                      <option value={"Hindu"}>Hindu</option>
                      <option value={"Budha"}>Budha</option>
                      <option value={"Khonghucu"}>Khonghucu</option>
                    </select> */}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px]">Pendidikan Terakhir</span>
                      <label className="bg-slate-50 rounded-lg border-[1px] py-1 px-2">
                        {item.pendidikan}
                      </label>
                      {/* <input
                      type="text"
                      placeholder="Isi Pendidikan Terakhir"
                      className="bg-slate-50 rounded-lg border-[1px] py-1 px-2"
                      value={item.pendidikan}
                      onChange={(e) => {
                        keluargaI[index].pendidikan = e.target.value;
                        setKeluargaI(() => [...keluargaI]);
                      }}
                      onKeyDown={handleEnter}
                    /> */}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px]">Hubungan</span>
                      <label className="bg-slate-50 rounded-lg border-[1px] py-1 px-2">
                        {item.hubungan}
                      </label>
                      {/* <input
                      type="text"
                      placeholder="contoh: Ayah, Ibu"
                      className="bg-slate-50 rounded-lg border-[1px] py-1 px-2"
                      value={item.hubungan}
                      onChange={(e) => {
                        keluargaI[index].hubungan = e.target.value;
                        setKeluargaI(() => [...keluargaI]);
                      }}
                      onKeyDown={handleEnter}
                    /> */}
                    </div>

                    {/* <AlertDialog>
                    <AlertDialogTrigger className="bg-red-600 mt-3 p-2  rounded-lg text-slate-50 max-h-12">
                      Hapus <FontAwesomeIcon icon={faTrash} />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogTitle>Apakah Anda Yakin ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Akan menghapus Data & FIle{" "}
                        <span className="text-orange-500">{item.nama}</span>
                      </AlertDialogDescription>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            if (item.id !== undefined && item.id > 0) {
                              const delUri = `/api/pengguna/delete/keluarga/${item.id}`;
                              console.log("delUri->", delUri);
                              fetch(delUri, {
                                method: "GET",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                              })
                                .then((res) => res.json())
                                .then((res) => {
                                  console.log("res del->", res);
                                  if (res.message == "Ok" && res.keluarga) {
                                    setKeluargaI(res.keluarga);
                                    toast({
                                      duration: 2000,
                                      className: "bg-green-500 text-slate-50",
                                      title: "Penghapusan Berhasil",
                                      description: "Sistem Memutakhirkan",
                                    });
                                  }
                                })
                                .catch((err) => console.log("err del->", err));
                            } else {
                              if (keluargaI !== undefined) {
                                let keluarga = keluargaI.filter(
                                  (_, i) => i !== index
                                );
                                setKeluargaI(keluarga);
                              }
                              toast({
                                duration: 2000,
                                className: "bg-green-500 text-slate-50",
                                title: "Penghapusan Berhasil",
                                description: "Sistem Memutakhirkan",
                              });
                            }

                            // console.log("click");
                          }}
                        >
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog> */}
                  </div>
                );
              })}
            <div className="mt-2 w-full border-b-2 border-lime-600 ">
              <div className="flex flex-row hover:cursor-pointer group/tab">
                <div className="h-8 rounded-t-xl px-2 py-1 text-slate-50 text-sm bg-lime-600 ">
                  PENDIDIKAN
                </div>
                <div className={"h-8 w-5 bg-lime-600 "}>
                  <div className="bg-white h-8 w-5 rounded-bl-full"></div>
                </div>
                {/* <div className="flex-1">
                <button
                  type="button"
                  className="p-1"
                  onClick={() => {
                    console.log("click");
                    if (pendidikanI == undefined) {
                      setPendidikanI([pendidikanE]);
                    } else {
                      setPendidikanI((prev) => [
                        ...(prev as pendidikanT[]),
                        pendidikanE,
                      ]);
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} />{" "}
                </button>
              </div> */}
              </div>
            </div>

            {pendidikanI !== undefined &&
              pendidikanI.map((item, index) => {
                // let tes = useMemo(
                //   () => <ThumbnailPdf fileUrl={item.path_file as string} />,
                //   [item.path_file]
                // );
                // console.log("pendidikan T Index", index);
                return (
                  <div className="flex " key={index}>
                    {/* {tes} */}
                    <div
                      className="w-40 h-48 bg-slate-100 border-[1px] border-dotted  rounded-tr-[70px] flex justify-center items-center cursor-pointer"
                      // onClick={() => {
                      //   dokPendidikanRef.current[index].click();
                      // }}
                    >
                      {item.path_file ? (
                        <ThumbnailPdf fileUrl={item.path_file} />
                      ) : item.file_pendidikan !== undefined &&
                        item.file_pendidikan !== null &&
                        typeof item.file_pendidikan == "string" &&
                        item.file_pendidikan !== "" ? (
                        <ThumbnailPdf
                          fileUrl={`/api/document${item.file_pendidikan}`}
                        />
                      ) : (
                        <div className="flex flex-col justify-center items-center h-full w-full">
                          <span className="text-center mb-2">
                            Belum ada Dokumen Ijazah
                          </span>
                          <FontAwesomeIcon icon={faPaperclip} />
                        </div>
                      )}
                      {/* <input
                      ref={(el) =>
                        (dokPendidikanRef.current[index] =
                          el as HTMLInputElement)
                      }
                      type="file"
                      placeholder="Isi Nomor Ijazah"
                      className="hidden"
                      accept=".pdf"
                      onChange={(e) => {
                        if (
                          e.target.files?.length !== undefined &&
                          e.target.files?.length > 0 &&
                          pendidikanI !== undefined
                        ) {
                          // setFf(e.target.files[0]);
                          pendidikanI[index].path_file = URL.createObjectURL(
                            e.target.files[0]
                          );
                          pendidikanI[index].file_pendidikan =
                            e.target.files[0];
                          pendidikanI[index].nama_file = e.target.files[0].name;
                          setPendidikanI(() => [...pendidikanI]);
                        }

                        console.log(e.target.files);
                      }}
                    />{" "} */}
                    </div>
                    <div
                      className="mt-2 w-full  flex flex-wrap space-x-2"
                      key={index}
                    >
                      <div className="flex flex-col">
                        <span className="text-[11px]">
                          Nama Sekolah/ Kampus
                        </span>
                        <label className="bg-slate-50 rounded-lg border-[1px] py-1 px-2">
                          {item.nama}
                        </label>
                        {/* <input
                        type="text"
                        placeholder="Isi Nama Sekolah/ Kampus"
                        className="bg-slate-50 rounded-lg border-[1px] py-1 px-2"
                        value={item.nama}
                        onChange={(e) => {
                          pendidikanI[index].nama = e.target.value;
                          setPendidikanI(() => [...pendidikanI]);
                        }}
                        onKeyDown={handleEnter}
                      /> */}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px]">Jenjang Pendidikan</span>
                        <label className="bg-slate-50 rounded-lg border-[1px] py-1 px-2">
                          {item.tingkat}
                        </label>
                        {/* <select
                        className="p-1 border-[1px] border-lime-600 rounded-lg"
                        onKeyDown={handleEnter}
                        value={item.tingkat}
                        defaultValue={""}
                        onChange={(e) => {
                          // console.log("pendidikan change", e.target.value);
                          // let pendidikanAr = pendidikanI;
                          pendidikanI[index].tingkat = e.target.value;
                          // pendidikanAr[index].tingkat = e.target.value;
                          setPendidikanI(() => [...pendidikanI]);
                          // setPendidikanI(prev=>{
                          //   return [...prev,[index]:{tingkat:"SD"}]
                          // })
                          // setPersonalia((old: any) => {
                          //   return { ...old, jenis_kelamin: e.target.value };
                          // });
                        }}
                      >
                        <option value={""} disabled>
                          Pilih Jenjang
                        </option>
                        <option value={"SD"}>SD</option>
                        <option value={"SMP"}>SMP Sederajat</option>
                        <option value={"SMA"}>SMA Sederajat</option>
                        <option value={"Diploma"}>Diploma</option>
                        <option value={"Sarjana"}>Sarjana</option>
                      </select> */}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px]">
                          Alamat Tempat Pendidikan
                        </span>
                        <label className="bg-slate-50 rounded-lg border-[1px] py-1 px-2">
                          {item.alamat}
                        </label>

                        {/* <input
                        type="text"
                        placeholder="Isi Tempat Pendidikan"
                        className="bg-slate-50 rounded-lg border-[1px] py-1 px-2"
                        value={item.alamat}
                        onChange={(e) => {
                          pendidikanI[index].alamat = e.target.value;
                          setPendidikanI(() => [...pendidikanI]);
                        }}
                        onKeyDown={handleEnter}
                      /> */}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px]">Fakultas</span>
                        <label className="bg-slate-50 rounded-lg border-[1px] py-1 px-2">
                          {item.fakultas}
                        </label>
                        {/* <input
                        type="text"
                        placeholder="Isi Fakultas"
                        className="bg-slate-50 rounded-lg border-[1px] py-1 px-2"
                        value={item.fakultas}
                        onChange={(e) => {
                          pendidikanI[index].fakultas = e.target.value;
                          setPendidikanI(() => [...pendidikanI]);
                        }}
                        onKeyDown={handleEnter}
                      /> */}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px]">Jurusan</span>
                        <label className="bg-slate-50 rounded-lg border-[1px] py-1 px-2">
                          {item.jurusan}
                        </label>
                        {/* <input
                        type="text"
                        placeholder="Isi Jurusan"
                        className="bg-slate-50 rounded-lg border-[1px] py-1 px-2"
                        value={item.jurusan}
                        onChange={(e) => {
                          pendidikanI[index].jurusan = e.target.value;
                          setPendidikanI(() => [...pendidikanI]);
                        }}
                        onKeyDown={handleEnter}
                      /> */}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px]">Tahun Lulus</span>
                        <label className="bg-slate-50 rounded-lg border-[1px] py-1 px-2">
                          {item.tahun}
                        </label>
                        {/* <input
                        type="number"
                        placeholder="Isi Tahun Lulus"
                        className="bg-slate-50 rounded-lg border-[1px] py-1 px-2"
                        value={item.tahun}
                        onChange={(e) => {
                          pendidikanI[index].tahun = parseInt(e.target.value);
                          setPendidikanI(() => [...pendidikanI]);
                        }}
                        onKeyDown={handleEnter}
                      /> */}
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[11px]">Nomor Ijazah</span>
                        <label className="bg-slate-50 rounded-lg border-[1px] py-1 px-2">
                          {item.no_ijazah}
                        </label>
                        {/* <input
                        type="text"
                        placeholder="Isi Nomor Ijazah"
                        className="bg-slate-50 rounded-lg border-[1px] py-1 px-2"
                        value={item.no_ijazah}
                        onChange={(e) => {
                          pendidikanI[index].no_ijazah = e.target.value;
                          setPendidikanI(() => [...pendidikanI]);
                        }}
                        onKeyDown={handleEnter}
                      /> */}
                      </div>
                      {/* <AlertDialog>
                      <AlertDialogTrigger className="bg-red-600 mt-3 p-2  rounded-lg text-slate-50 max-h-12">
                        Hapus <FontAwesomeIcon icon={faTrash} />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogTitle>Apakah Anda Yakin ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Akan menghapus Data & FIle{" "}
                          <span className="text-orange-500">{item.nama}</span>
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              if (item.id !== undefined && item.id > 0) {
                                const delUri = `/api/pengguna/delete/pendidikan/${item.id}`;
                                console.log("delUri->", delUri);
                                fetch(delUri, {
                                  method: "GET",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                })
                                  .then((res) => res.json())
                                  .then((res) => {
                                    console.log("res del->", res);
                                    if (res.message == "Ok" && res.pendidikan) {
                                      setPendidikanI(res.pendidikan);
                                    }
                                  })
                                  .catch((err) =>
                                    console.log("err del->", err)
                                  );
                              } else {
                                if (pendidikanI !== undefined) {
                                  let pendidikan = pendidikanI.filter(
                                    (_, i) => i !== index
                                  );
                                  setPendidikanI(pendidikan);
                                }
                              }
                              toast({
                                duration: 2000,
                                className: "bg-green-500 text-slate-50",
                                title: "Penghapusan Berhasil",
                                description: "Sistem Memutakhirkan",
                              });
                              // console.log("click");
                            }}
                          >
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog> */}

                      {item.file_pendidikan !== undefined &&
                        item.file_pendidikan !== null &&
                        typeof item.file_pendidikan == "string" &&
                        item.file_pendidikan !== "" && (
                          <Link
                            href={`/api/docview${item.file_pendidikan}`}
                            className="bg-lime-600 mt-3 p-2  rounded-lg text-slate-50 max-h-12"
                          >
                            <FontAwesomeIcon icon={faFile} /> Unduh Dokumen
                          </Link>
                        )}
                    </div>
                  </div>
                );
              })}
            <div className="mt-2 w-full border-b-2 border-lime-600 ">
              <div className="flex flex-row hover:cursor-pointer group/tab">
                <div className="h-8 rounded-t-xl px-2 py-1 text-slate-50 text-sm bg-lime-600 ">
                  PELATIHAN
                </div>
                <div className={"h-8 w-5 bg-lime-600 "}>
                  <div className="bg-white h-8 w-5 rounded-bl-full"></div>
                </div>
                {/* <div className="flex-1">
                <button
                  className="p-1"
                  type="button"
                  onClick={() => {
                    // console.log("click");
                    if (pelatihanI == undefined) {
                      setPelatihanI([pelatihanE]);
                    } else {
                      setPelatihanI((prev) => [
                        ...(prev as pelatihanT[]),
                        pelatihanE,
                      ]);
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} />{" "}
                </button>
              </div> */}
              </div>
            </div>
            {pelatihanI !== undefined &&
              pelatihanI.map((item, index) => {
                // let tes = useMemo(
                //   () => <ThumbnailPdf fileUrl={item.path_file as string} />,
                //   [item.path_file]
                // );
                // console.log("pendidikan T Index", index);
                return (
                  <div className="flex " key={index}>
                    {/* {tes} */}
                    <div
                      className="w-40 h-48 bg-slate-100 border-[1px] border-dotted  rounded-tr-[70px] flex justify-center items-center cursor-pointer"
                      // onClick={() => {
                      //   dokPelatihanRef.current[index].click();
                      // }}
                    >
                      {item.path_file ? (
                        <ThumbnailPdf fileUrl={item.path_file} />
                      ) : item.file_pelatihan !== undefined &&
                        item.file_pelatihan !== null &&
                        typeof item.file_pelatihan == "string" &&
                        item.file_pelatihan !== "" ? (
                        <ThumbnailPdf
                          fileUrl={`/api/document${item.file_pelatihan}`}
                        />
                      ) : (
                        <div className="flex flex-col justify-center items-center h-full w-full">
                          <span className="text-center mb-2">
                            Belum ada Dokumen Pelatihan
                          </span>
                          <FontAwesomeIcon icon={faPaperclip} />
                        </div>
                      )}
                      {/* <input
                      ref={(el) =>
                        (dokPelatihanRef.current[index] =
                          el as HTMLInputElement)
                      }
                      type="file"
                      placeholder="Isi Nomor Ijazah"
                      className="hidden"
                      accept=".pdf"
                      onChange={(e) => {
                        if (
                          e.target.files?.length !== undefined &&
                          e.target.files?.length > 0 &&
                          pelatihanI !== undefined
                        ) {
                          // setFf(e.target.files[0]);
                          pelatihanI[index].path_file = URL.createObjectURL(
                            e.target.files[0]
                          );
                          // console.log(e.target.files[0].name);
                          // pelatihanI[index].nama_file=
                          pelatihanI[index].file_pelatihan = e.target.files[0];
                          pelatihanI[index].nama_file = e.target.files[0].name;
                          setPelatihanI(() => [...pelatihanI]);
                        }

                        console.log(e.target.files);
                      }}
                    /> */}
                    </div>
                    <div
                      className="mt-2 w-full  flex flex-wrap space-x-2"
                      key={index}
                    >
                      <div className="flex flex-col">
                        <span className="text-[11px]">Nama Pelatihan</span>
                        <label className="bg-slate-50 rounded-lg border-[1px] py-1 px-2">
                          {item.jenis}
                        </label>
                        {/* <input
                        type="text"
                        placeholder="Nama Pelatihan"
                        className="bg-slate-50 rounded-lg border-[1px] py-1 px-2"
                        value={item.jenis}
                        onChange={(e) => {
                          pelatihanI[index].jenis = e.target.value;
                          setPelatihanI(() => [...pelatihanI]);
                        }}
                        onKeyDown={handleEnter}
                      /> */}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px]">Penyelenggara</span>
                        <label className="bg-slate-50 rounded-lg border-[1px] py-1 px-2">
                          {item.penyelenggara}
                        </label>
                        {/* <input
                        type="text"
                        placeholder="Isi Penyelenggara"
                        className="bg-slate-50 rounded-lg border-[1px] py-1 px-2"
                        value={item.penyelenggara}
                        onChange={(e) => {
                          pelatihanI[index].penyelenggara = e.target.value;
                          setPelatihanI(() => [...pelatihanI]);
                        }}
                        onKeyDown={handleEnter}
                      /> */}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px]">Tahun</span>
                        <label className="bg-slate-50 rounded-lg border-[1px] py-1 px-2">
                          {item.tahun}
                        </label>
                        {/* <input
                        type="number"
                        placeholder="Isi Tahun Pelatihan"
                        className="bg-slate-50 rounded-lg border-[1px] py-1 px-2"
                        value={item.tahun}
                        onChange={(e) => {
                          pelatihanI[index].tahun = e.target.value;
                          setPelatihanI(() => [...pelatihanI]);
                        }}
                        onKeyDown={handleEnter}
                      /> */}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px]">Lokasi</span>
                        <label className="bg-slate-50 rounded-lg border-[1px] py-1 px-2">
                          {item.lokasi}
                        </label>
                        {/* <input
                        type="text"
                        placeholder="Isi Penyelenggara"
                        className="bg-slate-50 rounded-lg border-[1px] py-1 px-2"
                        value={item.lokasi}
                        onChange={(e) => {
                          pelatihanI[index].lokasi = e.target.value;
                          setPelatihanI(() => [...pelatihanI]);
                        }}
                        onKeyDown={handleEnter}
                      /> */}
                      </div>
                      {/* <div className="flex flex-col">
                    <span className="text-[11px]">
                      Alamat Tempat Pendidikan
                    </span>
                    <input
                      type="text"
                      placeholder="Isi Tempat Pendidikan"
                      className="bg-slate-50 rounded-lg border-[1px] py-1 px-2"
                      value={item.alamat}
                      onChange={(e) => {
                        pendidikanI[index].alamat = e.target.value;
                        setPendidikanI(() => [...pendidikanI]);
                      }}
                      onKeyDown={handleEnter}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px]">Fakultas</span>
                    <input
                      type="text"
                      placeholder="Isi Fakultas"
                      className="bg-slate-50 rounded-lg border-[1px] py-1 px-2"
                      value={item.fakultas}
                      onChange={(e) => {
                        pendidikanI[index].fakultas = e.target.value;
                        setPendidikanI(() => [...pendidikanI]);
                      }}
                      onKeyDown={handleEnter}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px]">Jurusan</span>
                    <input
                      type="text"
                      placeholder="Isi Jurusan"
                      className="bg-slate-50 rounded-lg border-[1px] py-1 px-2"
                      value={item.jurusan}
                      onChange={(e) => {
                        pendidikanI[index].jurusan = e.target.value;
                        setPendidikanI(() => [...pendidikanI]);
                      }}
                      onKeyDown={handleEnter}
                    />
                  </div> */}
                      {/* <AlertDialog>
                      <AlertDialogTrigger className="bg-red-600 mt-3 p-2  rounded-lg text-slate-50 max-h-12">
                        Hapus <FontAwesomeIcon icon={faTrash} />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogTitle>Apakah Anda Yakin ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Akan menghapus Data & FIle{" "}
                          <span className="text-orange-500">{item.jenis}</span>
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              console.log(pelatihanI[index]);
                              const item = pelatihanI[index];
                              if (item.id !== undefined && item.id > 0) {
                                const delUri = `/api/pengguna/delete/pelatihan/${item.id}`;
                                console.log("delUri->", delUri);
                                fetch(delUri, {
                                  method: "GET",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                })
                                  .then((res) => res.json())
                                  .then((res) => {
                                    console.log("res del->", res);
                                    if (res.message == "Ok" && res.pelatihan) {
                                      setPelatihanI(res.pelatihan);
                                    }
                                  })
                                  .catch((err) =>
                                    console.log("err del->", err)
                                  );
                              } else {
                                if (pelatihanI !== undefined) {
                                  let pelatihan = pelatihanI.filter(
                                    (_, i) => i !== index
                                  );
                                  setPelatihanI(pelatihan);
                                }
                              }
                              // console.log("click");
                            }}
                          >
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog> */}

                      {item.file_pelatihan !== undefined &&
                        item.file_pelatihan !== null &&
                        typeof item.file_pelatihan == "string" &&
                        item.file_pelatihan !== "" && (
                          <Link
                            href={`/api/docview${item.file_pelatihan}`}
                            className="bg-lime-600 mt-3 p-2  rounded-lg text-slate-50 max-h-12"
                          >
                            <FontAwesomeIcon icon={faFile} /> Unduh Dokumen
                          </Link>
                        )}
                    </div>
                  </div>
                );
              })}
          </section>
          {/* akhir bagian keluarga  */}
          {/*bagian SK & karir*/}
          <section className={tab !== "sk" ? "hidden" : ""}>
            <div className="mt-2 w-full border-b-2 border-lime-600 ">
              <div className="flex flex-row hover:cursor-pointer group/tab">
                <div className="h-8 rounded-t-xl px-2 py-1 text-slate-50 text-sm bg-lime-600 ">
                  SK
                </div>
                <div className={"h-8 w-5 bg-lime-600 "}>
                  <div className="bg-white h-8 w-5 rounded-bl-full"></div>
                </div>
                {/* <div className="flex-1">
                <button
                  className="p-1"
                  type="button"
                  onClick={() => {
                    if (skI == undefined) {
                      // console.log("a");

                      setSkI([skE]);
                    } else {
                      // console.log("b");
                      setSkI((prev) => [...(prev as skT[]), skE]);
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} />{" "}
                </button>
              </div> */}
              </div>
            </div>
            {skI !== undefined &&
              skI.map((item, index) => {
                return (
                  <div
                    className="mt-2 w-full  flex flex-wrap space-x-2"
                    key={index}
                  >
                    <div
                      className="w-40 h-48 bg-slate-100 border-[1px] border-dotted  rounded-tr-[70px] flex justify-center items-center cursor-pointer"
                      // onClick={() => {
                      //   dokSkRef.current[index].click();
                      // }}
                    >
                      {item.path_file ? (
                        <ThumbnailPdf fileUrl={item.path_file} />
                      ) : item.file_sk !== undefined &&
                        item.file_sk !== null &&
                        typeof item.file_sk == "string" &&
                        item.file_sk !== "" ? (
                        <ThumbnailPdf
                          fileUrl={`/api/document${item.file_sk}`}
                        />
                      ) : (
                        <div className="flex flex-col justify-center items-center h-full w-full">
                          <span className="text-center mb-2">
                            Belum ada Dokumen SK
                          </span>
                          <FontAwesomeIcon icon={faPaperclip} />
                        </div>
                      )}
                      {/* <input
                      ref={(el) =>
                        (dokSkRef.current[index] = el as HTMLInputElement)
                      }
                      type="file"
                      placeholder="Isi Nomor Ijazah"
                      className="hidden"
                      accept=".pdf"
                      onChange={(e) => {
                        if (
                          e.target.files?.length !== undefined &&
                          e.target.files?.length > 0 &&
                          skI !== undefined
                        ) {
                          // setFf(e.target.files[0]);
                          skI[index].path_file = URL.createObjectURL(
                            e.target.files[0]
                          );
                          // console.log(e.target.files[0].name);
                          // skI[index].nama_file=
                          skI[index].file_sk = e.target.files[0];
                          skI[index].nama_file = e.target.files[0].name;
                          setSkI(() => [...skI]);
                        }

                        console.log(e.target.files);
                      }}
                    /> */}
                    </div>
                    <div className="mt-2 flex-1  flex flex-wrap space-x-2">
                      <div className="flex flex-col">
                        <span className="text-[11px]">Nomor SK</span>
                        <label className="bg-slate-50 rounded-lg border-[1px] py-1 px-2">
                          {item.nomor_sk}
                        </label>
                        {/* <input
                        type="text"
                        placeholder="Isi Nomor SK"
                        className="bg-slate-50 rounded-lg border-[1px] py-1 px-2"
                        value={item.nomor_sk}
                        onChange={(e) => {
                          skI[index].nomor_sk = e.target.value;
                          setSkI(() => [...skI]);
                        }}
                        onKeyDown={handleEnter}
                      /> */}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px]">TMT</span>
                        <label className="bg-slate-50 rounded-lg border-[1px] py-1 px-2">
                          {item.tmt}
                        </label>
                        {/* <input
                        type="date"
                        placeholder="Isi Tanggal Lahir"
                        className="bg-slate-50 rounded-lg border-[1px] py-1 px-2"
                        value={
                          item.tmt == null
                            ? ""
                            : item.tmt.includes("T") && item.tmt.includes("Z")
                            ? item.tmt.substring(0, 10)
                            : item.tmt
                        }
                        onChange={(e) => {
                          skI[index].tmt = e.target.value;
                          setSkI(() => [...skI]);
                        }}
                        onKeyDown={handleEnter}
                      /> */}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px]">Status Personalia</span>
                        <label className="bg-slate-50 rounded-lg border-[1px] py-1 px-2">
                          {item.success}
                        </label>
                        {/* <select
                        className="p-1 border-[1px] border-lime-600 rounded-lg"
                        onKeyDown={handleEnter}
                        defaultValue={""}
                        value={item.success}
                        onChange={(e) => {
                          skI[index].success = e.target.value;
                          setSkI(() => [...skI]);
                          // setPersonalia((old: any) => {
                          //   return { ...old, jenis_kelamin: e.target.value };
                          // });
                        }}
                      >
                        <option value={""} disabled>
                          Pilih Status Pegawai
                        </option>
                        {helper.status.map((item, key) => {
                          return (
                            <option
                              key={key}
                              // selected={
                              //   personalia.status_pegawai == item.nama_status
                              //     ? true
                              //     : false
                              // }
                            >
                              {item.nama_status}
                            </option>
                          );
                        })}
                      </select> */}
                      </div>
                      {/* <AlertDialog>
                      <AlertDialogTrigger className="bg-red-600 mt-3 p-2  rounded-lg text-slate-50 max-h-12">
                        Hapus <FontAwesomeIcon icon={faTrash} />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogTitle>Apakah Anda Yakin ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Akan menghapus Data & FIle{" "}
                          <span className="text-orange-500">
                            {item.nomor_sk}
                          </span>
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              console.log(skI[index]);
                              const item = skI[index];
                              if (item.id !== undefined && item.id > 0) {
                                const delUri = `/api/pengguna/delete/sk/${item.id}`;
                                console.log("delUri->", delUri);
                                fetch(delUri, {
                                  method: "GET",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                })
                                  .then((res) => res.json())
                                  .then((res) => {
                                    console.log("res del->", res);
                                    if (res.message == "Ok" && res.sk) {
                                      setSkI(res.sk);
                                    }
                                  })
                                  .catch((err) =>
                                    console.log("err del->", err)
                                  );
                              } else {
                                if (skI !== undefined) {
                                  let sk = skI.filter((_, i) => i !== index);
                                  setSkI(sk);
                                }
                              }
                              // console.log("click");
                            }}
                          >
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog> */}

                      {item.file_sk !== undefined &&
                        item.file_sk !== null &&
                        typeof item.file_sk == "string" &&
                        item.file_sk !== "" && (
                          <Link
                            href={`/api/docview${item.file_sk}`}
                            className="bg-lime-600 mt-3 p-2  rounded-lg text-slate-50 max-h-12"
                          >
                            <FontAwesomeIcon icon={faFile} /> Unduh Dokumen
                          </Link>
                        )}
                    </div>
                  </div>
                );
              })}

            <div className="mt-2 w-full border-b-2 border-lime-600 ">
              <div className="flex flex-row hover:cursor-pointer group/tab">
                <div className="h-8 rounded-t-xl px-2 py-1 text-slate-50 text-sm bg-lime-600 ">
                  KARIR
                </div>
                <div className={"h-8 w-5 bg-lime-600 "}>
                  <div className="bg-white h-8 w-5 rounded-bl-full"></div>
                </div>
                {/* <div className="flex-1">
                <button
                  className="p-1"
                  type="button"
                  onClick={() => {
                    if (karirI == undefined) {
                      // console.log("a");

                      setKarirI([karirE]);
                    } else {
                      // console.log("b");
                      setKarirI((prev) => [...(prev as karirT[]), karirE]);
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} />{" "}
                </button>
              </div> */}
              </div>
            </div>
            {karirI !== undefined &&
              karirI.map((item, index) => {
                return (
                  <div
                    className="mt-2 w-full  flex flex-wrap space-x-2"
                    key={index}
                  >
                    <div
                      className="w-40 h-48 bg-slate-100 border-[1px] border-dotted  rounded-tr-[70px] flex justify-center items-center cursor-pointer"
                      // onClick={() => {
                      //   dokKarirRef.current[index].click();
                      // }}
                    >
                      {item.path_file ? (
                        <ThumbnailPdf fileUrl={item.path_file} />
                      ) : item.file_karir !== undefined &&
                        item.file_karir !== null &&
                        typeof item.file_karir == "string" &&
                        item.file_karir !== "" ? (
                        <ThumbnailPdf
                          fileUrl={`/api/document${item.file_karir}`}
                        />
                      ) : (
                        <div className="flex flex-col justify-center items-center h-full w-full">
                          <span className="text-center mb-2">
                            Belum ada Dokumen Karir
                          </span>
                          <FontAwesomeIcon icon={faPaperclip} />
                        </div>
                      )}
                      {/* <input
                      ref={(el) =>
                        (dokKarirRef.current[index] = el as HTMLInputElement)
                      }
                      type="file"
                      placeholder="Isi Nomor Ijazah"
                      className="hidden"
                      accept=".pdf"
                      onChange={(e) => {
                        if (
                          e.target.files?.length !== undefined &&
                          e.target.files?.length > 0 &&
                          karirI !== undefined
                        ) {
                          // setFf(e.target.files[0]);
                          karirI[index].path_file = URL.createObjectURL(
                            e.target.files[0]
                          );
                          // console.log(e.target.files[0].name);
                          // skI[index].nama_file=
                          karirI[index].file_karir = e.target.files[0];
                          karirI[index].nama_file = e.target.files[0].name;
                          setKarirI(() => [...karirI]);
                        }

                        console.log(e.target.files);
                      }}
                    /> */}
                    </div>
                    <div className="mt-2 flex-1  flex flex-wrap space-x-2">
                      <div className="flex flex-col">
                        <span className="text-[11px]">Tahun Karir</span>
                        <label className="bg-slate-50 rounded-lg border-[1px] py-1 px-2">
                          {item.tahun}
                        </label>
                        {/* <input
                        type="number"
                        placeholder="Isi Tahun Karir"
                        className="bg-slate-50 rounded-lg border-[1px] py-1 px-2"
                        value={item.tahun}
                        onChange={(e) => {
                          karirI[index].tahun = e.target.value;
                          setKarirI(() => [...karirI]);
                        }}
                        onKeyDown={handleEnter}
                      /> */}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex flex-col">
                          <span className="text-[11px]">
                            Jabatan :
                            {item.jabatan !== "" && item.unit_kerja !== ""
                              ? `${item.jabatan}-${item.unit_kerja}`
                              : item.jabatan}
                          </span>
                          <label className="bg-slate-50 rounded-lg border-[1px] py-1 px-2">
                            {item.jabatan}
                          </label>
                          {/* <select
                          className="p-1 border-[1px] border-lime-600 rounded-lg"
                          defaultValue={""}
                          value={item.jabatan}
                          onKeyDown={handleEnter}
                          onChange={(e) => {
                            karirI[index].jabatan = e.target.value;
                            setKarirI(() => [...karirI]);
                          }}
                        >
                          <option value={""} disabled>
                            Pilih Jabatan
                          </option>
                          {helper.jabatan.map((item, key) => {
                            return (
                              <option
                                key={key}
                                // selected={
                                //    karirI[index].jabatan == item.jabatan ? true : false
                                // }
                              >
                                {item.jabatan}
                              </option>
                            );
                          })}
                        </select> */}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px]"> </span>
                          <label className="bg-slate-50 rounded-lg border-[1px] py-1 px-2">
                            {item.unit_kerja}
                          </label>
                          {/* <select
                          className="p-1 border-[1px] border-lime-600 rounded-lg"
                          defaultValue={""}
                          value={item.unit_kerja}
                          onKeyDown={handleEnter}
                          onChange={(e) => {
                            karirI[index].unit_kerja = e.target.value;
                            setKarirI(() => [...karirI]);
                          }}
                        >
                          <option value={""}>Pilih Unit Kerja</option>
                          {helper.unitKerja.map((item, key) => {
                            return (
                              <option
                                key={key}
                                // selected={
                                //   personalia.unit_kerja == item.nama_unit ? true : false
                                // }
                              >
                                {item.nama_unit}
                              </option>
                            );
                          })}
                        </select> */}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px]">Bagian / Bidang</span>
                        <label className="bg-slate-50 rounded-lg border-[1px] py-1 px-2">
                          {item.bagian}
                        </label>
                        {/* <select
                        className="p-1 border-[1px] border-lime-600 rounded-lg"
                        defaultValue={""}
                        value={item.bagian}
                        onKeyDown={handleEnter}
                        onChange={(e) => {
                          karirI[index].bagian = e.target.value;
                          setKarirI(() => [...karirI]);
                        }}
                      >
                        <option value={""} disabled>
                          Pilih Bagian/ Bidang
                        </option>
                        {helper.bagian.map((item, key) => {
                          return (
                            <option
                              key={key}
                              // selected={
                              //   personalia.bagian == item.nama_bagian ? true : false
                              // }
                            >
                              {item.nama_bagian}
                            </option>
                          );
                        })}
                      </select> */}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px]">Status Pegawai</span>
                        <label className="p-1 border-[1px] border-lime-600 rounded-lg">
                          {item.status_pegawai}
                        </label>
                        {/* <select
                        className="p-1 border-[1px] border-lime-600 rounded-lg"
                        onKeyDown={handleEnter}
                        defaultValue={""}
                        value={item.status_pegawai}
                        onChange={(e) => {
                          karirI[index].status_pegawai = e.target.value;
                          setKarirI(() => [...karirI]);
                          // setPersonalia((old: any) => {
                          //   return { ...old, jenis_kelamin: e.target.value };
                          // });
                        }}
                      >
                        <option value={""} disabled>
                          Pilih Status Pegawai
                        </option>
                        {helper.status.map((item, key) => {
                          return (
                            <option
                              key={key}
                              // selected={
                              //   personalia.status_pegawai == item.nama_status
                              //     ? true
                              //     : false
                              // }
                            >
                              {item.nama_status}
                            </option>
                          );
                        })}
                      </select> */}
                      </div>
                      {/* <AlertDialog>
                      <AlertDialogTrigger className="bg-red-600 mt-3 p-2  rounded-lg text-slate-50 max-h-12">
                        Hapus <FontAwesomeIcon icon={faTrash} />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogTitle>Apakah Anda Yakin ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Akan menghapus Data & FIle{" "}
                          <span className="text-orange-500">
                            {item.jabatan} {item.bagian} {item.status_pegawai}
                          </span>
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              const item = karirI[index];
                              if (item.id !== undefined && item.id > 0) {
                                const delUri = `/api/pengguna/delete/karir/${item.id}`;
                                console.log("delUri->", delUri);
                                fetch(delUri, {
                                  method: "GET",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                })
                                  .then((res) => res.json())
                                  .then((res) => {
                                    console.log("res del->", res);
                                    if (res.message == "Ok" && res.karir) {
                                      setKarirI(res.karir);
                                    }
                                  })
                                  .catch((err) =>
                                    console.log("err del->", err)
                                  );
                              } else {
                                if (karirI !== undefined) {
                                  let karir = karirI.filter(
                                    (_, i) => i !== index
                                  );
                                  setKarirI(karir);
                                }
                              }
                              // console.log("click");
                            }}
                          >
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog> */}

                      {item.file_karir !== undefined &&
                        item.file_karir !== null &&
                        typeof item.file_karir == "string" &&
                        item.file_karir !== "" && (
                          <Link
                            href={`/api/docview${item.file_karir}`}
                            className="bg-lime-600 mt-3 p-2  rounded-lg text-slate-50 max-h-12"
                          >
                            <FontAwesomeIcon icon={faFile} /> Unduh Dokumen
                          </Link>
                        )}
                    </div>
                  </div>
                );
              })}
          </section>
          {/*akhirbagian SK & karir*/}
        </form>

        <div className="py-2 flex justify-center space-x-5 mt-4">
          {/* <button
            className="bg-gradient-to-br from-sky-400 to-yellow-400 min-w-[90px] py-2 px-3 rounded-lg text-sm font-semibold text-slate-50 shadow-lg"
            onClick={() => {
              // setFile(undefined);
              setKeluargaI(undefined);
              setPendidikanI(undefined);
              setPelatihanI(undefined);
              setSkI(undefined);
              setKarirI(undefined);
              setPersonalia(undefined);
              // setUsers(emptyUsers);
              // callback(false);
              // setLoadingSimpan(false);
            }}
          >
            Kembali <FontAwesomeIcon icon={faRotateLeft} />
          </button> */}
          {/* <button
          className="bg-gradient-to-br from-sky-400 to-yellow-400 min-w-[90px] py-2 px-3 rounded-lg text-sm font-semibold text-slate-50 shadow-lg"
          onClick={async () => {
            setErrorPersonalia((p) => {
              return {
                ...p,
                nama: "",
                password: "",
                telpon: "",
                username: "",
                email: "",
              };
            });
            setLoadingSimpan(true);
            if (pengguna !== undefined) {
              if (
                keluargaI !== undefined ||
                pendidikanI !== undefined ||
                pelatihanI !== undefined
              ) {
                // alert("here");
                // return;
                const formData = new FormData();
                formData.append("personalia", JSON.stringify(personalia));
                formData.append("pengguna", JSON.stringify(users));
                if (keluargaI == undefined) {
                  formData.append("keluarga", "");
                } else formData.append("keluarga", JSON.stringify(keluargaI));
                if (pendidikanI == undefined) {
                  formData.append("pendidikan", "");
                } else {
                  if (pendidikanI.find((e) => e.nama == "")) {
                    alert(
                      "Nama Sekolah/ Kampus/ Tempat Pendidikan Harus diisi ?"
                    );
                    setLoadingSimpan(false);
                    return;
                  }
                  pendidikanI.forEach((item) => {
                    if (
                      item.file_pendidikan !== undefined &&
                      typeof item.file_pendidikan == "object" &&
                      item.file_pendidikan !== null
                    ) {
                      formData.append(
                        "pendidikanFiles",
                        item.file_pendidikan as File
                      );
                    }
                  });

                  formData.append("pendidikan", JSON.stringify(pendidikanI));
                }

                if (pelatihanI == undefined) {
                  formData.append("pelatihan", "");
                } else {
                  // console.log(
                  //   "filePelatihan->",
                  //   pelatihanI.find((e) => e.jenis == "")
                  // );
                  if (pelatihanI.find((e) => e.jenis == "")) {
                    alert("Nama Pelatihan Harus diisi ?");
                    setLoadingSimpan(false);
                    return;
                  }
                  // console.log("xxxxxxxxx");
                  // const filesPelatihan = pelatihanI.map(
                  //   (item, index) => item.file_pelatihan
                  // );
                  pelatihanI.map((item, index) => {
                    if (
                      item.file_pelatihan !== undefined &&
                      typeof item.file_pelatihan == "object" &&
                      item.file_pelatihan !== null
                    ) {
                      formData.append(
                        "pelatihanFiles",
                        item.file_pelatihan as File
                      );
                    }
                  });

                  formData.append("pelatihan", JSON.stringify(pelatihanI));
                }
                if (skI == undefined) {
                  formData.append("sk", "");
                } else {
                  if (skI.find((e) => e.nomor_sk == "")) {
                    alert("Nomor SK Harus diisi ?");
                    setLoadingSimpan(false);
                    return;
                  }

                  skI.forEach((item) => {
                    if (
                      item.file_sk !== undefined &&
                      typeof item.file_sk == "object" &&
                      item.file_sk !== null
                    ) {
                      formData.append("skFiles", item.file_sk as File);
                    }
                  });
                  formData.append("sk", JSON.stringify(skI));
                }
                if (karirI == undefined) {
                  formData.append("karir", "");
                } else {
                  if (
                    karirI.find(
                      (e) =>
                        e.status_pegawai == "" ||
                        e.jabatan == "" ||
                        e.bagian == ""
                    )
                  ) {
                    alert(
                      "Status Pegawai, Bagian dan Jabatan Harus di Pilih ?"
                    );
                    setLoadingSimpan(false);
                    return;
                  }

                  karirI.forEach((item) => {
                    if (
                      item.file_karir !== undefined &&
                      typeof item.file_karir == "object" &&
                      item.file_karir !== null
                    ) {
                      formData.append("karirFiles", item.file_karir as File);
                    }
                  });
                  // console.log("log karirI ->", formData.getAll("karirFiles"));
                  formData.append("karir", JSON.stringify(karirI));
                }

                const config: AxiosRequestConfig = {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                  onUploadProgress: (event: any) => {
                    const progress = Math.round(
                      (event.loaded * 100) / event.total
                    );
                    // setPercent(Math.floor(progress / 10) * 10);
                    console.log(
                      `Current progress:`,
                      progress,
                      Math.floor(progress / 10) * 10
                    );
                    // setPercent(((event.loaded * 100) % 10) * 10);
                  },
                };
                try {
                  const response = await axios.post(
                    "/api/pengguna/update/all",
                    formData,
                    config
                  );
                  if (response.data.message == "Ok") {
                    toast({
                      duration: 2000,
                      className: "bg-green-500 text-slate-50",
                      title: "Penyimpanan ",
                      description: "Pesan Berhasil di Perbaharui",
                    });
                  }
                  setErrorPersonalia(emptyPersonaliaError);
                  if (response.data.message == "Error" && response.data.error) {
                    setTab("diri");
                    if (response.data.error.nama)
                      setErrorPersonalia((p) => {
                        return { ...p, nama: response.data.error.nama };
                      });
                    if (response.data.error.email)
                      setErrorPersonalia((p) => {
                        return { ...p, email: response.data.error.email };
                      });
                    if (response.data.error.telpon)
                      setErrorPersonalia((p) => {
                        return { ...p, telpon: response.data.error.telpon };
                      });
                    if (response.data.error.username)
                      setErrorPersonalia((p) => {
                        return {
                          ...p,
                          username: response.data.error.username,
                        };
                      });
                    if (response.data.error.password)
                      setErrorPersonalia((p) => {
                        return {
                          ...p,
                          password: response.data.error.password,
                        };
                      });
                    if (response.data.error.bagian)
                      setErrorPersonalia((p) => {
                        return { ...p, bagian: response.data.error.bagian };
                      });
                    if (response.data.error.jabatan)
                      setErrorPersonalia((p) => {
                        return { ...p, jabatan: response.data.error.jabatan };
                      });
                    if (response.data.error.unit_kerja)
                      setErrorPersonalia((p) => {
                        return {
                          ...p,
                          unit_kerja: response.data.error.unit_kerja,
                        };
                      });
                  }
                  if (response.data.pelatihan) {
                    setPelatihanI(response.data.pelatihan);
                  }
                  console.log("response from updateAll->", response);
                  setLoadingSimpan(false);
                } catch (error) {
                  setLoadingSimpan(false);
                }
              } else {
                fetch("/api/pengguna/update", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ personalia, users }),
                })
                  .then((res) => res.json())
                  .then((res) => {
                    console.log("ubah->", res);
                    if (res.message == "Data Tersimpan") {
                      toast({
                        duration: 2000,
                        className: "bg-green-500 text-slate-50",
                        title: "Penyimpanan ",
                        description: "Pesan Berhasil di Perbaharui",
                      });
                      //  router.replace("/pengguna");
                      callback(true);
                    }
                    if (res.error) {
                      setTab("diri");
                      if (res.error.nama)
                        setErrorPersonalia((p) => {
                          return { ...p, nama: res.error.nama };
                        });
                      if (res.error.email)
                        setErrorPersonalia((p) => {
                          return { ...p, email: res.error.email };
                        });
                      if (res.error.telpon)
                        setErrorPersonalia((p) => {
                          return { ...p, telpon: res.error.telpon };
                        });
                      if (res.error.username)
                        setErrorPersonalia((p) => {
                          return { ...p, username: res.error.username };
                        });
                      if (res.error.password)
                        setErrorPersonalia((p) => {
                          return { ...p, password: res.error.password };
                        });
                      if (res.error.password)
                        setErrorPersonalia((p) => {
                          return { ...p, password: res.error.password };
                        });
                    }
                  })
                  .catch((err) => console.log("ubah error->", err))
                  .finally(() => setLoadingSimpan(false));
              }
            } else {
              // alert("text");
              const formData = new FormData();
              formData.append("personalia", JSON.stringify(personalia));
              formData.append("pengguna", JSON.stringify(users));
              if (keluargaI == undefined) {
                formData.append("keluarga", "");
              } else {
                if (keluargaI.find((e) => e.nama == "")) {
                  alert("Nama Keluarga Harus diisi ?");
                  setLoadingSimpan(false);
                  return;
                }
                formData.append("keluarga", JSON.stringify(keluargaI));
              }
              if (pendidikanI == undefined) {
                formData.append("pendidikan", "");
              } else {
                if (pendidikanI.find((e) => e.nama == "")) {
                  alert(
                    "Nama Sekolah/ Kampus/ Tempat Pendidikan Harus diisi ?"
                  );
                  setLoadingSimpan(false);
                  return;
                }
                pendidikanI.forEach((item) => {
                  if (
                    item.file_pendidikan !== undefined &&
                    typeof item.file_pendidikan == "object"
                  ) {
                    formData.append(
                      "pendidikanFiles",
                      item.file_pendidikan as File
                    );
                  }
                });
                formData.append("pendidikan", JSON.stringify(pendidikanI));
              }
              if (pelatihanI == undefined) {
                formData.append("pelatihan", "");
              } else {
                // console.log(
                //   "filePelatihan->",
                //   pelatihanI.find((e) => e.jenis == "")
                // );
                if (pelatihanI.find((e) => e.jenis == "")) {
                  alert("Nama Pelatihan Harus diisi ?");
                  setLoadingSimpan(false);
                  return;
                }
                // console.log("xxxxxxxxx");
                // const filesPelatihan = pelatihanI.map(
                //   (item, index) => item.file_pelatihan
                // );
                pelatihanI.forEach((item) => {
                  if (
                    item.file_pelatihan !== undefined &&
                    typeof item.file_pelatihan == "object"
                  ) {
                    formData.append(
                      "pelatihanFiles",
                      item.file_pelatihan as File
                    );
                  }
                });

                formData.append("pelatihan", JSON.stringify(pelatihanI));
              }
              if (skI == undefined) {
                formData.append("sk", "");
              } else {
                if (skI.find((e) => e.nomor_sk == "")) {
                  alert("Nomor SK Harus diisi ?");
                  setLoadingSimpan(false);
                  return;
                }

                skI.forEach((item) => {
                  if (
                    item.file_sk !== undefined &&
                    typeof item.file_sk == "object"
                  ) {
                    formData.append("skFiles", item.file_sk as File);
                  }
                });
                formData.append("sk", JSON.stringify(skI));
              }
              if (karirI == undefined) {
                formData.append("karir", "");
              } else {
                if (
                  karirI.find(
                    (e) =>
                      e.status_pegawai == "" ||
                      e.jabatan == "" ||
                      e.bagian == ""
                  )
                ) {
                  alert("Status Pegawai, Bagian dan Jabatan Harus di Pilih ?");
                  setLoadingSimpan(false);
                  return;
                }

                karirI.forEach((item) => {
                  if (
                    item.file_karir !== undefined &&
                    typeof item.file_karir == "object"
                  ) {
                    formData.append("karirFiles", item.file_karir as File);
                  }
                });
                // console.log("log karirI ->", formData.getAll("karirFiles"));
                formData.append("karir", JSON.stringify(karirI));
              }
              const config: AxiosRequestConfig = {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (event: any) => {
                  // const progress = Math.round(
                  //   (event.loaded * 100) / event.total
                  // );
                  // setPercent(Math.floor(progress / 10) * 10);
                  console.log(
                    `Current progress:`,
                    progress,
                    Math.floor(progress / 10) * 10
                  );
                  // setPercent(((event.loaded * 100) % 10) * 10);
                },
              };
              try {
                const response = await axios.post(
                  "/api/pengguna/tambah/all",
                  formData,
                  config
                );
                // console.log(
                //   response.data.message ==
                //     "Error" , " && " , response.data.error
                // );
                setErrorPersonalia(emptyPersonaliaError);
                if (response.data.message == "Error" && response.data.error) {
                  setTab("diri");
                  if (response.data.error.nama)
                    setErrorPersonalia((p) => {
                      return { ...p, nama: response.data.error.nama };
                    });
                  if (response.data.error.email)
                    setErrorPersonalia((p) => {
                      return { ...p, email: response.data.error.email };
                    });
                  if (response.data.error.telpon)
                    setErrorPersonalia((p) => {
                      return { ...p, telpon: response.data.error.telpon };
                    });
                  if (response.data.error.username)
                    setErrorPersonalia((p) => {
                      return { ...p, username: response.data.error.username };
                    });
                  if (response.data.error.password)
                    setErrorPersonalia((p) => {
                      return { ...p, password: response.data.error.password };
                    });
                  if (response.data.error.bagian)
                    setErrorPersonalia((p) => {
                      return { ...p, bagian: response.data.error.bagian };
                    });
                  if (response.data.error.jabatan)
                    setErrorPersonalia((p) => {
                      return { ...p, jabatan: response.data.error.jabatan };
                    });
                  if (response.data.error.unit_kerja)
                    setErrorPersonalia((p) => {
                      return {
                        ...p,
                        unit_kerja: response.data.error.unit_kerja,
                      };
                    });
                }
                console.log("res-tambah-all->", response);

                if (response.data.message == "Data Tersimpan") {
                  toast({
                    duration: 2000,
                    className: "bg-green-500 text-slate-50",
                    title: "Penyimpanan ",
                    description: "Pesan Berhasil di Perbaharui",
                  });
                  router.replace("/pengguna");
                }
              } catch (error) {
                console.log("res-err-all->", error);
              }

              setLoadingSimpan(false);
            }
          }}
        >
          {!loadingSimpan ? (
            <div>
              {pengguna == undefined ? "Simpan" : "Ubah"}{" "}
              <FontAwesomeIcon icon={faSave} />
            </div>
          ) : (
            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
          )}
        </button> */}
          {/* {pengguna == undefined ? (
          <button className="bg-gradient-to-br from-sky-400 to-yellow-400 min-w-[90px] py-2 px-3 rounded-lg text-sm font-semibold text-slate-50 shadow-lg">
            Reset <FontAwesomeIcon icon={faRotateLeft} />
          </button>
        ) : (
          <button
            className="bg-gradient-to-br from-sky-400 to-yellow-400 min-w-[90px] py-2 px-3 rounded-lg text-sm font-semibold text-slate-50 shadow-lg"
            onClick={() => {
              // setFile(undefined);
              setKeluargaI(undefined);
              setPendidikanI(undefined);
              setPelatihanI(undefined);
              setSkI(undefined);
              setKarirI(undefined);
              setPersonalia(undefined);
              // setUsers(emptyUsers);
              // callback(false);
              // setLoadingSimpan(false);
            }}
          >
            Kembali <FontAwesomeIcon icon={faRotateLeft} />
          </button>
        )} */}
        </div>
      </>
    );
  }
}
