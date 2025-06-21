"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { GalleryVerticalEnd } from "lucide-react";

import { SignUpForm } from "@/features/auth/components/sign-up-form";

export default function SignUpPage() {
  const { t } = useTranslation("auth");

  useEffect(() => {
    document.title = `Gastrify | ${t("signUp.title")}`;
  }, [t]);

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
      <SignUpForm />
    </div>
  );
}
