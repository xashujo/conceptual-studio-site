// Enquiry form: inline validation, Web3Forms when a key is set, otherwise a pre-filled email.
const form = document.querySelector('[data-enquiry]');
if (form) {
  const status = form.querySelector('[data-status]');
  const submit = form.querySelector('[data-submit]');
  const params = new URLSearchParams(location.search);
  const svc = form.querySelector('[data-service-select]');
  const tier = form.querySelector('[data-tier-input]');
  if (params.get('service') && svc) svc.value = params.get('service');
  if (params.get('tier') && tier) tier.value = params.get('tier');

  const messages = { valueMissing: 'Please fill this in.', typeMismatch: 'Please enter a valid email address.' };
  const check = (el) => {
    const ok = el.checkValidity();
    el.setAttribute('aria-invalid', String(!ok));
    let err = el.parentElement.querySelector('.error');
    if (!ok) {
      if (!err) { err = document.createElement('span'); err.className = 'error'; err.id = el.id + '-error'; el.parentElement.append(err); }
      err.textContent = el.validity.typeMismatch ? messages.typeMismatch : messages.valueMissing;
      el.setAttribute('aria-describedby', [el.getAttribute('aria-describedby'), err.id].filter(Boolean).join(' '));
    } else if (err) err.remove();
    return ok;
  };
  form.querySelectorAll('[required]').forEach((el) => el.addEventListener('blur', () => el.value && check(el)));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fields = [...form.querySelectorAll('[required]')];
    const bad = fields.filter((el) => !check(el));
    if (bad.length) { bad[0].focus(); status.dataset.state = 'error'; status.textContent = 'A few details are missing.'; return; }
    const data = new FormData(form);
    if (data.get('botcheck')) return;
    if (form.dataset.key !== 'yes') {
      const body = ['name', 'email', 'organisation', 'service', 'tier', 'budget', 'needed_by', 'formal_quote', 'message']
        .map((k) => (data.get(k) ? `${k.replace('_', ' ')}: ${data.get(k)}` : '')).filter(Boolean).join('\n');
      location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent('New project: ' + (data.get('organisation') || ''))}&body=${encodeURIComponent(body)}`;
      return;
    }
    submit.disabled = true; submit.textContent = 'Sending…'; status.dataset.state = ''; status.textContent = '';
    try {
      const res = await fetch(form.action, { method: 'POST', headers: { Accept: 'application/json' }, body: data });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      form.reset(); submit.textContent = 'Sent'; status.textContent = 'Thank you. I’ll reply within one working day.';
    } catch {
      submit.disabled = false; submit.textContent = 'Send enquiry'; status.dataset.state = 'error';
      status.textContent = `That didn’t go through. Please email ${form.dataset.email} instead.`;
    }
  });
}
