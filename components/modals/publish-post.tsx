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
import { Globe2Icon, LockKeyhole } from "lucide-react"
import { Input } from "../ui/input"
import { Block } from "@blocknote/core"
import { Dispatch, SetStateAction, useState } from "react"
import { savePost } from "@/app/action"

interface PublishModalProps{
    content: Block[] | undefined
    coverImg: string | undefined
}

export const PublishModal = ({content , coverImg}: PublishModalProps) => {

    const [publishStatus , setPublish] = useState(false)

    const handleSave = async () => {
        //Show error to tell the user to add content.

        if(!content) return null;
        if(!coverImg) return null
        savePost({content, coverImg, publishStatus})
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
                
                <div className="flex w-full justify-between">
                <Input className="w-full mr-2" placeholder="Enter the Prompt for Cover Image" />
                <Button>
                    Generate
                </Button>

                </div>

                <DialogFooter>
                    <Button type="submit" onClick={handleSave}>
                        Publish
                    </Button>
                </DialogFooter>

            </DialogContent>


        </Dialog>
        </>
    )
}