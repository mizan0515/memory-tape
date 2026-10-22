const response = await fetch(new URL('./assets.json', import.meta.url));
if (!response.ok) throw Error('Asset manifest HTTP ' + response.status);
export const assets = await response.json();

// Public deployment reads its matching content-addressed media beside this code.
// Standalone previews may override the public base; no media bytes are bundled.
const PUBLIC_MEDIA_BASE = new URL('../media/', import.meta.url).href;
const configuredBase = new URLSearchParams(location.search).get('media-base');
const mediaBase = new URL(configuredBase || PUBLIC_MEDIA_BASE, location.href);
if (!mediaBase.pathname.endsWith('/')) mediaBase.pathname += '/';

export function assetUrl(name) {
  const asset = assets.files[name];
  if (!asset) throw Error('Unknown Memory asset');
  return new URL(`memory-tape/${asset.sha256}/${asset.filename}`, mediaBase).href;
}
