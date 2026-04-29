# Flujo de trabajo con Cursor

## Exploracion de la interfaz

Cursor se puede usar como editor principal para abrir el repositorio TaskFlow y trabajar con IA dentro del propio codigo. Las partes mas utiles para este proyecto son:

- Chat contextual: permite preguntar sobre los archivos abiertos.
- Edicion inline: permite seleccionar una funcion y pedir una mejora concreta.
- Composer: permite pedir cambios que afectan a varios archivos a la vez.

## Ejemplos de uso

### Chat contextual

Pregunta:

```text
Explicame como se conectan renderTasks, getFilteredTasks y saveTasks en este proyecto.
```

Uso:

Sirve para entender el flujo antes de modificarlo.

### Edicion inline

Seleccion:

```text
function getFilteredTasks() { ... }
```

Peticion:

```text
Anade soporte para busqueda por texto y prioridad, sin mutar el array original.
```

Uso:

Sirve para cambios pequenos y muy localizados.

### Composer

Peticion:

```text
Anade una barra de busqueda a index.html, estilos en styles.css y conecta la logica en app.js.
```

Uso:

Sirve cuando una funcionalidad toca varios archivos.

## Atajos utiles

| Accion | Atajo orientativo |
| --- | --- |
| Abrir comandos | `Ctrl + Shift + P` |
| Buscar archivos | `Ctrl + P` |
| Buscar en el proyecto | `Ctrl + Shift + F` |
| Abrir chat de Cursor | `Ctrl + L` |
| Edicion inline | `Ctrl + K` |

## Mejora de productividad

Cursor puede acelerar tareas repetitivas como escribir JSDoc, renombrar funciones y proponer estilos. Aun asi, hay que revisar el resultado con Git diff y probar la app, porque el asistente no siempre conoce todas las decisiones del proyecto.
