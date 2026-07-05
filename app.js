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
      feat2_d: 'SHA-256, SHA-1, SHA-512 y MD5 calculados en una sola pasada.',
      feat3_t: 'Compara un hash',
      feat3_d: 'Pega un hash esperado; HashCheck te dice al instante si coincide.',
      feat4_t: 'Funciona offline',
      feat4_d: 'HTML/JS/CSS estático, sin frameworks ni CDNs. Auditable y a prueba de desconexión.',
      ops_label: 'Verificar un archivo',
      about_clab: 'Sobre C-LAB',
      devtools_note_short: 'Web Crypto API · procesado en el dispositivo',
      zero_requests: '0 PETICIONES',
      local_no_upload: 'LOCAL · SIN SUBIDA',
      expected_ph: 'ej: a1b2c3...'
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
      feat2_d: 'SHA-256, SHA-1, SHA-512 and MD5 computed in a single pass.',
      feat3_t: 'Compare a hash',
      feat3_d: 'Paste an expected hash; HashCheck tells you instantly if it matches.',
      feat4_t: 'Works offline',
      feat4_d: 'Static HTML/JS/CSS, no frameworks or CDNs. Auditable and disconnect-proof.',
      ops_label: 'Verify a file',
      about_clab: 'About C-LAB',
      devtools_note_short: 'Web Crypto API · processed on-device',
      zero_requests: '0 REQUESTS',
      local_no_upload: 'LOCAL · NO UPLOAD',
      expected_ph: 'e.g. a1b2c3...'
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
      feat2_d: 'SHA-256, SHA-1, SHA-512 und MD5 in einem Durchgang berechnet.',
      feat3_t: 'Hash vergleichen',
      feat3_d: 'Füg einen erwarteten Hash ein; HashCheck sagt dir sofort, ob er übereinstimmt.',
      feat4_t: 'Funktioniert offline',
      feat4_d: 'Statisches HTML/JS/CSS, keine Frameworks oder CDNs. Auditierbar und trennungssicher.',
      ops_label: 'Datei prüfen',
      about_clab: 'Über C-LAB',
      devtools_note_short: 'Web Crypto API · auf dem Gerät verarbeitet',
      zero_requests: '0 ANFRAGEN',
      local_no_upload: 'LOKAL · KEIN UPLOAD',
      expected_ph: 'z. B. a1b2c3...'
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
    const origLabel = computeBtn.querySelector('span').textContent;
    computeBtn.querySelector('span').textContent = t.computing;
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
      computeBtn.querySelector('span').textContent = origLabel;
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
})();
