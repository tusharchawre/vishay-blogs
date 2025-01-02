import React from 'react'
import { Navbar } from './_components/Navbar'
import { prisma } from '@/prisma'
import { PostItem } from './_components/PostItem'

async function page() {

  const posts = await prisma.post.findMany({
    include:{
      user:{
        select:{
          name: true,
          image: true
        }
      }
    }
  })



  if(posts === undefined){
    return (
      <div>
      <Navbar />
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

  if(!posts[0].content) {
    return null
  }

  


  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];


  return (
    <div>
      <Navbar />
      <div className='flex w-full max-w-[75rem] mx-auto'>
      <div className='w-full px-8'>
      {
              posts.map((post, idx)=>(


                <PostItem key={idx} userImg={post.user.image} username={post.user.name} title={post.title} content={post.content} date={`${months[post.createdAt.getUTCMonth()]} ${post.createdAt.getFullYear()}`} likes={post.likes} coverImg={post.coverImg}  />
      
              ))
            }
      </div>

      <div className='w-[30rem] h-screen bg-blue-900'>

      </div>
      </div>




     
    </div>
  )
}

export default page