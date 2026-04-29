# Herramientas de backend y APIs

## Axios

Axios es un cliente HTTP basado en promesas que funciona en navegador y Node.js. Se usa para hacer peticiones a APIs con una sintaxis mas comoda que `fetch`, incluyendo interceptores, transformacion de datos, cancelacion de peticiones, timeouts y manejo automatico de JSON.

En TaskFlow se ha usado `fetch` nativo para evitar una dependencia extra en el frontend, pero Axios seria una alternativa valida si la app creciera.

Fuente: [Axios Docs](https://axios-http.com/docs/intro)

## Postman

Postman es una plataforma para construir, probar, documentar y monitorizar APIs. En este proyecto encaja para crear una coleccion de pruebas de endpoints, guardar ejemplos de peticiones y comprobar casos correctos y errores intencionados.

Ejemplos de pruebas en TaskFlow:

- `GET /api/v1/tasks`
- `POST /api/v1/tasks` con datos correctos.
- `POST /api/v1/tasks` sin titulo.
- `DELETE /api/v1/tasks/:id` con un ID inexistente.

Fuente: [Postman API Platform](https://www.postman.com/product/what-is-postman/)

## Sentry

Sentry es una plataforma de monitorizacion de errores y rendimiento. Captura excepciones, stack traces, contexto del usuario, breadcrumbs y datos de entorno. Se usa en produccion para detectar fallos reales que los usuarios encuentran y priorizar su resolucion.

En TaskFlow podria usarse para registrar errores del frontend cuando falla la API o para capturar errores no controlados del backend Express.

Fuente: [Sentry Documentation](https://sentrydocs.dev/)

## Swagger y OpenAPI

OpenAPI es un formato para describir APIs REST: endpoints, metodos, parametros, respuestas, autenticacion y metadatos. Swagger es el conjunto de herramientas alrededor de OpenAPI, como Swagger UI, que permite explorar y probar endpoints desde una interfaz web.

En TaskFlow podria anadirse un archivo `openapi.yaml` para documentar formalmente la API y generar una interfaz interactiva de pruebas.

Fuente: [Swagger Docs - What Is OpenAPI?](https://swagger.io/docs/specification/v3_0/about/)
