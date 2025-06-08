"use client";

import { useState, useEffect } from "react";
import { useIsAdmin } from "@/shared/hooks/is-admin";
import { useFormStatus } from "react-dom";
import {
  createAppointment,
  getAppointments,
  deleteAppointment,
  updateAppointment,
} from "../actions";
import { Appointment } from "@/shared/types";

export const TestCalendar = () => {
  const isAdmin = useIsAdmin();
  const [message, setMessage] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Appointment>>({});

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const result = await getAppointments();
    if (!result.error) {
      setAppointments(result.data ?? []);
    } else {
      setMessage(`Error al cargar citas: ${result.error.message}`);
    }
  };

  const handleCreate = async (formData: FormData) => {
    const result = await createAppointment(formData);
    if (result.error) {
      setMessage(`Error: ${result.error.message}`);
    } else {
      setMessage(`Cita creada con ID: ${result.data?.id}`);
      await fetchAppointments();
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteAppointment(id);
    if (result.error) {
      setMessage(`Error: ${result.error.message}`);
    } else {
      setMessage(`Cita eliminada`);
      await fetchAppointments();
    }
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (id: string) => {
    const formData = new FormData();
    formData.append("user_id", editForm.user_id ?? "");
    formData.append("start_time", String(editForm.start_time ?? ""));
    formData.append("end_time", String(editForm.end_time ?? ""));
    formData.append("type", editForm.type ?? "");
    formData.append("link", editForm.link ?? "");

    const result = await updateAppointment(id, formData);
    if (result.error) {
      setMessage(`Error: ${result.error.message}`);
    } else {
      setMessage("Cita actualizada");
      setEditingId(null);
      await fetchAppointments();
    }
  };

  return (
    <div className="space-y-8 p-4">
      <form action={handleCreate} className="space-y-4 border p-4 rounded">
        <h2 className="text-lg font-bold">Crear cita</h2>
        {message && <p className="text-sm text-red-600">{message}</p>}

        {isAdmin && (
          <div>
            <label>ID del paciente:</label>
            <input name="user_id" type="text" required className="input" />
          </div>
        )}

        <div>
          <label>Inicio:</label>
          <input
            name="start_time"
            type="datetime-local"
            required
            className="input"
          />
        </div>

        <div>
          <label>Fin:</label>
          <input
            name="end_time"
            type="datetime-local"
            required
            className="input"
          />
        </div>

        <div>
          <label>Tipo:</label>
          <select name="type" className="input" required>
            <option value="virtual">Virtual</option>
            <option value="in-person">Presencial</option>
          </select>
        </div>

        <div>
          <label>Enlace:</label>
          <input name="link" type="url" className="input" />
        </div>

        <SubmitButton />
      </form>

      <div className="space-y-2 border p-4 rounded">
        <h2 className="text-lg font-bold">Todas las citas</h2>
        {appointments.length === 0 ? (
          <p className="text-sm text-gray-500">No hay citas registradas.</p>
        ) : (
          <ul className="space-y-4">
            {appointments.map((appt) => (
              <li key={appt.id} className="border p-2 rounded space-y-2">
                {editingId === appt.id ? (
                  <div className="space-y-2">
                    <input
                      name="user_id"
                      defaultValue={appt.user_id || ""}
                      onChange={handleEditChange}
                      className="input"
                    />
                    <input
                      name="start_time"
                      defaultValue={appt.start_time
                        ?.toLocaleString()
                        .slice(0, 16)}
                      onChange={handleEditChange}
                      type="datetime-local"
                      className="input"
                    />
                    <input
                      name="end_time"
                      defaultValue={appt.end_time
                        ?.toLocaleString()
                        .slice(0, 16)}
                      onChange={handleEditChange}
                      type="datetime-local"
                      className="input"
                    />
                    <select
                      name="type"
                      defaultValue={appt.type || ""}
                      onChange={handleEditChange}
                      className="input"
                    >
                      <option value="virtual">Virtual</option>
                      <option value="in-person">Presencial</option>
                    </select>
                    <input
                      name="link"
                      defaultValue={appt.link || ""}
                      onChange={handleEditChange}
                      className="input"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditSubmit(appt.id)}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-500 text-white px-2 py-1 rounded"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div>
                      <strong>ID:</strong> {appt.id}
                    </div>
                    <div>
                      <strong>Paciente:</strong> {appt.user_id}
                    </div>
                    <div>
                      <strong>Inicio:</strong>{" "}
                      {new Date(appt.start_time || "").toLocaleString()}
                    </div>
                    <div>
                      <strong>Fin:</strong>{" "}
                      {new Date(appt.end_time || "").toLocaleString()}
                    </div>
                    <div>
                      <strong>Tipo:</strong> {appt.type}
                    </div>
                    {appt.link && (
                      <div>
                        <strong>Link:</strong>{" "}
                        <a
                          href={appt.link}
                          className="text-blue-600"
                          target="_blank"
                        >
                          {appt.link}
                        </a>
                      </div>
                    )}
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => setEditingId(appt.id)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(appt.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

function SubmitButton({ label = "Crear cita" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="bg-blue-500 text-white px-4 py-2 rounded"
      disabled={pending}
    >
      {pending ? `${label}...` : label}
    </button>
  );
}
