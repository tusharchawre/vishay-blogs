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
    const coverImg = post[0].coverImg


    return (
      <>
      <div className="w-full mx-auto md:max-w-[55rem] h-full md:px-8">
        <div className="w-full flex items-center">
                {coverImg && <img width={500} height={500} className="h-40 mx-auto object-cover w-full" src={coverImg} />
                 }
                </div>
                <Editor initialContent={post[0].content} editable={false} />
      </div>
      </>
    )
  }


export default page