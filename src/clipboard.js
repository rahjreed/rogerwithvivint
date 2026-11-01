export async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch { /* Some devices deny clipboard access; try the selection fallback. */ }
  const previousFocus = document.activeElement;
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('aria-label', 'Details to copy');
  area.style.cssText = 'position:fixed;left:0;top:0;opacity:0;font-size:16px;';
  document.body.appendChild(area);
  let success = false;
  try {
    area.focus();
    area.select();
    area.setSelectionRange(0, text.length);
    success = document.execCommand('copy');
  } catch { success = false; }
  finally {
    area.remove();
    previousFocus?.focus({ preventScroll: true });
  }
  return success;
}
