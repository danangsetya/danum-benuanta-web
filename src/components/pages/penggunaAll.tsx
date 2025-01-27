"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faPen,
  faRepeat,
  faSpinner,
  faTrash,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { SERVER_PHP } from "@/lib/utils";
import { stdout } from "process";
import { compare } from "bcryptjs";
import Link from "next/link";
import { useToast } from "../ui/use-toast";
import PenggunaForm from "./penggunaForm";
import { helperType, penggunaT } from "@/lib/types";
// type penggunaT = {
//   id?: number;
//   email: string;
//   username: string;
//   profil_image: string;
//   password_hash?: string;
//   active: number;
//   id_personalia: number;
//   last_uuid: string;
//   v2_hash?: string;
//   nama: string;
// };
const useSearch = (param: string, page: number) => {
  const controller = new AbortController();
  const [hasMore, setHasMore] = useState(false);
  const [data, setData] = useState<penggunaT[]>([]);
  const [loading, setLoading] = useState(false);
  const [pass, setPass] = useState(true);
  type resD = {
    data: [];
    error: [];
    message: string;
  };
  // useEffect(() => console.log("loading->", loading), [loading]);
  const getData = async (cPage = 0) => {
    return new Promise<resD>((resolve, reject) => {
      setLoading(true);
      fetch("/api/pengguna/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ page: cPage == 0 ? page : cPage, param }),
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((res) => {
          resolve(res);
        })
        .catch((err) => reject(err))
        .finally(() => setLoading(false));
    });
  };
  // useEffect(() => {
  //   getData()
  //     .then((res) => console.log("res []->", res))
  //     .catch((err) => console.error(err));
  // }, []);
  useEffect(() => {
    // console.log("page -->", page);
    setHasMore(true);
    // console.log("--param", param);
    setLoading(true);
    getData(1)
      .then((res) => {
        console.log("res param []->", res);
        setData(res?.data);
        // if (res?.data.length == 0 && page >= 1) setHasMore(false);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
    // return () => {
    //   controller.abort();
    // };
    // if (param !== "") setPass(false);
  }, [param]);
  useEffect(() => {
    // if (page <= 1) {
    //   setData([]);
    //   setHasMore(true);
    // }
    // console.log("--page", page);
    // setPass(true);
    if (page >= 2 && loading == false) {
      console.log("page search->", page);
      setLoading(true);
      getData()
        .then((res) => {
          // setData(res?.data);
          if (page <= 1) {
            // console.log("kosong");
            setData(res?.data);
          } else {
            setData((old: any) => {
              return [...old, ...res?.data];
            });
          }
          if (page >= 2) {
            console.log("res page []->", res);
            // console.log("kosong");

            // setData((old: any) => {
            //   return [...old, ...res?.data];
            // });
          }
          // else {
          //   setData(res?.data);
          // }
          if (res?.data.length == 0 && page >= 1) setHasMore(false);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }

    return () => {
      // controller.abort();
    };
  }, [page]);

  // useEffect(() => {
  //   console.log("hasMore->", hasMore);
  // }, [hasMore]);
  useEffect(() => {
    // console.log("param->search->inter", param, page);
    // getData()
    //   .then((res) => {
    //     console.log("res []->", res);
    //     // setData(res?.data);
    //     // if (page <= 1) {
    //     //   // console.log("kosong");
    //     //   setData(res?.data);
    //     // } else {
    //     //   setData((old: any) => {
    //     //     return [...old, ...res?.data];
    //     //   });
    //     // }
    //     if (pass) {
    //       // console.log("kosong");
    //       setData((old: any) => {
    //         return [...old, ...res?.data];
    //       });
    //     } else {
    //       setData(res?.data);
    //     }
    //     if (res?.data.length == 0 && page >= 1) setHasMore(false);
    //   })
    //   .catch((err) => console.error(err));
    // return () => {
    //   controller.abort();
    // };
  }, [param, page]);
  return { hasMore, data, loading };
};

export default function PenggunaAll({ helper }: { helper: helperType }) {
  const [param, setParam] = useState("");
  const [page, setPage] = useState(1);
  const [layar, ganti] = useState<undefined | penggunaT>();
  // const [loadingRst, setLoadingRst] = useState(false);
  useEffect(() => {
    setPage(1);
  }, [param]);
  const { data, hasMore, loading } = useSearch(param, page);
  const observer = useRef<IntersectionObserver>();
  const { toast } = useToast();
  const loadMoreCallback = useCallback(
    (x: any) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          console.log("intersecting");
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (x) observer.current.observe(x);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    console.log("data->", data);
  }, [data]);
  useEffect(() => {
    console.log("page->", page);
  }, [page]);
  useEffect(() => {
    if (param == "|") setParam("");
  }, [param]);
  const handleCallback = () => {
    ganti(undefined);
    setParam("|");
    // console.log("click");
  };
  return (
    <>
      <div className={layar == undefined ? "hidden" : ""}>
        <PenggunaForm
          helper={helper}
          pengguna={layar}
          callback={handleCallback}
        />
      </div>
      <div className={layar == undefined ? "" : "hidden"}>
        <h1 className="text-center text-black font-bold text-lg my-2">
          Semua Pengguna
        </h1>
        <div className="flex flex-row justify-center md:justify-start">
          <input
            type="text"
            className="border-2 rounded-lg p-2 "
            value={param}
            onChange={useCallback(
              (e: any) => {
                setParam(e.target.value);
                // console.log(e.target.value);
              },
              [param]
            )}
            placeholder="Cari Siapa ..."
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Nama Pengguna</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={3}>
                  <div className="flex flex-row w-full justify-center  space-x-5">
                    <div className="w-4 h-10 bg-sky-500 animate-bounce rounded-sm"></div>
                    <div className="w-4 h-10 bg-sky-500 animate-bounce delay-100 rounded-sm"></div>
                    <div className="w-4 h-10 bg-sky-500 animate-bounce delay-200 rounded-sm"></div>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {data.map((item, index) => {
              // console.log(item);
              return (
                <TableRow key={index} ref={loadMoreCallback}>
                  <TableCell className="flex flex-row space-x-2">
                    <button
                      className="p-2 bg-yellow-300 rounded-lg shadow-md"
                      onClick={() => {
                        console.log(
                          "data_profil_image",
                          item.data_profil_image
                        );
                        // if (item.data_profil_image !== "") {
                        //   ganti({
                        //     data_profil_image: item.nama as string,
                        //     tanggal_lahir: item.tanggal_lahir,
                        //     jenis_kelamin: item.jenis_kelamin,
                        //   });
                        // } else
                        ganti(item);
                      }}
                    >
                      Ubah <FontAwesomeIcon icon={faPen} />
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger className="p-2 bg-red-600 text-slate-50 rounded-lg shadow-md">
                        Del <FontAwesomeIcon icon={faTrash} />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogTitle>Apakah Anda Yakin ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Akan menghapus Bpk/Ibu{" "}
                          <span className="text-orange-500">{item.nama}</span>
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              // console.log("click");
                              fetch(
                                "/api/pengguna/delete?id=" + item.id_personalia,
                                {
                                  method: "GET",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                }
                              )
                                .then((res) => res.json())
                                .then((res) => {
                                  console.log("delete->", res);
                                  if (res.message == "Pesan Di Hapus") {
                                    // handleSetMode("");
                                    setParam("|");
                                    toast({
                                      duration: 2000,
                                      className: "bg-green-500 text-slate-50",
                                      title: "Penghapusan Berhasil",
                                      description: "Sistem Memutakhirkan",
                                    });
                                  } else {
                                    toast({
                                      duration: 2000,
                                      className: "bg-red-500 text-slate-50",
                                      title: "Penghapusan Gagal",
                                      description: "We have No Reason",
                                    });
                                  }
                                });
                            }}
                          >
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog>
                      <AlertDialogTrigger className="p-2 bg-lime-600 text-slate-50 rounded-lg shadow-md">
                        Reset Pass <FontAwesomeIcon icon={faRepeat} />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogTitle>Reset Pasword ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Password Anda akan menjadi{" "}
                          <span className="font-bold text-black">123456</span>
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              // console.log("click");
                              // const formData = new FormData();
                              // formData.append("me", "123456");
                              fetch("/api/pengguna/resetpass", {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ id: item.id }),
                                // body: formData,
                              })
                                .then((res) => res.json())
                                .then(async (res) => {
                                  console.log("reset->", res);
                                  toast({
                                    duration: 2000,
                                    className: "bg-green-500 text-slate-50",
                                    title: "Reset Password Pengguna Berhasil",
                                    description: "Sistem Memutakhirkan",
                                  });
                                  // const h = res.you as string;
                                  // const hash = h.replace("$2y$", "$2a$");
                                  // console.log("hash->", hash);
                                  // const result = await compare("123456", res.you);
                                  // console.log("rest->", result);
                                })
                                .catch((err) => console.error("reset->", err));
                            }}
                          >
                            Reset
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog>
                      <AlertDialogTrigger className="p-2 bg-slate-600 text-slate-50 rounded-lg shadow-md">
                        Reset Sess <FontAwesomeIcon icon={faRepeat} />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogTitle>
                          Reset Session {item.nama}?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Setelah Di Reset Session , Mohon Login Ulang
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              // console.log("click");
                              // const formData = new FormData();
                              // formData.append("me", "123456");
                              fetch("/api/pengguna/resetsession", {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ id: item.id }),
                                // body: formData,
                              })
                                .then((res) => res.json())
                                .then(async (res) => {
                                  console.log("reset->", res);
                                  if (res.message == "Ok") {
                                    toast({
                                      duration: 2000,
                                      className: "bg-slate-500 text-slate-50",
                                      title: "Reset Session Pengguna Berhasil",
                                      description: "Sistem Memutakhirkan",
                                    });
                                  }
                                  // const h = res.you as string;
                                  // const hash = h.replace("$2y$", "$2a$");
                                  // console.log("hash->", hash);
                                  // const result = await compare("123456", res.you);
                                  // console.log("rest->", result);
                                })
                                .catch((err) => console.error("reset->", err));
                            }}
                          >
                            Reset
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    {((typeof item.activate_hash == "string" &&
                      item.activate_hash !== "") ||
                      (typeof item.activate_hash == "object" &&
                        item.activate_hash !== null) ||
                      item?.hash !== "") && (
                      <AlertDialog>
                        <AlertDialogTrigger className="p-2 bg-red-600 text-slate-50 rounded-lg shadow-md">
                          Del Face <FontAwesomeIcon icon={faTrash} />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogTitle>
                            Apakah Anda Yakin ?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Akan menghapus Matrix Wajah Bpk/Ibu{" "}
                            <span className="text-orange-500">{item.nama}</span>
                          </AlertDialogDescription>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                console.log("click");
                                // fetch(
                                //   "https://api.faceio.net/deletefacialid/?key=ac17a21050d3920097a86986c8bbd6b4&fid=" +
                                //     item.hash,
                                //   {
                                //     method: "GET",
                                //     headers: {
                                //       "Content-Type": "application/json",
                                //     },
                                //   }
                                // )
                                //   .then((res) => res.json())
                                //   .then(() => {
                                fetch("/api/pengguna/resetface", {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    id: item.id,
                                    face:
                                      item.hash !== ""
                                        ? item.hash
                                        : item.activate_hash,
                                  }),
                                  // body: formData,
                                })
                                  .then((resF) => resF.json())
                                  .then(async (resF) => {
                                    console.log("reset face->", resF);
                                    if (
                                      resF.message ==
                                      "Matrix Wajah Berhasil di Hapus"
                                    ) {
                                      // handleSetMode("");
                                      setParam("|");
                                      toast({
                                        duration: 2000,
                                        className: "bg-green-500 text-slate-50",
                                        title:
                                          "Penghapusan Matrix Wajah Berhasil",
                                        description: "Sistem Memutakhirkan",
                                      });
                                    } else {
                                      toast({
                                        duration: 2000,
                                        className: "bg-red-500 text-slate-50",
                                        title: "Penghapusan Matrix Wajah Gagal",
                                        description: "We have No Reason",
                                      });
                                    }
                                  })
                                  .catch((errF) =>
                                    console.error("reset face->", errF)
                                  );

                                // console.log("delete->", res);
                              }}
                            >
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger
                        className={
                          (item.id_mesin_absen == null
                            ? "bg-orange-500"
                            : "bg-green-500") +
                          " p-2 text-slate-50 rounded-lg shadow-md"
                        }
                      >
                        {item.id_mesin_absen == null ? (
                          <>
                            Verify Device <FontAwesomeIcon icon={faCheck} />
                          </>
                        ) : (
                          <>
                            Block Device <FontAwesomeIcon icon={faX} />
                          </>
                        )}
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogTitle>
                          {item.id_mesin_absen == null ? (
                            <>Verifikasi Device Pegawai</>
                          ) : (
                            <>Block/Tolak Device Pegawai</>
                          )}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          <div className="flex flex-col">
                            {item.device !== null && item.platform !== null ? (
                              item.id_mesin_absen == "valid" ? (
                                <>
                                  <span>
                                    Device{" "}
                                    <span className="font-bold text-black">
                                      {item.device}
                                    </span>{" "}
                                    Milik{"  "}
                                    <span className="font-bold text-black">
                                      {item.nama}
                                    </span>{" "}
                                    akan di Block/Tolak pada System Absen
                                    Digital.
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span>
                                    {" "}
                                    Dengan ini Menyatakan Bahwa Benar{" "}
                                    <span className="font-bold text-black">
                                      {item.nama}
                                    </span>
                                  </span>
                                  <span>
                                    Platform{" "}
                                    <span className="font-bold text-black">
                                      {item.platform}
                                    </span>
                                  </span>
                                  <span>
                                    Dengan Smartphone{" "}
                                    <span className="font-bold text-black">
                                      {item.device}
                                    </span>
                                  </span>
                                  <span>&</span>
                                  <span>
                                    Akan digunakan sebagai device untuk Absen
                                    Digital
                                  </span>
                                </>
                              )
                            ) : (
                              <>
                                <span>
                                  Mohon Login ke Aplikasi PDAM Kerja Terlebih
                                  Dahulu dengan username{" "}
                                  <span className="font-bold text-black">
                                    {item.username}
                                  </span>
                                  , Sebelum melakukan Verifikasi Device
                                </span>
                              </>
                            )}
                          </div>
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Tidak</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              if (
                                item.device !== null &&
                                item.platform !== null
                              ) {
                                if (item.id_mesin_absen == "valid") {
                                  fetch("/api/pengguna/blockdevice", {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({ id: item.id }),
                                    // body: formData,
                                  })
                                    .then((res) => res.json())
                                    .then(async (res) => {
                                      if (
                                        res.message ==
                                        "Device Berhasil di Block"
                                      ) {
                                        // handleSetMode("");
                                        setParam("|");
                                        toast({
                                          duration: 2000,
                                          className:
                                            "bg-green-500 text-slate-50",
                                          title: "Device Berhasil di Block",
                                          description: "Sistem Memutakhirkan",
                                        });
                                      } else {
                                        toast({
                                          duration: 2000,
                                          className: "bg-red-500 text-slate-50",
                                          title: "Device Gagal di Block",
                                          description: "We have No Reason",
                                        });
                                      }
                                      // console.log("reset->", res);
                                      // const h = res.you as string;
                                      // const hash = h.replace("$2y$", "$2a$");
                                      // console.log("hash->", hash);
                                      // const result = await compare("123456", res.you);
                                      // console.log("rest->", result);
                                    })
                                    .catch((err) =>
                                      console.error("reset->", err)
                                    );
                                } else {
                                  fetch("/api/pengguna/approvedevice", {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({ id: item.id }),
                                    // body: formData,
                                  })
                                    .then((res) => res.json())
                                    .then(async (res) => {
                                      if (
                                        res.message ==
                                        "Device Berhasil di Verifikasi"
                                      ) {
                                        // handleSetMode("");
                                        setParam("|");
                                        toast({
                                          duration: 2000,
                                          className:
                                            "bg-green-500 text-slate-50",
                                          title:
                                            "Device Berhasil di Verifikasi",
                                          description: "Sistem Memutakhirkan",
                                        });
                                      } else {
                                        toast({
                                          duration: 2000,
                                          className: "bg-red-500 text-slate-50",
                                          title: "Device Gagal di Verifikasi",
                                          description: "We have No Reason",
                                        });
                                      }
                                      // console.log("reset->", res);
                                      // const h = res.you as string;
                                      // const hash = h.replace("$2y$", "$2a$");
                                      // console.log("hash->", hash);
                                      // const result = await compare("123456", res.you);
                                      // console.log("rest->", result);
                                    })
                                    .catch((err) =>
                                      console.error("reset->", err)
                                    );
                                }
                              }
                              // console.log("click");
                              // const formData = new FormData();
                              // formData.append("me", "123456");
                            }}
                          >
                            {item.id_mesin_absen == "valid" ? "Block" : "Benar"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                  <TableCell>
                    {item?.nama} /{" "}
                    <span className="italic">{"(" + item?.username + ")"}</span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
