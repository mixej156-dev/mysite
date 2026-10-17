import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Request a password reset link for your LONAR ECO. demo account.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
