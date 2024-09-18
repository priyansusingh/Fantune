import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"
//@ts-ignore
import youtubesearchapi from "youtube-search-api";
const YT_REGEX = /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;

const createStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string()
})

export async function POST(req:NextRequest){
   try{
    const data = createStreamSchema.parse(await req.json());
    const isYT = data.url.match(YT_REGEX)

    if(!isYT){
      return NextResponse.json({
        messsage: "Wrong URL"
      },{
        status:411
      })
    }
    const  extractedUrl = data.url.split("?v=")[1]
    const res = await youtubesearchapi.GetVideoDetails(extractedUrl);
    console.log(res.title)
    console.log(res.thumbnail.thumbnails)
    console.log(JSON.stringify(res.thumbnail.thumbnails))

    const stream = await prismaClient.stream.create({
       data:{
        userId: data.creatorId,
        url: data.url,
        extractedUrl ,
        type: "Youtube"
       }
    })
    return NextResponse.json({
        message:"Added stream",
        id: stream.id
    })

 } catch(e){
    return NextResponse.json({
        message: "Error while adding a stream"
    },{
        status:411
    }
)
 }
 
}

export async function GET(req: NextRequest){

  const creatorId = req.nextUrl.searchParams.get("creatorId");
  const streams = await prismaClient.stream.findMany({
    where:{
        userId: creatorId ?? ""
    }
  })

  return NextResponse.json({
    streams
  })
}