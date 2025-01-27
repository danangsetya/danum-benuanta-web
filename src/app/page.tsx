import { getServerSession } from "next-auth";
import ContentDefault from "../components/content";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);
  // console.log("session->", session);
  if (!session) {
    redirect("/login");
  } else {
    redirect("/profil");
  }
  return (
    <>
      {/* <ContentDefault /> */}
      <h1 className="text-center"> bY mE</h1>
    </>
  );
}
