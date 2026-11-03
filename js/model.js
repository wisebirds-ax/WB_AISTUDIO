/* 모델 상세(03) */
(function () {
  const CFG = window.SITE_CONFIG;
  const id = new URLSearchParams(location.search).get('id');
  const titleEl = document.getElementById('modelTitle');
  const track = document.getElementById('galleryTrack');
  const gallery = document.getElementById('gallery');
  const info = document.getElementById('modelInfo');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  loadModels().then(models => {
    const m = models.find(x => x.id === id);
    if (!m) {
      titleEl.innerHTML = '모델을<br>찾을 수 없습니다';
      track.innerHTML = `<li class="gallery-empty"><a href="index.html#model">모델 목록으로 돌아가기</a></li>`;
      return;
    }
    document.title = `${m.nameEn} | WISEBIRDS AI STUDIO`;

    /* 이름: 성 / 이름 두 줄 */
    const [first, ...rest] = m.nameEn.split(' ');
    titleEl.innerHTML = rest.length ? `${escapeHTML(first)}<br>${escapeHTML(rest.join(' '))}` : escapeHTML(first);

    track.innerHTML = m.images.map((src, i) => `
      <li class="gallery-item">
        <img src="${escapeHTML(src)}" alt="${escapeHTML(m.nameEn)} ${i + 1}" draggable="false"
          loading="${i < 4 ? 'eager' : 'lazy'}" decoding="async"
          onerror="this.parentNode.classList.add('is-empty');this.remove()">
      </li>`).join('');

    const field = (k, v) => v !== '' && v != null ? `<span class="info-item"><span class="info-key">${k}</span>${escapeHTML(v)}</span>` : '';
    info.innerHTML = `
      <span class="info-item info-ko">${escapeHTML(m.nameKo)}</span>
      ${field('AGE', m.age)}${field('HEIGHT', m.height)}${field('HAIR', m.hairColor)}${field('EYES', m.eyes)}`;

    setupShare(m);
  });

  /* BACK: 리스트에서 들어왔으면 뒤로가기(스크롤·필터 유지), 아니면 리스트로 이동 */
  document.getElementById('backBtn').addEventListener('click', e => {
    try {
      const ref = new URL(document.referrer);
      if (ref.origin === location.origin && /(\/|index\.html)$/.test(ref.pathname) && history.length > 1) {
        e.preventDefault();
        history.back();
      }
    } catch (err) { /* referrer 없음 → 기본 링크로 이동 */ }
  });

  /* ---------- 가로 갤러리: 휠 → 가로 이동, 마우스 드래그, 관성 ---------- */
  let target = 0, current = 0, raf = null;
  const max = () => gallery.scrollWidth - gallery.clientWidth;
  const clamp = v => Math.max(0, Math.min(max(), v));
  function tick() {
    current += (target - current) * (reduce ? 1 : 0.12);
    if (Math.abs(target - current) < 0.5) current = target;
    gallery.scrollLeft = current;
    raf = current !== target ? requestAnimationFrame(tick) : null;
  }
  const go = v => { target = clamp(v); if (!raf) raf = requestAnimationFrame(tick); };

  window.addEventListener('wheel', e => {
    if (document.body.classList.contains('modal-open')) return;
    e.preventDefault();
    current = gallery.scrollLeft;
    go(target + (Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX));
  }, { passive: false });

  /* 드래그·스와이프: 마우스는 이미지 위에서, 터치는 화면 어디서나.
     좌우로 밀든 위아래로 밀든 이미지가 가로로 미끄러지고, 손을 떼면 관성으로 이어집니다. */
  const area = document.querySelector('.detail');
  let drag = null;
  area.addEventListener('pointerdown', e => {
    if (document.body.classList.contains('modal-open')) return;
    if (e.pointerType === 'mouse' && (e.button !== 0 || !gallery.contains(e.target))) return;
    current = target = gallery.scrollLeft;
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, start: target, axis: null,
             last: 0, lastT: performance.now(), v: 0, touch: e.pointerType !== 'mouse' };
  });
  area.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.axis) {
      if (Math.hypot(dx, dy) < 6) return;                     // 짧은 탭은 클릭으로 둠 (BACK 등)
      drag.axis = !drag.touch || Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y';
      area.setPointerCapture(e.pointerId);
      gallery.classList.add('is-dragging');
    }
    const d = drag.axis === 'x' ? dx : dy;
    const now = performance.now();
    drag.v = drag.v * 0.6 + ((d - drag.last) / Math.max(1, now - drag.lastT)) * 0.4;   // 속도 평활화
    drag.last = d; drag.lastT = now;
    target = current = clamp(drag.start - d);
    gallery.scrollLeft = current;
  });
  const end = e => {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    if (drag.axis) {
      const idle = performance.now() - drag.lastT > 80;      // 멈췄다 뗀 경우 관성 없음
      go(target - (idle ? 0 : drag.v) * (drag.touch ? 420 : 300));
      gallery.classList.remove('is-dragging');
    }
    drag = null;
  };
  area.addEventListener('pointerup', end);
  area.addEventListener('pointercancel', end);
  gallery.addEventListener('scroll', () => { if (!raf && !drag) current = target = gallery.scrollLeft; }, { passive: true });

  /* ---------- SHARE 팝업 (디자인 확정 전 임시 버전) ---------- */
  function setupShare(m) {
    const modal = document.getElementById('shareModal');
    const openBtn = document.getElementById('shareBtn');
    const links = {
      instagram: m.sns.instagram || CFG.SNS.instagram,
      facebook: m.sns.facebook || CFG.SNS.facebook,
      tiktok: m.sns.tiktok || CFG.SNS.tiktok
    };
    modal.querySelectorAll('[data-sns]').forEach(a => {
      const url = links[a.dataset.sns];
      if (url) a.href = url; else a.hidden = true;
    });
    const copyBtn = modal.querySelector('[data-copy]');
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(location.href)
        .then(() => (copyBtn.textContent = '링크가 복사되었습니다'))
        .catch(() => (copyBtn.textContent = '복사하지 못했습니다'));
      setTimeout(() => (copyBtn.textContent = '페이지 링크 복사'), 2000);
    });

    const open = () => { modal.hidden = false; document.body.classList.add('modal-open'); modal.querySelector('.modal-close').focus(); };
    const close = () => { modal.hidden = true; document.body.classList.remove('modal-open'); openBtn.focus(); };
    openBtn.addEventListener('click', open);
    modal.addEventListener('click', e => { if (e.target === modal || e.target.closest('.modal-close')) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) close(); });
  }
})();
