"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "../ui/select";
import { Globe2Icon, Loader2, LockKeyhole } from "lucide-react";
import { Input } from "../ui/input";
import { Block } from "@blocknote/core";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { savePost } from "@/app/action";
import { Separator } from "../ui/separator";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface PublishModalProps {
  content: Block[] | undefined;
  coverImg: string | undefined;
  postId: number | undefined;
  searchText: string | undefined;
  setCoverImg: Dispatch<SetStateAction<string | undefined>>;
}

export const PublishModal = ({
  content,
  coverImg,
  setCoverImg,
  postId,
  searchText,
}: PublishModalProps) => {
  const [publishStatus, setPublish] = useState(false);
  const [prompt, setPrompt] = useState<string | undefined>();
  const [genImage, setGenImage] = useState(
    coverImg ? coverImg : "/placeholder.svg",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);

  const promptRef = useRef<HTMLInputElement>(null);

  const session = useSession();

  const router = useRouter();

  const handleSave = async () => {
    //Show error to tell the user to add content
    setPublishLoading(true);
    if (!content) return toast("Please insert content");
    if (!coverImg) {
      const parsedTitle = JSON.parse(
        JSON.stringify(content[0].content, ["text"]),
      )[0].text;

      const coverImageGen = await autoGenerateImage(parsedTitle);
      setCoverImg(coverImageGen);

      if (!coverImg) {
        return new Error("The Cover Image is still not Generated");
      }
    }
    if (!searchText) {
      return toast.error("Please insert content");
    }
    console.log(searchText);
    const result = await savePost({
      content,
      coverImg,
      publishStatus,
      postId,
      searchText,
    });
    if (result instanceof Error) {
      setPublishLoading(false);
      return toast.error(result.message);
    }

    toast.success("Post published successfully");

    localStorage.removeItem("editor");

    setPublishLoading(false);

    router.push(`/${session.data?.user?.name}`);
  };

  const autoGenerateImage = async (title: string) => {
    setIsLoading(true);
    setPrompt(promptRef.current?.value);
    const imageUrl = await fetch("/api/generate-image", {
      method: "POST",
      body: JSON.stringify({ prompt: title }),
    });
    const data = await imageUrl.json();
    setGenImage(data.url);
    setIsLoading(false);
    return data.url;
  };

  const generateImage = async () => {
    setIsLoading(true);
    if (prompt === undefined) setIsLoading(false);
    const imageUrl = await fetch("/api/generate-image", {
      method: "POST",
      body: JSON.stringify({ prompt: prompt }),
    });
    const data = await imageUrl.json();
    setGenImage(data.url);
    setCoverImg(data.url);
    setIsLoading(false);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild className="absolute top-5 right-10">
          <Button>Publish</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Publish your Blog</DialogTitle>
            <DialogDescription>
              Select the following details and publish the blog.
            </DialogDescription>
          </DialogHeader>

          <Label htmlFor="type">Save or Publish</Label>
          <Select onValueChange={(value) => setPublish(value === "true")}>
            <SelectTrigger>
              <SelectValue placeholder="Select the Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select the Visibility</SelectLabel>
                <SelectItem value="false">
                  <div className="flex gap-2">
                    <LockKeyhole />
                    <p>Private </p>
                  </div>
                </SelectItem>
                <SelectItem value="true">
                  <div className="flex gap-2">
                    <Globe2Icon />
                    <p>Public </p>
                  </div>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Separator className="my-2" />

          <div className="bg-muted mx-auto aspect-square h-40 overflow-hidden rounded-md border-[.3px] border-white/10">
            {isLoading ? (
              <div className="flex h-full w-full items-center justify-center gap-2 dark:text-gray-500 dark:grayscale">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p>Generating</p>
              </div>
            ) : (
              <Image
                src={coverImg ? coverImg : genImage}
                height={500}
                width={500}
                className={cn(
                  "object-cover",
                  genImage === "/placeholder.svg" &&
                    "scale-150 dark:brightness-[0.4] dark:grayscale",
                )}
                alt="Generate Cover Image"
              />
            )}
          </div>

          <div className="flex w-full justify-between">
            <Input
              ref={promptRef}
              className="mr-2 w-full"
              onChange={() => setPrompt(promptRef.current?.value)}
              placeholder="Enter the Prompt for Cover Image"
            />
            <Button disabled={isLoading} onClick={generateImage}>
              Generate
            </Button>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={publishLoading}
              onClick={handleSave}
            >
              {publishLoading ? (
                <div className="flex h-full w-full items-center justify-center gap-2 dark:text-gray-500 dark:grayscale">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p>Publishing</p>
                </div>
              ) : (
                <p>Publish</p>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
