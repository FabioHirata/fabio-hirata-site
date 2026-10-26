const fs=require('fs'),vm=require('vm'),assert=require('assert');
const source=fs.readFileSync(require('node:path').join(__dirname,'../script.js'),'utf8').split('const canvas =')[1];
function environment(w,h,reduced) {
 const handlers={},drawCalls={count:0};
 const ctx=new Proxy({}, {get:(o,k)=>o[k]||(()=>{if(k==='stroke')drawCalls.count++;}),set:(o,k,v)=>(o[k]=v,true)});
 const sections=['top','sobre','interesses','conversa'].map((id,i)=>({id,offsetTop:i*1000}));
 const canvas={getContext:()=>ctx,getBoundingClientRect:()=>({width:w,height:h})};
 let raf=0;
 const media={matches:reduced,addEventListener:(n,f)=>handlers.media=f};
 const document={hidden:false,body:{dataset:{}},getElementById:id=>id==='constellation'?canvas:sections.find(x=>x.id===id),querySelector:()=>({}),querySelectorAll:()=>[],addEventListener:(n,f)=>handlers[n]=f};
 const window={devicePixelRatio:3,scrollY:0,matchMedia:()=>media,addEventListener:(n,f)=>handlers[n]=f};
 const c=vm.createContext({document,window,requestAnimationFrame:()=>++raf,cancelAnimationFrame:()=>{},IntersectionObserver:class{observe(){}},Math,console});
 vm.runInContext('const canvas ='+source,c);
 return {c,handlers,window,media,document,canvas,raf:()=>raf,drawCalls};
}
const results=[];
for (const [w,h] of [[390,844],[1280,900]]) for(const reduced of [false,true]) {
 const e=environment(w,h,reduced),c=e.c;
 assert(e.canvas.width<=w*2,'DPR cap');
 if(reduced)assert.equal(e.raf(),0,'Reduced motion must not start RAF');
 for(let scene=0;scene<4;scene++){
  vm.runInContext(`phase=${scene};frame=90;draw();`,c);
  const data=vm.runInContext(`particles.map(p=>scenePosition(p,${scene},${w<760})).map(p=>({x:p.x,y:p.y,z:p.z,alpha:p.alpha,glow:p.glow,scale:p.scale}))`,c);
  assert(data.every(p=>Object.values(p).every(Number.isFinite)),'finite projection');
  assert(data.every(p=>p.scale>0&&p.scale<3.5&&p.glow>=0&&p.glow<=.81),'bounded geometry');
 }
 const geometric=vm.runInContext(`({count:particles.length,ambient:particles.filter(p=>!p.cloud).length,brainDepth:Math.max(...particles.filter(p=>p.cloud).map(p=>p.brain.z))-Math.min(...particles.filter(p=>p.cloud).map(p=>p.brain.z)),bubbleDepth:Math.max(...particles.filter(p=>p.cloud).map(p=>p.bubble.z))-Math.min(...particles.filter(p=>p.cloud).map(p=>p.bubble.z))})`,c);
 let cursorPeak=0;
 if(!reduced){
  cursorPeak=vm.runInContext(`phase=2;pointer.strength=1;let peak=0;for(let step=0;step<160;step++){frame+=2;pointer.x=${w}*.235+Math.sin(step*.25)*80;pointer.y=${h}*.5+Math.cos(step*.31)*60;draw();peak=Math.max(peak,...particles.map(p=>Math.hypot(p.offsetX,p.offsetY)));}pointer.strength=0;for(let step=0;step<90;step++)draw();peak`,c);
  assert(cursorPeak<2.3,'Cursor displacement remains subtle');
  const residual=vm.runInContext('Math.max(...particles.map(p=>Math.hypot(p.offsetX,p.offsetY)))',c);
  assert(residual<.001,'Cursor settles after exit');
  const rafBefore=e.raf();e.document.hidden=true;e.handlers.visibilitychange();assert.equal(e.raf(),rafBefore,'Hidden page starts no RAF');
 }
 results.push({width:w,reducedMotion:reduced,...geometric,cursorPeak:+cursorPeak.toFixed(3)});
}
console.log(JSON.stringify({passed:true,results},null,2));

