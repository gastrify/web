"use client";

import { CheckIcon, LoaderIcon, RotateCcwIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Skeleton } from "@/shared/components/ui/skeleton";

import { useChangeLanguageForm } from "@/features/settings/hooks/use-change-language-form";
import { useChangeLanguageMutation } from "@/features/settings/hooks/use-change-language-mutation";
import { changeLanguageFormSchema } from "@/features/settings/schemas/change-language-form-schema";
import type { ChangeLanguageFormValues } from "@/features/settings/types";

export function ChangeLanguageForm() {
  const { t } = useTranslation("settingsProfile");
  const {
    session,
    isSessionLoading,
    isSessionError,
    refetchSession,
    isSessionRefetching,
  } = useChangeLanguageForm();

  // Create form with proper typing
  const form = useForm<ChangeLanguageFormValues>({
    resolver: zodResolver(changeLanguageFormSchema),
    defaultValues: {
      language: "es" as const, // Default value, will be updated when session loads
    },
  });

  // Update form values when session changes
  useEffect(() => {
    if (
      session?.user.language &&
      (session.user.language === "es" || session.user.language === "en")
    ) {
      form.reset({ language: session.user.language as "es" | "en" });
    }
  }, [session?.user.language, form]);

  const { mutate, isPending, isError } = useChangeLanguageMutation({ form });

  const { isDirty, isValid } = form.formState;

  const canSubmit =
    isDirty && isValid && form.watch("language") !== session?.user.language;

  const onSubmit = (values: ChangeLanguageFormValues) => mutate(values);

  // Show skeleton while loading
  if (isSessionLoading) {
    return (
      <div className="h-8 w-[120px]">
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onKeyDown={(event) => {
          if (event.key === "Enter" && !canSubmit) event.preventDefault();
        }}
        onSubmit={form.handleSubmit(
          onSubmit as (data: ChangeLanguageFormValues) => void,
        )}
        className="space-y-6"
      >
        <FormField<ChangeLanguageFormValues, "language">
          disabled={isPending}
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-wrap items-center justify-start gap-2">
                <FormLabel>{t("account.languagePreference")}</FormLabel>

                {isSessionError && (
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => refetchSession()}
                  >
                    {t("account.retry")}{" "}
                    {isSessionRefetching ? (
                      <LoaderIcon className="animate-spin" />
                    ) : (
                      <RotateCcwIcon />
                    )}
                  </Button>
                )}

                <FormControl className="flex-1 sm:w-fit sm:flex-none">
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isPending}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("account.languagePreference")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">{t("account.spanish")}</SelectItem>
                      <SelectItem value="en">{t("account.english")}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>

                {canSubmit && (
                  <Button
                    variant={isError ? "destructive" : "ghost"}
                    className="rounded-full"
                    size="icon"
                    disabled={isPending}
                    type="submit"
                  >
                    {isPending && <LoaderIcon className="animate-spin" />}
                    {isError && <RotateCcwIcon />}
                    {!isPending && !isError && <CheckIcon />}
                  </Button>
                )}
              </div>

              <FormDescription className="text-muted-foreground text-sm">
                {t("account.languageDescription")}
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
