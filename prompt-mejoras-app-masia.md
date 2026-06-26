# Prompt de mejoras — App "Lista de la compra Masía"

> Adjunta a este mensaje la imagen del logo de la Masía (el lettering caligráfico) como referencia de estilo para el título.

## Contexto

Ya tengo la app funcionando con el esqueleto, Supabase y la estética de cartel. Ahora quiero una ronda de mejoras concretas sobre lo que ya existe. **No reescribas la app desde cero**: aplica estos cambios sobre el código actual.

---

## 1. Simplificar el login

Ahora mismo el acceso es por magic link. Quiero pasar a **email + contraseña**, sin el paso de confirmación de email por medio (ni redirección a una pantalla de "revisa tu correo").

- Registro e inicio de sesión con email + contraseña, directo, sin pantalla intermedia de "confirma tu email".
- Indícame también si esto requiere que yo desactive manualmente alguna opción en el dashboard de Supabase (la confirmación de email suele estar activada por defecto en Authentication → Settings) y dime exactamente dónde tocarlo.
- **Sesión persistente**: una vez que inicio sesión en mi dispositivo, quiero que se mantenga abierta indefinidamente (no que me pida login otra vez al cerrar el navegador o la PWA). Usa la persistencia de sesión local de Supabase Auth para esto.
- Esta app es de uso personal, así que prioriza simplicidad sobre fricción de seguridad — pero coméntame brevemente cualquier riesgo relevante de este cambio.

## 2. Arreglar el encabezado del cartel

La separación entre "LA COMPRA" y "SEMANAL" no está bien estructurada visualmente — se ve desalineado/improvisado. Rehaz la jerarquía del encabezado para que quede limpio y con composición de cartel real:

- Revisa el tamaño, el interlineado y el centrado de cada línea del título para que la transición entre "LA COMPRA" y "SEMANAL" se vea intencional, no cortada.
- Mantén la lógica actual (texto del evento editable), solo corrige la maquetación.

## 3. Logotipo "MASIÁ" con lettering propio inspirado en el original

Arriba del todo, donde ahora pone "MASIÁ" en una tipografía de palo seco, quiero un **lettering propio** que capture la esencia del logo real de la discoteca (te adjunto la referencia): trazo caligráfico, fluido, conectado entre letras, con esa curva característica.

- **No reproduzcas el logo oficial al pixel** (es una marca registrada) — créalo como una interpretación/homenaje propia: mismo espíritu de trazo manuscrito-conectado, pero letras y curvas generadas de forma original.
- Impléntalo como un SVG/lettering propio (no como imagen del logo original), para que sea reutilizable y editable.
- Debe leerse claramente como "MASIÁ" mantenido el acento.

## 4. Editar y borrar siempre visibles

Quita el menú de los "···" (tres puntos). En su lugar, cada producto debe mostrar **dos iconos pequeños siempre visibles** al lado (lápiz para editar, papelera para borrar), sin necesidad de un toque extra para desplegar un menú.

- Que el tamaño de los iconos sea discreto y no rompa la composición tipo line-up.
- Edición: permite cambiar el nombre y la cantidad directamente.
- Borrado: con una confirmación ligera (no un modal pesado) para evitar borrados accidentales.

## 5. Reducir el tamaño del texto de los productos

El nombre de cada producto ocupa demasiado espacio vertical. Redúcelo (manteniendo legibilidad y la sensación de "line-up") para que:

- Quepan más productos en pantalla sin hacer scroll constante.
- Se mantenga la jerarquía visual (el "headliner"/primer producto puede seguir siendo algo más grande que el resto, pero todos más compactos que ahora).

## 6. Auditoría y optimización general

Antes o después de aplicar los cambios anteriores (lo que te resulte más práctico), haz una **auditoría rápida** de la app actual y dime qué encuentras, cubriendo al menos:

- **Rendimiento**: renders innecesarios, listas largas sin virtualización si hiciera falta, tamaño del bundle.
- **Accesibilidad**: contraste de color (los neón sobre fondo oscuro pueden fallar el contraste mínimo), tamaños de tap-target en móvil, labels en los inputs.
- **PWA/offline**: que el manifest y el service worker sigan funcionando bien tras estos cambios.
- **Seguridad de Supabase**: revisa que las políticas RLS sigan correctas tras el cambio de autenticación.
- **Bugs o inconsistencias** que detectes en el código actual, aunque no te los haya pedido explícitamente.

Dame la lista de hallazgos con una recomendación breve para cada uno, y aplica directamente los que sean rápidos y de bajo riesgo. Para los que impliquen un cambio más grande de arquitectura, solo coméntamelos — no los apliques sin que yo lo confirme.

## 7. Reordenar productos arrastrando

Quiero poder **reordenar los productos arrastrándolos** hacia arriba o abajo en la lista (drag and drop), en vez de depender solo del orden de creación.

- Debe funcionar bien tanto en **móvil** (arrastre táctil) como en **escritorio** (con ratón).
- Usa una librería ligera y bien mantenida para esto (por ejemplo `@dnd-kit/core`, que es la opción moderna estándar en React) en vez de implementarlo a mano.
- El nuevo orden debe **persistir**: guarda el campo `orden` actualizado en Supabase para que el orden se mantenga al recargar o al abrir la app en otro dispositivo.
- Mientras se arrastra, debe haber un feedback visual claro (la fila se eleva/resalta ligeramente) para que se note qué se está moviendo, en línea con la estética del cartel.
- Que convivan bien con los iconos de editar/borrar del punto 4: el "agarre" para arrastrar no debe interferir con el toque sobre esos iconos (por ejemplo, un pequeño icono de "agarradera" (⠿ o similar) a un lado, separado de los botones de editar/borrar).

## 8. Máxima fidelidad visual al cartel real (dentro de lo legal)

Quiero que el cartel se parezca **lo máximo posible** al cartel real de la Masía que te he pasado como referencia — pero con un límite importante: **no podemos usar la tipografía exacta del cartel original ni clonarlo al pixel**, porque esas fuentes de cartel suelen tener licencia comercial y el cartel en sí tiene derechos de autor. Esto es lo que sí puedes (y debes) maximizar:

- **Tipografía:** busca fuentes con **licencia libre o de uso comercial gratuito** (Google Fonts, Fontshare, etc.) que sean visualmente lo más parecidas posible al estilo del cartel (condensadas, bold, agresivas, tipo rave/hardstyle/techno). Si encuentras varias candidatas, elige la que más se acerque y dime cuál usaste y por qué.
- **Composición:** la maquetación, jerarquía, espaciados, líneas decorativas, proporciones entre título/subtítulo/línea de fecha — esto sí puedes replicarlo **al milímetro** del cartel de referencia, porque la estructura/layout no es lo protegido.
- **Paleta de colores:** usa los colores exactos del cartel real (puedes extraerlos de la imagen de referencia).
- **No reproduzcas** el logo oficial literal ni ningún texto/elementos gráficos protegidos tal cual — todo lo demás (layout, color, tipografía equivalente) sí al máximo nivel de fidelidad.

---

## Orden sugerido de trabajo

1. Login + sesión persistente (probarlo a fondo antes de seguir, es lo más sensible).
2. Encabezado + logo lettering.
3. Iconos editar/borrar + tamaño de texto.
4. Reordenar arrastrando.
5. Máxima fidelidad visual (tipografía libre equivalente + composición exacta).
6. Auditoría final, aplicando lo de bajo riesgo y reportando el resto.

Ve aplicando los cambios en este orden y avísame tras cada bloque para que lo revise antes de seguir con el siguiente.
