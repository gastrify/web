import { useDeleteAppointmentMutation } from "@/features/appointments/hooks/use-delete-appointment-mutation";

export const useAdminIncomingAppointmentCard = () => {
  const {
    mutate: deleteAppointment,
    isPending: isDeleteAppointmentPending,
    isError: isDeleteAppointmentError,
  } = useDeleteAppointmentMutation();

  const handleDeleteAppointment = (appointmentId: string) =>
    deleteAppointment(appointmentId);

  return {
    isDeleteAppointmentPending,
    isDeleteAppointmentError,
    handleDeleteAppointment,
  };
};
