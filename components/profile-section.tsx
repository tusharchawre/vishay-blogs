'use client';
import { Post, Prisma } from '@prisma/client';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { handleFollow } from '@/app/action';
import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Loader2 } from 'lucide-react';

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
    <div className="mt-8 flex h-fit w-full flex-col items-center justify-around gap-2 rounded-lg bg-[#D9D9D973] p-2 dark:bg-[#33333373]">
      <p className="text-wrap text-sm font-light text-muted-foreground">
        {post.length} Posts
      </p>
      <Separator />
      <p className="text-wrap text-sm font-light text-muted-foreground">
        {user.followers.length} Followers
      </p>
      <Separator />
      <p className="text-wrap text-sm font-light text-muted-foreground">
        {user.following.length} Following
      </p>
      <Separator />

      {selfPage ? (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="secondary">Follow</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>So Narcissistic!</p>
            </TooltipContent>
          </Tooltip>
          <p className="text-xs text-muted-foreground">
            You can't follow yourself!
          </p>
        </>
      ) : (
        <Button
          onClick={clickFollow}
          disabled={loading}
          className="w-full"
          variant="secondary"
        >
          {loading ? (
            <div>
              <Loader2 className="h-4 w-4 animate-spin" />
              <p>Follow</p>
            </div>
          ) : (
            <>"Follow"</>
          )}
        </Button>
      )}
    </div>
  );
};
