const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const read=name=>fs.readFileSync(path.join(__dirname,'..',name),'utf8');
const source=read('script.js');
const prefix=source.split('const canvas =')[0];
function setup(config,lang='pt') {
 const nodes={};
 const get=id=>nodes[id]||=( {hidden:true, dataset:{},setAttribute(k,v){this[k]=v;}} );
 const labels=['linkedin','github'].map(x=>Object.assign(get(x+'-link'),{dataset:{i18nAria:x+'Aria',i18nTitle:x+'Aria'}}));
 const document={documentElement:{},body:{},getElementById:get,querySelector:()=>get('status'),querySelectorAll:selector=>selector==='[data-i18n-aria]'||selector==='[data-i18n-title]'?labels:[]};
 const window={siteConfig:config};
 const context=vm.createContext({document,window,URL,localStorage:{getItem:()=>lang,setItem(){}},Date});
 vm.runInContext(prefix,context);return {nodes,context};
}
test('no public email or mailto in served text files',()=>{
 for(const file of ['index.html','script.js','site-config.js','contact.js','styles.css','motion.js']) assert.doesNotMatch(read(file),/mailto:|fabiohiratapl@gmail\.com|publicEmail/);
});
test('both official profile links, translated accessible names and tooltips',()=>{
 const c={window:{}};vm.runInNewContext(read('site-config.js'),c);
 assert.equal(c.window.siteConfig.contactFormEndpoint,'https://formspree.io/f/xyeepqzj');
 for(const lang of ['pt','ja','en']) {
  const {nodes,context}=setup(c.window.siteConfig,lang);
  for(const brand of ['linkedin','github']) {
   const node=nodes[brand+'-link'];assert.equal(node.hidden,false);assert.ok(node['aria-label'].includes(brand==='github'?'GitHub':'LinkedIn'));assert.equal(node.title,node['aria-label']);
  }
  assert.equal(nodes['linkedin-link'].href,'https://www.linkedin.com/in/fabiohiratafelismino/');
  assert.equal(nodes['github-link'].href,'https://github.com/FabioHirata');
  vm.runInContext("setLanguage('ja');setLanguage('en');setLanguage('pt')",context);
  assert.match(nodes['github-link'].title,/Ver perfil/);
 }
});
test('invalid profile destinations stay hidden',()=>{
 for(const url of ['javascript:alert(1)','http://github.com/FabioHirata','https://github.com.evil.test/FabioHirata','https://github.com/FabioHirata/repo','invalid']) {
 const {nodes}=setup({githubUrl:url});assert.equal(nodes['github-link'].hidden,true);assert.equal(nodes['contact-links'].hidden,true);
 }
});
test('logos are decorative, links remain keyboard focusable with generous targets',()=>{
 const html=read('index.html');assert.equal((html.match(/class="contact-logo"/g)||[]).length,2);
 for(const brand of ['linkedin','github'])assert.match(html,new RegExp('id="'+brand+'-link"[^>]+rel="noopener noreferrer"'));
 assert.match(read('styles.css'),/width: 48px; height: 48px/);
 assert.match(read('styles.css'),/a:focus-visible/);
});
