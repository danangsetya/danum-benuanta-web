import { dataPesanType } from "@/components/pages/pesanAll";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
// import { toast } from "@/components/ui/use-toast";
import { isKadaluarsa } from "@/lib/utils";
import { faPen, faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  useCallback,
  useState,
  useRef,
  useEffect,
  SetStateAction,
} from "react";
function ItemCell({
  id,
  aktif,
  terkirim,
}: {
  id: number | undefined;
  aktif: boolean;
  terkirim: number | undefined;
}) {
  console.log("start->", id);
  const [send, setSend] = useState(terkirim);
  useEffect(() => {
    const cinta = setInterval(() => {
      if (aktif) {
        fetch("/api/pesan/sendstatus?id=" + id, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.terkirim) {
              setSend(res.terkirim);
              console.log("sendstatus->", res.terkirim);
              // item.terkirim = res.terkirim;
              // data[index].terkirim = 2;
              // if (res.terkirim) {
              // const n = new Date();
              // console.log(n.getSeconds());
              // terkirim[index] = parseFloat(res.terkirim);
              // setTerkirim(parseFloat(res.terkirim));
              // }
            }
          })
          .catch((err) => console.log("sendstatus err->", err));
      }
    }, 2000);
    return () => {
      clearInterval(cinta);
    };
  }, []);
  return send;
}
export default function PesanTableCell({
  param,
  handleSetMode,
  handleSetParam,
  handleSetDataEdit,
}: {
  param: string;
  handleSetMode: (value: string) => void;
  handleSetParam: (value: string) => void;
  handleSetDataEdit: (value: dataPesanType) => void;
}) {
  const { toast } = useToast();
  const observer = useRef<IntersectionObserver>();
  // const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  useEffect(() => {
    setPage(1);
  }, [param]);
  const useSearch = (param: string, page: number) => {
    const controller = new AbortController();
    const [hasMore, setHasMore] = useState(false);
    const [data, setData] = useState<dataPesanType[]>([]);

    const [loading, setLoading] = useState(false);
    // console.log("-page", page);
    type resD = {
      data: [];
      error: [];
      message: string;
    };
    // useEffect(() => console.log("loading->", loading), [loading]);
    const getData = async (cPage = 0) => {
      return new Promise<resD>((resolve, reject) => {
        setLoading(true);
        fetch("/api/pesan/list", {
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
          // setData(res?.data);
          // if (page <= 1) {
          // console.log("kosong");
          setData(res?.data);
          // } else {
          //   setData((old: any) => {
          //     return [...old, ...res?.data];
          //   });
          // }

          if (res?.data.length == 0 && page >= 1) setHasMore(false);
        })
        .catch((err) => console.error("here", err))
        .finally(() => setLoading(false));
      // return () => {
      //   controller.abort();
      // };
    }, [param]);
    // useEffect(() => {
    //   getData()
    //     .then((res) => console.log("res []->", res))
    //     .catch((err) => console.error(err));
    // }, []);
    useEffect(() => {
      // if (page <= 1) {
      //   setData([]);
      //   setHasMore(true);
      // }
      if (page >= 2 && loading == false) {
        console.log("page search->", page);
        setLoading(true);
        getData()
          .then((res) => {
            if (page >= 2) {
              console.log("res page []->", res);
              setData((old: any) => {
                return [...old, ...res?.data];
              });
            }
            // setData(res?.data);
            // if (page <= 1) {
            // console.log("kosong");
            // setData(res?.data);
            // } else {
            //   setData((old: any) => {
            //     return [...old, ...res?.data];
            //   });
            // }

            if (res?.data.length == 0 && page >= 1) setHasMore(false);
          })
          .catch((err) => console.error(err))
          .finally(() => setLoading(false));
      }
      return () => {
        controller.abort();
      };
      // console.log("page search->", page);
    }, [page]);

    // useEffect(() => {
    //   console.log("hasMore->", hasMore);
    // }, [hasMore]);
    useEffect(() => {
      // // console.log("param->search->inter", param, page);
      // getData()
      //   .then((res) => {
      //     console.log("res []->", res);
      //     // setData(res?.data);
      //     if (page <= 1) {
      //       // console.log("kosong");
      //       setData(res?.data);
      //     } else {
      //       setData((old: any) => {
      //         return [...old, ...res?.data];
      //       });
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
  const { hasMore, data, loading } = useSearch(param, page);
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
  return (
    <>
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
      {data?.map((item, index) => {
        // console.log(item);
        const tglPesanAwal = new Date(item.tanggal_awal);
        const tglPesanAkhir = new Date(item.tanggal_akhir);
        const tglSekarang = new Date();
        // console.log(isKadaluarsa(tglSekarang, tglPesanAwal, tglPesanAkhir));

        // console.log(item.rutin + " == " + 1, item.rutin == 1);
        let statusPesan = "";
        const pesan = item.pesan.split("\\n");
        const tgl = new Date(item.tanggal_awal);
        return (
          <TableRow key={index} ref={loadMoreCallback}>
            <TableCell className="flex flex-col">
              {/* <span className="text-center">{item.id}</span> */}
              {!isKadaluarsa(tglSekarang, tglPesanAwal, tglPesanAkhir) &&
                item.aktif == 1 && (
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="text-green-500 animate-spin"
                  />
                )}
              {isKadaluarsa(tglSekarang, tglPesanAwal, tglPesanAkhir) ? (
                item.rutin == 1 && item.aktif == 1 ? (
                  <>
                    <span className="text-center bg-green-500 text-white rounded-t-lg p-1">
                      Aktif
                    </span>
                    <span className="text-center bg-green-500 text-white rounded-b-lg p-1">
                      Setiap tgl {tgl.getDate()}
                    </span>
                  </>
                ) : item.aktif == 0 ? (
                  <span className="bg-red-500 text-white text-center p-1 rounded-lg">
                    Non Aktif & Kadaluarsa
                  </span>
                ) : (
                  <span className="bg-red-500 text-white text-center p-1 rounded-lg">
                    Kadaluarsa
                  </span>
                )
              ) : (
                <>
                  {item.aktif ? (
                    <span className="text-center bg-green-500 text-white rounded-t-lg p-1">
                      Aktif
                    </span>
                  ) : (
                    <span className="text-center bg-red-500 text-white rounded-t-lg p-1">
                      Tidak Aktif
                    </span>
                  )}

                  {item.rutin == 1 && (
                    <span className="text-center bg-green-500 text-white rounded-b-lg p-1">
                      Setiap tgl {tgl.getDate()}
                    </span>
                  )}
                </>
              )}
              {/* {tgl.getDate()} */}
              {item?.terkirim !== undefined && item.terkirim > 0 && (
                <span className="bg-lime-700 p-2 text-center text-slate-50">
                  Terkirim{" "}
                  {
                    <ItemCell
                      id={item.id}
                      aktif={
                        item.aktif == 1 &&
                        !isKadaluarsa(tglSekarang, tglPesanAwal, tglPesanAkhir)
                      }
                      terkirim={item.terkirim}
                    />
                  }
                </span>
              )}
            </TableCell>

            <TableCell className="text-justify relative hover:bg-slate-50">
              {pesan.map((item, index2) => {
                // console.log("split->", item);
                return (
                  <div key={index2}>
                    {item}
                    <br />
                  </div>
                );
              })}
              <div className="absolute flex flex-row bg-slate-50 right-0 bottom-0 space-x-3">
                <button
                  className="p-2 bg-yellow-300 rounded-lg shadow-md"
                  onClick={() => {
                    handleSetDataEdit(item);
                    handleSetMode("edit");
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
                      Akan menghapus Pesan{" "}
                      <span className="text-orange-500">
                        {item.pesan.substring(0, 50)}
                      </span>
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          // console.log("click");
                          fetch("/api/pesan/delete?id=" + item.id, {
                            method: "GET",
                            headers: {
                              "Content-Type": "application/json",
                            },
                          })
                            .then((res) => res.json())
                            .then((res) => {
                              console.log("delete->", res);
                              if (res.message == "Pesan Di Hapus") {
                                handleSetMode("");
                                handleSetParam("|");
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
                <button className=""></button>
              </div>
            </TableCell>
          </TableRow>
        );
      }) || (
        <TableRow>
          <TableCell>Data Tidak Ada</TableCell>
        </TableRow>
      )}
    </>
  );
}
