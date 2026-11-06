// The hero code dial: a working Caesar cipher.
(function () {
  const LOCKED = "FUDFN WKH FDVH"; // "CRACK THE CASE", shifted forward by 3
  const SOLVED_AT = 3;              // turning the dial back 3 steps unlocks it
  const text = document.getElementById("cipher-text");
  const dial = document.getElementById("dial");
  const out = document.getElementById("dial-out");
  const note = document.getElementById("cipher-note");
  const box = document.getElementById("cipher");
  if (!text || !dial) return;

  function shiftBack(s, n) {
    return s.replace(/[A-Z]/g, c => String.fromCharCode((c.charCodeAt(0) - 65 - n + 26) % 26 + 65));
  }
  function render() {
    const n = Number(dial.value);
    out.value = n === 0 ? "0" : "−" + n;
    text.textContent = shiftBack(LOCKED, n);
    const solved = n === SOLVED_AT;
    box.classList.toggle("solved", solved);
    note.textContent = solved
      ? "Cracked it! That's a Caesar cipher, the first puzzle trick in the book."
      : n === 0 ? "Bit locked this message. Can you unlock it?" : "Keep turning…";
  }
  dial.addEventListener("input", render);
  document.getElementById("dial-minus").addEventListener("click", () => { dial.value = (Number(dial.value) + 25) % 26; render(); });
  document.getElementById("dial-plus").addEventListener("click", () => { dial.value = (Number(dial.value) + 1) % 26; render(); });
  render();
})();
