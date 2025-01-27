import {
  char,
  date,
  decimal,
  mysqlTable,
  varchar,
} from "drizzle-orm/mysql-core";

export const cust = mysqlTable("cust", {
  nosamw: char("nosamw", { length: 7 }).default("-"),
  noreg: char("noreg", { length: 10 }).default("-"),
  jlw: char("jlw", { length: 2 }).default("-"),
  nama: char("nama", { length: 50 }).default("-"),
  alamat: char("", { length: 100 }).default("-"),
  rt: char("rt", { length: 4 }).default("-"),
  rw: char("rw", { length: 4 }).default("-"),
  kd_kelurahan: char("kd_keluarahan", { length: 4 }).default("-"),
  desa: char("desa", { length: 50 }).default("-"),
  kd_kecamatan: char("kd_kecamatan", { length: 2 }).default("-"),
  kecamatan: char("kecamatan", { length: 50 }).default("-"),
  job_plg: char("job_plg", { length: 50 }).default("-"),
  jml_org: decimal("jml_org").default("0"),
  tgl_daf: date("tgl_daf").default(new Date("1945-08-17")),
  tgl_pas: date("tgl_pas").default(new Date("1945-08-17")),
  tgl_stat: date("tgl_stat").default(new Date("1945-08-17")),
  tgl_diakui: date("tgl_diakui").default(new Date("1945-08-17")),
  ujl: decimal("uji").default("0"),
  dnmet: decimal("dnmet").default("0"),
  no_met: char("no_met", { length: 20 }).default("-"),
  merk_met: char("merk_met", { length: 25 }).default("-"),
  tgl_met: date("tgl_met").default(new Date("1945-08-17")),
  dia_met: char("dia_met", { length: 5 }).default("-"),
  stat_smb: char("stat_smb", { length: 2 }).default("-"),
  opr: char("opr", { length: 25 }).default("-"),
  loket: char("loket", { length: 2 }).default("-"),
  ptgs_met: char("ptgs_met", { length: 2 }).default("-"),
  ptgs_gbr: char("ptgs_gbr", { length: 10 }).default("-"),
  piu_sb: decimal("jml_org").default("0"),
  jang_sb: decimal("jml_org").default("0"),
  nang_sb: decimal("jml_org").default("0"),
  pang_sb: char("pang_sb", { length: 6 }).default("-"),
  telp: char("telp", { length: 20 }).default("-"),
  ktp: char("ktp", { length: 20 }).default("-"),
  pemasang: char("pemasang", { length: 4 }).default("-"),
  no_byrsmb: char("no_byrsmb", { length: 4 }).default("-"),
  tgl_byr: date("tgl_byr").default(new Date("1945-08-17")),
  tgl_ref: date("tgl_ref").default(new Date("1945-08-17")),
  no_ref: char("no_ref", { length: 25 }).default("-"),
  no_rab: char("no_rab", { length: 25 }).default("-"),
  tgl_rab: date("tgl_rab").default(new Date("1945-08-17")),
  no_bppi: char("no_bppi", { length: 25 }).default("-"),
  tgl_bppi: date("tgl_bppi").default(new Date("1945-08-17")),
  no_spk: char("no_spk", { length: 25 }).default("-"),
  no_reff: char("no_reff", { length: 25 }).default("-"),
  tgl_spk: date("tgl_spk").default(new Date("1945-08-17")),
  loketkol: char("loketkol", { length: 3 }).default("-"),
  kodepos: char("", { length: 6 }).default("-"),
  no_reg: char("", { length: 4 }).default("-"),
  tgl_reg: char("", { length: 4 }).default("-"),
  urstat_smb: char("", { length: 4 }).default("-"),
  bregist: char("", { length: 4 }).default("-"),
  badm: char("", { length: 4 }).default("-"),
  bsmbr: char("", { length: 4 }).default("-"),
  bujl: char("", { length: 4 }).default("-"),
  bpipa: char("", { length: 4 }).default("-"),
  blain: char("", { length: 4 }).default("-"),
  ppn: char("", { length: 4 }).default("-"),
  urjlw: char("", { length: 4 }).default("-"),
  urjlwp: char("", { length: 4 }).default("-"),
  ketmet: char("", { length: 4 }).default("-"),
  namaold: char("", { length: 4 }).default("-"),
  nopm: char("", { length: 4 }).default("-"),
  post: char("", { length: 4 }).default("-"),
  tgl_sgl: char("", { length: 4 }).default("-"),
  tgb_sgl: char("", { length: 4 }).default("-"),
  tgl_cbt: char("", { length: 4 }).default("-"),
  tgb_cbt: char("", { length: 4 }).default("-"),
  tgl_ttp: char("", { length: 4 }).default("-"),
  no_spko: char("", { length: 4 }).default("-"),
  tgl_spko: char("", { length: 4 }).default("-"),
  alir: char("", { length: 4 }).default("-"),
  nosamold: char("", { length: 4 }).default("-"),
  idgol: char("", { length: 4 }).default("-"),
  kd_jalan: char("", { length: 4 }).default("-"),
  met_akhir: char("", { length: 4 }).default("-"),
  Tgl_Ganti: char("", { length: 4 }).default("-"),
  jns_pelanggan: char("", { length: 4 }).default("-"),
  status: char("", { length: 4 }).default("-"),
  listrik: char("", { length: 4 }).default("-"),
  noKK: char("", { length: 4 }).default("-"),
  ampere: char("", { length: 4 }).default("-"),
  lat: char("", { length: 4 }).default("-"),
  lon: char("", { length: 4 }).default("-"),
  telp2: char("", { length: 4 }).default("-"),
});
