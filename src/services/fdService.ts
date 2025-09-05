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

export const inscribirAsignatura = async (asignatura_encuesta_id: number, prioridad: number = 1) => {
    try {
        console.log('📝 Inscribiendo en asignatura:', { asignatura_encuesta_id, prioridad });
        console.log('📊 Mapeo de prioridades: Área A=1, Área B=2, Área C=3');
        
        const data = {
            asignatura_encuesta_id,
            prioridad
        };
        
        console.log('📤 Datos enviados:', data);
        console.log('🌐 URL:', '/fd/inscribir');
        
        const response = await api.post('/fd/inscribir', data);

        console.log('✅ Respuesta de inscripción:', response.data);
        console.log('📊 Status:', response.status);
        
        return response.data;
    } catch (error: any) {
        console.error('❌ Error al inscribir estudiante:', error);
        if (error.response) {
            console.error('📊 Detalles del error:', {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data,
                headers: error.response.headers
            });
            console.error('📤 Datos que se intentaron enviar:', {
                asignatura_encuesta_id,
                prioridad
            });
        } else if (error.request) {
            console.error('📡 Error de red - no se recibió respuesta:', error.request);
        } else {
            console.error('⚙️ Error de configuración:', error.message);
        }
        throw error;
    }
}

export const desinscribirAsignatura = async (asignatura_encuesta_id: number) => {
    try {
        console.log('🗑️ Desinscribiendo de asignatura:', asignatura_encuesta_id);
        
        const response = await api.delete(`/fd/desinscribir/${asignatura_encuesta_id}`);

        console.log('✅ Respuesta de desinscripción:', response.data);
        
        return response.data;
    } catch (error: any) {
        console.error('❌ Error al desinscribir estudiante:', error);
        if (error.response) {
            console.error('📊 Detalles del error:', {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data
            });
        }
        throw error;
    }
}

export const listarAsignaturasInscritas = async () => {
    const response = await api.get(`/fd/elecciones/estudiante`);

    console.log('🔍 Respuesta completa de asignaturas inscritas:', response.data);
    
    // La API devuelve { success: true, data: [...] }
    if (response.data.success && response.data.data) {
        console.log('✅ Asignaturas inscritas extraídas correctamente:', response.data.data);

        return response.data.data;
    } else {
        console.error('❌ Formato de respuesta inesperado:', response.data);
        throw new Error('Formato de respuesta inesperado de la API');
    }
}