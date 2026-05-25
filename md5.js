/*
 * MD5 — pure JavaScript implementation, vendored locally (no CDN).
 *
 * Based on Joseph Myers' MD5 (https://www.myersdaily.org/joseph/javascript/md5-text.html),
 * public domain, adapted to accept Uint8Array input directly and avoid
 * UTF-8 round-tripping for byte-level file hashing.
 *
 * Exposes: window.md5Bytes(uint8array) -> hex string
 *          window.md5Streaming() -> { update(uint8array), finalize() -> hex }
 *
 * Use md5Streaming() for large files (process in chunks to avoid loading
 * the entire file into memory twice).
 */
(function (global) {
  'use strict';

  function safe_add(x, y) {
    var lsw = (x & 0xffff) + (y & 0xffff);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  }

  function rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
  }

  function cmn(q, a, b, x, s, t) {
    return safe_add(rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
  }
  function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
  function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
  function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
  function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }

  function md5cycle(state, block) {
    var a = state[0], b = state[1], c = state[2], d = state[3];

    a = ff(a, b, c, d, block[0], 7, -680876936);
    d = ff(d, a, b, c, block[1], 12, -389564586);
    c = ff(c, d, a, b, block[2], 17, 606105819);
    b = ff(b, c, d, a, block[3], 22, -1044525330);
    a = ff(a, b, c, d, block[4], 7, -176418897);
    d = ff(d, a, b, c, block[5], 12, 1200080426);
    c = ff(c, d, a, b, block[6], 17, -1473231341);
    b = ff(b, c, d, a, block[7], 22, -45705983);
    a = ff(a, b, c, d, block[8], 7, 1770035416);
    d = ff(d, a, b, c, block[9], 12, -1958414417);
    c = ff(c, d, a, b, block[10], 17, -42063);
    b = ff(b, c, d, a, block[11], 22, -1990404162);
    a = ff(a, b, c, d, block[12], 7, 1804603682);
    d = ff(d, a, b, c, block[13], 12, -40341101);
    c = ff(c, d, a, b, block[14], 17, -1502002290);
    b = ff(b, c, d, a, block[15], 22, 1236535329);

    a = gg(a, b, c, d, block[1], 5, -165796510);
    d = gg(d, a, b, c, block[6], 9, -1069501632);
    c = gg(c, d, a, b, block[11], 14, 643717713);
    b = gg(b, c, d, a, block[0], 20, -373897302);
    a = gg(a, b, c, d, block[5], 5, -701558691);
    d = gg(d, a, b, c, block[10], 9, 38016083);
    c = gg(c, d, a, b, block[15], 14, -660478335);
    b = gg(b, c, d, a, block[4], 20, -405537848);
    a = gg(a, b, c, d, block[9], 5, 568446438);
    d = gg(d, a, b, c, block[14], 9, -1019803690);
    c = gg(c, d, a, b, block[3], 14, -187363961);
    b = gg(b, c, d, a, block[8], 20, 1163531501);
    a = gg(a, b, c, d, block[13], 5, -1444681467);
    d = gg(d, a, b, c, block[2], 9, -51403784);
    c = gg(c, d, a, b, block[7], 14, 1735328473);
    b = gg(b, c, d, a, block[12], 20, -1926607734);

    a = hh(a, b, c, d, block[5], 4, -378558);
    d = hh(d, a, b, c, block[8], 11, -2022574463);
    c = hh(c, d, a, b, block[11], 16, 1839030562);
    b = hh(b, c, d, a, block[14], 23, -35309556);
    a = hh(a, b, c, d, block[1], 4, -1530992060);
    d = hh(d, a, b, c, block[4], 11, 1272893353);
    c = hh(c, d, a, b, block[7], 16, -155497632);
    b = hh(b, c, d, a, block[10], 23, -1094730640);
    a = hh(a, b, c, d, block[13], 4, 681279174);
    d = hh(d, a, b, c, block[0], 11, -358537222);
    c = hh(c, d, a, b, block[3], 16, -722521979);
    b = hh(b, c, d, a, block[6], 23, 76029189);
    a = hh(a, b, c, d, block[9], 4, -640364487);
    d = hh(d, a, b, c, block[12], 11, -421815835);
    c = hh(c, d, a, b, block[15], 16, 530742520);
    b = hh(b, c, d, a, block[2], 23, -995338651);

    a = ii(a, b, c, d, block[0], 6, -198630844);
    d = ii(d, a, b, c, block[7], 10, 1126891415);
    c = ii(c, d, a, b, block[14], 15, -1416354905);
    b = ii(b, c, d, a, block[5], 21, -57434055);
    a = ii(a, b, c, d, block[12], 6, 1700485571);
    d = ii(d, a, b, c, block[3], 10, -1894986606);
    c = ii(c, d, a, b, block[10], 15, -1051523);
    b = ii(b, c, d, a, block[1], 21, -2054922799);
    a = ii(a, b, c, d, block[8], 6, 1873313359);
    d = ii(d, a, b, c, block[15], 10, -30611744);
    c = ii(c, d, a, b, block[6], 15, -1560198380);
    b = ii(b, c, d, a, block[13], 21, 1309151649);
    a = ii(a, b, c, d, block[4], 6, -145523070);
    d = ii(d, a, b, c, block[11], 10, -1120210379);
    c = ii(c, d, a, b, block[2], 15, 718787259);
    b = ii(b, c, d, a, block[9], 21, -343485551);

    state[0] = safe_add(a, state[0]);
    state[1] = safe_add(b, state[1]);
    state[2] = safe_add(c, state[2]);
    state[3] = safe_add(d, state[3]);
  }

  // Pack 64 bytes (little-endian) into 16 uint32s.
  function bytesToBlock(buf, offset, block) {
    for (var i = 0; i < 16; i++) {
      var j = offset + i * 4;
      block[i] = (buf[j]) | (buf[j + 1] << 8) | (buf[j + 2] << 16) | (buf[j + 3] << 24);
    }
  }

  function hex(n) {
    var s = '', j;
    for (j = 0; j < 4; j++) {
      s += ((n >> (j * 8 + 4)) & 0x0f).toString(16) + ((n >> (j * 8)) & 0x0f).toString(16);
    }
    return s;
  }

  function digestToHex(state) {
    return hex(state[0]) + hex(state[1]) + hex(state[2]) + hex(state[3]);
  }

  function MD5Streaming() {
    this.state = [1732584193, -271733879, -1732584194, 271733878];
    this.totalBytes = 0;
    this.tail = new Uint8Array(64);
    this.tailLen = 0;
    this.block = new Array(16);
  }

  MD5Streaming.prototype.update = function (bytes) {
    var i = 0;
    var n = bytes.length;
    this.totalBytes += n;

    if (this.tailLen > 0) {
      var need = 64 - this.tailLen;
      if (n < need) {
        this.tail.set(bytes, this.tailLen);
        this.tailLen += n;
        return;
      }
      this.tail.set(bytes.subarray(0, need), this.tailLen);
      bytesToBlock(this.tail, 0, this.block);
      md5cycle(this.state, this.block);
      i = need;
      this.tailLen = 0;
    }

    while (i + 64 <= n) {
      bytesToBlock(bytes, i, this.block);
      md5cycle(this.state, this.block);
      i += 64;
    }

    if (i < n) {
      this.tail.set(bytes.subarray(i, n), 0);
      this.tailLen = n - i;
    }
  };

  MD5Streaming.prototype.finalize = function () {
    var tail = new Uint8Array(this.tail.buffer.slice(0, this.tailLen));
    var padLen = (this.tailLen < 56) ? 56 - this.tailLen : 120 - this.tailLen;
    var finalBuf = new Uint8Array(this.tailLen + padLen + 8);
    finalBuf.set(tail, 0);
    finalBuf[this.tailLen] = 0x80;

    // Append length in bits as 64-bit little-endian.
    var bitsLow = (this.totalBytes * 8) >>> 0;
    var bitsHigh = Math.floor(this.totalBytes / 0x20000000) >>> 0; // /2^29 = *8 then /2^32
    var lenOffset = this.tailLen + padLen;
    finalBuf[lenOffset] = bitsLow & 0xff;
    finalBuf[lenOffset + 1] = (bitsLow >>> 8) & 0xff;
    finalBuf[lenOffset + 2] = (bitsLow >>> 16) & 0xff;
    finalBuf[lenOffset + 3] = (bitsLow >>> 24) & 0xff;
    finalBuf[lenOffset + 4] = bitsHigh & 0xff;
    finalBuf[lenOffset + 5] = (bitsHigh >>> 8) & 0xff;
    finalBuf[lenOffset + 6] = (bitsHigh >>> 16) & 0xff;
    finalBuf[lenOffset + 7] = (bitsHigh >>> 24) & 0xff;

    for (var i = 0; i < finalBuf.length; i += 64) {
      bytesToBlock(finalBuf, i, this.block);
      md5cycle(this.state, this.block);
    }

    return digestToHex(this.state);
  };

  function md5Bytes(bytes) {
    var s = new MD5Streaming();
    s.update(bytes);
    return s.finalize();
  }

  global.md5Bytes = md5Bytes;
  global.md5Streaming = function () { return new MD5Streaming(); };
})(typeof window !== 'undefined' ? window : globalThis);
