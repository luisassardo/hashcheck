/*
 * Hash Checker — client-side file integrity verification.
 * No network calls. No telemetry. Source is auditable.
 */
(function () {
  'use strict';

  // ---------- i18n ----------
  const STRINGS = {
    es: {
      title: 'HashCheck',
      subtitle: 'Verifica la integridad de archivos sin subirlos a ningún servidor.',
      drop_primary: 'Arrastra un archivo aquí',
      drop_secondary: 'o',
      choose_file: 'Elegir archivo',
      drop_note: 'El archivo se procesa íntegramente en tu navegador. No sale de tu dispositivo.',
      file: 'Archivo:',
      size: 'Tamaño:',
      modified: 'Modificado:',
      algorithms: 'Algoritmos',
      compute: 'Calcular hashes',
      computing: 'Calculando…',
      results: 'Resultados',
      compare: 'Comparar con hash esperado',
      compare_hint: 'Pega un hash (de cualquier algoritmo). Te diremos si coincide con alguno de los calculados.',
      copy: 'Copiar',
      copied: 'Copiado',
      reading: 'Leyendo archivo',
      hashing: 'Calculando',
      match: '✓ Coincide con',
      nomatch: '✗ No coincide con ningún hash calculado',
      partial: '⚠ Longitud no coincide con ningún algoritmo seleccionado',
      no_algos: 'Selecciona al menos un algoritmo.',
      error: 'Error',
      about_summary: '¿Cómo funciona y por qué confiar en esta herramienta?',
      footer: 'Parte de',
      for_audience: 'Para periodistas y defensores de derechos humanos',
      eyebrow: 'C-LAB · Herramienta · integridad de archivos',
      tagline: 'Verifica la integridad de archivos, sin subir nada.',
      lead: 'HashCheck calcula las huellas criptográficas de un archivo enteramente en tu navegador con la Web Crypto API nativa. El archivo nunca sale de tu dispositivo, sin servidor, sin subida, sin telemetría, y sigue funcionando sin conexión.',
      devtools_note: 'Funciona 100% en tu navegador. Abre DevTools → Red y compruébalo: cero peticiones al calcular.',
      feat1_t: 'Solo local',
      feat1_d: 'El archivo se lee en memoria y nunca se sube. Ningún servidor toca tus datos.',
      feat2_t: 'Cuatro algoritmos',
      feat2_d: 'SHA-256, SHA-1, SHA-512 y MD5, calculados en el dispositivo con la Web Crypto API.',
      feat3_t: 'Compara y re-verifica',
      feat3_d: 'Pega un hash esperado, o calcula el hash de una carpeta entera en un manifiesto que puedes re-verificar después.',
      feat4_t: 'Funciona offline',
      feat4_d: 'HTML/JS/CSS estático, sin frameworks ni CDNs. Auditable y a prueba de desconexión.',
      ops_label: 'Verificar un archivo',
      about_clab: 'Sobre C-LAB',
      devtools_note_short: 'Web Crypto API · procesado en el dispositivo',
      zero_requests: '0 PETICIONES',
      local_no_upload: 'LOCAL · SIN SUBIDA',
      expected_ph: 'ej: a1b2c3...',
      // --- evidence mode ---
      mode_verify: 'Verificar',
      mode_evidence: 'Evidencia',
      ops_label_evidence: 'Manifiesto de evidencia',
      ev_drop_primary: 'Arrastra una carpeta aquí',
      ev_choose_folder: 'Elegir carpeta',
      ev_choose_files: 'Elegir archivos',
      ev_drop_note: 'Cada archivo se procesa de uno en uno, íntegramente en tu navegador. No se sube nada.',
      ev_files: 'Archivos:',
      ev_total: 'Total:',
      ev_largest: 'Mayor:',
      ev_size_warn: '⚠ Hay archivos grandes en la selección. El navegador calcula el hash en memoria; archivos de más de ~2 GB pueden fallar. Para esos, usa shasum -a 256 en la terminal.',
      ev_custody: 'Cadena de custodia',
      ev_custody_hint: 'Se guarda en el manifiesto tal como lo escribas. Es una declaración propia: la herramienta no puede verificar quién eres.',
      ev_case_ph: 'ID del caso',
      ev_examiner_ph: 'Responsable',
      ev_desc_ph: 'Descripción',
      ev_build: 'Construir manifiesto',
      ev_building: 'Construyendo…',
      ev_manifest: 'Manifiesto',
      ev_export_sha: 'Exportar .sha256',
      ev_export_json: 'Exportar JSON',
      ev_disclaimer: 'Este manifiesto es una declaración propia: demuestra que los archivos no han cambiado desde que calculaste sus hashes, y nada más. No lleva sello de tiempo confiable ni testigo independiente, así que por sí solo no es prueba judicial.',
      ev_reverify: 'Re-verificar contra un manifiesto',
      ev_reverify_hint: 'Carga un manifiesto que exportaste antes, luego selecciona la misma carpeta y vuelve a construir. Cada archivo se reporta como sin cambios, alterado, ausente o nuevo.',
      ev_load_manifest: 'Cargar manifiesto',
      ev_clear: 'Quitar',
      ev_hashing_file: 'Calculando',
      ev_no_files: 'Selecciona al menos un archivo.',
      ev_need_sha256: 'Activa SHA-256 para exportar en formato .sha256.',
      ev_manifest_loaded: 'Manifiesto cargado:',
      ev_manifest_entries: 'entradas',
      ev_manifest_err: 'No se pudo leer el manifiesto',
      ev_ok: 'SIN CAMBIOS',
      ev_altered: 'ALTERADO',
      ev_missing: 'AUSENTE',
      ev_new: 'NUEVO'
    },
    en: {
      title: 'HashCheck',
      subtitle: 'Verify file integrity without uploading anything to any server.',
      drop_primary: 'Drop a file here',
      drop_secondary: 'or',
      choose_file: 'Choose file',
      drop_note: 'The file is processed entirely in your browser. It never leaves your device.',
      file: 'File:',
      size: 'Size:',
      modified: 'Modified:',
      algorithms: 'Algorithms',
      compute: 'Compute hashes',
      computing: 'Computing…',
      results: 'Results',
      compare: 'Compare against expected hash',
      compare_hint: 'Paste a hash (any algorithm). We will tell you if it matches one of the computed ones.',
      copy: 'Copy',
      copied: 'Copied',
      reading: 'Reading file',
      hashing: 'Hashing',
      match: '✓ Matches',
      nomatch: '✗ Does not match any computed hash',
      partial: '⚠ Length does not match any selected algorithm',
      no_algos: 'Select at least one algorithm.',
      error: 'Error',
      about_summary: 'How does it work, and why trust this tool?',
      footer: 'Part of',
      for_audience: 'For journalists and human-rights defenders',
      eyebrow: 'C-LAB · Tool · file integrity',
      tagline: 'Verify file integrity, without uploading anything.',
      lead: 'HashCheck computes a file\'s cryptographic fingerprints entirely in your browser with the native Web Crypto API. The file never leaves your device, no server, no upload, no telemetry, and it keeps working offline.',
      devtools_note: 'Runs 100% in your browser. Open DevTools → Network and watch: zero requests when you hash.',
      feat1_t: 'Local-only',
      feat1_d: 'The file is read in-memory and never uploaded. No server touches your data.',
      feat2_t: 'Four algorithms',
      feat2_d: 'SHA-256, SHA-1, SHA-512 and MD5, computed on-device with the Web Crypto API.',
      feat3_t: 'Compare and re-verify',
      feat3_d: 'Paste an expected hash, or hash a whole folder into a manifest you can re-check later.',
      feat4_t: 'Works offline',
      feat4_d: 'Static HTML/JS/CSS, no frameworks or CDNs. Auditable and disconnect-proof.',
      ops_label: 'Verify a file',
      about_clab: 'About C-LAB',
      devtools_note_short: 'Web Crypto API · processed on-device',
      zero_requests: '0 REQUESTS',
      local_no_upload: 'LOCAL · NO UPLOAD',
      expected_ph: 'e.g. a1b2c3...',
      // --- evidence mode ---
      mode_verify: 'Verify',
      mode_evidence: 'Evidence',
      ops_label_evidence: 'Evidence manifest',
      ev_drop_primary: 'Drop a folder here',
      ev_choose_folder: 'Choose folder',
      ev_choose_files: 'Choose files',
      ev_drop_note: 'Every file is hashed one at a time, entirely in your browser. Nothing is uploaded.',
      ev_files: 'Files:',
      ev_total: 'Total:',
      ev_largest: 'Largest:',
      ev_size_warn: '⚠ The selection contains large files. The browser hashes in memory; files over ~2 GB may fail. For those, use shasum -a 256 on the command line.',
      ev_custody: 'Chain of custody',
      ev_custody_hint: 'Recorded into the manifest exactly as you type it. This is self-attested: the tool cannot verify who you are.',
      ev_case_ph: 'Case ID',
      ev_examiner_ph: 'Examiner',
      ev_desc_ph: 'Description',
      ev_build: 'Build manifest',
      ev_building: 'Building…',
      ev_manifest: 'Manifest',
      ev_export_sha: 'Export .sha256',
      ev_export_json: 'Export JSON',
      ev_disclaimer: 'This manifest is self-attested: it proves the files have not changed since you hashed them, and nothing more. It carries no trusted timestamp and no independent witness, so on its own it is not court-grade evidence.',
      ev_reverify: 'Re-verify against a manifest',
      ev_reverify_hint: 'Load a manifest you exported earlier, then select the same folder and build again. Each file is reported as unchanged, altered, missing or new.',
      ev_load_manifest: 'Load manifest',
      ev_clear: 'Clear',
      ev_hashing_file: 'Hashing',
      ev_no_files: 'Select at least one file.',
      ev_need_sha256: 'Enable SHA-256 to export in .sha256 format.',
      ev_manifest_loaded: 'Manifest loaded:',
      ev_manifest_entries: 'entries',
      ev_manifest_err: 'Could not read the manifest',
      ev_ok: 'UNCHANGED',
      ev_altered: 'ALTERED',
      ev_missing: 'MISSING',
      ev_new: 'NEW'
    },
    de: {
      title: 'HashCheck',
      subtitle: 'Prüfe die Integrität von Dateien, ohne sie auf einen Server hochzuladen.',
      drop_primary: 'Zieh eine Datei hierher',
      drop_secondary: 'oder',
      choose_file: 'Datei auswählen',
      drop_note: 'Die Datei wird vollständig in deinem Browser verarbeitet. Sie verlässt dein Gerät nicht.',
      file: 'Datei:',
      size: 'Größe:',
      modified: 'Geändert:',
      algorithms: 'Algorithmen',
      compute: 'Hashes berechnen',
      computing: 'Berechne…',
      results: 'Ergebnisse',
      compare: 'Mit erwartetem Hash vergleichen',
      compare_hint: 'Füg einen Hash ein (beliebiger Algorithmus). Wir sagen dir, ob er mit einem der berechneten übereinstimmt.',
      copy: 'Kopieren',
      copied: 'Kopiert',
      reading: 'Lese Datei',
      hashing: 'Berechne',
      match: '✓ Stimmt überein mit',
      nomatch: '✗ Stimmt mit keinem berechneten Hash überein',
      partial: '⚠ Länge stimmt mit keinem gewählten Algorithmus überein',
      no_algos: 'Wähl mindestens einen Algorithmus.',
      error: 'Fehler',
      about_summary: 'Wie funktioniert es, und warum diesem Tool vertrauen?',
      footer: 'Teil von',
      for_audience: 'Für Journalist:innen und Menschenrechtsverteidiger:innen',
      eyebrow: 'C-LAB · Werkzeug · Dateiintegrität',
      tagline: 'Prüfe die Integrität von Dateien — ohne etwas hochzuladen.',
      lead: 'HashCheck berechnet die kryptografischen Fingerabdrücke einer Datei vollständig in deinem Browser mit der nativen Web Crypto API. Die Datei verlässt dein Gerät nicht — kein Server, kein Upload, keine Telemetrie — und es funktioniert auch offline.',
      devtools_note: 'Läuft zu 100 % in deinem Browser. Öffne DevTools → Netzwerk und beobachte: null Anfragen beim Hashen.',
      feat1_t: 'Nur lokal',
      feat1_d: 'Die Datei wird im Speicher gelesen und niemals hochgeladen. Kein Server berührt deine Daten.',
      feat2_t: 'Vier Algorithmen',
      feat2_d: 'SHA-256, SHA-1, SHA-512 und MD5 — auf dem Gerät mit der Web Crypto API berechnet.',
      feat3_t: 'Vergleichen und nachprüfen',
      feat3_d: 'Füg einen erwarteten Hash ein — oder hash einen ganzen Ordner in ein Manifest, das du später nachprüfen kannst.',
      feat4_t: 'Funktioniert offline',
      feat4_d: 'Statisches HTML/JS/CSS, keine Frameworks oder CDNs. Auditierbar und trennungssicher.',
      ops_label: 'Datei prüfen',
      about_clab: 'Über C-LAB',
      devtools_note_short: 'Web Crypto API · auf dem Gerät verarbeitet',
      zero_requests: '0 ANFRAGEN',
      local_no_upload: 'LOKAL · KEIN UPLOAD',
      expected_ph: 'z. B. a1b2c3...',
      // --- evidence mode ---
      mode_verify: 'Prüfen',
      mode_evidence: 'Beweise',
      ops_label_evidence: 'Beweismittel-Manifest',
      ev_drop_primary: 'Zieh einen Ordner hierher',
      ev_choose_folder: 'Ordner auswählen',
      ev_choose_files: 'Dateien auswählen',
      ev_drop_note: 'Jede Datei wird einzeln und vollständig in deinem Browser gehasht. Es wird nichts hochgeladen.',
      ev_files: 'Dateien:',
      ev_total: 'Gesamt:',
      ev_largest: 'Größte:',
      ev_size_warn: '⚠ Die Auswahl enthält große Dateien. Der Browser hasht im Arbeitsspeicher; Dateien über ~2 GB können fehlschlagen. Nutz dafür shasum -a 256 im Terminal.',
      ev_custody: 'Beweiskette',
      ev_custody_hint: 'Wird genau so ins Manifest übernommen, wie du es eingibst. Das ist deine eigene Angabe: Das Werkzeug kann nicht prüfen, wer du bist.',
      ev_case_ph: 'Fall-ID',
      ev_examiner_ph: 'Bearbeiter:in',
      ev_desc_ph: 'Beschreibung',
      ev_build: 'Manifest erstellen',
      ev_building: 'Erstelle…',
      ev_manifest: 'Manifest',
      ev_export_sha: '.sha256 exportieren',
      ev_export_json: 'JSON exportieren',
      ev_disclaimer: 'Dieses Manifest ist deine eigene Angabe: Es belegt, dass die Dateien sich seit dem Hashen nicht verändert haben — mehr nicht. Es hat keinen vertrauenswürdigen Zeitstempel und keine unabhängigen Zeug:innen und ist damit für sich allein kein gerichtsfester Beweis.',
      ev_reverify: 'Gegen ein Manifest nachprüfen',
      ev_reverify_hint: 'Lad ein zuvor exportiertes Manifest, wähl dann denselben Ordner und erstell es erneut. Jede Datei wird als unverändert, verändert, fehlend oder neu gemeldet.',
      ev_load_manifest: 'Manifest laden',
      ev_clear: 'Entfernen',
      ev_hashing_file: 'Berechne',
      ev_no_files: 'Wähl mindestens eine Datei.',
      ev_need_sha256: 'Aktivier SHA-256, um im Format .sha256 zu exportieren.',
      ev_manifest_loaded: 'Manifest geladen:',
      ev_manifest_entries: 'Einträge',
      ev_manifest_err: 'Manifest konnte nicht gelesen werden',
      ev_ok: 'UNVERÄNDERT',
      ev_altered: 'VERÄNDERT',
      ev_missing: 'FEHLT',
      ev_new: 'NEU'
    }
  };

  const ABOUT_HTML = {
    es: `
      <p>Esta herramienta calcula los hashes (huellas digitales) de un archivo usando criptografía nativa del navegador (Web Crypto API). El archivo nunca sale de tu dispositivo — no hay servidor, no hay subida, no hay telemetría.</p>
      <p>Puedes verificar esto:</p>
      <ul>
        <li>Abriendo las herramientas de desarrollo del navegador → pestaña Red → ver que no hay peticiones cuando calculas hashes.</li>
        <li>Revisando el código fuente: todo es HTML/JS/CSS estático, sin frameworks, sin CDN externos.</li>
        <li>Usándola sin conexión: una vez cargada la página, puedes desconectarte de Internet y seguirá funcionando.</li>
      </ul>
      <p><strong>Limitación:</strong> archivos muy grandes (varios GB) pueden ser lentos o agotar la memoria del navegador. Para esos casos usa una herramienta nativa (<code>shasum -a 256 archivo</code> en macOS/Linux, <code>certutil -hashfile archivo SHA256</code> en Windows).</p>
    `,
    en: `
      <p>This tool computes file hashes (digital fingerprints) using the browser's native cryptography (Web Crypto API). The file never leaves your device — no server, no upload, no telemetry.</p>
      <p>You can verify this:</p>
      <ul>
        <li>Open your browser's developer tools → Network tab → confirm no requests are made when hashing.</li>
        <li>Read the source: pure HTML/JS/CSS, no frameworks, no external CDNs.</li>
        <li>Use it offline: once loaded, you can disconnect from the internet and it still works.</li>
      </ul>
      <p><strong>Limitation:</strong> very large files (several GB) may be slow or exhaust browser memory. For those, use a native tool (<code>shasum -a 256 file</code> on macOS/Linux, <code>certutil -hashfile file SHA256</code> on Windows).</p>
    `,
    de: `
      <p>Dieses Werkzeug berechnet die Hashes (digitalen Fingerabdrücke) einer Datei mit der nativen Kryptografie deines Browsers (Web Crypto API). Die Datei verlässt dein Gerät nie — kein Server, kein Upload, keine Telemetrie.</p>
      <p>Du kannst das überprüfen:</p>
      <ul>
        <li>Öffne die Entwicklertools deines Browsers → Reiter Netzwerk → beobachte, dass beim Hashen keine Anfragen ausgehen.</li>
        <li>Lies den Quelltext: reines HTML/JS/CSS, keine Frameworks, keine externen CDNs.</li>
        <li>Benutz es offline: Ist die Seite einmal geladen, kannst du dich vom Internet trennen und es funktioniert weiter.</li>
      </ul>
      <p><strong>Einschränkung:</strong> Sehr große Dateien (mehrere GB) können langsam sein oder den Browser-Speicher erschöpfen. Nutz in dem Fall ein natives Werkzeug (<code>shasum -a 256 datei</code> auf macOS/Linux, <code>certutil -hashfile datei SHA256</code> auf Windows).</p>
    `
  };

  let currentLang = 'es';
  // Set by the evidence module below, which owns strings applyLang can't
  // reach generically (per-mode labels, rendered manifest rows).
  let onLangChange = null;

  function applyLang(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    const t = STRINGS[lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key === 'about_body') {
        el.innerHTML = ABOUT_HTML[lang];
      } else if (t[key] !== undefined) {
        el.textContent = t[key];
      }
    });
    // translate input placeholders (data-i18n-ph)
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      if (t[key] !== undefined) el.setAttribute('placeholder', t[key]);
    });
    document.title = t.title + ' · ' + t.subtitle.replace(/\.$/, '');
    document.querySelectorAll('.lang-switch button').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
    // Refresh copy button labels
    document.querySelectorAll('.copy-btn:not(.copied)').forEach(b => b.textContent = t.copy);
    // Refresh compare result text (uses current language strings).
    // Guarded because applyLang runs once at init before updateCompareResult's
    // const dependencies (expectedHash, computedHashes) are in scope.
    try { updateCompareResult(); } catch (_) { /* not ready yet */ }
    if (onLangChange) onLangChange();
  }

  document.querySelectorAll('.lang-switch button').forEach(b => {
    b.addEventListener('click', () => applyLang(b.dataset.lang));
  });

  // Detect browser language on first load (es, en, de)
  const browserLang = (navigator.language || 'es').toLowerCase().slice(0, 2);
  applyLang(STRINGS[browserLang] ? browserLang : 'es');

  // ---------- File handling ----------
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');
  const fileInfo = document.getElementById('file-info');
  const fileName = document.getElementById('file-name');
  const fileSize = document.getElementById('file-size');
  const fileMtime = document.getElementById('file-mtime');
  const computeBtn = document.getElementById('compute-btn');
  const progress = document.getElementById('progress');
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  const results = document.getElementById('results');
  const resultsList = document.getElementById('results-list');
  const expectedHash = document.getElementById('expected-hash');
  const compareResult = document.getElementById('compare-result');

  let selectedFile = null;
  let computedHashes = {}; // { 'SHA-256': 'abc...', ... }

  function formatBytes(n) {
    if (n < 1024) return n + ' B';
    const units = ['KB', 'MB', 'GB', 'TB'];
    let v = n / 1024, i = 0;
    while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
    return v.toFixed(v >= 100 ? 0 : v >= 10 ? 1 : 2) + ' ' + units[i];
  }

  function setFile(file) {
    selectedFile = file;
    fileName.textContent = file.name;
    fileSize.textContent = formatBytes(file.size) + ' (' + file.size.toLocaleString() + ' B)';
    fileMtime.textContent = file.lastModified ? new Date(file.lastModified).toLocaleString() : '—';
    fileInfo.classList.remove('hidden');
    computeBtn.disabled = false;
    results.classList.add('hidden');
    resultsList.innerHTML = '';
    computedHashes = {};
    updateCompareResult();
  }

  fileInput.addEventListener('change', e => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  });

  ['dragenter', 'dragover'].forEach(ev => {
    dropZone.addEventListener(ev, e => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });
  });
  ['dragleave', 'drop'].forEach(ev => {
    dropZone.addEventListener(ev, e => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
    });
  });
  dropZone.addEventListener('drop', e => {
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  });

  // ---------- Hashing ----------
  const CHUNK_SIZE = 4 * 1024 * 1024; // 4 MB

  function readFileChunks(file, onProgress) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      let offset = 0;

      function readNext() {
        if (offset >= file.size) {
          // Concatenate into single Uint8Array
          let total = 0;
          for (const c of chunks) total += c.length;
          const out = new Uint8Array(total);
          let pos = 0;
          for (const c of chunks) { out.set(c, pos); pos += c.length; }
          resolve(out);
          return;
        }
        const slice = file.slice(offset, offset + CHUNK_SIZE);
        const reader = new FileReader();
        reader.onload = e => {
          const buf = new Uint8Array(e.target.result);
          chunks.push(buf);
          offset += buf.length;
          onProgress(offset, file.size);
          readNext();
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(slice);
      }
      readNext();
    });
  }

  function bytesToHex(buf) {
    const bytes = new Uint8Array(buf);
    let s = '';
    for (let i = 0; i < bytes.length; i++) {
      s += bytes[i].toString(16).padStart(2, '0');
    }
    return s;
  }

  async function computeHash(algo, bytes) {
    if (algo === 'MD5') {
      return md5Bytes(bytes);
    }
    const digest = await crypto.subtle.digest(algo, bytes);
    return bytesToHex(digest);
  }

  function renderResults() {
    const t = STRINGS[currentLang];
    resultsList.innerHTML = '';
    const order = ['SHA-256', 'SHA-1', 'SHA-512', 'MD5'];
    order.forEach(algo => {
      if (!(algo in computedHashes)) return;
      const item = document.createElement('div');
      item.className = 'result-item';
      const hash = computedHashes[algo];
      item.innerHTML = `
        <div class="result-algo">
          <span>${algo}</span>
          <button class="copy-btn" data-hash="${hash}">${t.copy}</button>
        </div>
        <div class="result-hash">${hash}</div>
      `;
      resultsList.appendChild(item);
    });
    results.classList.remove('hidden');

    resultsList.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(btn.dataset.hash);
          btn.textContent = STRINGS[currentLang].copied;
          btn.classList.add('copied');
          setTimeout(() => {
            btn.textContent = STRINGS[currentLang].copy;
            btn.classList.remove('copied');
          }, 1500);
        } catch (e) {
          // Clipboard may be blocked in some contexts; ignore silently.
        }
      });
    });
  }

  computeBtn.addEventListener('click', async () => {
    if (!selectedFile) return;
    const t = STRINGS[currentLang];
    const algos = Array.from(document.querySelectorAll('.algo-grid input:checked')).map(i => i.value);
    if (algos.length === 0) {
      alert(t.no_algos);
      return;
    }

    computeBtn.disabled = true;
    // [data-i18n], not 'span': the first span is the bolt icon.
    const computeLabel = computeBtn.querySelector('[data-i18n]');
    computeLabel.textContent = t.computing;
    progress.classList.remove('hidden');
    results.classList.add('hidden');
    computedHashes = {};
    progressFill.style.width = '0%';
    progressText.textContent = t.reading + ' 0%';

    try {
      const bytes = await readFileChunks(selectedFile, (done, total) => {
        const pct = total === 0 ? 100 : Math.floor((done / total) * 100);
        progressFill.style.width = pct + '%';
        progressText.textContent = `${t.reading} ${pct}% (${formatBytes(done)} / ${formatBytes(total)})`;
      });

      for (let i = 0; i < algos.length; i++) {
        const algo = algos[i];
        progressText.textContent = `${t.hashing} ${algo} (${i + 1}/${algos.length})…`;
        // Yield to UI thread before each heavy computation
        await new Promise(r => setTimeout(r, 0));
        computedHashes[algo] = await computeHash(algo, bytes);
      }

      renderResults();
      updateCompareResult();
    } catch (err) {
      alert(t.error + ': ' + (err && err.message ? err.message : err));
    } finally {
      progress.classList.add('hidden');
      computeLabel.textContent = STRINGS[currentLang].compute;
      computeBtn.disabled = false;
    }
  });

  // ---------- Compare with expected hash ----------
  function normalizeHash(s) {
    return (s || '').trim().toLowerCase().replace(/\s+/g, '').replace(/^0x/, '');
  }

  const HASH_LENGTHS = { 'MD5': 32, 'SHA-1': 40, 'SHA-256': 64, 'SHA-512': 128 };

  function updateCompareResult() {
    const t = STRINGS[currentLang];
    const expected = normalizeHash(expectedHash.value);
    compareResult.textContent = '';
    compareResult.className = 'compare-result';
    if (!expected) return;

    const computedEntries = Object.entries(computedHashes);
    if (computedEntries.length === 0) {
      // No hashes computed yet, but we can hint about length
      const matchingAlgos = Object.entries(HASH_LENGTHS)
        .filter(([, len]) => len === expected.length)
        .map(([a]) => a);
      if (matchingAlgos.length > 0) {
        compareResult.textContent = `(${matchingAlgos.join(', ')})`;
        compareResult.classList.add('partial');
      } else {
        compareResult.textContent = t.partial;
        compareResult.classList.add('partial');
      }
      return;
    }

    for (const [algo, hash] of computedEntries) {
      if (hash.toLowerCase() === expected) {
        compareResult.textContent = `${t.match} ${algo}`;
        compareResult.classList.add('match');
        return;
      }
    }
    // No match — check if length is at least valid
    const validLen = Object.values(HASH_LENGTHS).includes(expected.length);
    compareResult.textContent = validLen ? t.nomatch : t.partial;
    compareResult.classList.add(validLen ? 'nomatch' : 'partial');
  }

  expectedHash.addEventListener('input', updateCompareResult);

  // ================================================================
  // Evidence mode — folder manifests
  //
  // Files are hashed strictly one at a time and each buffer is released
  // before the next is read, so peak memory tracks the largest single file
  // rather than the size of the whole selection.
  // ================================================================
  const MANIFEST_FORMAT = 'hashcheck-manifest/1';
  const TOOL_VERSION = '0.2.0';
  const LARGE_FILE_BYTES = 512 * 1024 * 1024;
  const ALGO_ORDER = ['SHA-256', 'SHA-1', 'SHA-512', 'MD5'];

  const evDrop = document.getElementById('ev-drop');
  const evFolderInput = document.getElementById('ev-folder-input');
  const evFilesInput = document.getElementById('ev-files-input');
  const evSummary = document.getElementById('ev-summary');
  const evCount = document.getElementById('ev-count');
  const evTotal = document.getElementById('ev-total');
  const evLargest = document.getElementById('ev-largest');
  const evSizeWarn = document.getElementById('ev-size-warn');
  const evCase = document.getElementById('ev-case');
  const evExaminer = document.getElementById('ev-examiner');
  const evDesc = document.getElementById('ev-desc');
  const evComputeBtn = document.getElementById('ev-compute-btn');
  const evProgress = document.getElementById('ev-progress');
  const evProgressFill = document.getElementById('ev-progress-fill');
  const evProgressText = document.getElementById('ev-progress-text');
  const evResults = document.getElementById('ev-results');
  const evTally = document.getElementById('ev-tally');
  const evList = document.getElementById('ev-list');
  const evExportSha = document.getElementById('ev-export-sha');
  const evExportJson = document.getElementById('ev-export-json');
  const evManifestInput = document.getElementById('ev-manifest-input');
  const evClearManifest = document.getElementById('ev-clear-manifest');
  const evManifestInfo = document.getElementById('ev-manifest-info');

  let evSelection = [];      // [{ file, path }]
  let evRows = [];           // [{ path, size, mtime, hashes, status }]
  let evGeneratedAt = null;  // ISO string of the last build
  let loadedManifest = null; // { meta, entries: { path: { algo: hash } } }

  function evAlgos() {
    return Array.from(document.querySelectorAll('#ev-algo-grid input:checked')).map(i => i.value);
  }

  // Path relative to the chosen root. Multi-file selections have no
  // webkitRelativePath, so they fall back to the bare filename.
  function relPath(file) {
    return file.webkitRelativePath && file.webkitRelativePath.length ? file.webkitRelativePath : file.name;
  }

  function setSelection(files) {
    evSelection = files.map(f => ({ file: f, path: relPath(f) }))
      .sort((a, b) => a.path.localeCompare(b.path));

    if (evSelection.length === 0) {
      evSummary.classList.add('hidden');
      evSizeWarn.classList.add('hidden');
      evComputeBtn.disabled = true;
      return;
    }

    let total = 0, largest = 0;
    for (const s of evSelection) {
      total += s.file.size;
      if (s.file.size > largest) largest = s.file.size;
    }
    evCount.textContent = String(evSelection.length);
    evTotal.textContent = formatBytes(total) + ' (' + total.toLocaleString() + ' B)';
    evLargest.textContent = formatBytes(largest);
    evSummary.classList.remove('hidden');
    evSizeWarn.classList.toggle('hidden', largest < LARGE_FILE_BYTES);
    evComputeBtn.disabled = false;
    evResults.classList.add('hidden');
    evList.innerHTML = '';
    evRows = [];
  }

  evFolderInput.addEventListener('change', e => setSelection(Array.from(e.target.files)));
  evFilesInput.addEventListener('change', e => setSelection(Array.from(e.target.files)));

  ['dragenter', 'dragover'].forEach(ev => {
    evDrop.addEventListener(ev, e => { e.preventDefault(); evDrop.classList.add('dragover'); });
  });
  ['dragleave', 'drop'].forEach(ev => {
    evDrop.addEventListener(ev, e => { e.preventDefault(); evDrop.classList.remove('dragover'); });
  });

  // Walk a dropped directory tree via the webkit entries API.
  function walkEntry(entry, prefix, out) {
    return new Promise(resolve => {
      if (entry.isFile) {
        entry.file(f => {
          Object.defineProperty(f, 'webkitRelativePath', { value: prefix + f.name });
          out.push(f);
          resolve();
        }, () => resolve());
      } else if (entry.isDirectory) {
        const reader = entry.createReader();
        const all = [];
        (function readBatch() {
          reader.readEntries(async batch => {
            if (!batch.length) {
              await Promise.all(all.map(en => walkEntry(en, prefix + entry.name + '/', out)));
              resolve();
              return;
            }
            all.push(...batch);
            readBatch();
          }, () => resolve());
        })();
      } else {
        resolve();
      }
    });
  }

  evDrop.addEventListener('drop', async e => {
    const items = e.dataTransfer.items;
    const out = [];
    if (items && items.length && items[0].webkitGetAsEntry) {
      const entries = [];
      for (let i = 0; i < items.length; i++) {
        const en = items[i].webkitGetAsEntry();
        if (en) entries.push(en);
      }
      await Promise.all(entries.map(en => walkEntry(en, '', out)));
    }
    if (out.length) setSelection(out);
    else if (e.dataTransfer.files.length) setSelection(Array.from(e.dataTransfer.files));
  });

  // ---------- manifest parsing ----------
  const LENGTH_TO_ALGO = { 32: 'MD5', 40: 'SHA-1', 64: 'SHA-256', 128: 'SHA-512' };

  function parseShaManifest(text) {
    const entries = {};
    const meta = {};
    text.split(/\r?\n/).forEach(line => {
      const t = line.trim();
      if (!t) return;
      if (t.startsWith('#')) {
        const m = t.slice(1).trim().match(/^([a-z_ ()]+):\s*(.*)$/i);
        if (m) meta[m[1].trim().toLowerCase()] = m[2].trim();
        return;
      }
      // "<hash>  <path>" or "<hash> *<path>"
      const m = t.match(/^([0-9a-fA-F]+)\s+\*?(.+)$/);
      if (!m) return;
      const hash = m[1].toLowerCase();
      const algo = LENGTH_TO_ALGO[hash.length];
      if (!algo) return;
      entries[m[2]] = Object.assign(entries[m[2]] || {}, { [algo]: hash });
    });
    return { meta, entries };
  }

  function parseJsonManifest(text) {
    const j = JSON.parse(text);
    const entries = {};
    (j.files || []).forEach(f => {
      if (f && f.path && f.hashes) {
        entries[f.path] = Object.fromEntries(
          Object.entries(f.hashes).map(([a, h]) => [a, String(h).toLowerCase()])
        );
      }
    });
    return {
      meta: {
        case: j.case_id || '', examiner: j.examiner || '',
        description: j.description || '', 'generated (utc)': j.generated_utc || ''
      },
      entries
    };
  }

  function renderManifestInfo() {
    const t = STRINGS[currentLang];
    evManifestInfo.textContent = '';
    if (!loadedManifest) {
      evClearManifest.classList.add('hidden');
      return;
    }
    const n = Object.keys(loadedManifest.entries).length;
    const bits = [`${t.ev_manifest_loaded} ${n} ${t.ev_manifest_entries}`];
    if (loadedManifest.meta.case) bits.push('· ' + loadedManifest.meta.case);
    if (loadedManifest.meta['generated (utc)']) bits.push('· ' + loadedManifest.meta['generated (utc)']);
    evManifestInfo.textContent = bits.join(' ');
    evClearManifest.classList.remove('hidden');
  }

  evManifestInput.addEventListener('change', e => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result);
      try {
        loadedManifest = /^\s*\{/.test(text) ? parseJsonManifest(text) : parseShaManifest(text);
        if (!Object.keys(loadedManifest.entries).length) throw new Error('no entries');
        // Auto-select the algorithms the manifest actually carries, so the
        // rebuild has something to compare against.
        const present = new Set();
        Object.values(loadedManifest.entries).forEach(h => Object.keys(h).forEach(a => present.add(a)));
        document.querySelectorAll('#ev-algo-grid input').forEach(cb => {
          if (present.has(cb.value)) cb.checked = true;
        });
        renderManifestInfo();
      } catch (err) {
        loadedManifest = null;
        renderManifestInfo();
        alert(STRINGS[currentLang].ev_manifest_err + (err && err.message ? ': ' + err.message : ''));
      }
    };
    reader.onerror = () => alert(STRINGS[currentLang].ev_manifest_err);
    reader.readAsText(f);
    e.target.value = '';
  });

  evClearManifest.addEventListener('click', () => {
    loadedManifest = null;
    renderManifestInfo();
    evRows.forEach(r => { r.status = null; });
    if (evRows.length) renderEvidence();
  });

  // ---------- build ----------
  function statusFor(path, hashes) {
    if (!loadedManifest) return null;
    const expected = loadedManifest.entries[path];
    if (!expected) return 'new';
    const common = ALGO_ORDER.find(a => a in expected && a in hashes);
    if (!common) return null; // nothing comparable — stay silent rather than guess
    return expected[common] === hashes[common] ? 'ok' : 'altered';
  }

  function renderEvidence() {
    const t = STRINGS[currentLang];
    evList.innerHTML = '';

    const tally = { ok: 0, altered: 0, missing: 0, new: 0 };
    evRows.forEach(r => { if (r.status) tally[r.status]++; });

    if (loadedManifest) {
      const parts = [];
      if (tally.ok) parts.push(`${tally.ok} ${t.ev_ok}`);
      if (tally.altered) parts.push(`${tally.altered} ${t.ev_altered}`);
      if (tally.missing) parts.push(`${tally.missing} ${t.ev_missing}`);
      if (tally.new) parts.push(`${tally.new} ${t.ev_new}`);
      evTally.textContent = parts.join('  ·  ');
      evTally.className = 'ev-tally mono' + (tally.altered || tally.missing ? ' bad' : ' good');
    } else {
      evTally.textContent = `${evRows.length} ${t.ev_manifest_entries}`;
      evTally.className = 'ev-tally mono';
    }

    evRows.forEach((r, i) => {
      const item = document.createElement('div');
      item.className = 'ev-item' + (r.status ? ' st-' + r.status : '');

      const head = document.createElement('div');
      head.className = 'ev-head';
      const idx = document.createElement('span');
      idx.className = 'ev-idx mono';
      idx.textContent = String(i + 1).padStart(2, '0');
      const p = document.createElement('span');
      p.className = 'ev-path';
      p.textContent = r.path; // textContent: filenames are untrusted input
      head.appendChild(idx);
      head.appendChild(p);
      if (r.status) {
        const st = document.createElement('span');
        st.className = 'ev-status mono';
        st.textContent = t['ev_' + r.status];
        head.appendChild(st);
      }
      item.appendChild(head);

      const meta = document.createElement('div');
      meta.className = 'ev-meta mono';
      meta.textContent = r.status === 'missing'
        ? '—'
        : formatBytes(r.size) + ' · ' + (r.mtime ? new Date(r.mtime).toISOString().replace('.000Z', 'Z') : '—');
      item.appendChild(meta);

      ALGO_ORDER.forEach(algo => {
        if (!(algo in r.hashes)) return;
        const row = document.createElement('div');
        row.className = 'ev-hash';
        const a = document.createElement('span');
        a.className = 'ev-algo mono';
        a.textContent = algo;
        const h = document.createElement('code');
        h.textContent = r.hashes[algo];
        row.appendChild(a);
        row.appendChild(h);
        item.appendChild(row);
      });

      evList.appendChild(item);
    });

    evResults.classList.remove('hidden');
  }

  evComputeBtn.addEventListener('click', async () => {
    const t = STRINGS[currentLang];
    if (!evSelection.length) { alert(t.ev_no_files); return; }
    const algos = evAlgos();
    if (algos.length === 0) { alert(t.no_algos); return; }

    evComputeBtn.disabled = true;
    const label = evComputeBtn.querySelector('[data-i18n]');
    label.textContent = t.ev_building;
    evProgress.classList.remove('hidden');
    evResults.classList.add('hidden');
    evRows = [];

    const totalBytes = evSelection.reduce((n, s) => n + s.file.size, 0);
    let doneBytes = 0;

    try {
      for (let i = 0; i < evSelection.length; i++) {
        const { file, path } = evSelection[i];
        evProgressText.textContent = `${t.ev_hashing_file} ${i + 1}/${evSelection.length} — ${path}`;

        // eslint-disable-next-line no-await-in-loop -- sequential on purpose: bounds peak memory
        let bytes = await readFileChunks(file, (done) => {
          const pct = totalBytes === 0 ? 100 : Math.floor(((doneBytes + done) / totalBytes) * 100);
          evProgressFill.style.width = pct + '%';
        });

        const hashes = {};
        for (const algo of algos) {
          await new Promise(r => setTimeout(r, 0));
          hashes[algo] = await computeHash(algo, bytes);
        }
        bytes = null; // release before reading the next file

        doneBytes += file.size;
        evRows.push({ path, size: file.size, mtime: file.lastModified, hashes, status: null });
      }

      // Status is only meaningful once every file has been hashed.
      if (loadedManifest) {
        evRows.forEach(r => { r.status = statusFor(r.path, r.hashes); });
        const seen = new Set(evRows.map(r => r.path));
        Object.keys(loadedManifest.entries).forEach(p => {
          if (!seen.has(p)) {
            evRows.push({ path: p, size: 0, mtime: null, hashes: {}, status: 'missing' });
          }
        });
        evRows.sort((a, b) => a.path.localeCompare(b.path));
      }

      evGeneratedAt = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
      renderEvidence();
    } catch (err) {
      alert(t.error + ': ' + (err && err.message ? err.message : err));
    } finally {
      evProgress.classList.add('hidden');
      evProgressFill.style.width = '0%';
      label.textContent = t.ev_build;
      evComputeBtn.disabled = false;
    }
  });

  // ---------- export ----------
  function downloadBlob(filename, text, mime) {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  function slug(s) {
    return (s || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function baseName() {
    const stamp = (evGeneratedAt || new Date().toISOString()).replace(/[:.]/g, '-').replace(/Z$/, '');
    const c = slug(evCase.value);
    return 'manifest-' + (c ? c + '-' : '') + stamp;
  }

  function manifestMetaLines() {
    const rows = evRows.filter(r => r.status !== 'missing');
    return {
      rows,
      total: rows.reduce((n, r) => n + r.size, 0)
    };
  }

  evExportSha.addEventListener('click', () => {
    const t = STRINGS[currentLang];
    const { rows, total } = manifestMetaLines();
    const withSha = rows.filter(r => 'SHA-256' in r.hashes);
    if (!withSha.length) { alert(t.ev_need_sha256); return; }

    const lines = [
      '# HashCheck manifest — https://hashcheck.c-lab.tools',
      '# format: ' + MANIFEST_FORMAT,
      '# tool: HashCheck ' + TOOL_VERSION,
      '# NOT court-grade: self-attested, no trusted timestamp, no independent witness.',
      '# case: ' + (evCase.value.trim() || '—'),
      '# examiner: ' + (evExaminer.value.trim() || '—'),
      '# description: ' + (evDesc.value.trim() || '—'),
      '# generated (utc): ' + evGeneratedAt,
      '# files: ' + withSha.length,
      '# total bytes: ' + total,
      '#',
      '# Verify with:  shasum -a 256 -c ' + baseName() + '.sha256'
    ];
    // "<hash>  <path>" — the format `shasum -a 256` emits and `-c` round-trips.
    withSha.forEach(r => lines.push(r.hashes['SHA-256'] + '  ' + r.path));
    downloadBlob(baseName() + '.sha256', lines.join('\n') + '\n', 'text/plain');
  });

  evExportJson.addEventListener('click', () => {
    const { rows, total } = manifestMetaLines();
    const doc = {
      format: MANIFEST_FORMAT,
      tool: 'HashCheck',
      tool_version: TOOL_VERSION,
      disclaimer: 'Self-attested. Proves the files have not changed since they were hashed. '
        + 'No trusted timestamp, no independent witness. Not court-grade evidence on its own.',
      case_id: evCase.value.trim(),
      examiner: evExaminer.value.trim(),
      description: evDesc.value.trim(),
      generated_utc: evGeneratedAt,
      algorithms: evAlgos(),
      file_count: rows.length,
      total_bytes: total,
      files: rows.map(r => ({
        path: r.path,
        size: r.size,
        modified_utc: r.mtime ? new Date(r.mtime).toISOString() : null,
        hashes: r.hashes
      }))
    };
    downloadBlob(baseName() + '.json', JSON.stringify(doc, null, 2) + '\n', 'application/json');
  });

  // ---------- mode switch ----------
  const opsLabel = document.querySelector('.ops-label [data-i18n="ops_label"]');
  let currentMode = 'verify';

  function applyMode(mode) {
    currentMode = mode;
    document.getElementById('mode-verify').classList.toggle('hidden', mode !== 'verify');
    document.getElementById('mode-evidence').classList.toggle('hidden', mode !== 'evidence');
    document.querySelectorAll('.mode-switch button').forEach(b => {
      const on = b.dataset.mode === mode;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    syncModeStrings();
  }

  // applyLang rewrites ops_label generically; re-assert the per-mode label after.
  function syncModeStrings() {
    const t = STRINGS[currentLang];
    if (opsLabel) opsLabel.textContent = currentMode === 'evidence' ? t.ops_label_evidence : t.ops_label;
  }

  document.querySelectorAll('.mode-switch button').forEach(b => {
    b.addEventListener('click', () => applyMode(b.dataset.mode));
  });

  onLangChange = function () {
    syncModeStrings();
    renderManifestInfo();
    if (evRows.length) renderEvidence();
  };

  applyMode('verify');
})();
