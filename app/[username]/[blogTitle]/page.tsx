import { Editor } from "@/app/_components/DynamicEditor"
import { getPost } from "@/app/action"
import Image from "next/image"


type Props = {
  params: Promise<{ username: string, blogTitle: string }>
}


const page = async ({ params }: Props) => {
    const encodedTitle = (await params).blogTitle
    const username = (await params).username
    const blogTitle = decodeURIComponent(encodedTitle)

    
    const post = await getPost({username, blogTitle})



    if(!post || !post[0].content){
        return null
    }


    const coverImg = post[0].coverImg



    return (
      <>
      <div className="w-full mx-auto md:max-w-[55rem] h-fit md:px-8">
        <div className="w-full flex items-center">
                {/* {coverImg && <Image alt="CoverImage" width={500} height={500} className="h-48 mx-auto object-cover w-full" src={coverImg} />
                 } */}
                </div>
                <Editor initialContent={post[0].content} 
                draftImg={coverImg ? coverImg : ""} 
                editable={
                  post[0].published ? false : true
                } />
      </div>
      </>
    )
  }


export default page