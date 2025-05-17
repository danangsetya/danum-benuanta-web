"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { absensiT, permissionT, profilT } from "@/lib/types";
import { getSession } from "next-auth/react";
import { useToast } from "../ui/use-toast";
export default function HistoriAbsensiPersonal() {
  const [param, setParam] = useState("");
  const [page, setPage] = useState(1);
  const [profil, setProfil] = useState<profilT>();
  const observer = useRef<IntersectionObserver>();
  const { toast } = useToast();
  const useSearch = (param: string, page: number) => {
    const controller = new AbortController();
    const [hasMore, setHasMore] = useState(false);
    const [data, setData] = useState<absensiT[]>([]);
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
        fetch("/api/absensi/histori/list", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page: cPage == 0 ? page : cPage,
            param,
            uname: profil?.uname,
          }),
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
          // setData(res?.data);
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

  const { data, hasMore, loading } = useSearch(param, page);
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
  useEffect(() => {
    console.log("profil->", profil);
  }, [profil]);
  useEffect(() => {
    getSess().then(() => {
      setParam("|");
      setTimeout(() => {
        setParam("");
      }, 1000);
    });
  }, []);

  return (
    <div>
      <h1 className="text-center font-bold text-lg my-2">Histori Absensi</h1>
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
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Daftar Absen</TableHead>
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
                <TableCell className="flex flex-row space-x-2"></TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
