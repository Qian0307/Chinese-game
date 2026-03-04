// 簡易遊戲邏輯與題庫
const STORAGE_KEY = 'zy_progress_v1';

const LEVEL_NAMES = ['句子學徒','標點弟子','連接俠士','敘事少俠'];
const LEVEL_THRESHOLDS = [0,4,8,12]; // points needed for each badge index

const QUESTIONS = {
  complete: {
    title: '完整句子功',
    desc: '請把不完整的句子補成：誰 + 在哪裡 + 做什麼。',
    qs: [
      { type:'complete', prompt:'妹妹吃。', answer:'妹妹在家吃晚餐。', keywords:['妹妹','在','吃'], hint:'檢查主語（誰）、地點（在哪裡）、動作（做什麼）。可加時間或副詞。' },
      { type:'complete', prompt:'鳥飛。', answer:'天空中有隻鳥在飛翔。', keywords:['鳥','在','飛'], hint:'可加地點或方式，例如「在天空中」或「快速地飛翔」。' },
      { type:'complete', prompt:'小貓睡。', answer:'小貓在沙發上睡覺。', keywords:['小貓','在','睡'], hint:'把「睡」改為較完整的動詞片語，例如「睡覺」，並加入地點。' },
      { type:'complete', prompt:'爸爸走。', answer:'爸爸在公園慢慢走路。', keywords:['爸爸','在','走'], hint:'補上地點與方式「慢慢地」。' },
      { type:'complete', prompt:'（升級）小狗跑步。請加上地點與心情。', answer:'小狗在山上開心地跑步。', keywords:['小狗','山','跑','開心'], hint:'升級題鼓勵加上心情或副詞，如「開心地」「快速地」。' }
    ]
  },
  cause: {
    title:'因果內功',
    desc:'必須使用「因為…所以…」造句。',
    qs:[
      { type:'cause', prompt:'我沒來學校，生病。', answer:'因為我生病了，所以我沒來學校。', hint:'把原因用「因為」提出，再接「所以」說結果。' },
      { type:'cause', prompt:'因為下雨，所以我沒來練功。', answer:'因為下雨，所以我沒來練功。', hint:'示範句，可提醒學生加上逗號。' },
      { type:'cause', prompt:'昨天發燒，我在家休息。', answer:'因為昨天發燒，所以我在家休息。', hint:'注意時間詞要放在原因或結果中，使句子更完整。' },
      { type:'cause', prompt:'我沒去運動，腳痛。', answer:'因為腳痛，所以我沒去運動。', hint:'檢查主語是否完整（我）並用因果連接詞連結。' },
      { type:'cause', prompt:'（升級）作業太多沒時間玩。', answer:'因為作業太多，所以我沒時間玩。', hint:'升級題可要求加時間或地點：例如「因為作業太多，所以我今天沒時間玩」。' }
    ]
  },
  sequence: {
    title:'順序招式',
    desc:'請用「先…再…最後…」描述順序。',
    qs:[
      { type:'sequence', prompt:'刷牙流程', answer:'我先漱口，再刷牙，最後吐泡泡水並漱口。', hint:'動作順序要合乎常理，注意動詞的完整性。' },
      { type:'sequence', prompt:'做菜三步驟', answer:'我先洗菜，再切菜，最後煮湯。', hint:'可以補上時間或方式，例如「小火慢煮」。' },
      { type:'sequence', prompt:'洗衣流程', answer:'我先把衣服拿出來，再洗，最後晾乾。', hint:'順序句要使用連接詞連接三個步驟。' },
      { type:'sequence', prompt:'（升級）加時間詞', answer:'我先早上練功，再中午休息，最後晚上讀書。', hint:'升級題加上時間詞會讓敘述更完整。' },
      { type:'sequence', prompt:'掃地流程', answer:'我先掃地，再拖地，最後收拾工具。', hint:'注意每個步驟之間用逗號或連接詞分開。' }
    ]
  },
  feeling: {
    title:'心情招式',
    desc:'使用「我覺得…，因為…」表達心情與原因。',
    qs:[
      { type:'feeling', prompt:'獲得獎牌的感想', answer:'我覺得很驕傲，因為我獲得了第一名。', hint:'告訴學生可用情緒形容詞（開心、驕傲、緊張）並說明原因。' },
      { type:'feeling', prompt:'考試沒考好', answer:'我覺得有點難過，因為我沒有考好。', hint:'練習說明原因並提出下一步（例如下次準備）。' },
      { type:'feeling', prompt:'幫助別人的感覺', answer:'我覺得很高興，因為我幫助了別人。', hint:'情緒和原因需合理搭配。' },
      { type:'feeling', prompt:'打敗魔王後', answer:'我覺得很開心，因為我成功了。', hint:'可鼓勵學生說出「如何成功」作為細節。' },
      { type:'feeling', prompt:'升級挑戰：加上下一步', answer:'我覺得很高興，因為我幫助了別人，所以我想繼續幫忙。', hint:'加入「所以…」表示接下來的動作或計畫。' }
    ]
  },
  choose: {
    title:'三選一判斷',
    desc:'選出最完整或最合適的句子，並說明原因（教師可口頭追問）。',
    qs:[
      { type:'choose', prompt:'魔王來了，你怎麼辦？', choices:['我跑。','我在山洞跑。','我在山洞裡躲起來。'], correct:2, hint:'C 最完整，包含地點與動作。' },
      { type:'choose', prompt:'為什麼沒來練功？', choices:['生病。','我生病了。','因為發燒所以我沒來練功。'], correct:2, hint:'因果句使用「因為…所以…」最完整。' },
      { type:'choose', prompt:'早上做事順序', choices:['我吃早餐再洗臉先。','我先洗臉，再吃早餐，最後刷牙。','先刷牙。'], correct:1, hint:'選項 B 正確順序且用連接詞。' },
      { type:'choose', prompt:'誰比較完整？', choices:['我哭。','我在操場哭。','我在操場坐起來，擦掉眼淚後告訴老師我沒事。'], correct:2, hint:'C 為最完整，但 B 也比 A 更完整（含地點）。' },
      { type:'choose', prompt:'標點正確的是？', choices:['因為下雨所以我沒出門','因為下雨，所以我沒出門。','因為，下雨所以我沒出門。'], correct:1, hint:'正確答案為第 2 項（index 1）。' },
      { type:'choose', prompt:'老師問你為何遲到？', choices:['睡過頭','我睡過頭了。','因為睡過頭所以我遲到。'], correct:2, hint:'因果最完整，或用完整句也可接受。' },
      { type:'choose', prompt:'描述天氣', choices:['下雨','外面下雨。','因為下雨所以外面濕。'], correct:1, hint:'B 較完整（含主語/地點），C 為因果句。' },
      { type:'choose', prompt:'你被問怎麼回家', choices:['巴士','我坐公車回家。','因為公車停開，所以我走回家。'], correct:1, hint:'B 為完整日常句，C 為因果敘述。' },
      { type:'choose', prompt:'看圖題：小朋友跌倒', choices:['我哭了。','在操場哭。','我在操場坐起來，擦掉眼淚後告訴老師我沒事。'], correct:2, hint:'C 最完整。' },
      { type:'choose', prompt:'哪一個句子標點正確？', choices:['我們先看地圖再出發最後到達山頂','我們先看地圖，再出發，最後到達山頂。','我們先看地圖再出發，最後到達山頂'], correct:1, hint:'第 2 項為正確標點（index 1）。' }
    ]
  },
  punct: {
    title:'標點修練',
    desc:'補上逗號與句號（只檢查基本位置）。',
    qs:[
      { type:'punct', prompt:'因為下雨所以我沒出門', answer:'因為下雨，所以我沒出門。', hint:'「因為…，所以…」建議在「所以」前加逗號。' },
      { type:'punct', prompt:'我先洗手再吃飯', answer:'我先洗手，再吃飯。', hint:'連續動作間加逗號。' },
      { type:'punct', prompt:'我們先看地圖再出發最後到達山頂', answer:'我們先看地圖，再出發，最後到達山頂。', hint:'多個步驟之間以逗號分隔。' },
      { type:'punct', prompt:'他很努力所以得到了獎品', answer:'他很努力，所以得到了獎品。', hint:'因果子句注意逗號位置。' },
      { type:'punct', prompt:'小明跑進教室他忘了帶書包', answer:'小明跑進教室，他忘了帶書包。', hint:'兩個簡短子句中間需以逗號分隔。' },
      { type:'punct', prompt:'先畫圖再上色最後勾邊', answer:'先畫圖，再上色，最後勾邊。', hint:'動作步驟間使用逗號。' },
      { type:'punct', prompt:'因為太熱所以我們喝水休息', answer:'因為太熱，所以我們喝水休息。', hint:'因為…所以…的句型前後常用逗號分隔。' },
      { type:'punct', prompt:'他在學校裡學習很認真', answer:'他在學校裡很認真地學習。', hint:'可改寫以使語序與標點更自然。' },
      { type:'punct', prompt:'今天下雨大家都沒去公園', answer:'今天下雨，大家都沒去公園。', hint:'主句與從句之間加逗號。' },
      { type:'punct', prompt:'因為沒帶傘所以淋濕了', answer:'因為沒帶傘，所以淋濕了。', hint:'檢查「因為」句的逗號位置。' }
    ]
  },
  picture: {
    title:'看圖任務',
    desc:'根據圖片（描述）回答：有誰？在哪？發生什麼事？心情如何？並組成 4 句短文。',
    qs:[
      { type:'picture', prompt:'山巔上，少俠抱著受傷的小狗。', answer:null, hint:'引導學生分四問：誰？在哪？發生什麼事？心情如何？' },
      { type:'picture', prompt:'廟口，一位老者在發放食物。', answer:null, hint:'鼓勵寫出原因或後續（例如：「因為…所以…」）。' },
      { type:'picture', prompt:'書房裡，有人在專心寫作業。', answer:null, hint:'可要求加入時間或人物名稱來豐富句子。' },
      { type:'picture', prompt:'操場上，兩個小朋友在比賽跑步。', answer:null, hint:'鼓勵描述比賽順序或情緒（緊張/興奮）。' },
      { type:'picture', prompt:'市場裡，小販在叫賣。', answer:null, hint:'可加上物品與顧客對話來豐富短文。' }
    ]
  }
};

