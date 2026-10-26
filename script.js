const translations = {
  pt: {
    htmlLang: "pt-BR",
    title: "Fabio Hirata — Pessoas, operações e tecnologia",
    description: "Fabio Hirata — entre pessoas, operações e tecnologia. Brasileiro vivendo em Fukui, Japão.",
    skip: "Ir para o conteúdo",
    languageLabel: "Idioma",
    location: "Fukui, Japão",
    heroEyebrow: "Uma apresentação pessoal",
    heroTitle: "Entre pessoas, operações e tecnologia.",
    heroIntro: "Sou Fabio Hirata, brasileiro vivendo no Japão desde 2007. Gosto de entender como as coisas funcionam no dia a dia — e de aproximar pessoas de soluções úteis.",
    heroLink: "Um pouco sobre mim",
    aboutLabel: "TRAJETÓRIA",
    aboutTitle: "Uma trajetória feita de contextos diferentes.",
    aboutP1: "Vivo no Japão desde 2007 e hoje estou em Fukui. Minha experiência passa por suporte e comunicação em contextos com trabalhadores estrangeiros, além de desenvolvimento de sistemas.",
    aboutP2: "Esses caminhos me ensinaram a prestar atenção no que acontece entre uma necessidade real, a rotina de quem trabalha e as ferramentas disponíveis.",
    workLabel: "ONDE ME ENVOLVO",
    workTitle: "Curiosidade que encontra a prática.",
    area1Title: "Pessoas",
    area1Text: "Escuta, comunicação e atenção a diferentes perspectivas.",
    area2Title: "Operações",
    area2Text: "Interesse pelo trabalho como ele realmente acontece.",
    area3Title: "Tecnologia",
    area3Text: "Sistemas simples que podem ajudar comunidades e pequenos negócios.",
    contactLabel: "CONVERSA",
    contactTitle: "Boas conversas começam com boas perguntas.",
    contactText: "Estou pesquisando ideias para um projeto pessoal e aprendendo com quem vive desafios concretos no trabalho. Se nos encontrarmos para conversar, minha intenção é ouvir e entender.",
    contactPending: "Canal público de contato em revisão.",
    footer: "Feito com cuidado em Fukui, Japão.",
    backTop: "Voltar ao início"
  },
  ja: {
    htmlLang: "ja",
    title: "ファビオ・ヒラタ — 人と現場と技術のあいだで",
    description: "ファビオ・ヒラタ。2007年から日本に暮らし、福井を拠点に人、現場、技術に関わっています。",
    skip: "本文へ移動",
    languageLabel: "言語",
    location: "日本・福井",
    heroEyebrow: "自己紹介",
    heroTitle: "人と現場と技術のあいだで。",
    heroIntro: "ファビオ・ヒラタです。ブラジル出身で、2007年から日本で暮らしています。日々の仕事の実際を知り、人と役立つ方法をつなぐことに関心があります。",
    heroLink: "私について",
    aboutLabel: "これまで",
    aboutTitle: "異なる現場を歩んできました。",
    aboutP1: "2007年から日本で暮らし、現在は福井を拠点にしています。外国人労働者に関わる場でのサポートやコミュニケーション、システム開発を経験してきました。",
    aboutP2: "その中で、目の前の課題、働く人の日常、そして使える道具のつながりに目を向けるようになりました。",
    workLabel: "関心のある領域",
    workTitle: "好奇心を、日々の実践へ。",
    area1Title: "人",
    area1Text: "話を聞き、伝え、異なる視点に耳を傾けること。",
    area2Title: "現場",
    area2Text: "仕事が実際にどう進むのかを知ること。",
    area3Title: "技術",
    area3Text: "地域や小さな事業に役立つ、シンプルな仕組み。",
    contactLabel: "対話",
    contactTitle: "よい対話は、よい問いから。",
    contactText: "個人プロジェクトのためにアイデアを調べ、現場で働く方々の経験から学んでいます。お話しする機会があれば、まずは丁寧に聞き、理解したいと考えています。",
    contactPending: "公開用の連絡先は現在検討中です。",
    footer: "福井で、丁寧につくりました。",
    backTop: "ページ上部へ"
  },
  en: {
    htmlLang: "en",
    title: "Fabio Hirata — People, operations and technology",
    description: "Fabio Hirata — connecting people, operations and technology. Brazilian based in Fukui, Japan.",
    skip: "Skip to content",
    languageLabel: "Language",
    location: "Fukui, Japan",
    heroEyebrow: "A personal introduction",
    heroTitle: "Between people, operations and technology.",
    heroIntro: "I'm Fabio Hirata, a Brazilian living in Japan since 2007. I like understanding how things work day to day and connecting people with useful ways forward.",
    heroLink: "A little about me",
    aboutLabel: "MY PATH",
    aboutTitle: "A path shaped by different settings.",
    aboutP1: "I've lived in Japan since 2007 and am now based in Fukui. My experience includes support and communication in settings involving foreign workers, as well as systems development.",
    aboutP2: "Those experiences taught me to pay attention to the space between a real need, people's working routines and the tools at hand.",
    workLabel: "AREAS OF INTEREST",
    workTitle: "Curiosity grounded in practice.",
    area1Title: "People",
    area1Text: "Listening, communicating and making room for different perspectives.",
    area2Title: "Operations",
    area2Text: "Understanding how work actually gets done.",
    area3Title: "Technology",
    area3Text: "Simple systems that may help communities and small businesses.",
    contactLabel: "CONVERSATION",
    contactTitle: "Good conversations start with good questions.",
    contactText: "I'm exploring ideas for a personal project and learning from people who face practical challenges at work. If we have a chance to talk, I'd like to listen and understand.",
    contactPending: "Public contact details are under review.",
    footer: "Made with care in Fukui, Japan.",
    backTop: "Back to top"
  }
};

