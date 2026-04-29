# Prompts utilizados

## Prompt 1: explicar LocalStorage

```text
Actua como profesor de JavaScript. Explicame LocalStorage aplicado a una app de tareas, con ventajas, limites y un ejemplo sencillo.
```

Resultado esperado:

- Entender la persistencia local.
- Saber cuando usar `JSON.stringify` y `JSON.parse`.
- Identificar riesgos de guardar datos sensibles.

## Prompt 2: revisar accesibilidad

```text
Revisa esta interfaz HTML de una app de tareas. Dime si los labels, botones, aria-live y aria-label son suficientes para teclado y lectores de pantalla.
```

Resultado esperado:

- Mejorar etiquetas.
- Confirmar que los botones tengan texto o `aria-label`.
- Usar `aria-live` para cambios de tareas visibles.

## Prompt 3: generar busqueda

```text
Quiero ampliar TaskFlow con una busqueda por texto. La busqueda debe combinarse con filtros de estado y no debe borrar tareas.
Devuelveme una propuesta en JavaScript separando estado, filtrado y renderizado.
```

Resultado esperado:

- Funcion de filtrado sin mutar el array.
- Campo de busqueda en HTML.
- Actualizacion del contador de tareas visibles.

## Prompt 4: edicion de tareas

```text
Anade edicion inline a una lista de tareas existente. El usuario debe poder pulsar Editar, cambiar el texto con prompt o input, validar que no este vacio y guardar en LocalStorage.
```

Resultado esperado:

- Boton Editar por tarea.
- Validacion de texto.
- Persistencia despues de editar.

## Prompt 5: refactorizar con JSDoc

```text
Refactoriza estas funciones de TaskFlow y anade JSDoc corto. Mantén nombres claros, evita sobreingenieria y no cambies el comportamiento existente.
```

Resultado esperado:

- Documentacion encima de funciones importantes.
- Validacion de datos cargados.
- Codigo mas facil de leer.

## Prompt mejorado con rol y restricciones

```text
Actua como desarrollador frontend junior documentando su proceso. Estoy trabajando en TaskFlow, una app de tareas con HTML, CSS y JavaScript.
Quiero anadir busqueda y edicion de tareas, pero conserva el estilo actual del proyecto, comenta solo lo necesario y guarda todo en LocalStorage.
Explica brevemente los cambios y dame codigo separado por archivo.
```

Por que es mejor:

- Da contexto del proyecto.
- Define rol y tono.
- Limita el alcance.
- Pide salida por archivo, mas facil de aplicar.
