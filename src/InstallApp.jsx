import React, { useId, useState, useSyncExternalStore } from 'react';
import { CheckCircle2, Download, Share2 } from 'lucide-react';
import { installController } from './pwa.js';

export default function InstallApp() {
  const state = useSyncExternalStore(installController.subscribe, installController.getSnapshot);
  const [showGuide, setShowGuide] = useState(false);
  const guideId = useId();
  const guideVisible = showGuide && !state.canPrompt && !state.busy;
  const showDownload = state.canPrompt || state.ios || state.busy;
  return <section className="install-card content-width" aria-labelledby="install-heading">
    <div className="install-card-main"><img src="/icons/roger-192.png" alt="Roger companion app icon" width="72" height="72" /><div><span className="eyebrow">ROGER, RIGHT ON YOUR HOME SCREEN</span><h2 id="install-heading">Your customer hub, one tap away.</h2><p>Quick access to referrals, Roger’s guidance, and helpful contacts. Add the lightweight app to your Home Screen. An internet connection is needed for current offers, forms, and videos.</p></div>
      {state.installed ? <p className="installed-label" role="status"><CheckCircle2 size={20} /> App installed — look for Roger on your Home Screen.</p> : showDownload && <button className="primary-button" type="button" disabled={state.busy} aria-expanded={state.ios ? guideVisible : undefined} aria-controls={state.ios ? guideId : undefined} onClick={() => {
        if (state.canPrompt) {
          // Invoke directly in the click handler; never wait for setup or a timer.
          installController.install();
          setShowGuide(false);
        } else if (state.ios) setShowGuide(!showGuide);
      }}><Download size={18} /> {state.busy ? 'Opening install prompt…' : 'Download App'}</button>}
    </div>
    {!state.installed && <>
      {!state.ios && !state.canPrompt && !state.busy && <div className="install-fallback">
        {!state.notice && <p className="install-platform-note">Your browser hasn’t offered an install prompt yet.</p>}
        <button className="text-button" type="button" aria-expanded={guideVisible} aria-controls={guideId} onClick={() => setShowGuide(!showGuide)}>{guideVisible ? 'Hide installation options' : 'Installation options'}</button>
      </div>}
      <p role="status" className="install-status">{state.notice}</p>
      {guideVisible && <div id={guideId} className="install-guide"><h3><Share2 size={18} /> {state.ios ? 'Add Roger with Safari' : 'Installation options'}</h3>{state.ios ? <p>In <strong>Safari</strong>, tap <strong>Share</strong> → <strong>Add to Home Screen</strong> → <strong>Add</strong>. Turn on <strong>Open as Web App</strong> if shown.</p> : <p>In Chrome on Android, open <strong>⋮</strong> → <strong>Add to Home screen</strong> / <strong>Install app</strong>, if offered. Using an in-app browser? Open this page in Chrome. Already installed? Look for Roger on your Home Screen.</p>}</div>}
    </>}
  </section>;
}
