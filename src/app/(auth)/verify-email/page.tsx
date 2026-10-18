import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyEmailForm } from "@/components/auth/VerifyEmailForm";

export const metadata: Metadata = {
  title: "Confirm your email",
  description: "Enter the code we emailed you to finish creating your LONAR ECO. account.",
};

export default function VerifyEmailPage() {
  // useRedirectWhenAuthed reads ?next= from the URL, which needs a Suspense boundary
  return (
    <Suspense>
      <VerifyEmailForm />
    </Suspense>
  );
}
