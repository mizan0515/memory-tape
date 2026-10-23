// CVA host around the pinned Act 5 scene; the scene alone owns its camera.
try {
  const {assetUrl} = await import('../memory-scene/assets.js');
  const scene = new URL('../memory-scene/scene.html', import.meta.url);
  const mediaBase = new URLSearchParams(location.search).get('media-base');
  if (mediaBase) scene.searchParams.set('media-base', mediaBase);
  window.ELIO_MEMORY_CONFIG = {sceneUrl:scene.href, canonicalUrl:location.pathname + '#principles',
    unitTitle:'어젯밤의 뭇별들', momentQuotes:{}};
  const poster = document.createElement('img');
  poster.id = 'elio-memory-poster'; poster.className = 'elio-memory__poster';
  poster.alt = ''; poster.setAttribute('aria-hidden', 'true');
  poster.decoding = 'async'; poster.fetchPriority = 'high';
  poster.src = assetUrl('approach_0000');
  document.getElementById('elio-memory-scene').after(poster);
  document.querySelectorAll('[data-memory-asset]').forEach(image => { image.src = assetUrl(image.dataset.memoryAsset); });
  document.querySelectorAll('[data-memory-download]').forEach(link => { link.href = assetUrl(link.dataset.memoryDownload); });
  // Making-of inputs stay with the explicitly published media, outside the CVA ZIP.
  const makingBase = new URL('../making-assets/', import.meta.url);
  document.querySelectorAll('[data-memory-making]').forEach(image => {
    image.src = new URL(image.dataset.memoryMaking, makingBase).href;
  });
  document.querySelectorAll('[data-cva-doc]').forEach(link => {
    link.href = new URL('../docs/' + link.dataset.cvaDoc, import.meta.url).href;
  });
  await import('./overlay.js');
  document.querySelectorAll('[data-reopen-memory]').forEach(button => {
    button.addEventListener('click', () => document.getElementById('elio-memory-reopen').click());
  });
} catch (error) {
  window.ELIO_MEMORY_STARTUP?.();
  const notice = document.createElement('p');
  notice.className = 'memory-noscript'; notice.setAttribute('role', 'status');
  notice.textContent = '장면 모듈을 연결하지 못했습니다. 아래 제작 노트는 계속 읽을 수 있습니다.';
  document.getElementById('elio-memory-reader').prepend(notice);
  console.error('Memory host could not start', error);
}
