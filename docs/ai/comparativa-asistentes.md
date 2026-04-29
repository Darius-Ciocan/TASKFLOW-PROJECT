# Comparativa de asistentes de IA

## Herramientas comparadas

| Herramienta | Uso principal | Puntos fuertes | Limites detectados |
| --- | --- | --- | --- |
| ChatGPT | Explicaciones, refactorizacion, ideas de funcionalidades y documentacion | Responde de forma clara, propone estructura y ayuda a convertir requisitos en pasos concretos | Hay que revisar el codigo generado y pedir cambios especificos para ajustar el estilo |
| Claude | Explicacion de conceptos y revision de texto/codigo | Muy bueno razonando y explicando decisiones | Puede ser mas conservador y necesita contexto suficiente del proyecto |
| Cursor | Trabajo dentro del editor con contexto de archivos | Chat contextual, edicion inline y cambios en varios archivos con Composer | Si el prompt es ambiguo puede tocar mas archivos de los necesarios |
| GitHub Copilot | Autocompletado y sugerencias rapidas en el editor | Acelera funciones pequenas y patrones repetidos | No sustituye la revision; puede inventar APIs o repetir errores |

## Pruebas realizadas

### Explicar conceptos tecnicos

Prompt usado:

```text
Explicame como funciona LocalStorage en una app de tareas y que riesgos tiene guardar datos ahi.
```

Conclusion:

La IA ayuda a entender rapidamente que LocalStorage guarda pares clave-valor en el navegador, pero tambien que no sirve para datos sensibles y que el usuario puede borrar los datos desde el navegador.

### Detectar errores en codigo con fallos conocidos

Prompt usado:

```text
Revisa esta funcion de renderizado de tareas y dime posibles errores de estado, accesibilidad o persistencia.
```

Conclusiones:

- Conviene validar que los datos cargados desde LocalStorage sean un array.
- Es mejor separar funciones de renderizado, filtros y persistencia.
- Hay que actualizar tambien atributos `aria` cuando cambia el estado visual.

### Generar funciones desde lenguaje natural

Prompt usado:

```text
Genera una funcion JavaScript que filtre tareas por texto, estado y prioridad sin modificar el array original.
```

Conclusion:

La IA da una primera version util, pero la version final debe adaptarse a los nombres reales del proyecto y al estilo ya existente.

## Conclusiones generales

La IA es mas util cuando se usa como companera de desarrollo y no como sustituto de la revision. La mejor combinacion fue:

1. Pedir una idea o funcion inicial.
2. Adaptarla al codigo real.
3. Probarla.
4. Documentar por que se acepto o modifico la solucion.
