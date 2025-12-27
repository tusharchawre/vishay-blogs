'use client';
import { ThemeSwitch } from '@/components/theme-switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, LogOut, PenBox, User } from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { SearchBar } from './SearchBar';

export const Navbar = () => {
  const { data: session, status } = useSession();

  return (
    <>
      <nav className="border-black/3 flex h-16 w-full items-center justify-between border-b-[0.3px] bg-transparent py-4 md:px-12">
        <Link
          href="/"
          className="relative h-[4.2rem] w-[200px] -translate-x-10 p-4 transition-all"
        >
          <Image
            className="hidden h-full w-full dark:block"
            width={200}
            height={200}
            src="/Vishay-logo-dark.svg"
            alt="Vishay Logo Dark"
          />
          <Image
            className="block h-full w-full dark:hidden"
            width={200}
            height={200}
            src="/Vishay-logo.svg"
            alt="Vishay Logo Light"
          />
        </Link>

        <div className="z-100 relative flex items-center gap-4">
          <SearchBar />
          <div className="flex items-center gap-2">
            <ThemeSwitch />
            <Link href="/create" prefetch>
              <Button variant="ghost" size="sm" className="gap-2">
                <PenBox className="h-4 w-4" />
                <span className="hidden text-muted-foreground md:inline">
                  Create Post
                </span>
              </Button>
            </Link>
          </div>

          {status === 'authenticated' ? (
            <div className="flex aspect-square w-9 gap-4 overflow-hidden rounded-full">
              {session.user?.image ? (
                <Popover>
                  <PopoverTrigger>
                    <Avatar>
                      <AvatarImage src={session.user.image} />
                      <AvatarFallback>
                        <Image
                          width={300}
                          height={300}
                          alt="User Image"
                          src={`https://ui-avatars.com/api/?name=${session.user.name}&background=random&rounded=true&`}
                        />
                      </AvatarFallback>
                    </Avatar>
                  </PopoverTrigger>

                  <PopoverContent className="my-2 bg-black/40">
                    <Link href={`/${session.user.name}`}>
                      <div className="flex h-fit w-full items-center gap-2 rounded-md px-2 py-2 text-foreground/60 transition-all ease-out hover:bg-muted-foreground/10">
                        <User className="size-4" />
                        <p>Profile</p>
                      </div>
                    </Link>

                    <Separator className="my-2" />
                    <div
                      onClick={() => signOut()}
                      className="flex h-fit w-full cursor-pointer flex-col justify-center gap-2 rounded-md px-2 py-2 text-foreground/60 transition-all ease-out hover:bg-muted-foreground/10"
                    >
                      <div className="flex items-center gap-2">
                        <LogOut className="size-4" />
                        <p>Sign Out</p>
                      </div>
                      <p className="text-sm">
                        {session.user.email?.slice(0, 3) +
                          '*********' +
                          session.user.email?.slice(-10)}
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <Skeleton className="h-full w-full rounded-full bg-black" />
              )}
            </div>
          ) : (
            <div>
              {status === 'loading' ? (
                <Loader2 size={16} className="animate-spin duration-300" />
              ) : (
                <Button onClick={() => signIn('google')}>Sign In</Button>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
};
