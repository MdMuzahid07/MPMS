"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-foreground text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
        404 – Page Not Found
      </h1>
      <p className="text-muted-foreground mt-4 max-w-md">
        Oops! The page you are looking for doesn’t exist or has been moved.
      </p>
      <Link
        href="/"
        className="bg-primary text-primary-foreground hover:bg-primary/90 mt-8 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Go back home
      </Link>
    </div>
  );
}
