/* 공통: 스크롤 시 GNB 반투명 배경 + TOP 버튼 */
(function () {
  const header = document.querySelector('.site-header');
  const topBtn = document.querySelector('.top-btn');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 10);
    if (topBtn) topBtn.classList.toggle('is-visible', y > window.innerHeight * 0.6);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (topBtn) topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });

  window.escapeHTML = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
})();
