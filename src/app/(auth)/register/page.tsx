import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create a {BRAND_NAME} demo account.",
};

export default function RegisterPage() {
  // RegisterForm reads ?next= from the URL, which needs a Suspense boundary
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
