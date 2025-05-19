"use client";

import { absenSekarangT, permissionT, profilT } from "@/lib/types";
import { verify } from "crypto";
import md5 from "md5";
import { getSession } from "next-auth/react";
import { platform } from "os";
import { useEffect, useState } from "react";
import { BrowserType, OSType, WebClientInfo } from "react-client-info";
import { Dialog, DialogContent, DialogDescription } from "../ui/dialog";
import { IScannerComponents, Scanner } from "@yudiel/react-qr-scanner";
import { useToast } from "../ui/use-toast";
import {
  hari,
  nowTrim,
  nowTrimDateTimeH,
  nowTrimDateTimeHM,
} from "@/lib/utils";
import { redirect } from "next/navigation";

export default function AbsensiPersonal({
  uri,
  main,
}: {
  uri: string | undefined;
  main: string;
}) {
  const [stat, setSt] = useState<"verified" | "unverified">("unverified");
  const [lokasi, setLokasi] = useState("Lokasi Kerja");
  const [qrWindow, setQrWindow] = useState<{
    window: boolean;
    absen: "datang" | "pulang" | "datang lembur" | "pulang lembur" | undefined;
  }>({ window: false, absen: undefined });
  const [profil, setProfil] = useState<profilT>();
  const [loading, setWait] = useState(false);
  const [lab, setLab] = useState("");
  const [count, setCount] = useState(0);
  const [sekarang, setSekarang] = useState<absenSekarangT>();

  const { toast } = useToast();
  type dataT = {
    lat: number;
    lon: number;
    verify: boolean;
  };
  const [data, setData] = useState<dataT>();
  async function getSess() {
    const token = await getSession();
    // if (token == null) router.replace("/login");
    const dt: { permission: permissionT[]; profil: profilT } = JSON.parse(
      token?.user?.email as string
    );
    if (dt.profil !== undefined) {
      setProfil(dt.profil);
    }
    console.log("session->", dt);

    return btoa(JSON.stringify(token));
    // if (token?.user) {
    //   const perm = JSON.parse(token?.user.email as string);
    //   if (perm.permissions) {
    //     setPermissions(perm.permissions);
    //   }
    //   // if (perm.profil) {
    //   //   setProfil(perm.profil);
    //   // }
    //   // setPermissions(perm);
    //   // console.log("perm->", perm.length);
    // }
  }
  const handleScan = async (data: string) => {
    try {
      console.log("data qr->", data);
      const plain = atob(data);
      console.log("plain->", plain);
      const d = plain.split("$$");
      console.log(d);
      if (d.length > 1) {
        if (d[2] == lokasi) {
          //  ['0a002700001c', '202505162215', 'Kantor Kampung Bugis']
          const locator = d[0];
          const nowDTHM = nowTrimDateTimeHM();
          if (nowDTHM == d[1]) {
            if (qrWindow.absen) {
              // const nowDTH = nowTrimDateTimeH();

              const faceUri =
                uri +
                `face/auth2/${btoa(nowDTHM)}/${btoa(
                  main + "/absensi/personal"
                )}/${btoa(qrWindow.absen)}/${btoa(
                  JSON.stringify({ uname: profil?.uname, name: profil?.nama })
                )}`;
              console.log("face auth->", faceUri);
              // redirect(uri as string);
              window.location.assign(faceUri);
              // fetch("/api/absensi/datang", {
              //   method: "POST",
              //   headers: {
              //     "Content-Type": "application/json",
              //   },
              //   body: JSON.stringify({ uri }),
              // }).then;
            } else setSt("verified");
          } else {
            console.log(nowDTHM);
            toast({
              duration: 2000,
              className: "bg-red-500 text-slate-50",
              title: "Absensi Gagal ",
              description: "Session Kadaluarsa",
            });
          }
          // console.log();
          // if ()
          //     fetch("/api/pengaturan/pengguna/lokasi/update-locator", {
          //       method: "POST",
          //       headers: { "Content-Type": "application/json" },
          //       body: JSON.stringify({ id: pId, nama, lat, lon, locator }),
          //     })
          //       .then((res) => res.json())
          //       .then((res) => {
          //         console.log("tambah->", res);
          //         if (res.message == "Data Tersimpan") {
          //           toast({
          //             duration: 2000,
          //             className: "bg-green-500 text-slate-50",
          //             title: "Penyimpanan ",
          //             description: "Lokasi Pengguna Berhasil di Ubah",
          //           });
          //           callback(true);
          //           // router.replace("/pengaturan/pengguna/level");
          //         }
          //       })
          //       .catch((err) => console.error(err))
          //       .finally(() => setLoading(false));
        } else {
          console.log(d[2], " == ", lokasi);
          toast({
            duration: 2000,
            className: "bg-red-500 text-slate-50",
            title: "Verifikasi Gagal ",
            description: "Terjadi Kesalahan pada Nama IPA offline locator",
          });
        }
      } else {
        //   toast({
        //     duration: 2000,
        //     className: "bg-red-500 text-slate-50",
        //     title: "Verifikasi Gagal ",
        //     description: "Terjadi Kesalahan pada Split offline locator",
        //   });
      }
      setQrWindow({ ...qrWindow, window: false });
    } catch (error) {
      console.log(error);
      toast({
        duration: 2000,
        className: "bg-red-500 text-slate-50",
        title: "Verifikasi Gagal ",
        description: "Terjadi Kesalahan pada QR offline locator",
      });
      setQrWindow({ ...qrWindow, window: false });
    }

    // setPause(true);
    // try {
    //   const response = await fetch(
    //     `your-api-url?code=${encodeURIComponent(data)}`
    //   );
    //   const result = await response.json();

    //   if (response.ok && result.success) {
    //     alert("Success! Welcome to the conference.");
    //   } else {
    //     alert(result.message);
    //   }
    // } catch (error: unknown) {
    //   console.log(error);
    // } finally {
    //   setPause(false);
    // }
  };

  useEffect(() => {
    console.log("stat->", stat);
  }, [stat]);
  useEffect(() => {
    if ("geolocation" in navigator) {
      // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API

      navigator.geolocation.getCurrentPosition(({ coords }) => {
        // alert(coords.latitude);
        getSess().then((e) => {
          console.log("session->", e);
          const uuid = md5(e);
          console.log("md5->", uuid);

          fetch("/api/absensi/verify_lokasi", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              uuid,
              device: "browser",
              platform: "browser",
              lat: coords.latitude,
              lon: coords.longitude,
            }),
          })
            .then((res) => res.json())
            .then((res) => {
              console.log("res verify->", res);
              setLokasi(res.nama_lokasi);
              setSt(res.message);
            });
        });
        // console.log("sess->", getSession());
        //  fetch(uri+"verify_lokasi")
        setData({
          ...data,
          lat: coords.latitude,
          lon: coords.longitude,
          verify: false,
        });

        console.log(coords);
        // const { latitude, longitude } = coords;
        // setLocation({ latitude, longitude });
      });
    }
    // console.log(getCurrentPosition());
  }, []);
  return (
    <div className="flex  justify-center">
      <Dialog
        open={qrWindow.window}
        onOpenChange={(e) => {
          setQrWindow({ ...qrWindow, window: false });
        }}
      >
        <DialogContent>
          <DialogDescription className="flex flex-col">
            <Scanner
              paused={!qrWindow}
              onScan={(detectedCodes) => {
                handleScan(detectedCodes[0].rawValue);
              }}
              onError={(error) => {
                console.log(`onError: ${error}'`);
              }}
              components={
                {
                  audio: true,
                  onOff: true,
                  torch: true,
                  zoom: true,
                  finder: true,
                } as IScannerComponents
              }
              styles={{ container: { height: "400px", width: "350px" } }}
              formats={[
                "qr_code",
                "micro_qr_code",
                "rm_qr_code",
                "maxi_code",
                "pdf417",
                "aztec",
                "data_matrix",
                "matrix_codes",
                "dx_film_edge",
                "databar",
                "databar_expanded",
                "codabar",
                "code_39",
                "code_93",
                "code_128",
                "ean_8",
                "ean_13",
                "itf",
                "linear_codes",
                "upc_a",
                "upc_e",
              ]}
            />
          </DialogDescription>
        </DialogContent>
      </Dialog>
      {stat == "verified" ? (
        <div className="flex-col items-center justify-center space-y-2  h-[80vh] ">
          <div className="w-full flex-col justify-center item-center p-3 ">
            <div className="flex-row items-center space-x-2 bg-yellow-50/50 justify-center">
              {/* <CalendarIcon size={20} color={"#000"} /> */}
              <h1 className="text-lg text-black text-center">
                {hari(new Date().getDay())},{" "}
                {new Date().toLocaleDateString("id-ID")}
              </h1>
            </div>
            {sekarang !== undefined && (
              <>
                <div className="flex-row items-center space-x-2">
                  {/* <UserIcon size={20} color={"#000"} /> */}
                  <h1 className="text-lg text-black w-1/2">Jam Masuk</h1>
                  <h1 className="text-lg text-black flex-1">
                    : {sekarang?.jam_masuk}
                  </h1>
                </div>
                <div className="flex-row items-center space-x-2">
                  {/* <UserIcon size={20} color={"#000"} /> */}
                  <h1 className="text-lg text-black  w-1/2">Jam Pulang</h1>
                  <h1 className="text-lg text-black flex-1">
                    : {sekarang?.jam_keluar}
                  </h1>
                </div>
                <div className="flex-row items-center space-x-2">
                  {/* <UserIcon size={20} color={"#000"} /> */}
                  <h1 className="text-lg text-black w-1/2">Jam Lembur Masuk</h1>
                  <h1 className="text-lg text-black flex-1">
                    : {sekarang?.jam_lembur_masuk}
                  </h1>
                </div>
                <div className="flex-row items-center space-x-2">
                  {/* <UserIcon size={20} color={"#000"} /> */}
                  <h1 className="text-lg text-black w-1/2">
                    Jam Lembur Pulang
                  </h1>
                  <h1 className="text-lg text-black flex-1">
                    : {sekarang?.jam_lembur_keluar}
                  </h1>
                </div>
              </>
            )}
          </div>

          <h1 className="text-lg text-[#16a34a] text-center">
            Anda Telah Berada di {lokasi}
          </h1>
          <h1 className="text-lg  mb-5 text-black text-center">
            Silahkan Pilih Absen
          </h1>
          <div className="flex flex-row  justify-center space-x-5">
            <button
              className="p-3 bg-sky-500 rounded-xl  min-w-[100] flex items-center"
              onClick={() => {
                if ("geolocation" in navigator) {
                  // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API

                  navigator.geolocation.getCurrentPosition(({ coords }) => {
                    // alert(coords.latitude);
                    getSess().then((e) => {
                      console.log("session->", e);
                      const uuid = md5(e);
                      console.log("md5->", uuid);

                      fetch("/api/absensi/verify_lokasi", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          uuid,
                          device: "browser",
                          platform: "browser",
                          lat: coords.latitude,
                          lon: coords.longitude,
                        }),
                      })
                        .then((res) => res.json())
                        .then((res) => {
                          console.log("res verify push->", res);
                          if (res.message == "unverified") {
                            setQrWindow({
                              ...qrWindow,
                              window: true,
                              absen: "datang",
                            });
                          } else if (res.message == "verified") {
                            const nowDTHM = nowTrimDateTimeHM();
                            const faceUri =
                              uri +
                              `face/auth2/${btoa(nowDTHM)}/${btoa(
                                main + "/absensi/personal"
                              )}/${btoa("datang")}/${btoa(
                                JSON.stringify({
                                  uname: profil?.uname,
                                  name: profil?.nama,
                                })
                              )}`;
                            console.log("face auth->", faceUri);
                            // redirect(uri as string);
                            window.location.assign(faceUri);
                          }
                          //  setSt(res.message);
                        });
                    });
                    //  setData((old) => {
                    //    return {
                    //      ...(old as dataT),
                    //      lat: coords.latitude,
                    //      lon: coords.longitude,
                    //    };
                    //  });
                    console.log(coords);
                    // const { latitude, longitude } = coords;
                    // setLocation({ latitude, longitude });
                  });
                }
                // if (Platform.OS == "ios") {
                //   navigation.navigate(Screen.FaceAuth, {
                //     uri:
                //       authFaceUri +
                //       "1/" +
                //       base64.encode(
                //         JSON.stringify({
                //           user: profil?.id,
                //           name: profil?.username,
                //         })
                //       ),
                //     kind: "datang",
                //   });
                // } else if (Platform.OS == "android") {
                //   request(PERMISSIONS.ANDROID.CAMERA).then((resultR) => {
                //     switch (resultR) {
                //       case RESULTS.UNAVAILABLE:
                //         Alert.alert(
                //           "Gagal Akses",
                //           "DANUM BENUANTA gagal mengakses lokasi akurat HP, Hubungi PDE untuk Bantuan Selanjutnya"
                //         );
                //         // console.log(
                //         //   'This feature is not available (on this device / in this conh1)',
                //         // );
                //         break;
                //       case RESULTS.DENIED:
                //         Alert.alert(
                //           "Gagal Akses",
                //           "DANUM BENUANTA gagal mengakses lokasi akurat HP, Hubungi PDE untuk Bantuan Selanjutnya"
                //         );
                //         // console.log(
                //         //   'The permission has not been requested / is denied but requestable',
                //         // );
                //         break;
                //       case RESULTS.GRANTED:
                //         console.log(
                //           "uri:",
                //           authFaceUri +
                //             "1/" +
                //             base64.encode(
                //               JSON.stringify({
                //                 user: profil?.id,
                //                 name: profil?.username,
                //               })
                //             )
                //         );
                //         navigation.navigate(Screen.FaceAuth, {
                //           uri:
                //             authFaceUri +
                //             "1/" +
                //             base64.encode(
                //               JSON.stringify({
                //                 user: profil?.id,
                //                 name: profil?.username,
                //               })
                //             ),
                //           kind: "datang",
                //         });
                //         // navigation.navigate(Screen.Absensi, {
                //         //   initial: Math.floor(Math.random() * 20),
                //         // });
                //         break;
                //       case RESULTS.BLOCKED:
                //         Alert.alert(
                //           "Gagal Akses",
                //           "DANUM BENUANTA gagal mengakses lokasi akurat HP, Hubungi PDE untuk Bantuan Selanjutnya"
                //         );
                //         break;
                //     }
                //   });
                // }
                // console.log(
                //   base64.encode(
                //     JSON.stringify({
                //       user: profil?.id,
                //       name: profil?.username,
                //     })
                //   )
                // );
              }}
            >
              <h1 className="text-slate-50 text-lg font-bold">Datang</h1>
            </button>
            <button
              className="p-3 bg-yellow-300  rounded-xl  min-w-[100] flex items-center"
              onClick={() => {
                if ("geolocation" in navigator) {
                  // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API

                  navigator.geolocation.getCurrentPosition(({ coords }) => {
                    // alert(coords.latitude);
                    getSess().then((e) => {
                      console.log("session->", e);
                      const uuid = md5(e);
                      console.log("md5->", uuid);

                      fetch("/api/absensi/verify_lokasi", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          uuid,
                          device: "browser",
                          platform: "browser",
                          lat: coords.latitude,
                          lon: coords.longitude,
                        }),
                      })
                        .then((res) => res.json())
                        .then((res) => {
                          console.log("res verify push->", res);
                          if (res.message == "unverified") {
                            setQrWindow({
                              ...qrWindow,
                              window: true,
                              absen: "pulang",
                            });
                          } else if (res.message == "verified") {
                            const nowDTHM = nowTrimDateTimeHM();
                            const faceUri =
                              uri +
                              `face/auth2/${btoa(nowDTHM)}/${btoa(
                                main + "/absensi/personal"
                              )}/${btoa("pulang")}/${btoa(
                                JSON.stringify({
                                  uname: profil?.uname,
                                  name: profil?.nama,
                                })
                              )}`;
                            console.log("face auth->", faceUri);
                            // redirect(uri as string);
                            window.location.assign(faceUri);
                          }
                          //  setSt(res.message);
                        });
                    });
                    //  setData((old) => {
                    //    return {
                    //      ...(old as dataT),
                    //      lat: coords.latitude,
                    //      lon: coords.longitude,
                    //    };
                    //  });
                    console.log(coords);
                    // const { latitude, longitude } = coords;
                    // setLocation({ latitude, longitude });
                  });
                }

                // request(PERMISSIONS.ANDROID.CAMERA).then((resultR) => {
                //   switch (resultR) {
                //     case RESULTS.UNAVAILABLE:
                //       Alert.alert(
                //         "Gagal Akses",
                //         "DANUM BENUANTA gagal mengakses lokasi akurat HP, Hubungi PDE untuk Bantuan Selanjutnya"
                //       );
                //       // console.log(
                //       //   'This feature is not available (on this device / in this conh1)',
                //       // );
                //       break;
                //     case RESULTS.DENIED:
                //       Alert.alert(
                //         "Gagal Akses",
                //         "DANUM BENUANTA gagal mengakses lokasi akurat HP, Hubungi PDE untuk Bantuan Selanjutnya"
                //       );
                //       // console.log(
                //       //   'The permission has not been requested / is denied but requestable',
                //       // );
                //       break;
                //     case RESULTS.GRANTED:
                //       console.log(
                //         "uri:",
                //         authFaceUri +
                //           "1/" +
                //           base64.encode(
                //             JSON.stringify({
                //               user: profil?.id,
                //               name: profil?.username,
                //             })
                //           )
                //       );
                //       navigation.navigate(Screen.FaceAuth, {
                //         uri:
                //           authFaceUri +
                //           "1/" +
                //           base64.encode(
                //             JSON.stringify({
                //               user: profil?.id,
                //               name: profil?.username,
                //             })
                //           ),
                //         kind: "pulang",
                //       });
                //       // navigation.navigate(Screen.Absensi, {
                //       //   initial: Math.floor(Math.random() * 20),
                //       // });
                //       break;
                //     case RESULTS.BLOCKED:
                //       Alert.alert(
                //         "Gagal Akses",
                //         "DANUM BENUANTA gagal mengakses lokasi akurat HP, Hubungi PDE untuk Bantuan Selanjutnya"
                //       );
                //       break;
                //   }
                // });
                // console.log(
                //   base64.encode(
                //     JSON.stringify({
                //       user: profil?.id,
                //       name: profil?.username,
                //     })
                //   )
                // );
              }}
            >
              <h1 className="text-[#16a34a] text-lg font-bold">Pulang</h1>
            </button>
          </div>
          <div className="flex flex-row justify-center space-x-5 pt-5">
            <button
              className="p-3 bg-green-500 rounded-xl  min-w-[100] flex items-center"
              onClick={() => {
                if ("geolocation" in navigator) {
                  // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API

                  navigator.geolocation.getCurrentPosition(({ coords }) => {
                    // alert(coords.latitude);
                    getSess().then((e) => {
                      console.log("session->", e);
                      const uuid = md5(e);
                      console.log("md5->", uuid);

                      fetch("/api/absensi/verify_lokasi", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          uuid,
                          device: "browser",
                          platform: "browser",
                          lat: coords.latitude,
                          lon: coords.longitude,
                        }),
                      })
                        .then((res) => res.json())
                        .then((res) => {
                          console.log("res verify push->", res);
                          if (res.message == "unverified") {
                            setQrWindow({
                              ...qrWindow,
                              window: true,
                              absen: "datang",
                            });
                          } else if (res.message == "verified") {
                            const nowDTHM = nowTrimDateTimeHM();
                            const faceUri =
                              uri +
                              `face/auth2/${btoa(nowDTHM)}/${btoa(
                                main + "/absensi/personal"
                              )}/${btoa("lembur_datang")}/${btoa(
                                JSON.stringify({
                                  uname: profil?.uname,
                                  name: profil?.nama,
                                })
                              )}`;
                            console.log("face auth->", faceUri);
                            // redirect(uri as string);
                            window.location.assign(faceUri);
                          }
                          //  setSt(res.message);
                        });
                    });
                    //  setData((old) => {
                    //    return {
                    //      ...(old as dataT),
                    //      lat: coords.latitude,
                    //      lon: coords.longitude,
                    //    };
                    //  });
                    console.log(coords);
                    // const { latitude, longitude } = coords;
                    // setLocation({ latitude, longitude });
                  });
                }
              }}
            >
              <h1 className="text-slate-50 text-lg font-bold">Datang Lembur</h1>
            </button>
            <button
              className="p-3 bg-orange-500 rounded-xl  min-w-[100] flex items-center"
              onClick={() => {
                if ("geolocation" in navigator) {
                  // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API

                  navigator.geolocation.getCurrentPosition(({ coords }) => {
                    // alert(coords.latitude);
                    getSess().then((e) => {
                      console.log("session->", e);
                      const uuid = md5(e);
                      console.log("md5->", uuid);

                      fetch("/api/absensi/verify_lokasi", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          uuid,
                          device: "browser",
                          platform: "browser",
                          lat: coords.latitude,
                          lon: coords.longitude,
                        }),
                      })
                        .then((res) => res.json())
                        .then((res) => {
                          console.log("res verify push->", res);
                          if (res.message == "unverified") {
                            setQrWindow({
                              ...qrWindow,
                              window: true,
                              absen: "datang",
                            });
                          } else if (res.message == "verified") {
                            const nowDTHM = nowTrimDateTimeHM();
                            const faceUri =
                              uri +
                              `face/auth2/${btoa(nowDTHM)}/${btoa(
                                main + "/absensi/personal"
                              )}/${btoa("lembur_pulang")}/${btoa(
                                JSON.stringify({
                                  uname: profil?.uname,
                                  name: profil?.nama,
                                })
                              )}`;
                            console.log("face auth->", faceUri);
                            // redirect(uri as string);
                            window.location.assign(faceUri);
                          }
                          //  setSt(res.message);
                        });
                    });
                    //  setData((old) => {
                    //    return {
                    //      ...(old as dataT),
                    //      lat: coords.latitude,
                    //      lon: coords.longitude,
                    //    };
                    //  });
                    console.log(coords);
                    // const { latitude, longitude } = coords;
                    // setLocation({ latitude, longitude });
                  });
                }
              }}
            >
              <h1 className="text-slate-50 text-lg font-bold">Pulang Lembur</h1>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-2  h-[80vh]">
          <h1 className="text-lg text-[#16a34a] text-center">
            Anda Terdeteksi Tidak di {lokasi}
          </h1>
          <h1 className=" text-red-500 text-sm text-center">
            Segera ke {lokasi}, lakukan Deteksi atau Scan QR Lokasi {lab}
          </h1>
          {/* {(data == undefined || data.lat == 0 || data.lon == 0) && ( */}
          <button
            className="bg-[#16a34a] p-4 rounded-3xl flex-row space-x-3 items-center"
            onClick={() => {
              if ("geolocation" in navigator) {
                // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API

                navigator.geolocation.getCurrentPosition(({ coords }) => {
                  // alert(coords.latitude);
                  getSess().then((e) => {
                    console.log("session->", e);
                    const uuid = md5(e);
                    console.log("md5->", uuid);

                    fetch("/api/absensi/verify_lokasi", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        uuid,
                        device: "browser",
                        platform: "browser",
                        lat: coords.latitude,
                        lon: coords.longitude,
                      }),
                    })
                      .then((res) => res.json())
                      .then((res) => {
                        console.log("res verify->", res);
                        setSt(res.message);
                      });
                  });
                  setData((old) => {
                    return {
                      ...(old as dataT),
                      lat: coords.latitude,
                      lon: coords.longitude,
                    };
                  });
                  console.log(coords);
                  // const { latitude, longitude } = coords;
                  // setLocation({ latitude, longitude });
                });
              }
            }}
          >
            <h1 className="font-bold text-slate-50 text-lg">
              Deteksi Lokasi saat ini
            </h1>
          </button>
          {/* )} */}
          <button
            className="bg-[#16a34a] p-4 rounded-3xl flex-row space-x-3 items-center"
            onClick={() => {
              // setWait(true);
              // if (loading == false) {
              //   // getCurrentPosition();
              //   // getLocation();
              // }
              setQrWindow({ ...qrWindow, window: true, absen: undefined });
            }}
          >
            {loading ? (
              <>
                {/* <ActivityIndicator size={"large"} color={"#FFF"} /> */}
                <h1 className="font-bold text-slate-50 text-lg">
                  Detecting...
                </h1>
              </>
            ) : (
              <>
                {/* <ArrowPathIcon size={35} color={"#fff"} /> */}
                <h1 className="font-bold text-slate-50 text-lg">
                  Scan QR Lokasi
                </h1>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
