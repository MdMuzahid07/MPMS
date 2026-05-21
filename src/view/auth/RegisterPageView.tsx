/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import MpmsForm from "@/components/form/MpmsForm";
import MpmsInput from "@/components/form/MpmsInput";
import { useRegisterMutation } from "@/redux/feature/auth/authApi";
import { ArrowRight, Eye, EyeOff, KeyRound, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import AuthHero from "./AuthHero";

const RegisterPageView = () => {
  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      // Defaults workspace enrollment strictly to "member" as requested
      const response = await register({
        name: data.name,
        email: data.email,
        password: data.password,
        role: "member",
      }).unwrap();

      if (response.success) {
        toast.success("Account registered successfully! Please log in.");
        router.push("/login");
      }
    } catch (err: any) {
      const errMsg =
        err?.data?.message || "Registration failed. Please review fields.";
      toast.error(errMsg);
    }
  };

  return (
    <div className="bg-background text-foreground flex min-h-screen w-full font-sans">
      <AuthHero />

      <div className="bg-card text-card-foreground border-border flex w-full flex-col justify-between border-l p-8 transition-colors duration-250 md:p-12 lg:w-1/2">
        {/* Top Header info (Minimal back link, no right text) */}
        <div className="text-muted-foreground flex items-center text-xs font-medium tracking-wide">
          <Link href="/login" className="hover:text-primary transition-colors">
            ← Sign In
          </Link>
        </div>

        {/* Centered Form Area */}
        <div className="mx-auto my-auto w-full max-w-100 space-y-6 py-6">
          <div className="space-y-2 text-center">
            <h3 className="text-foreground text-3xl font-bold tracking-tight">
              Create Account
            </h3>
            <p className="text-muted-foreground text-sm font-light">
              Get started with MPMS and organize your {`team's`} workflow.
            </p>
          </div>

          <MpmsForm onSubmit={onSubmit}>
            <div className="space-y-4">
              <MpmsInput
                label="Full Name"
                name="name"
                type="text"
                required
                placeholder="Jane Doe"
                labelIcon={
                  <User className="text-muted-foreground mr-1 inline h-3.5 w-3.5" />
                }
              />

              <MpmsInput
                label="Email Address"
                name="email"
                type="email"
                required
                placeholder="name@company.com"
                labelIcon={
                  <Mail className="text-muted-foreground mr-1 inline h-3.5 w-3.5" />
                }
              />

              <div className="relative">
                <MpmsInput
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  labelIcon={
                    <KeyRound className="text-muted-foreground mr-1 inline h-3.5 w-3.5" />
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-primary absolute top-8.5 right-3 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary text-primary-foreground mt-2 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium shadow-md transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="border-primary-foreground h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </MpmsForm>

          <div className="text-muted-foreground text-center text-xs">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-semibold hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Empty placeholder at bottom to center the card vertically */}
        <div />
      </div>
    </div>
  );
};

export default RegisterPageView;
