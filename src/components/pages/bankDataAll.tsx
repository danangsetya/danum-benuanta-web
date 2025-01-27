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
import { filesT, fileT, helperType, profilT } from "@/lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faFile,
  faFileExcel,
  faFileImage,
  faFilePdf,
  faFileWord,
  faSpinner,
  faTrash,
  faX,
  faXRay,
} from "@fortawesome/free-solid-svg-icons";
import ThumbnailPdf from "../helper/thumbnailPdf";
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
import { getSession } from "next-auth/react";
import { allowedFileTypes, nowTrimDateTime } from "@/lib/utils";
import { Switch } from "../ui/switch";
import axios, { AxiosRequestConfig } from "axios";
import { toast } from "../ui/use-toast";
import Link from "next/link";
import ThumbnailDocExcel from "../helper/thumbnailDocExcel";
const useSearch = (param: string, page: number) => {
  const controller = new AbortController();
  const [hasMore, setHasMore] = useState(false);
  const [data, setData] = useState<filesT[]>([]);
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
      fetch("/api/files/list", {
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
  return { hasMore, data, loading };
};
export default function BankDataAll({ helper }: { helper: helperType }) {
  const [param, setParam] = useState("");
  const [page, setPage] = useState(1);
  const observer = useRef<IntersectionObserver>();
  const { data, hasMore, loading } = useSearch(param, page);
  const fileRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<filesT[]>();
  const [load, setWait] = useState(false);
  const [profil, setProfil] = useState<profilT>();
  const [sw, setSw] = useState(false);
  const [jabatan, setJabatan] = useState("");
  const [unitKerja, setunitKerja] = useState("");
  const [bagian, setbagian] = useState("");
  const [titel, setTitel] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [fileEnter, setFileEnter] = useState(false);
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
    if (param == "|") {
      setTimeout(() => {
        setParam("");
      }, 500);
    }
  }, [param]);
  useEffect(() => {
    console.log("data->", data);
  }, [data]);
  useEffect(() => {
    console.log("fileEnter->", fileEnter);
  }, [fileEnter]);
  async function getSess() {
    const token = await getSession();
    // if (token == null) router.replace("/login");
    console.log("session", token);
    if (token?.user) {
      const all = JSON.parse(token?.user.email as string);
      // const data = JSON.parse();
      console.log("session->", all);
      if (all.profil) {
        setProfil(all.profil);
      }
      // if (perm.permissions) {
      //   setPermissions(perm.permissions);
      // }
      // if (perm.profil) {
      //   setProfil(perm.profil);
      // }
      // setPermissions(perm);
      // console.log("perm->", perm.length);
    }
  }
  useLayoutEffect(() => {
    getSess();
    // console.log(
    //   "allowed Files->",
    //   `${JSON.stringify(allowedFileTypes)
    //     .replaceAll("[", "")
    //     .replaceAll("]", "")
    //     .replaceAll('"', "")}`
    // );
  }, []);
  useEffect(() => {
    console.log("profil->", profil);
  }, [profil]);
  useEffect(() => {
    console.log("files=>", files);
  }, [files]);

  // if (profil == undefined) return <h1>Loading ...</h1>;
  return (
    <div className="relative z-0">
      <div
        className={
          "z-10 bg-slate-100 absolute  top-0 left-0 right-0 bottom-0 flex flex-col p-5 " +
          (files !== undefined ? "" : "hidden")
        }
      >
        <h1 className="text-lg text-center w-full font-bold my-4">
          File Akan di Upload
        </h1>

        <label className="text-red-500 my-3">
          Semua File ini akan memiliki Titel dan Deskripsi yang sama{" "}
        </label>
        <label className="-mb-1 text-sm text-lime-600">Titel</label>
        <input
          type="text"
          // ref={nosamwRef}
          className="p-1 border-[1px] border-lime-600 rounded-lg"
          placeholder="di isi Titel"
          value={titel}
          onChange={(e) => {
            setTitel(e.target.value);
            let tmp = files;
            tmp?.forEach((item) => {
              item.title = e.target.value;
            });
            console.log(e.target.value);
          }}
        />
        <label className="-mb-1 text-sm text-lime-600">Deskripsi</label>
        <textarea
          // ref={nosamwRef}
          className="p-1 border-[1px] border-lime-600 rounded-lg"
          placeholder="di isi Deskripsi"
          value={deskripsi}
          onChange={(e) => {
            setDeskripsi(e.target.value);
            let tmp = files;
            tmp?.forEach((item) => {
              item.description = e.target.value;
            });
            console.log(e.target.value);
          }}
        />
        <div className="flex flex-row my-2">
          {files !== undefined && files[0].public == 1 ? "PUBLIC " : "PRIVATE "}
          <Switch
            checked={sw}
            onClick={() => {
              console.log(
                "klik",
                files !== undefined && files?.length > 0,
                files !== undefined && files[0].public == 1 ? 0 : 1
              );
              let tmp = files;
              if (files !== undefined && files?.length > 0) {
                const pub = files !== undefined && files[0].public == 1 ? 0 : 1;
                tmp?.forEach((item) => {
                  item.public = pub;
                });
                setSw(pub == 1 ? true : false);
              }
              console.log("tmp->", tmp);
              if (tmp !== undefined) {
                // setFiles(tmp);
                // setFiles(undefined);
                setFiles(tmp);
              }
            }}
          />
          <label>
            {files !== undefined && files[0].public == 1
              ? "SEMUA " +
                ((files[0].jabatan !== "" ? " " + files[0].jabatan : "") +
                  (files[0].nama_unit !== ""
                    ? " SUB " + files[0].nama_unit
                    : "") +
                  (files[0].nama_bagian !== ""
                    ? " BAGIAN " + files[0].nama_bagian
                    : ""))
              : "TIDAK ADA KECUALI ANDA"}
            {" YANG BISA LIHAT FILE"}
          </label>
        </div>
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 flex  flex-col pr-3 md:pr-0">
            <div>
              <label className="-mb-1 text-sm text-lime-600">Unit Kerja</label>
            </div>
            <select
              className="p-1 border-[1px] border-lime-600 rounded-lg"
              defaultValue={""}
              value={unitKerja}
              onKeyDown={() => {}}
              onChange={(e) => {
                console.log(e.target.value);
                let tmp = files;
                if (files !== undefined && files?.length > 0) {
                  setunitKerja(e.target.value);
                  tmp?.forEach((item) => {
                    item.nama_unit = e.target.value;
                  });
                  console.log("TMP->", tmp);
                  setFiles(undefined);
                  if (tmp !== undefined) {
                    setFiles(tmp);
                  }
                }

                // setPersonalia((old: any) => {
                //   return { ...old, unit_kerja: e.target.value };
                // });
              }}
            >
              <option value={""}>Kosong</option>
              {helper.unitKerja.map((item, key) => {
                return (
                  <option
                    key={key}
                    value={item.nama_unit}
                    // selected={
                    //   personalia.unit_kerja == item.nama_unit ? true : false
                    // }
                  >
                    {item.nama_unit}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex-1 flex flex-col pr-3 md:pr-0">
            <div>
              <label className="-mb-1 text-sm text-lime-600">Jabatan</label>
            </div>
            <select
              className="p-1 border-[1px] border-lime-600 rounded-lg"
              defaultValue={""}
              value={jabatan}
              onChange={(e) => {
                let tmp = files;
                setJabatan(e.target.value);
                if (files !== undefined && files?.length > 0) {
                  tmp?.forEach((item) => {
                    item.jabatan = e.target.value;
                  });
                }
                console.log("TMP->", tmp);
                // setFiles(undefined);
                setFiles(tmp);
              }}
            >
              <option value={""}>Kosong</option>
              {helper.jabatan.map((item, key) => {
                return (
                  <option
                    key={key}
                    value={item.jabatan}
                    // selected={
                    //   personalia.jabatan == item.jabatan ? true : false
                    // }
                  >
                    {item.jabatan}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex-1 flex flex-col pr-3 md:pr-0">
            <div>
              <label className="-mb-1 text-sm text-lime-600">
                Bagian / Bidang
              </label>
            </div>
            <select
              className="p-1 border-[1px] border-lime-600 rounded-lg"
              defaultValue={""}
              value={bagian}
              onChange={(e) => {
                setbagian(e.target.value);
                let tmp = files;
                if (files !== undefined && files?.length > 0) {
                  tmp?.forEach((item) => {
                    item.nama_bagian = e.target.value;
                  });
                }
                console.log("TMP->", tmp);
                // setFiles(undefined);
                setFiles(tmp);
              }}
            >
              <option value={""}>Kosong</option>
              {helper.bagian.map((item, key) => {
                return (
                  <option
                    key={key}
                    value={item.nama_bagian}
                    // selected={
                    //   personalia.bagian == item.nama_bagian ? true : false
                    // }
                  >
                    {item.nama_bagian}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="flex flex-row justify-center gap-5">
          <button
            className="bg-lime-600 p-2 text-white font-bold px-3 rounded-lg max-w-[200px] self-center my-3"
            type="button"
            onClick={async () => {
              if (files !== undefined) {
                setWait(true);

                const formdata = new FormData();
                const tmpFiles: filesT[] = JSON.parse(JSON.stringify(files));
                files.forEach((item) => {
                  if (item.file !== undefined) {
                    formdata.append("files", item.file);
                  }
                });
                tmpFiles.forEach((item) => {
                  item.file = undefined;
                });
                // setWait(false);
                // console.log("files->", files, tmpFiles);
                // return;
                formdata.append("dataProperties", JSON.stringify(tmpFiles));
                const config: AxiosRequestConfig = {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                  onUploadProgress: (event: any) => {
                    const progress = Math.round(
                      (event.loaded * 100) / event.total
                    );
                    // setPercent(Math.floor(progress / 10) * 10);
                    console.log(
                      `Current progress:`,
                      progress,
                      Math.floor(progress / 10) * 10
                    );
                    // setPercent(((event.loaded * 100) % 10) * 10);
                  },
                };
                try {
                  const response = await axios.post(
                    "/api/files/upload/all",
                    formdata,
                    config
                  );
                  if (response.data.message == "Ok") {
                    toast({
                      duration: 3000,
                      className: "bg-green-500 text-slate-50",
                      title: "Penyimpanan Foto Profil ",
                      description: "File Berhasil di Upload",
                    });
                    setFiles(undefined);
                    setTitel("");
                    setDeskripsi("");
                    setunitKerja("");
                    setJabatan("");
                    setbagian("");
                    setParam("|");
                  }
                  if (response.data.message == "Error") {
                    toast({
                      duration: 3000,
                      className: "bg-red-500 text-slate-50",
                      title: "Penyimpanan Foto Profil ",
                      description: "File Gagal Di Upload karena tidak Support",
                    });
                    setFiles(undefined);
                    setTitel("");
                    setDeskripsi("");
                    setunitKerja("");
                    setJabatan("");
                    setbagian("");
                    setParam("|");
                  }
                  console.log("response->", response);
                } catch (error) {
                  console.log("err->", error);
                }

                setWait(false);
                return;
                console.log("tmpFiles->", tmpFiles);
                //console.log("formdata->", formdata.getAll("files").length);
                setWait(false);
              }
            }}
            // onClick={fetch_nosamw}
          >
            {load ? (
              <FontAwesomeIcon
                icon={faSpinner}
                fontSize={25}
                className="text-slate-200 animate-spin"
              />
            ) : (
              "Upload"
            )}{" "}
            <FontAwesomeIcon
              icon={faArrowUp}
              fontSize={20}
              className="text-slate-200"
            />
          </button>
          <button
            className="bg-slate-200 p-2 text-black font-bold px-3 rounded-lg max-w-[200px] self-center my-3"
            type="button"
            onClick={() => {
              setFiles(undefined);
              setJabatan("");
              setunitKerja("");
              setSw(false);
              setbagian("");
            }}
            // onClick={fetch_nosamw}
          >
            Batal
          </button>
        </div>

        <div className="flex flex-row flex-wrap">
          {files?.map((item, index) => {
            return (
              <div
                key={index}
                className="w-40 h-48 bg-slate-100 border-[1px] border-dotted  rounded-tr-[70px] flex justify-center items-center cursor-pointer relative z-0"
              >
                {item !== undefined &&
                  item.blobString &&
                  item.type == "application/pdf" && (
                    <ThumbnailPdf fileUrl={item.blobString as string} />
                  )}
                {item !== undefined &&
                  item.blobString &&
                  (item.type == "application/vnd.ms-excel" ||
                    item.type ==
                      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                    item.type == "application/msword" ||
                    item.type ==
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document") && (
                    <ThumbnailDocExcel fileUrl={item.blobString as string} />
                  )}
                {item !== undefined &&
                  item.blobString &&
                  (item.type == "image/jpeg" ||
                    item.type == "image/jpg" ||
                    item.type == "image/png") && (
                    <Image
                      src={item.blobString as string}
                      alt={"foto personalia " + item.title}
                      fill={true}
                      objectFit="cover"
                    />
                  )}
                {item.type == "image/jpeg" || item.type == "image/png" ? (
                  <FontAwesomeIcon
                    icon={faFileImage}
                    className="text-[30px] w-[35px] text-green-500 absolute left-0 bottom-0"
                  />
                ) : item.type == "application/pdf" ? (
                  <FontAwesomeIcon
                    icon={faFilePdf}
                    className="text-[30px] w-[35px] text-lime-600 absolute left-0 bottom-0"
                  />
                ) : item.type ==
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                  item.type == "application/msword" ? (
                  <FontAwesomeIcon
                    icon={faFileWord}
                    className="text-[30px] w-[35px] text-lime-600 absolute left-0 bottom-0"
                  />
                ) : item.type ==
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                  item.type == "application/vnd.ms-excel" ? (
                  <FontAwesomeIcon
                    icon={faFileExcel}
                    className="text-[30px] w-[35px] text-green-500 absolute left-0 bottom-0"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faX}
                    className="text-[30px] w-[35px] text-red-600 absolute left-0 bottom-0"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className={profil == undefined ? "" : "hidden"}>
        <h1>Loading ...</h1>
      </div>
      <div className={profil == undefined ? "hidden" : ""}>
        <h1 className="font-bold text-xl text-center">
          Tirta Alam Bank Data / dokumEn (
          <span className="text-lime-600 font-extrabold">TABE</span>)
        </h1>
        <div
          // hover:bg-white hover:absolute hover:top-0 hover:z-20 hover:left-0 hover:h-[90vh]
          className={
            "w-full  border-[5px] border-slate-200 rounded-xl flex flex-col justify-center items-center space-y-2 " +
            (fileEnter ? "h-[90vh]" : "h-[200px]")
          }
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setFileEnter(true);
            // console.log("xxx");
          }}
          onDragLeave={(e) => {
            setFileEnter(false);
          }}
          onDragEnd={(e) => {
            e.preventDefault();
            setFileEnter(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setFileEnter(false);
            if (profil !== undefined) {
              let tmpFiles: filesT[] = [];
              // console.log(e.dataTransfer.items);
              setJabatan(profil?.jabatan);
              setunitKerja(profil?.unit_kerja);
              setbagian(profil?.bagian);
              if (e.dataTransfer.items) {
                // @ts-ignore
                [...e.dataTransfer.items].forEach((item, i) => {
                  const file: File = item.getAsFile();
                  const allow = allowedFileTypes.includes(item.type);
                  if (!allow) {
                    alert(
                      `File ${file.name} Tidak di Dukung, Sehingga tidak bisa di Upload !`
                    );

                    return;
                  }
                  const aType = file.type.split("/");
                  const aliasName = `${nowTrimDateTime()}-${file.name.replace(
                    /[^A-Z0-9]+/gi,
                    "-"
                  )}-${profil.uname}.${aType[1]}`;
                  // console.log("file->", file);
                  // return;
                  tmpFiles.push({
                    nama_file: file.name,
                    path: `files/${profil.uname}/${aliasName}`,
                    public: 0,
                    id_jabatan: 0,
                    jabatan: profil?.jabatan,
                    id_bagian: 0,
                    nama_bagian: profil.bagian,
                    id_unit: 0,
                    nama_unit: profil.unit_kerja,
                    owner_id_personalia: 0,
                    nama_personalia: profil.nama,
                    owner_id_user: 0,
                    username: profil.uname as string,
                    width: file.size,
                    height: 0,
                    alias: aliasName,
                    type: file.type as any,
                    file: file,
                    blobString: URL.createObjectURL(file),
                  });
                  // console.log(`items file[${i}].name = ${file?.name}`);
                });
                if (tmpFiles.length > 0) {
                  setFiles(tmpFiles);
                }
              }
            }
          }}
        >
          <span className="text-center text-slate-300">
            Upload File/Dokumen
          </span>
          <FontAwesomeIcon
            icon={faFile}
            className="text-[30px] w-[35px] text-slate-300 "
          />
          <input
            type="file"
            className="hidden"
            accept={`${JSON.stringify(allowedFileTypes)
              .replaceAll("[", "")
              .replaceAll("]", "")
              .replaceAll('"', "")}`}
            multiple
            ref={fileRef}
            onChange={(e) => {
              if (profil !== undefined) {
                // console.log(e.target.files);
                if (e.target.files !== undefined) {
                  if (e.target.files?.length) {
                    // console.log("files->", e.target.files);
                    let tmpAll: fileT[] = [];
                    let tmpFiles: filesT[] = [];
                    setJabatan(profil?.jabatan);
                    setunitKerja(profil?.unit_kerja);
                    setbagian(profil?.bagian);
                    let error = false;
                    for (let i = 0; i < e.target.files.length; i++) {
                      const item = e.target.files[i];

                      const allow = allowedFileTypes.includes(item.type);
                      // alert(`${item.type} + ${allow}`);
                      if (!allow) {
                        alert(
                          `File ${item.name} Tidak di Dukung, Sehingga tidak bisa di Upload !`
                        );
                        error = true;
                        break;
                      }
                    }
                    if (error) return;
                    for (let i = 0; i < e.target.files.length; i++) {
                      const item = e.target.files[i];
                      // console.log("item file->", item);
                      // tmpAll.push({
                      //   lastModified: item.lastModified,
                      //   name: item.name,
                      //   blobString: URL.createObjectURL(item),
                      //   size: item.size,
                      //   type: item.type,
                      // });
                      const aType = item.type.split("/");
                      const aliasName = `${nowTrimDateTime()}-${item.name.replace(
                        /[^A-Z0-9]+/gi,
                        "-"
                      )}-${profil.uname}.${aType[1]}`;
                      tmpFiles.push({
                        nama_file: item.name,
                        path: `files/${profil.uname}/${aliasName}`,
                        public: 0,
                        id_jabatan: 0,
                        jabatan: profil?.jabatan,
                        id_bagian: 0,
                        nama_bagian: profil.bagian,
                        id_unit: 0,
                        nama_unit: profil.unit_kerja,
                        owner_id_personalia: 0,
                        nama_personalia: profil.nama,
                        owner_id_user: 0,
                        username: profil.uname as string,
                        width: item.size,
                        height: 0,
                        alias: aliasName,
                        type: item.type as any,
                        file: item,
                        blobString: URL.createObjectURL(item),
                      });
                    }
                    setFiles(tmpFiles);
                    // console.log("files array->", tmpAll);
                    // console.log("filess->", tmpFiles);
                    // let tmp: fileT = e.target.files[0];
                    // tmp.blobString = URL.createObjectURL(e.target?.files[0]);
                    // // console.log(URL.createObjectURL(e.target?.files[0]));
                    // setFile(tmp);
                  }
                }
              } else {
                alert("Gagal Memuat Profil !");
              }
            }}
          />
        </div>

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
            placeholder="Cari Apa ..."
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead></TableHead>
              <TableHead>Nama File/ Dokumen</TableHead>
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
            {data?.map((item, index) => {
              return (
                <TableRow key={index} ref={loadMoreCallback}>
                  <TableCell>
                    <div className="flex flex-col">
                      <Link
                        href={`/api/docview${item.path}`}
                        className="bg-lime-600 text-slate-50 py-3 rounded-xl font-bold text-center"
                      >
                        Lihat File
                      </Link>
                      {item.protected == 0 &&
                        item.username == profil?.uname && (
                          <AlertDialog>
                            <AlertDialogTrigger className="bg-red-600 mt-3 p-2  rounded-lg text-slate-50 max-h-12">
                              Hapus <FontAwesomeIcon icon={faTrash} />
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogTitle>
                                Apakah Anda Yakin ?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Akan menghapus Data & FIle{" "}
                                <span className="text-orange-500">
                                  {item.alias}
                                </span>
                              </AlertDialogDescription>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                    fetch(`/api/files/del/${item.id}`, {
                                      method: "GET",
                                      headers: {
                                        "Content-Type": "application/json",
                                      },
                                    })
                                      .then((res) => res.json())
                                      .then((res) => {
                                        console.log("res->", res);
                                        if (res.message == "Ok") {
                                          toast({
                                            duration: 3000,
                                            className:
                                              "bg-green-500 text-slate-50",
                                            title: "Penghapusan File/ Dokumen",
                                            description:
                                              "File/ Dokumen Berhasil di Hapus",
                                          });
                                          setParam("|");
                                        }
                                      })
                                      .catch((err) =>
                                        console.log("err->", err)
                                      );
                                  }}
                                >
                                  Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-40 h-48 bg-slate-100 border-[1px] border-dotted  rounded-tr-[70px] flex justify-center items-center cursor-pointer relative z-0">
                      {item.path !== undefined &&
                        item.path !== null &&
                        typeof item.path == "string" &&
                        item.path !== "" &&
                        item.type == "application/pdf" && (
                          <ThumbnailPdf fileUrl={`/api/document${item.path}`} />
                        )}
                      {item.path !== undefined &&
                        item.path !== null &&
                        typeof item.path == "string" &&
                        item.path !== "" &&
                        (item.type == "application/msword" ||
                          item.type ==
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                          item.type == "application/vnd.ms-excel" ||
                          item.type ==
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") && (
                          <ThumbnailDocExcel
                            fileUrl={`/api/docexcel${item.path}`}
                          />
                        )}
                      {typeof item.path == "string" &&
                        item.path !== "" &&
                        (item.type == "image/jpeg" ||
                          item.type == "image/jpg" ||
                          item.type == "image/png") && (
                          <Image
                            src={
                              process.env.MAIN_URL + "/api/image" + item.path
                            }
                            alt={"foto personalia " + item.title}
                            fill={true}
                            objectFit="cover"
                          />
                        )}
                      {item.type == "image/jpeg" || item.type == "image/png" ? (
                        <FontAwesomeIcon
                          icon={faFileImage}
                          className="text-[30px] w-[35px] text-green-500 absolute left-0 bottom-0"
                        />
                      ) : item.type == "application/pdf" ? (
                        <FontAwesomeIcon
                          icon={faFilePdf}
                          className="text-[30px] w-[35px] text-lime-600 absolute left-0 bottom-0"
                        />
                      ) : item.type ==
                          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                        item.type == "application/msword" ? (
                        <FontAwesomeIcon
                          icon={faFileWord}
                          className="text-[30px] w-[35px] text-lime-600 absolute left-0 bottom-0"
                        />
                      ) : item.type ==
                          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                        item.type == "application/vnd.ms-excel" ? (
                        <FontAwesomeIcon
                          icon={faFileExcel}
                          className="text-[30px] w-[35px] text-green-500 absolute left-0 bottom-0"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faX}
                          className="text-[30px] w-[35px] text-red-600 absolute left-0 bottom-0"
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.title !== undefined &&
                      item.title !== "" &&
                      item.title !== null && (
                        <div className="flex flex-col">
                          <div>
                            <TableCell>Judul</TableCell>
                            <TableCell>:</TableCell>
                            <TableCell>{item.title}</TableCell>
                          </div>
                        </div>
                      )}
                    {item.description !== undefined &&
                      item.description !== "" &&
                      item.description !== null && (
                        <div className="flex flex-col">
                          <div>
                            <TableCell></TableCell>
                            <TableCell>:</TableCell>
                            <TableCell>{item.description}</TableCell>
                          </div>
                        </div>
                      )}
                    <div className="flex flex-col space-y-1">
                      <div className="flex flex-row">
                        <span className="min-w-[100px]">Nama File</span>
                        <span className="mr-2">:</span>
                        <span>{item.alias}</span>
                      </div>
                      <div className="flex flex-row">
                        <span className="min-w-[100px]">Di Upload</span>
                        <span className="mr-2">:</span>
                        <span>{item.updated_at}</span>
                      </div>
                      <div className="flex flex-row">
                        <span className="min-w-[100px]">Bisa Di lihat</span>
                        <span className="mr-2">:</span>
                        <span>
                          {item.public == 0
                            ? "PRIBADI "
                            : "SEMUA ORANG " +
                              (item.nama_bagian == null
                                ? ""
                                : item.nama_bagian) +
                              " " +
                              (item.jabatan == null ? "" : item.jabatan) +
                              " " +
                              (item.nama_unit == null ? "" : item.nama_unit)}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
