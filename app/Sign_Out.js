'use client'
import { signOut } from "next-auth/react"


export default function Sign_Out() {

    return(
        <button onClick={() => signOut()}>Se déconnecter</button>
    )
}