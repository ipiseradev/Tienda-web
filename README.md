# Tienda Web — MVP vendible (React + Vite + Tailwind)

Landing / tienda ligera pensada como **MVP vendible**: catálogo, selección por disciplina, carrito y cierre de pedido por **WhatsApp** (sin backend).

## Qué incluye (enfocado a conversión)

- **Fit Finder**: recomendación rápida de talle y guardado local.
- **Catálogo modal**: filtros por disciplina, línea, marca, talle, stock y precio.
- **Carrito con checkout por WhatsApp**: arma el mensaje con items + datos opcionales (zona/pago/entrega).
- **Compra directa por WhatsApp** desde la ficha del producto (SKU/talle/color/precio).
- **Sticky CTA** (mobile + desktop) para “Encontrar mi talle” y “Carrito”.
- UI responsive con Tailwind (cards, secciones, header optimizado para breakpoints intermedios).

## Stack

- React 18 + Vite
- Tailwind CSS
- Sin backend (MVP: cierre por WhatsApp / mail)

## Correr en local

```bash
npm install
npm run dev
```

Build / preview:

```bash
npm run build
npm run preview
```

## Personalización rápida

- Marca, WhatsApp, textos, productos y métricas: `src/data/siteData.js`
- Estilos base (spacing, botones, cards, typography): `src/index.css`
- Paleta y tokens: `tailwind.config.cjs`
- SEO básico: `index.html`
- Assets (favicon/robots/sitemap/imagenes): `public/`

## Cómo se vende (MVP)

1) El usuario elige talle con **Fit Finder** o desde la ficha de producto.  
2) Agrega al carrito o compra directo por **WhatsApp**.  
3) El mensaje incluye el detalle del pedido + datos opcionales para reducir ida y vuelta.

## Estructura del proyecto

- Layout: `src/layout/`
- Secciones: `src/sections/`
- Componentes: `src/components/`
- Data: `src/data/siteData.js`

## Deploy

Funciona bien en Netlify / Vercel. Importá el repo y usá:

- Build: `npm run build`
- Output: `dist`

## Notas

- Revisá `public/sitemap.xml` y `public/robots.txt` para que apunten al dominio final.
- Si querés un checkout 100% web (MercadoPago/Stripe), este MVP ya deja el catálogo + carrito listos para integrar.
