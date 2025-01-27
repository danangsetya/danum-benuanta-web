"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useToast } from "../ui/use-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import { faEraser, faRepeat } from "@fortawesome/free-solid-svg-icons";
import { getSession } from "next-auth/react";
import { permissionT } from "@/lib/types";

const useSearch = (param: string, page: number) => {
  type penggunaTirtaT = {
    email: string;
    username: string;
    nama: string;
  };
  const controller = new AbortController();
  const [hasMore, setHasMore] = useState(false);
  const [data, setData] = useState<penggunaTirtaT[]>([]);
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
      fetch("api/tirtaalamku/pengguna/all", {
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
export default function PenggunaTirtaalamkuAll() {
  const [param, setParam] = useState("");
  const [page, setPage] = useState(1);
  const [btnResetPass, setBtnResetPass] = useState(false);
  const [btnClearSess, setBtnClearSess] = useState(false);
  const [allowPage, setAllowPage] = useState(false);
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
  const [permission, setPermissions] = useState<permissionT[]>();
  // const [profil, setProfil] = useState<profilT>();
  async function getSess() {
    const token = await getSession();
    // if (token == null) router.replace("/login");
    console.log("session", token);
    if (token?.user) {
      const perm = JSON.parse(token?.user.email as string);
      if (perm.permissions) {
        setPermissions(perm.permissions);
      }
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
  useEffect(() => {
    console.log("data->", data);
  }, [data]);
  useEffect(() => {
    console.log("page->", page);
  }, [page]);
  useEffect(() => {
    console.log("permission->", permission);
    if (permission !== undefined && permission.length > 0) {
      if (
        permission.find(
          (permis) => permis.name == "tirtaalamku/pengguna/resetpass"
        )
      ) {
        setBtnResetPass(true);
      } else {
        setBtnResetPass(false);
      }

      if (
        permission.find(
          (permis) => permis.name == "tirtaalamku/pengguna/clearsession"
        )
      ) {
        setBtnClearSess(true);
      } else {
        setBtnClearSess(false);
      }
      if (permission.find((permis) => permis.name == "tirtaalamku/pengguna")) {
        setAllowPage(true);
      } else {
        setAllowPage(false);
      }
      // console.log(
      //   "contain->",
      //   permission.find((permis) => permis.name == "user/account")
      //     ? true
      //     : false
      // );
    }
  }, [permission]);

  return (
    <>
      <div className={allowPage ? "hidden" : ""}>
        <h1 className="text-center font-bold py-2">
          Anda Tidak Memiliki Akses ke Halaman ini
        </h1>
      </div>
      <div className={allowPage ? "" : "hidden"}>
        <h1 className="text-center font-bold py-2">
          Semua Pengguna Tirtaalamku
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
              return (
                <TableRow key={index} ref={loadMoreCallback}>
                  <TableCell className="flex flex-row space-x-2">
                    <AlertDialog>
                      <AlertDialogTrigger
                        className={
                          (btnResetPass ? "" : "hidden ") +
                          "p-2 bg-lime-600 text-slate-50 rounded-lg shadow-md"
                        }
                      >
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
                              fetch("/api/tirtaalamku/pengguna/resetpass", {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ data: item.username }),
                                // body: formData,
                              })
                                .then((res) => res.json())
                                .then(async (res) => {
                                  console.log("reset->", res);
                                  if (res.response == 200) {
                                    toast({
                                      duration: 2000,
                                      className: "bg-green-500 text-slate-50",
                                      title:
                                        "Password Berhasil di Reset 123456",
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
                    <AlertDialog>
                      <AlertDialogTrigger
                        className={
                          (btnClearSess ? "" : "hidden ") +
                          "p-2 bg-green-600 text-slate-50 rounded-lg shadow-md"
                        }
                      >
                        Clear Session <FontAwesomeIcon icon={faEraser} />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogTitle>
                          Session akan di Reset ?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Dengan mereset session pengguna tirtaalamku dengan HP
                          Baru akan bisa login kembali{" "}
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              // console.log("click");
                              // const formData = new FormData();
                              // formData.append("me", "123456");
                              fetch("/api/tirtaalamku/pengguna/clearsession", {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ data: item.username }),
                                // body: formData,
                              })
                                .then((res) => res.json())
                                .then(async (res) => {
                                  console.log("reset->", res);
                                  if (res.response == 200) {
                                    toast({
                                      duration: 2000,
                                      className: "bg-green-500 text-slate-50",
                                      title: "Session Sudah di Bersihkan",
                                      description:
                                        "Silahkan coba login kembali",
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
