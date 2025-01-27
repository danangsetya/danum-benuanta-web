"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  faPen,
  faTrash,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import nextBase64 from "next-base64";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
type penggunaWLvlT = {
  name: string;
  group_id: number;
  id?: number;
  email: string;
  username: string;
  active: number;
};
const useSearch = (param: string, page: number) => {
  const controller = new AbortController();
  const [hasMore, setHasMore] = useState(false);
  const [data, setData] = useState<penggunaWLvlT[]>([]);
  const [loading, setLoading] = useState(false);
  const [pass, setPass] = useState(true);
  type resD = {
    data: [];
    error: [];
    message: string;
  };
  // return { hasMore, data, loading };
  // useEffect(() => console.log("loading->", loading), [loading]);
  const getData = async (cPage = 0) => {
    return new Promise<resD>((resolve, reject) => {
      setLoading(true);
      fetch("/api/pengaturan/pengguna/hak/list", {
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
        if (res?.data.length == 0 && page >= 1) setHasMore(false);
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

export default function PengaturanHakPenggunaAll() {
  const router = useRouter();
  const [param, setParam] = useState("");
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<penggunaWLvlT>();
  const [dialog, setDialog] = useState(false);
  type levelT = {
    id?: number;
    name: string;
    description: string;
  };
  const [level, setLevel] = useState<levelT[]>();
  const { data, hasMore, loading } = useSearch(param, page);
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
  useLayoutEffect(() => {
    fetch("/api/pengaturan/pengguna/level/alllist", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        // console.log("alllist->", res);
        setLevel(res.data);
      })
      .catch((err) => console.log("alllist err->", err));
  }, []);
  return (
    <>
      <h1 className="text-center font-bold text-xl w-full bg-gradient-to-b from-white to bg-slate-100 mt-2 py-2">
        Daftar Hak akses Pengguna
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
            <TableHead className="text-sky-500 font-bold font-mono text-lg">
              Pengguna
            </TableHead>
            <TableHead className="text-sky-500 font-bold font-mono text-lg">
              Level
            </TableHead>
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
              <TableRow key={index} ref={loadMoreCallback}>
                <TableCell>
                  {item.username}
                  {/* {item?.nama} /{" "}
                      <span className="italic">
                        {"(" + item?.username + ")"}
                      </span> */}
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell className="flex flex-row space-x-2">
                  {/* <button
                    className="p-2 bg-yellow-300 rounded-lg shadow-md"
                    onClick={() => {
                      if (item.id) {
                        router.push(
                          "/pengaturan/pengguna/hak/" +
                            nextBase64.encode(item.id?.toString())
                        );
                      }
                    }}
                  >
                    Ubah Level <FontAwesomeIcon icon={faUserShield} />
                  </button> */}
                  <AlertDialog>
                    <AlertDialogTrigger className="p-2 bg-yellow-300  rounded-lg shadow-md">
                      Ubah Level <FontAwesomeIcon icon={faUserShield} />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogTitle>Ubah Level Pengguna ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        <div className="flex flex-col">
                          <span>Pilih Level</span>
                          <select
                            className="border-[1px] border-sky-500 p-2 rounded-lg"
                            onChange={(e) => {
                              fetch("/api/pengaturan/pengguna/hak/update", {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  gid: e.target.value,
                                  id: item.id,
                                }),
                              })
                                .then((res) => res.json())
                                .then((res) => {
                                  console.log("delete->", res);
                                  if (res.message == "Data Tersimpan") {
                                    // handleSetMode("");
                                    setParam("|");
                                    toast({
                                      duration: 2000,
                                      className: "bg-green-500 text-slate-50",
                                      title: "Perubahan Berhasil",
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
                            {level?.map((itemL, index) => {
                              return (
                                <option
                                  key={index}
                                  value={itemL.id}
                                  selected={
                                    itemL.name == item.name ? true : false
                                  }
                                >
                                  {itemL.name}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </AlertDialogDescription>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        {/* <AlertDialogAction
                          onClick={() => {
                            // console.log("click");
                            
                          }}
                        >
                          Ubah
                        </AlertDialogAction> */}
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <AlertDialog>
                    <AlertDialogTrigger className="p-2 bg-red-600 text-slate-50 rounded-lg shadow-md">
                      Del <FontAwesomeIcon icon={faTrash} />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogTitle>Apakah Anda Yakin ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Akan menghapus Bpk/Ibu{" "}
                        <span className="text-orange-500">{item.name}</span>
                      </AlertDialogDescription>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            // console.log("click");
                            fetch(
                              "/api/pengaturan/pengguna/hak/delete?id=" +
                                item.id +
                                "&gid=" +
                                item.group_id,
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
