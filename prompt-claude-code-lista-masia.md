# Prompt para Claude Code — App "Lista de la compra estilo Masía"

> **Cómo usar este prompt:** cópialo entero en Claude Code y, en el mismo mensaje, **adjunta el cartel oficial de una fiesta de la Masía y las fotos de referencia** (arrástralos a la conversación). Esas imágenes son la guía visual principal; sin ellas el diseño saldrá más genérico.

---

## Contexto

Quiero que construyas una aplicación de **lista de la compra personal**, pero con la estética de un **cartel de fiesta de la discoteca Masía** (Segorbe, Castellón): el templo del **newstyle** y el **hardcore** en España, nacida en 1991 y actualmente de 35 aniversario (temática "UTOPIA"). Sus carteles tienen un sello muy reconocible: tipografías enormes estilo rave/graffiti, neón sobre fondo oscuro, line-up de DJs y mucha energía.

La gracia de la app: **mi lista de la compra se ve y se siente como el line-up de una fiesta de la Masía**. Cada producto que añado aparece como si fuera un DJ en el cartel.

### Investigación previa (haz esto antes de diseñar nada)

Antes de proponer estructura o tocar código, investiga la identidad visual real de la Masía:

- Su **Instagram** y **Facebook** oficiales (busca "Masia Discoteca Oficial" / "@discotecamasia"): cómo anuncian sus fiestas, qué carteles publican, qué paleta y tipografías usan en redes.
- Sus **carteles de eventos** históricos y recientes (line-ups con salas, headliners, horarios).
- Su **merchandising** (camisetas, sudaderas, pulseras de evento) si encuentras referencias, porque ahí suele estar la versión más "depurada" del logo y la paleta.
- La estética **newstyle/hardcore** en general (no solo Masía): qué elementos gráficos se repiten en este tipo de flyers (pitos, chándal, parkineo, colores flúor, efectos de impacto).

El objetivo es identificar **qué hace que alguien reconozca un cartel como "de la Masía" en un segundo** (tipografía, color, composición, iconografía) y trasladar solo esos elementos positivos a la app — sin copiar el logo oficial literal.

## Qué hace la app (alcance — mantenlo sencillo)

**No debe parecer una app de supermercado ni una app corporativa de productividad.** Si en algún momento dudas entre una solución "limpia y funcional" típica de SaaS y una más "cartel rave", elige siempre la segunda — la funcionalidad de fondo puede ser simple, pero la piel tiene que gritar fiesta.

- **Una única lista** de la compra (un solo "line-up"). Nada de categorías ni salas.
- Añadir productos rápido (en un toque).
- Marcar como comprado → el "DJ ya ha pinchado": efecto tachado/atenuado con sello tipo **"SOLD OUT"**.
- Editar y borrar (deslizar para borrar en móvil).
- Cantidad opcional por producto (badge tipo `x2`).
- Los comprados bajan automáticamente al final de la lista.
- Contador de productos pendientes.
- Acciones: "vaciar comprados" y "vaciar todo" (con confirmación).

## Plataforma y stack

- **App web responsive** que funcione perfecto tanto en **móvil** como en **escritorio**, e **instalable como PWA** (añadir a pantalla de inicio, icono propio, splash screen, funcionamiento offline básico).
- Stack sugerido: **React + Vite + TypeScript + Tailwind CSS**, con el cliente `@supabase/supabase-js`.
- Despliegue fácil (Vercel o Netlify). Incluye las instrucciones.

## Sincronización entre dispositivos (importante)

La lista es **solo mía**, pero la uso en **varios dispositivos**, así que debe sincronizarse.

- Usa **Supabase** (Postgres + Auth).
- Autenticación sencilla por **magic link** (email): así solo yo veo mi lista y se sincroniza en todos mis dispositivos al iniciar sesión.
- Modelo de datos mínimo — tabla `items`:
  - `id` (uuid), `user_id` (uuid), `nombre` (text), `cantidad` (int, default 1), `comprado` (bool, default false), `orden` (int o float para reordenar), `created_at` (timestamptz).
  - **RLS activado**: cada usuario solo puede ver/editar sus propios items.
- **Updates optimistas** en la interfaz. Si es sencillo, añade **Supabase Realtime** para que los cambios se vean al instante entre dispositivos; si no, refresca al abrir/enfocar la app.
- Que funcione **offline** (cache de PWA) y sincronice al recuperar conexión.

## Estética / diseño (lo más importante visualmente)

**Usa el cartel de la Masía y las fotos adjuntas como guía visual principal** para colores, tipografía, composición y "vibe". Replica la sensación de cartel rave de verdad, no un diseño plano genérico.

Claves del estilo Masía a respetar:

- Fondo **oscuro/negro** con **colores neón** (verde ácido, magenta, cian, amarillo) y degradados intensos.
- **Tipografías enormes, bold y condensadas**, estilo graffiti/rave/techno. El título principal manda en la composición.
- Cabecera tipo cartel: nombre del "evento" **editable** (por defecto algo como `LA COMPRA SEMANAL`), fecha y una línea tipo "presents".
- Cada producto = una **línea del line-up** con tipografía potente. El primero (o uno destacado) puede ir como **headliner**, más grande.
- Producto comprado = efecto **"SOLD OUT"** / tachado / atenuado, como un DJ que ya ha pinchado.
- Detalles: destellos, focos/láser sutiles, textura grunge, y si encaja una silueta de la "caseta"/masía. **Inspírate en la marca, pero crea un logo/identidad propios** (no copies el logo oficial literal).
- **Microinteracciones satisfactorias** al añadir y al marcar (animación breve y, en móvil, vibración).
- Textos de la interfaz en **español**, con guiños masieros sin pasarse: "añade al cartel", "line-up de la compra", "sold out", etc.

## Inspiración funcional

Coge lo mejor de las apps de lista de la compra que funcionan bien (Bring!, Google Keep, AnyList): añadir en un toque, feedback satisfactorio al marcar, deslizar para borrar, los comprados al final, persistencia fiable. Pero **toda la "piel" es el cartel de la Masía**.

## Criterios de aceptación

- Funciona bien en móvil y escritorio, e instalable como PWA.
- Puedo añadir, marcar, editar, borrar y reordenar productos.
- Mi lista **se sincroniza** entre mis dispositivos tras iniciar sesión.
- La pantalla principal **parece de verdad un cartel de fiesta de la Masía**.
- Código limpio, comentado en español, con README de instalación y despliegue.

## Entrega

1. Propón primero la **estructura del proyecto** y confirma el stack.
2. **Esquema SQL** de Supabase + políticas RLS.
3. **Código completo** de la app.
4. **README**: cómo configurar el proyecto de Supabase, variables de entorno (`.env`), correr en local y desplegar en Vercel/Netlify.

Empieza proponiéndome la estructura y el plan; cuando lo valide, genera el código.
