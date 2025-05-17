import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { prisma } from "./prisma";
import { helperType, permissionT } from "./types";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { LegacyRef } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function numToTimePlain(num: string) {
  let add = 0;
  const s = num.slice(-2);
  let m = num.substring(num.length - 4, num.length - 2);
  const mI = parseInt(m);
  if (mI > 60) {
    m = (mI - 60).toString().padStart(2, "0");
    add = 1;
  } else if (mI == 60) {
    m = "00";
  } else {
    m = mI.toString().padStart(2, "0");
  }
  let h = "";
  if (num.length > 4) {
    h = num.substring(0, num.length - 4);
    if (add > 0) {
      const t = parseInt(h) + add;
      h = t.toString();
    }
  } else {
    if (add > 0) {
      const t = add;
      h = t.toString();
    } else {
      h = "00";
    }
  }

  return h + ":" + m;
}

export const httpStatus = {
  Ok: 200,
  Accepted: 202,
  MovePermanently: 301,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  InternalServerError: 500,
  BadGateway: 503,
};
const date = new Date();
export const now = `${date.getFullYear()}-${(date.getMonth() + 1)
  .toString()
  .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
export const nowTrim = `${date.getFullYear()}${(date.getMonth() + 1)
  .toString()
  .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`;
export const nowTrimDateTime = () => {
  const date = new Date();
  return `${date.getFullYear()}${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}${date
    .getHours()
    .toString()}${date.getMinutes().toString()}${date.getSeconds().toString()}`;
};
export const nowTrimDateTimeH = () => {
  const date = new Date();
  return `${date.getFullYear()}${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}${date
    .getHours()
    .toString()
    .padStart(2, "0")}`;
};
export const nowTrimDateTimeHM = () => {
  const date = new Date();
  return `${date.getFullYear()}${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}${date
    .getHours()
    .toString()
    .padStart(2, "0")}${date.getMinutes().toString().padStart(2, "0")}`;
};
export const shortDate = (dt: string) => {
  const date = new Date(dt);
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
};
export function isKadaluarsa(
  tglSekarang: Date,
  tglAwal: Date,
  tglAkhir: Date
): boolean {
  // console.log(
  //   tglAwal + " <= " + tglSekarang + " = " + (tglAwal <= tglSekarang)
  // );
  return !(tglAwal <= tglSekarang && tglSekarang <= tglAkhir);
}

export const SERVER_PHP = "https://pde.tirtaalamtarakan.co.id/v2";
export function hari(n: number) {
  switch (n) {
    case 0:
      return "Minggu";
      break;
    case 1:
      return "Senin";
      break;
    case 2:
      return "Selasa";
      break;
    case 3:
      return "Rabu";
      break;
    case 4:
      return "Kamis";
      break;
    case 5:
      return "Jumat";
      break;
    case 6:
      return "Sabtu";
      break;

    default:
      break;
  }
}
export function validateEmail(mail: string) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  }
  // alert("You have entered an invalid email address!");
  return false;
}
export function toJson(d: any) {
  return JSON.parse(
    JSON.stringify(d, (_, v) => (typeof v === "bigint" ? v.toString() : v))
  );
}

export const allowedFileTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];
export const dateLine = () => {
  const tgl = new Date();
  const dateLine = `${tgl.getFullYear()}${(tgl.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${tgl
    .getDate()
    .toString()
    .padStart(
      2,
      "0"
    )}${tgl.getHours()}${tgl.getMinutes()}${tgl.getMilliseconds()}`;
  return dateLine;
};
