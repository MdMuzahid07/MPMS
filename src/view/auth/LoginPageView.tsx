"use client";

import MpmsCheckbox from "@/components/features/form/MpmsCheckbox";
import MpmsForm from "@/components/features/form/MpmsForm";
import MpmsInput from "@/components/features/form/MpmsInput";
import { useLoginMutation } from "@/redux/feature/auth/authApi";
import { setCredentials } from "@/redux/feature/auth/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, KeyRound, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import OnyxLogo from "../../components/shared/OnyxLogo";
import { LoginFormValues, loginSchema } from "./auth.schema";
import AuthHero from "./AuthHero";

const DEMO_ACCOUNTS = [
  {
    label: "Admin Workspace",
    email: "mpms.admin@gmail.com",
    password: "MPMS@Admin12345",
    badge: "Admin",
  },
  {
    label: "Project Manager",
    email: "mdmuzahid.dev@gmail.com",
    password: "Manager@123",
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
        const role = response.data.user.role;
        if (role === "admin") {
          router.push("/");
        } else if (role === "manager") {
          router.push("/projects");
        } else if (role === "member") {
          router.push("/my-projects");
        } else {
          router.push("/");
        }
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
            className="group text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
          >
            <span className="inline-block transition-transform group-hover:-translate-x-1">
              ←
            </span>{" "}
            Back to Home
          </Link>
        </nav>

        <div className="mx-auto my-auto w-full max-w-md space-y-7 py-6">
          {/* Logo — visible only on mobile (AuthHero carries it on desktop) */}
          <div className="mb-6 flex justify-center lg:hidden">
            <OnyxLogo />
          </div>

          <header className="space-y-2 text-left">
            <h1 className="text-foreground text-3xl font-extrabold tracking-tight">
              Sign In
            </h1>
            <p className="text-muted-foreground text-sm font-light">
              Enter your credentials to access your workspace.
            </p>
          </header>

          <MpmsForm onSubmit={onSubmit} methods={methods}>
            <fieldset className="space-y-4.5" disabled={busy}>
              <legend className="sr-only">Account credentials</legend>

              <MpmsInput
                label="Email Address"
                type="email"
                placeholder="name@company.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                labelIcon={
                  <Mail
                    className="text-muted-foreground mr-1.5 inline h-3.5 w-3.5"
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
                      className="text-muted-foreground mr-1.5 inline h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                  }
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-muted-foreground hover:text-primary absolute top-9 right-3.5 cursor-pointer transition-colors"
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
                  className="text-muted-foreground hover:text-primary text-xs font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={busy}
                className="group bg-primary text-primary-foreground shadow-primary/20 hover:shadow-primary/30 relative mt-4 flex h-11 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl text-sm font-semibold shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={busy ? "Signing in…" : "Sign in"}
              >
                {busy ? (
                  <span
                    className="border-primary-foreground h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"
                    aria-hidden="true"
                  />
                ) : (
                  <>
                    <span>Sign In to Workspace</span>
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </>
                )}
              </button>
            </fieldset>
          </MpmsForm>

          <section
            aria-label="Demo accounts"
            className="bg-muted/15 border-border/40 space-y-3.5 rounded-2xl border p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                Quick Test Accounts
              </p>
              <span className="text-primary/70 animate-pulse text-[10px] font-semibold">
                Click to Autofill
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {DEMO_ACCOUNTS.map(({ label, email, password, badge }) => (
                <button
                  key={email}
                  type="button"
                  onClick={() => handleQuickSelect(email, password)}
                  className="border-border/50 bg-card hover:bg-primary/2 hover:border-primary/45 group flex cursor-pointer flex-col justify-between rounded-xl border p-3 text-left shadow-xs transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                  aria-label={`Load demo credentials for ${label}`}
                >
                  <div className="w-full">
                    <span className="text-foreground block w-full truncate text-xs font-bold">
                      {badge}
                    </span>
                    <span className="text-muted-foreground mt-0.5 block w-full truncate text-[10px]">
                      {email.split("@")[0]}
                    </span>
                  </div>
                  <span className="text-primary/95 bg-primary/5 group-hover:bg-primary group-hover:text-primary-foreground border-primary/10 mt-3.5 rounded-md border px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase transition-colors duration-200">
                    Autofill
                  </span>
                </button>
              ))}
            </div>
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