let state = {
  points:0,
  badgeIndex:0,
  innerPower:0,
  maxInner:5,
  wuli:0,
  realm:'煉氣',
  currentLevel:null,
  currentQs:[],
  idx:0
};

function saveProgress(){
  const payload = {
    points: state.points,
    innerPower: state.innerPower,
    wuli: state.wuli,
    realm: state.realm
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  updateBadge();
}

function loadProgress(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(raw){
    try{
      const obj = JSON.parse(raw);
      state.points = obj.points || 0;
      state.innerPower = obj.innerPower || 0;
      state.wuli = obj.wuli || 0;
      state.realm = obj.realm || state.realm;
    }catch(e){}
  }
  updateBadge();
}

function updateBadge(){
  let idx = 0;
  for(let i=LEVEL_THRESHOLDS.length-1;i>=0;i--){ if(state.points>=LEVEL_THRESHOLDS[i]){ idx=i; break; }}
  const prev = state.badgeIndex;
  state.badgeIndex = idx;
  document.getElementById('badge').innerText = LEVEL_NAMES[idx];
  // update points and progress bar
  const pointsEl = document.getElementById('points-count'); if(pointsEl) pointsEl.innerText = state.points;
  const nextThreshold = LEVEL_THRESHOLDS[Math.min(idx+1, LEVEL_THRESHOLDS.length-1)];
  const currentThreshold = LEVEL_THRESHOLDS[idx];
  const delta = nextThreshold - currentThreshold || 1;
  const progress = Math.min(100, Math.floor(((state.points - currentThreshold)/delta)*100));
  const pb = document.getElementById('progress-bar'); if(pb) pb.style.width = progress + '%';
  const progWrap = document.querySelector('.progress');
  if(progWrap){ if(progress >= 100) progWrap.classList.add('full'); else progWrap.classList.remove('full'); }
  // if badge increased, show modal
  if(idx > prev){ showLevelUp(LEVEL_NAMES[idx]); }
}

// simple realm progression based on 武力值
const REALM_NAMES = ['煉氣','築基','金丹','元嬰','大乘'];
const REALM_WULI = [0,5,15,30,60];
function updateRealm(){
  let r = 0;
  for(let i=REALM_WULI.length-1;i>=0;i--){ if(state.wuli >= REALM_WULI[i]){ r = i; break; }}
  state.realm = REALM_NAMES[r] || REALM_NAMES[0];
  const el = document.getElementById('realm'); if(el) el.innerText = state.realm;
  const w = document.getElementById('wuli'); if(w) w.innerText = state.wuli;
}

function showLevelUp(name){
  const modal = document.getElementById('levelup-modal');
  if(!modal) return;
  document.getElementById('modal-badge').innerText = name;
  modal.classList.remove('hidden');
  document.getElementById('close-modal').onclick = ()=>{ modal.classList.add('hidden'); };
  // audio and confetti feedback
  playSound('levelup');
  spawnConfetti(28);
  // subtle decorative ink pulse to the side
  try{ pulseInk(); }catch(e){}
}

// audio feedback using WebAudio (no external files)
function playSound(kind){
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    if(kind==='correct'){
      o.type='sine'; o.frequency.value=520; g.gain.value=0.12;
      o.start(); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      o.stop(ctx.currentTime + 0.26);
    }else if(kind==='wrong'){
      o.type='square'; o.frequency.value=200; g.gain.value=0.14;
      o.start(); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      o.stop(ctx.currentTime + 0.31);
    }else if(kind==='levelup'){
      // short arpeggio
      const freqs=[660,880,990];
      let t=0; freqs.forEach((f,i)=>{ const oo = ctx.createOscillator(); const gg = ctx.createGain(); oo.connect(gg); gg.connect(ctx.destination); oo.type='sine'; oo.frequency.value=f; gg.gain.value=0.16; oo.start(ctx.currentTime + t); gg.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.16); oo.stop(ctx.currentTime + t + 0.18); t += 0.12; });
    }
  }catch(e){/*ignore audio errors*/}
}

