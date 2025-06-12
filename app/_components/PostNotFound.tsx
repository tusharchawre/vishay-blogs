"use client"
import Link from 'next/link'
import { motion } from "motion/react"

export const PostNotFound = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center gap-4"
        >

            <h1 className="text-2xl font-semibold">Post Not Found</h1>
            <p className="text-muted-foreground text-center max-w-md">
                The post you're looking for doesn't exist or has been removed.
            </p>
            <Link
                href="/"
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
                Return Home
            </Link>
        </motion.div>
    )
} 