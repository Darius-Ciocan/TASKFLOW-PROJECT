# TaskFlow API

API REST de TaskFlow construida con Node.js, Express, CORS y dotenv.

## Arquitectura

```text
server/
├── src/
│   ├── config/
│   │   └── env.js
│   ├── controllers/
│   │   └── task.controller.js
│   ├── middlewares/
│   │   ├── error.middleware.js
│   │   └── logger.middleware.js
│   ├── routes/
│   │   └── task.routes.js
│   ├── services/
│   │   └── task.service.js
│   └── index.js
├── .env.example
├── package.json
└── package-lock.json
```

## Capas

- `routes`: reciben el verbo HTTP y la URL, y delegan en el controlador.
- `controllers`: validan la frontera de red, extraen `req.params` y `req.body`, llaman al servicio y devuelven respuestas HTTP.
- `services`: contienen la logica de negocio y no conocen Express, `req` ni `res`.
- `middlewares`: gestionan preocupaciones transversales como logging, CORS, JSON y errores.

## Variables de entorno

El servidor usa `dotenv` y valida que exista `PORT` antes de arrancar.

```bash
cp .env.example .env
```

Ejemplo:

```env
PORT=3000
CORS_ORIGIN=*
```

## Scripts

```bash
npm run dev
npm start
npm run check
```

## Endpoints

Base URL:

```text
http://localhost:3000/api/v1
```

### Health check

```http
GET /health
```

Respuesta:

```json
{
  "status": "ok",
  "service": "TaskFlow API"
}
```

### Obtener tareas

```http
GET /tasks
```

### Crear tarea

```http
POST /tasks
Content-Type: application/json

{
  "title": "Estudiar Express",
  "priority": "alta"
}
```

Respuesta esperada: `201 Created`.

### Actualizar tarea

```http
PATCH /tasks/:id
Content-Type: application/json

{
  "completed": true
}
```

Tambien se puede actualizar `title` o `priority`.

### Reordenar tareas

```http
PATCH /tasks/order
Content-Type: application/json

{
  "taskIds": ["id-1", "id-2"]
}
```

### Eliminar tarea

```http
DELETE /tasks/:id
```

Respuesta esperada: `204 No Content`.

## Validaciones

- `title` debe ser texto y tener entre 3 y 80 caracteres.
- `priority` debe ser `alta`, `media` o `baja`.
- `completed` debe ser booleano.
- `taskIds` debe ser un array de strings.

## Manejo de errores

El middleware global de errores convierte:

- `NOT_FOUND` en `404`.
- Errores no controlados en `500` con un mensaje generico.

Esto evita filtrar detalles internos al cliente.

## Pruebas de integracion

Ejemplos equivalentes a una coleccion de Postman o Thunder Client:

```bash
curl http://localhost:3000/api/v1/health
```

```bash
curl -X POST http://localhost:3000/api/v1/tasks ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"Estudiar backend\",\"priority\":\"alta\"}"
```

Error esperado con titulo invalido:

```bash
curl -X POST http://localhost:3000/api/v1/tasks ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"a\",\"priority\":\"alta\"}"
```

Respuesta esperada: `400 Bad Request`.

Error esperado al borrar una tarea inexistente:

```bash
curl -X DELETE http://localhost:3000/api/v1/tasks/no-existe
```

Respuesta esperada: `404 Not Found`.
