"use client";

import { useCallback, useRef, useState, useEffect } from "react";
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
  faBoltLightning,
  faEdit,
  faPen,
  faSpinner,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { hidden } from "@/redux/features/menuStatusSlice";
import FormPesan from "./pesanForm";
import { now } from "@/lib/utils";
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
import PesanTableCell from "../sub/pesan/tabelCell";
export type dataPesanType = {
  id?: number;
  jenis: string;
  smb_stat: string;
  kecamatan: string;
  tunggakan: number;
  daerah: string;
  tanggal_awal: string;
  tanggal_akhir: string;
  pesan: string;
  rutin: number;
  aktif?: number;
  terkirim?: number;
};
const emptyDataPesan: dataPesanType = {
  id: 0,
  jenis: "",
  smb_stat: "",
  kecamatan: "",
  tunggakan: 0,
  daerah: "",
  tanggal_awal: now,
  tanggal_akhir: now,
  pesan: "",
  rutin: 0,
  aktif: 0,
  terkirim: 0,
};

const useSearch = (param: string, page: number) => {
  const controller = new AbortController();
  const [hasMore, setHasMore] = useState(false);
  const [data, setData] = useState<dataPesanType[]>([]);

  const [loading, setLoading] = useState(false);

  type resD = {
    data: [];
    error: [];
    message: string;
  };
  useEffect(() => console.log("loading->", loading), [loading]);
  const getData = async () => {
    return new Promise<resD>((resolve, reject) => {
      setLoading(true);
      fetch("/api/pesan/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ page, param }),
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
    if (page <= 1) {
      setData([]);
      setHasMore(true);
    }
    // console.log("page search->", page);
  }, [page]);
  useEffect(() => {
    setHasMore(true);
  }, [param]);
  // useEffect(() => {
  //   console.log("hasMore->", hasMore);
  // }, [hasMore]);
  useEffect(() => {
    // console.log("param->search->inter", param, page);
    getData()
      .then((res) => {
        console.log("res []->", res);
        // setData(res?.data);
        if (page <= 1) {
          // console.log("kosong");
          setData(res?.data);
        } else {
          setData((old) => {
            return [...old, ...res?.data];
          });
        }

        if (res?.data.length == 0 && page >= 1) setHasMore(false);
      })
      .catch((err) => console.error(err));
    return () => {
      controller.abort();
    };
  }, [param, page]);
  return { hasMore, data };
};
function isKadaluarsa(
  tglSekarang: Date,
  tglAwal: Date,
  tglAkhir: Date
): boolean {
  return !(
    tglAwal.getDate() <= tglSekarang.getDate() &&
    tglSekarang.getDate() <= tglAkhir.getDate()
  );
}
export default function PesanAllPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [param, setParam] = useState("");
  // const [page, setPage] = useState(1);

  useEffect(() => {
    //   // console.log("prm->inter", param);
    //   // console.log("prm->inter", page);
    //   setPage(1);
    if (param == "|") setParam("");
  }, [param]);
  const [mode, setMode] = useState("");
  const [terkirim, setTerkirim] = useState([5]);

  // const { hasMore, data } = useSearch(param, page);
  const [dataEdit, setDataEdit] = useState<dataPesanType>(emptyDataPesan);
  const handleSetMode = (e: string) => {
    setMode(e);
  };
  const handleSetParam = (e: string) => {
    setParam(e);
  };
  const handleSetDataEdit = (e: dataPesanType) => {
    setDataEdit(e);
  };
  // useEffect(() => {
  //   console.log("page->inter", page);
  // }, [page]);
  // useEffect(() => {
  //   console.log("data->", data);
  // }, [data]);

  // const pesanItemController = new AbortController();
  // const cekJumlahTerkirim = (item: dataPesanType, index: any) => {
  //   // console.log("http://localhost:3002/api/pesan/sendstatus?id=" + item.id);
  //   fetch("http://localhost:3002/api/pesan/sendstatus?id=" + item.id, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then((res) => {
  //       if (res.terkirim) {
  //         console.log("sendstatus->", res.terkirim, terkirim);
  //         // item.terkirim = res.terkirim;
  //         // data[index].terkirim = 2;
  //         // if (res.terkirim) {
  //         // const n = new Date();
  //         // console.log(n.getSeconds());
  //         // terkirim[index] = parseFloat(res.terkirim);
  //         // setTerkirim(parseFloat(res.terkirim));
  //         // }
  //       }
  //     })
  //     .catch((err) => console.log("sendstatus err->", err));
  // };
  // useEffect(() => {
  //   console.log("terkirim->", terkirim);
  // }, [terkirim]);
  // useEffect(() => {
  // console.log("data->", data);
  // const cek = setInterval(() => {
  //   const nowDate = new Date();
  //   // console.log(
  //   //   "cek->",
  //   //   nowDate.getHours(),
  //   //   nowDate.getMinutes(),
  //   //   nowDate.getSeconds(),
  //   //   data[0].pesan
  //   // );
  //   data.map((item, index) => {
  //     // console.log(index);
  //     const tglPesanAwal = new Date(item.tanggal_awal);
  //     const tglPesanAkhir = new Date(item.tanggal_akhir);
  //     const tglSekarang = new Date();
  //     if (
  //       !isKadaluarsa(tglSekarang, tglPesanAwal, tglPesanAkhir) &&
  //       item.aktif == 1
  //     ) {
  //       console.log(item);
  //       cekJumlahTerkirim(item, index);
  //     }
  //   });
  //   // data[0].pesan = "tes";
  // }, 2000);
  // return () => {
  //   // console.log("hit");
  //   clearInterval(cek);
  // };
  // }, [data]);
  // const loadMoreCallback = useCallback(
  //   (x: any) => {
  //     if (loading) return;
//     if (observer.current) observer.current.disconnect();
  //     observer.current = new IntersectionObserver((entries) => {
  //       if (entries[0].isIntersecting && hasMore) {
  //         console.log("intersecting");
  //         setPage((prevPage) => prevPage + 1);
  //       }
  //     });
  //     if (x) observer.current.observe(x);
  //   },
  //   [loading, hasMore]
  // );
  useEffect(() => {
    console.log("mode->", mode);
  }, [mode]);
  // if (mode == "edit") {
  //   return (
  //     <>
  //       <h1>Edit</h1>
  //     </>
  //   );
  // }

  return (
    <>
      <div
        className={
          mode == "edit"
            ? "hidden"
            : "flex flex-col md:flex-row md:justify-between px-4 "
        }
      >
        <h1 className={"text-center md:text-right"}>
          List Semua Pesan Broadcast
        </h1>
        <input
          type="text"
          className="border-2 rounded-lg p-2"
          onChange={useCallback(
            (e: any) => {
              setParam(e.target.value);
              // console.log(e.target.value);
            },
            [param]
          )}
          placeholder="Cari pesan disini ..."
        />
      </div>
      {mode == "edit" && (
        <FormPesan
          dataFrom={dataEdit}
          kembali={(v: any) => {
            // console.log(v);
            if (v) {
              setMode("");
              setParam("|");
            }
          }}
        />
      )}
      <Table className={mode == "edit" ? "hidden" : ""}>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Daftar Pesan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <PesanTableCell
            param={param}
            handleSetMode={handleSetMode}
            handleSetParam={handleSetParam}
            handleSetDataEdit={handleSetDataEdit}
          />
          <TableRow>
            <TableCell className="py-20"></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
