"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { absenT } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { numToTimePlain } from "@/lib/utils";
import { useDownloadExcel } from "react-export-table-to-excel";
import Link from "next/link";
// const useSearch = (param: string, page: number) => {
//   const controller = new AbortController();
//   const [hasMore, setHasMore] = useState(false);
//   const [data, setData] = useState<absenT[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [pass, setPass] = useState(true);
//   type resD = {
//     data: [];
//     error: [];
//     message: string;
//   };
//   // useEffect(() => console.log("loading->", loading), [loading]);
//   const getData = async (cPage = 0) => {
//     return new Promise<resD>((resolve, reject) => {
//       setLoading(true);
//       fetch("/api/absensi/rekap", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ page: cPage == 0 ? page : cPage, param }),
//         signal: controller.signal,
//       })
//         .then((res) => res.json())
//         .then((res) => {
//           resolve(res);
//         })
//         .catch((err) => reject(err))
//         .finally(() => setLoading(false));
//     });
//   };
//   // useEffect(() => {
//   //   getData()
//   //     .then((res) => console.log("res []->", res))
//   //     .catch((err) => console.error(err));
//   // }, []);
//   useEffect(() => {
//     // console.log("page -->", page);
//     setHasMore(true);
//     // console.log("--param", param);
//     setLoading(true);
//     getData(1)
//       .then((res) => {
//         console.log("res param []->", res);
//         // setData(res?.data);
//         // if (res?.data.length == 0 && page >= 1) setHasMore(false);
//       })
//       .catch((err) => console.error(err))
//       .finally(() => setLoading(false));
//     // return () => {
//     //   controller.abort();
//     // };
//     // if (param !== "") setPass(false);
//   }, [param]);
//   useEffect(() => {
//     // if (page <= 1) {
//     //   setData([]);
//     //   setHasMore(true);
//     // }
//     // console.log("--page", page);
//     // setPass(true);
//     if (page >= 2 && loading == false) {
//       console.log("page search->", page);
//       setLoading(true);
//       getData()
//         .then((res: any) => {
//           // setData(res?.data);
//           console.log("res page->", res);
//           if (page <= 1) {
//             // console.log("kosong");
//             // setData(res?.data);
//           } else {
//             setData((old: any) => {
//               return [...old, ...res?.data];
//             });
//           }
//           if (page >= 2) {
//             console.log("res page []->", res);
//             // console.log("kosong");

//             // setData((old: any) => {
//             //   return [...old, ...res?.data];
//             // });
//           }
//           // else {
//           //   setData(res?.data);
//           // }
//           if (res?.data.length == 0 && page >= 1) setHasMore(false);
//         })
//         .catch((err) => console.error(err))
//         .finally(() => setLoading(false));
//     }

//     return () => {
//       controller.abort();
//     };
//   }, [page]);

