import { Loader2, Trash } from "lucide-react";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useRef, useState } from "react";
import { deletePost } from "@/app/action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeleteModalProps {
    children: React.ReactNode;
    title: string;
    id: number;
}

export const DeleteModal = ({ children, title, id }: DeleteModalProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        try {
            setIsLoading(true);
            await deletePost(id, title);
            toast.success("Post was successfully deleted");
            setTimeout(() => {
                router.refresh();
            }, 1000);
        } catch (error) {
            toast.error("Failed to delete post");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Dialog>
                <DialogTrigger asChild className="relative z-[100]">
                    {children}
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Delete this Blog</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this blog?
                        </DialogDescription>
                    </DialogHeader>

                    <Label htmlFor="type">
                        This action cannot be undone.
                    </Label>

                    <Label>
                        To delete this blog, please type the "Delete this blog".
                    </Label>

                    <Input
                        onChange={(e) => setInput(e.target.value)}
                        ref={inputRef}
                        placeholder="Delete"
                        className="mt-2"
                    />

                    <DialogFooter>
                        <Button
                            onClick={handleDelete}
                            disabled={input !== "Delete this blog" || isLoading}
                            type="submit"
                            className="w-full"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash className="h-4 w-4" />
                                    Delete
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
