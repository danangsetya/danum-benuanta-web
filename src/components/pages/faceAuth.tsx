"use client";
import { prisma } from "@/lib/prisma";
import faceIO from "@faceio/fiojs";
import { faL } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useLayoutEffect, useState } from "react";
type faceioT = {
  enroll: any;
  authenticate: any;
  restartSession: () => void;
};
// const faceioInstance = new faceIO("fioa715c");

export default function FaceAuth({
  params,
}: {
  params: { n: number; d: string };
}) {
  const [allow, setAllow] = useState<true | false | "putus">(false);
  const [faceio, setFaceIO] = useState<faceioT>();
  function serverKey(i: number) {
    switch (i) {
      case 1:
        return process.env.FS_1;
        break;
      case 2:
        return process.env.FS_2;
        break;
      case 3:
        return process.env.FS_3;
        break;
      case 4:
        return process.env.FS_4;
        break;
      case 5:
        return process.env.FS_5;
        break;
      case 6:
        return process.env.FS_6;
        break;
      default:
        break;
    }
  }
  // useLayoutEffect(() => {
  //   console.log("fs key->", fsKey);
  // }, [fsKey]);
  useLayoutEffect(() => {
    if (faceio == undefined) {
      if (params.n > 0) {
        // console.log("n key->", fsKey[params.n - 1]);
        setFaceIO(new faceIO(params.n));
      }
      // console.log("server key->", serverKey(params.n));
    }
  }, [params.n]);
  // async function authenticateUser() {
  //   faceioInstance.restartSession();
  //   faceioInstance
  //     .authenticate({
  //       locale: "auto", // Default user locale
  //     })
  //     .then((userData: any) => {
  //       console.log("Success, user identified");
  //       console.log("Linked facial Id: " + userData.facialId);
  //       console.log("Payload: " + JSON.stringify(userData.payload));
  //     })
  //     .catch((errCode: any) => {
  //       console.info(errCode);
  //     });
  // }
  async function callbe() {
    const s = params.d;
    const t = s.replaceAll("%3D", "=");
    try {
      const u = atob(t);
      type oT = {
        user: number;
        name: string;
      };
      const o: oT = JSON.parse(u);
      // const o: oT = {
      //   user: 1,
      //   name: "danang",
      // };
      fetch("/api/pengguna/cari/id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: o.user, name: o.name }),
      })
        .then((res) => res.json())
        .then((res: any) => {
          if (res.personalia !== null) {
            console.log("res->", res);
            setAllow(true);
            if (res.activate_hash == null) {
              // throw new Error("xxx");
              // return;
              if (faceio !== undefined) {
                faceio
                  .authenticate({
                    locale: "auto", // Default user locale
                    payload: {
                      user: o.user,
                      name: o.name,
                    },
                  })
                  .then((userInfo: any) => {
                    console.log("show");

                    //     // User Successfully Enrolled!
                    //     alert(
                    //       `User Successfully Enrolled! Details:
                    //     Unique Facial ID: ${userInfo.facialId}
                    //     Enrollment Date: ${userInfo.timestamp}
                    //     Gender: ${userInfo.details.gender}
                    //     Age Approximation: ${userInfo.details.age}`
                    //     );
                    //     console.log(userInfo);
                    //     // handle success, save the facial ID, redirect to dashboard...
                  })
                  .catch((errCode: any) => {
                    console.info("err face->", errCode);
                    setAllow("putus");
                    console.log("back");
                    //     // handle enrollment failure. Visit:
                    //     // https://faceio.net/integration-guide#error-codes
                    //     // for the list of all possible error codes
                  });
              }

              // const all = setInterval(() => {
              //   const element = document.querySelector(".fio-modal-content");
              //   if (element !== null) {
              //     console.log(element);
              //   }
              //   console.log("x");
              // }, 1000);
              // waitForElm(".fio-ui-modal__header")
              //   .then((elm) => {
              //     console.log("Element Ready");
              //     // console.log(elm)
              //   })
              //   .catch((err) => console.log("err elm->", err));
              // const x = document.getElementsByClassName(
              //   "fio-ui-modal__header"
              // );
              // console.log(x.length);
            }
          }
        })
        .catch((err: any) => {
          // console.log("err->", err);
          setAllow("putus");
          console.log("back");
        });
    } catch (error) {}
  }
  useEffect(() => {
    if (faceio !== undefined) {
      if (params.d !== undefined) {
        callbe();
      }
    }
  }, [faceio]);
  useEffect(() => {
    console.log("d->", params.d, ",n->", params.n);
  }, [params.d, params.n]);
  if (allow == true) {
    return (
      <>
        <div className="absolute z-50 w-full h-1/4 bg-[#232323]  top-0"></div>
        <div className="w-full min-h-[100vh] bg-[#232323]  relative z-0">
          <h1 className="text-center mt-5 text-sky-500 font-bold text-lg">
            Autentikasi Proses ...
          </h1>
        </div>
      </>
    );
  } else if (allow == "putus") {
    return (
      <div className="w-full  flex-col">
        <h1 className="text-center mt-5 text-red-500 font-bold text-[2rem]">
          Koneksi Terputus !
        </h1>
        <h1 className="text-center mt-5 text-sky-500 font-bold text-xl">
          Mohon Periksa Koneksi Internet Anda
        </h1>
      </div>
    );
  } else {
    return (
      <div className="w-full  flex-col">
        <h1 className="text-center mt-5 text-sky-500 font-bold text-xl">
          Autentikasi Tidak Valid
        </h1>
      </div>
    );
  }
}
