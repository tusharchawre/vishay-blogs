import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function POST(req: Request){

    const session = await auth()

    if(!session || !session.user?.name){
        return NextResponse.json({ error: "No user found" }, { status: 401 });
    }

    const {prompt} : {prompt: string} = await req.json()

    function generateRandomNumber(): number {
        return Math.floor(Math.random()*1000000000 + 1)
    }

    const randomSeed = generateRandomNumber()

    const imageUrl =   `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?seed=${randomSeed}&width=1080&height=1080&nologo=True`

    await fetch(imageUrl)


    return NextResponse.json({ url: imageUrl });

}