function setLanguage(language) {
  const lang = Object.hasOwn(translations, language) ? language : "pt";
  const copy = translations[lang];
  document.documentElement.lang = copy.htmlLang;
  document.body.lang = copy.htmlLang;
  document.title = copy.title;
  document.querySelector('meta[name="description"]').content = copy.description;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = copy[element.dataset.i18n];
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    element.setAttribute("aria-label", copy[element.dataset.i18nAria]);
  });
  document.querySelectorAll(".lang-button").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.lang === lang));
  });
  try { localStorage.setItem("fabio-site-language", lang); } catch (_) {}
}

let savedLanguage = "pt";
try { savedLanguage = localStorage.getItem("fabio-site-language") || "pt"; } catch (_) {}
setLanguage(savedLanguage);
document.querySelectorAll(".lang-button").forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});
document.getElementById("year").textContent = String(new Date().getFullYear());

const canvas = document.getElementById("constellation");
const ctx = canvas.getContext("2d");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let particles = [];
let frame = 0;
let rafId = 0;
let width = 0;
let height = 0;
let phase = 0;
let targetPhase = 0;
let mainVisible = true;
const pointer = { x: -1000, y: -1000 };
const sections = ["top", "sobre", "interesses", "conversa"].map((id) => document.getElementById(id));

function random(seed) {
  let x = seed;
  return () => {
    x = (x * 1664525 + 1013904223) >>> 0;
    return x / 4294967296;
  };
}

function resizeCanvas() {
  const bounds = canvas.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = bounds.width;
  height = bounds.height;
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  const rand = random(1407);
  const isMobile = width < 760;
  const count = isMobile ? 480 : 1300;
  particles = Array.from({ length: count }, (_, index) => {
    const cloud = index < count * .9;
    const angle = rand() * Math.PI * 2;
    const radius = Math.sqrt(rand());
    const lobe = 1 + .16 * Math.sin(angle * 3) + .11 * Math.cos(angle * 5);
    const palette = ["#8052ff", "#ffb829", "#15846e", "#d968c2", "#477cff", "#b8a4ff"];
    return {
      cloud,
      angle,
      radius: radius * lobe,
      ambientX: rand(),
      ambientY: rand(),
      size: cloud ? 1 + rand() * 1.4 : .9 + rand() * 1.4,
      color: palette[Math.floor(rand() * palette.length)],
      opacity: cloud ? .35 + rand() * .65 : .12 + rand() * .32,
      phase: rand() * Math.PI * 2,
      speed: .3 + rand() * .7,
      rotation: rand() * Math.PI * 2
    };
  });
  draw();
}

