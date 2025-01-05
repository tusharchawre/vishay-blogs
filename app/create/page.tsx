"use client"
import { Block } from "@blocknote/core";
import { Editor } from "../_components/DynamicEditor";
import { savePost } from "../action";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import { Navbar } from "../_components/Navbar";
import UploadImage from "@/components/modals/image-upload";

const Page = () => {


  const saveContent = (content: Block[], coverImg: string) => {
    savePost({content, coverImg})

  };

  return (
    <div>
      <Editor onSave={saveContent} editable={true} />
    </div>
  );
};

export default Page;
