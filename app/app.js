// Little Turing Codebreakers app. Plain JS, no tracking, progress stays on this device.
(function () {
  "use strict";
  const C = window.LTC;
  const IMG = "../assets/img/", img = n => (window.LTC_IMGS && LTC_IMGS[n]) || IMG + n;
  const $ = (s, el = document) => el.querySelector(s);
  const N = 26, mod = n => ((n % N) + N) % N;
  const norm = s => String(s).toUpperCase().replace(/[^A-Z0-9]/g, "");
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const caesar = (s, n) => s.toUpperCase().replace(/[A-Z]/g, c => String.fromCharCode(mod(c.charCodeAt(0) - 65 + n) + 65));
  const bin = (v, w) => v.toString(2).padStart(w, "0");

  // ---------- dates and seeded randomness ----------
  const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
  const dayNum = key => Math.floor(Date.UTC(+key.slice(0, 4), +key.slice(5, 7) - 1, +key.slice(8, 10)) / 864e5);
  function rng(seedStr) {
    let h = 1779033703 ^ seedStr.length;
    for (let i = 0; i < seedStr.length; i++) { h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
    let a = h >>> 0;
    return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const pick = (r, a) => a[Math.floor(r() * a.length)];
  const int = (r, a, b) => a + Math.floor(r() * (b - a + 1));

  // ---------- saved progress (this device only) ----------
  const KEY = "ltc-app-v1";
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  let P = load(); P.days = P.days || {}; P.myst = P.myst || {}; P.quiz = P.quiz || {};
  function save() { try { localStorage.setItem(KEY, JSON.stringify(P)); } catch (e) { /* private mode: keep going */ } }
  function streak() {
    let n = 0, d = dayNum(today());
    const has = k => (P.days[k] || []).length > 0;
    const keyOf = dn => new Date(dn * 864e5).toISOString().slice(0, 10);
    if (!has(keyOf(d))) d -= 1; // today not played yet: count up to yesterday
    while (has(keyOf(d))) { n++; d--; }
    return n;
  }

  // ---------- pigpen symbols (same key as the book) ----------
  function pig(letter, size = 34, color = "currentColor") {
    const i0 = letter.toUpperCase().charCodeAt(0) - 65;
    if (i0 < 0 || i0 > 25) return `<span class="pig-gap" style="width:${size * 0.5}px"></span>`;
    const s = 40, p = 6; let body = "", idx = i0;
    if (idx < 18) {
      const dot = idx >= 9; if (dot) idx -= 9;
      const r = Math.floor(idx / 3), c = idx % 3, L = [];
      if (r > 0) L.push([p, p, s - p, p]);
      if (r < 2) L.push([p, s - p, s - p, s - p]);
      if (c > 0) L.push([p, p, p, s - p]);
      if (c < 2) L.push([s - p, p, s - p, s - p]);
      body = L.map(([a, b, c2, d]) => `<line x1="${a}" y1="${b}" x2="${c2}" y2="${d}"/>`).join("");
      if (dot) body += `<circle cx="20" cy="20" r="3.6" fill="${color}" stroke="none"/>`;
    } else {
      let j = idx - 18; const dot = j >= 4; if (dot) j -= 4;
      const pts = [`${p},${p} 20,${s - p} ${s - p},${p}`, `${p},${p} ${s - p},20 ${p},${s - p}`, `${s - p},${p} ${p},20 ${s - p},${s - p}`, `${p},${s - p} 20,${p} ${s - p},${s - p}`][j];
      body = `<polyline points="${pts}" fill="none"/>`;
      if (dot) { const [x, y] = [[20, 13], [12, 20], [28, 20], [20, 27]][j]; body += `<circle cx="${x}" cy="${y}" r="3.4" fill="${color}" stroke="none"/>`; }
    }
    return `<svg class="pig" width="${size}" height="${size}" viewBox="0 0 40 40" stroke="${color}" stroke-width="3.4" stroke-linecap="square" aria-hidden="true">${body}</svg>`;
  }
  const pigWord = (text, size) => `<span class="pig-row" role="img" aria-label="A message in pigpen">${[...text.toUpperCase()].map(ch => pig(ch, size)).join("")}</span>`;

  // ---------- daily puzzle generators ----------
  const G = {
    caesar(r, lv) {
      const text = lv === 1 ? pick(r, C.words.short.concat(C.words.medium)) : lv === 2 ? pick(r, C.words.medium.concat(C.words.phrases)) : pick(r, C.words.phrases);
      const s = lv === 1 ? int(r, 1, 3) : lv === 2 ? int(r, 3, 7) : int(r, 2, 24);
      const shown = lv < 3;
      return { type: "Caesar cipher", learn: "caesar", tool: "caesar", answer: text,
        prompt: `Bit locked a secret message. ${shown ? `Turn every letter <b>back ${s}</b> steps.` : "The shift is a mystery! Try every shift until you see real words."}`,
        code: caesar(text, s),
        hint: shown ? `Example: ${caesar("A", s)} → A. Use the cipher wheel in the Code Lab.` : `It's shift ${s}. Turn every letter back ${s} steps.`,
        why: `${caesar(text, s)} with shift ${s} back = ${text}` };
    },
    binLetters(r, lv) {
      const w = lv === 1 ? pick(r, C.words.short) : pick(r, C.words.medium);
      return { type: "Binary letter code", learn: "lettercode", tool: "binary", answer: w,
        prompt: "Each group is one letter. A = 1, B = 2, C = 3 … Turn the binary into letters.",
        code: [...w].map(c => bin(c.charCodeAt(0) - 64, 5)).join(" "),
        hint: `The places are worth 16, 8, 4, 2, 1. The first letter is ${w[0]}.`,
        why: [...w].map(c => `${bin(c.charCodeAt(0) - 64, 5)} = ${c.charCodeAt(0) - 64} = ${c}`).join(" · ") };
    },
    binNum(r, lv) {
      const w = lv === 1 ? 4 : lv === 2 ? 6 : 8, v = int(r, Math.pow(2, w - 1) / 2 + 1, Math.pow(2, w) - 1);
      const parts = [...bin(v, w)].map((b, i) => b === "1" ? Math.pow(2, w - 1 - i) : 0).filter(Boolean);
      return { type: "Binary number", learn: "bits", tool: "binary", answer: String(v),
        prompt: "What is this binary number in normal numbers?", code: bin(v, w),
        hint: `The places are worth ${Array.from({ length: w }, (_, i) => Math.pow(2, w - 1 - i)).join(", ")}.`,
        why: `${parts.join(" + ")} = ${v}` };
    },
    seq(r, lv) {
      let t, rule;
      if (lv === 1) { const a = int(r, 1, 9), d = int(r, 2, 6); t = [0, 1, 2, 3, 4].map(i => a + d * i); rule = `add ${d} each time`; }
      else if (lv === 2) { if (r() < 0.5) { const a = int(r, 1, 5); t = [0, 1, 2, 3, 4].map(i => a * Math.pow(2, i)); rule = "double each time"; } else { const a = int(r, 40, 90), d = int(r, 3, 9); t = [0, 1, 2, 3, 4].map(i => a - d * i); rule = `take away ${d} each time`; } }
      else {
        const k = int(r, 0, 2);
        if (k === 0) { let a = int(r, 1, 4), b = int(r, a, a + 3); t = [a, b]; while (t.length < 6) t.push(t[t.length - 1] + t[t.length - 2]); rule = "add the two numbers before"; }
        else if (k === 1) { const o = int(r, 1, 3); t = [0, 1, 2, 3, 4].map(i => (i + o) * (i + o)); rule = "square numbers: 1×1, 2×2, 3×3 …"; }
        else { const a = int(r, 1, 10); t = [a]; for (let i = 1; i < 6; i++) t.push(t[i - 1] + i); rule = "add 1, then 2, then 3 …"; }
      }
      const ans = t.pop();
      return { type: "Number pattern", learn: "patterns", answer: String(ans),
        prompt: "What number comes next?", code: t.join(", ") + ", ?",
        hint: lv === 1 ? "How much does it go up each time?" : "Look at how each number changes. Does it add, take away, double, or something else?",
        why: `The rule is: ${rule}. Next is ${ans}.` };
    },
    gates(r, lv) {
      const b = () => int(r, 0, 1); const A = b(), B = b(), Cc = b();
      const op = (x, o, y) => o === "AND" ? (x & y) : (x | y);
      let q, a;
      if (lv === 1) { if (r() < 0.25) { q = `NOT ${A}`; a = 1 - A; } else { const o = pick(r, ["AND", "OR"]); q = `${A} ${o} ${B}`; a = op(A, o, B); } }
      else if (lv === 2) { const o1 = pick(r, ["AND", "OR"]), o2 = pick(r, ["AND", "OR"]); q = `(${A} ${o1} ${B}) ${o2} ${Cc}`; a = op(op(A, o1, B), o2, Cc); }
      else { const o1 = pick(r, ["AND", "OR"]), o2 = pick(r, ["AND", "OR"]); q = `NOT (${A} ${o1} ${B}) ${o2} ${Cc}`; a = op(1 - op(A, o1, B), o2, Cc); }
      return { type: "Logic gates", learn: "gates", answer: String(a),
        prompt: "Work it out. The answer is 1 or 0.", code: q,
        hint: "AND needs both to be 1. OR needs at least one 1. NOT flips it. Do the brackets first.",
        why: `${q} = ${a}` };
    },
    hex(r, lv) {
      const v = lv === 2 ? int(r, 10, 15) : int(r, 17, 255), h = v.toString(16).toUpperCase();
      return { type: "Hexadecimal", learn: "hex", answer: String(v),
        prompt: "What is this hex number in normal numbers?", code: h,
        hint: lv === 2 ? "A = 10, B = 11, C = 12, D = 13, E = 14, F = 15." : "The left digit is worth 16 each. A = 10 … F = 15.",
        why: lv === 2 ? `${h} = ${v}` : `${h[0]} × 16 + ${parseInt(h[1], 16)} = ${parseInt(h[0], 16) * 16} + ${parseInt(h[1], 16)} = ${v}` };
    },
    pigpen(r, lv) {
      const w = lv === 1 ? pick(r, C.words.short) : pick(r, C.words.medium);
      return { type: "Pigpen cipher", learn: "pigpen", tool: "pigpen", answer: w, pig: true,
        prompt: "Read this pigpen message. Use the key in the Code Lab.", code: w,
        hint: `The first letter is ${w[0]}.`, why: `The word is ${w}.` };
    },
  };
  const SLOTS = [
    { name: "Warm-up", lv: 1, kinds: ["binNum", "caesar", "seq", "gates", "binLetters", "pigpen"] },
    { name: "Brain teaser", lv: 2, kinds: ["caesar", "binLetters", "pigpen", "seq", "hex", "gates", "binNum"] },
    { name: "Brain burner", lv: 3, kinds: ["caesar", "binNum", "seq", "hex", "binLetters", "gates"] },
  ];
  function daily(key) {
    const r = rng("ltc-" + key);
    const used = new Set();
    return SLOTS.map((s, i) => {
      let k; do { k = pick(r, s.kinds); } while (used.has(k) && used.size < 5);
      used.add(k);
      return Object.assign(G[k](rng(`ltc-${key}-${i}-${k}`), s.lv), { slot: s.name, lv: s.lv, i });
    });
  }
  LTC._daily = daily; // used by the self-test
  const allJokes = () => C.jokes.concat(C.moreJokes);

  // ---------- reusable bits of UI ----------
  const answerBox = (id, solved, answer) => solved
    ? `<p class="done">✓ Solved! The answer is <b>${esc(answer)}</b>.</p>`
    : `<form class="ans" data-id="${id}"><label class="sr" for="in-${id}">Your answer</label>
        <input id="in-${id}" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="Your answer">
        <button class="btn" type="submit">Check</button></form>
       <p class="msg" aria-live="polite"></p>`;

  function puzzleCard(p, key) {
    const id = `d-${key}-${p.i}`, solved = (P.days[key] || []).includes(p.i);
    return `<article class="card puzzle ${solved ? "is-solved" : ""}" id="${id}">
      <div class="card-top"><span class="lvl lvl-${p.lv}">${p.slot}</span><span class="ptype">${p.type}</span></div>
      <p>${p.prompt}</p>
      <div class="code-box">${p.pig ? pigWord(p.code, 36) : esc(p.code)}</div>
      ${answerBox(id, solved, p.answer)}
      <div class="row-links">
        <button class="link hint-btn" type="button">Need a hint?</button>
        ${p.tool ? `<a class="link" href="#/lab/${p.tool}">Open the ${p.tool === "binary" ? "binary switches" : p.tool === "caesar" ? "cipher wheel" : "pigpen key"}</a>` : ""}
        <a class="link" href="#/learn/${p.learn}">Learn this</a>
      </div>
      <p class="hint" hidden>${p.hint}</p>
      <p class="why" ${solved ? "" : "hidden"}>${p.why}</p>
    </article>`;
  }

  // ---------- the metal cipher wheel ----------
  function wheelSVG() {
    return `<svg class="wheel" viewBox="-152 -164 304 316" role="slider" tabindex="0" aria-label="Cipher wheel" aria-valuemin="0" aria-valuemax="25" aria-valuenow="0">
      <defs>
        <radialGradient id="w-metal" cx="35%" cy="28%" r="85%"><stop offset="0" stop-color="#f4f7fc"/><stop offset=".45" stop-color="#aab5cc"/><stop offset="1" stop-color="#4a5570"/></radialGradient>
        <radialGradient id="w-face" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="#26407c"/><stop offset="1" stop-color="#0a1430"/></radialGradient>
        <radialGradient id="w-knob" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#f6f8fd"/><stop offset=".5" stop-color="#a9b4cc"/><stop offset="1" stop-color="#4b556e"/></radialGradient>
      </defs>
      <polygon class="w-ptr" points="0,-149 -10,-163 10,-163"/>
      <circle r="148" fill="url(#w-metal)"/><circle r="148" fill="none" stroke="#2b3550" stroke-width="2"/>
      <g class="w-outer"></g><circle r="109" fill="#0b1531"/>
      <g class="w-rot"><circle r="106" fill="url(#w-face)"/><g class="w-inner"></g>
        <circle r="64" fill="url(#w-knob)" stroke="#2b3550" stroke-width="2"/><g class="w-grip"></g></g>
      <circle r="38" fill="#0d1a3a" stroke="#2b3550" stroke-width="2"/>
      <text class="w-cap" y="-8" text-anchor="middle">SHIFT</text><text class="w-num" y="20" text-anchor="middle">0</text>
      <path class="w-win"/></svg>`;
  }
  function mountWheel(svg, onChange) {
    const NS = "http://www.w3.org/2000/svg", STEP = 360 / N;
    const el = (t, a, x) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); if (x != null) e.textContent = x; return e; };
    const rad = d => (d - 90) * Math.PI / 180;
    const outer = $(".w-outer", svg), inner = $(".w-inner", svg), grip = $(".w-grip", svg), rot = $(".w-rot", svg), num = $(".w-num", svg);
    for (let i = 0; i < N; i++) {
      const deg = i * STEP, ch = String.fromCharCode(65 + i);
      const put = (g, r, cls) => { const a = rad(deg), x = r * Math.cos(a), y = r * Math.sin(a); g.appendChild(el("text", { x, y: y + 5, "text-anchor": "middle", class: cls, transform: `rotate(${deg} ${x} ${y})` }, ch)); };
      put(outer, 129, "w-out"); put(inner, 86, "w-in");
      const b = rad(deg + STEP / 2);
      outer.appendChild(el("line", { x1: 111 * Math.cos(b), y1: 111 * Math.sin(b), x2: 146 * Math.cos(b), y2: 146 * Math.sin(b), stroke: "#6c7792" }));
      inner.appendChild(el("line", { x1: 66 * Math.cos(b), y1: 66 * Math.sin(b), x2: 105 * Math.cos(b), y2: 105 * Math.sin(b), stroke: "#33498a" }));
    }
    for (let i = 0; i < 30; i++) { const a = i * 12 * Math.PI / 180; grip.appendChild(el("line", { x1: 42 * Math.cos(a), y1: 42 * Math.sin(a), x2: 61 * Math.cos(a), y2: 61 * Math.sin(a), stroke: "#5d6884", "stroke-width": 1.5 })); }
    const hh = STEP / 2 * Math.PI / 180, pt = (r, s) => `${(r * Math.sin(s * hh)).toFixed(1)},${(-r * Math.cos(s * hh)).toFixed(1)}`;
    $(".w-win", svg).setAttribute("d", `M${pt(148, -1)} A148,148 0 0 1 ${pt(148, 1)} L${pt(66, 1)} A66,66 0 0 0 ${pt(66, -1)} Z`);
    let n = 0, angle = 0, drag = null;
    const turn = (d, anim) => { rot.style.transition = anim ? "transform .35s cubic-bezier(.3,1.4,.5,1)" : "none"; rot.style.transform = `rotate(${d}deg)`; };
    function set(v, dragging) {
      n = mod(v); num.textContent = n; svg.setAttribute("aria-valuenow", n);
      if (!dragging) { let t = n * STEP; while (t - angle > 180) t -= 360; while (angle - t > 180) t += 360; angle = t; turn(angle, true); }
      onChange(n);
    }
    const pa = e => { const r = svg.getBoundingClientRect(); return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI; };
    svg.addEventListener("pointerdown", e => { svg.setPointerCapture(e.pointerId); drag = pa(e); });
    svg.addEventListener("pointermove", e => { if (drag === null) return; const a = pa(e); let d = a - drag; d = ((d + 540) % 360) - 180; drag = a; angle += d; turn(angle, false); const v = Math.round(angle / STEP); if (mod(v) !== n) set(v, true); });
    const end = () => { if (drag === null) return; drag = null; set(n); };
    svg.addEventListener("pointerup", end); svg.addEventListener("pointercancel", end);
    svg.addEventListener("keydown", e => { if (e.key === "ArrowRight" || e.key === "ArrowUp") { set(n + 1); e.preventDefault(); } if (e.key === "ArrowLeft" || e.key === "ArrowDown") { set(n - 1); e.preventDefault(); } });
    return { set, get: () => n };
  }

  // ---------- views ----------
  const V = {};

  V.today = () => {
    const key = today(), ps = daily(key), done = (P.days[key] || []).length, st = streak();
    const dn = dayNum(key), jokes = allJokes(), joke = jokes[mod2(dn * 7, jokes.length)], fact = C.facts[mod2(dn * 11, C.facts.length)];
    const date = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
    return `<section class="hello">
        <img src="${img("bit.webp")}" width="96" height="96" alt="">
        <div><p class="date">${date}</p><h1>Hi, Codebreaker!</h1>
        <p class="stats"><span class="pill">${done} of 3 solved today</span>${st ? `<span class="pill pill-hot">${st}-day streak</span>` : ""}</p></div>
      </section>
      <h2 class="sec">Today's puzzles</h2>
      ${ps.map(p => puzzleCard(p, key)).join("")}
      <h2 class="sec">Bit's joke of the day</h2>
      <article class="card joke"><p class="q">${joke[0]}</p><button class="btn btn-ghost reveal" type="button">Show the answer</button><p class="a" hidden>${joke[1]}</p></article>
      <h2 class="sec">Did you know?</h2>
      <article class="card fact"><p>${fact}</p></article>
      ${promo()}
      <p class="small center">New puzzles every day at midnight.</p>`;
  };
  const mod2 = (a, m) => ((a % m) + m) % m;

  const promo = () => `<a class="card promo" href="#/books">
      <img src="${img("cover.webp")}" width="90" height="135" alt="">
      <div><span class="tagline">The book</span><h3>The Little Turing Codebreakers &amp; The Glitching Robot</h3><p>Three mysteries and 24 code-cracking puzzles. Now on Amazon!</p></div></a>`;

  V.lab = (sub) => {
    sub = sub || "caesar";
    const tabs = [["caesar", "Cipher wheel"], ["binary", "Binary"], ["pigpen", "Pigpen"]];
    const head = `<h1 class="page">Code Lab</h1><p class="lead">Make your own secret messages. Then challenge a friend to crack them!</p>
      <nav class="chips" aria-label="Code tools">${tabs.map(([k, t]) => `<a href="#/lab/${k}" class="chip ${k === sub ? "on" : ""}">${t}</a>`).join("")}</nav>`;
    if (sub === "binary") {
      const bulbs = [128, 64, 32, 16, 8, 4, 2, 1].map(v => `<button class="bulb" type="button" data-v="${v}" aria-pressed="false"><span class="pv">${v}</span><span class="bv">0</span></button>`).join("");
      return head + `<article class="card"><h2>Binary switches</h2><p>Tap a switch to turn it on. Add up the numbers above the switches that are on.</p>
        <div class="bulbs">${bulbs}</div>
        <p class="bin-out"><span id="bin-str">00000000</span> = <b id="bin-val">0</b><span id="bin-let"></span></p></article>
        <article class="card"><h2>Word to binary</h2><p>Type a word. Each letter becomes its number (A = 1 … Z = 26) in binary.</p>
        <input id="w2b" class="txt" maxlength="20" placeholder="Type a word" autocapitalize="characters" spellcheck="false">
        <div class="code-box out" id="w2b-out">…</div><button class="btn btn-ghost copy" data-from="w2b-out" type="button">Copy the code</button></article>
        <article class="card"><h2>Binary to word</h2><p>Type groups of 0s and 1s, with spaces between letters.</p>
        <input id="b2w" class="txt" placeholder="00010 01001 10100" inputmode="numeric" spellcheck="false">
        <div class="code-box out" id="b2w-out">…</div></article>`;
    }
    if (sub === "pigpen") {
      const key = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"].map(l => `<div class="kcell">${pig(l, 30)}<span>${l}</span></div>`).join("");
      return head + `<article class="card"><h2>Pigpen writer</h2><p>Type a message and see it in pigpen. Copy it onto paper for a friend!</p>
        <input id="pp" class="txt" maxlength="40" placeholder="Type a message" autocapitalize="characters" spellcheck="false" value="SECRET">
        <div class="code-box pig-out" id="pp-out"></div></article>
        <article class="card"><h2>The pigpen key</h2><p>A to I and J to R sit in grids. S to Z sit in X shapes. The second grid and the second X have dots.</p>
        <div class="key">${key}</div></article>`;
    }
    return head + `<article class="card wheel-card"><h2>Cipher wheel</h2>
        <p>Turn the inner wheel to choose a shift. Then type a message.</p>
        <div class="wheel-wrap">${wheelSVG()}<div class="wheel-ctl">
          <div class="seg" role="group" aria-label="Mode"><button type="button" class="on" data-mode="lock">Lock</button><button type="button" data-mode="unlock">Unlock</button></div>
          <div class="turn"><button class="rb" type="button" data-d="-1" aria-label="Turn back one step">↺</button><button class="rb" type="button" data-d="1" aria-label="Turn forward one step">↻</button></div>
          <p class="small" id="wheel-key">Shift 0: A stays A.</p></div></div>
        <label class="lbl" for="cz-in" id="cz-lbl">Your message</label>
        <textarea id="cz-in" class="txt" rows="2" maxlength="140" spellcheck="false" placeholder="Type a message">MEET ME AT THE TREEHOUSE</textarea>
        <p class="lbl" id="cz-out-lbl">Secret code</p>
        <div class="code-box out" id="cz-out"></div>
        <button class="btn btn-ghost copy" data-from="cz-out" type="button">Copy</button></article>`;
  };

  V.learn = (id) => {
    if (id) {
      const i = C.concepts.findIndex(c => c.id === id); if (i < 0) return V.learn();
      const c = C.concepts[i], next = C.concepts[i + 1], qid = "q-" + c.id, ok = P.quiz[c.id];
      return `<a class="back" href="#/learn">← All topics</a>
        <span class="tagline">${c.tag}</span><h1 class="page">${c.title}</h1><p class="lead">${c.intro}</p>
        <article class="card prose">${c.body.map(b => `<p>${b}</p>`).join("")}<div class="example"><span>Example</span>${c.example}</div></article>
        <article class="card quiz ${ok ? "is-solved" : ""}" id="${qid}"><h2>Quick check</h2><p>${c.quiz.q}</p>${answerBox(qid, ok, c.quiz.a)}<p class="why" ${ok ? "" : "hidden"}>${c.quiz.why}</p></article>
        ${c.tool ? `<a class="btn wide" href="#/lab/${c.tool}">Try it in the Code Lab</a>` : ""}
        ${next ? `<a class="next-link" href="#/learn/${next.id}">Next: ${next.title} →</a>` : ""}`;
    }
    const n = Object.keys(P.quiz).length;
    return `<h1 class="page">Learn</h1><p class="lead">The big ideas behind codes and computers, explained simply. ${n ? `You've checked ${n} of ${C.concepts.length}.` : ""}</p>
      <div class="grid">${C.concepts.map(c => `<a class="card topic ${P.quiz[c.id] ? "is-solved" : ""}" href="#/learn/${c.id}"><span class="tagline">${c.tag}</span><h3>${c.title}</h3><p>${c.intro}</p></a>`).join("")}</div>`;
  };

  V.mysteries = () => `<h1 class="page">Mini mysteries</h1><p class="lead">Short cases to crack in one sitting. Solve the clues, cross out the suspects, catch the culprit!</p>
    ${C.mysteries.map(m => { const s = P.myst[m.id] || {}; return `<a class="card myst" href="#/mystery/${m.id}"><img src="${img(m.img + ".webp")}" alt="" width="1100" height="467" loading="lazy">
      <div class="myst-body"><span class="tagline">${m.level}</span><h3>${m.title}</h3><p>${s.done ? "✓ Case closed!" : s.clues ? `${s.clues} of ${m.clues.length} clues cracked` : "New case"}</p></div></a>`; }).join("")}
    <article class="card soon"><img src="${img("bit-drawer.webp")}" alt="" width="120" height="120" loading="lazy"><div><h3>More cases coming soon</h3><p>Bit is busy writing the next mystery. Check back soon!</p></div></article>`;

  V.mystery = (id) => {
    const m = C.mysteries.find(x => x.id === id); if (!m) return V.mysteries();
    const s = P.myst[m.id] || { clues: 0 }; const solvedN = s.clues || 0;
    const out = new Set(m.clues.slice(0, solvedN).map(c => c.rules_out));
    const sus = m.suspects.map(x => `<li class="sus ${out.has(x.id) ? "out" : ""} ${s.done && x.id === m.culprit ? "caught" : ""}"><b>${x.name}</b><span>${x.role}</span><small>${x.note}</small></li>`).join("");
    const clues = m.clues.map((c, i) => {
      if (i > solvedN) return `<article class="card clue locked"><h3>${c.title}</h3><p>Crack the clue before this one to unlock it.</p></article>`;
      const done = i < solvedN, cid = `m-${m.id}-${i}`;
      return `<article class="card clue ${done ? "is-solved" : ""}" id="${cid}"><h3>${c.title}</h3><p>${c.story}</p>
        <div class="code-box">${c.kind === "pigpen" ? pigWord(c.code, 34) : esc(c.code)}</div>
        ${answerBox(cid, done, c.answer)}
        <div class="row-links"><button class="link hint-btn" type="button">Need a hint?</button><a class="link" href="#/lab/${c.kind}">Open the Code Lab</a></div>
        <p class="hint" hidden>${c.hint}</p><p class="why reveal-txt" ${done ? "" : "hidden"}>${c.reveal}</p></article>`;
    }).join("");
    const final = solvedN >= m.clues.length ? (s.done
      ? `<article class="card closed"><h2>Case closed!</h2><p>${m.solved}</p><a class="btn" href="#/mysteries">Back to the cases</a></article>`
      : `<article class="card accuse"><h2>Who took it?</h2><p>Only one suspect is left. Name the culprit!</p>
         <div class="accuse-btns">${m.suspects.map(x => `<button class="btn ${out.has(x.id) ? "btn-ghost" : ""}" type="button" data-sus="${x.id}">${x.name}</button>`).join("")}</div><p class="msg" aria-live="polite"></p></article>`) : "";
    return `<a class="back" href="#/mysteries">← All cases</a><span class="tagline">${m.level}</span><h1 class="page">${m.title}</h1>
      <article class="card prose">${m.intro.map(p => `<p>${p}</p>`).join("")}</article>
      <h2 class="sec">Suspects</h2><ul class="suspects">${sus}</ul>
      <h2 class="sec">Clues</h2>${clues}${final}`;
  };

  V.books = () => {
    const b = C.books.book1;
    return `<h1 class="page">Our books</h1>
      <article class="card book"><img src="${img("cover.webp")}" width="900" height="1350" alt="Cover of The Little Turing Codebreakers and The Glitching Robot">
        <div><span class="tagline">${b.meta}</span><h2>${b.title}</h2><p>${b.blurb}</p>
        <a class="btn" href="https://www.amazon.com/dp/B0HQVKLBCB" target="_blank" rel="noopener">Buy on Amazon</a>
        <a class="btn btn-ghost" href="https://www.amazon.de/dp/B0HQVKLBCB" target="_blank" rel="noopener">Amazon.de</a>
        <a class="btn" href="https://littleturingpress.com/#free" target="_blank" rel="noopener">Free puzzle pack (PDF)</a>
        <a class="link" href="https://littleturingpress.com" target="_blank" rel="noopener">Visit the book's website</a></div></article>
      <article class="card soon"><img src="${img("bit.webp")}" alt="" width="120" height="120" loading="lazy"><div><h3>Book 2 is in the works</h3><p>Leo, Poppy and Bit have a new case. Want to know when it's out? Ask a grown-up to visit littleturingpress.com.</p></div></article>
      <article class="card prose"><h2>For parents and teachers</h2>
        <p>This app is made by <b>Chinar Kakutsey</b>, a software engineer and dad, and the author of the Little Turing Codebreakers books.</p>
        <p><b>No ads. No tracking. No sign-up.</b> Progress is saved only on this device. The app does not collect any personal data.</p>
        <p><b>Follow us (for grown-ups):</b> <a href="https://www.youtube.com/@littleturingpress" target="_blank" rel="noopener">YouTube</a> · <a href="https://www.instagram.com/littleturingpress/" target="_blank" rel="noopener">Instagram</a> · <a href="https://www.tiktok.com/@littleturingpress" target="_blank" rel="noopener">TikTok</a> · <a href="https://www.facebook.com/profile.php?id=61596338522125" target="_blank" rel="noopener">Facebook</a> · <a href="https://www.pinterest.com/littleturingpress/" target="_blank" rel="noopener">Pinterest</a></p>
        <p class="small"><a href="https://littleturingpress.com/impressum.html" target="_blank" rel="noopener">Impressum</a> · <a href="https://littleturingpress.com/datenschutz.html" target="_blank" rel="noopener">Datenschutz / Privacy</a></p></article>`;
  };

  // ---------- after each render: wire up the interactive parts ----------
  function wire(route) {
    const view = $("#view");
    if (route[0] === "lab" && (route[1] || "caesar") === "caesar") {
      const inp = $("#cz-in"), out = $("#cz-out"), key = $("#wheel-key"); let mode = "lock";
      const w = mountWheel($(".wheel", view), n => {
        out.textContent = caesar(inp.value, mode === "lock" ? n : -n) || "…";
        key.innerHTML = n === 0 ? "Shift 0: A stays A." : mode === "lock" ? `Lock with shift ${n}: A becomes <b>${caesar("A", n)}</b>.` : `Unlock with shift ${n}: <b>${caesar("A", n)}</b> becomes A.`;
      });
      inp.addEventListener("input", () => w.set(w.get()));
      view.querySelectorAll(".rb").forEach(bt => bt.addEventListener("click", () => w.set(w.get() + Number(bt.dataset.d))));
      view.querySelectorAll(".seg button").forEach(bt => bt.addEventListener("click", () => {
        mode = bt.dataset.mode; view.querySelectorAll(".seg button").forEach(x => x.classList.toggle("on", x === bt));
        $("#cz-lbl").textContent = mode === "lock" ? "Your message" : "Secret code to unlock";
        $("#cz-out-lbl").textContent = mode === "lock" ? "Secret code" : "Real message";
        inp.value = mode === "lock" ? caesar(out.textContent, -w.get()) : out.textContent;
        w.set(w.get());
      }));
      w.set(3);
    }
    if (route[0] === "lab" && route[1] === "binary") {
      const upd = () => {
        let v = 0; view.querySelectorAll(".bulb").forEach(b => { if (b.getAttribute("aria-pressed") === "true") v += +b.dataset.v; });
        $("#bin-str").textContent = bin(v, 8); $("#bin-val").textContent = v;
        $("#bin-let").innerHTML = v >= 1 && v <= 26 ? ` = letter <b>${String.fromCharCode(64 + v)}</b>` : "";
      };
      view.querySelectorAll(".bulb").forEach(b => b.addEventListener("click", () => { const on = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", on); $(".bv", b).textContent = on ? 1 : 0; upd(); }));
      const w2b = () => { const s = $("#w2b").value.toUpperCase().replace(/[^A-Z]/g, ""); $("#w2b-out").textContent = s ? [...s].map(c => bin(c.charCodeAt(0) - 64, 5)).join(" ") : "…"; };
      $("#w2b").addEventListener("input", w2b);
      $("#b2w").addEventListener("input", e => {
        const g = e.target.value.trim().split(/\s+/).filter(Boolean);
        $("#b2w-out").textContent = g.length ? g.map(x => { if (!/^[01]+$/.test(x)) return "?"; const v = parseInt(x, 2); return v >= 1 && v <= 26 ? String.fromCharCode(64 + v) : "?"; }).join("") : "…";
      });
    }
    if (route[0] === "lab" && route[1] === "pigpen") {
      const r = () => { $("#pp-out").innerHTML = pigWord($("#pp").value || " ", 38); };
      $("#pp").addEventListener("input", r); r();
    }
  }

  // shared clicks: hints, joke, copy, answer checks, accuse
  document.addEventListener("click", e => {
    const t = e.target;
    if (t.closest(".hint-btn")) { const c = t.closest(".card"); const h = $(".hint", c); h.hidden = !h.hidden; }
    if (t.closest(".reveal")) { const c = t.closest(".card"); $(".a", c).hidden = false; t.closest(".reveal").hidden = true; }
    if (t.closest(".copy")) {
      const b = t.closest(".copy"), txt = $("#" + b.dataset.from).textContent;
      const done = () => { const o = b.textContent; b.textContent = "Copied!"; setTimeout(() => b.textContent = o, 1400); };
      try { navigator.clipboard.writeText(txt).then(done, () => {}); } catch (err) { /* no clipboard */ }
    }
    const sb = t.closest("[data-sus]");
    if (sb) {
      const m = C.mysteries.find(x => x.id === route()[1]); const msg = $(".accuse .msg");
      if (sb.dataset.sus === m.culprit) { P.myst[m.id] = Object.assign(P.myst[m.id] || {}, { done: true }); save(); render(); confetti(); }
      else msg.textContent = "Not quite. Look at the suspects you crossed out. Who is left?";
    }
  });
  document.addEventListener("submit", e => {
    const f = e.target.closest(".ans"); if (!f) return; e.preventDefault();
    const id = f.dataset.id, val = norm($("input", f).value), card = f.closest(".card"), msg = $(".msg", card);
    if (!val) return;
    const r = route(); let ok = false, onOk;
    if (id.startsWith("d-")) {
      const key = id.slice(2, 12), i = +id.slice(13), p = daily(key)[i];
      ok = norm(p.answer) === val;
      onOk = () => { const a = P.days[key] = P.days[key] || []; if (!a.includes(i)) a.push(i); };
    } else if (id.startsWith("q-")) {
      const c = C.concepts.find(x => "q-" + x.id === id); ok = norm(c.quiz.a) === val || (norm(c.quiz.a) === "YES" && val === "Y") || (norm(c.quiz.a) === "NO" && val === "N");
      onOk = () => { P.quiz[c.id] = 1; };
    } else if (id.startsWith("m-")) {
      const [, mid, ci] = id.split("-"); const m = C.mysteries.find(x => x.id === mid), c = m.clues[+ci];
      ok = norm(c.answer) === val;
      onOk = () => { const s = P.myst[mid] = P.myst[mid] || { clues: 0 }; s.clues = Math.max(s.clues || 0, +ci + 1); };
    }
    if (ok) { onOk(); save(); const y = window.scrollY; render(); window.scrollTo(0, y); const c2 = document.getElementById(id); if (c2) c2.classList.add("pop"); }
    else { msg.textContent = pick(Math.random, ["Not quite. Try again!", "Almost? Check your working and try again.", "Bit says: have another go!"]); card.classList.remove("shake"); void card.offsetWidth; card.classList.add("shake"); }
  });

  function confetti() {
    const box = document.createElement("div"); box.className = "confetti"; document.body.appendChild(box);
    for (let i = 0; i < 40; i++) { const s = document.createElement("i"); s.style.left = Math.random() * 100 + "%"; s.style.background = pick(Math.random, ["#ffd23f", "#4cc9f0", "#ff8c42", "#ffffff"]); s.style.animationDelay = Math.random() * 0.4 + "s"; box.appendChild(s); }
    setTimeout(() => box.remove(), 2200);
  }

  // ---------- router ----------
  const route = () => (location.hash.replace(/^#\/?/, "") || "today").split("/");
  function render() {
    const r = route(), view = $("#view");
    const page = { today: V.today, lab: V.lab, learn: V.learn, mysteries: V.mysteries, mystery: V.mystery, books: V.books }[r[0]] || V.today;
    view.innerHTML = page(r[1]);
    const tab = r[0] === "mystery" ? "mysteries" : (page === V.today ? "today" : r[0]);
    document.querySelectorAll(".tabbar a").forEach(a => a.classList.toggle("on", a.dataset.tab === tab));
    wire(r);
  }
  window.addEventListener("hashchange", () => { render(); window.scrollTo(0, 0); });
  render();

  if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js").catch(() => {});
})();
