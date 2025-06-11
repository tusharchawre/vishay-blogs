"use client"


import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Post, User } from "@prisma/client"
import { useEffect, useState, useCallback } from "react"
import { searchPost } from "@/app/action"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import debounce from "lodash/debounce"

type PostWithUser = Post & {
    user: {
        name: string;
        image: string | null;
    };
}

export function SearchBar() {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState("")
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState<PostWithUser[]>([])
    const router = useRouter()

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const debouncedSearch = useCallback(
        debounce(async (searchQuery: string) => {
            setLoading(true)
            try {
                const response = await searchPost({
                    query: searchQuery.trim(),
                    page: 1,
                    limit: 5
                })
                if (response && Array.isArray(response.posts)) {
                    setResults(response.posts as PostWithUser[])
                } else {
                    setResults([])
                }
            } catch (error) {
                console.error("Search failed:", error)
                setResults([])
            } finally {
                setLoading(false)
            }
        }, 50),
        []
    )

    const handleSearch = (searchQuery: string) => {
        setQuery(searchQuery)
        debouncedSearch(searchQuery)
    }

    useEffect(() => {
        if (open) {
            handleSearch("")
        }
    }, [open])

    const handleSelect = (post: PostWithUser) => {
        if (!post?.user?.name || !post?.title || !post?.id) {
            console.error('Invalid post data:', post)
            return
        }
        router.push(`/${post.user.name}/${post.title}/${post.id}`)
        setOpen(false)
    }

    return (
        <>
            <Button
                variant="outline"
                className="relative h-9 w-9 p-0 xl:h-9 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
                onClick={() => setOpen(true)}
            >
                <Search className="h-4 w-4 xl:mr-2" />
                <span className="hidden xl:inline-flex text-muted-foreground">Search...</span>
                <span className="sr-only">Search</span>
                <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <Command className="rounded-lg border shadow-md">
                    <CommandInput
                        placeholder="Search posts..."
                        value={query}
                        onValueChange={handleSearch}
                    />
                    <CommandList>
                        {loading && (
                            <div className="flex items-center justify-center py-6">
                                <Loader2 className="h-6 w-6 animate-spin" />
                            </div>
                        )}
                        {!loading && results.length === 0 && query && (
                            <CommandEmpty>No results found.</CommandEmpty>
                        )}
                        {!loading && results.length > 0 && (
                            <CommandGroup heading="Results">
                                {results.map((post) => (
                                    <CommandItem
                                        key={post.id}
                                        value={post.title}
                                        onSelect={() => handleSelect(post)}
                                    >
                                        <div className="flex flex-col items-start">
                                            <span className="font-medium">{post.title}</span>
                                            <span className="text-sm text-muted-foreground">
                                                by {post.user.name.replaceAll("-", " ")}
                                            </span>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </CommandDialog>
        </>
    )
} 