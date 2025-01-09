"use client"
import { ThemeSwitch } from '@/components/theme-switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { LogOut, PenBox, User } from 'lucide-react'
import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'



export const Navbar = () =>{
    const { data: session, status } = useSession()


    return (
    <>
    <nav className="w-full h-16 flex justify-between items-center md:px-12 py-4 border-b-[0.3px] border-black/3 bg-background">



    <Link href="/" className="relative h-[4.2rem] w-[200px] -translate-x-10 p-4 transition-all">
                <Image
                    className="h-full w-full hidden dark:block"
                    width={200}
                    height={200}
                    src="/Vishay-logo-dark.svg"
                    alt="Vishay Logo Dark"
                />
                <Image
                    className="h-full w-full block dark:hidden"
                    width={200}
                    height={200}
                    src="/Vishay-logo.svg"
                    alt="Vishay Logo Light"
                />
            </Link>

        <div className='flex gap-4 items-center'>
            <Link href="/create">
            <div className='flex gap-2 items-center cursor-pointer text-sm'>
                <PenBox className='h-4 w-4 text-muted-foreground' />
                <p className='hidden md:block text-muted-foreground'>Create Post</p>
            </div>
            </Link>
            <ThemeSwitch />
            {status === "authenticated" ? (
                <div className='w-9 aspect-square rounded-full bg-gray-300 overflow-hidden flex gap-4'>
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
                            <div className='w-full h-fit items-center px-2 py-2 text-foreground/60 hover:bg-muted-foreground/10 rounded-md transition-all ease-out flex gap-2'>
                                <User className='size-4' />
                                <p>Profile</p>
                            </div>
                            </Link>

                            <Separator className='my-2' />
                            <div onClick={()=>signOut()} className='w-full h-fit justify-center px-2 py-2 text-foreground/60 hover:bg-muted-foreground/10 rounded-md transition-all ease-out flex flex-col gap-2 cursor-pointer'>
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