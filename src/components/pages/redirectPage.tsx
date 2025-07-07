'use client'

import { redirect } from "next/navigation"
import { useEffect, useLayoutEffect } from "react"

export default function RedirectPage({pageUri,delay=1000}:{pageUri:string,delay:number}){
useEffect(()=>{
    setTimeout(()=>{
        console.log("tes")
        redirect(pageUri)
    },delay)
},[])
    return <>lol</>
}