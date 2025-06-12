import { Editor } from "@/app/_components/DynamicEditor"
import { getPost } from "@/app/action"
import { PostNotFound } from "@/app/_components/PostNotFound"
import { decodeBlogUri } from "@/app/utils/uriParser"

type Props = {
  params: Promise<{ username: string, blogTitle: string }>
}

const page = async ({ params }: Props) => {
  const encodedTitleWithId = (await params).blogTitle
  const username = (await params).username

  const { title: blogTitle, postId } = decodeBlogUri(encodedTitleWithId);

  const post = await getPost({ username, postId})

  if (!post || !post.content) {
    return <PostNotFound />
  }

  const coverImg = post.coverImg

  return (
    <div className="w-full mx-auto md:max-w-[55rem] min-h-[100vh] h-fit md:px-8">
      <div className="w-full flex items-center">
        {/* {coverImg && <Image alt="CoverImage" width={500} height={500} className="h-48 mx-auto object-cover w-full" src={coverImg} />
         } */}
      </div>
      <Editor initialContent={post.content}
        draftImg={coverImg ? coverImg : ""}
      />
    </div>
  )
}

export default page