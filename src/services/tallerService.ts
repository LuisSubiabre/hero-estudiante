import api from "../api/config.ts";

// lista talleres disponibles para un curso
export const searchTaller = async (id: number) => {
  const response = await api.get(`/talleres/${id}`);

  return response.data;
};

// lista de talleres inscritos por un estudiante
export const talleresInscritos = async (id: number) => {
  const response = await api.get(`/talleres/estudiante/${id}`);

  return response.data;
};

// inscribir un estudiante en un taller
export const tallerInscripcion = async (
  estudiante_id: number,
  taller_id: number
) => {
  const response = await api.post(`/talleres`, { estudiante_id, taller_id });

  return response.data;
};

export const tallerRetirar = async (
  estudiante_id: number,
  taller_id: number
) => {
  const response = await api.delete(`/talleres`, {
    data: { estudiante_id, taller_id },
  });

  return response.data;
};
