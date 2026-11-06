// The hero cipher wheel: a working Caesar cipher.
(function () {
  const LOCKED = "FUDFN WKH FDVH"; // "CRACK THE CASE", shifted forward by 3
  const SOLVED_AT = 3, N = 26, STEP = 360 / N;
  const wheel = document.getElementById("wheel");
  const text = document.getElementById("cipher-text");
  const note = document.getElementById("cipher-note");
  const num = document.getElementById("wheel-num");
  const box = document.getElementById("cipher");
  const keyReal = document.getElementById("key-real");
  if (!wheel || !text) return;
  const NS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs, txt) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (txt != null) e.textContent = txt; return e; };
  const mod = n => ((n % N) + N) % N;
  const rad = d => (d - 90) * Math.PI / 180;

  // build the rings: metal outer ring = secret letters, blue inner ring = real letters
  const outer = wheel.querySelector(".w-outer"), inner = wheel.querySelector(".w-inner"), grip = wheel.querySelector(".w-grip"), rot = wheel.querySelector(".w-rot");
  for (let i = 0; i < N; i++) {
    const deg = i * STEP, ch = String.fromCharCode(65 + i);
    const put = (g, r, cls) => { const a = rad(deg), x = r * Math.cos(a), y = r * Math.sin(a); g.appendChild(el("text", { x, y: y + 5, "text-anchor": "middle", class: cls, transform: `rotate(${deg} ${x} ${y})` }, ch)); };
    put(outer, 129, "w-out"); put(inner, 86, "w-in");
    const b = rad(deg + STEP / 2);
    outer.appendChild(el("line", { x1: 111 * Math.cos(b), y1: 111 * Math.sin(b), x2: 146 * Math.cos(b), y2: 146 * Math.sin(b), stroke: "#6c7792", "stroke-width": 1 }));
    inner.appendChild(el("line", { x1: 66 * Math.cos(b), y1: 66 * Math.sin(b), x2: 105 * Math.cos(b), y2: 105 * Math.sin(b), stroke: "#33498a", "stroke-width": 1 }));
  }
  for (let i = 0; i < 30; i++) { const a = i * 12 * Math.PI / 180; grip.appendChild(el("line", { x1: 42 * Math.cos(a), y1: 42 * Math.sin(a), x2: 61 * Math.cos(a), y2: 61 * Math.sin(a), stroke: "#5d6884", "stroke-width": 1.5 })); }
  const h = STEP / 2 * Math.PI / 180, pt = (r, s) => `${(r * Math.sin(s * h)).toFixed(1)},${(-r * Math.cos(s * h)).toFixed(1)}`;
  wheel.querySelector(".w-win").setAttribute("d", `M${pt(148, -1)} A148,148 0 0 1 ${pt(148, 1)} L${pt(66, 1)} A66,66 0 0 0 ${pt(66, -1)} Z`);

  let n = 0, angle = 0;
  const turn = (deg, animate) => { rot.style.transition = animate ? "transform .35s cubic-bezier(.3,1.4,.5,1)" : "none"; rot.style.transform = `rotate(${deg}deg)`; };
  const decode = s => s.replace(/[A-Z]/g, c => String.fromCharCode(mod(c.charCodeAt(0) - 65 - n) + 65));
  function set(v, dragging) {
    n = mod(v);
    text.textContent = decode(LOCKED);
    num.textContent = n;
    if (keyReal) keyReal.textContent = String.fromCharCode(mod(-n) + 65);
    wheel.setAttribute("aria-valuenow", n);
    const solved = n === SOLVED_AT;
    box.classList.toggle("solved", solved);
    note.textContent = solved ? "Cracked it! That's a Caesar cipher, the first puzzle trick in the book."
      : n === 0 ? "Bit locked this message. Can you unlock it?" : "Keep turning…";
    if (!dragging) { // spin the short way round to the new letter
      let target = n * STEP;
      while (target - angle > 180) target -= 360;
      while (angle - target > 180) target += 360;
      angle = target; turn(angle, true);
    }
  }

  // drag to turn
  let drag = null;
  const pointerAngle = e => { const r = wheel.getBoundingClientRect(); return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI; };
  wheel.addEventListener("pointerdown", e => { wheel.setPointerCapture(e.pointerId); drag = pointerAngle(e); });
  wheel.addEventListener("pointermove", e => {
    if (drag === null) return;
    const a = pointerAngle(e); let d = a - drag; d = ((d + 540) % 360) - 180; drag = a;
    angle += d; turn(angle, false);
    const v = Math.round(angle / STEP);
    if (mod(v) !== n) set(v, true);
  });
  const end = () => { if (drag === null) return; drag = null; set(n); };
  wheel.addEventListener("pointerup", end); wheel.addEventListener("pointercancel", end);

  wheel.addEventListener("keydown", e => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") { set(n + 1); e.preventDefault(); }
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") { set(n - 1); e.preventDefault(); }
  });
  document.getElementById("dial-minus").addEventListener("click", () => set(n - 1));
  document.getElementById("dial-plus").addEventListener("click", () => set(n + 1));
  set(0);
})();
