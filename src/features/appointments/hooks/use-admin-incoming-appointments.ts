import { useQuery } from "@tanstack/react-query";

import { getIncomingAppointments } from "@/features/appointments/actions/get-incoming-appointments";

export function useAdminIncomingAppointments() {
  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ["appointments", "incoming"],
    queryFn: async () => {
      const { data, error } = await getIncomingAppointments();

      if (error) return Promise.reject(error);

      return data;
    },
  });

  return { data, isLoading, isError, refetch, isRefetching };
}
