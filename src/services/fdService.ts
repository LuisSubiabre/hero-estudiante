import api from "../api/config.ts";

export const getAllAsignaturas = async () => {
    const response = await api.get(`/fd`);

    console.log('🔍 Respuesta completa de la API:', response.data);
    
    // La API devuelve { success: true, data: [...] }
    if (response.data.success && response.data.data) {
        console.log('✅ Datos extraídos correctamente:', response.data.data);

        return response.data.data;
    } else {
        console.error('❌ Formato de respuesta inesperado:', response.data);
        throw new Error('Formato de respuesta inesperado de la API');
    }
}