# Market Dev React

Proyecto de tienda con integración a Fake Store API y fallback local.

## Estructura

- `index.html`: punto de entrada de Vite para desarrollo.
- `vite.config.js`: configuración de la app React.
- `package.json`: dependencias y scripts.
- `src/`: código fuente de la aplicación.
  - `main.jsx`: arranque de React.
  - `App.jsx`: componente raíz.
  - `api.js`: lógica de carga de productos y escenarios.
  - `styles.css`: estilos globales.
  - `components/`: componentes UI reutilizables.
- `dist/`: build de producción listo para abrir en el navegador local.

## Uso

1. Instalar dependencias:
   ```bash
   cd market-react
   npm install
   ```

2. Ejecutar en modo desarrollo:
   ```bash
   npm run dev
   ```

3. Generar build de producción:
   ```bash
   npm run build
   ```

4. Abrir la app fuera de VS Code:
   - Abre `Documentos/index.html`
   - Esta página redirige a `market-react/dist/index.html`

## Notas

- El build usa rutas relativas para que funcione al abrir desde el sistema de archivos.
- El root `Documentos/index.html` se creó como lanzador principal.