function scenePosition(p, stage, mobile) {
  if (!p.cloud || stage === 3) {
    return { x: p.ambientX * width, y: p.ambientY * height };
  }
  const scenes = mobile
    ? [
        { x: .66, y: .26, rx: .37, ry: .23, twist: 0 },
        { x: .25, y: .43, rx: .37, ry: .29, twist: .8 },
        { x: .7, y: .53, rx: .36, ry: .31, twist: -1.1 }
      ]
    : [
        { x: .78, y: .49, rx: .29, ry: .4, twist: 0 },
        { x: .24, y: .5, rx: .29, ry: .39, twist: .8 },
        { x: .77, y: .5, rx: .31, ry: .39, twist: -1.1 }
      ];
  const s = scenes[stage];
  const a = p.angle + s.twist * (1 - p.radius);
  const r = stage === 2 ? .48 + p.radius * .52 : p.radius;
  return {
    x: (s.x + Math.cos(a) * r * s.rx) * width,
    y: (s.y + Math.sin(a) * r * s.ry) * height
  };
}

function updateScrollPhase() {
  if (reduceMotion.matches) return;
  const anchors = sections.map((section) => section.offsetTop);
  const y = window.scrollY + height * .32;
  let next = 0;
  for (let i = 0; i < anchors.length - 1; i++) {
    if (y >= anchors[i]) next = i;
    if (y >= anchors[i] && y < anchors[i + 1]) {
      next = i + (y - anchors[i]) / (anchors[i + 1] - anchors[i]);
      break;
    }
  }
  if (y >= anchors[anchors.length - 1]) next = 3;
  targetPhase = Math.max(0, Math.min(3, next));
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  const isMobile = width < 760;
  const stage = Math.min(2, Math.floor(phase));
  const mix = Math.max(0, Math.min(1, phase - stage));
  const opacityByScene = [1, .47, .48, .16];
  const sceneOpacity = opacityByScene[stage] * (1 - mix) + opacityByScene[stage + 1] * mix;
  particles.forEach((p) => {
    const from = scenePosition(p, stage, isMobile);
    const to = scenePosition(p, stage + 1, isMobile);
    let x = from.x * (1 - mix) + to.x * mix;
    let y = from.y * (1 - mix) + to.y * mix;
    const drift = reduceMotion.matches ? 0 : Math.sin(frame * .004 * p.speed + p.phase) * 3;
    const fade = reduceMotion.matches ? 1 : .9 + Math.sin(frame * .008 * p.speed + p.phase) * .1;
    x += drift;
    y -= drift * .6;
    if (!reduceMotion.matches) {
      const dx = x - pointer.x;
      const dy = y - pointer.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 110 && distance > 0) {
        const force = ((110 - distance) / 110) ** 2 * 18;
        x += dx / distance * force;
        y += dy / distance * force;
      }
    }
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.opacity * fade * (p.cloud ? sceneOpacity : .42);
    ctx.strokeStyle = p.color;
    ctx.lineWidth = .9;
    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.lineTo(p.size * .85, p.size * .7);
    ctx.lineTo(-p.size * .85, p.size * .7);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  });
}

function animate() {
  frame++;
  if (frame % 2 === 0) {
    phase += (targetPhase - phase) * .075;
    draw();
  }
  rafId = requestAnimationFrame(animate);
}
function syncMotion() {
  cancelAnimationFrame(rafId);
  if (reduceMotion.matches) phase = 0;
  draw();
  if (!reduceMotion.matches && !document.hidden && mainVisible) rafId = requestAnimationFrame(animate);
}
resizeCanvas();
updateScrollPhase();
syncMotion();
window.addEventListener("resize", () => { resizeCanvas(); updateScrollPhase(); }, { passive: true });
window.addEventListener("scroll", updateScrollPhase, { passive: true });
window.addEventListener("pointermove", (event) => { pointer.x = event.clientX; pointer.y = event.clientY; }, { passive: true });
window.addEventListener("pointerleave", () => { pointer.x = -1000; pointer.y = -1000; });
document.addEventListener("visibilitychange", syncMotion);
reduceMotion.addEventListener("change", () => { updateScrollPhase(); syncMotion(); });
new IntersectionObserver(([entry]) => {
  mainVisible = entry.isIntersecting;
  syncMotion();
}).observe(document.querySelector("main"));
