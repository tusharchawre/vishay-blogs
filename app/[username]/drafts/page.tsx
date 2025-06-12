import { Skeleton } from "@/components/ui/skeleton";
import { prisma } from "@/prisma";
import Image from "next/image";
import PostItem from "@/app/_components/PostItem";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import Link from "next/link";
import { ProfileSection } from "@/components/profile-section";
import { getUser } from "@/hooks/useUser";
import { encodeBlogUri } from "@/app/utils/uriParser";

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>
}) {

  const username = (await params).username

  const session = await auth()


  const currentUser = await getUser()



  const user = await prisma.user.findFirst({
    where: {
      name: username
    },
    include: {
      followers: true,
      following: true
    }
  })

  if (session?.user?.email != user?.email) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <h1>You do not have access to this path</h1>
      </div>
    )
  }

  const post = await prisma.post.findMany({
    where: {
      userId: user?.id,
      published: false
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
          followers: true
        }
      },
      likes: {
        select: {
          user: {
            select: {
              name: true,
              image: true
            }
          }
        }
      },
    }
  })


  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];




  if (!user) {
    return (
      <div className="h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center gap-4">
        <div className="text-6xl mb-4">👤</div>
        <h1 className="text-2xl font-semibold">User Not Found</h1>
        <p className="text-muted-foreground text-center max-w-md">
          We couldn't find a user with the username "{username}". They might
          have changed their username or deleted their account.
        </p>
        <Link
          href="/"
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Return Home
        </Link>
      </div>
    );
  }





  return (
    <div className="h-fit">
      <div className="w-full h-[calc(100vh-4rem)] flex">
        <aside className="w-[30%] hidden md:flex h-full bg-[#ECECEC30] dark:bg-[#20202030] flex-col gap-2 items-center p-4">

          <div className="w-full h-16 flex items-center justify-around p-2 mt-8 dark:bg-[#33333373] bg-[#D9D9D973] rounded-lg" >
            {user.image ? (
              <Image src={user.image.replace("s96-c", "s384-c")} width={500} height={500} alt="Profile Pic" className="rounded-lg h-12 aspect-square w-12" />
            ) : (<Skeleton className="rounded-lg h-12 aspect-square w-12" />)}

            <div>
              <p className="text-base font-semibold text-foreground">{user.name}</p>
              <p className="text-sm font-light text-muted-foreground text-wrap">{user.email}</p>
            </div>

          </div>


          <ProfileSection post={post} user={user} selfPage={currentUser?.email === user.email} />




          <Separator />

          {/* TODO: Lot of code redundancy here. Prolly just need to make a better navigation and use these as components rendering on same page */}
          <div className="w-full flex flex-col gap-2">
            <Link href={`/${user.name}`}>
              <div className="w-full h-fit  flex items-center rounded-md px-4 py-2">
                <p>Home</p>
              </div>
            </Link>
            <Link href={`/${user.name}/drafts`}>
              <div className="w-full h-fit dark:bg-[#33333373] bg-[#D9D9D973] flex items-center rounded-md px-4 py-2">
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

        <div className="w-full h-full px-1 md:px-16 py-4 overflow-y-scroll">
          <div className="w-full md:hidden max-w-[75%] mx-auto h-16 flex items-center justify-around p-2 mt-8 dark:bg-[#33333373] bg-[#D9D9D973] rounded-lg" >
            {user.image ? (
              <Image src={user.image.replace("s96-c", "s384-c")} width={500} height={500} alt="Profile Pic" className="rounded-lg h-12 aspect-square w-12" />
            ) : (<Skeleton className="rounded-lg h-12 aspect-square w-12" />)}

            <div>
              <p className="text-base font-semibold text-foreground">{user.name}</p>
              <p className="text-sm font-light text-muted-foreground text-wrap">{user.email}</p>
            </div>

          </div>
          <div className="h-full flex flex-col gap-5 py-5">
            {
              post.map((post, idx) => {
                const hasLiked = post.likes.some(like => like.user.name === user.name);

                return <PostItem
                  key={idx}
                  postId={post.id}
                  hasLiked={hasLiked}
                  index={idx}
                  userImg={post.user.image}
                  username={post.user.name!}
                  title={post.title} content={post.content}
                  date={`${months[post.createdAt.getUTCMonth()]} ${post.createdAt.getFullYear()}`}
                  likes={post.likes.length} coverImg={post.coverImg} showActions={true} />
              })
            }

          </div>
        </div>
      </div>
    </div>
  )
}