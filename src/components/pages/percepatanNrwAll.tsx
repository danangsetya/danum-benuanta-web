"use client";

import { percepatanNrwType, permissionT } from "@/lib/types";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useToast } from "../ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { getSession } from "next-auth/react";
import Image from "next/image";
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
import { downloadExcel, useDownloadExcel } from "react-export-table-to-excel";
const useSearch = (param: string, page: number) => {
  const controller = new AbortController();
  const [hasMore, setHasMore] = useState(false);
  const [data, setData] = useState<percepatanNrwType[]>([]);
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
      fetch("/api/percepatan-nrw/list", {
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
  useEffect(() => {
    setHasMore(true);
    setLoading(true);
    getData(1)
      .then((res) => {
        console.log("res param []->", res);
        setData(res?.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
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
  useEffect(() => {}, [param, page]);
  return { hasMore, data, loading };
};
export default function PercepatanNrwAll() {
  const [param, setParam] = useState("");
  const [page, setPage] = useState(1);
  const { data, hasMore, loading } = useSearch(param, page);
  const [dataEx, setDataEx] = useState<percepatanNrwType[]>([]);
  const observer = useRef<IntersectionObserver>();
  const { toast } = useToast();
  const tableRef = useRef(null);
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
  const [usernm, setUsernm] = useState("");
  const [permission, setPermissions] = useState<permissionT[]>();

  async function getSess() {
    const token = await getSession();
    // if (token == null) router.replace("/login");
    console.log("session", token);
    if (token?.user) {
      setUsernm(token?.user.name as string);
      const perm = JSON.parse(token?.user.email as string);
      if (perm.permissions) {
        setPermissions(perm.permissions);
      }
    }
  }
  const date = new Date();
  const nowTrimL = `${date.getFullYear()}${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`;

  useLayoutEffect(() => {
    getSess();
  }, []);
  useEffect(() => {
    if (param == "|") setParam("");
  }, [param]);
  useEffect(() => {
    console.log("permission->", permission);
  }, [permission]);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Rekap Percepatan NRW" + nowTrimL,
    sheet: nowTrimL,
  });
  const [wait, setWait] = useState(false);
  return (
    <div>
      <div className="flex flex-col justify-center my-2">
        <h1 className="text-center text-black font-bold text-lg my-2">
          Semua Data Percepatan
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
            placeholder="Cari Data Disini ..."
          />
        </div>
      </div>
      <div className="flex justify-center">
        {permission?.find((permis) => permis.name == "percepatan/admin") ? (
          <button
            className={
              "bg-lime-600 py-2 px-4 font-bold text-slate-50 rounded-lg mx-2 " +
              (data == undefined && "hidden")
            }
            onClick={() => {
              if (wait == false) {
                setWait(true);
                fetch("/api/percepatan-nrw/all", {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                })
                  .then((res) => res.json())
                  .then((res) => {
                    if (res.message == "Ok") {
                      setDataEx(res.data);
                      // downloadExcel({
                      //   fileName: "coba",
                      //   sheet: "coba",
                      //   tablePayload: {
                      //     header: [
                      //       "id?",
                      //       "foto_rumah_name",
                      //       "foto_rumah_path",
                      //       "foto_sr_name",
                      //       "foto_sr_path",
                      //       "nosamw",
                      //       "nama",
                      //       "alamat?",
                      //       "permasalahan",
                      //       "telp",
                      //       "lat",
                      //       "lon",
                      //       "lat_rumah",
                      //       "lon_rumah",
                      //       "username",
                      //       "tindak_lanjut",
                      //       "dibuat",
                      //       "petugas",
                      //     ],
                      //     body: res.data as percepatanNrwType[],
                      //   },
                      // });
                    }
                  })
                  .catch((err) => console.error(err))
                  .finally(() => {
                    setTimeout(() => {
                      onDownload();
                      setWait(false);
                    }, 2000);
                  });
              }
            }}
          >
            {wait ? "Loading ..." : "Export Excel"}
          </button>
        ) : (
          <></>
        )}
        {permission?.find((permis) => permis.name == "percepatan/admin") ? (
          <button
            className={
              "bg-green-600 py-2 px-4 font-bold text-slate-50 rounded-lg mx-2 " +
              (data == undefined && "hidden")
            }
            onClick={() => {
              if (wait == false) {
                setWait(true);
                fetch("/api/percepatan-nrw/sinkron-pm", {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                })
                  .then((res) => res.json())
                  .then((res) => {
                    if (res.message == "Ok") {
                      // setDataEx(res.data);
                    }
                  })
                  .catch((err) => console.error(err))
                  .finally(() => {
                    // setTimeout(() => {
                    //   onDownload();
                    setWait(false);
                    // }, 2000);
                  });
              }
            }}
          >
            {wait ? "Loading ..." : "Sinkron PM"}
          </button>
        ) : (
          <></>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
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
            return (
              <TableRow
                key={index}
                ref={loadMoreCallback}
                className=" w-full flex flex-col  items-center"
              >
                <TableCell className="flex flex-col ">
                  {usernm == item.username ||
                  permission?.find(
                    (permis) => permis.name == "percepatan/admin"
                  ) ? (
                    <AlertDialog>
                      <AlertDialogTrigger className="bg-red-500 p-3 text-white font-bold rounded-xl text-sm">
                        HAPUS
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogTitle>Apakah Anda Yakin ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Akan Menghapus Data Percepatan {item.nosamw}
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              fetch(
                                "/api/percepatan-nrw/delete?id=" + item.id,
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
                                  if (res.message == "Percepatan Di Hapus") {
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
                  ) : (
                    // <button
                    //   type="button"
                    //
                    // >
                    //   Hapus
                    // </button>
                    <></>
                  )}
                  <span className="text-[10px] font-bold text-left bg-sky-500/90 px-1 text-slate-50 z-30 rounded-tr-xl">
                    {item?.nosamw} - {item.nama} | Pembaca Meter :{" "}
                    {item.petugas}
                  </span>
                  <span className="text-[10px]  text-left bg-sky-500/90  text-slate-50 z-30 px-1">
                    {item?.telp}- {item?.permasalahan}
                  </span>
                  <span className="text-[10px]  text-left bg-sky-500/90  text-slate-50 z-30 px-1">
                    {item?.tindak_lanjut}
                  </span>
                  <span className="text-[10px] px-1 text-slate-50 text-left bg-sky-500/90 z-30">
                    Lattitude : {item.lat_rumah}
                  </span>
                  <span className="text-[10px] px-1 text-slate-50 text-left bg-sky-500/80  pb-1 rounded-br-full z-30">
                    Longtitude : {item.lon_rumah}
                  </span>
                  <div className="bg-pink-400 min-w-[80vw] h-52 relative -mt-10 z-10">
                    <Image
                      src={
                        process.env.MAIN_URL +
                        "/api/image" +
                        item.foto_rumah_path
                      }
                      alt="foto rumah"
                      // width={200}
                      // height={200}
                      fill={true}
                      objectFit="cover"
                    />
                  </div>
                  <span className="text-[10px] px-1 text-slate-50 text-left bg-sky-500/90 z-30">
                    Lattitude : {item.lat}
                  </span>
                  <span className="text-[10px] px-1 text-slate-50 text-left bg-sky-500/80  pb-1 rounded-br-full z-30">
                    Longtitude : {item.lon}
                  </span>
                  <div className="bg-pink-400 min-w-[80vw] h-52 relative -mt-10 z-10">
                    <Image
                      src={
                        process.env.MAIN_URL + "/api/image" + item.foto_sr_path
                      }
                      alt="foto rumah"
                      // width={200}
                      // height={200}
                      fill={true}
                      objectFit="cover"
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className="w-0 h-0">
        <Table ref={tableRef}>
          <TableHeader>
            <TableHead>No Sambung</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>No Telp</TableHead>
            <TableHead>Lat Rumah</TableHead>
            <TableHead>Long Rumah</TableHead>
            <TableHead>Lat SR</TableHead>
            <TableHead>Long SR</TableHead>
            <TableHead>Foto Rumah</TableHead>
            <TableHead>Foto Sr</TableHead>
            <TableHead>Permasalahan</TableHead>
            <TableHead>Tindak Lanjut</TableHead>
            <TableHead>Petugas</TableHead>
            <TableHead>Tanggal Input</TableHead>
            <TableHead>Pembaca Meter</TableHead>
          </TableHeader>
          <TableBody>
            {dataEx?.map((item, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{`'${item.nosamw}`}</TableCell>
                  <TableCell>{item.nama}</TableCell>
                  <TableCell>{item.telp}</TableCell>
                  <TableCell>{item.lat_rumah}</TableCell>
                  <TableCell>{item.lon_rumah}</TableCell>
                  <TableCell>{item.lat}</TableCell>
                  <TableCell>{item.lon}</TableCell>
                  <TableCell>
                    {process.env.MAIN_URL + "/api/image" + item.foto_rumah_path}
                  </TableCell>
                  <TableCell>
                    {process.env.MAIN_URL + "/api/image" + item.foto_sr_path}
                  </TableCell>
                  <TableCell>{item.permasalahan}</TableCell>
                  <TableCell>{item.tindak_lanjut}</TableCell>
                  <TableCell>{item.username}</TableCell>
                  <TableCell>{item.dibuat}</TableCell>
                  <TableCell>{item.petugas}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
