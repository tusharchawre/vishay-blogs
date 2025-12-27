'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { ImageIcon } from 'lucide-react';
import { useEdgeStore } from '@/lib/edgestore';
import { SingleImageDropzone } from '../SingleImageDropzone';

interface UploadImageProps {
  setCoverImg: (coverImg: string) => void;
}

export default function UploadImage({ setCoverImg }: UploadImageProps) {
  const [file, setFile] = useState<File>();
  const { edgestore } = useEdgeStore();

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            className="flex h-full text-foreground/60 transition-all ease-out hover:bg-foreground/5 dark:hover:bg-foreground/30"
          >
            <ImageIcon />
            Add Cover
          </Button>
        </DialogTrigger>
        <DialogContent className="flex flex-col items-center">
          <DialogTitle>Upload Image</DialogTitle>

          {/* TODO // Add AI Image gen section */}
          <SingleImageDropzone
            width={200}
            height={200}
            value={file}
            onChange={(file) => {
              setFile(file);
            }}
          />

          <DialogClose>
            <Button
              className="w-full"
              onClick={async () => {
                if (file) {
                  const res = await edgestore.publicFiles.upload({
                    file,
                    onProgressChange: (progress) => {
                      // you can use this to show a progress bar
                      console.log(progress);
                    },
                  });
                  if (res.url === undefined) return null;
                  setCoverImg(res.url);
                }
              }}
            >
              Upload
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}
