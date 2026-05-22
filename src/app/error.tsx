"use client";

import Link from "next/link";
import { RefreshCcw, ArrowLeft } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-foreground text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
        Oops! Something went wrong.
      </h1>
      <p className="text-muted-foreground mt-4 max-w-md">
        {error?.message || "An unexpected error has occurred."}
      </p>
      <div className="mt-8 flex gap-4">
        <button
          onClick={() => reset()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Try again
        </button>
        <Link
          href="/"
          className="bg-muted text-muted-foreground hover:bg-muted/80 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go home
        </Link>
      </div>
    </div>
  );
}
