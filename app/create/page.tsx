"use client"
import { Block } from "@blocknote/core";
import { Editor } from "../_components/DynamicEditor";
import { prisma } from "@/prisma";
import { useSession } from "next-auth/react";
import { savePost } from "../action";

const Page = () => {


  const saveContent = (content: Block[]) => {


    savePost(content)


  };

  return (
    <div>
      <Editor onSave={saveContent} editable={true} />
    </div>
  );
};

export default Page;
