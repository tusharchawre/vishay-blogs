
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
    }
  })



  if(!user){
    // TODO: User doesnt exist wala page
    return null;
  }





  return <div className="w-full h-screen flex">
    <aside className="w-[30%] h-full bg-slate-50 flex flex-col gap-4 items-center p-4">
      {user.image ? (
        <Image src={user?.image.replace("s96-c", "s384-c")} width={500} height={500} alt="Profile Pic" className="rounded-xl w-64" />
      ) : (<Skeleton className="rounded-xl w-48" />)}
      
      <h1>{user.name}</h1>
      {post.map((item, idx)=>(
        <p key={idx}>
          {idx} Posts
        </p>
      ))}
    </aside>

    <div className="w-full h-full px-16 py-4">
      <div className="w-full border-b border-slate-400 py-4">
      <p className="text-5xl font-medium">{user.name}</p>
      <p className="text-slate-700">{user.email}</p>
      </div>

    </div>

    
  </div>
}