import { prisma } from "@/lib/prisma";
import { facialPayload, userInfoFacialT } from "@/lib/types";
import { nowTrimDateTimeHM } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { req: string[] } }) {
  const timestamp = atob(params.req[0].toString().replaceAll("%3D","="));
  const userInfo:userInfoFacialT= JSON.parse(atob(params.req[1].toString().replaceAll("%3D","=")));
  const userData:facialPayload =JSON.parse(atob(params.req[2].toString().replaceAll("%3D","="))) ;
  console.log("timestamp->",timestamp,nowTrimDateTimeHM())
  console.log("userInfo->",userInfo)
  console.log("userData->",userData)
  const session=await getServerSession()
    if (timestamp!==nowTrimDateTimeHM()) redirect("/absensi/personal")
    if (session!==undefined && session?.user?.email!==undefined && session.user.email!==null){
        console.log("here")
    if(userData.personalia_id!==0 &&userData.user_id!==0 &&userData.name==session.user.name && userInfo.facialId!==""){
         console.log("here")
        const savePersonalia=await prisma.personalia.update({
            where:{
                id:userData.personalia_id
            },
            data:{
                id_mesin_absen:"valid",
                hash:userInfo.facialId,
            }
        })
        const saveUser=await prisma.users.update({
            where:{
                id:userData.user_id
            },
            data:{
                activate_hash:userInfo.facialId,
                v2_hash: JSON.stringify(userInfo.details)
            }
        })
        console.log(savePersonalia,saveUser)
        if (savePersonalia && saveUser) redirect("/absensi/personal")
    }
    }
     return <><h1>face created</h1></>

}