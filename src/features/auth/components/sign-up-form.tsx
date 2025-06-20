"use client";

import "@/shared/lib/i18n/i18n";
import Link from "next/link";
import {
  IdCardIcon,
  LoaderIcon,
  LockIcon,
  MailIcon,
  User2Icon,
} from "lucide-react";
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
import { Input } from "@/shared/components/ui/input";
import { TypographyH1, TypographyP } from "@/shared/components/ui/typography";
import { cn } from "@/shared/utils/cn";

import { useSignUpForm } from "@/features/auth/hooks/use-sign-up-form";
import { PasswordStrengthIndicator } from "@/shared/components/password-strength-indicator";

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation("auth");
  const { form, onSubmit, isPending /*handleSignUpWithGoogle*/ } =
    useSignUpForm();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-background border-none shadow-none">
        <CardHeader className="text-center">
          <CardTitle>
            <TypographyH1>{t("signUp.title")}</TypographyH1>
          </CardTitle>
          <CardDescription>
            <TypographyP className="leading-normal">
              {t("signUp.description")}
            </TypographyP>
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6">
          {/* Botón Google (opcional) */}
          {/* <Button
            type="button"
            variant="secondary"
            disabled={isPending}
            onClick={handleSignUpWithGoogle}
          >
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="mr-2 h-4 w-4"
            >
              <title>Google</title>
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
            </svg>
            Google
          </Button> */}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>{t("signUp.nameLabel")}</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          className="peer aria-invalid:text-destructive-foreground ps-9 shadow-none not-aria-invalid:border-none"
                          disabled={isPending}
                          placeholder={
                            fieldState.invalid
                              ? undefined
                              : "Walter David Aragundy Yánez"
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
                        <User2Icon size={16} aria-hidden="true" />
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="identificationNumber"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>{t("signUp.identificationLabel")}</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          className="peer aria-invalid:text-destructive-foreground ps-9 shadow-none not-aria-invalid:border-none"
                          disabled={isPending}
                          placeholder={
                            fieldState.invalid ? undefined : "1234567890"
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
                        <IdCardIcon size={16} aria-hidden="true" />
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>{t("signUp.emailLabel")}</FormLabel>
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

              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>{t("signUp.passwordLabel")}</FormLabel>
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

              <Button disabled={isPending} type="submit" className="w-full">
                {isPending && <LoaderIcon className="animate-spin" />}
                {t("signUp.signUpButton")}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm">
            {t("signUp.hasAccount")}{" "}
            <Link
              href="/sign-in"
              className="font-bold hover:underline hover:underline-offset-4"
            >
              {t("signUp.signInLink")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
