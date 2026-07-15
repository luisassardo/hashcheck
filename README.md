# Hash Checker

Herramienta web para verificar la integridad de archivos calculando sus hashes (huellas digitales) **localmente en el navegador**. El archivo nunca sale del dispositivo del usuario.

Parte del portfolio [`tools-cybersecurity`](../CONVENTIONS.md), pensada para periodistas y defensores de derechos humanos que necesitan confirmar que un archivo recibido (instalador, PDF, documento filtrado) coincide con el hash publicado por la fuente original.

## Dos modos

| Modo | Para qué | Entrada → salida |
|---|---|---|
| **Verificar** | Comprobación rápida de un archivo suelto | 1 archivo → 4 hashes + comparación contra un hash esperado |
| **Evidencia** | Intake de material: dejar constancia del estado de un conjunto de archivos | Carpeta → manifiesto con hash por archivo + cadena de custodia, exportable y re-verificable |

El modo Evidencia responde a un momento distinto del de Verificar: no es "¿este instalador coincide con el hash del sitio?", sino "recibí 200 archivos de una fuente y necesito poder demostrar después que no los toqué".

## Por qué

Las herramientas online de verificación de hashes obligan al usuario a confiar en que el servidor no guarda el archivo. Para alguien que recibe un documento sensible de una fuente, eso es un riesgo inaceptable. Esta herramienta:

- Corre **100% en el navegador** (Web Crypto API + un MD5 puro JS vendored).
- **No tiene backend**. No hay subida. No hay telemetría. No hay analytics.
- **Sin CDN externos**: todo el código es estático y auditable.
- **Funciona offline** una vez cargada la página.

## Algoritmos soportados

- SHA-256 (recomendado para verificación de integridad/autenticidad)
- SHA-1 (compatibilidad con publicaciones antiguas — criptográficamente roto)
- SHA-512
- MD5 (compatibilidad con sitios de descarga — criptográficamente roto)

## Modo Evidencia — manifiestos forenses

Flujo: elegir carpeta → rellenar cadena de custodia → **Construir manifiesto** → exportar.

- **Entrada**: carpeta completa (se conserva la ruta relativa, incluidas subcarpetas), selección múltiple de archivos, o arrastrar una carpeta.
- **Cadena de custodia**: ID del caso, responsable, descripción y sello de tiempo UTC. Se guarda dentro del manifiesto.
- **Exportar `.sha256`**: formato SHASUMS estándar, verificable con herramientas nativas sin necesidad de confiar en HashCheck.
- **Exportar JSON**: mismo contenido más tamaño, fecha de modificación y todos los algoritmos calculados.
- **Re-verificar**: cargar un manifiesto anterior, volver a seleccionar la carpeta y reconstruir. Cada archivo se reporta como `SIN CAMBIOS`, `ALTERADO`, `AUSENTE` o `NUEVO`.

Al cargar un manifiesto, la herramienta activa automáticamente los algoritmos que ese manifiesto contiene, para que la comparación tenga contra qué correr.

### Verificar el manifiesto con herramientas nativas

Este es el punto: el manifiesto no depende de HashCheck. Desde la carpeta **padre** de la que hasheaste:

```bash
shasum -a 256 -c manifest-caso-2026-014-....sha256
```

Comportamiento de los comentarios `#` de cabecera (donde vive la cadena de custodia), verificado:

| Verificador | Resultado |
|---|---|
| `shasum` 6.02 (macOS por defecto, Perl) | `OK` limpio, exit 0 |
| GNU coreutils `sha256sum` | Ignora las líneas `#` (comportamiento documentado) |
| `/sbin/sha256sum` (Darwin 1.0) | Verifica bien y sale 0, **pero avisa `WARNING: N lines are improperly formatted`** por los comentarios |

El aviso de Darwin es cosmético: la verificación es correcta. Se prefirió mantener la custodia dentro del `.sha256` porque una lista de hashes huérfana, sin caso ni responsable, es mucho peor para trazabilidad que un warning en una de las tres implementaciones.

### ⚠️ Esto NO es prueba judicial

El manifiesto es una **declaración propia**. Demuestra que los archivos no han cambiado desde que calculaste sus hashes, y nada más:

- ❌ **No tiene sello de tiempo confiable.** La fecha la pone tu reloj; puedes escribir cualquier cosa.
- ❌ **No tiene testigo independiente.** Nadie más que tú atestigua que ese material estaba en ese estado en ese momento.
- ❌ **No prueba el origen.** No dice de dónde salieron los archivos ni quién los entregó.

Sirve como **apoyo de documentación interna**: fija un punto de referencia contra el que detectar cambios posteriores. Para peso probatorio real hace falta un sello de tiempo confiable (RFC 3161 / OpenTimestamps) o un tercero — y eso exigiría una petición de red, lo que rompería la garantía de cero peticiones que define esta herramienta. Se decidió no hacerlo.

## Uso local

No requiere servidor. Basta abrir `index.html` en cualquier navegador moderno:

