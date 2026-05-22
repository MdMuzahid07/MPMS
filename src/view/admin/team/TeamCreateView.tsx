"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Upload, UserPlus, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";

type RoleOption = "Admin" | "Manager" | "Member";

export default function TeamCreateView() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [fullName, setFullName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [role, setRole] = useState<RoleOption>("Member");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("9f3!k2a#l8mQ");
  const [showPassword, setShowPassword] = useState(false);
  const [sendInviteEmail, setSendInviteEmail] = useState(true);

  const [skills, setSkills] = useState<string[]>(["TypeScript", "React"]);
  const [skillInput, setSkillInput] = useState("");

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileFileName, setProfileFileName] = useState<string>("");

  const isFormValid = useMemo(() => {
    return (
      fullName.trim().length > 1 &&
      workEmail.trim().length > 3 &&
      department.trim().length > 1 &&
      password.trim().length >= 8
    );
  }, [department, fullName, password, workEmail]);

  const addSkill = (value: string) => {
    const clean = value.trim();
    if (!clean) return;
    if (skills.some((item) => item.toLowerCase() === clean.toLowerCase())) {
      setSkillInput("");
      return;
    }
    setSkills((prev) => [...prev, clean]);
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((item) => item !== skill));
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const onFileSelected = (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    if (profileImage) {
      URL.revokeObjectURL(profileImage);
    }

    const previewUrl = URL.createObjectURL(file);
    setProfileImage(previewUrl);
    setProfileFileName(file.name);
  };

  useEffect(() => {
    return () => {
      if (profileImage) {
        URL.revokeObjectURL(profileImage);
      }
    };
  }, [profileImage]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid) {
      toast.error("Please complete all required fields.");
      return;
    }

    toast.success("Team member created successfully.");
  };

  return (
    <div className="container mx-auto w-full pb-8">
      <section className="bg-card/70 rounded-xl border p-5 shadow-sm backdrop-blur md:p-7">
        <header className="mb-6">
          <h1 className="text-foreground text-2xl font-semibold tracking-tight">
            Add New Team Member
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Configure profile and access permissions for your new colleague.
          </p>
        </header>

        <form className="space-y-7" onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-muted-foreground text-[11px] font-semibold tracking-[0.12em] uppercase">
                  Full Name
                </label>
                <Input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="h-10 rounded-md text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-muted-foreground text-[11px] font-semibold tracking-[0.12em] uppercase">
                  Work Email
                </label>
                <Input
                  type="email"
                  value={workEmail}
                  onChange={(event) => setWorkEmail(event.target.value)}
                  placeholder="alex@company.com"
                  className="h-10 rounded-md text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-muted-foreground text-[11px] font-semibold tracking-[0.12em] uppercase">
                  Role
                </label>
                <Select
                  value={role}
                  onValueChange={(value) => setRole(value as RoleOption)}
                >
                  <SelectTrigger className="h-10 w-full rounded-md text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="start">
                    <SelectItem value="Member">Member</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-muted-foreground text-[11px] font-semibold tracking-[0.12em] uppercase">
                  Department
                </label>
                <Input
                  value={department}
                  onChange={(event) => setDepartment(event.target.value)}
                  placeholder="Engineering, Design, Marketing..."
                  className="h-10 rounded-md text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-muted-foreground text-[11px] font-semibold tracking-[0.12em] uppercase">
                  Skills
                </label>
                <div className="border-input focus-within:border-ring focus-within:ring-ring/50 min-h-24 rounded-md border p-2.5 focus-within:ring-3">
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="h-6 rounded-sm px-2 text-[10px]"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="text-muted-foreground hover:text-foreground ml-1"
                          aria-label={`Remove ${skill}`}
                        >
                          <X className="size-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <Input
                    value={skillInput}
                    onChange={(event) => setSkillInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === ",") {
                        event.preventDefault();
                        addSkill(skillInput);
                      }
                    }}
                    onBlur={() => addSkill(skillInput)}
                    placeholder="Add skill..."
                    className="h-7 rounded-sm border-0 px-0 text-xs shadow-none focus-visible:ring-0"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-muted-foreground text-[11px] font-semibold tracking-[0.12em] uppercase">
                  Profile Picture
                </label>
                <button
                  type="button"
                  onClick={openFilePicker}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    const dropped = event.dataTransfer.files?.[0] ?? null;
                    onFileSelected(dropped);
                  }}
                  className="border-input hover:border-primary/50 hover:bg-muted/35 flex h-40 w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed text-center transition-colors"
                >
                  {profileImage ? (
                    <>
                      <Avatar size="lg" className="size-16 border">
                        <AvatarImage src={profileImage} alt="Profile preview" />
                        <AvatarFallback>TM</AvatarFallback>
                      </Avatar>
                      <span className="text-foreground text-xs font-medium">
                        {profileFileName}
                      </span>
                      <span className="text-muted-foreground text-[11px]">
                        Click to replace image
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="bg-primary/15 text-primary inline-flex size-10 items-center justify-center rounded-md">
                        <Upload className="size-4.5" />
                      </span>
                      <p className="text-sm font-medium">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-muted-foreground text-[11px]">
                        SVG, PNG, JPG or GIF (max. 800x400px)
                      </p>
                    </>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) =>
                    onFileSelected(event.target.files?.[0] ?? null)
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-muted-foreground text-[11px] font-semibold tracking-[0.12em] uppercase">
                  Initial Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-10 rounded-md pr-10 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                <p className="text-muted-foreground text-[11px]">
                  Recommended: 12+ characters with symbols.
                </p>
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2.5">
                  <Checkbox
                    checked={sendInviteEmail}
                    onCheckedChange={(checked) =>
                      setSendInviteEmail(Boolean(checked))
                    }
                    className="mt-0.5"
                  />
                  <span>
                    <span className="text-sm font-medium">
                      Send Invitation Email
                    </span>
                    <span className="text-muted-foreground mt-0.5 block text-[11px] leading-relaxed">
                      Notify the member immediately with their credentials and
                      login link.
                    </span>
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="border-border flex items-center justify-end gap-3 border-t pt-5">
            <Button asChild type="button" variant="outline" className="px-4">
              <Link href="/team">Cancel</Link>
            </Button>
            <Button type="submit" className="px-5" disabled={!isFormValid}>
              <UserPlus className="mr-1.5 size-3.5" />
              Add Member
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
