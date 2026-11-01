import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const PANEL_PLAY_URL = 'https://player.mediadelivery.net/play/587199/eaa2d055-1343-4c49-bb9d-3ee2852d574c';
export const PANEL_EMBED_URL = 'https://player.mediadelivery.net/embed/587199/eaa2d055-1343-4c49-bb9d-3ee2852d574c?autoplay=false&loop=false&muted=false&preload=none';

export default function PanelTutorial() {
  return <article className="panel-tutorial"><div><span className="eyebrow">ROGER’S PERSONAL WALKTHROUGH</span><h2>How to Use Your Vivint Smart Hub</h2><p>Watch Roger walk you through the basics of using your Vivint security panel so you can feel confident operating your new system.</p></div><div className="tutorial-player"><iframe src={PANEL_EMBED_URL} title="Roger’s Vivint Smart Hub tutorial" loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /></div><a className="text-button" href={PANEL_PLAY_URL} target="_blank" rel="noopener noreferrer">Open Video <ArrowUpRight size={16} /></a></article>;
}
