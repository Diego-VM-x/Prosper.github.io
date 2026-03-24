# 🚀 Guía de Historial de Commits - Proyecto Prosper

Esta guía documenta los hitos de desarrollo y cambios realizados en la aplicación web para un control preciso de versiones.

---

## 🏗️ Historial de Commits Recientes

### `4d28aa2` - perf: optimización total para Android WebView y móviles con notch
*   **Viewport**: Inyectado `viewport-fit=cover` para llenar la pantalla entera (incluyendo notches).
*   **Safe Areas**: Soporte para `env(safe-area-inset-bottom)` en el `styles.css` para evitar solapamientos con la barra de gestos de Android.
*   **Rendimiento**: Forzado de versiones de React en Producción en todas las subpáginas.
*   **Touch UX**: Eliminación del efecto de resaltado azul al tocar botones en pantallas táctiles y mejora del scroll inercial.

### `16e397c` - feat: implementar botones de ayuda interactivos y limpieza de autoría en Acerca de
*   **Aprende/Quiz/Ruta**: Inclusión del componente `SectionHelp` (botón de ayuda desplegable con beneficios).
*   **Aprende/Quiz/Ruta**: Restauración de encabezados premium con títulos modernos.
*   **Acerca de**: Remoción de créditos adicionales para dejar a **Diego Verde** como único autor.
*   **Layout**: Eliminación de `max-w-full` en contenedores `main` para arreglar selector de anchura.

### `32fcc16` - feat: selector de anchura exclusivo en Aprende, Quiz y Mis Retos
*   **index/tools**: Se fijó la anchura a `max-w-6xl` y se eliminó el selector del menú.
*   **aprende/quiz/route**: Se mantuvo el selector de anchura (Pequeño, Mediano, Grande).

### `2f413f1` - fix: aplicar correccion de layout responsive a index, quiz y route
*   Eliminación de clases redundantes que causaban descuadres en la vista de escritorio y móvil.
*   Aseguramiento de consistencia visual en todas las subpáginas.

### `37eaa00` - fix: corregir layout de filtros en seccion Aprende en vista PC
*   Ajuste del grid de categorías para evitar desbordamientos en resoluciones intermedias.

### `009e125` - fix: corregir desplazamiento lateral en seccion Aprende (mobile)
*   Primera corrección importante de desbordamiento horizontal (`overflow-x`) en dispositivos móviles.

---

## 💡 Cómo leer esta guía
- Cada commit representa un bloque de trabajo terminado y funcional.
- Si necesitas volver a un estado anterior: `git checkout [id_commit]`.
