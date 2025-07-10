export type bagianType = {
  id: string;
  klasifikasi: string;
  nama_bagian: string;
};
export type golonganType = {
  id: string;
  nama_golongan: string;
};
export type jabatanType = {
  id: string;
  jabatan: string;
};
export type pangkatType = {
  id: string;
  nama_pangkat: string;
};
export type statusType = {
  id: number;
  nama_status: string;
};
export type unitKerjaType = {
  id: string;
  nama_unit: string;
};
export type penggunaT = {
  id: number;
  username: string;
  profil_image: string;
  password_hash: string;
  reset_hash: string;
  reset_at: string;
  reset_expires: string;
  activate_hash: string;
  status: string;
  status_message: string;
  active: string;
  force_pass_reset: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  id_personalia: string;
  last_uuid: string;
  v2_hash: string;
  nama: string;
  user_id: number;
  nik: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  tmt: string;
  jenis_kelamin: string;
  pendidikan: string;
  status_kawin: string;
  jumlah_anak: string;
  jabatan: string;
  unit_kerja: string;
  bagian: string;
  klasifikasi: string;
  gol: string;
  pangkat: string;
  masa_kerja: string;
  masa_kerja_gol: string;
  sisa_masa_kerja: string;
  umur: string;
  tanggal_pensiun: string;
  email: string;
  kk: string;
  ktp: string;
  efin: string;
  bpjskt: string;
  bpjs: string;
  dapenmapamsi: string;
  polis: string;
  hp: string;
  telpon: string;
  simc: string;
  paspor: string;
  simpeda: string;
  gol_darah: string;
  agama: string;
  nama_ibu: string;
  nama_ayah: string;
  anak_nomor: string;
  jml_saudara: string;
  alamat: string;
  status_pegawai: string;
  npwp: string;
  simab: string;
  tanggal_menikah: string;
  hash: string;
  level: string;
  mk_gaji: number;
  id_mesin_absen: string;
  id_lokasi: number;
  device?: string;
  platform?: string;
  data_profil_image?: string;
};
export type absenT = {
  id_personalia: number;
  id_absensi: number;
  nik: string;
  nama: string;
  bagian: string;
  nama_lokasi: string;
  // periode: string;
  terlambat: number;
  // pulang_cepat: number;
  total_lembur: string;
  // aturan_jam: string;
  total_jam: string;
  jam_masuk:string;
  jam_keluar:string;
  // total_kurang_jam: string;
  // total_hari_kerja: number;
  // total_hari_alpha: number;
  // total_hari_lupa: number;
  // total_hari_istirahat: number;
  // total_ijin_cuti: number;
  // total_hari_libur: number;
};
export type absenSekarangT = {
  id: number;
  tanggal: string;
  jam_masuk: string | null;
  jam_keluar: string | null;
  jam_lembur_masuk: string | null;
  jam_lembur_keluar: string | null;
  hari?: string;
};
type genderAge={
  gender:string,
  age:number
}
// {"facialId":"3b43fa65a7c3483a807efbed4166a8f2fioa715c","timestamp":"2023-12-06T07:17:30","details":{"gender":"male","age":31}}
export type userInfoFacialT={
  facialId:string,
  timestamp:string,
  details:genderAge
}
export type facialPayload={
  user_id:number;
  name:string;
  email:string;
  personalia_id:number;
}
export type facialT={
  facialId:string;
  payload:facialPayload;
  timestamp?:string;
  details?:genderAge;
}
export type profilT = {
  id?: string;
  user_id?: string;
  agama: string;
  alamat: string;
  bagian: string;
  bpjs: string;
  bpjskt: string;
  dapenmapamsi: string;
  efin: string;
  email: string;
  gol: string;
  gol_darah: string;
  hash?: string;
  hp: string;
  id_mesin_absen?: string;
  jabatan: string;
  jenis_kelamin: "Laki-Laki" | "Perempuan" | "";
  kk: string;
  ktp: string;
  nama: string;
  nik: string;
  npwp: string;
  pangkat: string;
  pendidikan: string;
  polis: string;
  profil_image: string;
  simab: string;
  simc: string;
  simpeda: string;
  status_kawin: "Kawin" | "Belum Kawin" | "";
  status_pegawai: string;
  tanggal_lahir: string;
  tempat_lahir: string;
  unit_kerja: string;
  username: string;
  tanggal_menikah?: string;
  uname?: string;
};
export type absensiT = {
  id: number;
  status: string;
  tanggal: string;
  status_absensi: string;
  jam_masuk: string;
  jam_keluar: string;
  jam_lembur_masuk: string;
  jam_lembur_keluar: string;
  lama_lembur: string;
  terlambat: string;
  jumlah_jam: string;
  catatan: string;
  id_personalia: number;
  id_status: string;
};
export type cust = {
  nosamw: string;
  noreg: string;
  jlw: string;
  nama: string;
  alamat: string;
  rt: string;
  rw: string;
  kd_kelurahan: string;
  desa: string;
  kd_kecamatan: string;
  kecamatan: string;
  job_plg: string;
  jml_org: number;
  tgl_daf: string;
  tgl_pas: string;
  tgl_stat: string;
  tgl_diakui: string;
  ujl: number;
  dnmet: number;
  no_met: string;
  merk_met: string;
  tgl_met: string;
  dia_met: string;
  stat_smb: string;
  opr: string;
  loket: string;
  ptgs_met: string;
  ptgs_gbr: string;
  piu_sb: number;
  jang_sb: number;
  nang_sb: number;
  pang_sb: string;
  telp: string;
  ktp: string;
  pemasang: string;
  no_byrsmb: string;
  tgl_byr: string;
  tgl_ref: string;
  no_ref: string;
  no_rab: string;
  tgl_rab: string;
  no_bppi: string;
  tgl_bppi: string;
  no_spk: string;
  no_reff: string;
  tgl_spk: string;
  loketkol: string;
  kodepos: string;
  no_reg: string;
  tgl_reg: string;
  urstat_smb: string;
  bregist: number;
  badm: number;
  bsmbr: number;
  bujl: number;
  bpipa: number;
  blain: number;
  ppn: number;
  urjlw: string;
  urjlwp: string;
  ketmet: string;
  namaold: string;
  nopm: string;
  post: string;
  tgl_sgl: string;
  tgb_sgl: string;
  tgl_cbt: string;
  tgb_cbt: string;
  tgl_ttp: string;
  no_spko: string;
  tgl_spko: string;
  alir: string;
  nosamold: string;
  idgol: string;
  kd_jalan: string;
  met_akhir: number;
  Tgl_Ganti: string;
  jns_pelanggan: string;
  status: string;
  listrik: string;
  noKK: string;
  ampere: string;
  lat: number;
  lon: number;
  telp2: string;
};
export type filesT = {
  id?: number;
  nama_file: string;
  path: string;
  public: number;
  id_jabatan: number;
  jabatan: string;
  id_bagian: number;
  nama_bagian: string;
  id_unit: number;
  nama_unit: string;
  owner_id_personalia: number;
  nama_personalia: string;
  owner_id_user: number;
  username: string;
  width: number;
  height: number;
  alias: string;
  type:
    | "image/jpg"
    | "image/jpeg"
    | "image/png"
    | "application/pdf"
    | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    | "application/vnd.ms-excel"
    | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    | "application/msword";
  title?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  is_deleted?: string;
  protected?: number;
  file?: File;
  blobString?: string;
};
export type permissionT = {
  id: number;
  name: string;
  description: string;
};
export type helperType = {
  bagian: bagianType[];
  golongan: golonganType[];
  jabatan: jabatanType[];
  pangkat: pangkatType[];
  status: statusType[];
  unitKerja: unitKerjaType[];
  lokasi: lokasiT[];
};
export type percepatanNrwType = {
  id?: number;
  foto_rumah_name: string;
  foto_rumah_path: string;
  foto_sr_name: string;
  foto_sr_path: string;
  nosamw: string;
  nama: string;
  alamat?: string;
  permasalahan: string;
  telp: string;
  lat: number;
  lon: number;
  lat_rumah: number;
  lon_rumah: number;
  username: string;
  tindak_lanjut: string;
  dibuat: string;
  petugas: string;
};
export const percepatanNrwE: percepatanNrwType = {
  foto_rumah_name: "",
  foto_rumah_path: "",
  foto_sr_name: "",
  foto_sr_path: "",
  nosamw: "",
  nama: "",
  permasalahan: "",
  telp: "",
  lat: 0,
  lon: 0,
  lat_rumah: 0,
  lon_rumah: 0,
  username: "",
  tindak_lanjut: "",
  dibuat: "",
  petugas: "",
};
export type usersType = {
  id?: number;
  email: string;
  username: string;
  profil_image: string;
  password_hash: string;
  reset_hash: string;
  reset_at?: Date;
  reset_expires?: Date;
  activate_hash: string;
  status: string;
  status_message: string;
  active?: boolean;
  force_pass_reset?: boolean;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  id_personalia?: number;
  last_uuid?: string;
};
export type usersErrorType = {
  email: string;
  username: string;
  profil_image: string;
  password_hash: string;
  activate_hash: string;
  status: string;
  status_message: string;
  id_personalia: string;
  last_uuid: string;
};
export type personaliaType = {
  id?: number;
  nama: string;
  nik: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  tmt: string;
  jenis_kelamin: string;
  pendidikan: string;
  status_kawin: string;
  jumlah_anak: string;
  jabatan: string;
  unit_kerja: string;
  bagian: string;
  klasifikasi: string;
  gol: string;
  pangkat: string;
  masa_kerja: string;
  masa_kerja_gol: string;
  sisa_masa_kerja: string;
  umur: string;
  tanggal_pensiun: string;
  email: string;
  kk: string;
  ktp: string;
  efin: string;
  bpjskt: string;
  bpjs: string;
  dapenmapamsi: string;
  polis: string;
  hp: string;
  telpon: string;
  simc: string;
  paspor: string;
  simpeda: string;
  gol_darah: string;
  agama: string;
  nama_ibu: string;
  nama_ayah: string;
  anak_nomor: string;
  jml_saudara: string;
  alamat: string;
  status_pegawai: string;
  profil_image: string;
  npwp: string;
  simab: string;
  tanggal_menikah: string;
  username: string;
  hash: string;
  level: string;
  mk_gaji: number;
  id_mesin_absen: string;
  data_profil_image?: string;
  password: string;
  konfirm_password: string;
  id_lokasi: number;
};
export type fileT = {
  lastModified: number;
  lastModifiedDate?: string;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
  blob?: Blob;
  blobString?: string;
};
export type personaliaErrorType = {
  nama?: string | undefined;
  nik?: string | undefined;
  tempat_lahir?: string | undefined;
  tanggal_lahir?: string | undefined;
  tmt?: string | undefined;
  jenis_kelamin?: string | undefined;
  pendidikan?: string | undefined;
  status_kawin?: string | undefined;
  jumlah_anak?: string | undefined;
  jabatan?: string | undefined;
  unit_kerja?: string | undefined;
  bagian?: string | undefined;
  klasifikasi?: string | undefined;
  gol?: string | undefined;
  pangkat?: string | undefined;
  masa_kerja?: string | undefined;
  masa_kerja_gol?: string | undefined;
  sisa_masa_kerja?: string | undefined;
  umur?: string | undefined;
  tanggal_pensiun?: string | undefined;
  email?: string | undefined;
  kk?: string | undefined;
  ktp?: string | undefined;
  efin?: string | undefined;
  bpjskt?: string | undefined;
  bpjs?: string | undefined;
  dapenmapamsi?: string | undefined;
  polis?: string | undefined;
  hp?: string | undefined;
  telpon?: string | undefined;
  simc?: string | undefined;
  paspor?: string | undefined;
  simpeda?: string | undefined;
  gol_darah?: string | undefined;
  agama?: string | undefined;
  nama_ibu?: string | undefined;
  nama_ayah?: string | undefined;
  anak_nomor?: string | undefined;
  jml_saudara?: string | undefined;
  alamat?: string | undefined;
  status_pegawai?: string | undefined;
  profil_image?: string | undefined;
  npwp?: string | undefined;
  simab?: string | undefined;
  tanggal_menikah?: string | undefined;
  username?: string | undefined;
  hash?: string | undefined;
  level?: string | undefined;
  mk_gaji?: string | undefined;
  id_mesin_absen?: string | undefined;
  password?: string | undefined;
  data_profil_image?: string | undefined;
};
export const personaliaErrorE: personaliaErrorType = {
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
  data_profil_image: "",
};
export type pendidikanT = {
  id?: number;
  nama: string;
  tingkat: string;
  alamat: string;
  fakultas: string;
  jurusan: string;
  tahun: number;
  no_ijazah: string;
  id_personalia?: number;
  file_pendidikan?: File | string;
  path_file?: string;
  nama_file?: string;
};
export type keluargaT = {
  id?: number;
  nama: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  nomor_ktp: string;
  pekerjaan: string;
  agama: string;
  pendidikan: string;
  hubungan: string;
  tanggal: string;
  id_personalia?: number;
};
export type pelatihanT = {
  id?: number;
  jenis: string;
  penyelenggara: string;
  tahun: string;
  lokasi: string;
  id_personalia?: number;
  file_pelatihan?: File | string;
  path_file?: string;
  nama_file?: string;
};
export type skT = {
  id?: number;
  tanggal: string;
  nomor_sk: string;
  tmt: string;
  id_personalia: number;
  success: string;
  file_sk?: File | string;
  path_file?: string;
  nama_file?: string;
};
export type karirT = {
  id: number;
  bagian: string;
  tahun: string;
  status_pegawai: string;
  jabatan: string;
  id_personalia: number;
  unit_kerja: string;
  file_karir?: File | string;
  path_file?: string;
  nama_file?: string;
};
export type lokasiT = {
  id: number;
  nama_lokasi: string;
  lat: number;
  lon: number;
};

