import AbsensiPersonal from "@/components/pages/absensiPersonal";

export default function Page() {
  const backUrl = process.env.BACK_URL;
  const mainUrl = process.env.MAIN_URL;
  return (
    <div className="flex flex-col">
      <h1 className="text-center text-[#16a34a] font-extrabold text-3xl tracking-widest mt-2">
        {/* {"DANUM BENUANTA"} */}
      </h1>
      <h1 className="text-center text-[#16a34a] font-extrabold text-lg tracking-tighter">
        SISTEM ABSENSI DIGITAL
      </h1>

      <AbsensiPersonal uri={backUrl} main={mainUrl as string} />
    </div>
  );
}
