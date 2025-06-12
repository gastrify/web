import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useSession } from "@/shared/hooks/use-session";

import { useChangeIdentificationNumberMutation } from "@/features/settings/hooks/use-change-identification-number-mutation";
import { changeIdentificationNumberFormSchema } from "@/features/settings/schemas/change-identification-number-form-schema";
import type { ChangeIdentificationNumberFormValues } from "@/features/settings/types";

export const useChangeIdentificationNumberForm = () => {
  const {
    data: session,
    isSuccess: isSessionSuccess,
    isLoading: isSessionLoading,
    isError: isSessionError,
    refetch: refetchSession,
    isRefetching: isSessionRefetching,
  } = useSession();

  const form = useForm<ChangeIdentificationNumberFormValues>({
    resolver: zodResolver(changeIdentificationNumberFormSchema),
    values: {
      identificationNumber: session?.user.identificationNumber ?? "",
    },
  });

  const { mutate, isPending, isError } = useChangeIdentificationNumberMutation({
    form,
  });

  const { isDirty, isValid } = form.formState;

  const canSubmit =
    isDirty &&
    isValid &&
    form.watch("identificationNumber").trim() !==
      session?.user.identificationNumber;

  const onSubmit = (values: ChangeIdentificationNumberFormValues) =>
    mutate(values);

  return {
    form,
    canSubmit,
    onSubmit,
    isPending,
    isError,
    session,
    isSessionSuccess,
    isSessionLoading,
    isSessionError,
    refetchSession,
    isSessionRefetching,
  };
};
