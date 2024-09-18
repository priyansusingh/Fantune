"use client";
import { signIn, signOut, useSession } from "next-auth/react"
import { MusicIcon} from "lucide-react"
import Link from "next/link"

export const Appbar = () =>{
    const session = useSession();
    return <div>
      <header className="px-4 lg:px-6 h-14 flex items-center bg-gray-800">
        <Link className="flex items-center justify-center" href="#">
          <MusicIcon className="h-6 w-6 text-purple-400" />
          <span className="ml-2 text-lg font-bold text-purple-400">FanTune</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          {session.data?.user && <button className="m-2 p-2 bg-blue-400" onClick={()=> signOut()}>Logout</button>}
          {!session.data?.user && <button className="m-2 p-2 bg-blue-400" onClick={()=> signIn()}>Signin</button>} 
        </nav>
      </header>
        </div>
}