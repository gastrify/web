"use client";

import "@/shared/lib/i18n/i18n";
import Link from "next/link";
import { LoaderIcon, MailIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { TypographyH1, TypographyP } from "@/shared/components/ui/typography";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/utils/cn";

import { useForgotPasswordForm } from "@/features/auth/hooks/use-forgot-password-form";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { form, onSubmit, isPending } = useForgotPasswordForm();
  const { t } = useTranslation("auth");

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-background border-none shadow-none">
        <CardHeader className="text-center">
          <CardTitle>
            <TypographyH1>{t("forgotPassword.title")}</TypographyH1>
          </CardTitle>

          <CardDescription>
            <TypographyP className="leading-normal">
              {t("forgotPassword.description")}
            </TypographyP>
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>{t("forgotPassword.emailLabel")}</FormLabel>

                    <div className="relative">
                      <FormControl>
                        <Input
                          className="peer aria-invalid:text-destructive-foreground ps-9 shadow-none not-aria-invalid:border-none"
                          type="email"
                          disabled={isPending}
                          placeholder={
                            fieldState.invalid
                              ? undefined
                              : "david@aragundy.com"
                          }
                          {...field}
                        />
                      </FormControl>

                      <div
                        className={cn(
                          "text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50",
                          fieldState.invalid && "text-destructive-foreground",
                          fieldState.isDirty &&
                            !fieldState.invalid &&
                            "text-foreground",
                        )}
                      >
                        <MailIcon size={16} aria-hidden="true" />
                      </div>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={isPending} type="submit" className="w-full">
                {isPending && <LoaderIcon className="animate-spin" />}
                {t("forgotPassword.sendButton")}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm">
            {t("resetPassword.doYouRemember")}{" "}
            <Link
              href="/sign-in"
              className="font-bold hover:underline hover:underline-offset-4"
            >
              {t("resetPassword.signIn")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
