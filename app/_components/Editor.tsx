"use client"
import UploadImage from "@/components/modals/image-upload";
import { PublishModal } from "@/components/modals/publish-post";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Block } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { Loader2, Upload } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

interface EditorProps {
    initialContent?: string | undefined
    editable?: boolean
}

function Editor({ initialContent, editable}: EditorProps) {
    const {theme} = useTheme()

    const [content, setContent] = useState<Block[]>()
    const [isLoading, setIsLoading] = useState(false)
    const [coverImg, setCoverImg] = useState<string>()




    const editor = useCreateBlockNote({
        initialContent: initialContent ? JSON.parse(initialContent) as Block[] : [
            {
                type: "heading",
                content: "Your Title Here"
            },
            {
                type: "paragraph",
                content: "Type your content here..."
            }
        ]
    })










    return (
        <>  
        <div className="relative dark:bg-[#1F1F1F] min-h-screen h-full">

       <div className="w-full flex items-center">
        {coverImg ? <img width={500} height={500} className="h-40 mx-auto object-cover w-full" src={coverImg} /> : 
           (editable ? (
            <div className="px-8 py-4">
                <UploadImage setCoverImg={setCoverImg} />
            </div>
        ) : null)
         }
        </div>
        
        <BlockNoteView editor={editor} editable={editable} theme={theme === "dark" ? "dark" : "light"} onChange={()=> setContent(editor.document)} />




        {
          editable &&
          <PublishModal setCoverImg={setCoverImg} content={content} coverImg={coverImg}   />
}

       </div>
        </>

)
    

}




export function EditorSkeleton() {
    return(
        <div className="relative dark:bg-[#1F1F1F] h-screen px-8 py-2">
      <div className="w-full">
        <Skeleton className="h-40 w-full" />
      </div>
      
      <div className="p-4 space-y-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      
      <div className="space-y-2 mt-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    
    </div>
  )
    
}

export default Editor