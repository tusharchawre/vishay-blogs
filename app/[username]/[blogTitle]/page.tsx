import { Editor } from "@/app/_components/DynamicEditor"
import { getPost } from "@/app/action"

const page = async ({ params }: { params: { blogTitle: string, username: string } }) => {
    const encodedTitle = (await params).blogTitle
    const blogTitle = decodeURIComponent(encodedTitle)
    const username = (await params).username
    
    const post = await getPost({username, blogTitle})

    if(!post || !post[0].content){
        return null
    }

    const userImg = post[0].user.image


    return (
      <div className="w-full mx-auto md:max-w-[55rem] md:px-8 py-4">
        <Editor initialContent={post[0].content} editable={false} />
      </div>
    )
  }


export default page