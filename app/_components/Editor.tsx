"use client";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
 

export default function Editor() {

  const editor = useCreateBlockNote({
    initialContent: [
        {
            type: "heading",
            content: "New Title"
        },
        {
            type:  "paragraph",
            content: "Add your Content here"
        }
    ]
  });
 
  return <BlockNoteView editor={editor} theme="light" />;
}