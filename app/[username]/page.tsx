
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
      }
    }
  })

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];



  if(!user){
    // TODO: User doesnt exist wala page
    return null;
  }





  return (
  <div className="h-screen">
  <Navbar />
  <div className="w-full h-[calc(100vh-4rem)] flex">
    <aside className="w-[30%] h-full bg-slate-50 flex flex-col gap-2 items-center p-4">
      {user.image ? (
        <Image src={user?.image.replace("s96-c", "s384-c")} width={500} height={500} alt="Profile Pic" className="rounded-xl w-64" />
      ) : (<Skeleton className="rounded-xl w-48" />)}
      <p>{post.length} Post</p>
    </aside>

    <div className="w-full h-full px-16 py-4 overflow-y-scroll">
      <div className="w-full border-b border-slate-400 py-4">
      <p className="text-5xl font-medium">{user.name}</p>
      <p className="text-slate-700">{user.email}</p>
      </div>

      <div className="h-full flex flex-col">
      {
        post.map((post, idx)=>(
           <PostItem key={idx} userImg={post.user.image} username={post.user.name} title={post.title} content={post.content} date={`${months[post.createdAt.getUTCMonth()]} ${post.createdAt.getFullYear()}`} likes={post.likes} coverImg={post.coverImg}  />
        ))
      }

</div>
    </div>


    
  </div>
  </div>
  )
}