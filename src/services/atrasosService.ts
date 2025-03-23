import api from "../api/config.ts";

export const getAtrasos = async (id: number) => {
    return api.get(`/atrasos/${id}`).then((response) => response.data);

}