import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to the {BRAND_NAME} demo dashboard.",
};

export default function LoginPage() {
  // LoginForm reads ?next= from the URL, which needs a Suspense boundary
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
