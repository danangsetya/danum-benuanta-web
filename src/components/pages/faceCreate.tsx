'use client'

import { facialPayload, userInfoFacialT } from "@/lib/types";
import { getSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function FaceCreate({timestamp,userInfo,userData}:{timestamp:string,userInfo:userInfoFacialT,userData:facialPayload}){
  const router = useRouter();
    async function getSess(){
      console.log(timestamp+"!=='' && "+userInfo.facialId+"!=='' &&u"+userData.name+"!==");
        if (timestamp!=="" && userInfo.facialId!=="" && userData.name!==""){
            // const session=await getSession()
          fetch("/api/absensi/face/create",{
            method:"POST",
            headers:{
              "Content-Type":"application/json"
            },
            body:JSON.stringify({timestamp:timestamp,userInfo})
            
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
    },[timestamp,userInfo,userData])
    return <div className="flex flex-1 items-center w-full">
      <h1 className="text-center">Face Created Loading ...</h1>
    </div>
}