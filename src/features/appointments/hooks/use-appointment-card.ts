import { useCancelAppointmentMutation } from "@/features/appointments/hooks/use-cancel-appointment-mutation";

export const useAppointmentCard = () => {
  const {
    mutate: cancelAppointment,
    isPending: isCancelAppointmentPending,
    isError: isCancelAppointmentError,
  } = useCancelAppointmentMutation();

  const handleCancelAppointment = (appointmentId: string) =>
    cancelAppointment({ appointmentId });

  return {
    isCancelAppointmentPending,
    isCancelAppointmentError,
    handleCancelAppointment,
  };
};
