import { prisma } from "@/lib/prisma";
import { facialT, permissionT, profilT } from "@/lib/types";
import { getServerSession } from "next-auth";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { req: string[] } }) {
 const timestamp = atob(params.req[0].toString().replaceAll("%3D","="));
  const userInfo:facialT= JSON.parse(atob(params.req[1].toString().replaceAll("%3D","=")));
  const session=await getServerSession()
  if (session && session?.user?.email!==undefined &&session.user.email!==null){
const user:{permissions:permissionT[],profil:profilT}=JSON.parse(session?.user?.email)
console.log("user->",user)
if (userInfo.facialId!=="" && userInfo.payload.user_id!==0 && userInfo.payload.personalia_id!==0 ){

 const savePersonalia=await prisma.personalia.update({
            where:{
                id:userInfo.payload.personalia_id
            },
            data:{
                id_mesin_absen:"valid",
                hash:userInfo.facialId,
            }
        })
        const saveUser=await prisma.users.update({
            where:{
                id:userInfo.payload.user_id
            },
            data:{
                activate_hash:userInfo.facialId,
                v2_hash: JSON.stringify({gender:"",age:0})
            }
        })
        console.log(savePersonalia,saveUser)
        if (savePersonalia && saveUser) {
            redirect("/logout")
        }
  }
  }
  
  console.log("timestamp->",timestamp)
  console.log("userInfo->",userInfo)
  console.log("session->",session)
  
  return <>
  <h1>Face Replace</h1>
  </>

}