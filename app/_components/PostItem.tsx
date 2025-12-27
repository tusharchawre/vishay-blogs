"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, MoreVertical, Pencil, Trash, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { handleLike } from "../action";
import { motion } from "motion/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { DeleteModal } from "@/components/modals/deleteModal";
import { encodeBlogUri } from "@/app/utils/uriParser";

interface PostProps {
  postId: number;
  title: string;
  content: string | null;
  date?: string;
  coverImg: string | null; //TODO: Generate Image from AI for Cover
  likes: number;
  username: string;
  userImg: string | null;
  hasLiked: boolean;
  index?: number;
  showActions?: boolean;
}

const PostItem = ({
  title,
  content,
  date,
  coverImg,
  likes,
  username,
  userImg,
  postId,
  hasLiked,
  index = 0,
  showActions = false,
}: PostProps) => {
  const [hasLikedState, setHasLiked] = useState(hasLiked);
  const [likesCount, setLikesCount] = useState(likes);

  const handleEdit = () => {
    redirect(`/${username}/${encodeBlogUri(title, postId)}/edit`);
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
  };

  const clickedLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setHasLiked((prev) => !prev);
    setLikesCount((prev) => (hasLikedState ? prev - 1 : prev + 1));

    try {
      await handleLike(postId);
    } catch (error) {
      setHasLiked((prev) => !prev);
      setLikesCount((prev) => (hasLikedState ? prev + 1 : prev - 1));
      console.error("Failed to update like status", error);
    }
  };

  if (!content) return (content = "Content not found");

  const parsedContent = JSON.parse(content)[1].content.map(
    (x: { text: string }) => x.text,
  )[0];

  return (
    <Link
      href={`/${username.replaceAll(" ", "-")}/${encodeBlogUri(title, postId)}`}
      prefetch
    >
      <motion.div
        initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{
          ease: "easeInOut",
          duration: 0.2,
          delay: index * 0.2,
        }}
        className="relative flex h-40 w-full rounded-lg bg-[#dfdfdf]/30 px-2 md:h-48 dark:bg-[#24242447]"
      >
        {showActions && (
          <div
            onClick={(e) => e.preventDefault()}
            className="absolute top-2 right-2 z-100"
          >
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-2">
                <div className="flex flex-col gap-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    onClick={(e) => {
                      e.preventDefault();
                      handleEdit();
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                  <DeleteModal title={title} id={postId}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                    >
                      <Trash className="h-4 w-4" />
                      Delete
                    </Button>
                  </DeleteModal>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
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
              {username.replace("-", " ")}
            </p>
          </div>
          <h1 className="text-base font-semibold md:text-lg">{title}</h1>
          <p className="line-clamp-2 text-sm font-normal text-black/45 md:text-base dark:text-white/45">
            {parsedContent}
          </p>
          <div className="flex w-full gap-8">
            <p className="text-sm text-black/45 dark:text-white/45">{date}</p>
            <p className="flex items-center justify-center gap-1 text-sm opacity-60">
              {likesCount}{" "}
              <Heart
                className={`size-3 ${hasLikedState ? "fill-red-500" : ""}`}
                onClick={clickedLike}
              />
            </p>
          </div>
        </div>
        <div className="h-full rounded-lg p-4">
          {coverImg && (
            <Image
              width={500}
              height={500}
              className="h-full w-24 rounded-lg object-cover md:w-52"
              src={coverImg}
              alt={title}
            />
          )}
        </div>
      </motion.div>
    </Link>
  );
};

export function ItemSkeleton() {
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
}

export default PostItem;
