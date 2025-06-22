"use client";

import Link from "next/link";
import { LoaderIcon, LockIcon } from "lucide-react";
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

import { useResetPasswordForm } from "@/features/auth/hooks/use-reset-password-form";
import { PasswordStrengthIndicator } from "@/shared/components/password-strength-indicator";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation("auth");
  const { form, onSubmit, isPending } = useResetPasswordForm();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-background border-none shadow-none">
        <CardHeader className="text-center">
          <CardTitle>
            <TypographyH1>{t("resetPassword.title")}</TypographyH1>
          </CardTitle>
          <CardDescription>
            <TypographyP className="leading-normal">
              {t("resetPassword.description")}
            </TypographyP>
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>{t("resetPassword.passwordLabel")}</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          className="peer aria-invalid:text-destructive-foreground ps-9 shadow-none not-aria-invalid:border-none"
                          disabled={isPending}
                          type="password"
                          placeholder={
                            fieldState.invalid ? undefined : "••••••••"
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
                        <LockIcon size={16} aria-hidden="true" />
                      </div>
                    </div>
                    <FormMessage />
                    {fieldState.isDirty && (
                      <PasswordStrengthIndicator password={field.value} />
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>
                      {t("resetPassword.confirmPasswordLabel")}
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          className="peer aria-invalid:text-destructive-foreground ps-9 shadow-none not-aria-invalid:border-none"
                          disabled={isPending}
                          type="password"
                          placeholder={
                            fieldState.invalid ? undefined : "••••••••"
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
                        <LockIcon size={16} aria-hidden="true" />
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={isPending} type="submit" className="w-full">
                {isPending && <LoaderIcon className="animate-spin" />}
                {t("resetPassword.resetPasswordButton")}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm">
            {t("resetPassword.doYouRemember")}{" "}
            <Link href="/sign-in" className="underline underline-offset-4">
              {t("resetPassword.signIn")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
