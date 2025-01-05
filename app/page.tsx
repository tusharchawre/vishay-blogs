import React from 'react'
import { Navbar } from './_components/Navbar'
import { prisma } from '@/prisma'
import { PostItem } from './_components/PostItem'
import { auth } from '@/auth'

async function page() {

  const session =  await auth()

  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email
    }
  })

  const posts = await prisma.post.findMany({
    include:{
      user:{
        select:{
          name: true,
          image: true
        },
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



  if(posts === undefined){
    return (
      <div>
      <div className='flex w-full max-w-[75rem] mx-auto'>
      <div className='w-full px-8'>
      <PostItem.Skeleton />
      <PostItem.Skeleton />
      <PostItem.Skeleton />
      </div>
      <div className='w-[30rem] h-screen'>
      <PostItem.Skeleton />
      <PostItem.Skeleton />
      <PostItem.Skeleton />
      <PostItem.Skeleton />
      </div>
      </div>
    </div>
    )
  }


  


  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];


  return (
    <div className='relative'>
      <div className='flex w-full max-w-[75rem] mx-auto bg-transparent '>
        
      <div className='w-full px-8 flex flex-col gap-5 py-5'>
      {
              posts.map((post, idx)=>
                {
                  const hasLiked = post.likes.some(like => like.user.name === user?.name);
                  
                  return <PostItem postId={post.id} hasLiked={hasLiked} key={idx} userImg={post.user.image} username={post.user.name} title={post.title} content={post.content} date={`${months[post.createdAt.getUTCMonth()]} ${post.createdAt.getFullYear()}`} likes={post.likes.length} coverImg={post.coverImg}  />
              })}
      </div>

      <div className='w-[30rem] hidden md:block h-screen bg-[#ECECEC30] dark:bg-[#20202030]'>

      </div>
      </div>




     
    </div>
  )
}

export default page