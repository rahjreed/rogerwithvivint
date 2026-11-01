import { useSyncExternalStore } from 'react';
import { pwaState } from './pwa.js';
export const usePwaState = () => useSyncExternalStore(pwaState.subscribe, pwaState.getSnapshot);
