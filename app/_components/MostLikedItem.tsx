"use client"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import Link from "next/link"
import React from "react"

import { motion } from "motion/react"

interface PostProps {
    postId : number
    title : string
    date: string
    likes: number
    username: string | null
    userImg: string | null
    index: number
}


export const MostLikedItem = ({title, date,  likes,username, userImg , index = 0}: PostProps) =>{



    return(
        //TODO :  Encode the URL in good dash wala fashion
        <Link href={`/${username}/${encodeURIComponent(title)}`}>
        <motion.div 
                initial={{ opacity: 0, y: 20, filter: "blur(50px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  ease: "easeInOut",
                  duration: 0.3,
                  delay: index * 0.2
                }} className="flex w-full h-28 ">
        <div className="w-[80%] h-full flex flex-col justify-around px-4 py-2">
            <div className="flex gap-2 h-5 items-center">
                {
                    userImg && <Image src={userImg} width={50} height={50} alt="Profile Pic" className="rounded-full w-4 h-4" />
                }
            <p className="text-sm text-black/45 dark:text-white/45">{username}</p>
            </div>
        <h1 className="text-base font-semibold line-clamp-2" >{title}</h1>
        <div className="flex w-full gap-8">
            <p className="text-sm text-black/45 dark:text-white/45">{date}</p>
            <p className="text-sm text-black/45 dark:text-white/45">Liked by {likes} users</p>
        </div>
        </div>

        
        </motion.div>

        </Link>
    )
}




MostLikedItem.Skeleton = function ItemSkeleton() {
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
