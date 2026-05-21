import RegisterPageView from "@/view/auth/RegisterPageView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Enroll a new secure credential node in MPMS.",
};

export default function RegisterPage() {
  return <RegisterPageView />;
}