export const emptyUsers: usersType = {
  id: 0,
  email: "",
  username: "",
  profil_image: "",
  password_hash: "",
  reset_hash: "",
  activate_hash: "",
  status: "",
  status_message: "",
  active: true,
  id_personalia: 0,
  last_uuid: "",
};

export const emptyUsersError: usersErrorType = {
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

export const emptyPersonaliaError: personaliaErrorType = {
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
export const emptyPersonalia: personaliaType = {
  id: 0,
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
  mk_gaji: 0,
  id_mesin_absen: "",
  data_profil_image: "",
  password: "",
  konfirm_password: "",
  id_lokasi: 0,
};

export const pendidikanE: pendidikanT = {
  id: 0,
  nama: "",
  tingkat: "",
  alamat: "",
  fakultas: "",
  jurusan: "",
  tahun: 0,
  no_ijazah: "",
  id_personalia: 0,
  nama_file: "",
  path_file: "",
};

export const keluargaE: keluargaT = {
  id: 0,
  nama: "",
  tempat_lahir: "",
  tanggal_lahir: "",
  jenis_kelamin: "",
  nomor_ktp: "",
  pekerjaan: "",
  agama: "",
  pendidikan: "",
  hubungan: "",
  tanggal: "",
  id_personalia: 0,
};

export const pelatihanE: pelatihanT = {
  id: 0,
  jenis: "",
  penyelenggara: "",
  tahun: "",
  lokasi: "",
  id_personalia: 0,
  nama_file: "",
  path_file: "",
};

export const skE: skT = {
  id: 0,
  tanggal: "",
  nomor_sk: "",
  tmt: "",
  id_personalia: 0,
  success: "",
  nama_file: "",
  path_file: "",
};

export const karirE: karirT = {
  id: 0,
  bagian: "",
  tahun: "",
  status_pegawai: "",
  jabatan: "",
  id_personalia: 0,
  unit_kerja: "",
  nama_file: "",
  path_file: "",
};
