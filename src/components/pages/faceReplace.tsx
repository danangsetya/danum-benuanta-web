'use client'

import { facialPayload, facialT, userInfoFacialT } from "@/lib/types";
import { getSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function FaceReplace({timestamp,userInfo}:{timestamp:string,userInfo:facialT}){
  const router = useRouter();
    async function getSess(){
      console.log(timestamp+"!=='' && "+userInfo.facialId+"!=='' &&");
        if (timestamp!=="" && userInfo.facialId!=="" && userInfo.payload.user_id!==0 && userInfo.payload.personalia_id!==0){
            // const session=await getSession()
          fetch("/api/absensi/face/replace",{
            method:"POST",
            headers:{
              "Content-Type":"application/json"
            },
            body:JSON.stringify({timestamp,userInfo})
            
          }).then(res => res.json())
          .then(res=>{
            console.log("res absensi face->",res)
           if (res.message == "redirect"){
            router.replace(res.redirect)
           }
          })
          .catch(err => console.log("err absensi face->",err))
        }
    }
    useEffect(()=>{
      getSess()
    },[timestamp,userInfo])
    return <div className="flex flex-1 items-center w-full">
      <h1 className="text-center">Face Replace Loading ...</h1>
    </div>
}