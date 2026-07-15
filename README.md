# ESTELA

Asistente de estilo con IA: arma outfits con la ropa que ya tienes, según tu **silueta** y tu **paleta de color** (Style DNA), y te explica el *porqué* de cada look.

Prototipo navegable construido con **React + Vite**. Los "escaneos" y el auto‑etiquetado de prendas están **simulados** (sin llamadas reales a un modelo todavía).

## Requisitos
- Node.js 18 o superior

## Cómo ejecutar
```bash
npm install      # instala dependencias
npm run dev      # entorno de desarrollo (http://localhost:5173)
npm run build    # build de producción → carpeta dist/
npm run preview  # sirve el build de producción localmente
```

## Estructura
```
estela-vite/
├── index.html          # HTML raíz (monta /src/main.jsx)
├── vite.config.js      # config de Vite (base: './')
├── package.json
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx        # punto de entrada React
    ├── App.jsx         # la app ESTELA (componente principal)
    ├── index.css       # reset global
    └── assets/
        └── estela-logo.svg
```

## Publicar en GitHub Pages
1. `npm run build` genera `dist/`.
2. Sube el contenido de `dist/` a la rama `gh-pages` (o usa una acción de despliegue).
3. Como `base` es `'./'`, funciona tanto en la raíz como en un subdirectorio de proyecto.

> Tip: para desplegar fácil puedes usar `npm i -D gh-pages` y añadir
> `"deploy": "gh-pages -d dist"` a los scripts.

## Notas
- Las tipografías (Playfair Display, Space Mono) se cargan desde Google Fonts; si no hay red, cae a fuentes del sistema.
- Navegación completa: onboarding (toca 5 veces la zona de subir fotos para desbloquear el Style DNA), Home, Armario, Añadir prenda, Agenda y Perfil.
