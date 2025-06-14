import { useQuery } from "@tanstack/react-query";

import { useSession } from "@/shared/hooks/use-session";

import { getUserAppointments } from "@/features/appointments/actions/get-user-appointments";

export const useUserAppointments = () => {
  const { data: session } = useSession();

  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    enabled: !!session?.user.id,
    queryKey: ["appointments", session?.user.id],
    queryFn: async () => {
      const { data, error } = await getUserAppointments(session!.user.id);

      if (error) return Promise.reject(error);

      return data;
    },
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
    isRefetching,
  };
};
