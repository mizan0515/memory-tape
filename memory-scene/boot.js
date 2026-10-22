// Catch the remote module graph before the viewer's own initialization begins.
// Network exception strings may contain remote URLs; readers get one safe message.
import('./render-policy.js').then(({rendererProfile}) => {
  const canvas=document.createElement('canvas');
  const gl=canvas.getContext('webgl2',{powerPreference:'high-performance'})||canvas.getContext('webgl');
  const debug=gl?.getExtension('WEBGL_debug_renderer_info');
  const name=gl?(debug?gl.getParameter(debug.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER)):'WebGL unavailable';
  document.documentElement.dataset.webglRenderer=name;
  gl?.getExtension('WEBGL_lose_context')?.loseContext();
  const selection=new URLSearchParams(location.search).get('render');
  const reference=['gaussian','lod-reference'].includes(selection);
  const images=selection==='images'||!reference&&(!gl||rendererProfile(name).source==='prerender-video');
  return import(images?'./image-viewer.js':'./viewer.js');
}).catch(() => {
  const message = '3D 모듈을 불러오지 못했습니다. 본문으로 계속 읽을 수 있습니다.';
  document.getElementById('loading').hidden = true;
  document.getElementById('error').hidden = false;
  document.getElementById('errorText').textContent = message;
  document.body.dataset.event = 'error';
  window.dispatchEvent(new CustomEvent('memory-tape:error', { detail: { message } }));
  if (parent !== window) {
    parent.postMessage({ channel: 'memory-tape', version: 1, event: 'error', message }, location.origin);
  }
});
