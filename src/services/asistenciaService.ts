import api from "../api/config.ts";

export const getAsistencia = async (id: number) => {
    return api.get(`/asistencia/${id}`).then((response) => response.data);

}