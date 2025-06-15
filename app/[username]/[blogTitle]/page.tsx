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
  const post = await getPost({ username, postId })

  if (!post || !post.content) {
    return <PostNotFound />
  }
 

  return (
    <div className="w-full mx-auto md:max-w-[55rem] min-h-[100vh] h-fit md:px-8">
      <div className="sr-only" aria-hidden="true">
        <h1>{post.title}</h1>
        {post.coverImg && <img src={post.coverImg} alt="Cover Image" />}
        <div dangerouslySetInnerHTML={{ __html: post.searchText! }} />
      </div>
      <Editor
        initialContent={post.content}
        draftImg={post.coverImg ? post.coverImg : ""}
        editable={false}
      />
    </div>
  )
}

export default page