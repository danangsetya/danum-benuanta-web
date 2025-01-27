import PercepatanNrwAdd from "@/components/pages/percepatanNrwAdd";
import { authOptions } from "@/lib/auth";
import { permissionT } from "@/lib/types";
import { getServerSession } from "next-auth";

export default async function Page() {
  const session = await getServerSession(authOptions);
  const data = JSON.parse(session?.user?.email as string);

  return <PercepatanNrwAdd />;
}
