/* The form stays hidden until an activated Formspree endpoint is configured.
 * Native POST keeps Formspree's hosted CAPTCHA and confirmation flow intact.
 * Never display a local success message: only the receiver can confirm delivery.
 */
(function (root) {
  'use strict';
  root.createSiteContact = function ({form, endpoint, labels}) {
    if (!form) return null;
    let url;
    try { url = new URL(String(endpoint || '')); } catch (_) { return null; }
    if (url.origin !== 'https://formspree.io' || !/^\/f\/[a-zA-Z0-9]+$/.test(url.pathname) || url.search || url.hash) return null;
    const button = form.querySelector('[type="submit"]');
    const result = form.querySelector('[role="status"]');
    let copy = labels, sending = false;
    function render() {
      button.textContent = sending ? copy.formSending : copy.formSend;
      button.disabled = sending;
      form.setAttribute('aria-busy', String(sending));
      result.textContent = sending ? copy.formRedirect : '';
    }
    form.action = url.href;
    form.hidden = false;
    form.addEventListener('submit', function (event) {
      if (sending || !form.reportValidity() || form.elements.namedItem('_gotcha').value) {
        event.preventDefault();
        return;
      }
      // No fetch, silent discard, or claimed delivery: continue the real POST.
      sending = true;
      render();
    });
    root.addEventListener('pageshow', function () { sending = false; render(); });
    render();
    return {setLabels(next) { copy = next; render(); }};
  };
})(window);
