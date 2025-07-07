'use client'

import { signOut } from "next-auth/react"
import { useEffect } from "react"

export default function Logout(){
    async function logOut(){
        const res=await signOut({ callbackUrl: "/login" })
        console.log("res signout->",res)
    }
    useEffect(()=>{
        logOut()
    },[])
    return <>Logout...</>
}