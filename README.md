# 🎧 Lista Compra Masiera

**▶️ App en vivo: [lista-compra-masiera.vercel.app](https://lista-compra-masiera.vercel.app)**

Tu lista de la compra… pero con la estética de un **cartel de fiesta de la Discoteca Masía**.
Cada producto que añades aparece como un **DJ en el line-up**; cuando lo compras, queda
sellado con un **SOLD OUT** como un artista que ya ha pinchado.

Inspirada en el flyer **LOCO FESTIVAL**: fondo negro tierra quemada, neón ámbar,
tipografías enormes desgastadas y mucha textura grunge.

> Lista **personal** y **privada** (solo tú la ves), pero **sincronizada entre todos
> tus dispositivos** e **instalable como app** (PWA, funciona offline).

---

## ✨ Qué hace

- **Un único line-up** de la compra (sin categorías ni complicaciones).
- **Añadir productos en un toque**, con cantidad opcional (badge `x2`, `x12`…).
- **Tocar un producto** = marcarlo comprado → sello **SOLD OUT**, tachado y atenuado.
- Los comprados **bajan solos** al final de la lista.
- **Cabeza de cartel**: el primer producto se destaca como headliner 🎧.
- **Reordenar** (subir/bajar, hacer cabeza de cartel) y **deslizar para borrar** en móvil.
- **Editar** nombre y cantidad de cualquier producto.
- **Vaciar sold out** y **vaciar todo** (con confirmación).
- **Titular y fecha editables** (personaliza tu cartel; se guarda en el dispositivo).
- **Microinteracciones**: animaciones al añadir/marcar y **vibración** en móvil.
- **Sincronización en tiempo real** entre dispositivos (Supabase Realtime).
- **Offline**: la PWA cachea la app y sincroniza al recuperar conexión.

---

## 🧱 Stack

- **React 18 + Vite 5 + TypeScript**
- **Tailwind CSS 3** (toda la "piel" del cartel)
- **Supabase** (Postgres + Auth + Realtime) vía `@supabase/supabase-js`
- **vite-plugin-pwa** (instalable + offline)
- Fuentes auto-alojadas con `@fontsource` (**Anton** + **Oswald**) → funcionan offline

---

## 🚀 Puesta en marcha en local

> Necesitas **Node.js 18+** y npm.

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar las variables de entorno
#    (copia el ejemplo y rellena con los datos de tu proyecto Supabase)
cp .env.example .env

# 3. Generar los iconos de la PWA (opcional; ya vienen generados en /public)
npm run icons

# 4. Arrancar en desarrollo
npm run dev
```

Abre **http://localhost:5173**, mete tu email y te llega un **enlace mágico** para entrar.

### Scripts disponibles

| Script | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo (Vite). |
| `npm run build` | Comprueba tipos y genera la build de producción en `dist/`. |
| `npm run preview` | Sirve la build de producción en local. |
| `npm run typecheck` | Solo comprobación de tipos (TypeScript). |
| `npm run icons` | Regenera los iconos PNG de la PWA desde el SVG. |

---

## 🔐 Variables de entorno

Crea un archivo `.env` en la raíz (a partir de `.env.example`):

```bash
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=TU_CLAVE_PUBLICA
```

Las encuentras en **Supabase → Project Settings → API**
(`Project URL` y la clave `anon` / `publishable`).

> Estas dos claves son **públicas** y seguras de usar en el navegador **porque las
> políticas RLS** (incluidas en este proyecto) impiden que nadie vea datos de otro usuario.
> El archivo `.env` **no se sube a git** (está en `.gitignore`).

---

## 🗄️ Base de datos (Supabase)

El proyecto usa una sola tabla, `items`, con **RLS activado** para que cada usuario
solo vea/maneje sus propios productos. El esquema completo está en
[`supabase/schema.sql`](supabase/schema.sql).

Resumen de la tabla:

| Columna | Tipo | Notas |
| --- | --- | --- |
| `id` | `uuid` | PK, `gen_random_uuid()` |
| `user_id` | `uuid` | FK a `auth.users`, `on delete cascade` |
| `nombre` | `text` | 1–120 caracteres |
| `cantidad` | `int` | por defecto `1` (1–999) |
| `comprado` | `bool` | por defecto `false` |
| `orden` | `float` | para reordenar el line-up |
| `created_at` | `timestamptz` | por defecto `now()` |

### Recrear la base de datos desde cero

1. Crea un proyecto nuevo en [supabase.com](https://supabase.com).
2. Ve a **SQL Editor** y ejecuta el contenido de [`supabase/schema.sql`](supabase/schema.sql).
3. En **Authentication → Providers → Email**, deja activado el **Magic Link**.
4. En **Authentication → URL Configuration**, añade la URL donde despliegues
   (y `http://localhost:5173`) a **Redirect URLs**.
5. Copia `Project URL` y la clave pública a tu `.env`.

---

## ☁️ Despliegue

La app es 100% estática (genera `dist/`). Funciona en cualquier hosting de estáticos.

### Vercel

1. Sube el repo a GitHub e impórtalo en [vercel.com](https://vercel.com).
2. Framework preset: **Vite**. Build command: `npm run build`. Output: `dist`.
3. En **Settings → Environment Variables** añade `VITE_SUPABASE_URL` y
   `VITE_SUPABASE_ANON_KEY`.
4. Deploy. Copia la URL final a las **Redirect URLs** de Supabase (paso 4 de arriba).

### Netlify

1. Importa el repo en [netlify.com](https://netlify.com).
2. Build command: `npm run build`. Publish directory: `dist`.
3. Añade las mismas variables de entorno y la URL a las Redirect URLs de Supabase.

> El archivo [`netlify.toml`](netlify.toml) ya incluye el *redirect* de SPA para que
> el enlace mágico y las rutas funcionen.

---

## 📱 Instalar como app (PWA)

- **Android / Chrome**: menú ⋮ → "Añadir a pantalla de inicio".
- **iOS / Safari**: compartir → "Añadir a pantalla de inicio".
- **Escritorio**: icono de instalar en la barra de direcciones.

---

## 🗂️ Estructura del proyecto

```
.
├─ public/                 # favicon, iconos PWA, robots.txt
├─ scripts/
│  └─ generate-icons.mjs   # genera los PNG de la PWA con sharp
├─ supabase/
│  └─ schema.sql           # esquema + RLS + realtime
├─ src/
│  ├─ components/          # UI del cartel (header, line-up, diálogos…)
│  ├─ hooks/               # useItems (datos + realtime), useLocalStorage
│  ├─ lib/                 # cliente de Supabase, utilidades
│  ├─ types.ts             # tipos compartidos
│  ├─ App.tsx              # sesión + enrutado básico
│  ├─ main.tsx             # punto de entrada
│  └─ index.css            # estética "cartel Masía"
├─ index.html
└─ vite.config.ts          # Vite + PWA
```

---

## 🎨 Sobre el diseño

La identidad es **propia** pero inspirada en la Masía: no se usa el logo oficial.
Las claves trasladadas del flyer LOCO FESTIVAL:

- Fondo negro/tierra con **halo ámbar** y **vignette**.
- Titular gigante (**Anton**) con bordes **desgastados** (máscara de ruido).
- Line-up en mayúsculas condensadas (**Oswald**), headliner más grande.
- Etiquetas naranjas en versalitas ("psiquiatras de la compra presentan", "sold out").
- Sello **SOLD OUT** diagonal y textura grunge sutil por todo el cartel.

---

Hecho con cariño raver. **Paciente en observación: tú.** 🎶
