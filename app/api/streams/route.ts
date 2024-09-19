import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
//@ts-expect-error djd
import youtubesearchapi from "youtube-search-api"; // Removed `@ts-expect-error` as it's unnecessary unless there's an actual TypeScript error.
import { YT_REGEX } from "@/app/lib/utils";

// Zod schema for validation
const createStreamSchema = z.object({
  creatorId: z.string(),
  url: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const data = createStreamSchema.parse(await req.json());
    const isYT = data.url.match(YT_REGEX);

    if (!isYT) {
      return NextResponse.json(
        { message: "Wrong URL" },
        { status: 411 }
      );
    }

    const extractedUrl = data.url.split("?v=")[1];
    const res = await youtubesearchapi.GetVideoDetails(extractedUrl);
    const thumbnails = res.thumbnail.thumbnails;

    // Sorting thumbnails to get the smallest and largest
    thumbnails.sort((a: { width: number }, b: { width: number }) => a.width - b.width);

    const stream = await prismaClient.stream.create({
      data: {
        userId: data.creatorId,
        url: data.url,
        type: "Youtube",
        extractedUrl,
        title: res.title ?? "Can't find video",
        smallImg:
          thumbnails.length > 1
            ? thumbnails[thumbnails.length - 2].url
            : thumbnails[thumbnails.length - 1].url ?? "https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg",
        bigImg:
          thumbnails[thumbnails.length - 1].url ?? "https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg",
      },
    });

    return NextResponse.json({
      ...stream,
      hasUpvotes: false,
      upvotes: 0,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Error while adding a stream" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const creatorId = req.nextUrl.searchParams.get("creatorId");

    const streams = await prismaClient.stream.findMany({
      where: {
        userId: creatorId || undefined, // Use undefined if creatorId is not provided
      },
    });

    return NextResponse.json({ streams });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Error fetching streams" },
      { status: 500 }
    );
  }
}