function spawnConfetti(count=24){
  const colors=['#ffd166','#06d6a0','#ef476f','#118ab2','#ffd6a5'];
  for(let i=0;i<count;i++){
    const el = document.createElement('div'); el.className='confetti-piece';
    el.style.left = (10 + Math.random()*80) + '%';
    el.style.background = colors[Math.floor(Math.random()*colors.length)];
    el.style.transform = `translateY(-20px) rotate(${Math.random()*360}deg)`;
    el.style.animationDelay = (Math.random()*200) + 'ms';
    document.body.appendChild(el);
    setTimeout(()=>{ el.remove(); }, 1600);
  }
}

// decorative ink pulse: briefly toggle class to trigger CSS animation
function pulseInk(){
  const el = document.getElementById('ink-edge');
  if(!el) return;
  el.classList.remove('pulse');
  // reflow to restart animation
  void el.offsetWidth;
  el.classList.add('pulse');
  // remove after animation to keep DOM clean
  setTimeout(()=>{ el.classList.remove('pulse'); }, 1000);
}

function $(s){return document.querySelector(s)}

function init(){
  loadProgress();
  // menu buttons
  document.querySelectorAll('#menu button[data-action="start"]').forEach(b=>{
    b.addEventListener('click', ()=>startLevel(b.dataset.level));
  });
  // prologue button
  const proBtn = document.getElementById('prologue-btn'); if(proBtn) proBtn.addEventListener('click', ()=> showPrologue());
  $('#back').addEventListener('click', ()=>{$('#game').classList.add('hidden'); $('#menu').classList.remove('hidden'); $('#feedback').innerText='';});
  // initialize progress bar and points display
  const pointsEl = document.getElementById('points-count'); if(pointsEl) pointsEl.innerText = state.points;
  const pb = document.getElementById('progress-bar'); if(pb) pb.style.width = '0%';
  renderInnerPips();

  // NPC profiles and selection
  const npcProfiles = {
    master: {name:'字義師父', avatar:'🈶', greet:'少俠，來答題，我看看你的句子。'},
    elder: {name:'老莊長老', avatar:'🧓', greet:'孩子，慢慢來，多思考原因與結果。'},
    sister: {name:'慧心師姊', avatar:'👧', greet:'加油！多加形容詞讓句子更生動。'}
  };
  const sel = document.getElementById('npc-select');
  function setNpc(key){ const p = npcProfiles[key] || npcProfiles.master; const av = document.getElementById('npc-avatar'); const nm = document.getElementById('npc-name'); if(av) av.innerText = p.avatar; if(nm) nm.innerText = p.name; npcSay(p.greet); }
  if(sel){ sel.addEventListener('change', ()=> setNpc(sel.value)); setNpc(sel.value || 'master'); }

  // wire use-skill button (consume inner power to raise 武力值)
  const useBtn = document.getElementById('use-skill'); if(useBtn){ useBtn.addEventListener('click', ()=>{
    if(state.innerPower >= 3){
      state.innerPower -= 3;
      state.wuli += 5; // skill increases 武力值
      state.points += 1; // small point reward
      playSound('levelup'); spawnConfetti(18);
      try{ pulseInk(); }catch(e){}
      npcSay('你使出絕技！武力提升。');
      renderInnerPips(); updateBadge(); updateRealm(); saveProgress();
    } else {
      npcSay('內力不足，還需要更多的內功。');
      playSound('wrong');
    }
  }); }

  // ensure realm/wuli display updated
  updateRealm();
  // init ink interaction (mousemove/touch ripples)
  try{ initInkInteraction(); }catch(e){/*ignore*/}
  // auto-show prologue on first load
  try{
    if(!localStorage.getItem('zy_seen_prologue_v1')){
      showPrologue();
    }
  }catch(e){}
}

