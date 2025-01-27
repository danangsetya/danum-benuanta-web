import ContentDefault from "@/components/content";
import ProfilC from "@/components/pages/profil";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default async function Page() {
  const session = await getServerSession(authOptions);
  const data = JSON.parse(session?.user?.email as string);
  return (
    <section>
      <ContentDefault />
      <div className="flex flex-col mx-10">
        <h1 className="text-center my-3 font-bold">Profil Pengguna</h1>
        <h1 className="uppercase font-bold text-center">
          {data.profil.nama} ({data.profil.gol})
        </h1>
        <h1 className="uppercase underline font-light text-center">
          {data.profil.pangkat}
        </h1>
        <h1 className="uppercase  font-light text-center">
          BAGIAN {data.profil.bagian}
        </h1>
        <ProfilC />
      </div>
    </section>
  );
}
