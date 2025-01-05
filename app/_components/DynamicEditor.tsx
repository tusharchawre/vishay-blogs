"use client";
 
import dynamic from "next/dynamic";
import { ItemSkeleton } from "./PostItem";
import { EditorSkeleton } from "./Editor";


 
export const Editor = dynamic(() => import("./Editor"), { ssr: false, loading: ()=><EditorSkeleton />});