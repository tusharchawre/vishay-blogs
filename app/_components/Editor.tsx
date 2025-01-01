"use client"
import { Button } from "@/components/ui/button";
import { Block } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useState } from "react";

interface EditorProps {
    onSave: (content: Block[]) => void
}

function Editor({onSave}: EditorProps) {

    const [content, setContent] = useState<Block[]>()




    const handleSave = async () => {
        setContent(editor.document)
        if(!content) return null;
        onSave(content)
    }





    const editor = useCreateBlockNote({
        initialContent:[
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
        <BlockNoteView editor={editor} theme="light" onChange={()=> setContent(editor.document)} />
        <Button className="absolute top-4 right-4" onClick={handleSave}>Publish Post</Button>
        </>

)
    

}

export default Editor