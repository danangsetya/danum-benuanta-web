import { personalia } from "./../../../../../../prisma/generated/client1/index.d";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  karirT,
  keluargaT,
  pelatihanT,
  pendidikanT,
  penggunaT,
  personaliaErrorE,
  personaliaErrorType,
  personaliaType,
  skT,
  usersErrorType,
} from "@/lib/types";
import { httpStatus, now, toJson, validateEmail } from "@/lib/utils";
import { genSalt, hash } from "bcryptjs";
import { mkdir, stat, writeFile } from "fs/promises";
import md5 from "md5";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: httpStatus.Unauthorized }
    );
  const uid = md5(JSON.stringify(session));
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
  // return NextResponse.json(
  //   { message: "cek" },
  //   { status: httpStatus.BadRequest }
  // );
  const emptyUsersError: usersErrorType = {
    email: "",
    username: "",
    profil_image: "",
    password_hash: "",
    activate_hash: "",
    status: "",
    status_message: "",
    id_personalia: "",
    last_uuid: "",
  };

  const emptyPersonaliaError: personaliaErrorType = {
    nama: "",
    nik: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    tmt: "",
    jenis_kelamin: "",
    pendidikan: "",
    status_kawin: "",
    jumlah_anak: "",
    jabatan: "",
    unit_kerja: "",
    bagian: "",
    klasifikasi: "",
    gol: "",
    pangkat: "",
    masa_kerja: "",
    masa_kerja_gol: "",
    sisa_masa_kerja: "",
    umur: "",
    tanggal_pensiun: "",
    email: "",
    kk: "",
    ktp: "",
    efin: "",
    bpjskt: "",
    bpjs: "",
    dapenmapamsi: "",
    polis: "",
    hp: "",
    telpon: "",
    simc: "",
    paspor: "",
    simpeda: "",
    gol_darah: "",
    agama: "",
    nama_ibu: "",
    nama_ayah: "",
    anak_nomor: "",
    jml_saudara: "",
    alamat: "",
    status_pegawai: "",
    profil_image: "",
    npwp: "",
    simab: "",
    tanggal_menikah: "",
    username: "",
    hash: "",
    level: "",
    mk_gaji: "",
    id_mesin_absen: "",
    password: "",
  };
  // let errorInput = { ...emptyPersonaliaError, ...emptyUsersError };
  let errorInput: personaliaErrorType | usersErrorType = {};
  if (!validateEmail(personalia.email)) errorInput.email = "Tidak Valid";
  if (personalia.nama.length < 3) {
    errorInput.nama = "Tidak Boleh Kosong";
  }
  if (personalia.jabatan == "") {
    errorInput.jabatan = "Tidak Boleh Kosong";
  }
  if (personalia.bagian == "") {
    errorInput.bagian = "Tidak Boleh Kosong";
  }
  if (personalia.unit_kerja == "") {
    errorInput.unit_kerja = "Tidak Boleh Kosong";
  }
  if (personalia.telpon.length <= 10) errorInput.telpon = "Tidak Boleh Kosong";
  if (personalia.username == "") {
    errorInput.username = "Tidak Boleh Kosong";
  } else {
    const cariUsername = await prisma.users.findUnique({
      where: {
        username: personalia.username,
      },
    });
    if (cariUsername !== null) {
      errorInput.username = "Username Tidak Tersedia";
    }
  }
  if (
    personalia.password.length <= 5 ||
    personalia.password !== personalia.konfirm_password
  ) {
    errorInput.password = " Harus Lebih dari 6 Karakter";
  }
  if (Object.keys(errorInput).length > 0) {
    return NextResponse.json(
      { message: "Error", error: errorInput },
      { status: httpStatus.Accepted }
    );
  }

  if (
    pendidikanFiles.length > 0 ||
    pelatihanFiles.length > 0 ||
    skFiles.length > 0 ||
    karirFiles.length > 0
  ) {
    const pathwUsername = `files/${personalia.username}`;
    const path = `public/${pathwUsername}`;
    const pathNoPublic = `${pathwUsername}`;
    try {
      const statFolder = await stat(path);
    } catch (error) {
      await mkdir(path, { recursive: true });
    }
  }

  const salt = await genSalt(10);
  const password_hash = await hash(personalia.password, salt);
  if (personalia) {
    try {
      const personaliaAdd = await prisma.personalia.create({
        data: {
          // username: personalia.username,
          // email: personalia.email,
          // nama: personalia.nama.toUpperCase(),
          // telpon: personalia.telpon,
          // hash: password_hash,
          level: "2",
          // tanggal_menikah: "",
          nama: personalia.nama.toUpperCase(),
          nik: personalia.nik,
          email: personalia.email,
          status_kawin: personalia.status_kawin,
          tanggal_menikah:
            personalia.tanggal_menikah !== ""
              ? new Date(personalia.tanggal_menikah)
              : new Date(),
          telpon: personalia.hp,
          hp: personalia.hp,
          tempat_lahir: personalia.tempat_lahir,
          tanggal_lahir:
            personalia.tanggal_lahir !== ""
              ? new Date(personalia.tanggal_lahir)
              : new Date(),
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
      });
      if (personaliaAdd) {
        console.log("personaliaAdd->", personaliaAdd);
        const jsonP = toJson(personaliaAdd);
        const usersAdd = await prisma.users.create({
          data: {
            v2_hash: "",
            username: personalia.username,
            password_hash: password_hash,
            email: personalia.email,
            active: true,
            force_pass_reset: false,
            id_personalia: personaliaAdd.id,
            last_uuid: uid,
          },
        });
        const dataJabatan = await prisma.jabatan.findFirst({
          where: {
            jabatan: personalia.jabatan,
          },
        });
        const dataBagian = await prisma.bagian.findFirst({
          where: {
            nama_bagian: personalia.bagian,
          },
        });
        const dataUnit = await prisma.unitkerja.findFirst({
          where: {
            nama_unit: personalia.unit_kerja,
          },
        });
        const dataUser = await prisma.users.findFirst({
          where: {
            id_personalia: personalia.id,
          },
        });
        const pathwUsername = `files/${personalia.username}`;
        const path = `public/${pathwUsername}`;
        const pathNoPublic = `${pathwUsername}`;
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
        if (keluarga !== undefined) {
          keluarga.forEach(async (item) => {
            const result = await prisma.keluarga.create({
              data: {
                agama: item.agama,
                hubungan: item.hubungan,
                id_personalia: personaliaAdd.id,
                tempat_lahir: item.tempat_lahir,
                tanggal_lahir:
                  item.tanggal_lahir == "" ? null : item.tanggal_lahir,
                nama: item.nama,
                jenis_kelamin: item.jenis_kelamin,
                nomor_ktp: item.nomor_ktp,
                pekerjaan: item.pekerjaan,
                pendidikan: item.pendidikan,
                tanggal: new Date(now),
              },
            });
            console.log(`result keluarga ->`, result);
          });
        }
        if (pendidikan !== undefined) {
          pendidikan.forEach(async (item) => {
            const result = await prisma.pendidikan.create({
              data: {
                id_personalia: personaliaAdd.id,
                nama: item.nama,
                tingkat: item.tingkat,
                alamat: item.alamat,
                fakultas: item.fakultas,
                jurusan: item.jurusan,
                tahun: item.tahun,
                no_ijazah: item.no_ijazah,
              },
            });
            console.log(`result pendidikan ->`, result);
            if (pendidikanFiles.length > 0 && item.nama_file !== undefined) {
              pendidikanFiles.forEach(async (xx) => {
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
              });
            }
          });
        }
        if (pelatihan !== undefined) {
          pelatihan.forEach(async (item) => {
            const result = await prisma.pelatihan.create({
              data: {
                id_personalia: personaliaAdd.id,
                jenis: item.jenis,
                penyelenggara: item.penyelenggara,
                tahun: item.tahun,
                lokasi: item.lokasi,
              },
            });
            console.log(`result pelatihan ->`, result);
            if (pelatihanFiles.length > 0 && item.nama_file !== undefined) {
              pelatihanFiles.forEach(async (xx) => {
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
              });
            }
          });
        }
        if (sk !== undefined) {
          sk.forEach(async (item) => {
            const result = await prisma.sk.create({
              data: {
                id_personalia: personaliaAdd.id,
                tanggal: item.tanggal == "" ? null : new Date(item.tanggal),
                nomor_sk: item.nomor_sk,
                tmt: item.tmt == "" ? null : new Date(item.tmt),
                success: item.success,
              },
            });
            console.log(`result sk ->`, result);
            if (skFiles.length > 0 && item.nama_file !== undefined) {
              skFiles.forEach(async (xx) => {
                const file: File = xx as File;
                if (file.name == item.nama_file) {
                  const byteF = await file.arrayBuffer();
                  const bufferF = Buffer.from(byteF);
                  const aType = file.type.split("/");
                  const newString = item.nomor_sk.replace(/[^A-Z0-9]+/gi, "-");
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
              });
            }
          });
        }
        if (karir !== undefined) {
          karir.forEach(async (item) => {
            const result = await prisma.karir.create({
              data: {
                id_personalia: personaliaAdd.id,
                bagian: item.bagian,
                tahun: item.tahun,
                status_pegawai: item.status_pegawai,
                jabatan: item.jabatan,
                unit_kerja: item.unit_kerja,
              },
            });
            console.log(`result karir ->`, result);
            if (karirFiles.length > 0 && item.nama_file !== undefined) {
              karirFiles.forEach(async (xx) => {
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
              });
            }
          });
        }
        if (usersAdd)
          return NextResponse.json(
            { message: "Data Tersimpan" },
            { status: httpStatus.Ok }
          );
      }
      // console.log("personalia add->", personaliaAdd);
    } catch (error) {
      console.error(error);
    }
  }
  return NextResponse.json(
    { message: "End" },
    { status: httpStatus.BadRequest }
  );
}
