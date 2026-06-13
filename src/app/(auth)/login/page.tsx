import LoginPageView from "@/view/auth/LoginPageView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Onyx account.",
};

export default function LoginPage() {
  return <LoginPageView />;
}
