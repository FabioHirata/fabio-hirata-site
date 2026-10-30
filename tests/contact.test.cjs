const {test} = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../contact.js'), 'utf8');
function setup(endpoint='https://formspree.io/f/example') {
  const handlers={}, windowHandlers={}, button={}, result={};
  const form={hidden:true,valid:true,trap:{value:''},elements:{namedItem(){return form.trap;}},
    querySelector:s=>s==='[type="submit"]'?button:result,
    reportValidity:()=>form.valid, setAttribute(k,v){this[k]=v;},addEventListener(k,v){handlers[k]=v;}};
  const window={addEventListener(k,v){windowHandlers[k]=v;}};
  vm.runInNewContext(source,{window,URL});
  const api=window.createSiteContact({form,endpoint,labels:{formSend:'Send',formSending:'Sending',formRedirect:'Verify with receiver'}});
  function submit(){const e={prevented:false,preventDefault(){this.prevented=true;}};handlers.submit(e);return e;}
  return {form,button,result,api,submit,windowHandlers};
}
test('unconfigured or unsafe receiver never exposes a working-looking form',()=>{
  for(const endpoint of ['',undefined,'http://formspree.io/f/example','https://evil.example/f/example','https://formspree.io/f/example?x=1','https://formspree.io/f/example#x','https://formspree.io/account']) {
    const e=setup(endpoint===undefined?'':endpoint); assert.equal(e.form.hidden,true);assert.equal(e.api,null);
  }
});
test('activated receiver uses native POST without fabricating success',()=>{
  const e=setup();assert.equal(e.form.hidden,false);assert.equal(e.form.action,'https://formspree.io/f/example');
  assert.equal(e.submit().prevented,false);assert.equal(e.button.disabled,true);assert.equal(e.result.textContent,'Verify with receiver');
  assert.equal(e.submit().prevented,true);
  e.windowHandlers.pageshow();assert.equal(e.button.disabled,false);assert.equal(e.result.textContent,'');
  assert.equal(e.submit().prevented,false);
});
test('invalid fields and honeypot prevent submission',()=>{
  const e=setup();e.form.valid=false;assert.equal(e.submit().prevented,true);assert.equal(e.button.disabled,false);
  e.form.valid=true;e.form.trap.value='spam';assert.equal(e.submit().prevented,true);assert.equal(e.button.disabled,false);
});
test('language updates do not erase content or reset pending send',()=>{
  const e=setup();e.submit();e.api.setLabels({formSend:'Enviar',formSending:'Enviando',formRedirect:'Confirme'});
  assert.equal(e.button.textContent,'Enviando');assert.equal(e.result.textContent,'Confirme');assert.equal(e.button.disabled,true);
});
test('public files contain no phone/WhatsApp and favicon is unchanged',()=>{
  for(const filename of ['index.html','script.js','site-config.js','README.md']) {
    const text=fs.readFileSync(path.join(__dirname,'..',filename),'utf8');
    assert.doesNotMatch(text,/wa\.me|whatsapp|tel:/i);
  }
  const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
  assert.match(html,/favicon\.png\?v=20261028-fh/);assert.match(html,/name="email" type="email"/);assert.match(html,/name="message"[^>]+required/);
});
test('every UI translation exists in Portuguese, Japanese and English',()=>{
  const script=fs.readFileSync(path.join(__dirname,'../script.js'),'utf8');
  const context={};vm.runInNewContext(script.split('function setLanguage')[0]+';this.copy=translations;',context);
  const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
  const keys=[...html.matchAll(/data-i18n(?:-aria)?="([^"]+)"/g)].map(m=>m[1]);
  for(const lang of ['pt','ja','en']) for(const key of keys) assert.equal(typeof context.copy[lang][key],'string',`${lang}.${key}`);
});
