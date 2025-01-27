"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import PengaturanLevelPenggunaForm from "./pengaturanLevelPenggunaForm";
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
  faPen,
  faTrash,
  faUserShield,
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
import { useToast } from "../ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import PengaturanAksesPenggunaForm from "./pengaturanAksesPenggunaForm";
import { Switch } from "../ui/switch";
type levelT = {
  id?: number;
  name: string;
  description: string;
  group_id: number;
  permission_id: number;
};
const useSearch = (id: number, param: string, page: number) => {
  const controller = new AbortController();
  const [hasMore, setHasMore] = useState(false);
  const [data, setData] = useState<levelT[]>([]);
  const [loading, setLoading] = useState(false);
  const [pass, setPass] = useState(true);
  type resD = {
    data: [];
    error: [];
    message: string;
  };
  useEffect(() => {
    console.log({ hasMore, param, page, id });
  }, [hasMore, param, page, id]);
  // return { hasMore, data, loading };
  // useEffect(() => console.log("loading->", loading), [loading]);
  const getData = async (cPage = 0) => {
    return new Promise<resD>((resolve, reject) => {
      setLoading(true);
      fetch("/api/pengaturan/pengguna/level/akseslist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ page: cPage == 0 ? page : cPage, param, id }),
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
        if (res?.data.length == 0 && page >= 1) {
          setHasMore(false);
        } else if (res?.data.length > 0 && page >= 1) {
          setHasMore(true);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
    // return () => {
    //   controller.abort();
    // };
    // if (param !== "") setPass(false);
  }, [param, id]);
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
          // if (page <= 1) {
          //   // console.log("kosong");
          //   setData(res?.data);
          // } else {
          //   setData((old: any) => {
          //     return [...old, ...res?.data];
          //   });
          // }
          if (page >= 2) {
            console.log("res page []->", res);
            // console.log("kosong");
            setData((old: any) => {
              return [...old, ...res?.data];
            });
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
      controller.abort();
    };
  }, [page, id]);

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
export default function PengaturanLevelAksesPenggunaAll({
  id,
}: {
  id: number;
}) {
  const [subState, setSub] = useState<
    "new" | "all" | "edit_akses" | "edit_name"
  >("all");
  const [param, setParam] = useState("");
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<levelT>();
  const [dialog, setDialog] = useState(false);
  const { data, hasMore, loading } = useSearch(id, param, page);
  type levelTwS = levelT & {
    stat?: boolean;
  };
  // const dataWS:levelTwS[]=
  const [dataWS, setDataWS] = useState<levelTwS>();
  // const [loadingS, setLoadingS] = useState<levelTwS[]>();
  useEffect(() => {
    setPage(1);

    if (param == "|") setParam("");
  }, [param]);

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
    if (detail !== undefined) {
      setDialog(true);
    }
  }, [detail]);
  useEffect(() => {
    if (dialog == false) {
      setDetail(undefined);
    }
  }, [dialog]);
  const handleCallback = (v: boolean) => {
    if (v == true) {
      setDetail(undefined);
      setDialog(false);
      setParam("|");
    }
  };
  useEffect(() => {
    // setDataWS(data);
  }, [data]);
  return (
    <>
      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent>
          <PengaturanAksesPenggunaForm
            pNama={detail?.name}
            pDes={detail?.description}
            pId={detail?.id}
            callback={handleCallback}
          />
        </DialogContent>
      </Dialog>
      <h1 className="text-center font-bold text-xl">Semua Akses Pengguna</h1>
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
            <TableHead>Nama Level</TableHead>
            <TableHead>Keterangan</TableHead>
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
            // console.log(item);
            return (
              <TableRow key={index} ref={loadMoreCallback}>
                <TableCell>
                  {item.name}
                  {/* {item?.nama} /{" "}
                      <span className="italic">
                        {"(" + item?.username + ")"}
                      </span> */}
                </TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell className="flex flex-row space-x-2">
                  <Switch
                    checked={item.group_id == null ? false : true}
                    onClick={() => {
                      fetch("/api/pengaturan/pengguna/level/akseschange", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          gid:
                            item.group_id === undefined ? 0 : item.group_id * 1,
                          pid: item.id === undefined ? 0 : item.id * 1,
                          id,
                        }),
                      })
                        .then((res) => res.json())
                        .then((res) => {
                          setParam("|");
                          console.log("ubah switch->", res);
                          //  if (res.message == "Data Tersimpan") {
                          //    toast({
                          //      duration: 2000,
                          //      className: "bg-green-500 text-slate-50",
                          //      title: "Penyimpanan ",
                          //      description: "Level Pengguna Berhasil di Ubah",
                          //    });
                          //   //  callback(true);
                          //    // router.replace("/pengaturan/pengguna/level");
                          //  }
                        })
                        .catch((err) => console.error(err));
                      //  .finally(() => setLoading(false));     console.log("klik");
                    }}
                  />
                  {/* <AlertDialog>
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
                                    // const h = res.you as string;
                                    // const hash = h.replace("$2y$", "$2a$");
                                    // console.log("hash->", hash);
                                    // const result = await compare("123456", res.you);
                                    // console.log("rest->", result);
                                  })
                                  .catch((err) =>
                                    console.error("reset->", err)
                                  );
                              }}
                            >
                              Reset
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog> */}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
