/* CONTACT 문의 폼 → Google Apps Script(메일 발송 + 구글 시트 저장) */
(function () {
  const CFG = window.SITE_CONFIG;
  const form = document.getElementById('contactForm');
  const status = document.getElementById('contactForm').querySelector('.form-status');
  const btn = form.querySelector('.send-btn');
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function say(msg, type) {
    status.textContent = msg;
    status.className = 'form-status' + (type ? ' is-' + type : '');
  }
  function mark(el, bad) { el.closest('.field, .agree').classList.toggle('is-invalid', bad); }

  form.addEventListener('input', e => {
    const f = e.target.closest('.field, .agree');
    if (f) f.classList.remove('is-invalid');
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const v = n => form.elements[n].value.trim();
    const data = {
      name: v('name'), email: v('email'), phone: v('phone'), message: v('message'),
      agree: form.elements.agree.checked, website: v('website'), page: location.href
    };

    /* 입력 확인 */
    const checks = [
      ['name', !data.name, '이름을 입력해 주세요.'],
      ['email', !EMAIL_RE.test(data.email), '이메일 주소를 정확히 입력해 주세요.'],
      ['phone', data.phone && !/^[0-9+\-\s()]{6,}$/.test(data.phone), '전화번호는 숫자와 - 만 입력해 주세요.'],
      ['message', !data.message, '메시지를 입력해 주세요.'],
      ['agree', !data.agree, '개인정보 수집·이용에 동의해 주세요.']
    ];
    checks.forEach(([n, bad]) => mark(form.elements[n], !!bad));
    const first = checks.find(c => c[1]);
    if (first) { say(first[2], 'error'); form.elements[first[0]].focus(); return; }

    if (!CFG.CONTACT_ENDPOINT) {
      say('아직 메일 전송이 연결되지 않았습니다. (config.js 의 CONTACT_ENDPOINT 설정 필요)', 'error');
      return;
    }

    btn.disabled = true; btn.textContent = 'SENDING…'; say('');
    try {
      /* text/plain 으로 보내야 Apps Script 가 추가 확인 없이 받을 수 있습니다 */
      const res = await fetch(CFG.CONTACT_ENDPOINT, { method: 'POST', body: JSON.stringify(data) });
      const out = await res.json();
      if (!out.ok) throw new Error(out.error || 'failed');
      form.reset();
      say('메시지가 전송되었습니다. 확인 후 연락드리겠습니다. THANK YOU.', 'done');
    } catch (err) {
      console.warn('[contact]', err);
      say(err.message === 'too_many'
        ? '잠시 후 다시 시도해 주세요.'
        : '전송하지 못했습니다. 잠시 후 다시 시도하시거나 team_aistudio@wisebirds.com 으로 메일 주세요.', 'error');
    } finally {
      btn.disabled = false; btn.textContent = 'SEND';
    }
  });
})();
