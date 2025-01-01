"use client"
import { Button } from "@/components/ui/button";
import { Block } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useState } from "react";

interface EditorProps {
    onSave?: (content: Block[]) => void
    initialContent?: string | undefined
    editable?: boolean
}

function Editor({onSave, initialContent, editable}: EditorProps) {

    const [content, setContent] = useState<Block[]>()


    const handleSave = async () => {
        setContent(editor.document)
        if(!content) return null;
        if(onSave) onSave(content)
    }





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
        <BlockNoteView editor={editor} editable={editable} theme="light" onChange={()=> setContent(editor.document)} />
       {editable && <Button className="absolute top-4 right-4" onClick={handleSave}>Publish Post</Button>}
        </>

)
    

}

export default Editor