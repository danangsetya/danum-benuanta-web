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
  faPen,
  faPlusCircle,
  faRepeat,
  faTrash,
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
import { useRouter } from "next/navigation";

type penggunaT = {
  id?: number;
  email: string;
  username: string;
  profil_image: string;
  password_hash?: string;
  active: number;
  id_personalia: number;
  last_uuid: string;
  v2_hash?: string;
  nama: string;
};
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
  const getData = async (cPage = 0) => {
    return new Promise<resD>((resolve, reject) => {
      setLoading(true);
      fetch("/api/pengaturan/pengguna/hak/listpengguna", {
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

  return { hasMore, data, loading };
};
export default function PengaturanHakPenggunaBaru() {
  type levelT = {
    id?: number;
    name: string;
    description: string;
  };
  const [level, setLevel] = useState<levelT[]>();
  const [param, setParam] = useState("");
  const [page, setPage] = useState(1);
  const router = useRouter();
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
                  {/* <button
                    className="p-2 bg-yellow-300 rounded-lg shadow-md"
                    onClick={() => {}}
                  >
                    Ubah <FontAwesomeIcon icon={faPen} />
                  </button> */}
                  <AlertDialog>
                    <AlertDialogTrigger className="p-2 bg-lime-600 text-slate-50 rounded-lg shadow-md">
                      Tambah Hak Akses <FontAwesomeIcon icon={faPlusCircle} />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogTitle>Tambah Hak Akses</AlertDialogTitle>
                      <AlertDialogDescription>
                        <div className="flex flex-col">
                          <span>Pilih Level</span>
                          <select
                            className="border-[1px] border-sky-500 p-2 rounded-lg"
                            onChange={(e) => {
                              console.log(e.target.value);
                              fetch("/api/pengaturan/pengguna/hak/add", {
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
                                  console.log("add pengguna->", res);
                                  if (res.message == "Data Tersimpan") {
                                    router.replace("/pengaturan/pengguna/hak");
                                    // handleSetMode("");
                                    // setParam("|");
                                    // toast({
                                    //   duration: 2000,
                                    //   className: "bg-green-500 text-slate-50",
                                    //   title: "Perubahan Berhasil",
                                    //   description: "Sistem Memutakhirkan",
                                    // });
                                  } else {
                                    toast({
                                      duration: 2000,
                                      className: "bg-red-500 text-slate-50",
                                      title: "Penambahan Akses Gagal",
                                      description: "We have No Reason",
                                    });
                                  }
                                });
                            }}
                          >
                            <option disabled selected>
                              Pilih Level
                            </option>
                            {level?.map((itemL, index) => {
                              return (
                                <option key={index} value={itemL.id}>
                                  {itemL.name}
                                </option>
                              );
                            })}
                          </select>
                        </div>{" "}
                      </AlertDialogDescription>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
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
      </Table>{" "}
    </>
  );
}
