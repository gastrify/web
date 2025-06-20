import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import i18n from "i18next";

import { authClient } from "@/shared/lib/better-auth/client";
import { SESSION_QUERY_KEY } from "@/shared/lib/react-query/query-key-factory";
import type { ChangeLanguageFormValues } from "@/features/settings/types";

interface Props {
  form: UseFormReturn<ChangeLanguageFormValues>;
}

export const useChangeLanguageMutation = ({ form }: Props) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ChangeLanguageFormValues) => {
      const { error } = await authClient.updateUser({
        language: values.language,
      });

      if (error) return Promise.reject(error);
    },
    onSuccess: (_data, values) => {
      // Update i18n language
      i18n.changeLanguage(values.language);

      // Update localStorage
      if (typeof window !== "undefined") {
        window.localStorage.setItem("language", values.language);
      }

      toast.success("Language updated successfully 🎉", {
        duration: 10_000,
      });

      form.reset({ language: values.language });
    },
    onError: () => {
      toast.error("Failed to change language 😢", {
        description: "Please try again later",
        duration: 10_000,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [SESSION_QUERY_KEY] });
    },
  });
};
