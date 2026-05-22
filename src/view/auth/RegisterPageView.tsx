"use client";

import MpmsForm from "@/components/form/MpmsForm";
import MpmsInput from "@/components/form/MpmsInput";
import { useRegisterMutation } from "@/redux/feature/auth/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import AuthHero from "./AuthHero";

// Password strength helpers
const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "Uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "Number", test: (p: string) => /\d/.test(p) },
  {
    label: "Special character",
    test: (p: string) => /[^A-Za-z0-9]/.test(p),
  },
] as const;

type StrengthLevel = "empty" | "weak" | "fair" | "good" | "strong";

function getStrength(password: string): {
  level: StrengthLevel;
  score: number;
} {
  if (!password) return { level: "empty", score: 0 };
  const score = PASSWORD_RULES.filter((r) => r.test(password)).length;
  const level: StrengthLevel =
    score <= 1
      ? "weak"
      : score === 2
        ? "fair"
        : score === 3
          ? "good"
          : "strong";
  return { level, score };
}

const STRENGTH_CONFIG: Record<
  StrengthLevel,
  { label: string; color: string; bars: number }
> = {
  empty: { label: "", color: "bg-muted", bars: 0 },
  weak: { label: "Weak", color: "bg-destructive", bars: 1 },
  fair: { label: "Fair", color: "bg-yellow-500", bars: 2 },
  good: { label: "Good", color: "bg-blue-500", bars: 3 },
  strong: { label: "Strong", color: "bg-green-500", bars: 4 },
};

// Validation schema
const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Name must be at least 2 characters")
      .max(80, "Name must be under 80 characters")
      .regex(
        /^[a-zA-Z\s'-]+$/,
        "Name can only contain letters, spaces, hyphens, and apostrophes",
      ),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address")
      .max(254, "Email address is too long"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must include an uppercase letter")
      .regex(/[a-z]/, "Password must include a lowercase letter")
      .regex(/\d/, "Password must include a number")
      .regex(/[^A-Za-z0-9]/, "Password must include a special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPageView = () => {
  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");

  const {
    register: formRegister,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const strength = useMemo(() => getStrength(passwordValue), [passwordValue]);
  const strengthCfg = STRENGTH_CONFIG[strength.level];

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const response = await register({
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        password: data.password,
        role: "member", // workspace enrollment always defaults to "member"
      }).unwrap();

      if (response.success) {
        toast.success("Account created! Please sign in.", {
          description: `Welcome to MPMS, ${data.name.split(" ")[0]}!`,
        });
        router.push("/login");
      }
    } catch (err: unknown) {
      const apiError = err as {
        data?: { message?: string; field?: string };
        status?: number;
      };

      // Surface field-specific server errors
      if (apiError?.status === 409 || apiError?.data?.field === "email") {
        setError("email", {
          type: "server",
          message: "An account with this email already exists.",
        });
      } else {
        toast.error(
          apiError?.data?.message ?? "Registration failed. Please try again.",
          { id: "register-error" },
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
        aria-label="Create account"
      >
        {/* Top nav */}
        <nav aria-label="Page navigation">
          <Link
            href="/login"
            className="text-muted-foreground hover:text-primary text-xs font-medium tracking-wide transition-colors"
          >
            <ArrowLeft /> Sign In
          </Link>
        </nav>

        <div className="mx-auto my-auto w-full max-w-104 space-y-6 py-6">
          <header className="space-y-1.5 text-center">
            <h1 className="text-foreground text-3xl font-bold tracking-tight">
              Create Account
            </h1>
            <p className="text-muted-foreground text-sm font-light">
              Get started with MPMS and organise your team&apos;s workflow.
            </p>
          </header>

          <MpmsForm onSubmit={onSubmit}>
            <fieldset className="space-y-4" disabled={busy}>
              <legend className="sr-only">Account details</legend>

              {/* Full name */}
              <MpmsInput
                label="Full Name"
                type="text"
                placeholder="Jane Doe"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                labelIcon={
                  <User
                    className="text-muted-foreground mr-1 inline h-3.5 w-3.5"
                    aria-hidden="true"
                  />
                }
                {...formRegister("name")}
              />

              {/* Email */}
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
                {...formRegister("email")}
              />

              {/* Password with strength meter */}
              <div>
                <div className="relative">
                  <MpmsInput
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    aria-invalid={!!errors.password}
                    aria-describedby="password-strength"
                    labelIcon={
                      <KeyRound
                        className="text-muted-foreground mr-1 inline h-3.5 w-3.5"
                        aria-hidden="true"
                      />
                    }
                    {...formRegister("password", {
                      onChange: (e) => setPasswordValue(e.target.value),
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="text-muted-foreground hover:text-primary absolute top-8.5 right-3 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>

                {/* Strength meter - only visible when password has content */}
                {passwordValue && (
                  <div
                    id="password-strength"
                    className="mt-2 space-y-1.5"
                    aria-live="polite"
                    aria-label={`Password strength: ${strengthCfg.label}`}
                  >
                    {/* Bar track */}
                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                            i < strengthCfg.bars
                              ? strengthCfg.color
                              : "bg-muted"
                          }`}
                        />
                      ))}
                      {strengthCfg.label && (
                        <span className="text-muted-foreground ml-1 text-[10px] font-medium">
                          {strengthCfg.label}
                        </span>
                      )}
                    </div>

                    {/* Rule checklist */}
                    <ul
                      className="grid grid-cols-2 gap-x-3 gap-y-0.5"
                      role="list"
                      aria-label="Password requirements"
                    >
                      {PASSWORD_RULES.map((rule) => {
                        const passed = rule.test(passwordValue);
                        return (
                          <li
                            key={rule.label}
                            className={`flex items-center gap-1 text-[10px] transition-colors ${
                              passed
                                ? "text-green-600 dark:text-green-400"
                                : "text-muted-foreground"
                            }`}
                          >
                            <Check
                              className={`h-2.5 w-2.5 shrink-0 transition-opacity ${
                                passed ? "opacity-100" : "opacity-30"
                              }`}
                              aria-hidden="true"
                            />
                            {rule.label}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div className="relative">
                <MpmsInput
                  label="Confirm Password"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={
                    errors.confirmPassword
                      ? "confirm-password-error"
                      : undefined
                  }
                  labelIcon={
                    <KeyRound
                      className="text-muted-foreground mr-1 inline h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                  }
                  {...formRegister("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={
                    showConfirm
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  className="text-muted-foreground hover:text-primary absolute top-8.5 right-3 transition-colors"
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={busy}
                className="bg-primary text-primary-foreground mt-2 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium shadow-sm transition-all duration-200 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={busy ? "Creating account…" : "Create account"}
              >
                {busy ? (
                  <span
                    className="border-primary-foreground h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"
                    aria-hidden="true"
                  />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </fieldset>
          </MpmsForm>

          <p className="text-muted-foreground text-center text-xs">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-semibold transition-colors hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>

        <div aria-hidden="true" />
      </main>
    </div>
  );
};

export default RegisterPageView;
