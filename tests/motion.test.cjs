const assert=require('node:assert/strict');
const create=require('../motion.js');
class Events {
 constructor(){this.handlers=new Map();this.dataset={};this.attrs={};}
 addEventListener(n,f){if(!this.handlers.has(n))this.handlers.set(n,new Set());this.handlers.get(n).add(f);}
 removeEventListener(n,f){this.handlers.get(n)?.delete(f);}
 emit(n,e={}){return Promise.all([...this.handlers.get(n)||[]].map(f=>f(e)));}
 count(n){return this.handlers.get(n)?.size||0;}
 setAttribute(n,v){this.attrs[n]=v;}
}
function setup({grant='granted',orientation=true,motion=true,secure=true,reduced=false,request=true}={}) {
 const w=new Events(),d=new Events(),b=new Events(),m=new Events(),status={};let t=1000,asks=0,selection='';const timers=new Map();let id=0;
 Object.assign(w,{document:d,scrollY:0,isSecureContext:secure,screen:{orientation:{angle:0}},performance:{now:()=>t},getSelection:()=>selection,setTimeout:f=>{timers.set(++id,f);return id;},clearTimeout:id=>timers.delete(id)});
 const api=()=>request?{requestPermission:()=>{asks++;return Promise.resolve(typeof grant==='function'?grant(asks):grant);}}:{};
 if(orientation)w.DeviceOrientationEvent=api();if(motion)w.DeviceMotionEvent=api();
 m.matches=reduced;d.hidden=false;
 const labels=Object.fromEntries(['enable','disable','pendingButton','idle','pending','waiting','active','paused','denied','unavailable','insecure','reduced'].map(k=>[k,k]));
 const c=create({button:b,status,reduceMotion:m,labels,env:w,doc:d});
 return {w,d,b,m,status,c,asks:()=>asks,tick:ms=>{t+=ms;return c.sample();},timers,select:s=>selection=s};
}
(async()=>{
 const e=setup();assert.equal(e.asks(),0);assert.equal(e.w.count('deviceorientation'),0);
 const first=e.b.emit('click');const double=e.b.emit('click');await Promise.all([first,double]);assert.equal(e.asks(),2);assert.equal(e.w.count('deviceorientation'),1);assert.equal(e.w.count('devicemotion'),1);
 await e.w.emit('deviceorientation',{beta:30,gamma:10});assert.deepEqual(e.tick(100),{tiltX:0,tiltY:0});
 await e.w.emit('deviceorientation',{beta:180,gamma:170});let f=e.tick(30);assert(f.tiltX>0&&f.tiltX<.2);for(let i=0;i<20;i++)f=e.tick(100);assert(f.tiltX<=1&&f.tiltY<=1);
 e.w.screen.orientation.angle=90;await e.w.emit('deviceorientation',{beta:180,gamma:170});for(let i=0;i<30;i++)f=e.tick(100);assert(Math.abs(f.tiltX)<.0001,'orientation change recalibrates');
 const accel=async x=>e.w.emit('devicemotion',{acceleration:{x,y:0,z:0}});
 await accel(4);e.tick(110);await accel(0);await accel(-4);e.tick(320);const impulse=e.c.offset(100,100,0,0);assert(Math.hypot(impulse.x,impulse.y)>27.9&&Math.hypot(impulse.x,impulse.y)<=28);assert.equal(e.c.offset(100,100,1,0).x,0,'only subset affected');
 const displaced=Array.from({length:100},(_,i)=>e.c.offset(100,100,i,i));assert.equal(displaced.filter(p=>Math.hypot(p.x,p.y)>1).length,25,'visible scatter remains a minority of the form');
 await accel(0);await accel(5);e.tick(110);await accel(0);await accel(-5);e.tick(1700);assert(Math.abs(e.c.offset(100,100,0,0).x)<.01,'cooldown prevents stacked impulses and the form settles');
 const blank={closest:()=>null},link={closest:()=>({})};const pointer=(target=blank)=>({pointerType:'touch',isPrimary:true,pointerId:1,clientX:100,clientY:100,target});
 async function tap(target=blank,scroll=false,drag=false,selection=false){await e.d.emit('pointerdown',pointer(target));if(scroll)e.w.scrollY+=100;if(drag)await e.d.emit('pointermove',{...pointer(target),clientX:140});if(selection)e.select('selected');e.tick(50);await e.d.emit('pointerup',pointer(target));e.tick(500);return e.c.offset(202.5,100,1,0).x;}
 assert(await tap()>6,'wave is visible beyond the immediate touch point');e.tick(1500);assert.equal(await tap(link),0,'link untouched');assert.equal(await tap(blank,true),0,'scroll ignored');assert.equal(await tap(blank,false,true),0,'drag ignored');assert.equal(await tap(blank,false,false,true),0,'selection ignored');e.select('');
 e.d.hidden=true;await e.d.emit('visibilitychange');assert.equal(e.w.count('deviceorientation'),0);assert.equal(e.d.count('pointerdown'),0);assert.equal(e.b.dataset.state,'paused');
 e.d.hidden=false;await e.d.emit('visibilitychange');assert.equal(e.w.count('deviceorientation'),1);assert.equal(e.asks(),2,'resume without new prompt');
 await e.b.emit('click');assert.equal(e.w.count('devicemotion'),0);await e.b.emit('click');assert.equal(e.asks(),2,'second activation reuses consent in memory');assert.equal(e.w.count('devicemotion'),1);
 e.m.matches=true;await e.m.emit('change');assert.equal(e.w.count('devicemotion'),0);assert.equal(e.d.count('pointerdown'),0);assert(e.b.disabled);assert.deepEqual(e.c.offset(10,10,0,0),{x:0,y:0});
 e.m.matches=false;await e.m.emit('change');assert.equal(e.w.count('deviceorientation'),0,'reduced-motion opt-out does not re-enable sensors automatically');
 e.c.destroy();assert.equal(e.b.count('click'),0);assert.equal(e.d.count('pointerdown'),0);assert.equal(e.m.count('change'),0);
 for(const [options,state] of [[{grant:'denied'},'denied'],[{orientation:false,motion:false},'unavailable'],[{secure:false},'insecure'],[{reduced:true},'reduced']]){
 const x=setup(options);await x.b.emit('click');assert.equal(x.b.dataset.state,state);assert.equal(x.w.count('deviceorientation'),0);const asks=x.asks();await x.b.emit('click');assert.equal(x.asks(),asks);x.c.destroy();
 }
 const absent=setup({request:false});await absent.b.emit('click');for(const f of [...absent.timers.values()])f();assert.equal(absent.b.dataset.state,'unavailable');assert.equal(absent.w.count('deviceorientation'),0);absent.c.destroy();
 const gravity=setup({orientation:false,request:false});await gravity.b.emit('click');await gravity.w.emit('devicemotion',{acceleration:null,accelerationIncludingGravity:{x:0,y:0,z:9.8}});gravity.tick(150);await gravity.w.emit('devicemotion',{acceleration:null,accelerationIncludingGravity:{x:6,y:0,z:9.8}});gravity.tick(150);await gravity.w.emit('devicemotion',{acceleration:null,accelerationIncludingGravity:{x:0,y:0,z:9.8}});gravity.tick(100);await gravity.w.emit('devicemotion',{acceleration:null,accelerationIncludingGravity:{x:-6,y:0,z:9.8}});gravity.tick(825);assert(gravity.c.offset(0,0,0,0).x>20);gravity.c.destroy();
 // Isolated jolts must not trigger the larger effect. Rapid taps stay bounded,
 // including while shaking; every affected point must settle after the cycle.
 const stress=setup({request:false});await stress.b.emit('click');
 const stressAccel=x=>stress.w.emit('devicemotion',{acceleration:{x,y:0,z:0}});
 await stressAccel(5);stress.tick(320);assert.deepEqual(stress.c.offset(100,100,0,0),{x:0,y:0},'a single jolt is not a shake');
 await stressAccel(0);stress.tick(400);await stressAccel(-5);stress.tick(320);assert.deepEqual(stress.c.offset(100,100,0,0),{x:0,y:0},'widely separated jolts do not combine');
 await stressAccel(0);await stressAccel(5);stress.tick(110);await stressAccel(0);await stressAccel(-5);
 for(let i=0;i<12;i++){await stress.d.emit('pointerdown',pointer());stress.tick(30);await stress.d.emit('pointerup',pointer());}
 let peakCombined=0,peakTap=0,largestStep=0,prior=null;
 for(let t=0;t<2300;t+=16){stress.tick(16);const points=Array.from({length:40},(_,i)=>stress.c.offset(100+i*8,100,i,i*.3));
  points.forEach((p,i)=>{const amplitude=Math.hypot(p.x,p.y);peakCombined=Math.max(peakCombined,amplitude);if(i%4)peakTap=Math.max(peakTap,amplitude);if(prior)largestStep=Math.max(largestStep,Math.hypot(p.x-prior[i].x,p.y-prior[i].y));});prior=points;}
 assert(peakCombined<=42.00001&&peakTap<=18.00001,'rapid input cannot accumulate unbounded displacement');assert(largestStep<5,'visible effects stay temporally smooth');
 assert(prior.every(p=>p.x===0&&p.y===0),'all effects return to zero');
 await stressAccel(0);await stressAccel(5);stress.tick(110);await stressAccel(0);await stressAccel(-5);stress.tick(320);assert(Math.hypot(...Object.values(stress.c.offset(100,100,0,0)))>27,'shake works again after cooldown');
 stress.d.hidden=true;await stress.d.emit('visibilitychange');stress.d.hidden=false;await stress.d.emit('visibilitychange');assert.deepEqual(stress.c.offset(100,100,0,0),{x:0,y:0},'hidden page clears impulses');stress.c.destroy();
 console.log(JSON.stringify({peakCombined:+peakCombined.toFixed(2),peakTap:+peakTap.toFixed(2),largestStep:+largestStep.toFixed(2)}));
 let resolvePermission;const delayed=setup({grant:()=>new Promise(r=>{resolvePermission=r;}),motion:false});
 const activation=delayed.b.emit('click');delayed.m.matches=true;await delayed.m.emit('change');resolvePermission('granted');await activation;assert.equal(delayed.w.count('deviceorientation'),0,'reduced motion cancels pending activation');delayed.c.destroy();
 let release;const disposed=setup({grant:()=>new Promise(r=>{release=r;}),motion:false});const inflight=disposed.b.emit('click');disposed.c.destroy();release('granted');await inflight;assert.equal(disposed.w.count('deviceorientation'),0,'destroy cancels pending activation');
 console.log('PASS: consent, allow/deny/unavailable/insecure, neutral calibration, clamp/smoothing, rotation, shake/debounce/cooldown/gravity, tap/link/scroll/selection, repeated activation, visibility, reduced motion and teardown.');
})().catch(e=>{console.error(e);process.exitCode=1});
