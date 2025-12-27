'use client';
import { Editor } from '../_components/DynamicEditor';
import { useEffect, useState } from 'react';

const Page = () => {
  const [initialContent, setInitialContent] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const savedContent = localStorage.getItem('editor');
    if (savedContent) {
      setInitialContent(savedContent);
    }
  }, []);

  return (
    <div>
      <Editor initialContent={initialContent} editable={true} />
    </div>
  );
};

export default Page;
