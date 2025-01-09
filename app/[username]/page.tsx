
import { Skeleton } from "@/components/ui/skeleton";
import { prisma } from "@/prisma";
import Image from "next/image";
import PostItem  from "../_components/PostItem";

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
    <aside className="w-[30%] h-full bg-[#ECECEC30] dark:bg-[#20202030] flex flex-col gap-2 items-center p-4">

    <div className="w-full h-16 flex items-center justify-around p-2 mt-8 dark:bg-[#33333373] bg-[#D9D9D973] rounded-lg" >
    {user.image ? (
        <Image src={user.image.replace("s96-c", "s384-c")} width={500} height={500} alt="Profile Pic" className="rounded-lg h-12 aspect-square w-12" />
      ) : (<Skeleton className="rounded-lg h-12 aspect-square w-12" />)}

      <div>
        <p className="text-base font-semibold text-foreground">{user.name}</p>
        <p className="text-sm font-light text-muted-foreground text-wrap">{user.email}</p>
      </div>

    </div>


      

    </aside>

    <div className="w-full h-full px-16 py-4 overflow-y-scroll">
      <div className="h-full flex flex-col gap-5 py-5">
      {
        post.map((post, idx)=>
          {
            const hasLiked = post.likes.some(like => like.user.name === user.name);
            
            return <PostItem 
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