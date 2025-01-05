
import { Skeleton } from "@/components/ui/skeleton";
import { prisma } from "@/prisma";

import Image from "next/image";
import { PostItem } from "../_components/PostItem";
import { Navbar } from "../_components/Navbar";

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>
}) {

  const  username  = (await params).username 

  const user = await prisma.user.findFirst({
    where: {
      name: username
    }
  })

  const post = await prisma.post.findMany({
    where: {
      userId: user?.id
    },
    include:{
      user:{
        select:{
          name: true,
          image: true
        }
      },
    }
  })

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];



  if(!user){
    // TODO: User doesnt exist wala page
    return null;
  }





  return (
  <div className="h-full">
  <div className="w-full h-[calc(100vh-4rem)] flex">
    <aside className="w-[30%] h-full bg-[#ECECEC30] dark:bg-[#20202030] flex flex-col gap-2 items-center p-4">
      {user.image ? (
        <Image src={user?.image.replace("s96-c", "s384-c")} width={500} height={500} alt="Profile Pic" className="rounded-xl w-64" />
      ) : (<Skeleton className="rounded-xl w-48" />)}
      <p>{post.length} Post</p>
    </aside>

    <div className="w-full h-full px-16 py-4 overflow-y-scroll">

      <div className="h-full flex flex-col gap-5 py-5">
      {
        post.map((post, idx)=>(
           <PostItem postId={post.id} key={idx} userImg={post.user.image} username={post.user.name} title={post.title} content={post.content} date={`${months[post.createdAt.getUTCMonth()]} ${post.createdAt.getFullYear()}`} likes={0} coverImg={post.coverImg}  />
        ))
      }

</div>
    </div>


    
  </div>
  </div>
  )
}