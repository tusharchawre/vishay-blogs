"use client"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { signIn, signOut, useSession } from 'next-auth/react'
import { Newsreader } from 'next/font/google'




const newsReader = Newsreader({
    subsets: ["latin"],
    weight: "700",
    style: "normal"
})

export const Navbar = () =>{
    const { data: session, status } = useSession()

    return (
    <>
    <nav className="w-full h-16 flex justify-between items-center px-12 py-4 border-b border-black/10">

        <p className={`${newsReader.className} text-2xl`}>Vishay</p>
        <div>
            {status === "authenticated" ? (
                <div className='w-9 aspect-square rounded-full bg-gray-300 overflow-hidden'>
                    {session.user?.image ? (
                        <Popover>
                        <PopoverTrigger>
                        <Avatar>
                        <AvatarImage src={session.user.image} />
                        <AvatarFallback>U</AvatarFallback>
                         </Avatar>
                        </PopoverTrigger>

                        <PopoverContent>
                            Profile
                            <Button variant="default" onClick={()=>signOut()}>
                                Sign Out
                            </Button>
                        </PopoverContent>
                        </Popover>
                    ):
                    (
                        <Skeleton className='w-full h-full rounded-full bg-black' />
                    )
                    }

                </div>
            ):(
                <Button onClick={()=>signIn("google")}>
                Sign In
            </Button>
            )}

        </div>
    </nav>

    </>
    )
}