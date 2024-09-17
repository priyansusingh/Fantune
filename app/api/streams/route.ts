import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"
const  YT_REGEX = new RegExp("https:\/\/youtu\.be\/[A-Za-z0-9_-]+");

const createStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string()
})

export async function POST(req:NextRequest){
   try{
    const data = createStreamSchema.parse(await req.json());
    const isYT = YT_REGEX.test(data.url);

    if(!isYT){
      return NextResponse.json({
        messsage: "Wrong URL"
      },{
        status:411
      })
    }
    const  extractedUrl = data.url.split("?v=")[1]
    await prismaClient.stream.create({
       data:{
        userId: data.creatorId,
        url: data.url,
        extractedUrl ,
        type: "Youtube"
       }
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