// ----- ink interaction: create ripples on mousemove/touch in right-side area -----
function initInkInteraction(){
  const overlay = document.getElementById('ink-interact');
  const inkEdge = document.getElementById('ink-edge');
  if(!overlay || !inkEdge) return;
  let last = 0;
  const THROTTLE = 80; // ms between ripples

  function makeRipple(clientX, clientY){
    const rect = overlay.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    // size based on vertical position (lower -> bigger)
    const size = 28 + Math.round((y / rect.height) * 84) + Math.round(Math.random()*36);
    const r = document.createElement('div'); r.className = 'ink-ripple';
    r.style.left = (x) + 'px'; r.style.top = (y) + 'px';
    r.style.width = size + 'px'; r.style.height = size + 'px';
    // color variation: deep ink to slightly diluted
    const a = 0.12 + Math.random()*0.18; // alpha
    r.style.background = `rgba(11,19,43,${a})`;
    // append to inkEdge so it appears over SVG
    inkEdge.appendChild(r);
    // force reflow then animate via class
    void r.offsetWidth; r.classList.add('anim');
    // remove after animation
    setTimeout(()=>{ try{ r.remove(); }catch(e){} }, 900);
  }

  function onMove(e){
    const t = Date.now();
    if(t - last < THROTTLE) return;
    last = t;
    const ev = e.touches ? e.touches[0] : e;
    makeRipple(ev.clientX, ev.clientY);
  }

  overlay.addEventListener('mousemove', onMove);
  overlay.addEventListener('touchmove', function(e){ e.preventDefault(); onMove(e); }, {passive:false});
  overlay.addEventListener('mouseleave', function(){
    // quick scatter of 3 small ripples
    const rect = overlay.getBoundingClientRect();
    for(let i=0;i<3;i++){ setTimeout(()=>{ makeRipple(rect.left + Math.random()*rect.width, rect.top + Math.random()*rect.height); }, i*80); }
  });
}

