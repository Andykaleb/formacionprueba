# Formación BDO · ExpoCredit

Sitio estático e interactivo para formar a los BDOs en cómo preparar un expediente de crédito completo y acelerar el onboarding.

**Fuentes:** Checklist Crédito (Guía para BDOs), Temas Clave para Agilizar el Onboarding de Nuevos Negocios y TOP situaciones que retrasan el Onboarding.

## Contenido
- 10 pantallas: inicio + 8 módulos de contenido + evaluación.
- Actividades: viaje del expediente, selector de país, constructor de KYC operativo, semáforo de viabilidad, comparador por segmento, armar el expediente (arrastrar), encuentra el error, quiz (aprueba con 80%), flashcards y certificado descargable (PNG).
- Progreso guardado en el navegador (localStorage). Modo oscuro/claro. Responsive.
- Los elementos marcados **“sugerido”** son propuestas que no vienen en los documentos (ejemplos de “Los grandes NO”, casos de práctica, solución a “Cuello de botella para el primer fondeo”, ejemplos de KYC, nota de dilución).

## Estructura
```
index.html      contenido de los módulos
css/styles.css  estilos
js/data.js      datos (preguntas, casos, checklist, etc.)
js/app.js       interactividad
```
Para editar textos de práctica, quiz o checklist, modifica `js/data.js`.

## Publicar en GitHub Pages
1. Crea un repositorio y sube todos los archivos de esta carpeta a la raíz.
2. En **Settings → Pages**, elige *Deploy from a branch*, rama `main`, carpeta `/ (root)`.
3. La página quedará en `https://<usuario>.github.io/<repositorio>/`.

También funciona abriendo `index.html` directamente en el navegador.
