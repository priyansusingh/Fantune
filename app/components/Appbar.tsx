"use client";
import { signIn, signOut, useSession } from "next-auth/react"

export const Appbar = () =>{
    const session = useSession();
    return <div>
        <div className="flex justify-between">
        <div>
        Muzi    
        </div>
        <div>
        {session.data?.user && <button className="m-2 p-2 bg-blue-400" onClick={()=> signOut()}>Logout</button>}
       {!session.data?.user && <button className="m-2 p-2 bg-blue-400" onClick={()=> signIn()}>Signin</button>} 
        </div>
    </div>
    </div>
}