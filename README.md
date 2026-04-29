# TaskFlow

TaskFlow es una aplicación web de tareas construida con HTML semántico, Tailwind CSS, CSS personalizado y JavaScript. Permite crear, completar, eliminar y filtrar tareas, con persistencia automática en LocalStorage y diseño responsive para móvil y escritorio.

## Funcionalidades

- Crear tareas con identificadores únicos.
- Marcar tareas como completadas o pendientes.
- Eliminar tareas individuales.
- Filtrar por todas, pendientes y completadas.
- Guardar y cargar datos desde LocalStorage.
- Ver estadísticas en tiempo real: total, pendientes, completadas y progreso.
- Interfaz responsive con estados hover, focus y soporte de teclado.
- Prioridades visuales: baja, media y alta.
- Reordenar tareas con drag and drop.
- Diseño visual mejorado con efectos suaves, colores y partículas decorativas.
- Botón para cambiar entre modo claro y modo oscuro.

## Estructura del proyecto

```text
taskflow/
├── index.html
├── styles.css
├── app.js
└── README.md
```

## Tecnologías

- HTML5 semántico.
- Tailwind CSS mediante CDN.
- CSS personalizado con variables.
- JavaScript moderno.
- LocalStorage.

## Uso local

Abre `index.html` en el navegador o usa un servidor local estático.

```bash
npx serve .
```

## Flujo Git sugerido

```bash
git init
git add .
git commit -m "Crear app TaskFlow"
git branch -M main
git remote add origin <url-del-repositorio>
git push -u origin main
```

Para practicar ramas:

```bash
git checkout -b feature/filtros
git add .
git commit -m "Añadir filtros de tareas"
git checkout main
git merge feature/filtros
```

## Despliegue en Vercel

1. Crea un repositorio privado en GitHub.
2. Sube este proyecto al repositorio.
3. Entra en Vercel y selecciona "Add New Project".
4. Importa el repositorio de GitHub.
5. Mantén la configuración por defecto para proyecto estático.
6. Pulsa "Deploy".

## Autor

Proyecto educativo creado para practicar estructura HTML, diseño responsive, lógica JavaScript, persistencia local y flujo básico con Git/GitHub.
