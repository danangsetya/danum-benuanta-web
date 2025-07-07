import RedirectPage from "@/components/pages/redirectPage";
import { facialT, permissionT, profilT } from "@/lib/types";
import { nowTrimDateTimeHM } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { req: string[] } }) {
  const timestamp = atob(params.req[0].toString());
  const errCode = atob(params.req[1].toString().replaceAll("%3D","="));
  const userData = atob(params.req[2].toString());
  const uData:facialT=JSON.parse(userData)
  console.log("timestamp",timestamp)
  console.log("times now",nowTrimDateTimeHM())
  console.log(params.req)
  console.log("errCode",errCode)
  console.log("userData",uData)
  const session=await getServerSession()
  if (timestamp!==nowTrimDateTimeHM()) redirect("/absensi/personal")
  // console.log("session",session)
  if (session!==undefined && session?.user?.email!==undefined && session.user.email!==null){
    const jsonSess:{permissions:permissionT[],profil:profilT}=JSON.parse(session?.user?.email)
    // console.log("JSON session",jsonSess)
    const profil=jsonSess.profil
    console.log("profil->",profil)
    if (profil.nama!==uData.payload.name ||profil.email!==uData.payload.email){
        // setTimeout(()=>{
        redirect("/absensi/personal")
        // console.log("redirect")
      // },2000)
      return (<div className="flex flex-col p-5 items-center">
       
        <span>Wajah Tidak sesuai dengan data profil personalia</span>
        <Link className="p-3 bg-sky-600 rounded-xl  w-36 flex-row items-center space-x-2 my-2 text-white font-bold text-center" href={"/absensi/personal"}>Kembali</Link>
      </div>)
    }
  }
  
  return <><h1>face error</h1></>
}