//   // useEffect(() => {
//   //   console.log("hasMore->", hasMore);
//   // }, [hasMore]);
//   // useEffect(() => {
//   // console.log("param->search->inter", param, page);
//   // getData()
//   //   .then((res) => {
//   //     console.log("res []->", res);
//   //     // setData(res?.data);
//   //     // if (page <= 1) {
//   //     //   // console.log("kosong");
//   //     //   setData(res?.data);
//   //     // } else {
//   //     //   setData((old: any) => {
//   //     //     return [...old, ...res?.data];
//   //     //   });
//   //     // }
//   //     if (pass) {
//   //       // console.log("kosong");
//   //       setData((old: any) => {
//   //         return [...old, ...res?.data];
//   //       });
//   //     } else {
//   //       setData(res?.data);
//   //     }
//   //     if (res?.data.length == 0 && page >= 1) setHasMore(false);
//   //   })
//   //   .catch((err) => console.error(err));
//   // return () => {
//   //   controller.abort();
//   // };
//   // }, [param, page]);
//   return { hasMore, data, loading };
// };
export default function AbsensiRekap() {
  const tableRef = useRef(null);
  const [param, setParam] = useState("");
  const [from, setFrom] = useState("");
  const [data, setData] = useState<absenT[]>();
  const [to, setTo] = useState("");
  const [loading, setWait] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    // to: addDays(new Date(), 20),
    to: new Date(),
  });
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Rekap Absensi " + from + "-" + to,
    sheet: from + "-" + to,
  });
  useEffect(() => {
    if (date?.from !== undefined) {
      setFrom(
        date?.from?.getFullYear() +
          "-" +
          (date?.from?.getUTCMonth() + 1).toString().padStart(2, "0") +
          "-" +
          date.from.getDate().toString().padStart(2, "0")
      );
    }
    if (date?.to !== undefined) {
      setTo(
        date?.to?.getFullYear() +
          "-" +
          (date?.to?.getUTCMonth() + 1).toString().padStart(2, "0") +
          "-" +
          date.to.getDate().toString().padStart(2, "0")
      );
    }
  }, [date]);
  useEffect(() => {
    console.log("from->", from);
  }, [from]);
  useEffect(() => {
    console.log("to->", to);
  }, [to]);
  useEffect(() => {
    console.log("data->", data);
  }, [data]);
  return (
    <div className="flex flex-col">
      <h1 className="text-center text-black font-bold text-lg my-2">
        Rekapitulasi Absensi
      </h1>
      <div className="flex flex-row justify-center md:justify-start">
        {/* <input
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
        /> */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={
                "w-[300px] justify-start text-left font-normal" + !date &&
                "text-muted-foreground"
              }
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "dd LLL y")} -{" "}
                    {format(date.to, "dd LLL y")}
                  </>
                ) : (
                  format(date.from, "dd LLL y")
                )
              ) : (
                <span>Pilih Tanggal Rekap</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <button
          className="bg-lime-600 py-2 px-4 font-bold text-slate-50 rounded-lg ml-4"
          onClick={() => {
            setWait(true);
            if (loading == false) {
              if (from !== "" && to !== "") {
                fetch("/api/absensi/rekap", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ from, to }),
                })
                  .then((res) => res.json())
                  .then((res: any) => {
                    console.log("res->", res);
                    if (res.data) {
                      setData(res.data);
                    }
                  })
                  .catch((err: any) => {
                    console.log("err->", err);
                  })
                  .finally(() => setWait(false));
              } else {
                alert("Mohon Pilih Range Tanggal Rekap Absensi");
              }
            }
          }}
        >
          Cari
        </button>
        <button
          className={
            "bg-lime-600 py-2 px-4 font-bold text-slate-50 rounded-lg ml-4 " +
            (data == undefined && "hidden")
          }
          onClick={() => {
            if (from !== "" && to !== "") {
              onDownload();
            } else {
              alert("Mohon Pilih Range Tanggal Rekap Absensi");
            }
            // fetch("/api/absensi/rekap", {
            //   method: "POST",
            //   headers: {
            //     "Content-Type": "application/json",
            //   },
            //   body: JSON.stringify({ from: date?.from, to: date?.to }),
            // })
            //   .then((res) => res.json())
            //   .then((res: any) => {
            //     console.log("res->", res);
            //   })
            //   .catch((err: any) => {
            //     console.log("err->", err);
            //   });
          }}
        >
          Export Excel
        </button>
      </div>
      <Table ref={tableRef}>
        <TableHeader>
          <TableRow>
            <TableHead>Nik</TableHead>
            <TableHead>Nama Pegawai</TableHead>
            <TableHead>Bidang</TableHead>
            <TableHead>periode</TableHead>
            <TableHead>telat [kali]</TableHead>
            {/* <TableHead>Pulang Cepat [kali]</TableHead> */}
            <TableHead>Total Lembur [Menit]</TableHead>
            <TableHead>Aturan Jam Kerja</TableHead>
            <TableHead>Total Jam Kerja</TableHead>
            <TableHead>Total Kurang Jam</TableHead>
            {/* <TableHead>Total Hari Kerja</TableHead>
            <TableHead>Total Hari Alpha</TableHead>
            <TableHead>Total Hari Lupa</TableHead>
            <TableHead>Total Hari Istirahat</TableHead>
            <TableHead>Total Ijin/Cuti</TableHead>
            <TableHead>Total Hari Libur</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={16}>
                <div className="flex flex-row w-full justify-center  space-x-5">
                  <div className="w-4 h-10 bg-sky-500 animate-bounce rounded-sm"></div>
                  <div className="w-4 h-10 bg-sky-500 animate-bounce delay-100 rounded-sm"></div>
                  <div className="w-4 h-10 bg-sky-500 animate-bounce delay-200 rounded-sm"></div>
                </div>
              </TableCell>
            </TableRow>
          )}
          {data?.map((item, index) => {
            return (
              <TableRow key={index}>
                <TableCell>{item.nik}</TableCell>
                <TableCell>
                  <Link
                    href={
                      "absensi/" + item.id_personalia + "/" + from + "/" + to
                    }
                  >
                    {item.nama}
                  </Link>
                </TableCell>
                <TableCell>{item.bagian}</TableCell>
                <TableCell>
                  {from} - {to}
                </TableCell>
                <TableCell>{item.terlambat}</TableCell>
                <TableCell>
                  {item.total_lembur == undefined
                    ? "-"
                    : numToTimePlain(item.total_lembur)}
                </TableCell>
                <TableCell>-</TableCell>
                <TableCell>
                  {item.total_jam == undefined
                    ? "-"
                    : numToTimePlain(item.total_jam)}
                </TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
