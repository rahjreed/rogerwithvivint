import React, { lazy, Suspense } from 'react';
import { isTruckPath } from './truck.js';
import PwaStatus from './PwaStatus.jsx';

const Hub = lazy(() => import('./Hub.jsx'));
const TruckLanding = lazy(() => import('./TruckLanding.jsx'));

export default function App() {
  return <><PwaStatus /><Suspense fallback={<p role="status" style={{ padding: 24 }}>Loading Roger With Vivint…</p>}>
    {isTruckPath(window.location.pathname) ? <TruckLanding /> : <Hub />}
  </Suspense></>;
}
