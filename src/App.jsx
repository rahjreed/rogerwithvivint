import React, { lazy, Suspense } from 'react';
import { isTruckPath } from './truck.js';
import { isHolidayPath } from './holiday.js';
import PwaStatus from './PwaStatus.jsx';

const Hub = lazy(() => import('./Hub.jsx'));
const TruckLanding = lazy(() => import('./TruckLanding.jsx'));
const CostaRica = lazy(() => import('./CostaRica.jsx'));

export default function App() {
  return <><PwaStatus /><Suspense fallback={<p role="status" style={{ padding: 24 }}>Loading Roger With Vivint…</p>}>
    {/^\/costa-rica\/?$/.test(window.location.pathname) ? <CostaRica /> : isHolidayPath(window.location.pathname) ? <TruckLanding holiday /> : isTruckPath(window.location.pathname) ? <TruckLanding /> : <Hub />}
  </Suspense></>;
}
