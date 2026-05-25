# Hash Checker

Herramienta web para verificar la integridad de archivos calculando sus hashes (huellas digitales) **localmente en el navegador**. El archivo nunca sale del dispositivo del usuario.

Parte del portfolio [`tools-cybersecurity`](../CONVENTIONS.md), pensada para periodistas y defensores de derechos humanos que necesitan confirmar que un archivo recibido (instalador, PDF, documento filtrado) coincide con el hash publicado por la fuente original.

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

- Archivos muy grandes (>2 GB aprox.) pueden agotar la memoria del navegador. Para esos, usar herramienta nativa:
  - macOS/Linux: `shasum -a 256 archivo`
  - Windows (PowerShell): `Get-FileHash archivo -Algorithm SHA256`
- MD5 y SHA-1 son criptográficamente rotos. Sirven para detectar errores accidentales de transmisión, **no para detectar manipulación maliciosa**. Para autenticidad usar siempre SHA-256 o SHA-512.

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
hash-checker/
├── index.html      # UI
├── styles.css      # Dark theme
├── app.js          # Lógica principal (i18n, lectura, hashing, comparación)
├── md5.js          # Implementación MD5 puro JS, vendored (public domain)
├── README.md       # Este archivo
└── LICENSE         # MIT
```

## Licencia

MIT — ver [LICENSE](LICENSE).

MD5 implementation derived from Joseph Myers' MD5 (public domain).
