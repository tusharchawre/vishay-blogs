import { Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { constSelector } from "recoil"

interface PostProps {
    title : string
    content: string | null
    date: string
    coverImg: string | null //TODO: Generate Image from AI for Cover
    likes: number
    user: string | null
}


export const PostItem = ({title,content, date, coverImg, likes,user}: PostProps) =>{

    if(!content) return content="Content not found"



    return(
        <Link href={`/${user}/${title.replaceAll(" ", "-")}`}>
        <div className="flex w-full h-40  border-b border-black/25">
        <div className="w-[70%] h-full flex flex-col justify-around p-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-black/70 line-clamp-2 ">{content}</p>
        <div className="flex w-full  gap-8">
            <p className="flex items-center justify-center gap-1 opacity-60 text-sm">{likes} <Heart className="size-3" /></p>
            <p className="text-sm opacity-60">{date}</p>
        </div>
        </div>
        <div>
            {
                coverImg && <Image width={500} height={500} className="h-full w-fit p-8" src={coverImg} alt={title} />
            }
        </div>
      

        
        </div>

        </Link>
    )
}






