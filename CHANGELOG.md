# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [5.0.2](https://github.com/LuisSubiabre/hero-estudiante/compare/v5.0.1...v5.0.2) (2025-09-05)


### Bug Fixes

* corregir el título en el formulario de inicio de sesión añadiendo un punto final para mejorar la presentación ([4dd0e34](https://github.com/LuisSubiabre/hero-estudiante/commit/4dd0e340f7079df8939692ea954eda500b27b833))
* eliminar el punto final del título en el formulario de inicio de sesión para una presentación más limpia ([e4cdb11](https://github.com/LuisSubiabre/hero-estudiante/commit/e4cdb11f7028fec81f74886990879add07c98c7a))

### [5.0.1](https://github.com/LuisSubiabre/hero-estudiante/compare/v5.0.0...v5.0.1) (2025-09-05)

## [5.0.0](https://github.com/LuisSubiabre/hero-estudiante/compare/v4.0.2...v5.0.0) (2025-09-05)


### Features

* actualizar lógica de filtrado en el componente Navbar para manejar exclusiones de elementos de navegación según el curso_id, incluyendo "Encuesta FD" ([eed9aaf](https://github.com/LuisSubiabre/hero-estudiante/commit/eed9aaf760833113e8be1273d6b80f77d66f773d))
* agregar funcionalidad de inscripción y desinscripción de asignaturas, incluyendo nuevos endpoints en la API y mejoras en la presentación de información en los componentes de la interfaz ([17df11c](https://github.com/LuisSubiabre/hero-estudiante/commit/17df11c7590e3a95b91a64412e04c3156affc072))
* agregar interceptores de solicitud y respuesta en la API, incluyendo registros detallados de peticiones y manejo de errores en la inscripción de asignaturas en el componente FDManager ([5f155bd](https://github.com/LuisSubiabre/hero-estudiante/commit/5f155bd50af684c1fca00280e17964746bb1349e))
* agregar lógica para manejar el límite de elecciones de asignaturas en los componentes AsignaturaCard y BloqueAsignaturas, y mostrar mensajes de restricción en el componente FDManager ([b8d7731](https://github.com/LuisSubiabre/hero-estudiante/commit/b8d7731741d72e532962f6208469fb673ce49d46))
* agregar página de Encuesta FD y actualizar navegación y configuración del sitio para incluirla ([7f34333](https://github.com/LuisSubiabre/hero-estudiante/commit/7f343334db932050879eefad0a2ecfbf189e53a1))
* implementar carga y gestión de elecciones de asignaturas en el componente FDManager, incluyendo nuevos estados y lógica para manejar elecciones del estudiante ([98e7694](https://github.com/LuisSubiabre/hero-estudiante/commit/98e76946bbd2bd248b1886b1f990a8f3dcdd7233))
* implementar la gestión de asignaturas en la página de Formación Diferenciada, incluyendo componentes para mostrar bloques y elecciones de asignaturas, así como la integración con la API para obtener datos en tiempo real ([1c48b42](https://github.com/LuisSubiabre/hero-estudiante/commit/1c48b4225a683c10b9a14dfbcaa4e9708ff8b830))
* integrar notificaciones mediante Toast en el componente FDManager para mejorar la experiencia del usuario al inscribirse y desinscribirse de asignaturas ([78b769f](https://github.com/LuisSubiabre/hero-estudiante/commit/78b769f9ac83803b654bb086aaadbd15b8163c58))
* integrar ruta protegida para la página de Encuesta FD, asegurando acceso restringido a usuarios autorizados ([d55c471](https://github.com/LuisSubiabre/hero-estudiante/commit/d55c4712b3321324efddd1e28ac1ba7f44335e78))

### [4.0.2](https://github.com/LuisSubiabre/hero-estudiante/compare/v4.0.1...v4.0.2) (2025-06-25)


### Features

* agregar mensaje de estado en la página de Personalidad para informar sobre posibles cambios en el informe ([eeea030](https://github.com/LuisSubiabre/hero-estudiante/commit/eeea03059f7ee7fe0e08119b336f1570270b6060))

### [4.0.1](https://github.com/LuisSubiabre/hero-estudiante/compare/v4.0.0...v4.0.1) (2025-06-25)

## [4.0.0](https://github.com/LuisSubiabre/hero-estudiante/compare/v3.0.2...v4.0.0) (2025-06-25)


### Features

* agregar componente CourseRestrictedRoute y actualizar rutas en App.tsx para restringir acceso a páginas según curso_id ([9a5747d](https://github.com/LuisSubiabre/hero-estudiante/commit/9a5747da81997dfc7795bb780e5ee5cc2990fe67))
* agregar componente PersonalidadPDF y funcionalidad para descargar el informe en formato PDF desde la página de Personalidad ([ddac996](https://github.com/LuisSubiabre/hero-estudiante/commit/ddac996892eb24d5f63c380702fb10025ef23cce))
* agregar ícono de usuario en la barra de navegación y comentar log en la página de Personalidad para mejorar la legibilidad del código ([6034faa](https://github.com/LuisSubiabre/hero-estudiante/commit/6034faa2829ca6ae35db1508275b1e4ffd85d8bc))
* agregar íconos y mejorar el diseño de la página de Personalidad, incluyendo nuevas funciones para mostrar estados y categorías ([02250cf](https://github.com/LuisSubiabre/hero-estudiante/commit/02250cf24c97fc4a7c2d7f4237bd24335de3ed41))
* agregar página de Personalidad y actualizar rutas y configuración del sitio ([811e526](https://github.com/LuisSubiabre/hero-estudiante/commit/811e526a8b40d06d3b6e94905e064b9a5b2268f7))
* agregar servicio para obtener datos de personalidad desde la API ([90f98c2](https://github.com/LuisSubiabre/hero-estudiante/commit/90f98c28de9fb9e28c205fe6ecf297fea2d2c57d))

### [3.0.2](https://github.com/LuisSubiabre/hero-estudiante/compare/v3.0.1...v3.0.2) (2025-06-06)


### Bug Fixes

* comentar logs en el componente NotasPage para limpiar la consola y mejorar la legibilidad del código ([2e8a5b3](https://github.com/LuisSubiabre/hero-estudiante/commit/2e8a5b3f04375af45cba1d97db0687a8b41c7d8d))

### [3.0.1](https://github.com/LuisSubiabre/hero-estudiante/compare/v3.0.0...v3.0.1) (2025-06-06)


### Bug Fixes

* comentar el uso del hook useAuth y el estilo de celdas en el componente NotasPage para mejorar la legibilidad del código ([27c947f](https://github.com/LuisSubiabre/hero-estudiante/commit/27c947f166c9f62da1390f9bcf6736ec3ef39c88))

## [3.0.0](https://github.com/LuisSubiabre/hero-estudiante/compare/v2.0.1...v3.0.0) (2025-06-06)


### Features

* agregar funcionalidad para generar y descargar un PDF con el informe de calificaciones del estudiante ([8a53b6a](https://github.com/LuisSubiabre/hero-estudiante/commit/8a53b6abe0e05c892f4c943f56d13ee4b77c7fc5))
* agregar funcionalidad para obtener promedios de cursos y mostrarlos en la tabla de notas ([ac0c84c](https://github.com/LuisSubiabre/hero-estudiante/commit/ac0c84cbca76fe420ac442e443921d680df2b22e))
* agregar nombre del profesor jefe en la libreta y ajustar el PDF para mostrar la firma y nombre del director ([3cc4a26](https://github.com/LuisSubiabre/hero-estudiante/commit/3cc4a26584f5747a845dbe9a5cd6f1a62dcea085))
* agregar propiedades minWidth a las celdas en la tabla de notas para mejorar la consistencia del diseño ([c28e589](https://github.com/LuisSubiabre/hero-estudiante/commit/c28e58920197681ba800e710cdb154b40de1692e))
* ajustar estilos de celdas y mejorar la visualización del gráfico en la sección de notas ([c517f7b](https://github.com/LuisSubiabre/hero-estudiante/commit/c517f7b8b3b2a581613665b670005b97dbe9654e))
* ajustar estilos en el PDF y agregar gráfico de promedios finales por asignatura ([fcb7d91](https://github.com/LuisSubiabre/hero-estudiante/commit/fcb7d914084a54052af6241466084f095a056082))
* modificar estilos de celdas en la tabla de notas y agregar cálculo de promedios de curso en el PDF ([8bed1da](https://github.com/LuisSubiabre/hero-estudiante/commit/8bed1daa7f0450e4443feb5c4481e6a160af56a5))
* refactorizar la lógica de cálculo de promedios en el componente NotasPDF y mejorar la gestión de promedios de curso en la tabla de notas ([96a2e23](https://github.com/LuisSubiabre/hero-estudiante/commit/96a2e23f7f099d73b2f643c8c60eb97fae0154e1))


### Bug Fixes

* ajustar el número de celdas en la tabla de notas y corregir el cálculo de promedios para reflejar los cambios en los semestres ([3dea99c](https://github.com/LuisSubiabre/hero-estudiante/commit/3dea99cb20914cb8fa83702090ef2b9c24b2a0e3))
* comentar el enlace de descarga del PDF en el componente NotasPage para mejorar la legibilidad del código ([18daad7](https://github.com/LuisSubiabre/hero-estudiante/commit/18daad7d388afe4f2547b318c08c8601561ebd41))
* comentar encabezados de semestre en la tabla de notas para mejorar la legibilidad del código ([2946db9](https://github.com/LuisSubiabre/hero-estudiante/commit/2946db9f7e4620d6a8327949ca8e5f544c0d15c3))
* corregir el cálculo del porcentaje de asistencia para mostrar solo la parte entera ([3daa9cc](https://github.com/LuisSubiabre/hero-estudiante/commit/3daa9cc5ed6da34ab1b5a6109ea804563ef12867))

### [2.0.1](https://github.com/LuisSubiabre/hero-estudiante/compare/v2.0.0...v2.0.1) (2025-06-03)


### Features

* agregar componente de asistencia y servicio para obtener datos ([a20c9e7](https://github.com/LuisSubiabre/hero-estudiante/commit/a20c9e7e4801cd1d02d1346f8b9a48b1587d38a7))

## [2.0.0](https://github.com/LuisSubiabre/hero-estudiante/compare/v1.6.2...v2.0.0) (2025-06-03)

### [1.6.2](https://github.com/LuisSubiabre/hero-estudiante/compare/v1.6.1...v1.6.2) (2025-05-07)


### Features

* agregar configuración de reescritura en vercel.json ([25d496a](https://github.com/LuisSubiabre/hero-estudiante/commit/25d496a5cc634e1c93467667e725e09ea294b266))

### [1.6.1](https://github.com/LuisSubiabre/hero-estudiante/compare/v1.6.0...v1.6.1) (2025-05-07)


### Features

* agregar configuración de promedios y cálculo en la página de notas ([c05d868](https://github.com/LuisSubiabre/hero-estudiante/commit/c05d8681b3605677090056d8d0fa3e830fbafd35))

## [1.6.0](https://github.com/LuisSubiabre/hero-estudiante/compare/v1.5.0...v1.6.0) (2025-04-25)


### Features

* libreta ([eb27d53](https://github.com/LuisSubiabre/hero-estudiante/commit/eb27d53fdbce1b595c3d4e1c7023d245d60d1e5c))

## [1.5.0](https://github.com/LuisSubiabre/hero-estudiante/compare/v1.4.2...v1.5.0) (2025-04-11)


### Features

* taller especial ([416cc0f](https://github.com/LuisSubiabre/hero-estudiante/commit/416cc0fcfecf510cb30031efdfd3d34a0b9cf279))

### [1.4.2](https://github.com/LuisSubiabre/hero-estudiante/compare/v1.4.1...v1.4.2) (2025-04-04)


### Bug Fixes

* ts code delete ([42ac00c](https://github.com/LuisSubiabre/hero-estudiante/commit/42ac00ca19e44f4684f0d96bbec10763dd956bdb))

### [1.4.1](https://github.com/LuisSubiabre/hero-estudiante/compare/v1.4.0...v1.4.1) (2025-04-04)


### Features

* acle periodo finalizado ([e601c05](https://github.com/LuisSubiabre/hero-estudiante/commit/e601c05de8ba5b8c0b7c0b75ee32c03aed7ccb06))

## [1.4.0](https://github.com/LuisSubiabre/hero-estudiante/compare/v1.3.1...v1.4.0) (2025-04-01)


### Features

* icon acle ([7a802cc](https://github.com/LuisSubiabre/hero-estudiante/commit/7a802cc744052f76a3be46002f1c86c8429aad9a))
* inspectores de nivel ([30b648d](https://github.com/LuisSubiabre/hero-estudiante/commit/30b648d0c1bcd3bfe834f02cdbe3719ecf469abf))
* mejora ux ([18dc6e1](https://github.com/LuisSubiabre/hero-estudiante/commit/18dc6e1bebbe5bf4d12b6292f010028567ca154f))
* menu mobile ([e4255b5](https://github.com/LuisSubiabre/hero-estudiante/commit/e4255b59f66cb063fe565cd022b9b8e2ae2ba55f))
* redirecciona al login cuando no hay sesion ([16001f4](https://github.com/LuisSubiabre/hero-estudiante/commit/16001f4795f37f32faee5185ff2f80a1b49e8f1d))


### Bug Fixes

* menu responsive ([9c3059e](https://github.com/LuisSubiabre/hero-estudiante/commit/9c3059ea0d575144b872a071565a437df35302c8))

### [1.3.1](https://github.com/LuisSubiabre/hero-estudiante/compare/v1.3.0...v1.3.1) (2025-03-31)


### Bug Fixes

* digito veriticador a mayuscular al perder foco ([80d6c67](https://github.com/LuisSubiabre/hero-estudiante/commit/80d6c670f788e99e0806f4dd6f891fc4124ed4e9))
* modificar token decodificado ([d734083](https://github.com/LuisSubiabre/hero-estudiante/commit/d734083963fbe80523a245638b886700d41bc197))

## [1.3.0](https://github.com/LuisSubiabre/hero-estudiante/compare/v1.2.1...v1.3.0) (2025-03-31)


### Features

* talleres acle ([95f5f1a](https://github.com/LuisSubiabre/hero-estudiante/commit/95f5f1af6adf5a6aba3b27fb96d3a437f72733f7))

### [1.2.1](https://github.com/LuisSubiabre/hero-estudiante/compare/v1.2.0...v1.2.1) (2025-03-28)


### Bug Fixes

* fecha atrasos ([a86731a](https://github.com/LuisSubiabre/hero-estudiante/commit/a86731a9bcc78e4786a5907a29b144ba765e5d74))

## [1.2.0](https://github.com/LuisSubiabre/hero-estudiante/compare/v1.1.1...v1.2.0) (2025-03-23)


### Features

* atrasos ([edfd8bb](https://github.com/LuisSubiabre/hero-estudiante/commit/edfd8bb3525c230d72b0310041c1b7a895832c44))


### Bug Fixes

* estudiante_id ([2c4dbdd](https://github.com/LuisSubiabre/hero-estudiante/commit/2c4dbdd76b01afc14cf351f9652caa7902bf6f5e))

### [1.1.1](https://github.com/LuisSubiabre/hero-estudiante/compare/v1.1.0...v1.1.1) (2025-03-21)

## [1.1.0](https://github.com/LuisSubiabre/hero-estudiante/compare/v1.0.0...v1.1.0) (2025-03-21)


### Features

* version footer ([9a457b8](https://github.com/LuisSubiabre/hero-estudiante/commit/9a457b8ae13930ca9811921d203700ae300e5992))

## [1.0.0](https://github.com/LuisSubiabre/hero-estudiante/compare/v0.0.0...v1.0.0) (2025-03-21)

## 0.0.0 (2025-03-21)


### Features

* add descripcion and horario to Taller interface ([e0f0018](https://github.com/LuisSubiabre/hero-estudiante/commit/e0f001870fcf920bed235a0f31ed43b126d62c16))
* alumno regular con parametros ([fbe440f](https://github.com/LuisSubiabre/hero-estudiante/commit/fbe440f5d57990c72c8805f5e27b907fc05dc739))
* calendario institucional ([c3448a6](https://github.com/LuisSubiabre/hero-estudiante/commit/c3448a6f09b05ebba6fef42714f64798e76943ff))
* certificado pdf ([ec85332](https://github.com/LuisSubiabre/hero-estudiante/commit/ec8533214d2cfb82fad6439a56c7acf7c4ded1a6))
* devcontainer ([756ff7a](https://github.com/LuisSubiabre/hero-estudiante/commit/756ff7ad6496c49d0de912c3c8f0d207c5a1acaa))
* error modal taller ([e062145](https://github.com/LuisSubiabre/hero-estudiante/commit/e062145ca1d0e10b16f6bfce32f5c71b1a1aba8f))
* login ([0064474](https://github.com/LuisSubiabre/hero-estudiante/commit/0064474455e17bae54d35b3e2aa85e72ba1d0a4d))
* login recuperar clave ([2be53b3](https://github.com/LuisSubiabre/hero-estudiante/commit/2be53b3537c00b617c97021b4f861fb6e2fc823b))
* logo ([1fcfce1](https://github.com/LuisSubiabre/hero-estudiante/commit/1fcfce157eb52b4bc9cc025618497fdbe7e5b3b0))
* logout ([64e41be](https://github.com/LuisSubiabre/hero-estudiante/commit/64e41be745034c0bfadbb5c387de4b81cee4fe24))
* maximo talleres ([d4723a8](https://github.com/LuisSubiabre/hero-estudiante/commit/d4723a8f1f3df911acdaae032a43db9b137f0625))
* redirecciona a /login ([9ffca3d](https://github.com/LuisSubiabre/hero-estudiante/commit/9ffca3d22640ec038b4fc67f5197186cafcf9857))
* signature ([2e8eb33](https://github.com/LuisSubiabre/hero-estudiante/commit/2e8eb3341ab83ce2d63a7ce25a5464d8f2ef2c60))
* spinner ([edc3fb8](https://github.com/LuisSubiabre/hero-estudiante/commit/edc3fb8df341cff53ec3f4c1894ab319f379403f))
* talleres con cupos completo no deja inscribirse ([dbd797c](https://github.com/LuisSubiabre/hero-estudiante/commit/dbd797cabbd8894848d00bd564cd5a52daf43b68))
* talleres inscripcion y retiro ([b193d50](https://github.com/LuisSubiabre/hero-estudiante/commit/b193d50182d51a043138d78f56f6ebc1e41d71f2))
* talleres y libreta ([bc91b57](https://github.com/LuisSubiabre/hero-estudiante/commit/bc91b57927d5626b772937127636860f32d19f50))


### Bug Fixes

* api ([e3d7ebf](https://github.com/LuisSubiabre/hero-estudiante/commit/e3d7ebfd41d4aaaf673a8ba06169e8a3547e1e70))
* delete vercel.json ([f9a8f05](https://github.com/LuisSubiabre/hero-estudiante/commit/f9a8f05670b787a9bc9409d01e69614904d1f36b))
* modal ([e8f0df2](https://github.com/LuisSubiabre/hero-estudiante/commit/e8f0df26415bebacd11c74fcf45875759610624b))
* movil menu ([1744bd8](https://github.com/LuisSubiabre/hero-estudiante/commit/1744bd85d8d3e5b1e38b5a378fe129cd56b3986c))
* rutas privadas ([5532743](https://github.com/LuisSubiabre/hero-estudiante/commit/55327439b003e274d523354984661e189b284dd6))
* ssl ([c0e1c84](https://github.com/LuisSubiabre/hero-estudiante/commit/c0e1c84c84c1947e9f4fc48431834f606361852c))
* ssl ([13049b6](https://github.com/LuisSubiabre/hero-estudiante/commit/13049b6329d9ffdef5fe92b38c6909b1b3318a49))
* ssl vercel ([291120b](https://github.com/LuisSubiabre/hero-estudiante/commit/291120b8407d1e2982008c9747afdb4ad93deb12))
* ssl vercel ([5b257cb](https://github.com/LuisSubiabre/hero-estudiante/commit/5b257cbc4001bdd6dce43b4790267cee7b124ede))
* ts erros ([e6bf36d](https://github.com/LuisSubiabre/hero-estudiante/commit/e6bf36db825602e1e59471f85496d6a200a78a51))
