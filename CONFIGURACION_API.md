# Configuración de la API para Formación Diferenciada

## Estado actual

✅ **Sistema actualizado y funcionando**

El sistema de Formación Diferenciada ha sido actualizado para usar el servicio real `getAllAsignaturas()` del archivo `fdService.ts`. 

### Cambios realizados:
- ✅ Integrado con el servicio real `getAllAsignaturas()`
- ✅ Componentes adaptados para trabajar con datos flexibles
- ✅ Panel de debug para monitorear el estado
- ✅ Manejo de errores mejorado
- ✅ Build exitoso sin errores

## Solución

### 1. Crear archivo .env

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
# URL base de tu API
VITE_URL_BASE=http://localhost:8000/api
```

### 2. Configuración para diferentes entornos

#### Desarrollo local:
```env
VITE_URL_BASE=http://localhost:8000/api
```

#### Producción:
```env
VITE_URL_BASE=https://tu-dominio.com/api
```

### 3. Verificar la configuración

Después de crear el archivo `.env`:

1. Reinicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Abre la consola del navegador (F12) y ve a la pestaña "Console"

3. Navega a `/encuestafd` y verifica que aparezcan los logs de debug

### 4. Logs esperados

En la consola deberías ver:
- `🔧 Configuración de API:` con la URL base configurada
- `🚀 Iniciando carga de datos...`
- `🔍 Llamando a la API: GET /fd`
- `✅ Respuesta de la API:` con los datos de las asignaturas

### 5. Si la API no responde

Si ves errores en la consola, verifica:

1. **URL correcta**: Asegúrate de que `VITE_URL_BASE` apunte a la URL correcta de tu API
2. **API funcionando**: Verifica que tu API esté ejecutándose y responda en la URL configurada
3. **Endpoints disponibles**: Confirma que el endpoint `/fd` esté disponible en tu API
4. **Autenticación**: Verifica que tengas un token válido en localStorage

### 6. Estructura de la API (Actualizada)

La API responde con el siguiente formato en el endpoint `GET /fd`:

```json
{
  "success": true,
  "data": [
    {
      "asignatura_encuesta_id": 10,
      "nombre": "BIOLOGÍA CELULAR Y MOLECULAR G1",
      "area": "B",
      "bloque": "Bloque 1",
      "cupos_totales": 33,
      "cupos_actuales": 33,
      "estado": "visible",
      "fecha_creacion": "2025-07-29T18:43:49.073Z",
      "fecha_actualizacion": "2025-08-12T11:27:37.276Z"
    }
  ]
}
```

**Campos importantes:**
- `asignatura_encuesta_id`: ID único de la asignatura
- `nombre`: Nombre de la asignatura
- `area`: Área de la asignatura (A, B, C, etc.)
- `bloque`: Bloque al que pertenece
- `cupos_totales`: Total de cupos disponibles
- `cupos_actuales`: Cupos actualmente disponibles
- `estado`: Estado de la asignatura ("visible" = activa)

## Debug temporal

He agregado un panel de debug temporal en la página que muestra:
- Número de bloques cargados
- Si el resumen está disponible
- Número de elecciones del estudiante
- URL base configurada

Este panel se puede remover una vez que todo funcione correctamente.
