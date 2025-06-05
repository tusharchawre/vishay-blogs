"use client";
import { Post, Prisma } from "@prisma/client";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { handleFollow } from "@/app/action";
import { useState } from "react";
import { Loader2 } from "lucide-react";

type UserWithFollow = Prisma.UserGetPayload<{
  include: { followers: true; following: true };
}>;

interface SectionProps {
  post: Post[];
  user: UserWithFollow;
  selfPage: boolean;
}

export const ProfileSection = ({ post, user, selfPage }: SectionProps) => {
  const [loading, setLoading] = useState(false);

  const clickFollow = async () => {
    setLoading(true);
    if (!user || !user.id) {
      return null;
    }
    await handleFollow(user.id);
    setLoading(false);
  };

  return (
    <div className="w-full h-fit flex gap-2 flex-col items-center justify-around p-2 mt-8 dark:bg-[#33333373] bg-[#D9D9D973] rounded-lg">
      <p className="text-sm font-light text-muted-foreground text-wrap">
        {post.length} Posts
      </p>
      <Separator />
      <p className="text-sm font-light text-muted-foreground text-wrap">
        {user.followers.length} Followers
      </p>
      <Separator />
      <p className="text-sm font-light text-muted-foreground text-wrap">
        {user.following.length} Following
      </p>
      <Separator />

      <Button
        onClick={clickFollow}
        disabled={loading || selfPage}
        className="w-full"
        variant="secondary"
      >
        {loading ? (
          <div>
            <Loader2 className="h-4 w-4 animate-spin" />
            <p>Follow</p>
          </div>
        ) : (
          <>
          {selfPage ? "So narcissistic!" : "Follow"}
          </>
        )}
      </Button>
    </div>
  );
};
