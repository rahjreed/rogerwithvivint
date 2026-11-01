import React, { lazy, Suspense } from 'react';
import { isTruckPath } from './truck.js';

const Hub = lazy(() => import('./Hub.jsx'));
const TruckLanding = lazy(() => import('./TruckLanding.jsx'));

export default function App() {
  return <Suspense fallback={<p role="status" style={{ padding: 24 }}>Loading Roger With Vivint…</p>}>
    {isTruckPath(window.location.pathname) ? <TruckLanding /> : <Hub />}
  </Suspense>;
}
