/* 메인(01) + 모델 리스트(02) */
(function () {
  const CFG = window.SITE_CONFIG;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const section = document.getElementById('model');
  const grid = document.getElementById('modelGrid');
  const filterBox = document.getElementById('filters');
  const navModel = document.querySelector('[data-nav="model"]');

  /* ---------- 01. 영상: PC / 모바일 다른 파일, 무한 루프 ---------- */
  const video = document.getElementById('heroVideo');
  const mq = window.matchMedia(`(max-width: ${CFG.VIDEO.mobileBreakpoint}px)`);
  function setVideo() {
    const m = mq.matches;
    const src = m ? CFG.VIDEO.mobile : CFG.VIDEO.pc;
    if (video.dataset.current === src) return;
    video.dataset.current = src;
    video.poster = m ? CFG.VIDEO.mobilePoster : CFG.VIDEO.pcPoster;
    video.src = src;
    video.load();
    const p = video.play();
    if (p && p.catch) p.catch(() => {});   // 자동재생 차단 시 조용히 무시
  }
  video.addEventListener('error', () => video.classList.add('is-empty'));
  video.addEventListener('loadeddata', () => video.classList.remove('is-empty'));
  mq.addEventListener('change', setVideo);
  setVideo();

  /* ---------- 01 → 02 이동 (SCROLL 버튼 / 첫 휠) ---------- */
  const goModel = () => section.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  document.querySelector('.scroll-cue').addEventListener('click', goModel);

  let lock = false;
  window.addEventListener('wheel', e => {
    const modelTop = section.getBoundingClientRect().top + window.scrollY;
    if (e.deltaY > 0 && window.scrollY < modelTop - 4 && !lock) {
      e.preventDefault();
      lock = true;
      goModel();
      setTimeout(() => (lock = false), 900);
    } else if (lock && window.scrollY < modelTop - 4) {
      e.preventDefault();
    }
  }, { passive: false });

  /* GNB 'MODEL' 활성 표시 */
  new IntersectionObserver(([en]) => navModel.classList.toggle('is-active', en.isIntersecting),
    { rootMargin: '-40% 0px -40% 0px' }).observe(section);

  /* ---------- 02. 필터 (온/오프 토글) ---------- */
  const STORE = 'wb_filters';
  let active = {};
  try { active = JSON.parse(sessionStorage.getItem(STORE)) || {}; } catch (e) {}
  CFG.FILTERS.forEach(f => (active[f.key] = new Set(active[f.key] || [])));

  filterBox.innerHTML = CFG.FILTERS.map(f => `
    <div class="filter-row" role="group" aria-label="${f.label}">
      <span class="filter-label">${f.label}</span>
      <div class="filter-options">
        ${f.options.map(o => `<button type="button" class="filter-btn" data-key="${f.key}" data-val="${o}"
          aria-pressed="${active[f.key].has(o)}">${o}</button>`).join('')}
      </div>
    </div>`).join('');

  filterBox.addEventListener('click', e => {
    const b = e.target.closest('.filter-btn');
    if (!b) return;
    const set = active[b.dataset.key];
    set.has(b.dataset.val) ? set.delete(b.dataset.val) : set.add(b.dataset.val);
    b.setAttribute('aria-pressed', set.has(b.dataset.val));
    try { sessionStorage.setItem(STORE, JSON.stringify(Object.fromEntries(Object.entries(active).map(([k, v]) => [k, [...v]])))); } catch (e) {}
    render();
  });

  /* 같은 그룹 안에서는 '또는', 그룹끼리는 '그리고' */
  const match = m => CFG.FILTERS.every(f => {
    const sel = active[f.key];
    return !sel.size || (m.tags[f.key] || []).some(t => sel.has(t));
  });

  let models = [];
  function render() {
    const list = models.filter(match);
    if (!list.length) {
      grid.innerHTML = `<p class="grid-empty">선택한 조건에 맞는 모델이 없습니다. 버튼을 다시 눌러 선택을 해제해 보세요.</p>`;
      return;
    }
    grid.innerHTML = list.map((m, i) => `
      <li class="model-card">
        <a href="model.html?id=${encodeURIComponent(m.id)}">
          <div class="model-thumb">
            <img src="${escapeHTML(m.thumb)}" alt="${escapeHTML(m.nameEn)}" loading="${i < 10 ? 'eager' : 'lazy'}" decoding="async"
              onerror="this.parentNode.classList.add('is-empty');this.remove()">
          </div>
          <span class="model-name">${escapeHTML(m.nameEn)}</span>
        </a>
      </li>`).join('');
  }

  /* 상세에서 '뒤로가기' 시 스크롤 위치 복원 */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  grid.addEventListener('click', e => {
    if (e.target.closest('a')) sessionStorage.setItem('wb_scroll', window.scrollY);
  });

  loadModels().then(data => {
    models = data;
    render();
    const saved = sessionStorage.getItem('wb_scroll');
    sessionStorage.removeItem('wb_scroll');
    const nav = performance.getEntriesByType('navigation')[0];
    if (saved !== null && nav && nav.type === 'back_forward') window.scrollTo(0, +saved);
    else if (location.hash === '#model') section.scrollIntoView();
  });
})();
