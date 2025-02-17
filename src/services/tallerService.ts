import api from "../api/config.ts";

export const searchTaller = async (id: number) => {
  const response = await api.get(`/talleres/${id}`);

  return response.data;
};
