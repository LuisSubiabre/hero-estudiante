import api from "../api/config.ts";

export const getPersonalidad = async (id: number) => {
    return api.get(`/personalidad/${id}`).then((response) => response.data);

}