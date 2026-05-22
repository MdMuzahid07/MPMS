"use client";

import MpmsCheckbox from "@/components/form/MpmsCheckbox";
import MpmsForm from "@/components/form/MpmsForm";
import MpmsInput from "@/components/form/MpmsInput";
import { useLoginMutation } from "@/redux/feature/auth/authApi";
import { setCredentials } from "@/redux/feature/auth/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, KeyRound, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { z } from "zod";
import AuthHero from "./AuthHero";

//Validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const DEMO_ACCOUNTS = [
  {
    label: "Admin Workspace",
    email: "mpms.admin@gmail.com",
    password: "MPMS@Admin12345",
    badge: "Admin",
  },
  {
    label: "Project Manager",
    email: "manager@mpms.com",
    password: "Manager123!",
    badge: "Manager",
  },
  {
    label: "Team Member",
    email: "member@mpms.com",
    password: "Member123!",
    badge: "Member",
  },
] as const;

const LoginPageView = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const {
    register,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  const handleQuickSelect = (email: string, password: string) => {
    setValue("email", email, { shouldValidate: true });
    setValue("password", password, { shouldValidate: true });
    toast.info(`Demo account loaded`, { duration: 1500 });
    document.getElementById("email")?.focus();
  };

  const onSubmit = async (data: LoginFormValues) => {
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
        router.push("/");
      }
    } catch (err: unknown) {
      const apiError = err as { data?: { message?: string }; status?: number };

      // Surface field-level errors when the API returns them
      if (apiError?.status === 401) {
        setError("password", {
          type: "server",
          message: "Incorrect email or password.",
        });
      } else {
        toast.error(
          apiError?.data?.message ?? "Sign in failed. Please try again.",
          { id: "login-error" },
        );
      }
    }
  };

  const busy = isLoading || isSubmitting;

  return (
    <div className="bg-background text-foreground flex min-h-screen w-full font-sans">
      <AuthHero />

      <main
        className="bg-card text-card-foreground border-border flex w-full flex-col justify-between border-l p-8 transition-colors duration-200 md:p-12 lg:w-1/2"
        aria-label="Sign in"
      >
        {/* Top nav */}
        <nav aria-label="Page navigation">
          <Link
            href="/"
            className="text-muted-foreground hover:text-primary text-xs font-medium tracking-wide transition-colors"
          >
            ← Back to Home
          </Link>
        </nav>

        <div className="mx-auto my-auto w-full max-w-104 space-y-6 py-6">
          {/* Logo — visible only on mobile (AuthHero carries it on desktop) */}
          <div className="mb-6 flex justify-center lg:hidden">
            <Image
              src="/images/mpms-logo.png"
              alt="MPMS"
              width={150}
              height={40}
              priority
              className="h-10 w-auto object-contain"
            />
          </div>

          <header className="space-y-1.5 text-center">
            <h1 className="text-foreground text-3xl font-bold tracking-tight">
              Sign In
            </h1>
            <p className="text-muted-foreground text-sm font-light">
              Enter your credentials to access your workspace.
            </p>
          </header>

          <MpmsForm onSubmit={onSubmit} methods={methods}>
            <fieldset className="space-y-4" disabled={busy}>
              <legend className="sr-only">Account credentials</legend>

              <MpmsInput
                label="Email Address"
                type="email"
                placeholder="name@company.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                labelIcon={
                  <Mail
                    className="text-muted-foreground mr-1 inline h-3.5 w-3.5"
                    aria-hidden="true"
                  />
                }
                {...register("email")}
              />

              {/* Password with show/hide toggle */}
              <div className="relative">
                <MpmsInput
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  labelIcon={
                    <KeyRound
                      className="text-muted-foreground mr-1 inline h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                  }
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-muted-foreground hover:text-primary absolute top-8.5 right-3 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>

              {/* Remember me + forgot password row */}
              <div className="flex items-center justify-between pt-1">
                <MpmsCheckbox name="rememberMe" label="Keep me signed in" />
                <Link
                  href="/forgot-password"
                  className="text-muted-foreground hover:text-primary text-xs transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={busy}
                className="bg-primary text-primary-foreground mt-2 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium shadow-sm transition-all duration-200 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={busy ? "Signing in…" : "Sign in"}
              >
                {busy ? (
                  <span
                    className="border-primary-foreground h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"
                    aria-hidden="true"
                  />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </fieldset>
          </MpmsForm>

          <section
            aria-label="Demo accounts"
            className="border-border bg-muted/30 space-y-3 rounded-lg border border-dashed p-4"
          >
            <p className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
              Demo accounts for testing
            </p>
            <ul className="grid grid-cols-1 gap-2" role="list">
              {DEMO_ACCOUNTS.map(({ label, email, password, badge }) => (
                <li key={email}>
                  <button
                    type="button"
                    onClick={() => handleQuickSelect(email, password)}
                    className="border-border bg-card hover:bg-muted/50 hover:border-primary group flex w-full items-center justify-between rounded border px-3 py-2 text-left text-xs transition-colors"
                    aria-label={`Load demo credentials for ${label}`}
                  >
                    <div>
                      <span className="text-foreground block font-semibold">
                        {label}
                      </span>
                      <span className="text-muted-foreground text-[10px]">
                        {email}
                      </span>
                    </div>
                    <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[9px] font-semibold tracking-wide uppercase">
                      {badge}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <p className="text-muted-foreground text-center text-xs">
            {`Don't`} have an account?{" "}
            <Link
              href="/register"
              className="text-primary font-semibold transition-colors hover:underline"
            >
              Create one now
            </Link>
          </p>
        </div>

        <div aria-hidden="true" />
      </main>
    </div>
  );
};

export default LoginPageView;
