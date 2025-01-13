"use client"
import UploadImage from "@/components/modals/image-upload";
import { PublishModal } from "@/components/modals/publish-post";
import { Skeleton } from "@/components/ui/skeleton";
import { Block, BlockNoteEditor,filterSuggestionItems } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { DefaultReactSuggestionItem, getDefaultReactSlashMenuItems, SuggestionMenuController, useCreateBlockNote } from "@blocknote/react";
import { BrainCircuit } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { useCompletion } from "ai/react";
import Image from "next/image";


interface EditorProps {
    initialContent?: string | undefined
    editable?: boolean
    draftImg? : string | undefined
}

function Editor({ initialContent, editable, draftImg}: EditorProps) {
    const {theme} = useTheme()

    const [content, setContent] = useState<Block[]>(initialContent ? JSON.parse(initialContent) as Block[] : [])
    const [coverImg, setCoverImg] = useState<string | undefined>(draftImg)




    const { complete } = useCompletion({
      id: 'hackathon_starter',
      api: '/api/generate-text',
onResponse: async (response) => {
  if (response.status === 429) {
    return; 
  }

  if (response.body) {
    try {
      const reader = response.body.getReader(); 
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read(); 
        if (done) {
          break; // Exit loop when the stream ends
        }
        const chunk = decoder.decode(value, { stream: true });
        editor?._tiptapEditor.commands.insertContent(chunk);
      }





    } catch (error) {
      console.error("Stream processing error:", error);
    }
  } else {
    console.error("Response body is null");
  }
}

    });


    const insertMagicAi = (editor: BlockNoteEditor)=> {
      const prevText = editor._tiptapEditor.state.doc.textBetween(
        Math.max(0, editor._tiptapEditor.state.selection.from - 5000),
        editor._tiptapEditor.state.selection.from - 1,
        '\n'
    );
    complete(prevText);
    }

    const insertAiItem = (editor: BlockNoteEditor) => ({
      title: "Insert AI Generated Text",
      onItemClick: async () => {
        insertMagicAi(editor);
      },
      aliases: ["autocomplete", "AI"],
      group: "AI",
      icon: <BrainCircuit size={18} />,
      subtext: "Continuew your post with AI-generated text.",
    });
     


    const getCustomSlashMenuItems = (
      editor: BlockNoteEditor
    ): DefaultReactSuggestionItem[] =>[
      insertAiItem(editor),
      ...getDefaultReactSlashMenuItems(editor)
    ]

    const editor = useCreateBlockNote({
        initialContent: initialContent ? content : [
            {
                type: "heading",
                content: "Your Title Here"
            },
            {
                type: "paragraph",
                content: "Type your content here..."
            }
        ],
        
    })













    return (
        <>  
          <style>
  {
    `
      .bn-editor {
        padding-inline: 16px;
      }

      @media (min-width: 768px) {
        .bn-editor {
          padding-inline: 54px;
        }
      }
    `
  }
</style>
        <div className="relative dark:bg-[#1F1F1F] min-h-screen h-full">

       <div className="w-full flex items-center">
        {coverImg ? <Image width={1080} height={900} className="h-52 mx-auto object-cover w-full" src={coverImg} alt="Cover Image" /> : 
           (editable ? (
            <div className="px-8 py-4">
                <UploadImage setCoverImg={setCoverImg} />
            </div>
        ) : null)
         }
        </div>
        
        <BlockNoteView 
        editor={editor} 
        slashMenu={false}
        editable={editable} 
        theme={theme === "dark" ? "dark" : "light"} 
        onChange={()=> setContent(editor.document)}>
      <SuggestionMenuController
              triggerCharacter={'/'}
              getItems={async (query) =>
                  filterSuggestionItems(getCustomSlashMenuItems(editor), query)
              }
          />



        </BlockNoteView>




        {
          editable &&
          <PublishModal  setCoverImg={setCoverImg} content={content} coverImg={coverImg}   />
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