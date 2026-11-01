import React, { useId, useState, useSyncExternalStore } from 'react';
import { CheckCircle2, Download, Share2 } from 'lucide-react';
import { installController } from './pwa.js';

export default function InstallApp() {
  const state = useSyncExternalStore(installController.subscribe, installController.getSnapshot);
  const [showGuide, setShowGuide] = useState(false);
  const guideId = useId();
  const guideVisible = showGuide || Boolean(state.notice);
  return <section className="install-card content-width" aria-labelledby="install-heading">
    <div className="install-card-main"><img src="/icons/roger-192.png" alt="Roger companion app icon" width="72" height="72" /><div><span className="eyebrow">ROGER, RIGHT ON YOUR HOME SCREEN</span><h2 id="install-heading">Your customer hub, one tap away.</h2><p>Quick access to referrals, Roger’s guidance, and helpful contacts. Add the lightweight app to your Home Screen. An internet connection is needed for current offers, forms, and videos.</p></div>
      {state.installed ? <p className="installed-label" role="status"><CheckCircle2 size={20} /> App installed — look for Roger on your Home Screen.</p> : <button className="primary-button" type="button" disabled={state.busy} aria-expanded={!state.canPrompt ? guideVisible : undefined} aria-controls={guideId} onClick={() => { if (state.canPrompt) installController.install(); else setShowGuide(!showGuide); }}><Download size={18} /> {state.busy ? 'Opening install prompt…' : 'Download App'}</button>}
    </div>
    {!state.installed && <>
      <p className="install-platform-note">{state.ios ? 'On iPhone or iPad, Download App shows Safari’s Add to Home Screen steps.' : 'If your browser supports installation, Download App opens its install prompt when available. Otherwise, see the browser steps.'}</p>
      <p role="status" className="install-status">{state.notice}</p>
      {guideVisible && !state.canPrompt && <div id={guideId} className="install-guide"><h3><Share2 size={18} /> {state.ios ? 'Add Roger with Safari' : 'Add Roger from your browser'}</h3>{state.ios ? <ol><li>Open <strong>rogerwithvivint.com</strong> in Safari.</li><li>Tap <strong>Share</strong>, or open the Page Menu and choose Share.</li><li>Select <strong>Add to Home Screen</strong>.</li><li>If shown, turn on <strong>Open as Web App</strong>, then tap <strong>Add</strong>.</li></ol> : <p>Open this website in Chrome or Edge and use the address-bar install icon or the browser menu’s <strong>Install app</strong> / <strong>Add to Home Screen</strong> option. If no install option appears, this browser may not support installation; you can keep using the website or add a bookmark.</p>}<p>Installed apps open the customer homepage. Truck QR visitors can still open /truck independently.</p></div>}
    </>}
  </section>;
}
