import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Request a password reset link for your {BRAND_NAME} demo account.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
