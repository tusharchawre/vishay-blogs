
import { Skeleton } from "@/components/ui/skeleton";
import { prisma } from "@/prisma";
import Image from "next/image";
import PostItem  from "../_components/PostItem";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>
}) {

  const  usernameParams  = (await params).username 

  const username =  decodeURIComponent(usernameParams)

  const user = await prisma.user.findFirst({
    where: {
      name: username
    },
    include: {
      followers: true,
      following: true
    }
  })




  const post = await prisma.post.findMany({
    where: {
      userId: user?.id,
      published: true
    },
    include:{
      user:{
        select:{
          name: true,
          image: true,
          followers: true
        }
      },
      likes:{
        select:{
          user:{
            select:{
              name: true,
              image: true
            }
          } 
        }
      },
    }
  })


  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];



  if(!user){
    // TODO: User doesnt exist wala page
    return <p>Tushar</p>;
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


    <div className="w-full h-fit flex gap-2 flex-col items-center justify-around p-2 mt-8 dark:bg-[#33333373] bg-[#D9D9D973] rounded-lg" >
    <p className="text-sm font-light text-muted-foreground text-wrap">
      {post.length} Posts</p>
      <Separator />
    <p className="text-sm font-light text-muted-foreground text-wrap">
      {user.followers.length} Followers</p>
      <Separator />
      <p className="text-sm font-light text-muted-foreground text-wrap">
      {user.following.length} Following</p>
      <Separator />

      <Button className="w-full" variant="secondary">Follow</Button>
    </div>



    <Separator />

    {/* TODO: Lot of code redundancy here. Prolly just need to make a better navigation and use these as components rendering on same page */}
    <div className="w-full flex flex-col gap-2">
      <Link href={`/${user.name}`}>
      <div className="w-full h-fit dark:bg-[#33333373] bg-[#D9D9D973] flex items-center rounded-md px-4 py-2">
        <p>Home</p>
      </div>
      </Link>
      <Link href={`/${user.name}/drafts`}>
      <div className="w-full h-fit  flex items-center rounded-md px-4 py-2">
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
        post.map((post, idx)=>
          {
            const hasLiked = post.likes.some(like => like.user.name === user.name);
            
            return <PostItem 
            key={idx}
            postId={post.id} 
            hasLiked={hasLiked} 
            index={idx} 
            userImg={post.user.image} 
            username={post.user.name} 
            title={post.title} content={post.content} 
            date={`${months[post.createdAt.getUTCMonth()]} ${post.createdAt.getFullYear()}`} 
            likes={post.likes.length} coverImg={post.coverImg}  />
        })
      }

      </div>
    </div>
  </div>
  </div>
  )
}