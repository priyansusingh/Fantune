"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import axios from "axios";
import { Appbar } from "../components/Appbar";
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'
import { YT_REGEX } from "../lib/utils";
import { Music, Plus } from "lucide-react";

interface Video {
  id: string;
  title: string;
  votes: number;
  thumbnail: string;
}

const REFRESH_INTERVAL_MS = 10 * 1000;

export default function Dashboard() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [newVideoLink, setNewVideoLink] = useState("");
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [queue, setQueue] = useState<Video[]>([]);

  async function refreshStreams() {
    try {
      const res = await axios.get(`/api/streams/my`, {
        withCredentials: true,
      });
      console.log(res.data);
    } catch (error) {
      console.error("Error refreshing streams:", error);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      refreshStreams();
    }, REFRESH_INTERVAL_MS);
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (videos.length > 0 && !currentVideo) {
      setCurrentVideo(videos[0]);
      setVideos(videos.slice(1));
    }
  }, [videos, currentVideo]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/streams/", {
      method: "POST",
      body: JSON.stringify({
        creatorId: "252418cb-2c76-43d1-b0e7-060be3778c1e",
        url: newVideoLink
      })
    });
   
    const newVideo = await res.json();
    if (newVideo && newVideo.id) {
      const videoId = extractVideoId(newVideoLink);
      if (videoId) {
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        setQueue([...queue, { ...newVideo, thumbnail: thumbnailUrl }]);
      } else {
        setQueue([...queue, newVideo]);
      }
    }
    setNewVideoLink("");
  };

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  return (
    <div>
      <Appbar />
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
            <div>
              <Card className="bg-gray-800/80 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl text-gray-100">
                    <Music className="mr-2" />
                    Video Queue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {queue.map((video, index) => (
                      <li key={video.id} className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg backdrop-blur-sm">
                        <div className="flex items-center space-x-4">
                          <span className="text-2xl font-bold mr-2 w-8 text-center text-purple-300">{index + 1}</span>
                          <div className="relative w-20 h-15 overflow-hidden rounded">
                            <Image
                              src={video.thumbnail || `/placeholder.svg?height=60&width=80`}
                              alt={video.title}
                              width={80}
                              height={60}
                              style={{ objectFit: 'cover' }}
                              unoptimized
                            />
                          </div>
                          <div className="flex-grow">
                            <p className="font-semibold line-clamp-1 text-gray-100">{video.title}</p>
                            <p className="text-sm text-gray-400">ID: {video.id}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
            {newVideoLink && newVideoLink.match(YT_REGEX) && (
              <Card className="bg-gray-800/80 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl text-gray-100">
                    <Music className="mr-2" />
                    Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LiteYouTubeEmbed title="" id={newVideoLink.split("?v=")[1]}/>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}