/* Optional, ephemeral device input. No sensor value is stored or transmitted. */
(function (root) {
  function createSiteMotion({button, status, reduceMotion, labels, env = root, doc = env.document}) {
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const now = () => env.performance.now();
    let copy = labels, state = "idle", enabled = false, pending = false, destroyed = false;
    let permission = null, generation = 0, sensorAttached = false, touchAttached = false;
    let neutral = null, gravity = null, targetX = 0, targetY = 0, tiltX = 0, tiltY = 0;
    let previousSample = now(), lastMotion = 0, peakAt = -Infinity, peakHigh = false;
    let shakeAt = -Infinity, lastShake = -Infinity, watchdog = 0, received = false;
    let contact = null, ripples = [], currentTime = now();
    const available = () => Boolean(env.DeviceOrientationEvent || env.DeviceMotionEvent);
    const eligible = () => !destroyed && !doc.hidden && !reduceMotion.matches;
    const blocked = () => reduceMotion.matches ? "reduced" : !env.isSecureContext ? "insecure" : !available() ? "unavailable" : null;
    function render() {
      const shown = blocked() || (enabled && doc.hidden ? "paused" : state);
      button.textContent = pending ? copy.pendingButton : enabled ? copy.disable : copy.enable;
      button.disabled = pending || Boolean(blocked()) || ["denied", "unavailable"].includes(state);
      button.setAttribute("aria-pressed", String(enabled));
      button.dataset.state = shown;
      const activeMode=shown==="active" && permission && !(permission.orientation && permission.motion)
        ? (permission.orientation?"activeTilt":"activeShake") : shown;
      status.textContent = copy[activeMode] || copy[shown] || copy.idle;
    }
    function resetEffects() {
      neutral = gravity = contact = null;
      targetX = targetY = tiltX = tiltY = 0;
      peakAt = shakeAt = -Infinity; peakHigh = false; lastMotion = 0;
      ripples = []; previousSample = now();
    }
    function markReceived() {
      if (received) return;
      received = true; env.clearTimeout(watchdog); state = "active"; render();
    }
    const angularDifference = (v, origin) => ((v-origin+540)%360)-180;
    function orientation(event) {
      if (!eligible() || !enabled || !Number.isFinite(event.beta) || !Number.isFinite(event.gamma)) return;
      markReceived();
      const screenAngle = env.screen?.orientation?.angle ?? env.orientation ?? 0;
      if (!neutral || neutral.angle !== screenAngle) neutral = {beta:event.beta, gamma:event.gamma, angle:screenAngle};
      const x = clamp(angularDifference(event.gamma, neutral.gamma)/18, -1, 1);
      const y = clamp(angularDifference(event.beta, neutral.beta)/18, -1, 1);
      const angle = screenAngle*Math.PI/180;
      targetX = clamp(x*Math.cos(angle)+y*Math.sin(angle), -1, 1);
      targetY = clamp(y*Math.cos(angle)-x*Math.sin(angle), -1, 1);
    }
    function motion(event) {
      if (!eligible() || !enabled) return;
      let a = event.acceleration;
      const finiteVector = (v) => v && [v.x, v.y, v.z].every(Number.isFinite);
      const stamp = now(), dt = lastMotion ? clamp(stamp-lastMotion, 1, 100) : 16;
      lastMotion = stamp;
      if (!finiteVector(a)) {
        const total = event.accelerationIncludingGravity;
        if (!finiteVector(total)) return;
        if (!gravity) gravity = {x:total.x, y:total.y, z:total.z};
        const gain = 1-Math.exp(-dt/280);
        for (const axis of ["x", "y", "z"]) gravity[axis] += (total[axis]-gravity[axis])*gain;
        a = {x:total.x-gravity.x, y:total.y-gravity.y, z:total.z-gravity.z};
      }
      markReceived();
      const strength = Math.hypot(a.x, a.y, a.z);
      if (strength < 1.7) peakHigh = false;
      // Two separated peaks avoid treating a tilt or a single jolt as a shake.
      if (strength > 3.4 && !peakHigh) {
        peakHigh = true;
        if (stamp-peakAt >= 90 && stamp-peakAt < 650 && stamp-lastShake > 2600) {
          shakeAt = lastShake = stamp; peakAt = -Infinity;
        } else peakAt = stamp;
      }
    }
    function detachSensors() {
      env.removeEventListener("deviceorientation", orientation);
      env.removeEventListener("devicemotion", motion);
      env.clearTimeout(watchdog); sensorAttached = false;
    }
    function attachSensors() {
      if (sensorAttached || !eligible() || !enabled) return;
      received = false; neutral = gravity = null;
      if (permission.orientation) env.addEventListener("deviceorientation", orientation, {passive:true});
      if (permission.motion) env.addEventListener("devicemotion", motion, {passive:true});
      sensorAttached = true;
      watchdog = env.setTimeout(() => {
        if (!received && enabled && eligible()) {
          enabled = false; state = "unavailable"; detachSensors(); resetEffects(); render();
        }
      }, 3000);
    }
    const excluded = (target) => Boolean(target?.closest?.("a,button,input,textarea,select,label,[contenteditable],p,h1,h2,h3,nav,.section-meta,.site-footer"));
    function pointerDown(event) {
      if (!eligible() || !["touch", "pen"].includes(event.pointerType) || !event.isPrimary || excluded(event.target)) return;
      contact = {id:event.pointerId, x:event.clientX, y:event.clientY, scroll:env.scrollY, at:now()};
    }
    function pointerMove(event) {
      if (contact?.id === event.pointerId && Math.hypot(event.clientX-contact.x,event.clientY-contact.y)>10) contact=null;
    }
    function pointerUp(event) {
      const start = contact; contact = null;
      if (!start || start.id!==event.pointerId || !eligible() || excluded(event.target)) return;
      if (now()-start.at>350 || Math.abs(env.scrollY-start.scroll)>4 || Math.hypot(event.clientX-start.x,event.clientY-start.y)>10 || String(env.getSelection?.()||"")) return;
      ripples.push({x:event.clientX, y:event.clientY, at:now()});
      ripples = ripples.slice(-2);
    }
    function pointerCancel() { contact = null; }
    const touchHandlers = {pointerdown:pointerDown, pointermove:pointerMove, pointerup:pointerUp, pointercancel:pointerCancel};
    function sync() {
      if (!eligible()) {
        detachSensors(); resetEffects();
        if (touchAttached) for (const [name, handler] of Object.entries(touchHandlers)) doc.removeEventListener(name, handler);
        touchAttached = false;
      } else {
        attachSensors();
        if (!touchAttached) for (const [name, handler] of Object.entries(touchHandlers)) doc.addEventListener(name, handler, {passive:true});
        touchAttached = true;
      }
      render();
    }
    async function toggle() {
      if (destroyed || pending || blocked() || ["denied", "unavailable"].includes(state)) return;
      if (enabled) {
        enabled = false; generation++; state = "idle";
        detachSensors(); resetEffects(); render(); return;
      }
      pending = true; state = "pending"; const attempt = ++generation; render();
      // Both permission calls originate in this click, before any await.
      const request = (type) => {
        if (!type) return Promise.resolve("unavailable");
        try { return typeof type.requestPermission === "function" ? Promise.resolve(type.requestPermission()).catch(()=>"denied") : Promise.resolve("granted"); }
        catch (_) { return Promise.resolve("denied"); }
      };
      if (!permission) {
        const responses = await Promise.all([request(env.DeviceOrientationEvent), request(env.DeviceMotionEvent)]);
        if (destroyed || attempt!==generation) return;
        permission = {orientation:responses[0]==="granted", motion:responses[1]==="granted"};
      }
      pending = false;
      if (reduceMotion.matches) { state="idle"; sync(); return; }
      enabled = permission.orientation || permission.motion;
      state = enabled ? "waiting" : "denied";
      resetEffects(); sync();
    }
    function preferenceChanged() {
      if (reduceMotion.matches) {generation++; pending=false; enabled=false; state="idle";}
      sync();
    }
    button.addEventListener("click", toggle);
    doc.addEventListener("visibilitychange", sync);
    reduceMotion.addEventListener("change", preferenceChanged);
    sync();
    return {
      setLabels(value) {copy=value; render();},
      sample() {
        currentTime = now();
        const gain = 1-Math.exp(-Math.min(100,currentTime-previousSample)/190);
        previousSample = currentTime;
        tiltX += (targetX-tiltX)*gain; tiltY += (targetY-tiltY)*gain;
        ripples = ripples.filter(r=>currentTime-r.at<1800);
        return {tiltX, tiltY};
      },
      offset(x, y, index, seed) {
        if (!eligible()) return {x:0,y:0};
        let dx=0, dy=0;
        const age=(currentTime-shakeAt)/1000;
        if (index%4===0 && age>=0 && age<2) {
          // A visible release followed by a longer, smooth reconstruction.
          // Detection thresholds stay unchanged; only the visual response grows.
          const progress=age<.32 ? age/.32 : (2-age)/1.68;
          const envelope=progress*progress*(3-2*progress);
          const direction=seed+.3*Math.sin(Math.PI*age/2);
          dx=Math.cos(direction)*28*envelope; dy=Math.sin(direction)*28*envelope;
        }
        for (const ripple of ripples) {
          const t=(currentTime-ripple.at)/1000, distance=Math.hypot(x-ripple.x,y-ripple.y);
          const wave=Math.exp(-(((distance-t*205)/42)**2))*Math.sin(Math.PI*Math.min(1,t/1.8))*9;
          dx+=(x-ripple.x)/Math.max(1,distance)*wave;
          dy+=(y-ripple.y)/Math.max(1,distance)*wave;
        }
        // Repeated taps and a concurrent shake stay bounded without adding energy.
        const limit=Math.min(1,42/Math.max(1,Math.hypot(dx,dy)));
        return {x:dx*limit,y:dy*limit};
      },
      destroy() {
        destroyed=true; enabled=false; generation++; pending=false;
        detachSensors(); resetEffects();
        for (const [name, handler] of Object.entries(touchHandlers)) doc.removeEventListener(name, handler);
        button.removeEventListener("click", toggle);
        doc.removeEventListener("visibilitychange", sync);
        reduceMotion.removeEventListener("change", preferenceChanged);
      }
    };
  }
  if (typeof module !== "undefined" && module.exports) module.exports = createSiteMotion;
  else root.createSiteMotion = createSiteMotion;
})(typeof window !== "undefined" ? window : globalThis);
