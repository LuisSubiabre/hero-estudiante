import api from "../api/config.ts";

export const getAllAsignaturas = async () => {
    const response = await api.get(`/fd`);
    
    // La API devuelve { success: true, data: [...] }
    if (response.data.success && response.data.data) {
        return response.data.data;
    } else {
        throw new Error('Formato de respuesta inesperado de la API');
    }
}

export const inscribirAsignatura = async (asignatura_encuesta_id: number, prioridad: number = 1) => {
    try {
        const data = {
            asignatura_encuesta_id,
            prioridad
        };
        
        const response = await api.post('/fd/inscribir', data);
        
        return response.data;
    } catch (error: any) {
        throw error;
    }
}

export const desinscribirAsignatura = async (asignatura_encuesta_id: number) => {
    try {
        const response = await api.delete(`/fd/desinscribir/${asignatura_encuesta_id}`);
        
        return response.data;
    } catch (error: any) {
        throw error;
    }
}

export const listarAsignaturasInscritas = async () => {
    const response = await api.get(`/fd/elecciones/estudiante`);
    
    // La API devuelve { success: true, data: [...] }
    if (response.data.success && response.data.data) {
        return response.data.data;
    } else {
        throw new Error('Formato de respuesta inesperado de la API');
    }
}