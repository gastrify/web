"use client";

import Link from "next/link";
import { LoaderIcon } from "lucide-react";
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
  FormMessage,
} from "@/shared/components/ui/form";
import { TypographyH1, TypographyP } from "@/shared/components/ui/typography";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/utils/cn";

import { useRecoveryForm } from "@/features/auth/hooks/use-recovery-form";

export function RecoveryForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation("auth");
  const { form, onSubmit, isPending } = useRecoveryForm();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-background border-none shadow-none">
        <CardHeader className="text-center">
          <CardTitle>
            <TypographyH1>{t("recovery.title")}</TypographyH1>
          </CardTitle>
          <CardDescription>
            <TypographyP className="leading-normal">
              {t("recovery.description")}
            </TypographyP>
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder={t("recovery.codePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={isPending} type="submit" className="w-full">
                {isPending && <LoaderIcon className="animate-spin" />}
                {t("recovery.verifyButton")}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm">
            {t("recovery.rememberCredentials")}{" "}
            <Link href="/sign-in" className="underline underline-offset-4">
              {t("recovery.signIn")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
