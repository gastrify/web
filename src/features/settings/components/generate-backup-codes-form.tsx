"use client";

import { LoaderIcon, RotateCcwIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

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
import { Input } from "@/shared/components/ui/input";
import { TypographyH4 } from "@/shared/components/ui/typography";

import { useGenerateBackupCodesForm } from "@/features/settings/hooks/use-generate-backup-codes-form";

export const GenerateBackupCodesForm = () => {
  const { t } = useTranslation("settingsProfile");
  const { form, onSubmit, isPending, isError, isTwoFactorEnabled } =
    useGenerateBackupCodesForm();

  return (
    isTwoFactorEnabled && (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <TypographyH4>{t("backupCodes.backupCodesTitle")}</TypographyH4>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="generateBackupCodes"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-wrap items-center justify-start gap-4">
                    <FormLabel>
                      {t("backupCodes.generateBackupCodes")}
                    </FormLabel>
                    <FormControl>
                      <Button
                        disabled={isPending}
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => field.onChange(true)}
                      >
                        {t("backupCodes.generateButton")}
                      </Button>
                    </FormControl>
                  </div>
                  <FormDescription>
                    {t("backupCodes.generateBackupCodesDescription")}
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>

          {form.formState.isDirty && (
            <FormField
              disabled={isPending}
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem className="bg-destructive/40 flex flex-col items-start gap-4 rounded-lg p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t("security.password")}
                    </FormLabel>
                    <FormDescription>
                      {t("backupCodes.passwordDescription")}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                  <Button
                    disabled={isPending}
                    type="submit"
                    variant={isError ? "destructive" : "default"}
                  >
                    {isPending && <LoaderIcon className="animate-spin" />}
                    {isError && <RotateCcwIcon />}
                    {t("backupCodes.generateButton")}
                  </Button>
                </FormItem>
              )}
            />
          )}
        </form>
      </Form>
    )
  );
};
