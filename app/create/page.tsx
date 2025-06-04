"use client";
import { Editor } from "../_components/DynamicEditor";

const Page = () => {
  return (
    <div>
      <Editor
        initialContent={
          localStorage.getItem("editor")
            ? localStorage.getItem("editor")!
            : undefined
        }
        editable={true}
      />
    </div>
  );
};

export default Page;
