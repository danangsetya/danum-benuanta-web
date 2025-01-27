import ContentDefault from "@/components/content";

export default function Page() {
  return (
    <section>
      <ContentDefault />
      <div className="flex flex-col mx-10">
        <h1 className="text-center my-3"> Cek Tagihan</h1>
        <input
          type="number"
          className="border-2 p-1 rounded-lg w-[300px] mx-auto"
          placeholder="Nomor Pelanggan contoh:0106370"
        />
        <button className="bg-lime-700 py-3 px-1 my-2 mx-auto rounded-lg text-slate-50 w-[300px] ">
          Cek Tagihan
        </button>
      </div>
    </section>
  );
}
