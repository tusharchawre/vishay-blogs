import { Editor } from "@/app/_components/DynamicEditor"
import { getPost } from "@/app/action"
import { prisma } from "@/prisma"

const page = async ({ params }: { params: { blogTitle: string, username: string } }) => {

    const blogTitle = (await params).blogTitle.replaceAll("-", " ")
    const username = (await params).username
    
    const post = await getPost({username, blogTitle})

    if(!post || !post[0].content){
        return null
    }


    return (
      <div>
        <Editor initialContent={post[0].content} editable={false} />
      </div>
    )
  }


export default page