// show prologue modal using STORY_LINES (loaded from js/story_lines_data.js)
function showPrologue(){
  if(window.STORY_LINES && window.STORY_LINES.prologue){
    const p = window.STORY_LINES.prologue;
    const modal = document.getElementById('prologue-modal');
    if(!modal) return;
    document.getElementById('prologue-title').innerText = p.title || '序章';
    document.getElementById('prologue-content').innerText = p.modal || p.short || '';
    modal.classList.remove('hidden');
    document.getElementById('close-prologue').onclick = ()=>{ modal.classList.add('hidden'); try{ localStorage.setItem('zy_seen_prologue_v1','1'); }catch(e){} };
  }
}

// NPC_DIALOGUE integration
let currentSceneHint = null;
function getRoleIdForLevel(level){
  try{
    if(window.NPC_DIALOGUE && Array.isArray(window.NPC_DIALOGUE.npc_roles)){
      const r = window.NPC_DIALOGUE.npc_roles.find(x=>x.focus===level);
      return r ? r.id : null;
    }
  }catch(e){}
  return null;
}

function renderInnerPips(){
  // update numeric and bar UI
  const num = document.getElementById('power-numeric');
  if(num) num.innerText = state.innerPower + '/' + state.maxInner;
  const fill = document.getElementById('power-bar-fill');
  if(fill) fill.style.width = Math.round((state.innerPower / state.maxInner) * 100) + '%';
}

