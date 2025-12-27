'use client';
import UploadImage from '@/components/modals/image-upload';
import { motion } from 'motion/react';
import { PublishModal } from '@/components/modals/publish-post';
import { Skeleton } from '@/components/ui/skeleton';
import { Block, BlockNoteEditor, filterSuggestionItems } from '@blocknote/core';
import '@blocknote/core/fonts/inter.css';
import { createGroq } from '@ai-sdk/groq';
import { en } from '@blocknote/core/locales';
import { en as aiEn } from '@blocknote/xl-ai/locales';
import {
  AIMenuController,
  AIToolbarButton,
  createAIExtension,
  createBlockNoteAIClient,
  getAISlashMenuItems,
} from '@blocknote/xl-ai';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import '@blocknote/xl-ai/style.css';
import DOMPurify from 'dompurify';
import {
  DefaultReactSuggestionItem,
  FormattingToolbar,
  FormattingToolbarController,
  getDefaultReactSlashMenuItems,
  getFormattingToolbarItems,
  SuggestionMenuController,
  useCreateBlockNote,
} from '@blocknote/react';
import { BrainCircuit, Check, Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState, useCallback } from 'react';
import { useCompletion } from 'ai/react';
import Image from 'next/image';
import { Post } from '@prisma/client';

interface EditorProps {
  post?: Post;
  initialContent?: string | null;
  editable?: boolean;
  draftImg?: string | undefined;
}

function Editor({ initialContent, editable, draftImg, post }: EditorProps) {
  const { theme } = useTheme();
  const [html, setHTML] = useState<string>('');
  const [editing, setEditing] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const [content, setContent] = useState<Block[]>(
    initialContent ? (JSON.parse(initialContent) as Block[]) : []
  );
  const [coverImg, setCoverImg] = useState<string | undefined>(draftImg);

  const model = createGroq({
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY || '',
  })('llama-3.3-70b-versatile');

  const editor = useCreateBlockNote({
    dictionary: {
      ...en,
      ai: aiEn,
    },
    extensions: [
      createAIExtension({
        model,
      }),
    ],
    initialContent: initialContent
      ? content
      : [
          {
            type: 'heading',
            content: 'Your Title Here',
          },
          {
            type: 'paragraph',
            content: 'Type your content here...',
          },
        ],
  });

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
              break;
            }
            const chunk = decoder.decode(value, { stream: true });
            editor?._tiptapEditor.commands.insertContent(chunk);
          }
        } catch (error) {
          console.error('Stream processing error:', error);
        }
      } else {
        console.error('Response body is null');
      }
    },
  });

  const insertMagicAi = (editor: BlockNoteEditor) => {
    const prevText = editor._tiptapEditor.state.doc.textBetween(
      Math.max(0, editor._tiptapEditor.state.selection.from - 5000),
      editor._tiptapEditor.state.selection.from - 1,
      '\n'
    );
    complete(prevText);
  };

  const insertAiItem = (editor: BlockNoteEditor) => ({
    title: 'Insert AI Generated Text',
    onItemClick: async () => {
      insertMagicAi(editor);
    },
    aliases: ['autocomplete', 'AI'],
    group: 'AI',
    icon: <BrainCircuit size={18} />,
    subtext: 'Continue your post with AI-generated text.',
  });

  const getCustomSlashMenuItems = (
    editor: BlockNoteEditor
  ): DefaultReactSuggestionItem[] => [
    insertAiItem(editor),
    ...getAISlashMenuItems(editor),
    ...getDefaultReactSlashMenuItems(editor),
  ];

  const onChange = useCallback(async () => {
    if (!editable) {
      const html = await editor.blocksToFullHTML(editor.document);
      const sanitizedHTML = DOMPurify.sanitize(html);
      setHTML(sanitizedHTML);
    } else {
      setEditing(true);
      setContent(editor.document);
      const html = await editor.blocksToHTMLLossy(editor.document);
      const searchText = html
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      setSearchText(searchText);

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('editor', JSON.stringify(editor.document));
      }

      setTimeout(() => setEditing(false), 2000);
    }
  }, [editable, editor]);

  useEffect(() => {
    if (!editable) {
      onChange();
    }
  }, [editable, onChange]);

  if (!editable) {
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
              className="mx-auto mt-4 h-64 w-full rounded-md object-cover"
              src={coverImg}
              alt="Cover Image"
            />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="prose prose-lg dark:prose-invert max-w-none"
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
      <div className="relative h-full min-h-screen dark:bg-[#1F1F1F]">
        <div className="flex w-full items-center">
          {coverImg ? (
            <Image
              width={1080}
              height={900}
              className="mx-auto h-52 w-full object-cover"
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
          <p className="flex items-center gap-1 px-8 text-sm text-muted-foreground">
            <Loader2 className="animate-spin duration-300" size={16} />
            Saving...
          </p>
        ) : (
          <p className="flex items-center gap-1 px-8 text-sm text-muted-foreground">
            <Check size={16} />
            Saved in your session storage...
          </p>
        )}

        <BlockNoteView
          editor={editor}
          slashMenu={false}
          formattingToolbar={false}
          editable={editable}
          theme={theme === 'dark' ? 'dark' : 'light'}
          onChange={onChange}
        >
          <SuggestionMenuController
            triggerCharacter={'/'}
            getItems={async (query) =>
              filterSuggestionItems(getCustomSlashMenuItems(editor), query)
            }
          />
          <FormattingToolbarWithAI />

          <AIMenuController />
        </BlockNoteView>

        {editable && (
          <PublishModal
            postId={post?.id}
            setCoverImg={setCoverImg}
            content={content}
            coverImg={coverImg}
            searchText={searchText}
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

      <div className="space-y-4 p-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      <div className="mt-8 space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

function FormattingToolbarWithAI() {
  return (
    <FormattingToolbarController
      formattingToolbar={() => (
        <FormattingToolbar>
          {...getFormattingToolbarItems()}
          <AIToolbarButton />
        </FormattingToolbar>
      )}
    />
  );
}

export default Editor;
