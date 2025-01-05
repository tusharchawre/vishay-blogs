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
      },
      likes: {
        select:{
          user: true
        }
      }
    }
  })

  if(!post[0].content){
    return null
  }


  return post;
}


export async function handleLike(postId: number) {



  const session = await auth()

  if (!session || !session.user || !session.user.email) {
    throw new Error("User not authenticated or session invalid")
  }

  const userEmail = session.user.email

  const user = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });

  const userId = user?.id;
  if (!userId) {
    throw new Error("User not found");
  }

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  const like = await prisma.like.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  });

  if (like) {
    try {
      await prisma.like.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      })
      return { message: "Unliked Post." };
    } catch (error) {
      return { message: "Database Error: Failed to Unlike Post." };
    }
  }

  try {
    await prisma.like.create({
      data: {
        postId,
        userId,
      },
    });
    return { message: "Liked Post." };
  } catch (error) {
    return { message: "Database Error: Failed to Like Post." };
  }
}




export const getAllPost = async () => {
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


      return posts;
}


export const getMostLiked = async () => {
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


    return likedPost;

}