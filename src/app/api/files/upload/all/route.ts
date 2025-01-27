import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { filesT, profilT } from "@/lib/types";
import { allowedFileTypes, dateLine, httpStatus, toJson } from "@/lib/utils";
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

  // console.log("session->", );
  const sessJson = JSON.parse(session.user?.email as string);
  const profil: profilT = sessJson.profil;
  // console.log("profil->", profil);
  const data = await request.formData();
  const dataI: filesT[] =
    typeof toJson(data.get("dataProperties") as string) == "string"
      ? JSON.parse(data.get("dataProperties") as string)
      : toJson(data.get("dataProperties"));
  const files = data.getAll("files");
  console.log("files->", files);
  let errorFiles: string[] = [];
  const yaaa = new Promise((resolve, reject) => {
    if (files.length > 0) {
      let ix = 0;
      files.forEach(async (x, index, array) => {
        const file: File = x as File;
        const pathwUsername = `files/${profil.uname}`;
        const path = `public/${pathwUsername}`;
        const pathNoPublic = `${pathwUsername}`;
        try {
          const statFolder = await stat(path);
        } catch (error) {
          await mkdir(path, { recursive: true });
        }
        // console.log(JSON.parse(JSON.stringify(file)));
        const allow = allowedFileTypes.includes(file.type);
        console.log("allow->", allow, file.type);
        if (!allow) {
          console.log("here error");
          errorFiles.push(file.name);
        } else {
          const findData = dataI.find((e: filesT) => e.nama_file == file.name);
          // console.log("found->", findData);
          if (findData) {
            if (findData.type == "application/pdf") {
              let newNameFile;
              const aType = file.type.split("/");
              ix++;
              if (findData.title !== undefined && findData.title !== "") {
                newNameFile = `${dateLine()}-${ix}-${findData.title.replace(
                  /[^A-Z0-9]+/gi,
                  "-"
                )}-${profil.uname}.${aType[1]}`;
              } else {
                newNameFile = `${dateLine()}-${ix}-${findData.nama_file.replace(
                  /[^A-Z0-9]+/gi,
                  "-"
                )}-${profil.uname}.${aType[1]}`;
              }
              const pathWFile = `${path}/${newNameFile}`;
              const byteF = await file.arrayBuffer();
              const bufferF = Buffer.from(byteF);
              const dataFile = new Uint8Array(bufferF);
              console.log("path w File->", pathWFile);

              try {
                await writeFile(pathWFile, dataFile);
                // console.log(res);
              } catch (error) {
                console.log("err->", error);
              }
              const width = Buffer.byteLength(dataFile);
              let id_jabatan = null;
              const dataJabatan = await prisma.jabatan.findFirst({
                where: {
                  jabatan: findData.jabatan,
                },
              });
              // console.log("dataJabatan->", dataJabatan);
              if (dataJabatan) {
                id_jabatan = parseInt(dataJabatan.id.toString());
              }
              let id_bagian = null;
              const dataBagian = await prisma.bagian.findFirst({
                where: {
                  nama_bagian: findData.nama_bagian,
                },
              });
              if (dataBagian) {
                id_bagian = parseInt(dataBagian.id.toString());
              }
              const dataPersonalia = await prisma.personalia.findFirst({
                where: {
                  username: profil.uname,
                },
              });
              const dataUser = await prisma.users.findFirst({
                where: {
                  username: profil.uname,
                },
              });
              let id_unit = null;
              const dataUnit = await prisma.unitkerja.findFirst({
                where: {
                  nama_unit: findData.nama_unit,
                },
              });
              if (dataUnit) {
                id_unit = parseInt(dataUnit.id.toString());
              }
              const data = {
                nama_file: newNameFile,
                path: `/${pathNoPublic}/${newNameFile}`,
                public: findData.public,
                id_jabatan,
                jabatan: findData.jabatan == "" ? null : findData.jabatan,
                id_bagian,
                nama_bagian:
                  findData.nama_bagian == "" ? null : findData.nama_bagian,
                id_unit,
                nama_unit: findData.nama_unit == "" ? null : findData.nama_unit,
                owner_id_personalia:
                  dataPersonalia?.id == undefined ? null : dataPersonalia.id,
                nama_personalia:
                  dataPersonalia?.nama == undefined
                    ? null
                    : dataPersonalia?.nama,
                owner_id_user: dataUser ? dataUser.id : null,
                username: profil.uname,
                is_deleted: 0,
                width,
                height: 0,
                alias: newNameFile,
                type: file.type,
                protected: 0,
              };
              console.log("data Temp->", data);
              await prisma.files.create({
                data,
                //     nama_file: newNameFile,
                //     path: `/${pathNoPublic}/${newNameFile}`,
                //     public: findData.public,
                //     id_jabatan: id_jabatan,
                //     jabatan: findData.jabatan,
                //     id_bagian: id_bagian,
                //     nama_bagian: findData.nama_bagian,

                //     width,
                //     height: 0,
                //   },
              });
              console.log("dateLine->", dateLine());
            } else if (
              findData.type ==
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
              findData.type == "application/vnd.ms-excel" ||
              findData.type ==
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
              findData.type == "application/msword"
            ) {
              let newNameFile;
              let aType = "";
              if (findData.type == "application/msword") {
                aType = "doc";
              } else if (
                findData.type ==
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              ) {
                aType = "docx";
              } else if (
                findData.type ==
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              ) {
                aType = "xlsx";
              } else if (findData.type == "application/vnd.ms-excel") {
                aType = "xls";
              }
              ix++;
              if (findData.title !== undefined && findData.title !== "") {
                newNameFile = `${dateLine()}-${ix}-${findData.title.replace(
                  /[^A-Z0-9]+/gi,
                  "-"
                )}-${profil.uname}.${aType}`;
              } else {
                newNameFile = `${dateLine()}-${ix}-${findData.nama_file.replace(
                  /[^A-Z0-9]+/gi,
                  "-"
                )}-${profil.uname}.${aType}`;
              }
              const pathWFile = `${path}/${newNameFile}`;
              const byteF = await file.arrayBuffer();
              const bufferF = Buffer.from(byteF);
              const dataFile = new Uint8Array(bufferF);
              console.log("path w File->", pathWFile);

              try {
                await writeFile(pathWFile, dataFile);
                // console.log(res);
              } catch (error) {
                console.log("err->", error);
              }
              const width = Buffer.byteLength(dataFile);
              let id_jabatan = null;
              const dataJabatan = await prisma.jabatan.findFirst({
                where: {
                  jabatan: findData.jabatan,
                },
              });
              // console.log("dataJabatan->", dataJabatan);
              if (dataJabatan) {
                id_jabatan = parseInt(dataJabatan.id.toString());
              }
              let id_bagian = null;
              const dataBagian = await prisma.bagian.findFirst({
                where: {
                  nama_bagian: findData.nama_bagian,
                },
              });
              if (dataBagian) {
                id_bagian = parseInt(dataBagian.id.toString());
              }
              const dataPersonalia = await prisma.personalia.findFirst({
                where: {
                  username: profil.uname,
                },
              });
              const dataUser = await prisma.users.findFirst({
                where: {
                  username: profil.uname,
                },
              });
              let id_unit = null;
              const dataUnit = await prisma.unitkerja.findFirst({
                where: {
                  nama_unit: findData.nama_unit,
                },
              });
              if (dataUnit) {
                id_unit = parseInt(dataUnit.id.toString());
              }
              const data = {
                nama_file: newNameFile,
                path: `/${pathNoPublic}/${newNameFile}`,
                public: findData.public,
                id_jabatan,
                jabatan: findData.jabatan == "" ? null : findData.jabatan,
                id_bagian,
                nama_bagian:
                  findData.nama_bagian == "" ? null : findData.nama_bagian,
                id_unit,
                nama_unit: findData.nama_unit == "" ? null : findData.nama_unit,
                owner_id_personalia:
                  dataPersonalia?.id == undefined ? null : dataPersonalia.id,
                nama_personalia:
                  dataPersonalia?.nama == undefined
                    ? null
                    : dataPersonalia?.nama,
                owner_id_user: dataUser ? dataUser.id : null,
                username: profil.uname,
                is_deleted: 0,
                width,
                height: 0,
                alias: newNameFile,
                type: file.type,
                protected: 0,
              };
              console.log("data Temp->", data);
              await prisma.files.create({
                data,
                //     nama_file: newNameFile,
                //     path: `/${pathNoPublic}/${newNameFile}`,
                //     public: findData.public,
                //     id_jabatan: id_jabatan,
                //     jabatan: findData.jabatan,
                //     id_bagian: id_bagian,
                //     nama_bagian: findData.nama_bagian,

                //     width,
                //     height: 0,
                //   },
              });
              console.log("dateLine->", dateLine());
            } else if (
              findData.type == "image/jpeg" ||
              findData.type == "image/jpg" ||
              findData.type == "image/png"
            ) {
              let newNameFile;
              let newNameFile500;
              const aType = file.type.split("/");
              if (findData.title !== undefined && findData.title !== "") {
                ix++;
                newNameFile = `${dateLine()}-${ix}-${findData.title.replace(
                  /[^A-Z0-9]+/gi,
                  "-"
                )}-${profil.uname}.${aType[1]}`;
                newNameFile500 = `${dateLine()}-${ix}-${findData.title.replace(
                  /[^A-Z0-9]+/gi,
                  "-"
                )}-${profil.uname}-500x.${aType[1]}`;
              } else {
                ix++;
                newNameFile = `${dateLine()}-${ix}-${findData.nama_file.replace(
                  /[^A-Z0-9]+/gi,
                  "-"
                )}-${profil.uname}.${aType[1]}`;
                newNameFile500 = `${dateLine()}-${ix}-${findData.nama_file.replace(
                  /[^A-Z0-9]+/gi,
                  "-"
                )}-${profil.uname}-500x.${aType[1]}`;
              }
              const pathWFile = `${path}/${newNameFile}`;
              const byteF = await file.arrayBuffer();
              const bufferF = Buffer.from(byteF);
              const dataFile = new Uint8Array(bufferF);
              console.log("path w File->", pathWFile);

              try {
                await writeFile(pathWFile, dataFile);
                // console.log(res);
              } catch (error) {
                console.log("err->", error);
              }
              let width: number;
              let height: number;
              // const width = Buffer.byteLength(dataFile);
              const imgRead = await Jimp.read(pathWFile);
              if (imgRead) {
                imgRead
                  .resize(500, Jimp.AUTO)
                  .write(`${path}/${newNameFile500}`);
                width = imgRead.bitmap.width;
                height = imgRead.bitmap.height;
                let id_jabatan = null;
                const dataJabatan = await prisma.jabatan.findFirst({
                  where: {
                    jabatan: findData.jabatan,
                  },
                });
                // console.log("dataJabatan->", dataJabatan);
                if (dataJabatan) {
                  id_jabatan = parseInt(dataJabatan.id.toString());
                }
                let id_bagian = null;
                const dataBagian = await prisma.bagian.findFirst({
                  where: {
                    nama_bagian: findData.nama_bagian,
                  },
                });
                if (dataBagian) {
                  id_bagian = parseInt(dataBagian.id.toString());
                }
                const dataPersonalia = await prisma.personalia.findFirst({
                  where: {
                    username: profil.uname,
                  },
                });
                const dataUser = await prisma.users.findFirst({
                  where: {
                    username: profil.uname,
                  },
                });
                let id_unit = null;
                const dataUnit = await prisma.unitkerja.findFirst({
                  where: {
                    nama_unit: findData.nama_unit,
                  },
                });
                if (dataUnit) {
                  id_unit = parseInt(dataUnit.id.toString());
                }
                const data = {
                  nama_file: newNameFile,
                  path: `/${pathNoPublic}/${newNameFile}`,
                  public: findData.public,
                  id_jabatan,
                  jabatan: findData.jabatan == "" ? null : findData.jabatan,
                  id_bagian,
                  nama_bagian:
                    findData.nama_bagian == "" ? null : findData.nama_bagian,
                  id_unit,
                  nama_unit:
                    findData.nama_unit == "" ? null : findData.nama_unit,
                  owner_id_personalia:
                    dataPersonalia?.id == undefined ? null : dataPersonalia.id,
                  nama_personalia:
                    dataPersonalia?.nama == undefined
                      ? null
                      : dataPersonalia?.nama,
                  owner_id_user: dataUser ? dataUser.id : null,
                  username: profil.uname,
                  is_deleted: 0,
                  width,
                  height,
                  alias: newNameFile,
                  type: file.type,
                  protected: 0,
                };
                console.log("data Temp->", data);
                await prisma.files.create({
                  data,
                  //     nama_file: newNameFile,
                  //     path: `/${pathNoPublic}/${newNameFile}`,
                  //     public: findData.public,
                  //     id_jabatan: id_jabatan,
                  //     jabatan: fibndData.jabatan,
                  //     id_bagian: id_bagian,
                  //     nama_bagian: findData.nama_bagian,

                  //     width,
                  //     height: 0,
                  //   },
                });
                const data500 = {
                  nama_file: newNameFile500,
                  path: `/${pathNoPublic}/${newNameFile500}`,
                  public: findData.public,
                  id_jabatan,
                  jabatan: findData.jabatan == "" ? null : findData.jabatan,
                  id_bagian,
                  nama_bagian:
                    findData.nama_bagian == "" ? null : findData.nama_bagian,
                  id_unit,
                  nama_unit:
                    findData.nama_unit == "" ? null : findData.nama_unit,
                  owner_id_personalia:
                    dataPersonalia?.id == undefined ? null : dataPersonalia.id,
                  nama_personalia:
                    dataPersonalia?.nama == undefined
                      ? null
                      : dataPersonalia?.nama,
                  owner_id_user: dataUser ? dataUser.id : null,
                  username: profil.uname,
                  is_deleted: 0,
                  width: 500,
                  height: 500,
                  alias: newNameFile,
                  type: file.type,
                  protected: 0,
                };
                console.log("data Temp->", data);
                await prisma.files.create({
                  data: data500,
                  //     nama_file: newNameFile,
                  //     path: `/${pathNoPublic}/${newNameFile}`,
                  //     public: findData.public,
                  //     id_jabatan: id_jabatan,
                  //     jabatan: findData.jabatan,
                  //     id_bagian: id_bagian,
                  //     nama_bagian: findData.nama_bagian,

                  //     width,
                  //     height: 0,
                  //   },
                });
                console.log("dateLine->", dateLine());
              }
            } else {
              errorFiles.push("Ends With Nothing");
            }
          }
        }
        if (index === array.length - 1) resolve("Ok");

        // console.log(file, allow, file.type);
      });
    }
  });
  const result = await yaaa;
  if (result) {
    console.log("bottom cek errFile->", errorFiles);
    if (errorFiles.length == 0) {
      return NextResponse.json(
        { message: "Ok" },
        { status: httpStatus.Accepted }
      );
    } else {
      return NextResponse.json(
        { message: "Error", error: errorFiles },
        { status: httpStatus.Accepted }
      );
    }
  }
  // yaaa
  //   .then(() => {

  //   })
  //   .finally(() => {
  //     console.log("request->", dataI, files);
  //     return NextResponse.json(
  //       { message: "end" },
  //       { status: httpStatus.Accepted }
  //     );
  //   });
}
