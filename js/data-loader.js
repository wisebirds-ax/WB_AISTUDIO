/* =========================================================
   모델 데이터 로더 — 구글 시트(CSV) 또는 data/models.js
   ========================================================= */
(function () {
  const CFG = window.SITE_CONFIG;

  /* 따옴표·줄바꿈을 포함한 CSV 파서 */
  function parseCSV(text) {
    const rows = [];
    let row = [], cell = '', q = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i], n = text[i + 1];
      if (q) {
        if (c === '"' && n === '"') { cell += '"'; i++; }
        else if (c === '"') q = false;
        else cell += c;
      } else if (c === '"') q = true;
      else if (c === ',') { row.push(cell); cell = ''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && n === '\n') i++;
        row.push(cell); rows.push(row); row = []; cell = '';
      } else cell += c;
    }
    if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
    const head = (rows.shift() || []).map(h => h.replace(/^\uFEFF/, '').trim().toLowerCase());
    return rows
      .filter(r => r.some(v => v.trim() !== ''))
      .map(r => Object.fromEntries(head.map((h, i) => [h, (r[i] || '').trim()])));
  }

  const list = v => String(v || '').split(/[,|]/).map(s => s.trim()).filter(Boolean);
  const upperList = v => list(v).map(s => s.toUpperCase());

  function resolvePath(id, file) {
    if (!file) return '';
    if (/^(https?:)?\/\//.test(file) || file.startsWith('/') || file.startsWith('data:')) return file;
    return CFG.MODEL_IMAGE_BASE + id + '/' + file;
  }

  function normalize(raw) {
    const id = String(raw.id || '').trim();
    const shown = String(raw.show ?? 'Y').trim().toUpperCase();
    const images = list(raw.images).map(f => resolvePath(id, f));
    return {
      id,
      show: !['N', 'NO', 'FALSE', '0', 'X'].includes(shown),
      nameEn: String(raw.name_en || '').trim(),
      nameKo: String(raw.name_ko || '').trim(),
      age: raw.age ?? '',
      height: raw.height ?? '',
      hairColor: String(raw.hair_color || '').trim(),
      eyes: String(raw.eyes || '').trim(),
      tags: { hair: upperList(raw.hair), body: upperList(raw.body), mood: upperList(raw.mood) },
      thumb: resolvePath(id, raw.thumb || 'thumb.jpg'),
      images: images.length ? images : [resolvePath(id, raw.thumb || 'thumb.jpg')],
      sns: {
        instagram: raw.instagram || '',
        facebook: raw.facebook || '',
        tiktok: raw.tiktok || ''
      }
    };
  }

  let cache = null;
  window.loadModels = function () {
    if (cache) return cache;
    const local = () => (window.MODELS_DATA || []);
    const source = CFG.SHEET_CSV_URL
      ? fetch(CFG.SHEET_CSV_URL + (CFG.SHEET_CSV_URL.includes('?') ? '&' : '?') + 't=' + Date.now())
          .then(r => { if (!r.ok) throw new Error(r.status); return r.text(); })
          .then(text => {
            const rows = parseCSV(text);
            /* 받은 내용이 models 탭 CSV가 아니면 원인을 알려주고 models.js 사용 */
            if (!rows.length || !('id' in rows[0])) {
              const first = text.trim().split(/\r?\n/)[0].slice(0, 80);
              const why = /<html|<!doctype/i.test(text)
                ? 'CSV가 아니라 웹페이지(HTML)가 왔습니다. 웹에 게시할 때 형식을 "쉼표로 구분된 값(.csv)"로 선택하세요.'
                : '첫 줄이 "' + first + '" 입니다. 1행이 id,show,name_en… 인 models 탭을 게시했는지 확인하세요.';
              throw new Error(why);
            }
            return rows;
          })
          .catch(err => { console.warn('[models] 시트를 사용할 수 없어 models.js 로 대체합니다.\n원인:', err.message || err); return local(); })
      : Promise.resolve(local());
    cache = source.then(rows => rows.map(normalize).filter(m => m.id && m.show));
    return cache;
  };
})();
