import { useQuery } from "@tanstack/react-query";

import { useSession } from "@/shared/hooks/use-session";

import { getAllAppointments } from "@/features/appointments/actions/get-all-appointments";

export const useAllAppointments = () => {
  const { data: session } = useSession();

  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    enabled: !!session?.user.id,
    queryKey: ["appointments", "list", "all", session?.user.id],
    queryFn: async () => {
      const { data, error } = await getAllAppointments();

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
