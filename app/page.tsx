import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MusicIcon, UsersIcon, RadioIcon } from "lucide-react"
import Link from "next/link"
import { Appbar } from "./components/Appbar"

export default function MusicStreamLandingDarkConcise() {
  return (
    <div>
    <Appbar/>
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-purple-300">
                Let Your Fans Choose the Beat
              </h1>
              <p className="mx-auto max-w-[600px] text-gray-300 md:text-xl">
                FanTune: Where creators and fans unite to create the perfect stream soundtrack.
              </p>
              <div className="space-x-4">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">Start Streaming</Button>
                <Button variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-950">Join as a Fan</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-8 text-purple-300">Key Features</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 text-center">
                <UsersIcon className="h-8 w-8 text-pink-400" />
                <h3 className="text-xl font-bold text-purple-300">Fan-Driven Playlists</h3>
                <p className="text-gray-400">Let your audience shape your stream&apos;s soundtrack in real-time.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <RadioIcon className="h-8 w-8 text-blue-400" />
                <h3 className="text-xl font-bold text-purple-300">Live Interaction</h3>
                <p className="text-gray-400">Engage with your fans through music choices and live chat.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center md:col-span-2 lg:col-span-1">
                <MusicIcon className="h-8 w-8 text-green-400" />
                <h3 className="text-xl font-bold text-purple-300">Personalized Experience</h3>
                <p className="text-gray-400">Tailor your stream to your audience&apos;s musical preferences.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-gray-800 to-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-purple-300">Ready to Revolutionize Your Streams?</h2>
              <p className="max-w-[600px] text-gray-300 md:text-xl">
                Join FanTune today and start creating unforgettable music experiences.
              </p>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1 bg-gray-700 text-gray-100 placeholder-gray-400 border-gray-600 focus:border-purple-400"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">Sign Up</Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-700 bg-gray-800">
        <p className="text-xs text-gray-400">© 2023 FanTune. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-purple-400" href="#">
            Terms
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-purple-400" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
    </div>
  )
}