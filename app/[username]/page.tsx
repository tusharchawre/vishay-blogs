
import { Skeleton } from "@/components/ui/skeleton";
import { prisma } from "@/prisma";
import { useSession } from "next-auth/react"
import Image from "next/image";

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





  return <div className="w-full h-screen flex">
    <aside className="w-[30%] h-full bg-slate-50 flex flex-col gap-2 items-center p-4">
      {user.image ? (
        <Image src={user?.image.replace("s96-c", "s384-c")} width={500} height={500} alt="Profile Pic" className="rounded-xl w-64" />
      ) : (<Skeleton className="rounded-xl w-48" />)}
      <p>{post.length} Post</p>
    </aside>

    <div className="w-full h-full px-16 py-4">
      <div className="w-full border-b border-slate-400 py-4">
      <p className="text-5xl font-medium">{user.name}</p>
      <p className="text-slate-700">{user.email}</p>
      </div>

      <div>
      {
        post.map((post, idx)=>(
          <>
          <div className="border-b border-white/20 w-full h-40">
          <p>{post.title}</p>
          <p className="line-clamp-2">{post.content}</p>
          <p>{post.createdAt.getFullYear()} {months[post.createdAt.getUTCMonth()]}</p>
          <p>{post.likes} Likes</p>
          <p>{post.user.name}</p>

          </div>
          </>
        ))
      }

</div>
    </div>


    
  </div>
}