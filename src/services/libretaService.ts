import api from "../api/config.ts";

export const searchLibreta = async (id: number) => {
  const response = await api.get(`/libreta/${id}`);

  return response.data;
};
