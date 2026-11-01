import React from 'react';
import { usePwaState } from './usePwaState.js';
import { pwaState, updateApp } from './pwa.js';

export default function PwaStatus() {
  const state = usePwaState();
  return <div className="pwa-status-area">
    {!state.online && <p className="pwa-network-note" role="status">You’re offline. Current offers and travel promotions are unavailable. Entries already on this page remain in memory; copy any completed details before leaving or refreshing.</p>}
    {state.registrationFailed && <p className="pwa-network-note" role="status">App setup or update could not finish. You can keep using the website; try again when online.</p>}
    {state.updateReady && <aside className="pwa-update" aria-label="App update available"><div><strong>A new version of Roger is ready.</strong><p>Finish sending or copying any referral or insurance details first. Updating reloads the app and clears entries on this page.</p></div><button className="primary-button" type="button" onClick={updateApp}>Update and reload</button><button className="text-button" type="button" onClick={pwaState.dismissUpdate}>Later</button></aside>}
  </div>;
}
