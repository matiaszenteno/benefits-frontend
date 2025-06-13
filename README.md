# BeneficiosPlus

Una aplicación web moderna para descubrir y gestionar beneficios exclusivos para usuarios.

## Características

- Interfaz de usuario moderna y atractiva con diseño responsive
- Búsqueda de beneficios por texto y con IA
- Filtrado por categoría, ubicación, afiliación y días válidos
- Vista detallada de cada beneficio
- Animaciones y transiciones suaves

## Tecnologías utilizadas

- React 18
- TypeScript
- Vite
- Tailwind CSS v3
- React Router
- React Query
- Radix UI

## Instalación

1. Clona este repositorio
2. Instala las dependencias:

```bash
npm install
```

3. Inicia el servidor de desarrollo:

```bash
npm run dev
```

## Despliegue en GitHub Pages

Para desplegar la aplicación en GitHub Pages:

1. Ejecuta el comando de despliegue:

```bash
npm run deploy
```

2. Sube los cambios a tu repositorio de GitHub
3. Ve a la configuración de tu repositorio en GitHub
4. En la sección "Pages", selecciona "Deploy from a branch"
5. Selecciona la rama `main` y la carpeta `/docs`
6. Guarda los cambios

Tu aplicación estará disponible en:
```
https://[tu-usuario].github.io/[nombre-del-repositorio]/
```

Por ejemplo, si tu usuario es `johndoe` y el repositorio se llama `beneficios-app`, la URL será:
```
https://johndoe.github.io/beneficios-app/
```

## Estructura del proyecto

- `src/components`: Componentes reutilizables de la aplicación
- `src/components/ui`: Componentes UI básicos (Button, Card, Dialog, etc.)
- `src/pages`: Páginas principales de la aplicación
- `src/hooks`: Custom hooks para la lógica de la aplicación
- `src/services`: Servicios para comunicación con APIs
- `src/types`: Definiciones de tipos de TypeScript
- `src/lib`: Utilidades y funciones auxiliares
- `docs/`: Archivos generados para GitHub Pages

## Licencia

MIT 