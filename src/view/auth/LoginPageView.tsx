"use client";

import MpmsCheckbox from "@/components/form/MpmsCheckbox";
import MpmsForm from "@/components/form/MpmsForm";
import MpmsInput from "@/components/form/MpmsInput";
import { useLoginMutation } from "@/redux/feature/auth/authApi";
import { setCredentials } from "@/redux/feature/auth/authSlice";
import { ArrowRight, Eye, EyeOff, KeyRound, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import AuthHero from "./AuthHero";

const LoginPageView = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  // Quick select credentials for easy testing
  const handleQuickSelect = (email: string, pass: string) => {
    toast.info(`Demo account loaded: ${email}`, { duration: 1500 });
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const passInput = document.getElementById("password") as HTMLInputElement;
    if (emailInput && passInput) {
      emailInput.value = email;
      passInput.value = pass;
      emailInput.dispatchEvent(new Event("input", { bubbles: true }));
      passInput.dispatchEvent(new Event("input", { bubbles: true }));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    try {
      const response = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      if (response.success && response.data) {
        dispatch(
          setCredentials({
            user: response.data.user,
            accessToken: response.data.accessToken,
          }),
        );
        toast.success(`Welcome back, ${response.data.user.name}!`);
        router.push("/dashboard");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errMsg =
        err?.data?.message || "Invalid email or password. Please try again.";
      toast.error(errMsg);
    }
  };

  return (
    <div className="bg-background text-foreground flex min-h-screen w-full font-sans">
      <AuthHero />

      <div className="bg-card text-card-foreground border-border flex w-full flex-col justify-between border-l p-8 transition-colors duration-250 md:p-12 lg:w-1/2">
        {/* Top Header info (Minimal back button, no right text) */}
        <div className="text-muted-foreground flex items-center text-xs font-medium tracking-wide">
          <Link href="/" className="hover:text-primary transition-colors">
            ← Back to Home
          </Link>
        </div>

        {/* Centered Form Area */}
        <div className="mx-auto my-auto w-full max-w-100 space-y-6 py-6">
          {/* Brand Logo inside card container (hidden on desktop since it is in AuthHero) */}
          <div className="mb-6 flex justify-center lg:hidden">
            <Image
              src="/images/mpms-logo.png"
              alt="MPMS Logo"
              width={150}
              height={40}
              priority
              className="h-10 w-auto object-contain dark:invert-0"
            />
          </div>

          <div className="space-y-2 text-center">
            <h3 className="text-foreground text-3xl font-bold tracking-tight">
              Sign In
            </h3>
            <p className="text-muted-foreground text-sm font-light">
              Enter your credentials to access your workspace.
            </p>
          </div>

          <MpmsForm onSubmit={onSubmit}>
            <div className="space-y-4">
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

              <div className="flex items-center justify-between pt-1">
                <MpmsCheckbox name="rememberMe" label="Keep me signed in" />
                <Link
                  href="/forgot-password"
                  className="text-muted-foreground hover:text-primary text-xs transition-colors"
                >
                  Forgot Password?
                </Link>
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
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </MpmsForm>

          {/* Role selection hints as demo credentials */}
          <div className="border-border bg-muted/30 space-y-3 rounded-lg border border-dashed p-4">
            <div className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase">
              <span>Demo Accounts for Testing</span>
            </div>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <button
                onClick={() =>
                  handleQuickSelect("mpms.admin@gmail.com", "MPMS@Admin12345")
                }
                className="border-border bg-card hover:bg-muted/50 hover:border-primary flex items-center justify-between rounded border px-3 py-2 text-left transition-colors"
              >
                <div>
                  <span className="text-foreground font-semibold">
                    Admin Workspace
                  </span>
                  <span className="text-muted-foreground block text-[10px]">
                    mpms.admin@gmail.com
                  </span>
                </div>
                <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[9px] font-medium">
                  SELECT
                </span>
              </button>
              <button
                onClick={() =>
                  handleQuickSelect("manager@mpms.com", "Manager123!")
                }
                className="border-border bg-card hover:bg-muted/50 hover:border-primary flex items-center justify-between rounded border px-3 py-2 text-left transition-colors"
              >
                <div>
                  <span className="text-foreground font-semibold">
                    Project Manager
                  </span>
                  <span className="text-muted-foreground block text-[10px]">
                    manager@mpms.com
                  </span>
                </div>
                <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[9px] font-medium">
                  SELECT
                </span>
              </button>
              <button
                onClick={() =>
                  handleQuickSelect("member@mpms.com", "Member123!")
                }
                className="border-border bg-card hover:bg-muted/50 hover:border-primary flex items-center justify-between rounded border px-3 py-2 text-left transition-colors"
              >
                <div>
                  <span className="text-foreground font-semibold">
                    Team Member
                  </span>
                  <span className="text-muted-foreground block text-[10px]">
                    member@mpms.com
                  </span>
                </div>
                <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[9px] font-medium">
                  SELECT
                </span>
              </button>
            </div>
          </div>

          <div className="text-muted-foreground text-center text-xs">
            {`Don't`} have an account?{" "}
            <Link
              href="/register"
              className="text-primary font-semibold transition-colors hover:underline"
            >
              Create one now
            </Link>
          </div>
        </div>

        <div />
      </div>
    </div>
  );
};

export default LoginPageView;
