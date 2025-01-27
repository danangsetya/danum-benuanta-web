import { pelatihan } from "./../../../../../../prisma/generated/client1/index.d";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  karirT,
  keluargaT,
  pelatihanT,
  pendidikanT,
  penggunaT,
  personaliaType,
  skT,
} from "@/lib/types";
import { httpStatus, now, toJson, validateEmail } from "@/lib/utils";
import { genSalt, hash } from "bcryptjs";
import { mkdir, stat, writeFile } from "fs/promises";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let error: any = {};
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: httpStatus.Unauthorized }
    );
  const allowedFileTypes = ["image/png", "image/jpeg", "application/pdf"];
  const data = await request.formData();
  const personalia: personaliaType =
    typeof toJson(data.get("personalia") as string) == "string"
      ? JSON.parse(toJson(data.get("personalia") as string))
      : toJson(data.get("personalia") as string);
  const pengguna: penggunaT =
    typeof toJson(data.get("pengguna") as string) == "string"
      ? JSON.parse(toJson(data.get("pengguna") as string))
      : toJson(data.get("pengguna") as string);
  const keluarga: keluargaT[] | undefined =
    data.get("keluarga") == "" || data.get("keluarga") == null
      ? undefined
      : typeof toJson(data.get("keluarga") as string) == "string"
      ? JSON.parse(toJson(data.get("keluarga") as string))
      : toJson(data.get("keluarga") as string);
  const pendidikan: pendidikanT[] | undefined =
    data.get("pendidikan") == "" || data.get("pendidikan") == null
      ? undefined
      : typeof toJson(data.get("pendidikan") as string) == "string"
      ? JSON.parse(toJson(data.get("pendidikan") as string))
      : toJson(data.get("pendidikan") as string);
  const pelatihan: pelatihanT[] | undefined =
    data.get("pelatihan") == "" || data.get("pelatihan") == null
      ? undefined
      : typeof toJson(data.get("pelatihan") as string) == "string"
      ? JSON.parse(toJson(data.get("pelatihan") as string))
      : toJson(data.get("pelatihan") as string);

  const sk: skT[] | undefined =
    data.get("sk") == "" || data.get("sk") == null
      ? undefined
      : typeof toJson(data.get("sk") as string) == "string"
      ? JSON.parse(toJson(data.get("sk") as string))
      : toJson(data.get("sk") as string);

  const karir: karirT[] | undefined =
    data.get("karir") == "" || data.get("karir") == null
      ? undefined
      : typeof toJson(data.get("karir") as string) == "string"
      ? JSON.parse(toJson(data.get("karir") as string))
      : toJson(data.get("karir") as string);

  const pendidikanFiles = data.getAll("pendidikanFiles");
  const pelatihanFiles = data.getAll("pelatihanFiles");
  const skFiles = data.getAll("skFiles");
  const karirFiles = data.getAll("karirFiles");
  console.log("data->", {
    personalia,
    pengguna,
    keluarga,
    pendidikan,
    pelatihan,
    sk,
    karir,
    pendidikanFiles,
    pelatihanFiles,
    skFiles,
    karirFiles,
  });
  // return NextResponse.json({ message: "cek" });
  // console.log(data);
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
  if (personalia.id == 0) {
  }
  const dataPersonalia = await prisma.personalia.findFirst({
    where: {
      id: personalia.id,
    },
  });
  if (dataPersonalia) {
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
    if (!validateEmail(personalia.email)) error.email = "Tidak Valid";
    if (personalia.nama.length < 3) {
      error.nama = "Tidak Boleh Kosong";
    }
    console.log("email->", validateEmail(personalia.email));

    if (personalia.telpon == "") error.telpon = "Tidak Boleh Kosong";
    else if (personalia.telpon && personalia.telpon.length < 10)
      error.telpon = "Tidak Valid";

    if (personalia.username == "") {
      error.username = "Tidak Boleh Kosong";
    } else {
      if (personalia.username !== dataPersonalia.username) {
        const cariUsername = await prisma.users.findUnique({
          where: {
            username: personalia.username,
          },
        });
        if (cariUsername) {
          error.username = "Username Tidak Tersedia";
        }
      }
    }
    if (
      (personalia.password.length <= 5 && personalia.password.length > 1) ||
      personalia.password !== personalia.konfirm_password
    ) {
      error.password = " Harus Lebih dari 6 Karakter";
    }
    if (Object.keys(error).length > 0) {
      return NextResponse.json(
        { personalia, pengguna, error, message: "Error" },
        { status: httpStatus.Ok }
      );
    }

    const ubahPersonalia = await prisma.personalia.update({
      data: {
        nama: personalia.nama.toUpperCase(),
        nik: personalia.nik,
        email: personalia.email,
        status_kawin: personalia.status_kawin,
        tanggal_menikah:
          personalia.tanggal_menikah !== ""
            ? new Date(personalia.tanggal_menikah).toISOString()
            : now,
        telpon: personalia.hp,
        hp: personalia.hp,
        tempat_lahir: personalia.tempat_lahir,
        tanggal_lahir:
          personalia.tanggal_lahir !== ""
            ? new Date(personalia.tanggal_lahir).toISOString()
            : now,
        jenis_kelamin: personalia.jenis_kelamin,
        gol_darah: personalia.gol_darah,
        agama: personalia.agama,
        alamat: personalia.alamat,
        username: personalia.username,
        hash: "",
        mk_gaji: personalia.mk_gaji * 1,
        status_pegawai: personalia.status_pegawai,
        gol: personalia.gol,
        unit_kerja: personalia.unit_kerja,
        jabatan: personalia.jabatan,
        bagian: personalia.bagian,
        pangkat: personalia.pangkat,
        pendidikan: personalia.pendidikan,
        kk: personalia.kk,
        ktp: personalia.ktp,
        npwp: personalia.npwp,
        efin: personalia.efin,
        bpjskt: personalia.bpjskt,
        bpjs: personalia.bpjs,
        dapenmapamsi: personalia.dapenmapamsi,
        polis: personalia.polis,
        simc: personalia.simc,
        simab: personalia.simab,
        paspor: personalia.paspor,
        simpeda: personalia.simpeda,
        nama_ayah: personalia.nama_ayah,
        nama_ibu: personalia.nama_ibu,
        anak_nomor: personalia.anak_nomor,
        jml_saudara: personalia.jml_saudara,
        id_lokasi: personalia.id_lokasi * 1,
      },
      where: {
        id: personalia.id,
      },
    });
    console.log("update personalia->", ubahPersonalia);
    if (
      personalia.password.length >= 6 &&
      personalia.password == personalia.konfirm_password
    ) {
      const salt = await genSalt(10);
      const password_hash = await hash(personalia.password, salt);
      const ubahUsers = await prisma.users.update({
        data: {
          username: pengguna.username,
          password_hash,
        },
        where: {
          id: pengguna.id,
        },
      });
    } else {
      const ubahUsers = await prisma.users.update({
        data: {
          username: pengguna.username,
        },
        where: {
          id: pengguna.id,
        },
      });
    }
    //setting path dan folder sebelum di tulis oleh file
    const pathwUsername = `files/${dataPersonalia.username}`;
    const path = `public/${pathwUsername}`;
    const pathNoPublic = `${pathwUsername}`;
    try {
      const statFolder = await stat(path);
    } catch (error) {
      await mkdir(path, { recursive: true });
    }
    if (keluarga !== undefined) {
      await Promise.all(
        keluarga.map(async (item) => {
          if (item.id == 0) {
            const result = await prisma.keluarga.create({
              data: {
                agama: item.agama,
                hubungan: item.hubungan,
                id_personalia: dataPersonalia.id,
                tempat_lahir: item.tempat_lahir,
                tanggal_lahir:
                  item.tanggal_lahir !== ""
                    ? new Date(item.tanggal_lahir).toISOString()
                    : now,
                nama: item.nama,
                jenis_kelamin: item.jenis_kelamin,
                nomor_ktp: item.nomor_ktp,
                pekerjaan: item.pekerjaan,
                pendidikan: item.pendidikan,
                tanggal: new Date(now),
              },
            });
            console.log(`create keluarga ->`, result);
          } else {
            const result = await prisma.keluarga.update({
              where: {
                id: item.id,
              },
              data: {
                agama: item.agama,
                hubungan: item.hubungan,
                id_personalia: dataPersonalia.id,
                tempat_lahir: item.tempat_lahir,
                tanggal_lahir:
                  item.tanggal_lahir !== ""
                    ? new Date(item.tanggal_lahir).toISOString()
                    : now,
                nama: item.nama,
                jenis_kelamin: item.jenis_kelamin,
                nomor_ktp: item.nomor_ktp,
                pekerjaan: item.pekerjaan,
                pendidikan: item.pendidikan,
                tanggal: new Date(now),
              },
            });
            console.log(`update keluarga u ->`, result);
          }
        })
      );
    }
    if (pendidikan !== undefined) {
      await Promise.all(
        pendidikan.map(async (item) => {
          if (item.id == 0) {
            const result = await prisma.pendidikan.create({
              data: {
                id_personalia: dataPersonalia.id,
                nama: item.nama,
                tingkat: item.tingkat,
                alamat: item.alamat,
                fakultas: item.fakultas,
                jurusan: item.jurusan,
                tahun: item.tahun,
                no_ijazah: item.no_ijazah,
              },
            });
            console.log(`create pendidikan ->`, result);
            if (pendidikanFiles.length > 0 && item.nama_file !== undefined) {
              await Promise.all(
                pendidikanFiles.map(async (xx) => {
                  const file: File = xx as File;
                  if (file.name == item.nama_file) {
                    const byteF = await file.arrayBuffer();
                    const bufferF = Buffer.from(byteF);
                    const aType = file.type.split("/");
                    const newString = item.nama.replace(/[^A-Z0-9]+/gi, "-");
                    const namaFilex = newString;
                    const pathFileR = `${path}/${dateLine}-pendidikan-${namaFilex}-${personalia.username}.${aType[1]}`;
                    console.log("pathFileR->", pathFileR);
                    const dataFile = new Uint8Array(bufferF);
                    await writeFile(pathFileR, dataFile);
                    const width = Buffer.byteLength(dataFile);
                    await prisma.files.create({
                      data: {
                        nama_file: `${dateLine}-pendidikan-${namaFilex}-${personalia.username}.${aType[1]}`,
                        path: `/${pathNoPublic}/${dateLine}-pendidikan-${namaFilex}-${personalia.username}.${aType[1]}`,
                        public: 0,
                        id_jabatan: dataJabatan?.id,
                        jabatan: personalia.jabatan,
                        id_bagian: dataBagian?.id,
                        nama_bagian: personalia.bagian,
                        id_unit: dataUnit?.id,
                        nama_unit: personalia.unit_kerja,
                        owner_id_personalia: personalia.id,
                        nama_personalia: personalia.nama,
                        owner_id_user: dataUser?.id,
                        username: personalia.username,
                        is_deleted: 0,
                        width,
                        height: 0,
                        alias: `${dateLine}-pendidikan-${namaFilex}-${personalia.username}.${aType[1]}`,
                        type: file.type,
                      },
                    });
                    await prisma.pendidikan.update({
                      where: { id: result.id },
                      data: {
                        file_pendidikan: `/${pathNoPublic}/${dateLine}-pendidikan-${namaFilex}-${personalia.username}.${aType[1]}`,
                      },
                    });
                  }
                })
              );
            }
          } else {
            const result = await prisma.pendidikan.update({
              where: {
                id: item.id,
              },
              data: {
                id_personalia: dataPersonalia.id,
                nama: item.nama,
                tingkat: item.tingkat,
                alamat: item.alamat,
                fakultas: item.fakultas,
                jurusan: item.jurusan,
                tahun: item.tahun,
                no_ijazah: item.no_ijazah,
              },
            });
            console.log(`update pendidikan ->`, result);
            if (pendidikanFiles.length > 0 && item.nama_file !== undefined) {
              await Promise.all(
                pendidikanFiles.map(async (xx) => {
                  const file: File = xx as File;
                  if (file.name == item.nama_file) {
                    const byteF = await file.arrayBuffer();
                    const bufferF = Buffer.from(byteF);
                    const aType = file.type.split("/");
                    const newString = item.nama.replace(/[^A-Z0-9]+/gi, "-");
                    const namaFilex = newString;
                    const pathFileR = `${path}/${dateLine}-pendidikan-${namaFilex}-${personalia.username}.${aType[1]}`;
                    console.log("pathFileR->", pathFileR);
                    const dataFile = new Uint8Array(bufferF);
                    await writeFile(pathFileR, dataFile);
                    const width = Buffer.byteLength(dataFile);
                    await prisma.files.create({
                      data: {
                        nama_file: `${dateLine}-pendidikan-${namaFilex}-${personalia.username}.${aType[1]}`,
                        path: `/${pathNoPublic}/${dateLine}-pendidikan-${namaFilex}-${personalia.username}.${aType[1]}`,
                        public: 0,
                        id_jabatan: dataJabatan?.id,
                        jabatan: personalia.jabatan,
                        id_bagian: dataBagian?.id,
                        nama_bagian: personalia.bagian,
                        id_unit: dataUnit?.id,
                        nama_unit: personalia.unit_kerja,
                        owner_id_personalia: personalia.id,
                        nama_personalia: personalia.nama,
                        owner_id_user: dataUser?.id,
                        username: personalia.username,
                        is_deleted: 0,
                        width,
                        height: 0,
                        alias: `${dateLine}-pendidikan-${namaFilex}-${personalia.username}.${aType[1]}`,
                        type: file.type,
                      },
                    });
                    await prisma.pendidikan.update({
                      where: { id: result.id },
                      data: {
                        file_pendidikan: `/${pathNoPublic}/${dateLine}-pendidikan-${namaFilex}-${personalia.username}.${aType[1]}`,
                      },
                    });
                  }
                })
              );
            }
          }
        })
      );
    }
    if (pelatihan !== undefined) {
      await Promise.all(
        pelatihan.map(async (item) => {
          if (item.id == 0) {
            const result = await prisma.pelatihan.create({
              data: {
                id_personalia: dataPersonalia.id,
                jenis: item.jenis,
                penyelenggara: item.penyelenggara,
                tahun: item.tahun,
                lokasi: item.lokasi,
              },
            });
            console.log(`create pelatihan ->`, result);
            if (pelatihanFiles.length > 0 && item.nama_file !== undefined) {
              await Promise.all(
                pelatihanFiles.map(async (xx) => {
                  const file: File = xx as File;
                  if (file.name == item.nama_file) {
                    const byteF = await file.arrayBuffer();
                    const bufferF = Buffer.from(byteF);
                    const aType = file.type.split("/");
                    const newString = item.jenis.replace(/[^A-Z0-9]+/gi, "-");
                    const namaFilex = newString;
                    const pathFileR = `${path}/${dateLine}-pelatihan-${namaFilex}-${personalia.username}.${aType[1]}`;
                    console.log("pathFileR->", pathFileR);
                    const dataFile = new Uint8Array(bufferF);
                    await writeFile(pathFileR, dataFile);
                    const width = Buffer.byteLength(dataFile);
                    await prisma.files.create({
                      data: {
                        nama_file: `${dateLine}-pelatihan-${namaFilex}-${personalia.username}.${aType[1]}`,
                        path: `/${pathNoPublic}/${dateLine}-pelatihan-${namaFilex}-${personalia.username}.${aType[1]}`,
                        public: 0,
                        id_jabatan: dataJabatan?.id,
                        jabatan: personalia.jabatan,
                        id_bagian: dataBagian?.id,
                        nama_bagian: personalia.bagian,
                        id_unit: dataUnit?.id,
                        nama_unit: personalia.unit_kerja,
                        owner_id_personalia: personalia.id,
                        nama_personalia: personalia.nama,
                        owner_id_user: dataUser?.id,
                        username: personalia.username,
                        is_deleted: 0,
                        width,
                        height: 0,
                        alias: `${dateLine}-pelatihan-${namaFilex}-${personalia.username}.${aType[1]}`,
                        type: file.type,
                      },
                    });
                    await prisma.pelatihan.update({
                      where: { id: result.id },
                      data: {
                        file_pelatihan: `/${pathNoPublic}/${dateLine}-pelatihan-${namaFilex}-${personalia.username}.${aType[1]}`,
                      },
                    });
                  }
                })
              );
            }
          } else {
            const result = await prisma.pelatihan.update({
              where: {
                id: item.id,
              },
              data: {
                id_personalia: dataPersonalia.id,
                jenis: item.jenis,
                penyelenggara: item.penyelenggara,
                tahun: item.tahun,
                lokasi: item.lokasi,
              },
            });
            console.log(`update pelatihan ->`, result);
            if (pelatihanFiles.length > 0 && item.nama_file !== undefined) {
              await Promise.all(
                pelatihanFiles.map(async (xx) => {
                  const file: File = xx as File;
                  if (file.name == item.nama_file) {
                    const byteF = await file.arrayBuffer();
                    const bufferF = Buffer.from(byteF);
                    const aType = file.type.split("/");
                    const newString = item.jenis.replace(/[^A-Z0-9]+/gi, "-");
                    const namaFilex = newString;
                    const pathFileR = `${path}/${dateLine}-pelatihan-${namaFilex}-${personalia.username}.${aType[1]}`;
                    console.log("pathFileR->", pathFileR);
                    const dataFile = new Uint8Array(bufferF);
                    await writeFile(pathFileR, dataFile);
                    const width = Buffer.byteLength(dataFile);
                    await prisma.files.create({
                      data: {
                        nama_file: `${dateLine}-pelatihan-${namaFilex}-${personalia.username}.${aType[1]}`,
                        path: `/${pathNoPublic}/${dateLine}-pelatihan-${namaFilex}-${personalia.username}.${aType[1]}`,
                        public: 0,
                        id_jabatan: dataJabatan?.id,
                        jabatan: personalia.jabatan,
                        id_bagian: dataBagian?.id,
                        nama_bagian: personalia.bagian,
                        id_unit: dataUnit?.id,
                        nama_unit: personalia.unit_kerja,
                        owner_id_personalia: personalia.id,
                        nama_personalia: personalia.nama,
                        owner_id_user: dataUser?.id,
                        username: personalia.username,
                        is_deleted: 0,
                        width,
                        height: 0,
                        alias: `${dateLine}-pelatihan-${namaFilex}-${personalia.username}.${aType[1]}`,
                        type: file.type,
                      },
                    });
                    await prisma.pelatihan.update({
                      where: { id: result.id },
                      data: {
                        file_pelatihan: `/${pathNoPublic}/${dateLine}-pelatihan-${namaFilex}-${personalia.username}.${aType[1]}`,
                      },
                    });
                  }
                })
              );
            }
          }
        })
      );
    }
    if (sk !== undefined) {
      await Promise.all(
        sk.map(async (item) => {
          if (item.id == 0) {
            const result = await prisma.sk.create({
              data: {
                id_personalia: dataPersonalia.id,
                tanggal: new Date(now).toISOString(),
                nomor_sk: item.nomor_sk,
                tmt: item.tmt == "" ? null : new Date(item.tmt),
                success: item.success,
              },
            });
            console.log(`create sk ->`, result);
            if (skFiles.length > 0 && item.nama_file !== undefined) {
              await Promise.all(
                skFiles.map(async (xx) => {
                  const file: File = xx as File;
                  if (file.name == item.nama_file) {
                    const byteF = await file.arrayBuffer();
                    const bufferF = Buffer.from(byteF);
                    const aType = file.type.split("/");
                    const newString = item.nomor_sk.replace(
                      /[^A-Z0-9]+/gi,
                      "-"
                    );
                    const namaFilex = newString;
                    const pathFileR = `${path}/${dateLine}-sk-${namaFilex}-${personalia.username}.${aType[1]}`;
                    console.log("pathFileR->", pathFileR);
                    const dataFile = new Uint8Array(bufferF);
                    await writeFile(pathFileR, dataFile);
                    const width = Buffer.byteLength(dataFile);
                    await prisma.files.create({
                      data: {
                        nama_file: `${dateLine}-sk-${namaFilex}-${personalia.username}.${aType[1]}`,
                        path: `/${pathNoPublic}/${dateLine}-sk-${namaFilex}-${personalia.username}.${aType[1]}`,
                        public: 0,
                        id_jabatan: dataJabatan?.id,
                        jabatan: personalia.jabatan,
                        id_bagian: dataBagian?.id,
                        nama_bagian: personalia.bagian,
                        id_unit: dataUnit?.id,
                        nama_unit: personalia.unit_kerja,
                        owner_id_personalia: personalia.id,
                        nama_personalia: personalia.nama,
                        owner_id_user: dataUser?.id,
                        username: personalia.username,
                        is_deleted: 0,
                        width,
                        height: 0,
                        alias: `${dateLine}-sk-${namaFilex}-${personalia.username}.${aType[1]}`,
                        type: file.type,
                      },
                    });
                    await prisma.sk.update({
                      where: { id: result.id },
                      data: {
                        file_sk: `/${pathNoPublic}/${dateLine}-sk-${namaFilex}-${personalia.username}.${aType[1]}`,
                      },
                    });
                  }
                })
              );
            }
          } else {
            const result = await prisma.sk.update({
              where: {
                id: item.id,
              },
              data: {
                id_personalia: dataPersonalia.id,
                tanggal: new Date(now).toISOString(),
                nomor_sk: item.nomor_sk,
                tmt: item.tmt == "" ? null : new Date(item.tmt),
                success: item.success,
              },
            });
            console.log(`update sk ->`, result);
            if (skFiles.length > 0 && item.nama_file !== undefined) {
              await Promise.all(
                skFiles.map(async (xx) => {
                  const file: File = xx as File;
                  if (file.name == item.nama_file) {
                    const byteF = await file.arrayBuffer();
                    const bufferF = Buffer.from(byteF);
                    const aType = file.type.split("/");
                    const newString = item.nomor_sk.replace(
                      /[^A-Z0-9]+/gi,
                      "-"
                    );
                    const namaFilex = newString;
                    const pathFileR = `${path}/${dateLine}-sk-${namaFilex}-${personalia.username}.${aType[1]}`;
                    console.log("pathFileR->", pathFileR);
                    const dataFile = new Uint8Array(bufferF);
                    await writeFile(pathFileR, dataFile);
                    const width = Buffer.byteLength(dataFile);
                    await prisma.files.create({
                      data: {
                        nama_file: `${dateLine}-sk-${namaFilex}-${personalia.username}.${aType[1]}`,
                        path: `/${pathNoPublic}/${dateLine}-sk-${namaFilex}-${personalia.username}.${aType[1]}`,
                        public: 0,
                        id_jabatan: dataJabatan?.id,
                        jabatan: personalia.jabatan,
                        id_bagian: dataBagian?.id,
                        nama_bagian: personalia.bagian,
                        id_unit: dataUnit?.id,
                        nama_unit: personalia.unit_kerja,
                        owner_id_personalia: personalia.id,
                        nama_personalia: personalia.nama,
                        owner_id_user: dataUser?.id,
                        username: personalia.username,
                        is_deleted: 0,
                        width,
                        height: 0,
                        alias: `${dateLine}-sk-${namaFilex}-${personalia.username}.${aType[1]}`,
                        type: file.type,
                      },
                    });
                    await prisma.sk.update({
                      where: { id: result.id },
                      data: {
                        file_sk: `/${pathNoPublic}/${dateLine}-sk-${namaFilex}-${personalia.username}.${aType[1]}`,
                      },
                    });
                  }
                })
              );
            }
          }
        })
      );
    }
    if (karir !== undefined) {
      await Promise.all(
        karir.map(async (item) => {
          if (item.id == 0) {
            const result = await prisma.karir.create({
              data: {
                id_personalia: dataPersonalia.id,
                bagian: item.bagian,
                tahun: item.tahun,
                status_pegawai: item.status_pegawai,
                jabatan: item.jabatan,
                unit_kerja: item.unit_kerja,
              },
            });
            console.log(`create karir ->`, result);
            if (karirFiles.length > 0 && item.nama_file !== undefined) {
              await Promise.all(
                karirFiles.map(async (xx) => {
                  const file: File = xx as File;
                  if (file.name == item.nama_file) {
                    const byteF = await file.arrayBuffer();
                    const bufferF = Buffer.from(byteF);
                    const aType = file.type.split("/");
                    const newString =
                      item.status_pegawai.replace(/[^A-Z0-9]+/gi, "-") +
                      "-" +
                      item.jabatan.replace(/[^A-Z0-9]+/gi, "-") +
                      "-" +
                      item.bagian.replace(/[^A-Z0-9]+/gi, "-");
                    const namaFilex = newString;
                    const pathFileR = `${path}/${dateLine}-karir-${namaFilex}-${personalia.username}.${aType[1]}`;
                    console.log("pathFileR->", pathFileR);
                    const dataFile = new Uint8Array(bufferF);
                    await writeFile(pathFileR, dataFile);
                    const width = Buffer.byteLength(dataFile);
                    await prisma.files.create({
                      data: {
                        nama_file: `${dateLine}-karir-${namaFilex}-${personalia.username}.${aType[1]}`,
                        path: `/${pathNoPublic}/${dateLine}-karir-${namaFilex}-${personalia.username}.${aType[1]}`,
                        public: 0,
                        id_jabatan: dataJabatan?.id,
                        jabatan: personalia.jabatan,
                        id_bagian: dataBagian?.id,
                        nama_bagian: personalia.bagian,
                        id_unit: dataUnit?.id,
                        nama_unit: personalia.unit_kerja,
                        owner_id_personalia: personalia.id,
                        nama_personalia: personalia.nama,
                        owner_id_user: dataUser?.id,
                        username: personalia.username,
                        is_deleted: 0,
                        width,
                        height: 0,
                        alias: `${dateLine}-karir-${namaFilex}-${personalia.username}.${aType[1]}`,
                        type: file.type,
                      },
                    });
                    await prisma.karir.update({
                      where: { id: result.id },
                      data: {
                        file_karir: `/${pathNoPublic}/${dateLine}-karir-${namaFilex}-${personalia.username}.${aType[1]}`,
                      },
                    });
                  }
                })
              );
            }
          } else {
            const result = await prisma.karir.update({
              where: { id: item.id },
              data: {
                id_personalia: dataPersonalia.id,
                bagian: item.bagian,
                tahun: item.tahun,
                status_pegawai: item.status_pegawai,
                jabatan: item.jabatan,
                unit_kerja: item.unit_kerja,
              },
            });
            console.log(`update karir ->`, result);
            if (karirFiles.length > 0 && item.nama_file !== undefined) {
              await Promise.all(
                karirFiles.map(async (xx) => {
                  const file: File = xx as File;
                  if (file.name == item.nama_file) {
                    const byteF = await file.arrayBuffer();
                    const bufferF = Buffer.from(byteF);
                    const aType = file.type.split("/");
                    const newString =
                      item.status_pegawai.replace(/[^A-Z0-9]+/gi, "-") +
                      "-" +
                      item.jabatan.replace(/[^A-Z0-9]+/gi, "-") +
                      "-" +
                      item.bagian.replace(/[^A-Z0-9]+/gi, "-");
                    const namaFilex = newString;
                    const pathFileR = `${path}/${dateLine}-karir-${namaFilex}-${personalia.username}.${aType[1]}`;
                    console.log("pathFileR->", pathFileR);
                    const dataFile = new Uint8Array(bufferF);
                    await writeFile(pathFileR, dataFile);
                    const width = Buffer.byteLength(dataFile);
                    await prisma.files.create({
                      data: {
                        nama_file: `${dateLine}-karir-${namaFilex}-${personalia.username}.${aType[1]}`,
                        path: `/${pathNoPublic}/${dateLine}-karir-${namaFilex}-${personalia.username}.${aType[1]}`,
                        public: 0,
                        id_jabatan: dataJabatan?.id,
                        jabatan: personalia.jabatan,
                        id_bagian: dataBagian?.id,
                        nama_bagian: personalia.bagian,
                        id_unit: dataUnit?.id,
                        nama_unit: personalia.unit_kerja,
                        owner_id_personalia: personalia.id,
                        nama_personalia: personalia.nama,
                        owner_id_user: dataUser?.id,
                        username: personalia.username,
                        is_deleted: 0,
                        width,
                        height: 0,
                        alias: `${dateLine}-karir-${namaFilex}-${personalia.username}.${aType[1]}`,
                        type: file.type,
                      },
                    });
                    const resultx = await prisma.karir.update({
                      where: { id: result.id },
                      data: {
                        file_karir: `/${pathNoPublic}/${dateLine}-karir-${namaFilex}-${personalia.username}.${aType[1]}`,
                      },
                    });
                    console.log(`update file karirx ->`, resultx);
                  }
                })
              );
            }
          }
        })
      );
    }

    // if (pelatihanFiles.length > 0) {
    //   pelatihanFiles.map(async (item: any, index: number) => {
    //     if (typeof item == "string") return;

    //     console.log("typeof FilePelatihan", typeof item);
    //     const file: File = item as File;
    //     console.log("mapOfFiles->", file.name);
    //     const byteF = await file.arrayBuffer();
    //     const bufferF = Buffer.from(byteF);
    //     const aType = file.type.split("/");

    //     let namaFilex = "";

    //     if (pelatihan !== undefined) {
    //       const findPelatihan = pelatihan.find(
    //         (e: pelatihanT) => e.nama_file == file.name
    //       );
    //       if (findPelatihan) {
    //         console.log("findPelatihan->", findPelatihan);
    //         const newString = findPelatihan.jenis.replace(/[^A-Z0-9]+/gi, "-");
    //         namaFilex = newString;
    //         // console.log("nama file->", newString);
    //         const pathFileR = `${path}/${dateLine}-pelatihan-${index}-${namaFilex}-${dataPersonalia.username}.${aType[1]}`;
    //         console.log("pathFileR->", pathFileR);
    //         const dataFile = new Uint8Array(bufferF);
    //         await writeFile(pathFileR, dataFile);
    //         const width = Buffer.byteLength(dataFile);
    //         await prisma.files.create({
    //           data: {
    //             nama_file: `${dateLine}-pelatihan-${index}-${namaFilex}-${dataPersonalia.username}.${aType[1]}`,
    //             path: `/${pathNoPublic}/${dateLine}-pelatihan-${index}-${namaFilex}-${dataPersonalia.username}.${aType[1]}`,
    //             public: 0,
    //             id_jabatan: dataJabatan?.id,
    //             jabatan: dataPersonalia.jabatan,
    //             id_bagian: dataBagian?.id,
    //             nama_bagian: dataPersonalia.bagian,
    //             id_unit: dataUnit?.id,
    //             nama_unit: dataPersonalia.unit_kerja,
    //             owner_id_personalia: dataPersonalia.id,
    //             nama_personalia: dataPersonalia.nama,
    //             owner_id_user: dataUser?.id,
    //             username: dataPersonalia.username,
    //             is_deleted: 0,
    //             width,
    //             height: 0,
    //             alias: `${dateLine}-pelatihan-${index}-${namaFilex}-${dataPersonalia.username}.${aType[1]}`,
    //             type: file.type,
    //           },
    //         });
    //         if (findPelatihan.id == 0) {
    //           await prisma.pelatihan.create({
    //             data: {
    //               id_personalia: dataPersonalia.id,
    //               jenis: findPelatihan.jenis,
    //               penyelenggara: findPelatihan.penyelenggara,
    //               tahun: findPelatihan.tahun,
    //               lokasi: findPelatihan.lokasi,
    //               file_pelatihan: `/${pathNoPublic}/${dateLine}-pelatihan-${index}-${namaFilex}-${dataPersonalia.username}.${aType[1]}`,
    //             },
    //           });
    //         } else {
    //           await prisma.pelatihan.update({
    //             where: { id: findPelatihan.id },
    //             data: {
    //               id_personalia: dataPersonalia.id,
    //               jenis: findPelatihan.jenis,
    //               penyelenggara: findPelatihan.penyelenggara,
    //               tahun: findPelatihan.tahun,
    //               lokasi: findPelatihan.lokasi,
    //               file_pelatihan: `/${pathNoPublic}/${dateLine}-pelatihan-${index}-${namaFilex}-${dataPersonalia.username}.${aType[1]}`,
    //             },
    //           });
    //         }
    //       } else {
    //       }

    //       // console.log("cari pelatihan->", findPelatihan);
    //     }

    //     //  var newName = .replace(/[^A-Z0-9]+/gi, "_");
    //   });
    // }

    // if (pelatihan !== undefined) {
    //   pelatihan.forEach(async (item) => {
    //     if (item.id !== undefined) {
    //       if (item.id > 0) {
    //         await prisma.pelatihan.update({
    //           where: {
    //             id: item.id,
    //           },
    //           data: {
    //             jenis: item.jenis,
    //             penyelenggara: item.penyelenggara,
    //             tahun: item.tahun,
    //             lokasi: item.lokasi,
    //           },
    //         });
    //         console.log("update adfasd");
    //       } else {
    //         console.log("insert oea");
    //         await prisma.pelatihan.create({
    //           data: {
    //             id_personalia: dataPersonalia.id,
    //             jenis: item.jenis,
    //             penyelenggara: item.penyelenggara,
    //             tahun: item.tahun,
    //             lokasi: item.lokasi,
    //           },
    //         });
    //       }
    //     }
    //   });
    // }

    const pelatihanRes = await prisma.pelatihan.findMany({
      where: {
        id_personalia: dataPersonalia.id,
      },
    });
    const keluargaRes = await prisma.keluarga.findMany({
      where: {
        id_personalia: dataPersonalia.id,
      },
    });
    const pendidikanRes = await prisma.pendidikan.findMany({
      where: {
        id_personalia: dataPersonalia.id,
      },
    });
    const skRes = await prisma.sk.findMany({
      where: {
        id_personalia: dataPersonalia.id,
      },
    });
    const karirRes = await prisma.karir.findMany({
      where: {
        id_personalia: dataPersonalia.id,
      },
    });
    return NextResponse.json({
      message: "Ok",
      pelatihan: toJson(pelatihanRes),
      keluarga: toJson(keluargaRes),
      pendidikan: toJson(pendidikanRes),
      karir: toJson(karirRes),
      sk: toJson(skRes),
    });
  }

  return NextResponse.json({ message: "End" });
}