function npcSay(text){
  const b = document.getElementById('npc-bubble'); if(!b) return; b.innerText = text;
}

function gainInner(){
  state.innerPower = Math.min(state.maxInner, state.innerPower + 1);
  renderInnerPips();
  // if full
  if(state.innerPower >= state.maxInner){
    // trigger special effect: bonus points and reset inner power
    playSound('levelup');
    spawnConfetti(36);
    try{ pulseInk(); }catch(e){}
    state.points += 2; // bonus
    // small 武力提升作為獎勵
    state.wuli += 2;
    state.innerPower = 0;
    renderInnerPips();
    saveProgress();
    updateRealm();
    npcSay('內功滿格！你使出絕技，獲得額外內功與武力！');
    // show modal briefly
    showLevelUp('內功大成');
  } else {
    npcSay('好樣的！內功 +1。繼續努力。');
  }
  updateBadge();
}

function startLevel(level){
  state.currentLevel = level;
  state.currentQs = JSON.parse(JSON.stringify(QUESTIONS[level].qs));
  state.idx = 0;
  $('#stage-title').innerText = QUESTIONS[level].title;
  $('#stage-desc').innerText = QUESTIONS[level].desc;
  // show contextual NPC line from STORY_LINES if available
  try{
    if(window.STORY_LINES && window.STORY_LINES.levels && window.STORY_LINES.levels[level]){
      const lvl = window.STORY_LINES.levels[level];
      const npcKey = (document.getElementById('npc-select')||{}).value || 'master';
      // branching: choose variant based on points threshold
      let line = (lvl.npc_lines && lvl.npc_lines[npcKey]) || '';
      if(lvl.branches){
        const th = lvl.branches.threshold || 0;
        const variant = state.points >= th ? 'good' : 'bad';
        if(lvl.branches[variant] && lvl.branches[variant][npcKey]) line = lvl.branches[variant][npcKey];
      }
      if(line) {
        npcSay(line);
        const b = document.getElementById('npc-bubble'); if(b){ b.classList.add('talking'); setTimeout(()=>b.classList.remove('talking'),900); }
      }
    }
  }catch(e){/*ignore*/}
  // also try to show per-scene NPC dialogue from NPC_DIALOGUE
  try{
    const roleId = getRoleIdForLevel(level);
    if(roleId && window.NPC_DIALOGUE && window.NPC_DIALOGUE.scenes && window.NPC_DIALOGUE.scenes[roleId]){
      const scenes = window.NPC_DIALOGUE.scenes[roleId];
      const sc = scenes[state.idx] || scenes[0];
      if(sc && sc.line){ npcSay(sc.line); const b = document.getElementById('npc-bubble'); if(b){ b.classList.add('talking'); setTimeout(()=>b.classList.remove('talking'),900); } currentSceneHint = sc.hint || null; }
      else currentSceneHint = null;
    } else { currentSceneHint = null; }
  }catch(e){ currentSceneHint = null; }
  $('#menu').classList.add('hidden');
  $('#game').classList.remove('hidden');
  $('#feedback').className = 'feedback'; $('#feedback').innerText='';
  renderQuestion();
}

