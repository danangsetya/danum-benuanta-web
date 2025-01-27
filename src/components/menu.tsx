"use client";

import { selectMenu, toggle } from "@/redux/features/menuStatusSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  faAddressCard,
  faAngleRight,
  faAngleUp,
  faArrowUp,
  faBook,
  faBroadcastTower,
  faCheck,
  faClipboard,
  faCrosshairs,
  faDotCircle,
  faFileInvoice,
  faFileInvoiceDollar,
  faGear,
  faGlobe,
  faHome,
  faMoneyBill,
  faMoneyBillWave,
  faPaperPlane,
  faTruckFast,
  faUser,
  faUsers,
  faWater,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { useEffect, useLayoutEffect, useState } from "react";
import { permissionT, profilT } from "@/lib/types";
import { getSession } from "next-auth/react";
import React from "react";
import Image from "next/image";
export default function MenuLeft() {
  const router = useRouter();
  const path = usePathname();
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
    console.log("permission->", permission);
  }, [permission]);
  // useEffect(() => {
  //   console.log("profil->", profil);
  // }, [profil]);
  // if (path == "/login") return null;
  // const menuStatus = useAppSelector(selectMenu);
  const menuStatus = useAppSelector((state) => {
    console.log("state->", state);
    return state.menuStateReducer.value;
  });
  // const fuck = useSelector((state: unknown) => state.menuStateReducer.value);
  // const tes = useSelector:TypedUseSelectorHook<RootState>((state) => state.menuStateReducer.value);
  // return <h1>menu</h1>;
  if (path == "/login") return null;
  // console.log(menuStatus);
  if (menuStatus == 2) {
    return (
      <section
        className={
          (menuStatus == 2
            ? "w-full md:w-[200px]"
            : menuStatus == 1
            ? "w-full md:w-[50px]"
            : "hidden") +
          " bg-lime-700  rounded-t-3xl md:rounded-none fixed bottom-0 md:relative h-3/4 md:min-h-[100vh] flex flex-col border-t-4 border-yellow-400 md:border-none cursor-pointer z-50"
          // +
          // " bg-lime-700 fixed  h-3/4 md:min-h-[100vh] flex flex-col"
        }
      >
        <div className="text-center my-2 font-bold text-slate-50">Menu</div>
        <div
          className="flex flex-row p-1 space-x-2 items-center hover:bg-lime-600"
          onClick={() => {
            router.push("/");
          }}
        >
          <FontAwesomeIcon
            icon={faHome}
            className="text-[30px] w-[35px] text-slate-50"
          />
          <span className="text-white font-semibold">Home</span>
        </div>

        {permission?.map((item, index) => {
          if (item.name === "user/profil") {
            return (
              <div
                key={index}
                className="flex flex-row p-1 space-x-2 items-center hover:bg-lime-600"
                onClick={() => {
                  router.push("/profil");
                }}
              >
                <FontAwesomeIcon
                  icon={faAddressCard}
                  className="text-[30px] w-[35px] text-slate-50"
                />
                <span className="text-white font-semibold">Profil</span>
              </div>
            );
          }
          if (item.name === "kepegawaian") {
            return (
              <div key={index}>
                <div
                  className="flex flex-row p-1 space-x-2 items-center hover:bg-lime-600"
                  onClick={() => {
                    router.push("/absensi");
                  }}
                >
                  <FontAwesomeIcon
                    icon={faClipboard}
                    className="text-[30px] w-[35px] text-slate-50"
                  />
                  <span className="text-white font-semibold">Absensi</span>
                </div>
                <div
                  className="flex flex-row p-1 space-x-2 items-center hover:bg-lime-600"
                  onClick={() => {
                    router.push("/pengguna");
                  }}
                >
                  <FontAwesomeIcon
                    icon={faUsers}
                    className="text-[30px] w-[35px] text-slate-50"
                  />
                  <span className="text-white font-semibold">Kepegawaian</span>
                </div>
              </div>
            );
          }

          if (
            item.name === "admin/pengaturan" ||
            item.name === "kepegawaian/pengaturan"
          ) {
            return (
              <div key={index}>
                <Accordion type="single" key={index} collapsible>
                  <AccordionItem value="item-1" className="border-0">
                    <AccordionTrigger className="flex flex-row p-1    hover:bg-lime-600 text-slate-50 ">
                      <FontAwesomeIcon
                        icon={faGear}
                        className="text-[30px] w-[35px] text-slate-50 "
                      />
                      <span className="text-white font-semibold flex-1  text-left ml-2">
                        Pengaturan
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <Accordion type="single" collapsible>
                        <AccordionItem value="item-1" className="border-0">
                          <AccordionTrigger className="flex-row text-slate-50 p-1">
                            <FontAwesomeIcon
                              icon={faUser}
                              className="text-[30px] w-[35px] text-slate-50"
                            />
                            <span className="text-left text-white font-semibold flex-1 ml-3">
                              Pengguna
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="flex-col">
                            {item.name === "admin/pengaturan" && (
                              <div
                                className="flex flex-row bg-lime-600 bg-gradient-to-b from-lime-600 to-lime-700 py-2"
                                onClick={() => {
                                  router.push("/pengaturan/pengguna/level");
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faAngleRight}
                                  className="text-[20px] w-[35px] text-sky-500"
                                />
                                <div className="text-left text-white font-semibold flex-1 ml-5">
                                  Level
                                </div>
                              </div>
                            )}
                            {item.name === "admin/pengaturan" && (
                              <div
                                className="flex flex-row bg-lime-600 bg-gradient-to-b from-lime-600 to-lime-700 py-2"
                                onClick={() => {
                                  router.push("/pengaturan/pengguna/akses");
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faAngleRight}
                                  className="text-[20px] w-[35px] text-sky-500 "
                                />
                                <div className="text-left text-white font-semibold flex-1 ml-5">
                                  Akses
                                </div>
                              </div>
                            )}
                            {(item.name === "admin/pengaturan" ||
                              item.name === "kepegawaian/pengaturan") && (
                              <div
                                className="flex flex-row bg-lime-600 bg-gradient-to-b from-lime-600 to-lime-700 py-2"
                                onClick={() => {
                                  router.push("/pengaturan/pengguna/hak");
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faAngleRight}
                                  className="text-[20px] w-[35px] text-sky-500 "
                                />
                                <div className="text-left text-white font-semibold flex-1 ml-5">
                                  Hak Pengguna
                                </div>
                              </div>
                            )}
                            {item.name == "admin/pengaturan" && (
                              <div
                                className="flex flex-row bg-lime-600 bg-gradient-to-b from-lime-600 to-lime-700 py-2"
                                onClick={() => {
                                  router.push("/pengaturan/pengguna/lokasi");
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faAngleRight}
                                  className="text-[20px] w-[35px] text-sky-500 "
                                />
                                <div className="text-left text-white font-semibold flex-1 ml-5">
                                  Lokasi Absen
                                </div>
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            );
          }
        })}
        {/* 
        <div
          className="flex flex-row p-1 space-x-2 items-center hover:bg-lime-600"
          onClick={() => {
            router.push("/tagihan");
          }}
        >
          <FontAwesomeIcon
            icon={faFileInvoiceDollar}
            className="text-[30px] w-[35px] text-slate-50"
          />
          <span className="text-white font-semibold">Tagihan</span>
        </div>
        
        
         */}
        {/* <div
          className="flex flex-row p-1 space-x-2 items-center hover:bg-lime-600"
          onClick={() => {
            router.push("/pengguna");
          }}
        >
          <FontAwesomeIcon
            icon={faGear}
            className="text-[30px] w-[35px] text-slate-50"
          />
          <span className="text-white font-semibold">Pengaturan</span>
        </div> */}
      </section>
    );
  }
  return (
    <section
      className={
        (menuStatus == 1 ? "w-full md:w-[50px]" : "hidden") +
        " bg-lime-700 rounded-t-3xl md:rounded-none shadow-lg fixed bottom-0 md:relative md:min-h-[100vh] flex flex-row flex-wrap space-x-3 md:space-x-0 md:flex-col items-center border-t-4 border-yellow-400 md:border-none"
      }
    >
      <div className="text-center text-sm my-2 text-slate-50 w-full">Menu</div>
      <div className="hover:bg-lime-600 w-[35px] md:w-full flex flex-row justify-center py-1  space-x-2 my-4 md:my-1">
        <FontAwesomeIcon
          icon={faAddressCard}
          className="text-[30px] text-slate-50"
        />
      </div>
      <div className="hover:bg-lime-600 w-[35px] md:w-full flex flex-row justify-center py-1  space-x-2 my-4 md:my-1">
        <FontAwesomeIcon
          icon={faFileInvoiceDollar}
          className="text-[30px] text-slate-50"
          onClick={() => {
            router.push("/tagihan");
          }}
        />
      </div>
      <div className="hover:bg-lime-600 w-[35px] md:w-full flex flex-row justify-center py-1  space-x-2 my-4 md:my-1">
        <FontAwesomeIcon
          icon={faPaperPlane}
          className="text-[30px] text-slate-50"
          onClick={() => {
            router.push("/pesan");
          }}
        />
      </div>
      <div className="hover:bg-lime-600 w-[35px] md:w-full flex flex-row justify-center py-1  space-x-2 my-4 md:my-1">
        <FontAwesomeIcon
          icon={faUsers}
          className="text-[30px] text-slate-50"
          onClick={() => {
            router.push("/pengguna");
          }}
        />
      </div>
    </section>
  );
}
export function MenuBottom() {
  const dispatch = useAppDispatch();

  return (
    <div
      className="fixed bottom-0 right-0 left-0 mx-auto z-50 h-5 w-[100px] bg-lime-600 rounded-t-full flex justify-center md:hidden"
      onClick={() => {
        dispatch(toggle());
      }}
    >
      <FontAwesomeIcon icon={faAngleUp} className=" text-slate-50 mt-1" />
    </div>
  );
}
