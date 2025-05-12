<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/5859849e-c6ba-4a7e-9ca7-4537bdae6717">
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/user-attachments/assets/da84874f-f806-4172-bfa5-f38cd15ebb46">
    <img src="https://github.com/user-attachments/assets/da84874f-f806-4172-bfa5-f38cd15ebb46" alt="Vecty logo">
  </picture>
</p>

[![npm version](https://img.shields.io/npm/v/vecty.svg)](https://www.npmjs.com/package/vecty) [![Downloads](https://img.shields.io/npm/dm/vecty.svg)](https://www.npmjs.com/package/vecty) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> 📦 A library to render SVG templates with dynamic data, custom fonts and images.

---

## Table of Contents

- [Why Vecty?](#why-vecty)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage Examples](#usage-examples)
  - [1. Simple Rendering](#1-simple-rendering)
  - [2. Variables of Any Shape](#2-variables-of-any-shape)
  - [3. Defining System Variables](#3-defining-system-variables)
  - [4. Custom Fonts](#4-custom-fonts)
  - [6. Text to Shapes](#6-text-to-shapes)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Plugin: Tag Replacer](#plugin-tag-replacer)

---

## Why Vecty?

- **Plain SVG input**: Reads any plain SVG text. Use `.svg` files or `.jsx`-styled files for IDE highlighting without requiring full JSX support.
- **Dynamic data**: Inject colors, text, arrays, images, or any JavaScript value into your SVG.
- **Custom fonts**: Embed fonts by passing ArrayBuffers (loaded however you prefer). Vecty uses opentype.js internally—no extra imports needed.
- **Text to Shapes**: convert `<text>` elements into vector `<path>` shapes for precise layout and styling.

---

## Installation

```bash
# npm
npm install vecty
# yarn
yarn add vecty
# pnpm
pnpm add vecty
# bun
bun add vecty
```

### CDN

```plain
https://cdn.jsdelivr.net/npm/vecty/+esm
```

---

## Quick Start

```ts
import Vecty, { fetchBase64 } from 'vecty';
import { readFile } from 'node:fs/promises';

// 1. Load an SVG template (plain SVG text)
const template = await readFile('./template.svg', 'utf8');

// 2. Fetch an image as Base64
const imageData = await fetchBase64('https://example.com/photo.jpg');

// 3. Render with user variables
const vecty = new Vecty(template, {
  variables: {
    greeting: 'Hello World!',
    image: imageData
  }
});

console.log(vecty.svg); // Final SVG markup
```

---

## Usage Examples

### 1. Simple Rendering

Inject a single variable:

```jsx
<!-- template.svg -->
<svg width="200" height="200">
  <text x="10" y="20">{user.greeting}</text>
</svg>
```

```ts
const tpl = await readFile('./template.svg', 'utf8');
const v = new Vecty(tpl, {
  variables: { greeting: '¡Hola desde Vecty!' }
});
console.log(v.svg);
```

### 2. Variables of Any Shape

Pass nested objects, arrays, even functions:

```ts
const data = {
  user: { name: 'Alice', age: 30 },
  items: ['A', 'B', 'C'],
  showBadge: true
};

const tpl = `
<svg>
  <text>{user.name}</text>
  {user.items.map(i => `<circle cx="${i.charCodeAt(0)*5}" cy="50" r="5"/>`).join('')}
  {user.showBadge && '<rect x="0" y="0" width="20" height="20" fill="red"/>'}
</svg>
`;

const v = new Vecty(tpl, { variables: data });
console.log(v.svg);
```

### 3. Defining System Variables

To provide default palettes, typography scales or other shared values, embed them directly in your template using `<vecty:variables>`:

```jsx
<vecty:variables content={{
  colors: { primary: { 600: '#E7284B', 800: '#650B1C' } },
  typography: { baseSize: 16 }
}} />

<svg>
  <rect fill="{system.colors.primary[600]}" width="100" height="100"/>
  <text font-size="{system.typography.baseSize}">Hello</text>
</svg>
```

Any `system.*` values defined here become available in the template.

### 4. Custom Fonts

Load your font file as an ArrayBuffer (e.g., via `fetch` or `fs.readFile`), then pass it:

```ts
const fontBuffer = await fetch('https://.../Montserrat-Regular.ttf').then(r => r.arrayBuffer());

const v = new Vecty(tpl, {
  variables: { /* ... */ },
  fonts: [
    { name: 'Montserrat', weight: 400, src: fontBuffer }
  ]
});
```

In your SVG:

```xml
<text font-family="Montserrat" font-weight="400">Text with Montserrat</text>
```

### 6. Text to Shapes

Convert `<text>` elements into SVG `<path>` shapes, preserving font metrics, kerning, and advanced layout options:

```xml
<svg width="200" height="50">
  <text vecty:expand font-family="Montserrat" font-weight="400" font-size="40" letter-spacing="1" vecty:box="0 0 200 50">
    Hello World
  </text>
</svg>
```

```ts
const tpl = await readFile('./template.svg', 'utf8');
const fontBuffer = await fetch('https://.../Montserrat-Regular.ttf').then(r => r.arrayBuffer());
const v = new Vecty(tpl, {
  variables: {},
  fonts: [{ name: 'Montserrat', weight: 400, src: fontBuffer }]
});
console.log(v.svg); // now contains <path> elements instead of <text>
```

---

## API Reference

### `new Vecty(template: string, options?: Options)`

- `template`: plain SVG text (string)
- `options`:
  - `variables?: Record<string, any>` — any data to inject (`user` scope).
  - `fonts?: Array<{ name: string; weight: number; src: ArrayBuffer }>` — embed fonts.

**Instance properties**:

| Property   | Type     | Description                        |
| ---------- | -------- | ---------------------------------- |
| `svg`      | `string` | Final SVG markup                   |
| `metadata` | `object` | Parsed `<vecty:metadata>` content. |

### `fetchBase64(url: string): Promise<string>`

Fetches a resource and returns a Base64 data URI.

---

## Testing

We use Vitest. Example in `vecty.test.ts`:

```ts
import { test, expect } from 'vitest';
import Vecty, { fetchBase64 } from 'vecty';
import { readFile } from 'node:fs/promises';

test('renders SVG from template', async () => {
  const tpl = await readFile('./square.jsx', 'utf8');
  const img = await fetchBase64('https://.../img.avif');
  const v = new Vecty(tpl, { variables: { imgs: { property: [img] } } });
  expect(v.svg.startsWith('<svg')).toBe(true);
});
```

Run:

```bash
npm run test
```

## Plugin: Tag Replacer

Este plugin permite reemplazar etiquetas específicas y su contenido con una etiqueta de advertencia (`<warn>`) que contiene un mensaje personalizado.

### Uso

```typescript
import Vecty from 'vecty'
import replaceTag from 'vecty/plugins/tag-replacer'

// Configuración de las etiquetas a reemplazar
const tagReplacements = [
  { tag: 'sound', msg: 'No se permite sonido en XML' },
  { tag: 'animation', msg: 'Solo se permiten archivos estáticos' }
];

// Crear instancia de Vecty con el plugin
const vecty = new Vecty(xmlContent, {
  plugins: [
    replaceTag(tagReplacements)
  ]
});

// Obtener el resultado procesado
const result = vecty.source;
```

### Ejemplo

Para un XML de entrada como:

```xml
<root>
  <title>Documento de ejemplo</title>
  <content>
    <sound volume="high">Este es un sonido</sound>
    <animation type="gif">Esta es una animación</animation>
  </content>
</root>
```

El resultado será:

```xml
<root>
  <title>Documento de ejemplo</title>
  <content>
    <warn>No se permite sonido en XML</warn>
    <warn>Solo se permiten archivos estáticos</warn>
  </content>
</root>
```

Cada etiqueta especificada en la configuración será reemplazada por una etiqueta `<warn>` con el mensaje correspondiente, eliminando todos los atributos originales.