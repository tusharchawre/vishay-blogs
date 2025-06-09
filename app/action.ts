"use server"

import { auth } from "@/auth"
import { prisma } from "@/prisma"
import { Block } from "@blocknote/core"
import { Post } from "@prisma/client"

interface SavePostProps {
  content: Block[]
  coverImg: string
  publishStatus: boolean
  postId?: number
}

export const savePost = async ({ content, coverImg, publishStatus, postId }: SavePostProps) => {
  const session = await auth()

  if (content[0] === undefined) {
    return new Error("Please Insert Content")
  }

  if (!session || !session.user || !session.user.email) {
    return new Error("User not authenticated or session invalid")
  }

  const email = session.user.email

  const parsedTitle = JSON.parse(JSON.stringify(content[0].content, ["text"]))[0].text;

  const currentUser = await prisma.user.findFirst({
    where: {
      email: session.user.email
    }
  })

  if (!currentUser) {
    return new Error("User not found")
  }

  const post = await prisma.post.findFirst({
    where: {
      id: postId
    }
  })

  if (post && currentUser.id !== post.userId) {
    return new Error("You are not authorized to edit this post")
  }

  if (post && currentUser.id === post.userId) {
    await prisma.post.update({
      where: {
        id: post.id
      },
      data: {
        title: parsedTitle,
        content: JSON.stringify(content),
        published: publishStatus,
        coverImg: coverImg,
        user: {
          connect: {
            email: email
          }
        }
      }
    })
  }
  else {
    await prisma.post.create({
      data: {
        title: parsedTitle,
        content: JSON.stringify(content),
        published: publishStatus,
        coverImg: coverImg,
        user: {
          connect: {
            email: email
          }
        }
      }
    })
  }
}


interface GetPostProps {
  username: string
  blogTitle: string
  postId: string
}





export const getPost = async ({ username, blogTitle, postId }: GetPostProps) => {
  const user = await prisma.user.findFirst({
    where: {
      name: username
    }
  })
  if (!user) {
    return null
  }

  const post = await prisma.post.findFirst({
    where: {
      userId: user?.id,
      title: blogTitle,
      id: Number(postId)!
    },
    include: {
      user: {
        select: {
          name: true,
          image: true
        }
      },
      likes: {
        select: {
          user: true
        }
      }
    }
  })

  if (!post?.content) {
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
      return { message: "Database Error: Failed to Unlike Post." + error };
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
    return { message: "Database Error: Failed to Like Post." + error };
  }
}




export const getAllPost = async () => {
  const posts = await prisma.post.findMany({
    include: {
      user: {
        select: {
          name: true,
          image: true
        },
      },
      likes: {
        select: {
          user: {
            select: {
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
    include: {
      user: {
        select: {
          name: true,
          image: true
        }
      },
      likes: {
        select: {
          user: {
            select: {
              name: true,
              image: true
            }
          }
        }
      },

    },
    orderBy: {
      likes: {
        _count: "desc"
      }
    },
    take: 3
  })


  return likedPost;

}



export const handleFollow = async (followingId: string) => {
  const session = await auth()

  if (!session || !session.user || !session.user.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email
    }
  })

  if (!user || !user.name) return null;

  const followerId = user?.id

  if (followerId === followingId) {
    return null;
  }

  const follow = await prisma.follows.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId
      }
    }
  })

  if (follow) {
    await prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    })
  }

  else {
    await prisma.follows.create({
      data: {
        followerId: followerId,
        followingId: followingId
      }
    })
  }

}