const reports=[];
for(const [w,h] of [[320,800],[390,844],[1280,900]]) {
 const e=environment(w,h,false);
 const result=vm.runInContext(`
 let maxStep=0,maxSwitch=0,minX=Infinity,maxX=-Infinity,states=new Set(),peakAt=0;
 const sample=particles.filter(p=>p.cloud&&p.bubbleRole==='surface'&&p.index%17===0);
 let previous=null;
 for(let t=0;t<=3600;t+=2){
  frame=t;states.add(dialogueCycle(t).state);
  const points=sample.map(p=>scenePosition(p,3,${w<760}));
  points.forEach((q,i)=>{if(['separate','idea'].includes(dialogueCycle(t).state)){minX=Math.min(minX,q.x);maxX=Math.max(maxX,q.x);}if(previous){const step=Math.hypot(q.x-previous[i].x,q.y-previous[i].y)/2;if(step>maxStep){maxStep=step;peakAt=t;}}});
  previous=points;
 }
 for(const boundary of [1800*.41,1800,1800*1.41,3600]){
  frame=boundary-.001;const before=sample.map(p=>scenePosition(p,3,${w<760}));
  frame=boundary+.001;const after=sample.map(p=>scenePosition(p,3,${w<760}));
  after.forEach((q,i)=>maxSwitch=Math.max(maxSwitch,Math.hypot(q.x-before[i].x,q.y-before[i].y)));
 }
 // Reversing scroll must settle on the original scene with no new animation loop.
 frame=800;const snapshot=JSON.stringify(sample.map(p=>scenePosition(p,3,${w<760})));
 for(const position of [3,2.5,2,1.5,1,.5,0,.5,1,1.5,2,2.5,3]){phase=position;draw();}
 const unchanged=snapshot===JSON.stringify(sample.map(p=>scenePosition(p,3,${w<760})));
 ({maxStep,maxSwitch,minX,maxX,states:[...states],unchanged,peakAt})`,e.c);
 assert(result.maxStep<12,'burst has bounded travel below twelve CSS pixels per 60 Hz frame');
 assert(result.maxSwitch<.02,'no jump on exchange or cycle boundary');
 assert(result.minX>=0&&result.maxX<=w,'balloon surface fits mobile/desktop');
 assert.equal(result.states.length,4);assert(result.unchanged);
 const reduced=environment(w,h,true);
 assert.equal(vm.runInContext('dialogueCycle(800).fusion',reduced.c),0);
 assert.equal(reduced.raf(),0);
 reports.push({width:w,...result});
}
console.log(JSON.stringify({passed:true,reports},null,2));

const filamentReports=[];
for(const [w,h] of [[320,800],[390,844],[1280,900]]) {
 const e=environment(w,h,false);
 const result=vm.runInContext(`
 phase=3;frame=720;
 const localPaths=filamentPaths[${w<760}?'mobile':'desktop'];
 const inside=localPaths.every(path=>path.points.every(p=>Math.hypot(p.x,p.z)<bulbRadius(p.y)*.9));
 const segments=filamentSegments(${w<760});
 const points=segments.flatMap(s=>[s.from,s.to]);
 const finite=points.every(p=>Object.values(p).every(Number.isFinite));
 const fits=points.every(p=>p.x>=0&&p.x<=width&&p.y>=0&&p.y<=height);
 const depth=Math.max(...points.map(p=>p.z))-Math.min(...points.map(p=>p.z));
 let maxHeatStep=0,priorHeat=0;
 for(let t=0;t<3600;t++){const heat=filamentHeat(t);maxHeatStep=Math.max(maxHeatStep,Math.abs(heat-priorHeat));priorHeat=heat;}
 const heatDuring=[0,.16,.305,.35,.40,.445,.48,.60,.8].map(p=>filamentHeat(p*1800));
 const neutral=JSON.stringify(segments);
 motionFrame={tiltX:.8,tiltY:-.6};const tilted=filamentSegments(${w<760});
 const followsTilt=neutral!==JSON.stringify(tilted);
 motionFrame={tiltX:0,tiltY:0};
 for(const position of [3,2.8,2.5,2,1,0,1,2,2.8,3]){phase=position;draw();}
 phase=3;frame=720;const restored=neutral===JSON.stringify(filamentSegments(${w<760}));
 phase=2;const otherScene=filamentSegments(${w<760}).length;
 ({inside,finite,fits,depth,maxHeatStep,heatDuring,followsTilt,restored,otherScene,segments:segments.length})`,e.c);
 assert(result.inside&&result.finite&&result.fits,'filament fits inside the bulb and viewport');
 assert(result.depth>.1,'filament has real depth');
 assert(result.maxHeatStep<.03,'heat is gradual, without flashes');
 assert.deepEqual(Array.from(result.heatDuring),[0,0,0,1,1,1,0,0,0]);
 assert(result.followsTilt&&result.restored,'shared projection and scroll return are stable');
 assert.equal(result.otherScene,0);
 const reduced=environment(w,h,true);
 assert.equal(vm.runInContext(`phase=3;frame=720;filamentSegments(${w<760}).length`,reduced.c),0);
 filamentReports.push({width:w,...result});
}
console.log(JSON.stringify({filamentPassed:true,filamentReports},null,2));
