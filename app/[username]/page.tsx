import { Skeleton } from "@/components/ui/skeleton";
import { prisma } from "@/prisma";
import Image from "next/image";
import PostItem from "../_components/PostItem";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ProfileSection } from "@/components/profile-section";
import { getUser } from "@/hooks/useUser";

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const usernameParams = (await params).username;

  const currentUser = await getUser();

  // Todo -> Needs Better Parsing
  const firstDashIndex = usernameParams.indexOf("-");
  let username = usernameParams;
  if (firstDashIndex !== -1) {
    username =
      usernameParams.slice(0, firstDashIndex + 1) +
      usernameParams.slice(firstDashIndex + 1).replaceAll("-", " ");
  }

  const user = await prisma.user.findFirst({
    where: {
      name: username,
    },
    include: {
      followers: true,
      following: true,
    },
  });

  const post = await prisma.post.findMany({
    where: {
      userId: user?.id,
      published: true,
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
          followers: true,
        },
      },
      likes: {
        select: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });

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

  if (!user) {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center gap-4">
        <div className="mb-4 text-6xl">👤</div>
        <h1 className="text-2xl font-semibold">User Not Found</h1>
        <p className="text-muted-foreground max-w-md text-center">
          We couldn't find a user with the username "{username}". They might
          have changed their username or deleted their account.
        </p>
        <Link
          href="/"
          className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 rounded-md px-4 py-2 transition-colors"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="h-fit">
      <div className="flex h-[calc(100vh-4rem)] w-full">
        <aside className="hidden h-full w-[30%] flex-col items-center gap-2 bg-[#ECECEC30] p-4 md:flex dark:bg-[#20202030]">
          <div className="mt-8 flex h-16 w-full items-center justify-around rounded-lg bg-[#D9D9D973] p-2 dark:bg-[#33333373]">
            {user.image ? (
              <Image
                src={user.image.replace("s96-c", "s384-c")}
                width={500}
                height={500}
                alt="Profile Pic"
                className="aspect-square h-12 w-12 rounded-lg"
              />
            ) : (
              <Skeleton className="aspect-square h-12 w-12 rounded-lg" />
            )}

            <div>
              <p className="text-foreground text-base font-semibold">
                {user.name?.replace("-", " ")}
              </p>
              <p className="text-muted-foreground text-sm font-light text-wrap">
                {user.email}
              </p>
            </div>
          </div>

          <ProfileSection
            post={post}
            user={user}
            selfPage={currentUser?.email === user.email}
          />

          <Separator />

          {/* TODO: Lot of code redundancy here. Prolly just need to make a better navigation and use these as components rendering on same page */}
          <div className="flex w-full flex-col gap-2">
            <Link href={`/${user.name}`}>
              <div className="flex h-fit w-full items-center rounded-md bg-[#D9D9D973] px-4 py-2 dark:bg-[#33333373]">
                <p>Home</p>
              </div>
            </Link>
            <Link href={`/${user.name}/drafts`}>
              <div className="flex h-fit w-full items-center rounded-md px-4 py-2">
                <p>Drafts</p>
              </div>
            </Link>
            {/* <Link href={`/${user.name}/about`}>
      <div className="w-full h-fit  flex items-center rounded-md px-4 py-2">
        <p>About</p>
      </div>
      </Link> */}
          </div>
        </aside>

        <div className="h-full w-full overflow-y-scroll px-1 py-4 md:px-16">
          <div className="mx-auto mt-8 flex h-16 w-full max-w-[75%] items-center justify-around rounded-lg bg-[#D9D9D973] p-2 md:hidden dark:bg-[#33333373]">
            {user.image ? (
              <Image
                src={user.image.replace("s96-c", "s384-c")}
                width={500}
                height={500}
                alt="Profile Pic"
                className="aspect-square h-12 w-12 rounded-lg"
              />
            ) : (
              <Skeleton className="aspect-square h-12 w-12 rounded-lg" />
            )}

            <div>
              <p className="text-foreground text-base font-semibold">
                {user.name}
              </p>
              <p className="text-muted-foreground text-sm font-light text-wrap">
                {user.email}
              </p>
            </div>
          </div>
          <div className="flex h-full flex-col gap-5 py-5">
            {post.map((post, idx) => {
              const hasLiked = post.likes.some(
                (like) => like.user.name === user.name,
              );

              return (
                <PostItem
                  key={idx}
                  postId={post.id}
                  hasLiked={hasLiked}
                  index={idx}
                  userImg={post.user.image}
                  username={post.user.name!}
                  title={post.title}
                  content={post.content}
                  date={`${months[post.createdAt.getUTCMonth()]} ${post.createdAt.getFullYear()}`}
                  likes={post.likes.length}
                  coverImg={post.coverImg}
                  showActions={true}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
