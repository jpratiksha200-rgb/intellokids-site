/* Show/hide password: an eye button inside every password field (owner, 2026-11-15). Shared by the app (js/app.js,
   passwordToggles) and the owner dashboard (workspaceadmin/, js/admin.js), so both look and behave the same:
   44×44 button on the end side of the field, aria-pressed, labels "Show password" / "Hide password", starts hidden,
   never submits the form, keeps the cursor in the field, and hides the password again when the form is sent.
   PwEye.attach(root, label): label(on) returns the text for the button (on = the password is visible). */
(function () {
  const EYE = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
  const EYE_OFF = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.6 5.1A10.4 10.4 0 0 1 12 5c6.4 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.1M6.6 6.6C3.8 8.4 2 12 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/><path d="M3 3l18 18"/></svg>';
  const english = on => (on ? 'Hide password' : 'Show password');
  function attach(root, label) {
    label = label || english;
    root.querySelectorAll('input[type="password"]:not([data-pw])').forEach(input => {
      input.dataset.pw = '1';
      const wrap = document.createElement('span'); wrap.className = 'pw-wrap';
      input.parentNode.insertBefore(wrap, input); wrap.appendChild(input);
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'pw-eye';
      const show = on => {
        input.type = on ? 'text' : 'password';
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        b.setAttribute('aria-label', label(on));
        b.title = label(on);
        b.innerHTML = on ? EYE_OFF : EYE;
      };
      show(false);
      b.addEventListener('mousedown', e => e.preventDefault()); // keep the focus (and cursor) in the field
      b.addEventListener('click', e => {
        e.preventDefault();
        const focused = document.activeElement === input, s = input.selectionStart, end = input.selectionEnd;
        show(input.type === 'password');
        if (focused) { try { input.setSelectionRange(s, end); } catch (x) { /* ignore */ } }
      });
      wrap.appendChild(b);
      if (input.form) input.form.addEventListener('submit', () => show(false), true);
    });
  }
  window.PwEye = { attach };
})();
