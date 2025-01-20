"use client"
import { Skeleton } from "@/components/ui/skeleton"
import { Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import React, { useState } from "react"
import { handleLike } from "../action"
import { motion } from "motion/react"


interface PostProps {
    postId : number
    title : string
    content: string | null
    date?: string
    coverImg: string | null //TODO: Generate Image from AI for Cover
    likes: number
    username: string
    userImg: string | null
    hasLiked:  boolean
    index? : number
}




const PostItem = ({title,content, date, coverImg, likes,username, userImg , postId, hasLiked, index = 0}: PostProps) =>{

    const [hasLikedState , setHasLiked] =  useState(hasLiked)
    const [likesCount , setLikesCount] = useState(likes)



    const clickedLike = async (e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        setHasLiked((prev)=>!prev)
        setLikesCount((prev)=> hasLikedState ? prev-1 : prev+1)

         try {
            await handleLike(postId)
        } catch (error) {
            setHasLiked((prev) => !prev)
            setLikesCount((prev) => (hasLikedState ? prev + 1 : prev - 1))
            console.error("Failed to update like status", error)
        }
    }


    if(!content) return content="Content not found"

const parsedContent = JSON.parse(content)[1].content.map((x: { text: string })=>x.text)[0]

    return(
        //TODO :  Encode the URL in good dash wala fashion

        <Link href={`/${username}/${encodeURIComponent(title)}`}>

        <motion.div 
        initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{
          ease: "easeInOut",
          duration: 0.2,
          delay: index * 0.2
        }}
        
        className="flex w-full h-40 md:h-48 bg-[#dfdfdf]/30 dark:bg-[#24242447] px-2 rounded-lg">
        <div className="w-[80%] h-full flex flex-col justify-around px-4 py-2">
            <div className="flex gap-2 h-5 items-center">
                {
                    userImg && <Image src={userImg} width={50} height={50} alt="Profile Pic" className="rounded-full w-4 h-4" />
                }
            <p className="text-sm text-black/45 dark:text-white/45">
            {username.replace("-", " ")}
            </p>
            </div>
        <h1 className="text-base md:text-lg font-semibold" >{title}</h1>
        <p className="text-black/45 dark:text-white/45 line-clamp-2 text-sm md:text-base font-normal">
            {parsedContent}
        </p>
        <div className="flex w-full  gap-8">
            <p className="text-sm text-black/45 dark:text-white/45">{date}</p>
            <p className="flex items-center justify-center gap-1 opacity-60 text-sm">{likesCount} <Heart className={`size-3 ${hasLikedState ? "fill-red-500" : ""}`} onClick={clickedLike} /></p>
        </div>
        </div>
        <div  className="h-full rounded-lg p-4 ">
            {
                coverImg && <Image width={500} height={500} className="h-full object-cover w-24 md:w-52 rounded-lg" src={coverImg} alt={title} />
            }
        </div>
      

        
        </motion.div>
        </Link>
    )
}



export function ItemSkeleton() {
    return (
      <div className="flex w-full h-56 border-b border-black/25 ">
        <div className="w-[80%] h-full flex flex-col justify-around px-4 py-2">
          <div className="flex gap-2 h-5 items-center">
            <Skeleton className="rounded-md w-5 h-5" />
            <Skeleton className="h-4 w-16" />
          </div>
          <h1 className="text-2xl font-bold">
            <Skeleton className="w-full h-8" />
          </h1>
          <p className="text-black/70 line-clamp-2">
            <Skeleton className="w-full h-6" />
          </p>
          <div className="flex w-full gap-8">
            <Skeleton className="w-full h-4" />
            <p className="text-sm opacity-60">
              <Skeleton className="w-full h-4" />
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  

export default PostItem