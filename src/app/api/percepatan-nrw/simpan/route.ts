import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { percepatanNrwType } from "@/lib/types";
import { httpStatus } from "@/lib/utils";
import { mkdir, stat, writeFile } from "fs/promises";
import Jimp from "jimp";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: httpStatus.Unauthorized }
    );
  const allowedFileTypes = ["image/png", "image/jpeg"];
  const data = await request.formData();
  const fileR: File | null = data.get("fileR") as unknown as File;
  const fileS: File | null = data.get("fileS") as unknown as File;
  const nosamw = data.get("nosamw");
  const nama = data.get("nama");
  const permasalahan = data.get("permasalahan");
  const tindak_lanjut = data.get("tindak_lanjut");
  const petugas = data.get("petugas");
  const telp = data.get("telp");
  const lat = data.get("lat");
  const lon = data.get("lon");
  const lat_rumah = data.get("lat_rumah");
  const lon_rumah = data.get("lon_rumah");
  const allowed = allowedFileTypes.filter((v) => v == fileR.type);
  console.log(
    "fileR->",
    fileR,
    "fileS->",
    fileS,
    "allowed->",
    allowed,
    "sessions->",
    session
    // "toJson",
    // permToJson,
    // "env->",
    // process.env.myUri
  );

  if (!fileR || allowed.length == 0) {
    return NextResponse.json({ success: false });
  }
  // fileR
  const bytesR = await fileR.arrayBuffer();
  const bufferR = Buffer.from(bytesR);

  const bytesS = await fileS.arrayBuffer();
  const bufferS = Buffer.from(bytesS);

  // // With the file data in the buffer, you can do whatever you want with it.
  // // For this, we'll just write it to the filesystem in a new location
  const tgl = new Date();
  const pathNoContent = `${tgl.getFullYear()}/${(tgl.getMonth() + 1)
    .toString()
    .padStart(2, "0")}`;
  const pathNoPublic = `content/${pathNoContent}`;
  const contentUri = `${process.env.myUri}${pathNoPublic}/${fileR.name}`;
  const path = `public/${pathNoPublic}`;
  // step FileR
  const pathFileR = `${path}/${fileR.name}`;
  try {
    const statFolder = await stat(path);
  } catch (error) {
    await mkdir(path, { recursive: true });
  }
  await writeFile(pathFileR, bufferR);
  const plainFilenameR = fileR.name.split(".")[0];
  const typeFileR = fileR.type.split("/")[1];
  // step FileS
  const pathFileS = `${path}/${fileS.name}`;
  await writeFile(pathFileS, bufferS);
  const plainFilenameS = fileS.name.split(".")[0];
  const typeFileS = fileS.type.split("/")[1];

  let width,
    height,
    size = 0;
  Jimp.read(pathFileR)
    .then((img) => {
      width = img.bitmap.width;
      height = img.bitmap.height;
      return img
        .resize(1080, Jimp.AUTO)
        .write(`${path}/${plainFilenameR}-1080x.${typeFileR}`);
    })
    .catch((err) => console.log("Jimp Err->", err));
  Jimp.read(pathFileS)
    .then((img) => {
      width = img.bitmap.width;
      height = img.bitmap.height;
      return img
        .resize(1080, Jimp.AUTO)
        .write(`${path}/${plainFilenameS}-1080x.${typeFileS}`);
    })
    .catch((err) => console.log("Jimp Err->", err));

  // Jimp.read(pathFile)
  //   .then((img) => {
  //     return img
  //       .resize(100, Jimp.AUTO)
  //       .write(`${path}/${plainFilename}-100x.${typeFile}`);
  //   })
  //   .catch((err) => console.log("Jimp Err->", err));
  // Jimp.read(pathFile)
  //   .then((img) => {
  //     return img
  //       .resize(300, Jimp.AUTO)
  //       .write(`${path}/${plainFilename}-300x.${typeFile}`);
  //   })
  //   .catch((err) => console.log("Jimp Err->", err));
  // Jimp.read(pathFile)
  //   .then((img) => {
  //     return img
  //       .resize(600, Jimp.AUTO)
  //       .write(`${path}/${plainFilename}-600x.${typeFile}`);
  //   })
  //   .catch((err) => console.log("Jimp Err->", err));
  const simpan = await prisma.percepatan_nrw.create({
    data: {
      nama: nama as string,
      nosamw: nosamw as string,
      permasalahan: permasalahan as string,
      telp: telp as string,
      foto_rumah_name: `${plainFilenameR}-1080x.${typeFileR}`,
      foto_rumah_path: `/${pathNoPublic}/${plainFilenameR}-1080x.${typeFileR}`,
      foto_sr_name: `${plainFilenameS}-1080x.${typeFileS}`,
      foto_sr_path: `/${pathNoPublic}/${plainFilenameS}-1080x.${typeFileS}`,
      lat: lat == null ? 0 : parseFloat(lat.toString()),
      lon: lon == null ? 0 : parseFloat(lon.toString()),
      lat_rumah: lat_rumah == null ? 0 : parseFloat(lat_rumah.toString()),
      lon_rumah: lon_rumah == null ? 0 : parseFloat(lon_rumah.toString()),
      username: session.user?.name,
      tindak_lanjut: tindak_lanjut as string,
      petugas: petugas as string,
    },
  });
  return NextResponse.json({ message: "Ok" });
  // if (!session)
  //   return NextResponse.json(
  //     { message: "Unauthorized" },
  //     { status: httpStatus.Unauthorized }
  //   );
  // const req: percepatanNrwType = await request.json();
  // if (req.nosamw !== "" && req.nama !== "") {
  //   const simpan = await prisma.percepatan_nrw.create({
  //     data: {
  //       nama: req.nama,
  //       permasalahan: req.permasalahan,
  //       telp: req.telp,
  //       nosamw: req.nosamw,
  //     },
  //   });
  //   return NextResponse.json({ message: "Ok" });
  // }
  return NextResponse.json({ message: "Not Ok" });
}
