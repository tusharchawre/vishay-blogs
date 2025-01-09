"use client"
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger } from "@/components/ui/dialog"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { 
    Select, 
    SelectGroup, 
    SelectLabel, 
    SelectTrigger,
    SelectContent, 
    SelectValue, 
    SelectItem } from "../ui/select"
import { Globe2Icon, Loader2, LockKeyhole } from "lucide-react"
import { Input } from "../ui/input"
import { Block } from "@blocknote/core"
import { Dispatch, Ref, SetStateAction, useRef, useState } from "react"
import { savePost } from "@/app/action"
import { Separator } from "../ui/separator"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface PublishModalProps{
    content: Block[] | undefined
    coverImg: string | undefined
    setCoverImg : Dispatch<SetStateAction<string | undefined>>
}

export const PublishModal = ({content , coverImg, setCoverImg}: PublishModalProps) => {

    const [publishStatus , setPublish] = useState(false)
    const [prompt, setPrompt] = useState<string | undefined>()
    const [genImage, setGenImage] = useState("/placeholder.svg")
    const [isLoading, setIsLoading] = useState(false)
    const [publishLoading, setPublishLoading] = useState(false)

    const promptRef = useRef<HTMLInputElement>(null)




    const handleSave = async () => {
        //Show error to tell the user to add content.
        setPublishLoading(true)
        if(!content) return null;
        if(!coverImg) {

            const parsedTitle = JSON.parse(JSON.stringify(content[0].content, ["text"]))[0].text;

            const coverImageGen = await autoGenerateImage(parsedTitle)
            setCoverImg(coverImageGen)

            if(!coverImg)
            {return new Error("The Cover Image is still not Generated");}

        }
        savePost({content, coverImg, publishStatus})

        setPublishLoading(false)

    }

    const autoGenerateImage = async (title: string) => {
        setIsLoading(true)
        setPrompt(promptRef.current?.value)
        const imageUrl = await fetch("/api/generate-image", {
            method: "POST",
            body: JSON.stringify({prompt : title})
        })
        const data = await imageUrl.json()
        setGenImage(data.url)
        setIsLoading(false)
        return data.url
    }


    const generateImage = async () => {
        setIsLoading(true)
        setPrompt(promptRef.current?.value)
        if(prompt === undefined) return null;
        const imageUrl = await fetch("/api/generate-image", {
            method: "POST",
            body: JSON.stringify({prompt : prompt})
        })
        const data = await imageUrl.json()
        setGenImage(data.url)
        setCoverImg(data.url)
        setIsLoading(false)
        
    }


    return(
        <>
        <Dialog>
            <DialogTrigger asChild className="absolute top-5 right-10">
            <Button>
                Publish
            </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>
                    Publish your Blog
                </DialogTitle>
                <DialogDescription>
                    Select the following details and publish the blog.
                </DialogDescription>
                </DialogHeader>

                <Label htmlFor="type">
                    Save or Publish
                </Label>
                <Select onValueChange={(value) => setPublish(value === "true")} >
                    <SelectTrigger>
                        <SelectValue placeholder="Select the Visibility" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>
                            Select the Visibility
                            </SelectLabel>
                            <SelectItem value="false" >
                                <div className="flex gap-2">
                                <LockKeyhole />
                                    <p>Private </p>
                                </div>
                            </SelectItem>
                            <SelectItem value="true" >
                                <div className="flex gap-2">
                                <Globe2Icon />
                                    <p>Public </p>
                                </div>
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Separator className="my-2" />


                <div className="mx-auto aspect-square h-40 rounded-md overflow-hidden border-[.3px] border-white/10 bg-muted">
                {isLoading ? (
                    <div className="flex gap-2 items-center justify-center w-full h-full dark:grayscale dark:text-gray-500">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <p >Generating</p>
                </div>
                ) : 
                
                (<Image 
                src={genImage} 
                height={500} 
                width={500} 
                className={cn("object-cover",
                genImage == "/placeholder.svg" && "dark:brightness-[0.4] dark:grayscale scale-150")} alt="Generate Cover Image" />)}
                </div>



                
                <div className="flex w-full justify-between">
                <Input 
                ref={promptRef}
                className="w-full mr-2" 
                placeholder="Enter the Prompt for Cover Image"  />
                <Button onClick={generateImage}>
                    Generate
                </Button>

                


                </div>

                <DialogFooter>
                    <Button type="submit" disabled={publishLoading} onClick={handleSave}>
                        {
                            publishLoading ?  (
                                <div className="flex gap-2 items-center justify-center w-full h-full dark:grayscale dark:text-gray-500">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <p >Publishing</p>
                </div>
                            ): (
                                <p >Publishing</p>
                            )
                        }
                    </Button>
                </DialogFooter>

            </DialogContent>


        </Dialog>
        </>
    )
}