```bash
open index.html         # macOS
xdg-open index.html     # Linux
```

O servirlo con cualquier servidor estático:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Deploy a Cloudflare Pages

1. Sube el contenido de esta carpeta a un repo de GitHub (público o privado).
2. En Cloudflare Dashboard → Pages → **Create a project** → conecta el repo.
3. Build settings:
   - **Framework preset:** None
   - **Build command:** (vacío)
   - **Build output directory:** `/` (o ruta a esta subcarpeta si está dentro de un monorepo)
4. Deploy. Cloudflare emite un dominio `*.pages.dev`. Puedes apuntar un dominio propio después.

Como es estático puro, también funciona en GitHub Pages, Netlify, Vercel, S3, o cualquier hosting de archivos.

## Cabeceras recomendadas (Cloudflare)

Para máxima privacidad/seguridad del usuario, configurar en Cloudflare Pages → **Headers**:

```
/*
  Referrer-Policy: no-referrer
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'none'; frame-ancestors 'none'
  Permissions-Policy: interest-cohort=()
```

El `connect-src 'none'` es crítico: garantiza que aunque alguien modificara el JS, el navegador rechazaría cualquier intento de subida.

## Auditar la herramienta

Para usuarios escépticos (correctamente):

1. Abrir herramientas de desarrollo del navegador → pestaña **Red**.
2. Recargar la página. Confirmar que solo se descargan los archivos locales (`index.html`, `styles.css`, `app.js`, `md5.js`).
3. Cargar un archivo y calcular hashes. **Ninguna nueva petición de red debería aparecer.**
4. Comparar los hashes obtenidos con otra herramienta (ej. `shasum -a 256 archivo` en macOS/Linux).

## Limitaciones

- **Memoria.** El modo Evidencia hashea **un archivo a la vez** y libera cada búfer antes de leer el siguiente, así que el pico de memoria depende del **archivo más grande**, no del total de la carpeta. Puedes hashear una carpeta de 50 GB sin problema; lo que no puedes es hashear un archivo suelto de 5 GB. `crypto.subtle.digest` es de una sola pasada y los navegadores no tienen SHA en streaming, así que un archivo individual debe caber en memoria (>2 GB aprox. es zona de riesgo). La herramienta avisa cuando la selección contiene archivos grandes. Para esos, usar herramienta nativa:
  - macOS/Linux: `shasum -a 256 archivo`
  - Windows (PowerShell): `Get-FileHash archivo -Algorithm SHA256`
- **Los algoritmos no se calculan en una sola pasada**: se hace una pasada completa por cada algoritmo seleccionado. Marcar los cuatro cuesta ~4× el tiempo de marcar uno. Para un manifiesto grande, SHA-256 solo.
- El hashing corre en el hilo principal (sin Web Workers): con carpetas grandes la pestaña se queda pegada mientras trabaja.
- MD5 y SHA-1 son criptográficamente rotos. Sirven para detectar errores accidentales de transmisión, **no para detectar manipulación maliciosa**. Para autenticidad usar siempre SHA-256 o SHA-512.
- El manifiesto no es prueba judicial — ver arriba.

## Threat model

Esta herramienta protege contra:
- ✅ Servidor de hashing online que guarde el archivo subido.
- ✅ Logs de servidor que registren qué archivos verifica el usuario.
- ✅ Telemetría/analytics de terceros.

**No protege contra:**
- ❌ Adversario que comprometa el navegador o el dispositivo del usuario (en ese caso ya pueden leer el archivo directamente — la herramienta no agrega riesgo, pero tampoco mitiga).
- ❌ Fuente comprometida (si el hash "oficial" fue alterado por el atacante, esta herramienta confirmará que el archivo coincide con un hash malicioso).

Para verificar autenticidad: obtener el hash de un canal independiente del archivo (ej. el archivo se descarga de un sitio, pero el hash se publica en un perfil de Twitter/Mastodon firmado, o un repositorio Git firmado).

## Estructura

```
hash-check/
├── index.html      # UI (modo Verificar + modo Evidencia)
├── styles.css      # Estilos propios sobre node.css
├── app.js          # Lógica principal (i18n, lectura, hashing, comparación, manifiestos)
├── md5.js          # Implementación MD5 puro JS, vendored (public domain)
├── node.css        # ARGUS design system (vendored)
├── node.js         # ARGUS motion engine (vendored)
├── icons.js        # ARGUS icon registry (vendored)
├── _headers        # Cabeceras Cloudflare Pages (aquí vive el CSP)
├── fonts/          # IBM Plex Mono + Space Grotesk (vendored, sin CDN)
├── README.md       # Este archivo
└── LICENSE         # MIT
```

> El CSP solo se aplica cuando el sitio se sirve desde Cloudflare (viene de `_headers`). Abriendo `index.html` directo desde disco **no hay CSP**: la garantía sigue dependiendo de que el código no hace peticiones, que es auditable a simple vista.

## Licencia

MIT — ver [LICENSE](LICENSE).

MD5 implementation derived from Joseph Myers' MD5 (public domain).
