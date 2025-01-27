"use client";

import { faRotateRight, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePathname, useRouter } from "next/navigation";

import Script from "next/script";
import { useEffect, useLayoutEffect, useState } from "react";
type faceioT = {
  enroll: any;
  authenticate: any;
  restartSession: () => void;
};
declare class faceIO {
  constructor(key: any);
}
export default function FaceAddx({
  params,
  init,
}: {
  params: { n: number; d: string };
  init: number;
}) {
  const [load, setLoad] = useState<true | false | "err">(false);
  const [allow, setAllow] = useState<true | false | "putus">(false);
  const [faceio, setFaceIO] = useState<faceioT>();
  function serverKey(i: number) {
    const FS_1 = "fioa715c";
    const FS_2 = "fioac87e";
    const FS_3 = "fioa2776";
    const FS_4 = "fioac62c";
    const FS_5 = "fioa3f28";
    const FS_6 = "fioaf172";
    switch (i * 1) {
      case 1:
        return FS_1;
        break;
      case 2:
        return FS_2;
        break;
      case 3:
        return FS_3;
        break;
      case 4:
        return FS_4;
        break;
      case 5:
        return FS_5;
        break;
      case 6:
        return FS_6;
        break;
      default:
        break;
    }
  }
  useEffect(() => {
    if (load == true) {
    }
    console.log("load->", load);
  }, [load]);
  useLayoutEffect(() => {
    setTimeout(() => {
      if (load !== true) {
        setLoad("err");
      }
    }, 10000);
    // console.log("first");
  }, []);
  useEffect(() => {
    console.log("init->", init);
  }, [init]);
  const router = useRouter();
  const pathname = usePathname();
  return (
    <>
      <Script
        src="https://cdn.faceio.net/fio.js"
        strategy="lazyOnload"
        onLoad={(e) => {
          // console.log("onload", e);
          // if (e !== undefined) {
          //   setLoad(true);
          // }
        }}
        onReady={() => {
          console.log("ready");
          try {
            const faceTmp = new faceIO(serverKey(params.n));
            console.log(faceTmp);
            setLoad(true);
          } catch (error) {
            setLoad("err");
            console.log("not ready", error);
          }
          // setLoad(true);
        }}
        onError={(err) => {
          console.log("err", err);
          setLoad("err");
        }}
      />

      {load == true && "true"}
      {load == false && (
        <div className="w-full flex flex-col  h-[100vh] justify-center items-center">
          <FontAwesomeIcon
            icon={faSpinner}
            className="h-16 w-16 animate-spin text-sky-500"
          />
          {/* <h1 className="text-center mt-5 text-sky-500 font-bold text-xl">
          Autentikasi Tidak Valid
        </h1> */}
        </div>
      )}
      {load == "err" && (
        <div className="w-full flex flex-col  h-[100vh] justify-center items-center">
          <h1 className="font-bold">Gagal Terhubung ke Server</h1>

          <div
            onClick={() => {
              console.log("klik", pathname);
              // router.refresh();

              router.replace("/face/reload/" + params.n + "/" + params.d);
            }}
            className="p-3 bg-sky-500 rounded-2xl flex flex-row gap-2 items-center mt-5 hover:bg-sky-400 hover:cursor-pointer"
          >
            <FontAwesomeIcon
              icon={faRotateRight}
              className="text-slate-50 h-5"
            />
            <span className="text-slate-50 font-bold">Muat Ulang</span>
          </div>
        </div>
      )}
    </>
  );
}
