"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Suspense, use } from "react";
import { useTranslation } from "react-i18next";
import { GalleryVerticalEnd } from "lucide-react";

import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export default function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { t } = useTranslation("auth");
  const { token } = use(searchParams);

  useEffect(() => {
    document.title = `Gastrify | ${t("resetPassword.title")}`;
  }, [t]);

  if (!token) return redirect("/forgot-password");

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Link
        href="/"
        className="flex items-center gap-2 self-center font-medium"
      >
        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
          <GalleryVerticalEnd className="size-4" />
        </div>
        Gastrify
      </Link>
      <Suspense fallback={<ResetPasswordFormFallback />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}

//TODO: Implement ResetPasswordFormFallback, this shi is for search params
function ResetPasswordFormFallback() {
  return <></>;
}
