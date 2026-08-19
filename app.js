// ══════════════════════════════════════════════════════════
// TabNest 🪺 — Application Logic & Engine
// ══════════════════════════════════════════════════════════
const STORAGE_KEY = 'tabnest_v1';
const COLORS = [
  {name:'amber',  hex:'#F59E0B'},{name:'teal',   hex:'#14B8A6'},
  {name:'rose',   hex:'#F43F5E'},{name:'violet', hex:'#8B5CF6'},
  {name:'sky',    hex:'#0EA5E9'},{name:'emerald',hex:'#10B981'},
  {name:'orange', hex:'#F97316'},{name:'pink',   hex:'#EC4899'},
  {name:'indigo', hex:'#6366F1'},{name:'lime',   hex:'#84CC16'},
];
const EMOJIS = ['📁','🎯','🔗','💡','🎮','📚','🎵','🛒','💼','🌐','🔬','🎨','📱','🏠','✈️','⚡','🧪','🎭','🔥','🌙'];
const FAVICON = url => { try{const d=new URL(url).hostname;return `https://www.google.com/s2/favicons?domain=${d}&sz=64`;}catch{return '';} };

const DEFAULT_DATA = {
  groups: [
    { id: 'g-ai', name: 'AI & Tools', color: '#8B5CF6', emoji: '🤖', order: 1 },
    { id: 'g-anime', name: 'Anime & Manga', color: '#F43F5E', emoji: '🎬', order: 2 },
    { id: 'g-drama', name: 'Drama & Streams', color: '#F59E0B', emoji: '🍿', order: 3 },
    { id: 'g-dev', name: 'Dev & Tech', color: '#14B8A6', emoji: '💻', order: 4 },
    { id: 'g-college', name: 'College & Learning', color: '#0EA5E9', emoji: '🎓', order: 5 },
    { id: 'g-design', name: 'Design & 3D', color: '#EC4899', emoji: '🎨', order: 6 },
    { id: 'g-media', name: 'Music & Social', color: '#F97316', emoji: '🎵', order: 7 }
  ],
  links: [
    // 🤖 AI & Tools
    { id: 'l-chatgpt', groupId: 'g-ai', title: 'ChatGPT', url: 'https://chatgpt.com/', note: 'OpenAI conversational assistant', faviconUrl: 'https://www.google.com/s2/favicons?domain=chatgpt.com&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 1 },
    { id: 'l-claude', groupId: 'g-ai', title: 'Claude AI', url: 'https://claude.ai/new', note: 'Anthropic AI assistant', faviconUrl: 'https://www.google.com/s2/favicons?domain=claude.ai&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 2 },
    { id: 'l-gemini', groupId: 'g-ai', title: 'Google Gemini', url: 'https://gemini.google.com/u/1/app?pageId=none', note: 'Google multimodal model', faviconUrl: 'https://www.google.com/s2/favicons?domain=gemini.google.com&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 3 },
    { id: 'l-perplexity', groupId: 'g-ai', title: 'Perplexity AI', url: 'https://www.perplexity.ai/', note: 'AI-powered search engine', faviconUrl: 'https://www.google.com/s2/favicons?domain=perplexity.ai&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 4 },
    { id: 'l-aistudio', groupId: 'g-ai', title: 'Google AI Studio', url: 'https://aistudio.google.com/', note: 'Prototyping with Gemini models', faviconUrl: 'https://www.google.com/s2/favicons?domain=aistudio.google.com&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 5 },
    { id: 'l-napkin', groupId: 'g-ai', title: 'Napkin AI', url: 'https://www.napkin.ai/', note: 'Turn text into visuals', faviconUrl: 'https://www.google.com/s2/favicons?domain=napkin.ai&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 6 },
    { id: 'l-aiforwork', groupId: 'g-ai', title: 'AI for Work', url: 'https://www.aiforwork.co/', note: 'AI prompts & workflows', faviconUrl: 'https://www.google.com/s2/favicons?domain=aiforwork.co&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 7 },
    { id: 'l-aiprep', groupId: 'g-ai', title: 'AIPrep', url: 'https://www.aiprep.in/', note: 'AI learning & interview prep', faviconUrl: 'https://www.google.com/s2/favicons?domain=aiprep.in&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 8 },
    { id: 'l-staying', groupId: 'g-ai', title: 'Staying Ahead', url: 'https://stayingahead.com/', note: 'Free AI community on WhatsApp', faviconUrl: 'https://www.google.com/s2/favicons?domain=stayingahead.com&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 9 },
    { id: 'l-creao', groupId: 'g-ai', title: 'Creao AI', url: 'https://creao.ai/', note: 'Build AI-native apps without code', faviconUrl: 'https://www.google.com/s2/favicons?domain=creao.ai&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 10 },

    // 🎬 Anime & Manga
    { id: 'l-anikoto', groupId: 'g-anime', title: 'Anikoto Stream', url: 'https://anikoto.cz/home', note: 'HD anime online with Sub & Dub', faviconUrl: 'https://www.google.com/s2/favicons?domain=anikoto.cz&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 1 },
    { id: 'l-anikotod', groupId: 'g-anime', title: 'Anikoto Domains', url: 'https://anikoto.site/#domains', note: 'Official mirror domains', faviconUrl: 'https://www.google.com/s2/favicons?domain=anikoto.site&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 2 },
    { id: 'l-gogoanime', groupId: 'g-anime', title: 'GogoAnime', url: 'https://gogoanimes.cv/', note: 'Anime streaming portal', faviconUrl: 'https://www.google.com/s2/favicons?domain=gogoanimes.cv&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 3 },
    { id: 'l-mangadex', groupId: 'g-anime', title: 'MangaDex', url: 'https://mangadex.org/search?q=Jobless+reincarnation+', note: 'Manga reader & community', faviconUrl: 'https://www.google.com/s2/favicons?domain=mangadex.org&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 4 },
    { id: 'l-alya', groupId: 'g-anime', title: 'Alya Sometimes Hides Her Feelings in Russian', url: 'https://mangafire.to/title/m6nz-alya-sometimes-hides-her-feelings-in-russian/volume/240899', note: 'MangaFire chapter reader', faviconUrl: 'https://www.google.com/s2/favicons?domain=mangafire.to&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 5 },
    { id: 'l-secretary', groupId: 'g-anime', title: 'Try to Tame Me, Secretary Cha', url: 'https://mangafire.to/title/xvry8-try-to-tame-me-secretary-chaa/chapter/1783134', note: 'MangaFire webtoon reader', faviconUrl: 'https://www.google.com/s2/favicons?domain=mangafire.to&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 6 },
    { id: 'l-mangaup', groupId: 'g-anime', title: 'Manga UP! — Love Unseen', url: 'https://global.manga-up.com/search/result?word=Love%20Unseen%20Beneath%20the%20Clear%20Night%20Sky', note: 'Manga UP reader', faviconUrl: 'https://www.google.com/s2/favicons?domain=global.manga-up.com&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 7 },
    { id: 'l-animesalt', groupId: 'g-anime', title: 'Anime Salt (Telugu)', url: 'https://animesalt.link/category/language/telugu/', note: 'Telugu dubbed anime series', faviconUrl: 'https://www.google.com/s2/favicons?domain=animesalt.link&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 8 },
    { id: 'l-mal', groupId: 'g-anime', title: 'MyAnimeList — Fall 2026', url: 'https://myanimelist.net/anime/season/2026/fall', note: 'Seasonal anime database', faviconUrl: 'https://www.google.com/s2/favicons?domain=myanimelist.net&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 9 },
    { id: 'l-enma', groupId: 'g-anime', title: 'Enma Anime', url: 'https://www.enma.lol/home', note: 'HiAnime & AniWatch alternative', faviconUrl: 'https://www.google.com/s2/favicons?domain=enma.lol&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 10 },
    { id: 'l-toonverse', groupId: 'g-anime', title: 'Daytime Star — ToonVerse', url: 'https://toonverse.net/read/daytime-star/73', note: 'ToonVerse webtoon reader', faviconUrl: 'https://www.google.com/s2/favicons?domain=toonverse.net&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 11 },
    { id: 'l-everythingmoe', groupId: 'g-anime', title: 'EverythingMoe', url: 'https://everythingmoe.com/', note: 'Index of best Anime/Manga sites', faviconUrl: 'https://www.google.com/s2/favicons?domain=everythingmoe.com&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 12 },
    { id: 'l-comix', groupId: 'g-anime', title: 'Toumei na Yoru ni Kakeru-kun', url: 'https://comix.ws/title/6g38-toumei-na-yoru-ni-kakeru-kun-to-me-ni-mienai-koi-wo-shita', note: 'Comix reader', faviconUrl: 'https://www.google.com/s2/favicons?domain=comix.ws&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 13 },
    { id: 'l-eminence', groupId: 'g-anime', title: 'The Eminence in Shadow', url: 'https://anikoto.cz/watch/the-eminence-in-shadow-pqsq0/ep-6', note: 'Anikoto Episode stream', faviconUrl: 'https://www.google.com/s2/favicons?domain=anikoto.cz&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 14 },

    // 🍿 Drama & Streams
    { id: 'l-kisskh', groupId: 'g-drama', title: 'KissKH', url: 'https://kisskh.nl/', note: 'Asian drama & anime stream', faviconUrl: 'https://www.google.com/s2/favicons?domain=kisskh.nl&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 1 },
    { id: 'l-kisskhis', groupId: 'g-drama', title: 'KissKH — What Lies Beneath', url: 'https://kisskh.is/', note: 'KissKH mirror', faviconUrl: 'https://www.google.com/s2/favicons?domain=kisskh.is&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 2 },
    { id: 'l-forever', groupId: 'g-drama', title: 'Forever and Ever Ep 15', url: 'https://kisskh.is/Drama/Forever-and-Ever---One-and-Only-2/Episode-15?id=3629&ep=75505&page=0&pageSize=100', note: 'KissKH drama episode', faviconUrl: 'https://www.google.com/s2/favicons?domain=kisskh.is&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 3 },
    { id: 'l-lovescenery', groupId: 'g-drama', title: 'Love Scenery Ep 7', url: 'https://kisskh.ovh/Drama/Love-Scenery--2021-/Episode-7?id=778&ep=43000&page=0&pageSize=100', note: 'KissKH drama stream', faviconUrl: 'https://www.google.com/s2/favicons?domain=kisskh.ovh&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 4 },
    { id: 'l-eatrunlove', groupId: 'g-drama', title: 'Eat Run Love Ep 22', url: 'https://kisskh.ovh/Drama/Eat-Run-Love/Episode-22?id=9507&ep=180771&page=0&pageSize=100&tm=0', note: 'KissKH drama stream', faviconUrl: 'https://www.google.com/s2/favicons?domain=kisskh.ovh&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 5 },
    { id: 'l-net11', groupId: 'g-drama', title: 'Net11', url: 'https://net11.cc/home', note: 'Streaming portal', faviconUrl: 'https://www.google.com/s2/favicons?domain=net11.cc&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 6 },
    { id: 'l-rivestream', groupId: 'g-drama', title: 'RiveStream', url: 'https://www.rivestream.app/', note: 'Modern streaming app', faviconUrl: 'https://www.google.com/s2/favicons?domain=rivestream.app&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 7 },
    { id: 'l-turkish1', groupId: 'g-drama', title: 'Sevdigim Sensin Ep 10', url: 'https://ahs.turkish123.com/sevdigim-sensin-episode-10/', note: 'Turkish123 series', faviconUrl: 'https://www.google.com/s2/favicons?domain=ahs.turkish123.com&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 8 },
    { id: 'l-turkish2', groupId: 'g-drama', title: 'Arafta Ep 100', url: 'https://ahs.turkish123.com/arafta-episode-101/', note: 'Turkish123 series', faviconUrl: 'https://www.google.com/s2/favicons?domain=ahs.turkish123.com&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 9 },
    { id: 'l-dramacool', groupId: 'g-drama', title: 'Perfect Crown Ep 7', url: 'https://dramacool9.com.ro/perfect-crown-2026-episode-7.html', note: 'DramaCool English Sub', faviconUrl: 'https://www.google.com/s2/favicons?domain=dramacool9.com.ro&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 10 },
    { id: 'l-fmhyvideo', groupId: 'g-drama', title: 'FMHY Video Wiki', url: 'https://fmhy.vercel.app/video', note: 'Curated video streaming resources', faviconUrl: 'https://www.google.com/s2/favicons?domain=fmhy.vercel.app&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 11 },
    { id: 'l-fmhygame', groupId: 'g-drama', title: 'FMHY Gaming Wiki', url: 'https://fmhy.vercel.app/gaming', note: 'Emulation & gaming tools', faviconUrl: 'https://www.google.com/s2/favicons?domain=fmhy.vercel.app&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 12 },
    { id: 'l-opdir', groupId: 'g-drama', title: 'Open Directory Finder', url: 'https://ewasion.github.io/opendirectory-finder/#', note: 'Direct download search', faviconUrl: 'https://www.google.com/s2/favicons?domain=ewasion.github.io&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 13 },
    { id: 'l-deepweb', groupId: 'g-drama', title: 'Deep Web Nest', url: 'https://deepwebnest.com/', note: 'Directory index', faviconUrl: 'https://www.google.com/s2/favicons?domain=deepwebnest.com&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 14 },

    // 💻 Dev & Tech
    { id: 'l-gfg', groupId: 'g-dev', title: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/', note: 'Computer science tutorials & DSA', faviconUrl: 'https://www.google.com/s2/favicons?domain=geeksforgeeks.org&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 1 },
    { id: 'l-googleskills', groupId: 'g-dev', title: 'Google Skills', url: 'https://www.skills.google/', note: 'Google Developer learning pathways', faviconUrl: 'https://www.google.com/s2/favicons?domain=skills.google&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 2 },
    { id: 'l-uiverse', groupId: 'g-dev', title: 'Uiverse.io', url: 'https://uiverse.io/', note: 'Open-source UI elements & animations', faviconUrl: 'https://www.google.com/s2/favicons?domain=uiverse.io&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 3 },
    { id: 'l-render', groupId: 'g-dev', title: 'Render Dashboard', url: 'https://dashboard.render.com/web/srv-d6mh47nafjfc7393qh9g', note: 'Web service cloud deployments', faviconUrl: 'https://www.google.com/s2/favicons?domain=dashboard.render.com&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 4 },
    { id: 'l-enggroom', groupId: 'g-dev', title: 'EnggRoom Projects', url: 'https://www.enggroom.com/', note: 'Source code & project downloads', faviconUrl: 'https://www.google.com/s2/favicons?domain=enggroom.com&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 5 },
    { id: 'l-fullstack', groupId: 'g-dev', title: 'Become A Full Stack Web Developer', url: 'https://github.com/bmorelli25/Become-A-Full-Stack-Web-Developer', note: 'Free learning resources on GitHub', faviconUrl: 'https://www.google.com/s2/favicons?domain=github.com&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 6 },

    // 🎓 College & Learning
    { id: 'l-jntuh', groupId: 'g-college', title: 'JNTUH Results', url: 'https://jntuhresults.vercel.app/', note: 'Academic exam result portal', faviconUrl: 'https://www.google.com/s2/favicons?domain=jntuhresults.vercel.app&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 1 },
    { id: 'l-jiopc', groupId: 'g-college', title: 'Jio AI Classroom', url: 'https://jiopc.embibe.com/courses/6a81b69a48de3edbe7dec3de', note: 'Embibe interactive courses', faviconUrl: 'https://www.google.com/s2/favicons?domain=jiopc.embibe.com&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 2 },
    { id: 'l-claude101', groupId: 'g-college', title: 'Claude 101 Certificate', url: 'https://anthropic.skilljar.com/claude-101/385349', note: 'Anthropic prompt engineering cert', faviconUrl: 'https://www.google.com/s2/favicons?domain=anthropic.skilljar.com&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 3 },

    // 🎨 Design & 3D
    { id: 'l-dribbble', groupId: 'g-design', title: 'Dribbble', url: 'https://dribbble.com/', note: 'Design inspiration & portfolios', faviconUrl: 'https://www.google.com/s2/favicons?domain=dribbble.com&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 1 },
    { id: 'l-spline', groupId: 'g-design', title: 'Spline 3D Design', url: 'https://app.spline.design/home', note: '3D interactive web experiences', faviconUrl: 'https://www.google.com/s2/favicons?domain=app.spline.design&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 2 },

    // 🎵 Music & Social
    { id: 'l-instagram', groupId: 'g-media', title: 'Instagram', url: 'https://www.instagram.com/', note: 'Social feed & messaging', faviconUrl: 'https://www.google.com/s2/favicons?domain=instagram.com&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 1 },
    { id: 'l-chennai', groupId: 'g-media', title: 'Kashmir Main Tu Kanyakumari', url: 'https://m.youtube.com/watch?v=WxtJqyIyThU&list=RDByAbV-MKDgs&index=28', note: 'Chennai Express (YouTube)', faviconUrl: 'https://www.google.com/s2/favicons?domain=youtube.com&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 2 },
    { id: 'l-shehim', groupId: 'g-media', title: 'She & Him — I Thought I Saw Your Face Today', url: 'https://m.youtube.com/watch?v=pyGU-UudvrM&list=RDpyGU-UudvrM&start_radio=1', note: 'Official lyric video (YouTube)', faviconUrl: 'https://www.google.com/s2/favicons?domain=youtube.com&sz=64', createdAt: Date.now(), lastOpenedAt: null, order: 3 }
  ]
};

// State
let state = { groups: [], links: [] };
let activeGroupId=null,editingLinkId=null,editingGroupId=null;
let ctxGroupId=null,ctxLinkId=null;
let selectedColor=COLORS[0].hex,selectedEmoji=EMOJIS[0],selectedGroupForLink=null;
let fabHoldTimer=null,fabBloomOpen=false;
let logoTapCount=0,logoTapTimer=null,logoHoldTimer=null;
let konamiSeq=[],themeIndex=0;
const THEMES=['','theme-crt','theme-matrix','theme-mono','theme-cyber'];
const KONAMI=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

// Persistence
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}
function load(){
  try{
    const r=localStorage.getItem(STORAGE_KEY);
    if(r){
      const parsed=JSON.parse(r);
      if(parsed && parsed.groups && (parsed.groups.length > 0 || parsed.links.length > 0)){
        state=parsed;
        return;
      }
    }
  }catch{}
  // Default to pre-populated bookmarks
  state = JSON.parse(JSON.stringify(DEFAULT_DATA));
  save();
}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6);}

// Time-aware background
function setTOD(){const h=new Date().getHours();document.body.dataset.tod=h<6?'dawn':h<18?'day':h<20?'dusk':'night';}

// Favicon img HTML
function faviconImg(url,cls='tile-favicon'){
  const src=FAVICON(url);
  if(!src)return `<div class="${cls} shimmer" style="background:rgba(255,255,255,0.06)"></div>`;
  return `<img class="${cls} shimmer" src="${src}" alt="" loading="lazy" onload="this.classList.remove('shimmer')" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 24 24\\'%3E%3Ctext y=\\'18\\' font-size=\\'16\\'%3E%F0%9F%94%97%3C/text%3E%3C/svg%3E'"/>`;
}

// Toast
let toastTimer;
function toast(msg,dur=2400){
  const el=document.getElementById('toast');
  el.textContent=msg;el.classList.add('show');
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),dur);
}

// Ripple
function ripple(el,e){
  const r=document.createElement('span');r.className='ripple';
  const rect=el.getBoundingClientRect();
  const x=(e.touches?.[0]?.clientX??e.clientX)-rect.left;
  const y=(e.touches?.[0]?.clientY??e.clientY)-rect.top;
  const sz=Math.max(rect.width,rect.height)*2;
  r.style.cssText=`width:${sz}px;height:${sz}px;left:${x-sz/2}px;top:${y-sz/2}px`;
  el.appendChild(r);setTimeout(()=>r.remove(),500);
}

// Confetti
function confetti(color='#F59E0B'){
  const canvas=document.getElementById('confettiCanvas');
  const ctx=canvas.getContext('2d');
  canvas.width=window.innerWidth;canvas.height=window.innerHeight;
  const p=Array.from({length:40},()=>({
    x:window.innerWidth/2,y:window.innerHeight*0.65,
    vx:(Math.random()-0.5)*12,vy:-(Math.random()*9+4),
    color:[color,'#fff','#F59E0B','#14B8A6','#F43F5E','#8B5CF6'][Math.floor(Math.random()*6)],
    r:Math.random()*5+3,alpha:1,gravity:0.28
  }));
  let frame=0,raf;
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    p.forEach(q=>{q.x+=q.vx;q.y+=q.vy;q.vy+=q.gravity;q.alpha-=0.016;
      if(q.alpha<=0)return;
      ctx.save();ctx.globalAlpha=q.alpha;ctx.fillStyle=q.color;
      ctx.beginPath();ctx.arc(q.x,q.y,q.r,0,Math.PI*2);ctx.fill();ctx.restore();});
    if(++frame<90)raf=requestAnimationFrame(draw);else ctx.clearRect(0,0,canvas.width,canvas.height);
  }
  draw();
}

// Paper plane
function paperPlane(dir){
  const el=document.getElementById('paperPlane');
  el.classList.remove('fly-out','fly-in');void el.offsetWidth;
  el.classList.add(dir==='out'?'fly-out':'fly-in');
  setTimeout(()=>el.classList.remove('fly-out','fly-in'),950);
}

// Haptic
function haptic(p=[15,10,15]){if(navigator.vibrate)navigator.vibrate(p);}

// Escape HTML
function escHtml(s=''){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

// ── RENDER HOME ───────────────────────────────────────────
function render(q=''){
  const grid=document.getElementById('groupGrid');
  const empty=document.getElementById('emptyState');
  const noSearch=document.getElementById('noSearchState');
  const searchResults=document.getElementById('searchResultsList');
  const groupsLbl=document.getElementById('groupsLabel');
  const unassignedSec=document.getElementById('unassignedSection');
  const unassignedList=document.getElementById('unassignedList');
  const unassignedLbl=document.getElementById('unassignedLabel');

  const ql=q.toLowerCase().trim();
  if(ql==='tabnest')openAbout();

  const totalLinks=state.links.length;
  const totalGroups=state.groups.length;

  // 1. If global database is completely empty
  if(totalLinks===0 && totalGroups===0){
    grid.innerHTML='';
    if(searchResults) searchResults.innerHTML='';
    if(unassignedList) unassignedList.innerHTML='';
    empty.style.display='flex';
    noSearch.style.display='none';
    if(groupsLbl) groupsLbl.style.display='none';
    if(unassignedSec) unassignedSec.style.display='none';
    return;
  }
  empty.style.display='none';

  // 2. DIRECT WEBSITE SEARCH MODE (when search query exists)
  if(ql){
    if(groupsLbl) groupsLbl.style.display='none';
    if(grid) grid.style.display='none';
    if(unassignedSec) unassignedSec.style.display='none';

    // Token-based matching across all links
    const tokens=ql.split(/\s+/).filter(Boolean);
    const matchedLinks=state.links.filter(l=>{
      const t=(l.title||'').toLowerCase();
      const u=(l.url||'').toLowerCase();
      const n=(l.note||'').toLowerCase();
      const g=state.groups.find(x=>x.id===l.groupId);
      const gn=(g?.name||'').toLowerCase();
      return tokens.every(tk=>t.includes(tk)||u.includes(tk)||n.includes(tk)||gn.includes(tk));
    });

    if(matchedLinks.length > 0){
      noSearch.style.display='none';
      searchResults.style.display='flex';
      searchResults.innerHTML=`
        <div class="search-res-count">${matchedLinks.length} matching website${matchedLinks.length > 1 ? 's' : ''}</div>
        ${matchedLinks.map(l=>{
          const g=state.groups.find(x=>x.id===l.groupId);
          return `
            <div class="link-item" data-lid="${l.id}">
              ${faviconImg(l.url,'link-favicon')}
              <div class="link-info">
                <div class="link-title">${escHtml(l.title||l.url)}</div>
                <div class="link-url">${escHtml(l.url)} ${g ? `&middot; <span style="color:${g.color}">${g.emoji||'📁'} ${escHtml(g.name)}</span>` : ''}</div>
                ${l.note?`<div class="link-note">${escHtml(l.note)}</div>`:''}
              </div>
              <div class="link-actions">
                <button class="link-action-btn" data-lid="${l.id}" aria-label="Options">
                  <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/></svg>
                </button>
              </div>
            </div>`;
        }).join('')}
      `;

      searchResults.querySelectorAll('.link-item').forEach(item=>{
        item.addEventListener('click',e=>{if(e.target.closest('.link-action-btn'))return;ripple(item,e);openLink(item.dataset.lid,e);});
      });
      searchResults.querySelectorAll('.link-action-btn').forEach(btn=>{
        btn.addEventListener('click',e=>{e.stopPropagation();ctxLinkId=btn.dataset.lid;openCtx('linkCtxMenu',btn);});
      });
    } else {
      searchResults.style.display='none';
      searchResults.innerHTML='';
      noSearch.style.display='flex';
    }
    return;
  }

  // 3. NORMAL NEST & LINK VIEW (when no search query)
  if(searchResults) { searchResults.style.display='none'; searchResults.innerHTML=''; }
  noSearch.style.display='none';

  // Render Groups
  if(totalGroups > 0){
    groupsLbl.style.display='block';
    grid.style.display='grid';
    grid.innerHTML=state.groups.map((g,gi)=>{
      const links=state.links.filter(l=>l.groupId===g.id).sort((a,b)=>(a.order||0)-(b.order||0));
      const overflow=links.length-4;
      const tiles=[0,1,2,3].map(i=>{
        if(i===3&&overflow>0)return `<div class="tile"><span class="tile-overflow">+${overflow}</span></div>`;
        if(i<links.length)return `<div class="tile" data-lid="${links[i].id}" data-url="${escHtml(links[i].url)}">${faviconImg(links[i].url)}</div>`;
        return `<div class="tile tile-empty"></div>`;
      }).join('');
      return `<div class="group-card" draggable="true" data-gid="${g.id}" style="animation-delay:${gi*0.04}s">
        <div class="card-header">
          <div class="card-dot" style="background:${g.color}"></div>
          <div class="card-name">${g.emoji?escHtml(g.emoji)+' ':''}${escHtml(g.name)}</div>
          <button class="card-kebab" data-gid="${g.id}" aria-label="Options">⋮</button>
        </div>
        <div class="card-tiles" data-gid="${g.id}">${tiles}</div>
      </div>`;
    }).join('');

    setupGroupDragAndDrop();
  } else {
    groupsLbl.style.display='none';
    grid.innerHTML='';
    grid.style.display='none';
  }

  // Render Unassigned / Standalone Links
  const unassigned=state.links.filter(l=>!l.groupId || !state.groups.some(g=>g.id===l.groupId)).sort((a,b)=>(a.order||0)-(b.order||0));
  if(unassigned.length > 0){
    unassignedSec.style.display='block';
    unassignedLbl.textContent = totalGroups > 0 ? 'Saved Links' : 'Your Links';
    unassignedList.innerHTML = unassigned.map(l=>`
      <div class="link-item" data-lid="${l.id}">
        ${faviconImg(l.url,'link-favicon')}
        <div class="link-info">
          <div class="link-title">${escHtml(l.title||l.url)}</div>
          <div class="link-url">${escHtml(l.url)}</div>
          ${l.note?`<div class="link-note">${escHtml(l.note)}</div>`:''}
        </div>
        <div class="link-actions">
          <button class="link-action-btn" data-lid="${l.id}" aria-label="Options">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/></svg>
          </button>
        </div>
      </div>`).join('');
  } else {
    unassignedSec.style.display='none';
    unassignedList.innerHTML='';
  }

  // Wire group cards
  document.querySelectorAll('.group-card').forEach(card=>{
    card.addEventListener('click',e=>{
      if(e.target.closest('.card-kebab')||e.target.closest('.tile[data-lid]'))return;
      openGroupView(card.dataset.gid,e);
    });
  });
  document.querySelectorAll('.tile[data-lid]').forEach(tile=>{
    tile.addEventListener('click',e=>{e.stopPropagation();ripple(tile,e);openLink(tile.dataset.lid,e);});
  });
  document.querySelectorAll('.card-kebab').forEach(btn=>{
    btn.addEventListener('click',e=>{e.stopPropagation();ctxGroupId=btn.dataset.gid;openCtx('ctxMenu',btn);});
  });

  // Wire unassigned link items
  unassignedList.querySelectorAll('.link-item').forEach(item=>{
    item.addEventListener('click',e=>{if(e.target.closest('.link-action-btn'))return;ripple(item,e);openLink(item.dataset.lid,e);});
  });
  unassignedList.querySelectorAll('.link-action-btn').forEach(btn=>{
    btn.addEventListener('click',e=>{e.stopPropagation();ctxLinkId=btn.dataset.lid;openCtx('linkCtxMenu',btn);});
  });
}

// ── DRAG AND DROP FOR NESTS ───────────────────────────────
let draggedGid = null;
let wasTouchDragged = false;

function setupGroupDragAndDrop(){
  const cards = document.querySelectorAll('.group-card');
  cards.forEach(card => {
    // Desktop Drag & Drop
    card.addEventListener('dragstart', e => {
      draggedGid = card.dataset.gid;
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      haptic([15]);
    });

    card.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (card.dataset.gid !== draggedGid) {
        card.classList.add('drag-over');
      }
    });

    card.addEventListener('dragleave', () => {
      card.classList.remove('drag-over');
    });

    card.addEventListener('drop', e => {
      e.preventDefault();
      card.classList.remove('drag-over');
      const targetGid = card.dataset.gid;
      if (draggedGid && targetGid && draggedGid !== targetGid) {
        reorderGroups(draggedGid, targetGid);
      }
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      document.querySelectorAll('.group-card').forEach(c => c.classList.remove('drag-over'));
      draggedGid = null;
    });

    // Touch Drag & Drop for Mobile
    let touchHoldTimer = null;
    let touchDragging = false;
    let startX = 0, startY = 0;

    card.addEventListener('touchstart', e => {
      if (e.target.closest('.card-kebab') || e.target.closest('.tile')) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      touchHoldTimer = setTimeout(() => {
        touchDragging = true;
        draggedGid = card.dataset.gid;
        card.classList.add('dragging');
        haptic([25]);
      }, 300);
    }, { passive: true });

    card.addEventListener('touchmove', e => {
      const touch = e.touches[0];
      if (!touchDragging) {
        if (Math.hypot(touch.clientX - startX, touch.clientY - startY) > 10) {
          clearTimeout(touchHoldTimer);
        }
        return;
      }
      if (e.cancelable) e.preventDefault();

      const targetEl = document.elementFromPoint(touch.clientX, touch.clientY);
      const overCard = targetEl?.closest('.group-card');

      document.querySelectorAll('.group-card').forEach(c => c.classList.remove('drag-over'));
      if (overCard && overCard.dataset.gid !== draggedGid) {
        overCard.classList.add('drag-over');
      }
    }, { passive: false });

    card.addEventListener('touchend', e => {
      clearTimeout(touchHoldTimer);
      if (touchDragging) {
        touchDragging = false;
        wasTouchDragged = true;
        setTimeout(() => { wasTouchDragged = false; }, 350);

        card.classList.remove('dragging');
        const touch = e.changedTouches[0];
        const targetEl = document.elementFromPoint(touch.clientX, touch.clientY);
        const overCard = targetEl?.closest('.group-card');
        document.querySelectorAll('.group-card').forEach(c => c.classList.remove('drag-over'));

        if (overCard && draggedGid && overCard.dataset.gid !== draggedGid) {
          reorderGroups(draggedGid, overCard.dataset.gid);
        }
        draggedGid = null;
      }
    }, { passive: true });
  });
}

function reorderGroups(fromGid, toGid){
  const fromIdx = state.groups.findIndex(g => g.id === fromGid);
  const toIdx = state.groups.findIndex(g => g.id === toGid);
  if (fromIdx < 0 || toIdx < 0) return;

  const [movedGroup] = state.groups.splice(fromIdx, 1);
  state.groups.splice(toIdx, 0, movedGroup);
  state.groups.forEach((g, i) => { g.order = i + 1; });

  save();
  haptic([10, 10]);
  render(document.getElementById('searchInput')?.value || '');
}

// ── RENDER GROUP VIEW ─────────────────────────────────────
function renderGroupView(gid){
  const g=state.groups.find(x=>x.id===gid);if(!g)return;
  document.getElementById('groupViewTitle').textContent=(g.emoji?g.emoji+' ':'')+g.name;
  document.getElementById('groupViewHeader').style.borderBottomColor=g.color+'44';
  const links=state.links.filter(l=>l.groupId===gid).sort((a,b)=>(a.order||0)-(b.order||0));
  const list=document.getElementById('linksList');
  if(!links.length){
    list.innerHTML=`<div class="empty-group-state"><div class="feather-anim">🪶</div><div class="no-search-title">This nest is empty.</div><div class="no-search-sub" style="color:var(--text-muted)">A quiet nest. Ready for stories.</div></div>`;
    return;
  }
  list.innerHTML=links.map(l=>`
    <div class="link-item" data-lid="${l.id}">
      ${faviconImg(l.url,'link-favicon')}
      <div class="link-info">
        <div class="link-title">${escHtml(l.title||l.url)}</div>
        <div class="link-url">${escHtml(l.url)}</div>
        ${l.note?`<div class="link-note">${escHtml(l.note)}</div>`:''}
      </div>
      <div class="link-actions">
        <button class="link-action-btn" data-lid="${l.id}" aria-label="Options">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/></svg>
        </button>
      </div>
    </div>`).join('');
  list.querySelectorAll('.link-item').forEach(item=>{
    item.addEventListener('click',e=>{if(e.target.closest('.link-action-btn'))return;ripple(item,e);openLink(item.dataset.lid,e);});
  });
  list.querySelectorAll('.link-action-btn').forEach(btn=>{
    btn.addEventListener('click',e=>{e.stopPropagation();ctxLinkId=btn.dataset.lid;openCtx('linkCtxMenu',btn);});
  });
}

function openGroupView(gid,e){
  if(wasTouchDragged) return;
  activeGroupId=gid;
  renderGroupView(gid);
  requestAnimationFrame(()=>document.getElementById('groupView').classList.add('open'));
}
function closeGroupView(){document.getElementById('groupView').classList.remove('open');activeGroupId=null;}
function openLink(lid,e){
  const l=state.links.find(x=>x.id===lid);if(!l)return;
  l.lastOpenedAt=Date.now();
  save();
  haptic([10]);
  window.open(l.url,'_blank','noopener');
}

// CTX
function openCtx(id,anchor){
  closeAllCtx();
  const menu=document.getElementById(id);
  const rect=anchor.getBoundingClientRect();
  menu.style.top=(rect.bottom+6)+'px';
  menu.style.right=Math.max(12, (window.innerWidth-rect.right))+'px';
  menu.style.left='auto';
  menu.classList.add('open');
}
function closeAllCtx(){document.querySelectorAll('.ctx-menu').forEach(m=>m.classList.remove('open'));closeFabBloom();}

// FAB BLOOM
function openFabBloom(){fabBloomOpen=true;document.getElementById('fabBloom').classList.add('open');document.getElementById('fabBtn').classList.add('pressed');haptic([15,10,15]);}
function closeFabBloom(){fabBloomOpen=false;document.getElementById('fabBloom').classList.remove('open');document.getElementById('fabBtn').classList.remove('pressed');}

// MODALS
function openModal(id){document.getElementById(id).classList.add('open');}
function closeModal(id){document.getElementById(id).classList.remove('open');}
function closeAllModals(){document.querySelectorAll('.modal-overlay').forEach(m=>m.classList.remove('open'));}

// LINK MODAL
function openAddLinkModal(prefillGid){
  editingLinkId=null;
  document.getElementById('linkModalTitle').textContent='Add link';
  ['linkUrl','linkTitle','linkNote'].forEach(id=>document.getElementById(id).value='');
  selectedGroupForLink=prefillGid||'';
  renderGroupChipPicker('groupChipPicker',selectedGroupForLink);
  openModal('linkModal');
  setTimeout(()=>document.getElementById('linkUrl').focus(),350);
}
function openEditLinkModal(lid){
  const l=state.links.find(x=>x.id===lid);if(!l)return;
  editingLinkId=lid;
  document.getElementById('linkModalTitle').textContent='Edit link';
  document.getElementById('linkUrl').value=l.url;
  document.getElementById('linkTitle').value=l.title||'';
  document.getElementById('linkNote').value=l.note||'';
  selectedGroupForLink=l.groupId||'';
  renderGroupChipPicker('groupChipPicker',selectedGroupForLink);
  openModal('linkModal');
}
function renderGroupChipPicker(cid,selected){
  const c=document.getElementById(cid);
  let html=`<div class="group-chip${(!selected||selected==='')?' selected':''}" data-gid="" style="--chip-color:var(--text-muted)">🌐 No nest (Unsorted)</div>`;
  if(state.groups.length > 0){
    html+=state.groups.map(g=>`<div class="group-chip${g.id===selected?' selected':''}" data-gid="${g.id}" style="--chip-color:${g.color}">${g.emoji?escHtml(g.emoji)+' ':''}${escHtml(g.name)}</div>`).join('');
  }
  html+=`<div class="group-chip" id="addNestFromLinkModal" style="border-style:dashed;border-color:rgba(240,165,0,0.6);color:var(--accent)">+ New nest</div>`;
  c.innerHTML=html;
  c.querySelectorAll('.group-chip[data-gid]').forEach(chip=>{
    chip.addEventListener('click',()=>{
      selectedGroupForLink=chip.dataset.gid;
      c.querySelectorAll('.group-chip').forEach(c2=>c2.classList.remove('selected'));
      chip.classList.add('selected');
    });
  });
  const addNestBtn=document.getElementById('addNestFromLinkModal');
  if(addNestBtn){
    addNestBtn.addEventListener('click',()=>{
      closeModal('linkModal');
      openAddGroupModal();
    });
  }
}
function titleFromUrl(url){try{return new URL(url).hostname.replace(/^www\./,'');}catch{return url;}}
function saveLink(){
  let url=document.getElementById('linkUrl').value.trim();
  if(!url){toast('URL is required to save a link');return;}
  if(!/^https?:\/\//i.test(url))url='https://'+url;
  const title=document.getElementById('linkTitle').value.trim()||titleFromUrl(url);
  const note=document.getElementById('linkNote').value.trim();
  const gid=selectedGroupForLink||'';

  if(editingLinkId){
    const idx=state.links.findIndex(x=>x.id===editingLinkId);
    if(idx>-1)Object.assign(state.links[idx],{url,title,note,groupId:gid});
    toast('Link updated ✓');
  } else {
    const maxOrder=state.links.filter(l=>(l.groupId||'')===gid).reduce((m,l)=>Math.max(m,l.order||0),0);
    state.links.push({id:uid(),groupId:gid,url,title,note,faviconUrl:FAVICON(url),createdAt:Date.now(),lastOpenedAt:null,order:maxOrder+1});
    toast('Link saved 🪺');
  }
  save();closeModal('linkModal');
  if(activeGroupId)renderGroupView(activeGroupId);
  render(document.getElementById('searchInput').value);
}

// GROUP MODAL
function openAddGroupModal(){
  editingGroupId=null;
  document.getElementById('groupModalTitle').textContent='New nest';
  document.getElementById('groupModalSave').textContent='Create nest';
  document.getElementById('groupName').value='';
  selectedColor=COLORS[0].hex;selectedEmoji=EMOJIS[0];
  const customInp = document.getElementById('customEmojiInput');
  if(customInp) customInp.value = selectedEmoji;
  renderColorPicker();renderEmojiPicker();
  openModal('groupModal');
  setTimeout(()=>document.getElementById('groupName').focus(),350);
}
function openEditGroupModal(gid){
  const g=state.groups.find(x=>x.id===gid);if(!g)return;
  editingGroupId=gid;
  document.getElementById('groupModalTitle').textContent='Rename nest';
  document.getElementById('groupModalSave').textContent='Save changes';
  document.getElementById('groupName').value=g.name;
  selectedColor=g.color;selectedEmoji=g.emoji||EMOJIS[0];
  const customInp = document.getElementById('customEmojiInput');
  if(customInp) customInp.value = selectedEmoji;
  renderColorPicker();renderEmojiPicker();
  openModal('groupModal');
}
function renderColorPicker(){
  document.getElementById('colorPicker').innerHTML=COLORS.map(c=>`<div class="color-swatch${c.hex===selectedColor?' selected':''}" data-color="${c.hex}" style="background:${c.hex}"></div>`).join('');
  document.querySelectorAll('.color-swatch').forEach(sw=>{sw.addEventListener('click',()=>{selectedColor=sw.dataset.color;document.querySelectorAll('.color-swatch').forEach(s=>s.classList.remove('selected'));sw.classList.add('selected');});});
}
function renderEmojiPicker(){
  const customInp = document.getElementById('customEmojiInput');
  if(customInp){
    customInp.oninput = () => {
      const v = customInp.value.trim();
      if(v) selectedEmoji = v;
      document.querySelectorAll('.emoji-opt').forEach(o=>o.classList.toggle('selected', o.dataset.emoji === selectedEmoji));
    };
  }
  document.getElementById('emojiPicker').innerHTML=EMOJIS.map(em=>`<div class="emoji-opt${em===selectedEmoji?' selected':''}" data-emoji="${em}">${em}</div>`).join('');
  document.querySelectorAll('.emoji-opt').forEach(opt=>{
    opt.addEventListener('click',()=>{
      selectedEmoji=opt.dataset.emoji;
      if(customInp) customInp.value = selectedEmoji;
      document.querySelectorAll('.emoji-opt').forEach(o=>o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });
}
function saveGroup(){
  const name=document.getElementById('groupName').value.trim();
  if(!name){toast('A nest needs a name');return;}
  const customInp = document.getElementById('customEmojiInput');
  const emoji = (customInp && customInp.value.trim()) ? customInp.value.trim() : (selectedEmoji || '📁');

  if(editingGroupId){
    const idx=state.groups.findIndex(x=>x.id===editingGroupId);
    if(idx>-1)Object.assign(state.groups[idx],{name,color:selectedColor,emoji});
    toast('Nest updated ✓');
  } else {
    const maxOrder=state.groups.reduce((m,g)=>Math.max(m,g.order||0),0);
    state.groups.push({id:uid(),name,color:selectedColor,emoji,order:maxOrder+1});
    confetti(selectedColor);toast('New nest created 🪺');
  }
  save();closeModal('groupModal');render(document.getElementById('searchInput').value);
}

// DELETE
function deleteGroup(gid){
  if(!confirm('Release this nest back to the wild? All links inside will be freed.'))return;
  state.groups=state.groups.filter(g=>g.id!==gid);
  state.links.forEach(l=>{ if(l.groupId===gid) l.groupId=''; });
  save();toast('Nest released. Feathers scattered. 🪶');render(document.getElementById('searchInput').value);
}
function deleteLink(lid){
  state.links=state.links.filter(l=>l.id!==lid);
  save();toast('Link freed 🪺');
  if(activeGroupId)renderGroupView(activeGroupId);
  render(document.getElementById('searchInput').value);
}

// MOVE
function openMoveModal(lid){
  const l=state.links.find(x=>x.id===lid);if(!l)return;
  const c=document.getElementById('moveGroupChips');
  let html='';
  if(l.groupId){
    html+=`<div class="group-chip" data-gid="" style="--chip-color:var(--text-muted)">🌐 Remove from nest (Unassign)</div>`;
  }
  const availableGroups=state.groups.filter(g=>g.id!==l.groupId);
  html+=availableGroups.map(g=>`<div class="group-chip" data-gid="${g.id}" style="--chip-color:${g.color}">${g.emoji?escHtml(g.emoji)+' ':''}${escHtml(g.name)}</div>`).join('');
  html+=`<div class="group-chip" id="moveCreateNewNestBtn" style="border-style:dashed;border-color:var(--accent);color:var(--accent)">+ Create new nest</div>`;
  c.innerHTML=html;
  c.querySelectorAll('.group-chip[data-gid]').forEach(chip=>{
    chip.addEventListener('click',()=>{
      const ln=state.links.find(x=>x.id===lid);
      if(ln){ln.groupId=chip.dataset.gid;save();toast('Link moved ✓');}
      closeModal('moveModal');
      if(activeGroupId)renderGroupView(activeGroupId);
      render(document.getElementById('searchInput').value);
    });
  });
  const createBtn=document.getElementById('moveCreateNewNestBtn');
  if(createBtn){
    createBtn.addEventListener('click',()=>{
      closeModal('moveModal');
      openAddGroupModal();
    });
  }
  openModal('moveModal');
}

// ══════════════════════════════════════════════════════════
// EXPORT
// ══════════════════════════════════════════════════════════
function exportData(){
  closeAllModals();closeAllCtx();
  paperPlane('out');
  setTimeout(()=>{
    const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='tabnest-backup.json';a.click();
    toast('Nest packed ✈️');
  },600);
}

function exportCsv(){
  closeAllModals();
  const rows=['Group,Emoji,Title,URL,Note,Added'];
  state.links.forEach(l=>{
    const g=state.groups.find(x=>x.id===l.groupId);
    const esc=v=>'"'+(v||'').replace(/"/g,'""')+'"';
    rows.push([esc(g?.name||''),esc(g?.emoji||''),esc(l.title||''),esc(l.url||''),esc(l.note||''),new Date(l.createdAt).toLocaleDateString()].join(','));
  });
  const blob=new Blob([rows.join('\n')],{type:'text/csv'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='tabnest-links.csv';a.click();
  toast('Spreadsheet ready 📊');
}

// ══════════════════════════════════════════════════════════
// IMPORT — shared helpers
// ══════════════════════════════════════════════════════════
const IMPORT_COLORS=['#F59E0B','#14B8A6','#F43F5E','#8B5CF6','#0EA5E9','#10B981','#F97316','#EC4899','#6366F1','#84CC16'];
let importColorIdx=0;
function nextImportColor(){return IMPORT_COLORS[importColorIdx++%IMPORT_COLORS.length];}

function getOrCreateGroup(name,emoji='📁'){
  let g=state.groups.find(x=>x.name.toLowerCase()===name.toLowerCase());
  if(!g){
    g={id:uid(),name,color:nextImportColor(),emoji,order:state.groups.length+1};
    state.groups.push(g);
  }
  return g;
}

function addImportedLink(url,title,note,groupId){
  if(!url||!/^https?:\/\//i.test(url))return;
  if(state.links.find(l=>l.url===url))return; // skip duplicates
  const maxOrder=state.links.filter(l=>l.groupId===groupId).reduce((m,l)=>Math.max(m,l.order||0),0);
  state.links.push({id:uid(),groupId,url,title:title||titleFromUrl(url),note:note||'',faviconUrl:FAVICON(url),createdAt:Date.now(),lastOpenedAt:null,order:maxOrder+1});
}

function finishImport(added){
  save();
  paperPlane('in');
  render(document.getElementById('searchInput').value);
  toast(`Welcome home — ${added} link${added!==1?'s':''} added 🪺`);
}

// ── 1. TabNest JSON ───────────────────────────────────────
function importData(){document.getElementById('importFile').click();}
document.getElementById('importFile').addEventListener('change',e=>{
  const f=e.target.files?.[0];if(!f)return;
  const reader=new FileReader();
  reader.onload=ev=>{
    try{
      const parsed=JSON.parse(ev.target.result);
      if(!parsed.groups||!parsed.links)throw 0;
      if(!confirm('Unpacking will merge with (or replace) your current data. Replace everything?')){
        // Merge mode
        importColorIdx=0;
        let added=0;
        parsed.groups.forEach(pg=>{
          const g=getOrCreateGroup(pg.name,pg.emoji);
          parsed.links.filter(l=>l.groupId===pg.id).forEach(l=>{ addImportedLink(l.url,l.title,l.note,g.id); added++; });
        });
        finishImport(added);
        return;
      }
      state=parsed;save();paperPlane('in');render(document.getElementById('searchInput').value);toast('Welcome home 🪺');
    }catch{toast('Could not read that file — is it a TabNest backup?');}
  };
  reader.readAsText(f);e.target.value='';
});

// ── 2. Brave / Chrome Bookmarks JSON ─────────────────────
function importBraveData(){document.getElementById('importBraveFile').click();}
document.getElementById('importBraveFile').addEventListener('change',e=>{
  const f=e.target.files?.[0];if(!f)return;
  const reader=new FileReader();
  reader.onload=ev=>{
    try{
      const bm=JSON.parse(ev.target.result);
      if(!bm.roots)throw 0;
      importColorIdx=state.groups.length;
      let added=0;

      function walkNodes(nodes,folderName,emoji){
        if(!nodes)return;
        nodes.forEach(node=>{
          if(node.type==='url'&&node.url){
            const g=getOrCreateGroup(folderName,emoji);
            addImportedLink(node.url,node.name,'',g.id);
            added++;
          } else if(node.type==='folder'&&node.children){
            walkNodes(node.children,node.name,'📁');
          }
        });
      }

      walkNodes(bm.roots.bookmark_bar?.children,'Bookmark Bar','🔖');
      walkNodes(bm.roots.other?.children,'Other Bookmarks','📂');
      walkNodes(bm.roots.synced?.children,'Mobile Bookmarks','📱');

      finishImport(added);
    }catch(err){
      toast('Hmm — are you sure that\'s a Brave/Chrome Bookmarks file?');
    }
  };
  reader.readAsText(f);e.target.value='';
});

// ── 3. Browser Bookmarks HTML ─────────────────────────────
function importHtmlData(){document.getElementById('importHtmlFile').click();}
document.getElementById('importHtmlFile').addEventListener('change',e=>{
  const f=e.target.files?.[0];if(!f)return;
  const reader=new FileReader();
  reader.onload=ev=>{
    try{
      const parser=new DOMParser();
      const doc=parser.parseFromString(ev.target.result,'text/html');
      importColorIdx=state.groups.length;
      let added=0;
      let currentGroup='Imported';

      const items=doc.querySelectorAll('dt');
      items.forEach(dt=>{
        const h3=dt.querySelector('h3');
        if(h3){currentGroup=h3.textContent.trim()||'Imported';return;}
        const a=dt.querySelector('a');
        if(a&&a.href&&/^https?:\/\//i.test(a.href)){
          const g=getOrCreateGroup(currentGroup,'📁');
          addImportedLink(a.href,a.textContent.trim(),'',g.id);
          added++;
        }
      });

      if(!added){
        const allLinks=doc.querySelectorAll('a[href^="http"]');
        const g=getOrCreateGroup('Imported','📂');
        allLinks.forEach(a=>{addImportedLink(a.href,a.textContent.trim(),'',g.id);added++;});
      }

      finishImport(added);
    }catch{
      toast('Could not parse that HTML file.');
    }
  };
  reader.readAsText(f);e.target.value='';
});

// ── 4. Plain URL list (paste) ─────────────────────────────
function openUrlPasteModal(){
  document.getElementById('urlPasteArea').value='';
  document.getElementById('urlPasteNewGroup').value='';
  const picker=document.getElementById('urlPasteGroupPicker');
  let urlPasteSelectedGroup=state.groups[0]?.id||null;
  picker.innerHTML=state.groups.map(g=>`<div class="group-chip${g.id===urlPasteSelectedGroup?' selected':''}" data-gid="${g.id}" style="--chip-color:${g.color}">${g.emoji?escHtml(g.emoji)+' ':''}${escHtml(g.name)}</div>`).join('');
  picker.querySelectorAll('.group-chip').forEach(chip=>{
    chip.addEventListener('click',()=>{
      urlPasteSelectedGroup=chip.dataset.gid;
      picker.querySelectorAll('.group-chip').forEach(c=>c.classList.remove('selected'));
      chip.classList.add('selected');
    });
  });
  document.getElementById('urlPasteSave').onclick=()=>{
    const raw=document.getElementById('urlPasteArea').value.trim();
    const newGroupName=document.getElementById('urlPasteNewGroup').value.trim();
    if(!raw){toast('Paste some URLs first!');return;}
    const urls=raw.split(/\s+/).filter(u=>/^https?:\/\//i.test(u.trim()));
    if(!urls.length){toast('No valid URLs found — make sure they start with https://');return;}
    let gid;
    if(newGroupName){gid=getOrCreateGroup(newGroupName,'📋').id;}
    else{gid=urlPasteSelectedGroup||getOrCreateGroup('Imported','📋').id;}
    importColorIdx=state.groups.length;
    let added=0;
    urls.forEach(u=>{addImportedLink(u.trim(),'','',gid);added++;});
    closeModal('urlPasteModal');
    finishImport(added);
  };
  openModal('urlPasteModal');
  setTimeout(()=>document.getElementById('urlPasteArea').focus(),350);
}

document.getElementById('urlPasteCancel').addEventListener('click',()=>closeModal('urlPasteModal'));

// ABOUT
function openAbout(){closeAllCtx();closeAllModals();openModal('aboutModal');}

// DEV MODE
function openDevMode(){
  const div=document.getElementById('devLinkStats');
  div.innerHTML=state.links.map(l=>`
    <div style="padding:8px 0;border-bottom:1px solid var(--border)">
      <strong style="color:var(--text)">${escHtml(l.title||l.url)}</strong><br/>
      <span class="link-meta">Opened: ${l.lastOpenedAt?new Date(l.lastOpenedAt).toLocaleString():'Never'} &middot; Added: ${new Date(l.createdAt).toLocaleDateString()}</span>
    </div>`).join('')||'<div style="color:var(--text-muted);padding:16px 0">No links saved yet.</div>';
  openModal('devModal');toast('🔓 Developer Mode activated!');
}

// THEME CYCLE
function cycleTheme(){
  THEMES.forEach(t=>t&&document.body.classList.remove(t));
  themeIndex=(themeIndex+1)%THEMES.length;
  if(THEMES[themeIndex])document.body.classList.add(THEMES[themeIndex]);
  toast('Theme: '+['Default 🌙','Retro CRT 📺','Matrix 🟩','Mono ◻️','Cyberpunk 💜'][themeIndex]);
}

// KONAMI
document.addEventListener('keydown',e=>{
  konamiSeq.push(e.key);if(konamiSeq.length>10)konamiSeq.shift();
  if(JSON.stringify(konamiSeq)===JSON.stringify(KONAMI)){konamiSeq=[];openDevMode();haptic([30,20,30,20,30]);}
  if(e.key==='Escape'){closeAllCtx();closeAllModals();closeGroupView();}
  if(e.key==='/'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){e.preventDefault();document.getElementById('searchInput').focus();}
});

// LOGO
const logoBtn=document.getElementById('logoBtn');
logoBtn.addEventListener('click',()=>{
  logoTapCount++;clearTimeout(logoTapTimer);
  logoTapTimer=setTimeout(()=>{logoTapCount=0;},800);
  if(logoTapCount>=3){logoTapCount=0;clearTimeout(logoTapTimer);cycleTheme();}
});
logoBtn.addEventListener('mousedown',startLogoHold);logoBtn.addEventListener('touchstart',startLogoHold,{passive:true});
logoBtn.addEventListener('mouseup',cancelLogoHold);logoBtn.addEventListener('mouseleave',cancelLogoHold);logoBtn.addEventListener('touchend',cancelLogoHold);
function startLogoHold(){logoHoldTimer=setTimeout(()=>{openModal('creditsModal');haptic([20,10,20]);},2000);}
function cancelLogoHold(){clearTimeout(logoHoldTimer);}

// FAB
const fabBtn=document.getElementById('fabBtn');
fabBtn.addEventListener('click',e=>{if(fabBloomOpen){closeFabBloom();return;}openAddLinkModal(activeGroupId||undefined);});
fabBtn.addEventListener('mousedown',()=>{fabHoldTimer=setTimeout(openFabBloom,600);});
fabBtn.addEventListener('mouseup',()=>clearTimeout(fabHoldTimer));
fabBtn.addEventListener('mouseleave',()=>clearTimeout(fabHoldTimer));
fabBtn.addEventListener('touchstart',()=>{fabHoldTimer=setTimeout(openFabBloom,600);},{passive:true});
fabBtn.addEventListener('touchend',()=>clearTimeout(fabHoldTimer));

document.getElementById('menuBtn').addEventListener('click',e=>{e.stopPropagation();openCtx('globalMenu',document.getElementById('menuBtn'));});
document.getElementById('robinBtn').addEventListener('click',()=>openRobinChat());
document.getElementById('gmRobin').addEventListener('click',()=>{closeAllCtx();openRobinChat();});
document.getElementById('exportCsvBtn').addEventListener('click',exportCsv);
document.getElementById('importBraveBtn').addEventListener('click',importBraveData);
document.getElementById('importHtmlBtn').addEventListener('click',importHtmlData);
document.getElementById('importUrlsBtn').addEventListener('click',()=>{closeModal('settingsModal');openUrlPasteModal();});
document.getElementById('bloomAddLink').addEventListener('click',()=>{closeFabBloom();openAddLinkModal();});
document.getElementById('bloomAddGroup').addEventListener('click',()=>{closeFabBloom();openAddGroupModal();});

// ROBIN AI LISTENERS
document.getElementById('robinCloseBtn').addEventListener('click',()=>closeModal('robinModal'));
document.getElementById('robinSendBtn').addEventListener('click',handleRobinSend);
document.getElementById('robinInput').addEventListener('keydown',e=>{if(e.key==='Enter')handleRobinSend();});
document.querySelectorAll('.robin-chip').forEach(chip=>{
  chip.addEventListener('click',()=>{
    const cmd = chip.dataset.cmd;
    if(cmd){
      const input = document.getElementById('robinInput');
      input.value = cmd;
      handleRobinSend();
    }
  });
});

// AI API KEY SETTINGS
document.getElementById('saveAiKeyBtn').addEventListener('click',()=>{
  const key = document.getElementById('geminiApiKeyInput').value.trim();
  aiConfig.apiKey = key;
  saveAiConfig();
  toast(key ? 'Gemini API Key saved! 🤖' : 'API Key cleared (offline mode)');
});
const origOpenSettings = () => {
  document.getElementById('geminiApiKeyInput').value = aiConfig.apiKey || '';
  openModal('settingsModal');
};
document.getElementById('gmSettings').onclick = () => { closeAllCtx(); origOpenSettings(); };

// CTX ACTIONS
document.getElementById('ctxRename').addEventListener('click',()=>{closeAllCtx();if(ctxGroupId)openEditGroupModal(ctxGroupId);});
document.getElementById('ctxDelete').addEventListener('click',()=>{closeAllCtx();if(ctxGroupId)deleteGroup(ctxGroupId);});
document.getElementById('lctxEdit').addEventListener('click',()=>{closeAllCtx();if(ctxLinkId)openEditLinkModal(ctxLinkId);});
document.getElementById('lctxMove').addEventListener('click',()=>{closeAllCtx();if(ctxLinkId)openMoveModal(ctxLinkId);});
document.getElementById('lctxDelete').addEventListener('click',()=>{closeAllCtx();if(ctxLinkId)deleteLink(ctxLinkId);});
document.getElementById('gmExport').addEventListener('click',()=>{closeAllCtx();exportData();});
document.getElementById('gmImport').addEventListener('click',()=>{closeAllCtx();importData();});

// MODAL BUTTONS
document.getElementById('linkModalSave').addEventListener('click',saveLink);
document.getElementById('linkModalCancel').addEventListener('click',()=>closeModal('linkModal'));
document.getElementById('groupModalSave').addEventListener('click',saveGroup);
document.getElementById('groupModalCancel').addEventListener('click',()=>closeModal('groupModal'));
document.getElementById('moveModalCancel').addEventListener('click',()=>closeModal('moveModal'));
document.getElementById('exportBtn').addEventListener('click',exportData);
document.getElementById('importBtn').addEventListener('click',importData);
document.getElementById('resetBookmarksBtn').addEventListener('click',()=>{
  if(confirm('Load all 45+ organized default bookmarks? This will replace or refresh your current list.')){
    state = JSON.parse(JSON.stringify(DEFAULT_DATA));
    save();
    closeModal('settingsModal');
    paperPlane('in');
    render(document.getElementById('searchInput').value);
    toast('All organized bookmarks loaded 🪺');
  }
});
document.getElementById('aboutClose').addEventListener('click',()=>closeModal('aboutModal'));
document.getElementById('creditsClose').addEventListener('click',()=>closeModal('creditsModal'));
document.getElementById('devClose').addEventListener('click',()=>closeModal('devModal'));
document.getElementById('backBtn').addEventListener('click',closeGroupView);
document.getElementById('groupViewAddBtn').addEventListener('click',()=>openAddLinkModal(activeGroupId));

// OVERLAY CLOSE
document.querySelectorAll('.modal-overlay').forEach(o=>o.addEventListener('click',e=>{if(e.target===o)o.classList.remove('open');}));
document.addEventListener('click',e=>{
  if(!e.target.closest('.ctx-menu')&&!e.target.closest('.card-kebab')&&!e.target.closest('#menuBtn')&&!e.target.closest('#fabBtn')&&!e.target.closest('.fab-bloom'))closeAllCtx();
});

// SEARCH
let searchDebounce;
document.getElementById('searchInput').addEventListener('input',e=>{
  clearTimeout(searchDebounce);const v=e.target.value;
  document.getElementById('searchClear').classList.toggle('visible',v.length>0);
  searchDebounce=setTimeout(()=>render(v),120);
});
document.getElementById('searchClear').addEventListener('click',()=>{
  document.getElementById('searchInput').value='';
  document.getElementById('searchClear').classList.remove('visible');
  render('');
});
document.getElementById('linkUrl').addEventListener('blur',e=>{
  const t=document.getElementById('linkTitle');
  if(!t.value.trim()&&e.target.value.trim())t.placeholder=titleFromUrl(e.target.value.trim());
});

// ENTER KEY
document.getElementById('linkUrl').addEventListener('keydown',e=>{if(e.key==='Enter')saveLink();});
document.getElementById('groupName').addEventListener('keydown',e=>{if(e.key==='Enter')saveGroup();});

// SWIPE BACK
let swipeX=0;
const gv=document.getElementById('groupView');
gv.addEventListener('touchstart',e=>{swipeX=e.touches[0].clientX;},{passive:true});
gv.addEventListener('touchend',e=>{if(e.changedTouches[0].clientX-swipeX>80)closeGroupView();},{passive:true});

// SW for offline support
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

// INIT
setTOD();load();render();setInterval(setTOD,60000);