function renderQuestion(){
  const q = state.currentQs[state.idx];
  const area = $('#question-area'); area.innerHTML='';
  const controls = $('#controls'); controls.innerHTML='';
  if(!q){ area.innerHTML = '<div class="meta">此關卡已完成！回到選單獲得獎勵。</div>'; controls.innerHTML = '<div class="controls-row"><button id="finish">回選單</button></div>'; $('#finish').addEventListener('click', ()=> {$('#back').click();}); return; }

  const p = document.createElement('div'); p.className='question';
  p.innerHTML = `<div><strong>題目：</strong>${q.prompt}</div>`;
  area.appendChild(p);

  // show NPC scene hint if present
  if(currentSceneHint){ const nh = document.createElement('div'); nh.className='meta'; nh.innerHTML = `<strong>NPC 提示：</strong>${currentSceneHint}`; area.appendChild(nh); }

  if(q.type==='complete'){
    const inp = document.createElement('textarea'); inp.rows=2; inp.id='answer'; inp.placeholder='請寫出完整句子（誰 + 在哪裡 + 做什麼）'; area.appendChild(inp);
    const sample = document.createElement('div'); sample.className='meta'; sample.innerHTML = `<em>範例答案：${q.answer}</em>`; area.appendChild(sample);
    if(q.hint) { const hint = document.createElement('div'); hint.className='meta'; hint.innerHTML = `<strong>教師提示：</strong>${q.hint}`; area.appendChild(hint); }
  }else if(q.type==='cause' || q.type==='sequence' || q.type==='feeling'){
    const inp = document.createElement('textarea'); inp.rows=2; inp.id='answer'; inp.placeholder='請用指定句型作答（請注意連接詞）'; area.appendChild(inp);
    const sample = document.createElement('div'); sample.className='meta'; sample.innerHTML = `<em>範例答案：${q.answer}</em>`; area.appendChild(sample);
    if(q.hint) { const hint = document.createElement('div'); hint.className='meta'; hint.innerHTML = `<strong>教師提示：</strong>${q.hint}`; area.appendChild(hint); }
  }else if(q.type==='choose'){
    q.choices.forEach((c,i)=>{
      const label = document.createElement('label'); label.className='choice';
      label.innerHTML = `<input type="radio" name="choice" value="${i}"> ${c}`;
      area.appendChild(label);
    });
    if(q.hint) { const hint = document.createElement('div'); hint.className='meta'; hint.innerHTML = `<strong>教師提示：</strong>${q.hint}`; area.appendChild(hint); }
  }else if(q.type==='punct'){
    const orig = document.createElement('div'); orig.className='meta'; orig.innerText = '原句（缺標點）： ' + q.prompt; area.appendChild(orig);
    const inp = document.createElement('textarea'); inp.rows=2; inp.id='answer'; inp.placeholder='請在合適位置加上逗號與句號'; area.appendChild(inp);
    if(q.hint) { const hint = document.createElement('div'); hint.className='meta'; hint.innerHTML = `<strong>教師提示：</strong>${q.hint}`; area.appendChild(hint); }
  }else if(q.type==='picture'){
    const desc = document.createElement('div'); desc.className='meta'; desc.innerText = q.prompt; area.appendChild(desc);
    ['有誰？','在哪？','發生什麼事？','心情如何？'].forEach((label,i)=>{
      const lab = document.createElement('div'); lab.innerText = label; area.appendChild(lab);
      const inp = document.createElement('input'); inp.type='text'; inp.id='p'+i; inp.placeholder = label; area.appendChild(inp);
    });
    if(q.hint) { const hint = document.createElement('div'); hint.className='meta'; hint.innerHTML = `<strong>教師提示：</strong>${q.hint}`; area.appendChild(hint); }
  }

  const btn = document.createElement('button'); btn.innerText='提交答案'; btn.addEventListener('click', ()=>checkAnswer(q));
  const nextBtn = document.createElement('button'); nextBtn.innerText='略過題目'; nextBtn.addEventListener('click', ()=>{state.idx++; renderQuestion();});
  const hintBtn = document.createElement('button'); hintBtn.innerText='檢視提示'; hintBtn.addEventListener('click', ()=>{ if(q.hint) { $('#feedback').className='feedback'; $('#feedback').innerText=q.hint; } else { $('#feedback').className='feedback bad'; $('#feedback').innerText='無提示。'; } });
  // extend hint button to show NPC scene hint if available
  hintBtn.addEventListener('click', ()=>{ if(currentSceneHint){ $('#feedback').className='feedback'; $('#feedback').innerText = 'NPC 提示：' + currentSceneHint; } });
  const ansBtn = document.createElement('button'); ansBtn.innerText='檢視答案'; ansBtn.addEventListener('click', ()=>{ $('#feedback').className='feedback'; $('#feedback').innerText = q.answer ? ('範例答案：' + q.answer) : '此題無標準答案，請參考教師提示。'; });
  controls.appendChild(btn); controls.appendChild(nextBtn); controls.appendChild(hintBtn); controls.appendChild(ansBtn);
}

