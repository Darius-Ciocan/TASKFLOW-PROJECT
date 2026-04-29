# Ingenieria de prompts y experimentos

## Tecnicas usadas

### Rol

Ejemplo:

```text
Actua como desarrollador frontend revisando una app educativa de tareas.
```

Ayuda a que la respuesta tenga el nivel y enfoque adecuados.

### Restricciones

Ejemplo:

```text
No cambies el stack, usa HTML, CSS y JavaScript, y conserva LocalStorage.
```

Evita que la IA proponga frameworks innecesarios.

### Few-shot prompting

Ejemplo:

```text
Ejemplo de comentario valido:
// Guardo aqui las tareas para recuperarlas al recargar.

Ejemplo de comentario no valido:
// Esta funcion ejecuta la funcion.

Ahora comenta las funciones importantes con el primer estilo.
```

Sirve para mantener un tono parecido en todo el proyecto.

## Problema comparado: con y sin IA

### Sin IA

Para anadir busqueda, habria que:

1. Decidir donde poner el input.
2. Crear el estado de busqueda.
3. Modificar el filtro.
4. Actualizar el contador.
5. Probar LocalStorage y renderizado.

### Con IA

La IA ayuda a convertir esos pasos en una lista concreta y a proponer una primera funcion. El ahorro esta en arrancar mas rapido, aunque la revision final sigue siendo humana.

## Mejora aplicada en TaskFlow

Se ha ampliado TaskFlow con:

- Busqueda de tareas por texto.
- Edicion de tareas existentes.
- JSDoc en funciones clave.
- Validaciones mas claras.

## Conclusion del experimento

La IA fue mas util cuando el prompt incluia contexto, objetivo y restricciones. Los prompts genericos daban respuestas validas, pero menos adaptadas al proyecto.
