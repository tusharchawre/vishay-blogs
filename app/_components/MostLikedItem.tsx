"use client";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { motion } from "motion/react";
import { encodeBlogUri } from "../utils/uriParser";

interface PostProps {
  postId: number;
  title: string;
  date: string;
  likes: number;
  username: string;
  userImg: string | null;
  index: number;
}

export const MostLikedItem = ({
  title,
  date,
  likes,
  username,
  userImg,
  postId,
  index = 0,
}: PostProps) => {
  return (
    //TODO :  Encode the URL in good dash wala fashion
    <Link
      href={`/${username.replaceAll(" ", "-")}/${encodeBlogUri(title, postId)}`}
      prefetch
    >
      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(50px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{
          ease: "easeInOut",
          duration: 0.3,
          delay: index * 0.2,
        }}
        className="flex h-28 w-full"
      >
        <div className="flex h-full w-[80%] flex-col justify-around px-4 py-2">
          <div className="flex h-5 items-center gap-2">
            {userImg && (
              <Image
                src={userImg}
                width={50}
                height={50}
                alt="Profile Pic"
                className="h-4 w-4 rounded-full"
              />
            )}
            <p className="text-sm text-black/45 dark:text-white/45">
              {username}
            </p>
          </div>
          <h1 className="line-clamp-2 text-base font-semibold">{title}</h1>
          <div className="flex w-full gap-8">
            <p className="text-sm text-black/45 dark:text-white/45">{date}</p>
            <p className="text-sm text-black/45 dark:text-white/45">
              Liked by {likes} users
            </p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

MostLikedItem.Skeleton = function ItemSkeleton() {
  return (
    <div className="flex h-56 w-full border-b border-black/25">
      <div className="flex h-full w-[80%] flex-col justify-around px-4 py-2">
        <div className="flex h-5 items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-md" />
          <Skeleton className="h-4 w-16" />
        </div>
        <h1 className="text-2xl font-bold">
          <Skeleton className="h-8 w-full" />
        </h1>
        <p className="line-clamp-2 text-black/70">
          <Skeleton className="h-6 w-full" />
        </p>
        <div className="flex w-full gap-8">
          <Skeleton className="h-4 w-full" />
          <p className="text-sm opacity-60">
            <Skeleton className="h-4 w-full" />
          </p>
        </div>
      </div>
    </div>
  );
};
