import React from 'react'
import { Navbar } from './_components/Navbar'
import { prisma } from '@/prisma'
import { PostItem } from './_components/PostItem'

async function page() {

  const posts = await prisma.post.findMany({

  })


  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];


  return (
    <div>
      <Navbar />
      {
              posts.map((post, idx)=>(
                <PostItem key={idx} title={post.title} content={post.content} date={`${post.createdAt.getFullYear()}  ${months[post.createdAt.getUTCMonth()]}`} likes={post.likes} coverImg={post.coverImg}  />
      
              ))
            }
    </div>
  )
}

export default page