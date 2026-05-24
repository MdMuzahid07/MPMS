"use client";

import MpmsForm from "@/components/features/form/MpmsForm";
import MpmsInput from "@/components/features/form/MpmsInput";
import MpmsSelect from "@/components/features/form/MpmsSelect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "@/redux/feature/users/usersApi";
import { Loader2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

type MemberEditFormValues = {
  name: string;
  email: string;
  role: string;
  skills: string[];
};

type TeamMemberEditPageProps = {
  memberId: string;
};

export default function TeamMemberEditView({
  memberId,
}: TeamMemberEditPageProps) {
  const router = useRouter();
  const { data: member, isLoading, isError } = useGetUserByIdQuery(memberId);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [skillInput, setSkillInput] = useState("");

  const methods = useForm<MemberEditFormValues>({
    defaultValues: {
      name: member?.name || "",
      email: member?.email || "",
      role:
        member?.role === "Admin"
          ? "Admin"
          : member?.role === "Manager"
            ? "Manager"
            : "Member",
      skills: member?.skills || [],
    },
    values: member
      ? {
          name: member.name,
          email: member.email,
          role:
            member.role === "Admin"
              ? "Admin"
              : member.role === "Manager"
                ? "Manager"
                : "Member",
          skills: member.skills || [],
        }
      : undefined,
  });

  const { control } = methods;

  const handleSubmit = async (data: MemberEditFormValues) => {
    const promise = updateUser({
      id: memberId,
      body: {
        name: data.name.trim(),
        email: data.email.trim(),
        role: data.role
          ? (data.role.toLowerCase() as "admin" | "manager" | "member")
          : "member",
        skills: data.skills,
      },
    }).unwrap();

    toast.promise(promise, {
      loading: "Saving changes...",
      success: () => {
        router.push(`/team/${memberId}`);
        return "Team member updated successfully!";
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: (err: any) =>
        err?.data?.message || "Failed to update team member.",
    });
  };

  if (isLoading) {
    return (
      <div className="animate-in fade-in mx-auto w-full max-w-3xl space-y-4 pb-8 duration-200">
        <div className="text-muted-foreground text-xs">
          Team / Member / Edit
        </div>
        <section className="bg-card space-y-6 rounded-lg border p-6 shadow-sm">
          <div className="space-y-2">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (isError || !member) {
    return (
      <div className="animate-in fade-in mx-auto w-full max-w-3xl pb-8 duration-200">
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
    <div className="animate-in fade-in mx-auto w-full max-w-3xl space-y-4 pb-8 duration-200">
      <div className="text-muted-foreground text-xs">Team / Member / Edit</div>
      <section className="bg-card rounded-lg border p-6 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">
          Edit Team Member
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Update profile and access settings.
        </p>

        <div className="mt-6">
          <MpmsForm<MemberEditFormValues>
            methods={methods}
            onSubmit={handleSubmit}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <MpmsInput name="name" label="Full Name" required />
              <MpmsInput
                name="email"
                label="Work Email"
                type="email"
                required
              />
              <MpmsSelect
                name="role"
                label="Role"
                required
                className="w-full"
                options={[
                  { value: "Admin", label: "Admin" },
                  { value: "Manager", label: "Manager" },
                  { value: "Member", label: "Member" },
                ]}
              />

              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label>Skills (Press Enter to add)</Label>
                    <div className="bg-background border-input flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border px-2 py-1.5 shadow-sm">
                      {field.value.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-normal"
                        >
                          {skill}
                          <button
                            type="button"
                            className="text-muted-foreground hover:text-foreground hover:bg-muted ml-0.5 rounded-full p-0.5 transition-colors outline-none"
                            onClick={() => {
                              const newSkills = [...field.value];
                              newSkills.splice(index, 1);
                              field.onChange(newSkills);
                            }}
                          >
                            <X className="size-3" />
                          </button>
                        </Badge>
                      ))}
                      <Input
                        type="text"
                        placeholder={
                          field.value.length === 0 ? "React, Golang..." : ""
                        }
                        className="h-7 min-w-30 flex-1 border-0 px-1 py-0 text-sm shadow-none focus-visible:ring-0"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === ",") {
                            e.preventDefault();
                            const val = skillInput.trim();
                            if (val && !field.value.includes(val)) {
                              field.onChange([...field.value, val]);
                            }
                            setSkillInput("");
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              />
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t pt-4">
              <Button
                variant="outline"
                asChild
                type="button"
                disabled={isUpdating}
              >
                <Link href={`/team/${memberId}`}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={isUpdating} className="gap-1.5">
                {isUpdating && <Loader2 className="size-3.5 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </MpmsForm>
        </div>
      </section>
    </div>
  );
}
