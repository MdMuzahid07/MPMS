import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, ShieldCheck, UserRound } from "lucide-react";
import Link from "next/link";

const TEAM_MEMBERS = {
  "1": {
    id: "1",
    name: "Alex Rivera",
    email: "alex.rivera@mpms.tech",
    role: "Admin",
    department: "Core Infrastructure",
    status: "Active",
    skills: ["Kubernetes", "Go"],
  },
  "2": {
    id: "2",
    name: "Sarah Chen",
    email: "s.chen@mpms.tech",
    role: "Manager",
    department: "Product Design",
    status: "Active",
    skills: ["React", "TypeScript", "Figma"],
  },
  "3": {
    id: "3",
    name: "Marcus Thorne",
    email: "m.thorne@mpms.tech",
    role: "Member",
    department: "Backend Systems",
    status: "Inactive",
    skills: ["Rust", "PostgreSQL"],
  },
  "4": {
    id: "4",
    name: "Elena Vance",
    email: "e.vance@mpms.tech",
    role: "Member",
    department: "Cybersecurity",
    status: "Active",
    skills: ["Python", "Ethical Hacking"],
  },
} as const;

type TeamMemberDetailsPageProps = {
  memberId: string;
};

export default function TeamMemberDetailsView({
  memberId,
}: TeamMemberDetailsPageProps) {
  const member = TEAM_MEMBERS[memberId as keyof typeof TEAM_MEMBERS];

  if (!member) {
    return (
      <div className="mx-auto w-full max-w-4xl pb-8">
        <div className="bg-card rounded-lg border p-6">
          <h1 className="text-xl font-semibold">Member not found</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            The requested team member does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4 pb-8">
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
              Department
            </p>
            <p className="text-sm font-medium">{member.department}</p>
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

        <div className="mt-4 rounded-md border p-4">
          <p className="text-muted-foreground mb-2 text-xs uppercase">Skills</p>
          <div className="flex flex-wrap gap-2">
            {member.skills.map((skill) => (
              <Badge key={skill} variant="outline">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

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
