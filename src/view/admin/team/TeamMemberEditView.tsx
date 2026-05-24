"use client";

import MpmsForm from "@/components/features/form/MpmsForm";
import MpmsInput from "@/components/features/form/MpmsInput";
import MpmsSelect from "@/components/features/form/MpmsSelect";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

type MemberEditFormValues = {
  fullName: string;
  workEmail: string;
  role: string;
  department: string;
};

type TeamMemberEditPageProps = {
  params: {
    memberId: string;
  };
};

export default function TeamMemberEditView({
  params,
}: TeamMemberEditPageProps) {
  const handleSubmit = (data: MemberEditFormValues) => {
    console.log("Member update payload:", data);
    toast.success("Team member updated.");
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 pb-8">
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
            defaultValues={{
              fullName: "Alex Rivera",
              workEmail: "alex.rivera@mpms.tech",
              role: "Admin",
              department: "Core Infrastructure",
            }}
            onSubmit={handleSubmit}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <MpmsInput name="fullName" label="Full Name" required />
              <MpmsInput
                name="workEmail"
                label="Work Email"
                type="email"
                required
              />
              <MpmsSelect
                name="role"
                label="Role"
                required
                options={[
                  { value: "Admin", label: "Admin" },
                  { value: "Manager", label: "Manager" },
                  { value: "Member", label: "Member" },
                ]}
              />
              <MpmsInput name="department" label="Department" required />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" asChild type="button">
                <Link href={`/team/${params.memberId}`}>Cancel</Link>
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </MpmsForm>
        </div>
      </section>
    </div>
  );
}
