# Refactorizacion y servidores MCP

## Refactorizacion aplicada

En TaskFlow se han mejorado funciones existentes para que sean mas claras:

- Separacion entre crear tareas, guardar, cargar, filtrar, renderizar y estadisticas.
- Validacion del texto de la tarea antes de crear o editar.
- JSDoc corto en funciones clave.
- Busqueda por texto combinada con filtros.
- Edicion de tareas existentes con persistencia en LocalStorage.

## Servidores MCP

MCP significa Model Context Protocol. Sirve para conectar un asistente de IA con herramientas externas de forma controlada, por ejemplo:

- Sistema de archivos.
- GitHub.
- Bases de datos.
- Navegador.
- Documentacion.

## Uso en este proyecto

Para este proyecto se ha usado un flujo parecido a MCP porque el asistente ha podido:

- Leer archivos del repositorio.
- Editar archivos locales.
- Ejecutar comprobaciones como `node --check app.js`.
- Consultar y usar Git/GitHub para commits y push.

## Ejemplos de consultas contextuales

```text
Busca donde se renderizan las tareas y dime que cambios necesito para anadir busqueda.
```

```text
Revisa el estado de Git, crea un commit con las mejoras y subelo al repositorio.
```

```text
Comprueba si el JavaScript tiene errores de sintaxis antes de hacer push.
```

## Riesgo a controlar

Dar acceso contextual es potente, pero tambien implica revisar los cambios antes de confirmarlos. La regla que he seguido es: primero entender, luego editar, despues probar y por ultimo subir.
