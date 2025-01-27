"use client";

import { faL, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Heading1 } from "lucide-react";
import { useEffect, useLayoutEffect, useState } from "react";
type faceioT = {
  enroll: any;
  authenticate: any;
  restartSession: () => void;
};
// const faceioInstance = new faceIO("fioa715c");
declare class faceIO {
  constructor(key: any);
}
export default function FaceAdd({
  params,
}: {
  params: { n: number; d: string };
}) {
  const [allow, setAllow] = useState<true | false | "putus">(false);
  const [faceio, setFaceIO] = useState<faceioT>();
  const [ck, ckck] = useState("");
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
  // useLayoutEffect(() => {
  //   console.log("fs key->", fsKey);
  // }, [fsKey]);
  useLayoutEffect(() => {
    // console.log("server Key->", serverKey(params.n));
    // const faceTmp = new faceIO(serverKey(params.n));
    // // console.log(faceTmp);
    // if (faceTmp !== undefined) {
    //   setFaceIO(faceTmp as faceioT);
    // }
    if (faceio == undefined) {
      if (params.n > 0) {
        console.log("faceio->", faceio);
        // console.log("n key->", fsKey[params.n - 1]);
        //     const faceTmp = new faceIO();
        //     // setFaceIO(new faceIO(params.n));
      }
      //   // console.log("server key->", serverKey(params.n));
    }
  }, [params.n]);
  useEffect(() => {
    console.log("allow->", allow);
  }, [allow]);
  useEffect(() => {
    // console.log("tes");
    // alert("tes");
  }, []);
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
      ckck("begin");
      fetch("/api/pengguna/cari/id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: o.user, name: o.name }),
      })
        .then((res) => res.json())
        .then((res: any) => {
          console.log("res->", res);
          if (res.personalia !== null) {
            setAllow(true);
            if (res.hash == "") {
              setAllow(true);
              // throw new Error("xxx");
              // return;
              if (faceio !== undefined) {
                console.log("success");
                return;
                // faceio
                //   .enroll({
                //     locale: "auto", // Default user locale
                //     payload: {
                //       user: o.user,
                //       name: o.name,
                //     },
                //   })
                //   .then((userInfo: any) => {
                //     // console.log("show");
                //     //     // User Successfully Enrolled!
                //     //     alert(
                //     //       `User Successfully Enrolled! Details:
                //     //     Unique Facial ID: ${userInfo.facialId}
                //     //     Enrollment Date: ${userInfo.timestamp}
                //     //     Gender: ${userInfo.details.gender}
                //     //     Age Approximation: ${userInfo.details.age}`
                //     //     );
                //     //                     {
                //     //     "facialId": "7689058114b74dc989d5b02f4799a40bfioa715c",
                //     //     "timestamp": "2023-11-24T07:55:59",
                //     //     "details": {
                //     //         "gender": "male",
                //     //         "age": 41
                //     //     }
                //     // }

                //     // console.log(userInfo);
                //     if (userInfo.facialId) {
                //       console.log("success");
                //     }
                //     //
                //     //     // handle success, save the facial ID, redirect to dashboard...
                //   })
                //   .catch((errCode: any) => {
                //     //  PERMISSION_REFUSED: 1,
                //     // NO_FACES_DETECTED: 2,
                //     // UNRECOGNIZED_FACE: 3,
                //     // MANY_FACES: 4,
                //     // PAD_ATTACK: 5,
                //     // FACE_MISMATCH: 6,
                //     // NETWORK_IO: 7,
                //     // WRONG_PIN_CODE: 8,
                //     // PROCESSING_ERR: 9,
                //     // UNAUTHORIZED: 10,
                //     // TERMS_NOT_ACCEPTED: 11,
                //     // UI_NOT_READY: 12,
                //     // SESSION_EXPIRED: 13,
                //     // TIMEOUT: 14,
                //     // TOO_MANY_REQUESTS: 15,
                //     // EMPTY_ORIGIN: 16,
                //     // FORBIDDDEN_ORIGIN: 17,
                //     // FORBIDDDEN_COUNTRY: 18,
                //     // UNIQUE_PIN_REQUIRED: 19,
                //     // SESSION_IN_PROGRESS: 20,
                //     // FACE_DUPLICATION: 21,
                //     // MINORS_NOT_ALLOWED: 22,
                //     console.info("err face->", errCode);
                //     setAllow("putus");
                //     console.log("back");
                //     //     // handle enrollment failure. Visit:
                //     //     // https://faceio.net/integration-guide#error-codes
                //     //     // for the list of all possible error codes
                //   });
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
              // const x = document.getElementsByClassName("fio-ui-modal__header");
              // console.log(x.length);
            }
          }
        })
        .catch((err: any) => {
          console.log("err->", err);
          setAllow("putus");
          console.log("back");
        })
        .finally(() => {
          ckck(" beh");
        });
    } catch (error) {}
  }
  useEffect(() => {
    if (faceio !== undefined) {
      if (params.d !== undefined) {
        callbe();
      }
    }
    // console.log(faceio);
  }, [faceio]);
  // useEffect(() => {
  //   console.log("d->", params.d, ",n->", params.n);
  // }, [params.d, params.n]);
  // useEffect(() => {
  //   console.log("allow->", allow);
  // }, [allow]);
  return <h1>tes 123</h1>;
  if (allow == true) {
    return (
      <>
        <div className="absolute z-50 w-full h-1/3 bg-[#232323]  top-0"></div>
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
    // console.log(allow, "<-allow");
    return (
      <div className="w-full flex flex-col  h-[100vh] justify-center items-center">
        <FontAwesomeIcon
          icon={faSpinner}
          className="h-16 w-16 animate-spin text-sky-500"
        />
        {/* <h1 className="text-center mt-5 text-sky-500 font-bold text-xl">
          Autentikasi Tidak Valid
        </h1> */}
      </div>
    );
  }
}
