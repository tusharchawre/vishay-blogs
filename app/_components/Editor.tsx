"use client";
import UploadImage from "@/components/modals/image-upload";
import { motion } from "motion/react";
import { PublishModal } from "@/components/modals/publish-post";
import { Skeleton } from "@/components/ui/skeleton";
import { Block, BlockNoteEditor, filterSuggestionItems } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import DOMPurify from "dompurify";
import {
  DefaultReactSuggestionItem,
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
  useCreateBlockNote,
} from "@blocknote/react";
import { BrainCircuit, Check, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useCompletion } from "ai/react";
import Image from "next/image";

interface EditorProps {
  initialContent?: string | undefined;
  editable?: boolean;
  draftImg?: string | undefined;
}

function Editor({ initialContent, editable, draftImg }: EditorProps) {
  const { theme } = useTheme();
  const [html, setHTML] = useState<string>("");
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState<Block[]>(
    initialContent ? (JSON.parse(initialContent) as Block[]) : []
  );
  const [coverImg, setCoverImg] = useState<string | undefined>(draftImg);

  const { complete } = useCompletion({
    id: "hackathon_starter",
    api: "/api/generate-text",
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
              break;
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
    },
  });

  const insertMagicAi = (editor: BlockNoteEditor) => {
    const prevText = editor._tiptapEditor.state.doc.textBetween(
      Math.max(0, editor._tiptapEditor.state.selection.from - 5000),
      editor._tiptapEditor.state.selection.from - 1,
      "\n"
    );
    complete(prevText);
  };

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
  ): DefaultReactSuggestionItem[] => [
    insertAiItem(editor),
    ...getDefaultReactSlashMenuItems(editor),
  ];

  const editor = useCreateBlockNote({
    initialContent: initialContent
      ? content
      : [
          {
            type: "heading",
            content: "Your Title Here",
          },
          {
            type: "paragraph",
            content: "Type your content here...",
          },
        ],
  });

  if (!editable) {
    const onChange = async () => {
      const html = await editor.blocksToFullHTML(editor.document);
      const sanitizedHTML = DOMPurify.sanitize(html);
      setHTML(sanitizedHTML);
      console.log(html);
    };

    useEffect(() => {
      onChange();
    }, []);

    return (
      <>
        {coverImg && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{ duration: 1.2 }}
          >
            <Image
              width={1080}
              height={900}
              className="h-64 mx-auto object-cover w-full mt-4 rounded-md"
              src={coverImg}
              alt="Cover Image"
            />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="prose prose-lg max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </>
    );
  }

  return (
    <>
      <style>
        {`
      .bn-editor {
        padding-inline: 16px;
      }

      @media (min-width: 768px) {
        .bn-editor {
          padding-inline: 54px;
        }
      }
    `}
      </style>
      <div className="relative dark:bg-[#1F1F1F] min-h-screen h-full">
        <div className="w-full flex items-center">
          {coverImg ? (
            <Image
              width={1080}
              height={900}
              className="h-52 mx-auto object-cover w-full"
              src={coverImg}
              alt="Cover Image"
            />
          ) : editable ? (
            <div className="px-8 py-4">
              <UploadImage setCoverImg={setCoverImg} />
            </div>
          ) : null}
        </div>

        {editing ? (
          <p className="text-muted-foreground px-8 text-sm flex gap-1 items-center">
            <Loader2 className="animate-spin duration-300" size={16} />
            Saving...
          </p>
        ) : (
          <p className="text-muted-foreground px-8 text-sm flex gap-1 items-center">
            <Check size={16} />
            Saved in your local storage...
          </p>
        )}

        <BlockNoteView
          editor={editor}
          slashMenu={false}
          editable={editable}
          theme={theme === "dark" ? "dark" : "light"}
          onChange={() => {
            setEditing(true);
            setContent(editor.document);
            localStorage.setItem("editor" , JSON.stringify(editor.document))
            setTimeout(()=> setEditing(false), 2000)
          }}
        >
          <SuggestionMenuController
            triggerCharacter={"/"}
            getItems={async (query) =>
              filterSuggestionItems(getCustomSlashMenuItems(editor), query)
            }
          />
        </BlockNoteView>

        {editable && (
          <PublishModal
            setCoverImg={setCoverImg}
            content={content}
            coverImg={coverImg}
          />
        )}
      </div>
    </>
  );
}

export function EditorSkeleton() {
  return (
    <div className="relative h-screen px-8 py-2">
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
  );
}

export default Editor;
