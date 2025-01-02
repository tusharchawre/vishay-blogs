"use client"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { LogOut, User } from 'lucide-react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { Newsreader } from 'next/font/google'
import Link from 'next/link'




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
        <Link href="/">
        <p className={`${newsReader.className} text-2xl`}>Vishay</p>
        </Link>
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
                            <Link href={`/${session.user.name}`}>
                            <div className='w-full h-fit items-center px-2 py-2 text-black/60 hover:bg-black/5 rounded-md transition-all ease-out flex gap-2'>
                                <User className='size-4' />
                                <p>Profile</p>
                            </div>
                            </Link>


                            <div onClick={()=>signOut()} className='w-full h-fit justify-center px-2 py-2 text-black/60 hover:bg-black/5 rounded-md transition-all ease-out flex flex-col gap-2'>
                                <div className='flex gap-2 items-center'>
                                <LogOut className='size-4' />
                                <p>Sign Out</p>
                                </div>
                                <p className='text-sm'>{session.user.email?.slice(0,3)+"*********"+session.user.email?.slice(-10)}</p>
                            </div>
                            
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