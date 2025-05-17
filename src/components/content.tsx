"use client";

import { toggle } from "@/redux/features/menuStatusSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Link from "next/link";
import { getSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { getToken } from "next-auth/jwt";
import { permissionT } from "@/lib/types";

export default function ContentDefault() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const menuStatus = useAppSelector((state) => state.menuStateReducer.value);

  return (
    <>
      <nav className="flex flex-row items-center  shadow-lg w-full  bg-white z-50 ">
        <div
          onClick={() => dispatch(toggle())}
          className=" w-10 h-10 flex flex-col justify-center items-center space-y-1 relative"
        >
          {menuStatus == 1 ? (
            <>
              <div className="h-1 w-6 bg-green-600"></div>
              <div className="h-1 w-6 bg-green-600"></div>
              <div className="h-1 w-6 bg-green-600"></div>
            </>
          ) : menuStatus == 2 ? (
            <>
              <div className="h-1 w-6 top-5 absolute bg-green-600 rotate-45"></div>
              <div className="h-1 w-6 absolute bg-green-600 -rotate-45 "></div>
            </>
          ) : (
            <>
              <div className="flex flex-row ">
                <div className="h-1 w-1 bg-green-600"></div>
                <div className="h-1 w-4 bg-green-600 ml-1"></div>
              </div>
              <div className="flex flex-row ">
                <div className="h-1 w-1 bg-green-600"></div>
                <div className="h-1 w-4 bg-green-600 ml-1"></div>
              </div>
              <div className="flex flex-row ">
                <div className="h-1 w-1 bg-green-600"></div>
                <div className="h-1 w-4 bg-green-600 ml-1"></div>
              </div>
            </>
          )}
        </div>
        {/* <input
          className="hidden md:block border-2 border-slate-300 my-1 rounded-md p-1 text-lime-700"
          type="text"
          placeholder="Ku Mencari Sesuatu yang tak Pasti"
        /> */}
        <h1
          className={
            "text-lime-700 text-[2rem] flex-1 text-center md:text-left  md:text-lg font-bold mx-2"
          }
        >
          <span className="hidden sm:block">
            DANUM BENUANTA
            <span className="font-thin text-lime-700 text-[10px] align-super">
              1.0.0
            </span>
          </span>
        </h1>

        <Popover>
          <PopoverTrigger className="w-10 h-10 rounded-full  from-lime-700 to-yellow-400  bg-gradient-to-tl  border-2 border-slate-300 mr-3 hover:rotate-45"></PopoverTrigger>
          <PopoverContent className="w-[200px] bg-green-600 flex flex-col space-y-1 text-white font-semibold text-right">
            <Link
              href="/profil"
              className="w-full hover:bg-lime-600 p-1 rounded-lg"
            >
              Profil
            </Link>
            <button
              onClick={async () => {
                const res = await signOut({ callbackUrl: "/login" });
                // console.log(res);
              }}
              className="w-full hover:bg-lime-600 p-1 rounded-lg text-right"
            >
              Keluar
            </button>
          </PopoverContent>
        </Popover>
        {/* <div className="hidden flex-1"></div> */}
      </nav>
    </>
  );
}
