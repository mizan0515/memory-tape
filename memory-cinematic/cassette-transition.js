// Vector outline from the current 3D camera, never an enlarged saved bitmap.
// Reading reveals the page; watch masks only 3D onto its handoff light.
import {convexOutline,roundedOutlinePath} from '../memory-scene/cassette-outline.js';
const NS='http://www.w3.org/2000/svg';
const clamp=value=>Math.max(0,Math.min(1,value));
const smooth=value=>{const t=clamp(value);return t*t*(3-2*t);};

export function createCassetteTransition(root,document,{inverse=false,watchGlow=false}={}){
  const node=(name,attrs={},parent)=>{const el=document.createElementNS(NS,name);for(const [key,value] of Object.entries(attrs))el.setAttribute(key,String(value));parent?.append(el);return el;};
  const svg=node('svg',{'aria-hidden':'true',width:0,height:0,style:'position:fixed;pointer-events:none'});
  const defs=node('defs',{},svg);
  const filter=node('filter',{id:'elio-cassette-feather',filterUnits:'userSpaceOnUse','color-interpolation-filters':'sRGB'},defs);
  const blur=node('feGaussianBlur',{stdDeviation:1},filter);
  const mask=node('mask',{id:'elio-cassette-cutout',maskUnits:'userSpaceOnUse',maskContentUnits:'userSpaceOnUse',style:'mask-type:luminance'},defs);
  const white=node('rect',{fill:'white'},mask);
  const softened=node('g',{filter:'url(#elio-cassette-feather)'},mask);
  const expanded=node('g',{},softened),shape=node('path',{fill:'black'},expanded);
  // The cassette clears before the broad optical wave clears its surroundings.
  // Keep two opacity clocks rather than blurring one opening until both vanish.
  const coreFilter=!inverse?node('filter',{id:'elio-cassette-core',filterUnits:'userSpaceOnUse','color-interpolation-filters':'sRGB'},defs):null;
  const coreBlur=coreFilter?node('feGaussianBlur',{stdDeviation:1},coreFilter):null;
  const core=coreFilter?node('g',{filter:'url(#elio-cassette-core)'},mask):null;
  const coreExpanded=core?node('g',{},core):null;
  const coreShape=coreExpanded?node('path',{fill:'black'},coreExpanded):null;
  // Paint the halo in a visible SVG, rather than a CSS mask on a composited div.
  // The local unblurred cutout keeps the light off the cassette surface.
  const glowSvg=watchGlow?node('svg',{'aria-hidden':'true',class:'elio-memory__cassette-glow',preserveAspectRatio:'none'},root):null;
  const glowDefs=glowSvg?node('defs',{},glowSvg):null;
  const glowFilter=glowDefs?node('filter',{id:'elio-cassette-glow-feather',filterUnits:'userSpaceOnUse','color-interpolation-filters':'sRGB'},glowDefs):null;
  const glowBlur=glowFilter?node('feGaussianBlur',{stdDeviation:1},glowFilter):null;
  const glowMask=glowDefs?node('mask',{id:'elio-cassette-glow',maskUnits:'userSpaceOnUse',maskContentUnits:'userSpaceOnUse',style:'mask-type:luminance'},glowDefs):null;
  const glowBackground=glowMask?node('rect',{fill:'white'},glowMask):null;
  const glowCutout=glowMask?node('path',{fill:'black'},glowMask):null;
  const glowOutside=glowSvg?node('g',{mask:'url(#elio-cassette-glow)'},glowSvg):null;
  const glowSoft=glowOutside?node('g',{filter:'url(#elio-cassette-glow-feather)'},glowOutside):null;
  const glowExpanded=glowSoft?node('g',{},glowSoft):null;
  const glowShape=glowExpanded?node('path',{fill:'#b6d9f4'},glowExpanded):null;
  document.body.append(svg);
  root.style.setProperty('--memory-entry-mask','url("#elio-cassette-cutout")');
  function clear(){shape.removeAttribute('d');coreShape?.removeAttribute('d');glowShape?.removeAttribute('d');glowCutout?.removeAttribute('d');root.style.setProperty('--memory-glow-opacity','0');root.classList.remove('is-entering');delete root.dataset.silhouette;}
  function update(entry,points,timing=null){
    const outline=convexOutline(points);
    const w=root.clientWidth||1,h=root.clientHeight||1,path=roundedOutlinePath(outline,w,h);
    if(!path){clear();return false;}
    const xs=outline.map(p=>p.x*w),ys=outline.map(p=>p.y*h);
    const x=(Math.min(...xs)+Math.max(...xs))/2,y=(Math.min(...ys)+Math.max(...ys))/2;
    const bw=Math.max(...xs)-Math.min(...xs),bh=Math.max(...ys)-Math.min(...ys);
    const spread=inverse?clamp(entry/.62):timing?clamp(timing.spread):clamp((entry-.24)/.76),growth=spread*spread;
    const cover=Math.max(w/Math.max(1,bw),h/Math.max(1,bh))*4;
    const initial=inverse?1.05:.94,scale=initial+(cover-initial)*growth;
    // Start with a genuinely soft edge; the optical band becomes much wider as
    // the cassette-shaped opening spreads across the remaining black margins.
    const feather=Math.max(12,Math.min(w,h)*.035)+Math.hypot(w,h)*.18*smooth(spread);
    for(const element of [filter,mask,white]){element.setAttribute('x',0);element.setAttribute('y',0);element.setAttribute('width',w);element.setAttribute('height',h);}
    shape.setAttribute('d',path);
    expanded.setAttribute('transform',`translate(${x} ${y}) scale(${scale}) translate(${-x} ${-y})`);
    softened.setAttribute('opacity',inverse?smooth(entry/.18):timing?smooth(timing.surroundings):smooth((entry-.18)/.40));blur.setAttribute('stdDeviation',feather);
    if(core){
      for(const element of [coreFilter]){element.setAttribute('x',0);element.setAttribute('y',0);element.setAttribute('width',w);element.setAttribute('height',h);}
      coreShape.setAttribute('d',path);
      const amount=smooth(timing?timing.core:entry/.38),coreScale=.98+.24*amount;
      coreExpanded.setAttribute('transform',`translate(${x} ${y}) scale(${coreScale}) translate(${-x} ${-y})`);
      core.setAttribute('opacity',amount);
      coreBlur.setAttribute('stdDeviation',Math.max(4,Math.min(bw,bh)*.035));
    }
    if(glowMask){
      glowSvg.setAttribute('viewBox',`0 0 ${w} ${h}`);
      for(const element of [glowFilter,glowMask,glowBackground]){element.setAttribute('x',0);element.setAttribute('y',0);element.setAttribute('width',w);element.setAttribute('height',h);}
      glowShape.setAttribute('d',path);glowCutout.setAttribute('d',path);
      const haloScale=1.06+.10*clamp(timing?.glow||0);
      glowExpanded.setAttribute('transform',`translate(${x} ${y}) scale(${haloScale}) translate(${-x} ${-y})`);
      glowBlur.setAttribute('stdDeviation',Math.max(18,Math.min(bw,bh)*.18));
    }
    root.style.setProperty('--memory-light-x',`${x}px`);root.style.setProperty('--memory-light-y',`${y}px`);
    root.dataset.silhouette='vector';return true;
  }
  return {update,clear};
}
