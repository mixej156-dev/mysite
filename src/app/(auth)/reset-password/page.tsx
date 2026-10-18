import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Set a new password",
  description: "Enter the code from your reset email and choose a new password for your LONAR ECO. account.",
};

export default function ResetPasswordPage() {
  // ResetPasswordForm reads ?email= from the reset link, which needs a Suspense boundary
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
