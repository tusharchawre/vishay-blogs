import { Skeleton } from "@/components/ui/skeleton"
import { Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface PostProps {
    title : string
    content: string | null
    date: string
    coverImg: string | null //TODO: Generate Image from AI for Cover
    likes: number
    username: string | null
    userImg: string | null
}


export const PostItem = ({title,content, date, coverImg, likes,username, userImg}: PostProps) =>{

    if(!content) return content="Content not found"

const parsedContent = JSON.parse(content)[1].content.map((x: { text: any })=>x.text)[0]

    return(
        //TODO :  Encode the URL in good dash wala fashion
        <Link href={`/${username}/${encodeURIComponent(title)}`}>
        <div className="flex w-full h-56  border-b border-black/25 py-4">
        <div className="w-[80%] h-full flex flex-col justify-around px-4 py-2">
            <div className="flex gap-2 h-5 items-center">
                {
                    userImg && <Image src={userImg} width={50} height={50} alt="Profile Pic" className="rounded-full w-5 h-5" />
                }
            <p>{username}</p>
            </div>
        <h1 className="text-2xl font-bold" >{title}</h1>
        <p className="text-black/70 line-clamp-2 ">{parsedContent}</p>
        <div className="flex w-full  gap-8">
            <p className="flex items-center justify-center gap-1 opacity-60 text-sm">{likes} <Heart className="size-3" /></p>
            <p className="text-sm opacity-60">{date}</p>
        </div>
        </div>
        <div className="h-full">
            {
                coverImg && <Image width={500} height={500} className="h-full object-cover w-fit p-2" src={coverImg} alt={title} />
            }
        </div>
      

        
        </div>

        </Link>
    )
}




PostItem.Skeleton = function ItemSkeleton() {
    return (
        <div className="flex w-full h-56  border-b border-black/25 ">
        <div className="w-[80%] h-full flex flex-col justify-around px-4 py-2">
            <div className="flex gap-2 h-5 items-center">
                <Skeleton className="rounded-md w-5 h-5" />
                <Skeleton className="h-4 w-16" />
            </div>
        <h1 className="text-2xl font-bold" ><Skeleton className="w-full h-8" /></h1>
        <p className="text-black/70 line-clamp-2 "><Skeleton className="w-full h-6" /></p>
        <div className="flex w-full  gap-8">
            <Skeleton className="w-full h-4" />
            <p className="text-sm opacity-60"><Skeleton className="w-full h-4" /></p>
        </div>
        </div>
    </div>
)}
