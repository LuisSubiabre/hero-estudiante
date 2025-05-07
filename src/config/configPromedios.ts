// configPromedios.js

interface ConfigPromedio {
  aproximar: boolean;
  precision: number;
  reglaAproximacion?: {
    base: number;
  };
}

const configPromedios = {
    // A. Promedio 1S Y 2S
    promedioSemestralAsignatura: {
      aproximar: true,
      precision: 1, // se aproxima a décimas
      reglaAproximacion: {
        base: 0.5, // a partir de .5 se redondea hacia arriba
      },
    } as ConfigPromedio,
  
    // B. Promedio anual por asignatura: PF (se calcula el promedio de 1S y 2S)
    promedioAnualAsignatura: {
      aproximar: true,
      precision: 0, // sin decimales
      reglaAproximacion: {
        base: 0.5, // a partir de .5 se redondea hacia arriba
      },
    } as ConfigPromedio,
  
    // C. Promedio final semestral - se calcula cada promedio semestral por asignatura y NO se promedia
    promedioGeneralSemestral: {
      aproximar: false, // sin aproximación
      precision: 0, // sin decimales
    } as ConfigPromedio,
  
    // D. Promedio general anual - se calcula el promedio final de 1S y 2S (el del punto C.)
    promedioGeneralAnual: {
      aproximar: true,
      precision: 1,
      reglaAproximacion: {
        base: 0.05,
      },
    } as ConfigPromedio,
  
    // E. Reglas de promoción
    promocionEscolar: {
      considerarLogroObjetivos: true,
      considerarAsistencia: true,
    },
  };
  
  export default configPromedios;
  