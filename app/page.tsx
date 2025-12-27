import React from "react";
import { prisma } from "@/prisma";
import PostItem, { ItemSkeleton } from "./_components/PostItem";
import { auth } from "@/auth";
import { MostLikedItem } from "./_components/MostLikedItem";
import { getAllPost, getMostLiked } from "./action";

async function page() {
  const session = await auth();

  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email,
    },
  });

  const posts = await getAllPost();
  const latestPosts = posts.reverse();
  const likedPost = await getMostLiked();

  if (!posts) {
    return (
      <div>
        <div className="mx-auto flex w-full max-w-300">
          <div className="w-full px-8">
            <ItemSkeleton />
            <ItemSkeleton />
            <ItemSkeleton />
          </div>
          <div className="h-screen w-120">
            <ItemSkeleton />
            <ItemSkeleton />
            <ItemSkeleton />
            <ItemSkeleton />
          </div>
        </div>
      </div>
    );
  }

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div className="mx-auto flex h-fit min-h-screen w-full max-w-300 bg-transparent">
      <div className="flex w-full flex-col gap-5 px-1 py-5 md:px-8">
        {latestPosts.map((post, idx) => {
          const hasLiked = post.likes.some(
            (like) => session && like.user.name === user?.name,
          );

          if (!post.published) return null;

          return (
            <PostItem
              key={idx}
              postId={post.id}
              hasLiked={hasLiked}
              index={idx}
              userImg={post.user.image}
              username={post.user.name!.replace("-", " ")}
              title={post.title}
              content={post.content}
              date={`${
                months[post.createdAt.getUTCMonth()]
              } ${post.createdAt.getFullYear()}`}
              likes={post.likes.length}
              coverImg={post.coverImg}
            />
          );
        })}
      </div>

      <div className="mt-5 hidden h-full w-120 rounded-md bg-[#ECECEC40] py-2 md:block dark:bg-[#20202040]">
        <p className="px-4 text-base font-semibold">Most Liked</p>
        <div className="flex h-full w-full flex-col gap-2">
          {likedPost.map((post, idx) => (
            <MostLikedItem
              index={idx}
              postId={post.id}
              date={`${
                months[post.createdAt.getUTCMonth()]
              } ${post.createdAt.getDate()}, ${post.createdAt.getFullYear()}`}
              title={post.title}
              userImg={post.user.image}
              key={idx}
              username={post.user.name!}
              likes={post.likes.length}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default page;
