"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserByIdQuery } from "@/redux/feature/users/usersApi";
import { Mail, ShieldCheck, UserRound } from "lucide-react";
import Link from "next/link";

type TeamMemberDetailsPageProps = {
  memberId: string;
};

export default function TeamMemberDetailsView({
  memberId,
}: TeamMemberDetailsPageProps) {
  const { data: member, isLoading, isError } = useGetUserByIdQuery(memberId);

  if (isLoading) {
    return (
      <div className="animate-in fade-in mx-auto w-full max-w-4xl space-y-4 pb-8 duration-200">
        <Skeleton className="h-4 w-48" />
        <section className="bg-card space-y-6 rounded-lg border p-6 shadow-sm">
          <div className="flex justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-10 w-28" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (isError || !member) {
    return (
      <div className="animate-in fade-in mx-auto w-full max-w-4xl pb-8 duration-200">
        <div className="bg-card rounded-lg border p-6 py-12 text-center">
          <h1 className="text-xl font-semibold">Member not found</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            The requested team member does not exist or has been deleted.
          </p>
          <Button variant="outline" asChild className="mt-6">
            <Link href="/team">Return to Directory</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in mx-auto w-full max-w-4xl space-y-4 pb-8 duration-200">
      <div className="text-muted-foreground text-xs">
        Team / Member / <span className="text-foreground">{member.name}</span>
      </div>
      <section className="bg-card rounded-lg border p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {member.name}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">{member.email}</p>
          </div>
          <Button asChild>
            <Link href={`/team/${member.id}/edit`}>Edit Member</Link>
          </Button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-md border p-4">
            <p className="text-muted-foreground mb-2 text-xs uppercase">Role</p>
            <p className="text-sm font-medium">{member.role}</p>
          </div>
          <div className="rounded-md border p-4">
            <p className="text-muted-foreground mb-2 text-xs uppercase">
              Status
            </p>
            <Badge variant={member.status === "Active" ? "default" : "outline"}>
              {member.status}
            </Badge>
          </div>
          <div className="rounded-md border p-4">
            <p className="text-muted-foreground mb-2 text-xs uppercase">
              Contact
            </p>
            <p className="flex items-center gap-2 text-sm">
              <Mail className="size-4" />
              {member.email}
            </p>
          </div>
        </div>

        {member.skills && member.skills.length > 0 && (
          <div className="mt-4 rounded-md border p-4">
            <p className="text-muted-foreground mb-2 text-xs uppercase">
              Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {member.skills.map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="text-muted-foreground flex items-center gap-2 rounded-md border p-3 text-sm">
            <UserRound className="size-4" />
            Member profile synced
          </div>
          <div className="text-muted-foreground flex items-center gap-2 rounded-md border p-3 text-sm">
            <ShieldCheck className="size-4" />
            Access rules up to date
          </div>
        </div>
      </section>
    </div>
  );
}
