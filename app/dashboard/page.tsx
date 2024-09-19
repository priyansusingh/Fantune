"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, Music, Plus } from "lucide-react"
import Image from "next/image"
import axios from "axios"
import { Appbar } from "../components/Appbar"

interface Video {
  id: string
  title: string
  votes: number
  thumbnail: string
}

const REFRESH_INTERVAL_MS = 10 * 1000;

export default function Dashboard() {
  const [videos, setVideos] = useState<Video[]>([
    { id: "dQw4w9WgXcQ", title: "Rick Astley - Never Gonna Give You Up", votes: 15, thumbnail: "" },
    { id: "9bZkp7q19f0", title: "PSY - GANGNAM STYLE", votes: 12, thumbnail: "" },
    { id: "kJQP7kiw5Fk", title: "Luis Fonsi - Despacito ft. Daddy Yankee", votes: 10, thumbnail: "" },
  ])
  const [newVideoLink, setNewVideoLink] = useState("")
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null)

  async function  refreshStreams() {
    const res = axios.get(`/api/streams/my`,{
      withCredentials:true
    });
    console.log(res);
  }

  useEffect(()=>{
    const interval = setInterval(() => {
      refreshStreams();
    }, REFRESH_INTERVAL_MS);
  })

  useEffect(() => {
    if (videos.length > 0 && !currentVideo) {
      setCurrentVideo(videos[0])
      setVideos(videos.slice(1))
    }
  }, [videos, currentVideo])

  const handleVote = (id: string, increment: boolean) => {
    setVideos(videos.map(video => 
      video.id === id ? { ...video, votes: video.votes + (increment ? 1 : -1) } : video
    ).sort((a, b) => b.votes - a.votes))

    fetch("/api/streams/upvote",{
      method: "POST",
      body: JSON.stringify({
        streamId:id
      })
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newVideoLink) {
      const videoId = extractVideoId(newVideoLink)
      if (videoId) {
        try {
          const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=YOUR_YOUTUBE_API_KEY`)
          const data = await response.json()
          if (data.items && data.items.length > 0) {
            const newVideo: Video = {
              id: videoId,
              title: data.items[0].snippet.title,
              votes: 0,
              thumbnail: data.items[0].snippet.thumbnails.medium.url
            }
            setVideos([...videos, newVideo].sort((a, b) => b.votes - a.votes))
            setNewVideoLink("")
          }
        } catch (error) {
          console.error("Error fetching video details:", error)
        }
      }
    }
  }

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  return (
    <div>
      <Appbar/>
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black text-gray-100">
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Card className="mb-6 bg-gray-800/80 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-gray-100">
                  <Music className="mr-2" />
                  Now Playing
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentVideo ? (
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src={`https://www.youtube.com/embed/${currentVideo.id}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                ) : (
                  <p className="text-gray-300">No video currently playing</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gray-800/80 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-100">
                  <Plus className="mr-2" />
                  Submit a Video
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    placeholder="YouTube Video URL"
                    value={newVideoLink}
                    onChange={(e) => setNewVideoLink(e.target.value)}
                    required
                    className="bg-gray-700/50 text-gray-100 border-gray-600 focus:border-purple-500"
                  />
                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    Add to Queue
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-800/80 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-gray-100">
                <Music className="mr-2" />
                Video Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {videos.map((video, index) => (
                  <li key={video.id} className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl font-bold mr-2 w-8 text-center text-purple-300">{index + 1}</span>
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        width={80}
                        height={60}
                        className="rounded"
                      />
                      <div className="flex-grow">
                        <p className="font-semibold line-clamp-1 text-gray-100">{video.title}</p>
                        <p className="text-sm text-gray-400">ID: {video.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" onClick={() => handleVote(video.id, true)} className="bg-purple-600 hover:bg-purple-700 text-white">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        <span>{video.votes}</span>
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleVote(video.id, false)} className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white">
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </div>
  )
}