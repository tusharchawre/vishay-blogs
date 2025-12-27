'use client';
import Link from 'next/link';
import { motion } from 'motion/react';

export const PostNotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center gap-4"
    >
      <h1 className="text-2xl font-semibold">Post Not Found</h1>
      <p className="max-w-md text-center text-muted-foreground">
        The post you're looking for doesn't exist or has been removed.
      </p>
      <Link
        href="/"
        className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Return Home
      </Link>
    </motion.div>
  );
};
