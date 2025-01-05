import React from 'react'
import { Navbar } from './_components/Navbar'
import { prisma } from '@/prisma'
import { PostItem } from './_components/PostItem'
import { auth } from '@/auth'
import { MostLikedItem } from './_components/MostLikedItem'

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


  const likedPost = await prisma.post.findMany({
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
      
    },
    orderBy:{
      likes: {
        _count : "desc"
      }
    },
    take: 3
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
      <div className='flex w-full max-w-[75rem] mx-auto bg-transparent'>
        
      <div className='w-full px-8 flex flex-col gap-5 py-5'>
      {
              posts.map((post, idx)=>
                {
                  const hasLiked = post.likes.some(like => like.user.name === user?.name);
                  
                  return <PostItem postId={post.id} hasLiked={hasLiked} key={idx} userImg={post.user.image} username={post.user.name} title={post.title} content={post.content} date={`${months[post.createdAt.getUTCMonth()]} ${post.createdAt.getFullYear()}`} likes={post.likes.length} coverImg={post.coverImg}  />
              })}
      </div>

      <div className='w-[30rem] hidden md:block h-screen bg-[#ECECEC30] dark:bg-[#20202030] '>

        <p className='px-4 pt-8  text-base font-semibold'>Most Liked</p>
        <div className='w-full h-full flex flex-col gap-2'>
      {
              likedPost.map((post, idx)=>
                {
                  return (<>

                  <MostLikedItem 
                  postId={post.id}
                  date={`${months[post.createdAt.getUTCMonth()]} ${post.createdAt.getDate()}, ${post.createdAt.getFullYear()}`}
                  title={post.title}
                  userImg={post.user.image}
                  key={idx}
                  username={post.user.name}
                  likes={post.likes.length}
                  /></>)
              })}

</div>
      </div>
      </div>




     
    </div>
  )
}

export default page