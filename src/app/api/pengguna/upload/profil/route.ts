import { prisma } from "@/lib/prisma";
import { personalia } from "./../../../../../../prisma/generated/client1/index.d";
import { authOptions } from "@/lib/auth";
import { httpStatus, toJson } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Jimp from "jimp";
import { mkdir, stat, writeFile } from "fs/promises";
import { personaliaType } from "@/lib/types";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: httpStatus.Unauthorized }
    );
  const allowedFileTypes = ["image/png", "image/jpeg"];
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;
  const personalia: personaliaType =
    typeof toJson(data.get("personalia") as string) == "string"
      ? JSON.parse(toJson(data.get("personalia") as string))
      : toJson(data.get("personalia") as string);
  const tgl = new Date();
  const pathNoContent = `${tgl.getFullYear()}${(tgl.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${tgl
    .getDate()
    .toString()
    .padStart(
      2,
      "0"
    )}${tgl.getHours()}${tgl.getMinutes()}${tgl.getMilliseconds()}`;
  // const dataJ = JSON.parse(session.user?.email as string);
  if (personalia) {
    const dataPersonalia = await prisma.personalia.findFirst({
      where: {
        id: personalia.id,
      },
    });
    const allowed = allowedFileTypes.filter((v) => v == file.type);
    if (!file || allowed.length == 0) {
      return NextResponse.json({ success: false });
    }
    if (dataPersonalia) {
      const pathwUsername = `files/${dataPersonalia.username}`;
      const path = `public/${pathwUsername}`;
      const aType = file.type.split("/");
      console.log("path", path);
      console.log("file->", file);
      const bytesR = await file.arrayBuffer();
      const bufferR = Buffer.from(bytesR);
      const pathFileR = `${path}/${pathNoContent}-profil-${dataPersonalia.username}.${aType[1]}`;
      const pathNoPublic = `${pathwUsername}`;
      console.log("realPath->", pathFileR);
      try {
        const statFolder = await stat(path);
      } catch (error) {
        try {
          console.log("tidak ada FOlder ,", path);
          await mkdir(path, { recursive: true });
        } catch (errorx) {
          console.log("error mkdir->", errorx);
        }
      }
      const controller = new AbortController();
      const dataFile = new Uint8Array(bufferR);
      await writeFile(pathFileR, dataFile);
      const dataJabatan = await prisma.jabatan.findFirst({
        where: {
          jabatan: dataPersonalia.jabatan,
        },
      });
      const dataBagian = await prisma.bagian.findFirst({
        where: {
          nama_bagian: dataPersonalia.bagian,
        },
      });
      const dataUnit = await prisma.unitkerja.findFirst({
        where: {
          nama_unit: dataPersonalia.unit_kerja,
        },
      });
      const dataUser = await prisma.users.findFirst({
        where: {
          id_personalia: dataPersonalia.id,
        },
      });
      let error = false;
      let width: number;
      let height: number;
      let size = 0;
      try {
        const imgRead = await Jimp.read(pathFileR);
        console.log(imgRead);
        if (imgRead) {
          imgRead
            .resize(500, Jimp.AUTO)
            .write(
              `${path}/${pathNoContent}-profil-${dataPersonalia.username}-500x.${aType[1]}`
            );
          width = imgRead.bitmap.width;
          height = imgRead.bitmap.height;

          await prisma.files.create({
            data: {
              nama_file: `${pathNoContent}-profil-${dataPersonalia.username}.${aType[1]}`,
              path: `/${pathNoPublic}/${pathNoContent}-profil-${dataPersonalia.username}.${aType[1]}`,
              public: 0,
              id_jabatan: dataJabatan?.id,
              jabatan: dataPersonalia.jabatan,
              id_bagian: dataBagian?.id,
              nama_bagian: dataPersonalia.bagian,
              id_unit: dataUnit?.id,
              nama_unit: dataPersonalia.unit_kerja,
              owner_id_personalia: dataPersonalia.id,
              nama_personalia: dataPersonalia.nama,
              owner_id_user: dataUser?.id,
              username: dataPersonalia.username,
              is_deleted: 0,
              width,
              height,
              alias: `${pathNoContent}-profil-${dataPersonalia.username}.${aType[1]}`,
              type: file.type,
            },
          });
          await prisma.files.create({
            data: {
              nama_file: `${pathNoContent}-profil-${dataPersonalia.username}-500x.${aType[1]}`,
              path: `/${pathNoPublic}/${pathNoContent}-profil-${dataPersonalia.username}-500x.${aType[1]}`,
              public: 0,
              id_jabatan: dataJabatan?.id,
              jabatan: dataPersonalia.jabatan,
              id_bagian: dataBagian?.id,
              nama_bagian: dataPersonalia.bagian,
              id_unit: dataUnit?.id,
              nama_unit: dataPersonalia.unit_kerja,
              owner_id_personalia: dataPersonalia.id,
              nama_personalia: dataPersonalia.nama,
              owner_id_user: dataUser?.id,
              username: dataPersonalia.username,
              is_deleted: 0,
              width: 500,
              height: 500,
              alias: `${pathNoContent}-profil-${dataPersonalia.username}.${aType[1]}`,
              type: file.type,
            },
          });

          await prisma.personalia.update({
            where: {
              id: dataPersonalia.id,
            },
            data: {
              profil_image: `${pathNoContent}-profil-${dataPersonalia.username}-500x.${aType[1]}`,
              data_profil_image: `/${pathNoPublic}/${pathNoContent}-profil-${dataPersonalia.username}-500x.${aType[1]}`,
            },
          });
          console.log("done file");
          //     return NextResponse.json({ message: "Ok" });
        }
        return NextResponse.json({ message: "Ok" });
      } catch (error) {
        console.log("error JIMP->", error);

        return NextResponse.json({
          message: "Error",
          detail: "File Terlalu Besear",
        });
      }

      // Jimp.read(pathFileR)
      //   .then((img) => {
      //     width = img.bitmap.width;
      //     height = img.bitmap.height;
      //     return img
      //       .resize(500, Jimp.AUTO)
      //       .write(
      //         `${path}/${pathNoContent}-profil-${dataPersonalia.username}-500x.${aType[1]}`
      //       );
      //   })
      //   .then(async () => {
      //     await prisma.files.create({
      //       data: {
      //         nama_file: `${pathNoContent}-profil-${dataPersonalia.username}.${aType[1]}`,
      //         path: `/${pathNoPublic}/${pathNoContent}-profil-${dataPersonalia.username}.${aType[1]}`,
      //         public: 0,
      //         id_jabatan: dataJabatan?.id,
      //         jabatan: dataPersonalia.jabatan,
      //         id_bagian: dataBagian?.id,
      //         nama_bagian: dataPersonalia.bagian,
      //         id_unit: dataUnit?.id,
      //         nama_unit: dataPersonalia.unit_kerja,
      //         owner_id_personalia: dataPersonalia.id,
      //         nama_personalia: dataPersonalia.nama,
      //         owner_id_user: dataUser?.id,
      //         username: dataPersonalia.username,
      //         is_deleted: 0,
      //         width,
      //         height,
      //         alias: `${pathNoContent}-profil-${dataPersonalia.username}.${aType[1]}`,
      //       },
      //     });
      //     await prisma.files.create({
      //       data: {
      //         nama_file: `${pathNoContent}-profil-${dataPersonalia.username}-500x.${aType[1]}`,
      //         path: `/${pathNoPublic}/${pathNoContent}-profil-${dataPersonalia.username}-500x.${aType[1]}`,
      //         public: 0,
      //         id_jabatan: dataJabatan?.id,
      //         jabatan: dataPersonalia.jabatan,
      //         id_bagian: dataBagian?.id,
      //         nama_bagian: dataPersonalia.bagian,
      //         id_unit: dataUnit?.id,
      //         nama_unit: dataPersonalia.unit_kerja,
      //         owner_id_personalia: dataPersonalia.id,
      //         nama_personalia: dataPersonalia.nama,
      //         owner_id_user: dataUser?.id,
      //         username: dataPersonalia.username,
      //         is_deleted: 0,
      //         width: 500,
      //         height: 500,
      //         alias: `${pathNoContent}-profil-${dataPersonalia.username}.${aType[1]}`,
      //       },
      //     });

      //     await prisma.personalia.update({
      //       where: {
      //         id: dataPersonalia.id,
      //       },
      //       data: {
      //         profil_image: `${pathNoContent}-profil-${dataPersonalia.username}-500x.${aType[1]}`,
      //         data_profil_image: `/${pathNoPublic}/${pathNoContent}-profil-${dataPersonalia.username}-500x.${aType[1]}`,
      //       },
      //     });
      //     console.log("done file");
      //     return NextResponse.json({ message: "Ok" });
      //   })
      //   .catch((err) => {
      //     console.log("Jimp Err->", err);
      //     error = true;
      //   })
      //   .finally(() => {
      //     return NextResponse.json({ message: "Ok2", error });
      //   });
    }
  }
  // console.log("dataPersonalia->", dataPersonalia);
  // console.log(dataJ);

  return NextResponse.json({ message: "End" });
}
