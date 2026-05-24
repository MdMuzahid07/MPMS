import MpmsForm from "@/components/features/form/MpmsForm";
import MpmsInput from "@/components/features/form/MpmsInput";
import MpmsSelect from "@/components/features/form/MpmsSelect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateUserMutation } from "@/redux/feature/users/usersApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Users, X } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const addMemberSchema = z.object({
  name: z.string().min(1, "Full Name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["Member", "Manager", "Admin"]),
  skills: z.array(z.string()),
});

type AddMemberFormValues = z.infer<typeof addMemberSchema>;

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddMemberDialog = ({
  open,
  onOpenChange,
}: AddMemberDialogProps) => {
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [skillInput, setSkillInput] = useState("");

  const methods = useForm<AddMemberFormValues>({
    resolver: zodResolver(addMemberSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "Member",
      skills: [],
    },
  });

  const { setError, reset, control } = methods;

  const handleClose = () => {
    reset();
    setSkillInput("");
    onOpenChange(false);
  };

  const onSubmit = async (data: AddMemberFormValues) => {
    const serverBody = {
      name: data.name.trim(),
      email: data.email.trim(),
      password: data.password.trim(),
      role: data.role.toLowerCase() as "admin" | "manager" | "member",
      skills: data.skills,
    };

    try {
      await createUser(serverBody).unwrap();
      toast.success("Team member added successfully!");
      handleClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const apiError = err as {
        data?: { message?: string; field?: string };
        status?: number;
      };

      if (
        apiError?.status === 409 ||
        apiError?.data?.message?.toLowerCase().includes("email")
      ) {
        setError("email", {
          type: "server",
          message: "An account with this email already exists.",
        });
      } else {
        toast.error(
          apiError?.data?.message ??
            "Failed to create team member. Please try again.",
        );
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-popover rounded-xl border p-6 shadow-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold">
            <Users className="text-primary size-4.5" />
            Add Member to Directory
          </DialogTitle>
          <DialogDescription className="text-xs">
            Create a new user profile with specific authorization roles and
            system skills.
          </DialogDescription>
        </DialogHeader>

        <MpmsForm<AddMemberFormValues> onSubmit={onSubmit} methods={methods}>
          <div className="space-y-4 py-2">
            <MpmsInput
              required
              name="name"
              label="Full Name"
              placeholder="Alex Rivera"
              size="md"
            />

            <MpmsInput
              required
              type="email"
              name="email"
              label="Email Address"
              placeholder="alex.rivera@mpms.tech"
              size="md"
            />

            <MpmsInput
              required
              type="password"
              name="password"
              label="Default Password"
              placeholder="••••••"
              size="md"
            />

            <MpmsSelect
              required
              className="w-full"
              name="role"
              label="Clearance Role"
              size="md"
              options={[
                { value: "Member", label: "Member" },
                { value: "Manager", label: "Manager" },
                { value: "Admin", label: "Admin" },
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
                        field.value.length === 0
                          ? "React, Golang, Kubernetes"
                          : ""
                      }
                      className="h-7 min-w-[120px] flex-1 border-0 px-1 py-0 text-sm shadow-none focus-visible:ring-0"
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

            <div className="mt-6 flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="h-9.5 rounded-lg text-xs"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating}
                className="flex h-9.5 items-center gap-1.5 rounded-lg text-xs"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus className="size-3.5" />
                    <span>Create Profile</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </MpmsForm>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
