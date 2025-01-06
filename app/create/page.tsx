"use client"
import { Block } from "@blocknote/core";
import { Editor } from "../_components/DynamicEditor";
import { savePost } from "../action";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import { Navbar } from "../_components/Navbar";
import UploadImage from "@/components/modals/image-upload";

const Page = () => {



  return (
    <div>
      <Editor editable={true} />
    </div>
  );
};

export default Page;
