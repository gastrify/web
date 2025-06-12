import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";
import { SESSION_QUERY_KEY } from "@/shared/lib/react-query/query-key-factory";
import type { AuthClientError } from "@/shared/types";

import type { ChangeIdentificationNumberFormValues } from "@/features/settings/types";

interface Props {
  form: UseFormReturn<ChangeIdentificationNumberFormValues>;
}

export const useChangeIdentificationNumberMutation = ({ form }: Props) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      identificationNumber,
    }: {
      identificationNumber: string;
    }) => {
      const { error } = await authClient.updateUser({
        identificationNumber,
      });

      if (error) return Promise.reject(error);
    },
    onSuccess: (_data, values) => {
      toast.success("Identification number updated successfully 🎉", {
        duration: 10_000,
      });

      form.reset({ identificationNumber: values.identificationNumber });
    },
    onError: (error: AuthClientError) => {
      if (error.status === RATE_LIMIT_ERROR_CODE) return;

      if (
        (error as unknown as { details: { cause: { constraint: string } } })
          .details.cause.constraint === "user_identification_number_unique"
      ) {
        form.setError("identificationNumber", {
          message:
            "Identification number is already taken. Please try another.",
        });
        return;
      }

      switch (error.code) {
        default:
          toast.error("Failed to change identification number 😢", {
            description: "Please try again later",
            duration: 10_000,
          });
          return;
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [SESSION_QUERY_KEY] });
    },
  });
};
