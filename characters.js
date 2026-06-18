/* ═══════════════════════════════════════════════════
   Claude Pet — 8 个独立角色库
   每个角色 = { name, emoji, svg (120x130 viewBox), css }
   SVG 内包含完整形象: 眼/瞳/嘴/四肢都在 SVG 中
   ═══════════════════════════════════════════════════ */

const CHARACTERS = {

  /* ═══════════════════════════════════════════════
     🍡 麻薯 (默认) — 精绘 CSS 宠物, 支持 5 套主题
     ═══════════════════════════════════════════════ */
  mochi: {
    name: "小麻薯", emoji: "🍡",
    themed: true,
    html: `<div class="antenna" id="antenna"><div class="antenna-ball"></div></div>
<div class="ears"><div class="ear left"></div><div class="ear right"></div></div>
<div class="body"></div>
<div class="eyes"><div class="eye left"><div class="pupil"></div></div><div class="eye right"><div class="pupil"></div></div></div>
<div class="blush left"></div><div class="blush right"></div>
<div class="mouth"></div>
<div class="arm left"></div><div class="arm right"></div>
<div class="foot left"></div><div class="foot right"></div>`,
    css: ``,
  },

  /* ═══════════════════════════════════════════════
     🐱 橘猫 — 三角耳 + 杏仁眼 + 条纹尾巴
     ═══════════════════════════════════════════════ */
  cat: {
    name: "小橘猫", emoji: "🐱",
    svg: `<svg viewBox="0 0 120 130">
  <defs><radialGradient id="catBody"><stop offset="0%" stop-color="#FFB347"/><stop offset="100%" stop-color="#E8781A"/></radialGradient></defs>
  <!-- 尾巴 -->
  <path id="c-tail" d="M86,98 Q108,80 104,60 Q102,50 96,52" fill="none" stroke="url(#catBody)" stroke-width="6" stroke-linecap="round"/>
  <!-- 身体 -->
  <ellipse cx="60" cy="98" rx="30" ry="22" fill="url(#catBody)"/>
  <!-- 前爪 -->
  <ellipse cx="38" cy="110" rx="10" ry="8" fill="#E8781A"/>
  <ellipse cx="82" cy="110" rx="10" ry="8" fill="#E8781A"/>
  <!-- 后腿 -->
  <ellipse cx="42" cy="96" rx="12" ry="9" fill="#E8781A"/>
  <ellipse cx="78" cy="96" rx="12" ry="9" fill="#E8781A"/>
  <!-- 左耳 -->
  <polygon id="c-earL" points="28,40 14,8 44,22" fill="url(#catBody)"/>
  <polygon points="30,36 20,14 40,25" fill="#FFB0B0"/>
  <!-- 右耳 -->
  <polygon id="c-earR" points="92,40 106,8 76,22" fill="url(#catBody)"/>
  <polygon points="90,36 100,14 80,25" fill="#FFB0B0"/>
  <!-- 脸 -->
  <ellipse cx="60" cy="58" rx="38" ry="34" fill="url(#catBody)"/>
  <ellipse cx="60" cy="63" rx="26" ry="18" fill="#FFF5E8"/>
  <!-- 条纹 -->
  <path d="M30,42 Q34,38 38,42" stroke="#D06010" stroke-width="2" fill="none" stroke-linecap="round" opacity=".5"/>
  <path d="M82,42 Q86,38 90,42" stroke="#D06010" stroke-width="2" fill="none" stroke-linecap="round" opacity=".5"/>
  <!-- 眼睛 -->
  <ellipse id="c-eyeL" cx="46" cy="56" rx="8" ry="9" fill="white"/>
  <ellipse id="c-eyeR" cx="74" cy="56" rx="8" ry="9" fill="white"/>
  <ellipse id="c-pupL" cx="46" cy="57" rx="4" ry="5.5" fill="#2C1810"/>
  <ellipse id="c-pupR" cx="74" cy="57" rx="4" ry="5.5" fill="#2C1810"/>
  <circle cx="48" cy="54" r="2" fill="white"/>
  <circle cx="76" cy="54" r="2" fill="white"/>
  <!-- 鼻子 -->
  <ellipse cx="60" cy="68" rx="5" ry="3.5" fill="#FF7B7B"/>
  <!-- 嘴 -->
  <path id="c-mouth" d="M54,73 Q60,79 66,73" fill="none" stroke="#C08060" stroke-width="1.5" stroke-linecap="round"/>
  <!-- 胡须 -->
  <line x1="16" y1="62" x2="38" y2="64" stroke="#FFD0A0" stroke-width="1" stroke-linecap="round"/>
  <line x1="14" y1="68" x2="36" y2="68" stroke="#FFD0A0" stroke-width="1" stroke-linecap="round"/>
  <line x1="104" y1="62" x2="82" y2="64" stroke="#FFD0A0" stroke-width="1" stroke-linecap="round"/>
  <line x1="106" y1="68" x2="84" y2="68" stroke="#FFD0A0" stroke-width="1" stroke-linecap="round"/>
</svg>`,
    css: `
.state-idle #c-tail{animation:catTail 2.5s ease-in-out infinite;transform-origin:86px 98px}
@keyframes catTail{0%,100%{transform:rotate(0)}30%{transform:rotate(-20deg)}70%{transform:rotate(15deg)}}
.state-idle #c-earL{animation:catEarL 3s ease-in-out infinite;transform-origin:28px 40px}
.state-idle #c-earR{animation:catEarR 3s ease-in-out infinite;transform-origin:92px 40px}
@keyframes catEarL{0%,100%{transform:rotate(0)}40%{transform:rotate(-12deg)}}
@keyframes catEarR{0%,100%{transform:rotate(0)}40%{transform:rotate(12deg)}}
.state-thinking #c-pupL,.state-thinking #c-pupR{transform:translateY(-5px)}
.state-thinking #c-tail{animation:catTailFast .4s ease-in-out infinite}
@keyframes catTailFast{0%,100%{transform:rotate(-10deg)}50%{transform:rotate(10deg)}}
.state-tool_use #c-earL{transform:rotate(-20deg)}.state-tool_use #c-earR{transform:rotate(20deg)}
.pet-container.yawning #c-mouth{display:none}
`,
  },

  /* ═══════════════════════════════════════════════
     🐶 柯基 — 大立耳 + 圆眼 + 吐舌头
     ═══════════════════════════════════════════════ */
  dog: {
    name: "小柯基", emoji: "🐶",
    svg: `<svg viewBox="0 0 120 130">
  <defs><radialGradient id="dogBody"><stop offset="0%" stop-color="#E8B860"/><stop offset="100%" stop-color="#C88030"/></radialGradient></defs>
  <!-- 身体 -->
  <ellipse cx="60" cy="100" rx="32" ry="24" fill="url(#dogBody)"/>
  <!-- 短腿 -->
  <rect x="34" y="110" width="14" height="12" rx="6" fill="#C88030"/>
  <rect x="72" y="110" width="14" height="12" rx="6" fill="#C88030"/>
  <!-- 尾巴(小圆球) -->
  <circle id="d-tail" cx="90" cy="90" r="8" fill="#E8B860"/>
  <!-- 左耳(大三角) -->
  <polygon id="d-earL" points="18,32 10,4 34,22" fill="#C88030"/>
  <polygon points="20,28 14,10 30,22" fill="#F0D0A0"/>
  <!-- 右耳(大三角) -->
  <polygon id="d-earR" points="102,32 110,4 86,22" fill="#C88030"/>
  <polygon points="100,28 106,10 90,22" fill="#F0D0A0"/>
  <!-- 脸 -->
  <ellipse cx="60" cy="58" rx="40" ry="36" fill="url(#dogBody)"/>
  <!-- 额头白斑 -->
  <ellipse cx="60" cy="42" rx="14" ry="10" fill="#FFF8EE" opacity=".6"/>
  <!-- 脸颊 -->
  <ellipse cx="60" cy="66" rx="28" ry="16" fill="#FFF8EE"/>
  <!-- 眼睛 -->
  <circle id="d-eyeL" cx="44" cy="54" r="9" fill="white"/>
  <circle id="d-eyeR" cx="76" cy="54" r="9" fill="white"/>
  <circle id="d-pupL" cx="46" cy="55" r="5.5" fill="#1A0F08"/>
  <circle id="d-pupR" cx="78" cy="55" r="5.5" fill="#1A0F08"/>
  <circle cx="48" cy="52" r="2.5" fill="white"/>
  <circle cx="80" cy="52" r="2.5" fill="white"/>
  <!-- 鼻子 -->
  <ellipse cx="60" cy="66" rx="8" ry="6" fill="#2C1810"/>
  <ellipse cx="58" cy="64" rx="3" ry="2" fill="rgba(255,255,255,.3)"/>
  <!-- 舌头 -->
  <ellipse id="d-tongue" cx="60" cy="78" rx="7" ry="10" fill="#FF8A80"/>
  <line x1="56" y1="76" x2="64" y2="76" stroke="#E57373" stroke-width="1"/>
  <!-- 嘴 -->
  <path id="d-mouth" d="M50,72 Q60,78 70,72" fill="none" stroke="#8B6B4A" stroke-width="1.8" stroke-linecap="round"/>
</svg>`,
    css: `
.state-idle #d-tail{animation:dogWag .5s ease-in-out infinite;transform-origin:90px 90px}
@keyframes dogWag{0%,100%{transform:rotate(0)}50%{transform:rotate(-25deg)}}
.state-idle #d-earL{animation:dogEarL 2s ease-in-out infinite;transform-origin:18px 32px}
.state-idle #d-earR{animation:dogEarR 2s ease-in-out infinite;transform-origin:102px 32px}
@keyframes dogEarL{0%,100%{transform:rotate(0)}50%{transform:rotate(-8deg)}}
@keyframes dogEarR{0%,100%{transform:rotate(0)}50%{transform:rotate(8deg)}}
.state-thinking #d-pupL,.state-thinking #d-pupR{transform:translateY(-4px)}
.state-thinking #d-tail{animation:dogWagFast .25s ease-in-out infinite}
@keyframes dogWagFast{0%,100%{transform:rotate(0)}50%{transform:rotate(-30deg)}}
.state-idle #d-tongue{animation:dogPant 2s ease-in-out infinite}
@keyframes dogPant{0%,100%{transform:translateY(0)}50%{transform:translateY(2px)}}
`,
  },

  /* ═══════════════════════════════════════════════
     🐰 白兔 — 长耳朵 + 粉鼻 + 圆尾巴
     ═══════════════════════════════════════════════ */
  bunny: {
    name: "小白兔", emoji: "🐰",
    svg: `<svg viewBox="0 0 120 130">
  <defs><radialGradient id="bunBody"><stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#E8E0E0"/></radialGradient></defs>
  <!-- 尾巴 -->
  <circle cx="90" cy="108" r="10" fill="white"/>
  <circle cx="90" cy="108" r="6" fill="#F5F0F0"/>
  <!-- 身体 -->
  <ellipse cx="60" cy="98" rx="28" ry="24" fill="url(#bunBody)"/>
  <!-- 前爪 -->
  <ellipse cx="38" cy="112" rx="10" ry="8" fill="white"/>
  <ellipse cx="82" cy="112" rx="10" ry="8" fill="white"/>
  <!-- 左耳(长) -->
  <ellipse id="b-earL" cx="32" cy="18" rx="9" ry="30" fill="white" transform="rotate(-12,32,18)"/>
  <ellipse cx="32" cy="20" rx="5" ry="22" fill="#FFD0D0" transform="rotate(-12,32,20)"/>
  <!-- 右耳(长) -->
  <ellipse id="b-earR" cx="88" cy="18" rx="9" ry="30" fill="white" transform="rotate(12,88,18)"/>
  <ellipse cx="88" cy="20" rx="5" ry="22" fill="#FFD0D0" transform="rotate(12,88,20)"/>
  <!-- 脸 -->
  <ellipse cx="60" cy="58" rx="36" ry="32" fill="url(#bunBody)"/>
  <!-- 脸颊膨起 -->
  <ellipse cx="40" cy="64" rx="12" ry="8" fill="white" opacity=".9"/>
  <ellipse cx="80" cy="64" rx="12" ry="8" fill="white" opacity=".9"/>
  <!-- 眼睛 -->
  <circle id="b-eyeL" cx="44" cy="54" r="8" fill="#1A0F08"/>
  <circle id="b-eyeR" cx="76" cy="54" r="8" fill="#1A0F08"/>
  <circle cx="47" cy="51" r="3" fill="white"/>
  <circle cx="79" cy="51" r="3" fill="white"/>
  <circle cx="43" cy="56" r="1.5" fill="white"/>
  <circle cx="75" cy="56" r="1.5" fill="white"/>
  <!-- 鼻子 -->
  <ellipse cx="60" cy="66" rx="4" ry="3" fill="#FFB0B0"/>
  <!-- 嘴 -->
  <path id="b-mouth" d="M55,71 L60,76 L65,71" fill="none" stroke="#D0C0C0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- 胡须 -->
  <line x1="22" y1="60" x2="38" y2="63" stroke="#E0D0D0" stroke-width="1"/>
  <line x1="20" y1="66" x2="36" y2="66" stroke="#E0D0D0" stroke-width="1"/>
  <line x1="98" y1="60" x2="82" y2="63" stroke="#E0D0D0" stroke-width="1"/>
  <line x1="100" y1="66" x2="84" y2="66" stroke="#E0D0D0" stroke-width="1"/>
</svg>`,
    css: `
.state-idle #b-earL{animation:bunEarL 3.5s ease-in-out infinite;transform-origin:32px 40px}
.state-idle #b-earR{animation:bunEarR 3.5s ease-in-out infinite;transform-origin:88px 40px}
@keyframes bunEarL{0%,100%{transform:rotate(-12deg)}40%{transform:rotate(-25deg)}70%{transform:rotate(-5deg)}}
@keyframes bunEarR{0%,100%{transform:rotate(12deg)}40%{transform:rotate(25deg)}70%{transform:rotate(5deg)}}
.state-thinking #b-earL{transform:rotate(-30deg)}.state-thinking #b-earR{transform:rotate(30deg)}
`,
  },

  /* ═══════════════════════════════════════════════
     🦆 小黄鸭 — 扁喙 + 翅膀 + 蹼足
     ═══════════════════════════════════════════════ */
  duck: {
    name: "小黄鸭", emoji: "🦆",
    svg: `<svg viewBox="0 0 120 130">
  <defs><radialGradient id="duckBody"><stop offset="0%" stop-color="#FFE082"/><stop offset="100%" stop-color="#FFB300"/></radialGradient></defs>
  <!-- 脚 -->
  <ellipse cx="38" cy="120" rx="12" ry="5" fill="#FF8F00"/>
  <ellipse cx="82" cy="120" rx="12" ry="5" fill="#FF8F00"/>
  <!-- 身体 -->
  <ellipse cx="60" cy="92" rx="38" ry="30" fill="url(#duckBody)"/>
  <!-- 翅膀 -->
  <ellipse id="d-wingL" cx="30" cy="88" rx="14" ry="20" fill="#FFC107" transform="rotate(15,30,88)"/>
  <ellipse id="d-wingR" cx="90" cy="88" rx="14" ry="20" fill="#FFC107" transform="rotate(-15,90,88)"/>
  <!-- 头 -->
  <circle cx="60" cy="48" r="26" fill="url(#duckBody)"/>
  <!-- 头毛 -->
  <circle cx="52" cy="26" r="5" fill="#FFD54F"/>
  <circle cx="60" cy="23" r="6" fill="#FFE082"/>
  <circle cx="68" cy="26" r="5" fill="#FFD54F"/>
  <!-- 眼睛 -->
  <circle id="dk-eyeL" cx="48" cy="44" r="7" fill="white"/>
  <circle id="dk-eyeR" cx="72" cy="44" r="7" fill="white"/>
  <circle id="dk-pupL" cx="49" cy="45" r="4" fill="#1A1008"/>
  <circle id="dk-pupR" cx="73" cy="45" r="4" fill="#1A1008"/>
  <circle cx="51" cy="42" r="1.8" fill="white"/>
  <circle cx="75" cy="42" r="1.8" fill="white"/>
  <!-- 喙 -->
  <ellipse id="d-beak" cx="60" cy="60" rx="15" ry="7" fill="#FF8F00"/>
  <path d="M48,60 Q60,56 72,60" fill="none" stroke="#E65100" stroke-width="1.2" opacity=".5"/>
  <!-- 鼻孔 -->
  <circle cx="55" cy="57" r="1.2" fill="#E65100" opacity=".5"/>
  <circle cx="65" cy="57" r="1.2" fill="#E65100" opacity=".5"/>
</svg>`,
    css: `
.state-idle #d-wingL{animation:duckWingL 3s ease-in-out infinite;transform-origin:30px 88px}
.state-idle #d-wingR{animation:duckWingR 3s ease-in-out infinite;transform-origin:90px 88px}
@keyframes duckWingL{0%,100%{transform:rotate(15deg)}50%{transform:rotate(-5deg)}}
@keyframes duckWingR{0%,100%{transform:rotate(-15deg)}50%{transform:rotate(5deg)}}
.state-thinking #d-beak{animation:beakClack .5s ease-in-out infinite;transform-origin:60px 60px}
@keyframes beakClack{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.25)}}
.state-processing #d-wingL{animation:wingFlapL .3s ease-in-out infinite}
.state-processing #d-wingR{animation:wingFlapR .3s ease-in-out infinite}
@keyframes wingFlapL{0%,100%{transform:rotate(15deg)}50%{transform:rotate(-30deg)}}
@keyframes wingFlapR{0%,100%{transform:rotate(-15deg)}50%{transform:rotate(30deg)}}
`,
  },

  /* ═══════════════════════════════════════════════
     🦢 天鹅 — S 形颈 + 优雅翅膀
     ═══════════════════════════════════════════════ */
  swan: {
    name: "小天鹅", emoji: "🦢",
    svg: `<svg viewBox="0 0 120 130">
  <defs>
    <radialGradient id="swanBody"><stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#E8E4E0"/></radialGradient>
    <linearGradient id="swanBeak"><stop offset="0%" stop-color="#FF8F00"/><stop offset="100%" stop-color="#E65100"/></linearGradient>
  </defs>
  <!-- 水波 -->
  <ellipse cx="60" cy="116" rx="52" ry="7" fill="none" stroke="#B0D8F0" stroke-width="2" opacity=".4"/>
  <ellipse cx="60" cy="112" rx="44" ry="4" fill="none" stroke="#C0E4F8" stroke-width="1.5" opacity=".3"/>
  <!-- 身体 -->
  <ellipse cx="60" cy="96" rx="42" ry="20" fill="url(#swanBody)"/>
  <!-- 翅膀 -->
  <path id="s-wingL" d="M18,88 Q8,55 32,58 Q48,62 40,92" fill="#E0DCD8"/>
  <path id="s-wingR" d="M102,88 Q112,55 88,58 Q72,62 80,92" fill="#E0DCD8"/>
  <!-- 脖子 (S 曲线) -->
  <path id="s-neck" d="M60,82 Q54,60 48,42 Q42,24 54,16" fill="none" stroke="url(#swanBody)" stroke-width="14" stroke-linecap="round"/>
  <!-- 头 -->
  <circle cx="56" cy="16" r="13" fill="white"/>
  <!-- 眼睛 -->
  <circle id="s-eye" cx="50" cy="14" r="3" fill="#1A1008"/>
  <circle cx="51" cy="13" r="1.2" fill="white"/>
  <!-- 喙 -->
  <path id="s-beak" d="M66,12 L94,16 L66,20 Z" fill="url(#swanBeak)"/>
  <line x1="78" y1="15" x2="88" y2="16" stroke="#BF360C" stroke-width=".8" opacity=".6"/>
</svg>`,
    css: `
.state-idle #s-neck{animation:swanNeck 4s ease-in-out infinite;transform-origin:60px 82px}
@keyframes swanNeck{0%,100%{d:path("M60,82 Q54,60 48,42 Q42,24 54,16")}50%{d:path("M60,82 Q56,58 52,40 Q48,22 58,14")}}
.state-idle #s-wingL{animation:swanWing 5s ease-in-out infinite;transform-origin:40px 80px}
@keyframes swanWing{0%,100%{transform:rotate(0)}30%{transform:rotate(-8deg)}70%{transform:rotate(5deg)}}
.state-thinking #s-beak{animation:beakPoint .8s ease-in-out infinite;transform-origin:66px 16px}
@keyframes beakPoint{0%,100%{transform:rotate(0)}50%{transform:rotate(-10deg)}}
`,
  },

  /* ═══════════════════════════════════════════════
     🐴 小马 — 鬃毛 + 大眼 + 蹄子
     ═══════════════════════════════════════════════ */
  pony: {
    name: "小棕马", emoji: "🐴",
    svg: `<svg viewBox="0 0 120 130">
  <defs><radialGradient id="ponyBody"><stop offset="0%" stop-color="#D4A070"/><stop offset="100%" stop-color="#A06840"/></radialGradient></defs>
  <!-- 身体 -->
  <ellipse cx="60" cy="96" rx="30" ry="22" fill="url(#ponyBody)"/>
  <!-- 腿 -->
  <rect x="38" y="106" width="11" height="16" rx="5" fill="#A06840"/>
  <rect x="71" y="106" width="11" height="16" rx="5" fill="#A06840"/>
  <!-- 蹄 -->
  <rect x="36" y="118" width="15" height="5" rx="2" fill="#5C3820"/>
  <rect x="69" y="118" width="15" height="5" rx="2" fill="#5C3820"/>
  <!-- 尾巴 -->
  <path id="p-tail" d="M88,90 Q104,80 100,65 Q98,58 94,62" fill="none" stroke="#6B4226" stroke-width="7" stroke-linecap="round"/>
  <!-- 耳朵 -->
  <ellipse id="p-earL" cx="34" cy="30" rx="7" ry="16" fill="#D4A070" transform="rotate(-10,34,30)"/>
  <ellipse cx="34" cy="33" rx="4" ry="10" fill="#F0C8A0" transform="rotate(-10,34,33)"/>
  <ellipse id="p-earR" cx="86" cy="30" rx="7" ry="16" fill="#D4A070" transform="rotate(10,86,30)"/>
  <ellipse cx="86" cy="33" rx="4" ry="10" fill="#F0C8A0" transform="rotate(10,86,33)"/>
  <!-- 鬃毛 -->
  <path id="p-mane" d="M52,28 Q46,42 48,58 Q50,50 54,44 Q50,38 52,28" fill="#6B4226"/>
  <!-- 脸 -->
  <ellipse cx="60" cy="54" rx="32" ry="28" fill="url(#ponyBody)"/>
  <!-- 口鼻部 -->
  <ellipse cx="60" cy="66" rx="18" ry="12" fill="#FFF0E0"/>
  <!-- 鼻孔 -->
  <ellipse cx="54" cy="65" rx="3" ry="2.5" fill="#8B6040"/>
  <ellipse cx="66" cy="65" rx="3" ry="2.5" fill="#8B6040"/>
  <!-- 眼睛 -->
  <ellipse id="p-eyeL" cx="44" cy="50" rx="9" ry="10" fill="white"/>
  <ellipse id="p-eyeR" cx="76" cy="50" rx="9" ry="10" fill="white"/>
  <ellipse id="p-pupL" cx="46" cy="52" rx="5.5" ry="6.5" fill="#1A0F08"/>
  <ellipse id="p-pupR" cx="78" cy="52" rx="5.5" ry="6.5" fill="#1A0F08"/>
  <circle cx="48" cy="48" r="2.5" fill="white"/>
  <circle cx="80" cy="48" r="2.5" fill="white"/>
  <!-- 嘴 -->
  <path id="p-mouth" d="M54,74 Q60,78 66,74" fill="none" stroke="#8B6040" stroke-width="1.5" stroke-linecap="round"/>
</svg>`,
    css: `
.state-idle #p-mane{animation:maneSway 3s ease-in-out infinite;transform-origin:50px 40px}
@keyframes maneSway{0%,100%{transform:rotate(0)}50%{transform:rotate(5deg)}}
.state-idle #p-tail{animation:tailSway 2.5s ease-in-out infinite;transform-origin:88px 90px}
@keyframes tailSway{0%,100%{transform:rotate(0)}50%{transform:rotate(-15deg)}}
.state-idle #p-earL{animation:ponyEar 2s ease-in-out infinite}
.state-idle #p-earR{animation:ponyEar 2s ease-in-out .3s infinite}
@keyframes ponyEar{0%,100%{transform:rotate(0)}50%{transform:rotate(-15deg)}}
.state-thinking #p-pupL,.state-thinking #p-pupR{transform:translateY(-4px)}
`,
  },

  /* ═══════════════════════════════════════════════
     🦸 钢铁侠 — 头盔 + 方舟反应堆 + 脉冲炮
     ═══════════════════════════════════════════════ */
  ironman: {
    name: "钢铁侠", emoji: "🦸",
    svg: `<svg viewBox="0 0 120 130">
  <defs>
    <linearGradient id="imGold"><stop offset="0%" stop-color="#FFD54F"/><stop offset="100%" stop-color="#D4AF37"/></linearGradient>
    <linearGradient id="imRed"><stop offset="0%" stop-color="#E53935"/><stop offset="100%" stop-color="#8B0000"/></linearGradient>
  </defs>
  <!-- 推进器火焰 -->
  <ellipse id="im-flameL" cx="38" cy="114" rx="8" ry="14" fill="#FF8F00" opacity=".6"/>
  <ellipse id="im-flameR" cx="82" cy="114" rx="8" ry="14" fill="#FF8F00" opacity=".6"/>
  <!-- 身体 -->
  <rect x="32" y="82" width="56" height="34" rx="12" fill="url(#imRed)"/>
  <!-- 金色腰带 -->
  <rect x="32" y="92" width="56" height="4" fill="url(#imGold)"/>
  <!-- 方舟反应堆 -->
  <circle id="im-arc" cx="60" cy="88" r="10" fill="#80D8FF"/>
  <circle cx="60" cy="88" r="7" fill="#B3E5FC"/>
  <circle cx="60" cy="88" r="4" fill="white"/>
  <circle cx="60" cy="88" r="2" fill="#80D8FF"/>
  <!-- 手臂 + 脉冲炮 -->
  <rect x="18" y="84" width="18" height="22" rx="8" fill="url(#imRed)"/>
  <rect x="84" y="84" width="18" height="22" rx="8" fill="url(#imRed)"/>
  <circle id="im-repL" cx="28" cy="98" r="7" fill="#FFF9C4"/>
  <circle id="im-repR" cx="92" cy="98" r="7" fill="#FFF9C4"/>
  <!-- 头盔 -->
  <rect x="22" y="16" width="76" height="68" rx="34" fill="url(#imRed)"/>
  <!-- 头盔金色面板 -->
  <rect x="30" y="26" width="60" height="48" rx="26" fill="url(#imGold)"/>
  <!-- 面罩 -->
  <rect x="38" y="34" width="44" height="32" rx="18" fill="url(#imRed)"/>
  <!-- 眼睛(发光) -->
  <polygon id="im-eyeL" points="40,46 54,44 54,52 40,54" fill="#80D8FF"/>
  <polygon id="im-eyeR" points="80,46 66,44 66,52 80,54" fill="#80D8FF"/>
  <!-- 嘴部 -->
  <rect x="50" y="60" width="20" height="3" rx="1.5" fill="url(#imGold)"/>
  <!-- 额头指示灯 -->
  <circle cx="60" cy="28" r="3" fill="#80D8FF"/>
</svg>`,
    css: `
.state-idle #im-arc{animation:arcPulse 2s ease-in-out infinite}
@keyframes arcPulse{0%,100%{opacity:.8;r:10}50%{opacity:1;r:11}}
.state-idle #im-eyeL,.state-idle #im-eyeR{animation:eyeGlow 3s ease-in-out infinite}
@keyframes eyeGlow{0%,100%{opacity:.7}50%{opacity:1}}
.state-idle #im-repL{animation:repFireL 4s ease-in-out infinite}
.state-idle #im-repR{animation:repFireR 4s ease-in-out .5s infinite}
@keyframes repFireL{0%,95%,100%{fill:#FFF9C4;r:7}97%{fill:#FFD54F;r:9}}
@keyframes repFireR{0%,95%,100%{fill:#FFF9C4;r:7}97%{fill:#FFD54F;r:9}}
.state-thinking #im-arc{animation:arcFast .4s ease-in-out infinite}
@keyframes arcFast{0%,100%{fill:#80D8FF;r:10}50%{fill:#40C4FF;r:11.5}}
.state-tool_use #im-flameL,.state-tool_use #im-flameR{animation:flameBurst .3s ease-in-out infinite}
@keyframes flameBurst{0%,100%{ry:14;opacity:.6}50%{ry:22;opacity:1}}
.state-thinking #im-eyeL,.state-thinking #im-eyeR{fill:#40C4FF}
`,
  },

  /* ═══════════════════════════════════════════════
     💜 灭霸 — 紫色皮肤 + 金甲 + 无限手套
     ═══════════════════════════════════════════════ */
  thanos: {
    name: "灭霸", emoji: "👾",
    svg: `<svg viewBox="0 0 120 130">
  <defs>
    <radialGradient id="thanosSkin"><stop offset="0%" stop-color="#9B7EC5"/><stop offset="100%" stop-color="#5C3D8A"/></radialGradient>
    <linearGradient id="thanosGold"><stop offset="0%" stop-color="#FFD54F"/><stop offset="100%" stop-color="#B8860B"/></linearGradient>
  </defs>
  <!-- 身体 -->
  <rect x="32" y="84" width="56" height="34" rx="10" fill="#4A2870"/>
  <!-- 金色护甲 -->
  <rect x="28" y="88" width="64" height="8" rx="3" fill="url(#thanosGold)"/>
  <rect x="36" y="98" width="48" height="6" rx="3" fill="url(#thanosGold)" opacity=".6"/>
  <!-- 左手(无限手套) -->
  <rect x="16" y="86" width="20" height="24" rx="8" fill="#D4AF37"/>
  <circle id="t-gem1" cx="26" cy="92" r="3" fill="#FF1744"/>
  <circle id="t-gem2" cx="22" cy="100" r="3" fill="#2979FF"/>
  <circle id="t-gem3" cx="30" cy="100" r="3" fill="#00E676"/>
  <!-- 右手 -->
  <rect x="84" y="86" width="20" height="24" rx="8" fill="url(#thanosSkin)"/>
  <!-- 头盔 -->
  <path d="M22,52 Q20,18 60,12 Q100,18 98,52 L94,64 Q60,56 26,64 Z" fill="#4A2870"/>
  <!-- 脸 -->
  <ellipse cx="60" cy="58" rx="34" ry="30" fill="url(#thanosSkin)"/>
  <!-- 下巴沟纹 -->
  <path d="M38,70 Q48,82 60,84 Q72,82 82,70" fill="none" stroke="#4A2870" stroke-width="2.5" opacity=".5"/>
  <path d="M42,66 Q52,76 60,78 Q68,76 78,66" fill="none" stroke="#4A2870" stroke-width="2" opacity=".4"/>
  <!-- 眼睛(深邃) -->
  <ellipse id="t-eyeL" cx="44" cy="54" rx="8" ry="6" fill="white"/>
  <ellipse id="t-eyeR" cx="76" cy="54" rx="8" ry="6" fill="white"/>
  <circle id="t-pupL" cx="45" cy="54" r="4.5" fill="#1A0F30"/>
  <circle id="t-pupR" cx="77" cy="54" r="4.5" fill="#1A0F30"/>
  <circle cx="47" cy="52" r="1.8" fill="white"/>
  <circle cx="79" cy="52" r="1.8" fill="white"/>
  <!-- 嘴(自信微笑) -->
  <path id="t-mouth" d="M50,74 Q60,80 70,74" fill="none" stroke="#3D2060" stroke-width="2" stroke-linecap="round"/>
  <!-- 眉毛(霸气) -->
  <line id="t-browL" x1="36" y1="48" x2="52" y2="46" stroke="#3D2060" stroke-width="3" stroke-linecap="round"/>
  <line id="t-browR" x1="84" y1="48" x2="68" y2="46" stroke="#3D2060" stroke-width="3" stroke-linecap="round"/>
</svg>`,
    css: `
.state-idle #t-gem1{animation:gemGlow 1.5s ease-in-out infinite}
.state-idle #t-gem2{animation:gemGlow 1.5s ease-in-out .5s infinite}
.state-idle #t-gem3{animation:gemGlow 1.5s ease-in-out 1s infinite}
@keyframes gemGlow{0%,100%{opacity:.7}50%{opacity:1;filter:drop-shadow(0 0 4px currentColor)}}
.state-idle #t-browL,.state-idle #t-browR{animation:browRaise 4s ease-in-out infinite}
@keyframes browRaise{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
.state-thinking #t-pupL,.state-thinking #t-pupR{transform:translateY(-3px)}
.state-tool_use #t-mouth{display:none}
.state-tool_use #t-gem1,.state-tool_use #t-gem2,.state-tool_use #t-gem3{animation:gemFast .3s ease-in-out infinite}
@keyframes gemFast{0%,100%{opacity:.5}50%{opacity:1}}
`,
  },
};

CHARACTERS.default = CHARACTERS.mochi;
if (typeof module !== 'undefined' && module.exports) module.exports = CHARACTERS;