function checkAnswer(q){
  const fb = $('#feedback'); fb.className='feedback'; fb.innerText='';
  let correct = false;
  if(q.type==='choose'){
    const sel = document.querySelector('input[name="choice"]:checked');
    if(sel && parseInt(sel.value,10)===q.correct) correct=true;
  }else if(q.type==='punct'){
    const val = (document.getElementById('answer')||{}).value||'';
    if(val.trim() === q.answer) correct=true;
  }else if(q.type==='picture'){
    const who = (document.getElementById('p0')||{}).value.trim();
    const where = (document.getElementById('p1')||{}).value.trim();
    const act = (document.getElementById('p2')||{}).value.trim();
    const feel = (document.getElementById('p3')||{}).value.trim();
    if(who && where && act && feel) correct=true;
  }else if(q.type==='complete'){
    const val = (document.getElementById('answer')||{}).value;
    if(!val) correct=false; else{
      // 檢查關鍵字
      correct = (q.keywords || []).every(k => val.includes(k));
    }
  }else if(q.type==='cause'){
    const val = (document.getElementById('answer')||{}).value;
    if(val.includes('因為') && val.includes('所以')) correct=true;
  }else if(q.type==='sequence'){
    const val = (document.getElementById('answer')||{}).value;
    if(val.includes('先') && val.includes('再') && val.includes('最後')) correct=true;
  }else if(q.type==='feeling'){
    const val = (document.getElementById('answer')||{}).value;
    if(val.includes('我覺得') && val.includes('因為')) correct=true;
  }

  if(correct){
    fb.classList.add('ok'); fb.innerText = '答對！獲得 1 點內功。';
    playSound('correct');
    state.points += 1; // base point
    gainInner();
    saveProgress();
  }else{
    fb.classList.add('bad'); fb.innerText = '答案不完全正確，請再試一次或略過題目觀看範例。';
    playSound('wrong');
  }
  // 下一題（成功或略過後）
  if(correct) state.idx++;
  setTimeout(()=>{ renderQuestion(); }, 900);
}

document.addEventListener('DOMContentLoaded', init);
