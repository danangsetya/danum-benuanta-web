"use client";

import { filesT, fileT } from "@/lib/types";
import { faCamera, faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getSession } from "next-auth/react";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
export default function BankDataForm() {
  const [data, setData] = useState<filesT>();
  const fileRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<fileT>();
  useEffect(() => {
    console.log("data->", data);
  }, [data]);
  async function getSess() {
    const token = await getSession();
    // if (token == null) router.replace("/login");
    console.log("session", token);
    if (token?.user) {
      const all = JSON.parse(token?.user.email as string);
      const data = console.log("session->", all);
      // if (perm.permissions) {
      //   setPermissions(perm.permissions);
      // }
      // if (perm.profil) {
      //   setProfil(perm.profil);
      // }
      // setPermissions(perm);
      // console.log("perm->", perm.length);
    }
  }
  useLayoutEffect(() => {
    getSess();
  }, []);
  return (
    <>
      <h1 className="font-bold text-xl text-center">
        Tirta Alam Bank Data / dokumEn (
        <span className="text-lime-600 font-extrabold">TABE </span>) - FILE BARU
      </h1>
      <input
        type="file"
        className="hidden"
        accept="image/jpeg,image/png,application/pdf"
        ref={fileRef}
        onChange={(e) => {
          // if ("geolocation" in navigator) {
          //   navigator.geolocation.getCurrentPosition(({ coords }) => {
          //     setData({
          //       ...data,
          //       lat: coords.latitude,
          //       lon: coords.longitude,
          //     });
          //   });
          // }
          // console.log(e.target.files);
          if (e.target.files !== undefined) {
            if (e.target.files?.length) {
              // console.log(URL.createObjectURL(e.target?.files[0]));
              let tmp: fileT = e.target?.files[0];
              tmp.blobString = URL.createObjectURL(e.target?.files[0]);
              setFile(tmp);
              // setFileSr(URL.createObjectURL(e.target?.files[0]));
            }
          }
        }}
      />
      <div className="flex flex-row">
        <div
          className="h-52  bg-slate-5 border-x-2 border-yellow-400 rounded-b-xl flex flex-col justify-center items-center overflow-hidden relative w-full md:w-40"
          onClick={() => fileRef.current?.click()}
        >
          {file ? (
            <>
              <Image
                src={file.blobString as string}
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
                icon={faFile}
                fontSize={75}
                className="text-slate-200"
              />
              <span className="text-center text-[10px] text-slate-400">
                Klik disini untuk ganti Foto/ File/ Dokumen
              </span>
            </>
          )}
        </div>
        <div className="flex-1  flex flex-col p-3">
          <label className="-mb-1 text-sm text-lime-600">
            Titel
            {/* <span className="text-red-600 italic">{error.nosamw}</span> */}
          </label>
          <input
            type="text"
            ref={titleRef}
            className="p-1 border-[1px] border-lime-600 rounded-l-lg"
            placeholder="di isi No Sambung"
            // onKeyDown={handleCariNosamw}
            value={data?.title}
            onChange={(e) => {
              setData((old: any) => {
                return { ...old, title: e.target.value };
              });
            }}
          />
        </div>
      </div>
    </>
  );
}
