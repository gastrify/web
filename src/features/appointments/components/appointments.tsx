"use client";

import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { RefreshCw } from "lucide-react";

import { getAllAppointments } from "@/features/appointments/actions/get-all-appointments";
import { EventCalendar } from "@/features/appointments/components/event-calendar";

export function Appointments() {
  const { t } = useTranslation("appointments");
  const { data, isError, refetch } = useQuery({
    queryKey: ["appointments", "list", "calendar"],
    queryFn: async () => {
      const { data, error } = await getAllAppointments();

      if (error) return Promise.reject(error);

      return data;
    },
    // Forzar que siempre se ejecute la consulta al montar el componente
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    // Agregar retry para casos de error
    retry: 3,
    retryDelay: 1000,
  });

  if (isError) {
    toast.error(t("errors.fetchError"), {
      description: t("errors.fetchErrorDescription"),
    });
  }

  // Si hay error, mostrar botón de refetch
  if (isError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">{t("errors.fetchError")}</p>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          {t("errors.refetch")}
        </Button>
      </div>
    );
  }

  // Asegurar que events nunca sea undefined y forzar re-render
  return <EventCalendar initialView="agenda" events={data || []} />;
}
