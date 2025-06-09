import { Editor } from "@/app/_components/DynamicEditor"
import { getPost } from "@/app/action"

type Props = {
  params: Promise<{ username: string, blogTitle: string }>
}

const page = async ({ params }: Props) => {
  const encodedTitleWithId = (await params).blogTitle
  const username = (await params).username

  const lastDashIndex = encodedTitleWithId.lastIndexOf('-')
  const postId = encodedTitleWithId.substring(lastDashIndex + 1)
  const blogTitle = encodedTitleWithId.substring(0, lastDashIndex).replaceAll("-", " ")

  const post = await getPost({ username, blogTitle, postId })

  if (!post || !post.content) {
    return null
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
        editable={
          post.published ? false : true
        } />
    </div>
  )
}

export default page