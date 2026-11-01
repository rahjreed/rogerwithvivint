export const appManifest = {
  id: '/',
  name: 'Roger With Vivint',
  short_name: 'Roger',
  description: 'Your personal connection to Roger Reed: referrals, smart home guidance, and customer resources.',
  lang: 'en-US',
  start_url: '/#home',
  scope: '/',
  display: 'standalone',
  theme_color: '#05080e',
  background_color: '#05080e',
  icons: [
    { src: '/icons/roger-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: '/icons/roger-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: '/icons/roger-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
  prefer_related_applications: false,
};

export const pwaOptions = {
  strategies: 'injectManifest',
  srcDir: 'src',
  filename: 'sw.js',
  scope: '/',
  registerType: 'prompt',
  injectRegister: false,
  includeAssets: [],
  includeManifestIcons: false,
  manifest: appManifest,
  injectManifest: {
    globPatterns: ['assets/*.{js,css}', 'icons/*.png', 'offline.html'],
    globIgnores: ['**/*.map'],
    maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,
    // No app HTML, promotion pages, remote media, or runtime data caches.
  },
  devOptions: { enabled: false },
};
