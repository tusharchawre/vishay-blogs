"use server"

import { auth } from "@/auth"
import { prisma } from "@/prisma"
import { Block } from "@blocknote/core"
import { redirect } from "next/navigation"

interface SavePostProps {
  content: Block[]
  coverImg: string
}

export const savePost = async ({content, coverImg}: SavePostProps) =>{



    const session = await auth()

    if (!session || !session.user || !session.user.email) {
        throw new Error("User not authenticated or session invalid")
    }

    const email  = session.user.email

    const parsedTitle = JSON.parse(JSON.stringify(content[0].content, ["text"]))[0].text;


      await prisma.post.create({
          data: {
            title: parsedTitle,
            content:  JSON.stringify(content),
            published: true,
            coverImg: coverImg,
            user: {
                connect: {
                    email: email
                }
            }
          }

        })
        redirect(`/${session.user.name}`)


}


interface GetPostProps {
  username: string
  blogTitle: string
}





export const getPost = async ({ username, blogTitle }: GetPostProps) => {
  const user = await prisma.user.findFirst({
    where: {
      name: username
    }
  })
  if (!user) {
    return null
  }
  const post = await prisma.post.findMany({
    where: {
      userId: user?.id,
      title: blogTitle
    },
    include: {
      user: {
        select: {
          name: true,
          image: true
        }
      }
    }
  })

  if(!post[0].content){
    return null
  }


  return post;
}