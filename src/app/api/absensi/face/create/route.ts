import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { facialPayload, userInfoFacialT } from "@/lib/types";
import { httpStatus, nowTrimDateTimeHM } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){
    const session=await getServerSession(authOptions)
    if (!session)
        return NextResponse.json(
          { message: "Unauthorized" },
          { status: httpStatus.Unauthorized }
        );
    const req:{timestamp:string,userData:facialPayload,userInfo:userInfoFacialT}=await request.json()
    console.log("request->",req)
    if (req.timestamp!==nowTrimDateTimeHM()) return NextResponse.json({message:"redirect","redirect":"/absensi/personal"})
    if (session!=null && session!==undefined && session.user!==undefined){
        if (req.userData.personalia_id!==0 && req.userData.user_id!==0 &&  req.userInfo.facialId!==""){
        const savePersonalia=await prisma.personalia.update({
            where:{
                id:req.userData.personalia_id
            },
            data:{
                id_mesin_absen:"valid",
                hash:req.userInfo.facialId,
            }
        })
        const saveUser=await prisma.users.update({
            where:{
                id:req.userData.user_id
            },
            data:{
                activate_hash:req.userInfo.facialId,
                v2_hash: JSON.stringify(req.userInfo.details)
            }
        })
        console.log(savePersonalia,saveUser)
        if (savePersonalia && saveUser) return NextResponse.json({message:"redirect","redirect":"/logout"})
        }
    }

        return NextResponse.json({"message":"End"})
}