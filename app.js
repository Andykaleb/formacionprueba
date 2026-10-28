(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var KEY = "expocredit_bdo_v1";
  var state = { done: [], quizBest: 0, theme: "dark", cur: 0, checks: [] };

  function load() { try { var s = JSON.parse(localStorage.getItem(KEY)); if (s) Object.assign(state, s); } catch (e) {} }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* ---------- Módulos / navegación ---------- */
  var mods = $$("main .module");
  var total = mods.length;

  function buildNav() {
    var nav = $("#sidebar");
    nav.innerHTML = '<div class="nav-title">Módulos</div>';
    mods.forEach(function (m, i) {
      var b = document.createElement("button");
      b.className = "nav-item"; b.dataset.i = i;
      b.innerHTML = '<span class="n">' + (i === 0 ? "★" : i) + "</span><span>" + esc(m.dataset.icon + " " + m.dataset.title) + "</span>";
      b.onclick = function () { go(i); $("#sidebar").classList.remove("open"); };
      nav.appendChild(b);
    });
  }

  function go(i) {
    i = Math.max(0, Math.min(total - 1, i));
    state.cur = i; save();
    mods.forEach(function (m, k) { m.classList.toggle("active", k === i); });
    refreshUI();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  window.go = go;

  function refreshUI() {
    $$(".nav-item").forEach(function (b) {
      var i = +b.dataset.i;
      b.classList.toggle("active", i === state.cur);
      b.classList.toggle("done", state.done.indexOf(i) > -1);
    });
    $$(".stop").forEach(function (s) { s.classList.toggle("done", state.done.indexOf(+s.dataset.i) > -1); });
    var pct = Math.round(state.done.length / total * 100);
    $("#progFill").style.width = pct + "%";
    $("#progText").textContent = pct + "% completado";
    $("#prevBtn").disabled = state.cur === 0;
    $("#nextBtn").disabled = state.cur === total - 1;
    var d = state.done.indexOf(state.cur) > -1;
    $("#doneBtn").textContent = d ? "✓ Módulo visto" : "Marcar módulo como visto ✓";
  }

  function markDone(i) { if (state.done.indexOf(i) < 0) { state.done.push(i); save(); refreshUI(); } }

  /* ---------- Genéricos ---------- */
  function initTabs() {
    $$(".tabs[data-tabs]").forEach(function (box) {
      var key = box.dataset.tabs;
      $$(".tab", box).forEach(function (btn) {
        btn.onclick = function () {
          $$(".tab", box).forEach(function (b) { b.classList.toggle("active", b === btn); });
          $$('[data-p^="' + key + '-"]').forEach(function (p) { p.classList.toggle("active", p.dataset.p === key + "-" + btn.dataset.t); });
        };
      });
    });
  }

  function acc(title, body, open) {
    var d = document.createElement("details"); d.className = "acc"; if (open) d.open = true;
    d.innerHTML = "<summary>" + title + '</summary><div class="body">' + body + "</div>";
    return d;
  }

  /* ---------- Inicio: viaje ---------- */
  function buildJourney() {
    var j = $("#journey");
    mods.forEach(function (m, i) {
      if (i === 0) return;
      var b = document.createElement("button"); b.className = "stop"; b.dataset.i = i;
      b.innerHTML = '<div class="dot">' + m.dataset.icon + "</div><b>" + esc(m.dataset.title) + "</b><small>Módulo " + i + "</small>";
      b.onclick = function () { go(i); };
      j.appendChild(b);
    });
  }

  /* ---------- M1: KYC ---------- */
  function buildKycAcc() {
    var box = $("#kycAcc");
    KYC_ITEMS.forEach(function (k, i) {
      box.appendChild(acc(k.ic + " " + esc(k.t), "<ul>" + k.q.map(function (q) { return "<li>" + esc(q) + "</li>"; }).join("") + "</ul>", i === 0));
    });
  }

  /* ---------- M2: deudor ---------- */
  function initDebtor() {
    $("#debtorBtn").onclick = function () {
      $("#debtorReal").style.opacity = 1; $("#debtorFb").classList.remove("hidden"); this.disabled = true;
    };
  }

  /* ---------- M4: países ---------- */
  function buildCountries() {
    var tabs = $("#countryTabs"), out = $("#countryOut");
    function show(k) {
      var c = COUNTRIES.filter(function (x) { return x.k === k; })[0];
      $$(".tab", tabs).forEach(function (b) { b.classList.toggle("active", b.dataset.k === k); });
      var who = c.who === "exp" ? '<span class="pill ok">ExpoCredit lo obtiene</span>' : '<span class="pill cy">Lo aporta el BDO</span>';
      out.innerHTML = '<div class="card" style="background:var(--card2)"><h3>' + esc(c.label) + " " + who + "</h3><p>" + esc(c.out) + '</p><p style="margin-top:8px">' + esc(COUNTRY_TAX[k]) + "</p></div>";
    }
    COUNTRIES.forEach(function (c, i) {
      var b = document.createElement("button"); b.className = "tab"; b.dataset.k = c.k; b.textContent = c.label;
      b.onclick = function () { show(c.k); }; tabs.appendChild(b);
    });
    show(COUNTRIES[0].k);
  }

  /* ---------- M6: KYC operativo ---------- */
  function buildKycBuilder() {
    var box = $("#kycBuilder"), step = 0, got = {};
    function render() {
      var s = KYC_STAGES[step];
      var pct = Math.round(step / KYC_STAGES.length * 100);
      box.innerHTML = '<div class="meter"><i style="width:' + pct + '%"></i></div>' +
        '<h3>' + s.ic + " Etapa " + (step + 1) + " de " + KYC_STAGES.length + ": " + esc(s.t) + "</h3>" +
        s.q.map(function (q, i) {
          var id = step + "-" + i, on = got[id];
          return '<label class="check' + (on ? " on" : "") + '"><input type="checkbox" data-id="' + id + '"' + (on ? " checked" : "") + "><span>" + esc(q) + "</span></label>";
        }).join("") +
        '<div class="kyc-ex"><div class="gen"><b>❌ Respuesta genérica <span class="tag">sugerido</span></b>' + esc(s.gen) + '</div><div class="qual"><b>✅ Respuesta de calidad <span class="tag">sugerido</span></b>' + esc(s.good) + "</div></div>" +
        '<div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap"><button class="btn ghost small" id="kbPrev"' + (step === 0 ? " disabled" : "") + '>← Etapa anterior</button><button class="btn small" id="kbNext">' + (step === KYC_STAGES.length - 1 ? "Terminar" : "Siguiente etapa →") + "</button></div>";
      $$("input", box).forEach(function (cb) {
        cb.onchange = function () { got[cb.dataset.id] = cb.checked; cb.parentNode.classList.toggle("on", cb.checked); };
      });
      $("#kbPrev").onclick = function () { step--; render(); };
      $("#kbNext").onclick = function () {
        if (step < KYC_STAGES.length - 1) { step++; render(); } else finish();
      };
    }
    function finish() {
      var n = Object.keys(got).filter(function (k) { return got[k]; }).length;
      var all = KYC_STAGES.reduce(function (a, s) { return a + s.q.length; }, 0);
      box.innerHTML = '<h3>🎯 Preguntas cubiertas: ' + n + " de " + all + '</h3><div class="meter"><i style="width:' + Math.round(n / all * 100) + '%"></i></div><p style="color:var(--mute)">' +
        (n === all ? "¡Tu KYC operativo cubre todas las etapas!" : "Revisa las etapas con preguntas pendientes antes de enviar el expediente: cada pregunta sin responder genera reprocesos.") + '</p><button class="btn small" id="kbAgain">Repetir</button>';
      $("#kbAgain").onclick = function () { step = 0; got = {}; render(); };
    }
    render();
  }

  /* ---------- M6: grandes NO ---------- */
  function buildNos() {
    var box = $("#noList");
    NOS.forEach(function (n, i) {
      box.appendChild(acc('<span class="pill bad">NO ' + (i + 1) + "</span> " + esc(n.t),
        '<p><b>Ejemplo</b> <span class="tag">sugerido</span></p><p>' + esc(n.ex) + "</p>"));
    });
  }

  /* ---------- M6: semáforo ---------- */
  function buildSwipe() {
    var order = shuffle(SWIPE), i = 0, score = 0, locked = false;
    var stage = $("#swipeStage"), fb = $("#swFb"), sc = $("#swScore");
    function card() {
      stage.innerHTML = "";
      fb.classList.add("hidden");
      if (i >= order.length) {
        stage.innerHTML = '<div class="scard"><div class="big">🏁</div><p><b>' + score + " de " + order.length + ' correctas</b></p><p style="color:var(--mute)">' + (score >= order.length - 1 ? "¡Excelente ojo de viabilidad!" : "Repasa “Los grandes NO” y vuelve a intentarlo.") + '</p><p><button class="btn small" id="swAgain">Reintentar</button></p></div>';
        $("#swAgain").onclick = function () { order = shuffle(SWIPE); i = 0; score = 0; card(); };
        sc.textContent = ""; return;
      }
      var c = order[i];
      var el = document.createElement("div"); el.className = "scard";
      el.innerHTML = '<div class="big">' + c.e + "</div><p>" + esc(c.c) + '</p><small style="color:var(--mute)">Caso ' + (i + 1) + " de " + order.length + " · ficticio (sugerido)</small>";
      stage.appendChild(el);
      sc.textContent = "Puntos: " + score;
      var sx = null;
      el.addEventListener("pointerdown", function (e) { sx = e.clientX; el.setPointerCapture(e.pointerId); });
      el.addEventListener("pointermove", function (e) { if (sx !== null) el.style.transform = "translateX(" + (e.clientX - sx) + "px) rotate(" + ((e.clientX - sx) / 20) + "deg)"; });
      el.addEventListener("pointerup", function (e) {
        if (sx === null) return; var dx = e.clientX - sx; sx = null;
        if (dx > 90) answer(true); else if (dx < -90) answer(false); else el.style.transform = "";
      });
    }
    function answer(v) {
      if (locked || i >= order.length) return; locked = true;
      var c = order[i], ok = c.v === v; if (ok) score++;
      var el = $(".scard", stage); if (el) { el.style.transform = "translateX(" + (v ? 300 : -300) + "px) rotate(" + (v ? 15 : -15) + "deg)"; el.style.opacity = 0; }
      fb.className = "feedback"; fb.innerHTML = (ok ? "✅ <b>Correcto.</b> " : "❌ <b>No exactamente.</b> ") + esc(c.x);
      sc.textContent = "Puntos: " + score;
      setTimeout(function () { i++; locked = false; if (i >= order.length) card(); else { var el2 = document.createElement("div"); card(); fb.className = "feedback"; fb.innerHTML = (ok ? "✅ <b>Correcto.</b> " : "❌ <b>No exactamente.</b> ") + esc(c.x); } }, 700);
    }
    $("#swYes").onclick = function () { answer(true); };
    $("#swNo").onclick = function () { answer(false); };
    document.addEventListener("keydown", function (e) {
      if (!$("#m6").classList.contains("active")) return;
      if (e.key === "ArrowRight") answer(true); if (e.key === "ArrowLeft") answer(false);
    });
    card();
  }

  /* ---------- M6: segmentos ---------- */
  function buildSegs() {
    var box = $("#segCards"), det = $("#segDetail");
    function show(k) {
      $$(".card", box).forEach(function (c) { c.classList.toggle("on", c.dataset.k === k); });
      var s = SEGS.filter(function (x) { return x.k === k; })[0];
      det.innerHTML = "<h3>" + esc(s.name) + "</h3><ul>" + s.pts.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul>" +
        (k !== "std" ? '<div class="callout sug" style="margin-top:12px"><div class="ic">💡</div><div><b>Sugerido:</b> si la línea está entre USD 250K y USD 350K, aplican ambas reglas: usa el formato simplificado y cumple todos los requisitos By The Book. Confirma el criterio con Crédito ante cualquier duda.</div></div>' : "");
    }
    SEGS.forEach(function (s) {
      var c = document.createElement("div"); c.className = "card"; c.dataset.k = s.k;
      c.innerHTML = '<div class="big">' + esc(s.big) + "</div><h3>" + esc(s.name) + "</h3><p>Toca para ver los requisitos</p>";
      c.onclick = function () { show(s.k); }; box.appendChild(c);
    });
    show("btb");
  }

  /* ---------- M7: Top 6 + checklist ---------- */
  function buildTop() {
    var box = $("#topList");
    TOP.forEach(function (t, i) {
      var body = "<p><b>Problema</b></p><p>" + esc(t.p) + "</p><p><b>Impacto</b></p><ul>" + t.i.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" +
        "<p><b>Solución</b>" + (t.sug ? ' <span class="tag">sugerido</span>' : "") + "</p><ul>" + t.s.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" +
        (t.sug ? '<p style="font-size:.85rem">La diapositiva original dice “Lluvia de ideas”; estas son propuestas para completarla.</p>' : "");
      box.appendChild(acc('<span class="pill cy">#' + t.n + "</span> " + esc(t.t), body, i === 0));
    });
  }

  function buildChecklist() {
    var box = $("#ckList");
    function upd() {
      var n = state.checks.filter(Boolean).length;
      $("#ckMeter").style.width = Math.round(n / CHECK.length * 100) + "%";
      $("#ckDone").classList.toggle("hidden", n !== CHECK.length);
    }
    if (!state.checks || state.checks.length !== CHECK.length) state.checks = CHECK.map(function () { return false; });
    CHECK.forEach(function (c, i) {
      var l = document.createElement("label"); l.className = "check" + (state.checks[i] ? " on" : "");
      l.innerHTML = '<input type="checkbox"' + (state.checks[i] ? " checked" : "") + "><span>" + esc(c) + "</span>";
      $("input", l).onchange = function (e) { state.checks[i] = e.target.checked; l.classList.toggle("on", e.target.checked); save(); upd(); };
      box.appendChild(l);
    });
    upd();
  }

  /* ---------- M8: armar expediente ---------- */
  function buildBuild() {
    var pool = $("#pool"), sel = null, buckets = $$(".bucket");
    function init() {
      pool.innerHTML = ""; $$(".bucket .drop").forEach(function (d) { d.innerHTML = ""; });
      $("#buildFb").classList.add("hidden");
      shuffle(DOCS).slice(0, 10).forEach(function (d) {
        var c = document.createElement("div"); c.className = "chip"; c.draggable = true; c.textContent = d.d; c._d = d;
        c.addEventListener("dragstart", function (e) { sel = c; e.dataTransfer.setData("text/plain", "x"); });
        c.onclick = function (e) {
          var inBucket = c.closest(".bucket");
          if (sel && sel !== c && inBucket) { e.stopPropagation(); drop(inBucket); return; }
          $$(".chip").forEach(function (x) { x.classList.remove("sel"); }); sel = c; c.classList.add("sel");
        };
        pool.appendChild(c);
      });
    }
    function drop(b) { if (!sel) return; $(".drop", b).appendChild(sel); sel.classList.remove("sel"); sel = null; }
    buckets.forEach(function (b) {
      b.addEventListener("dragover", function (e) { e.preventDefault(); b.classList.add("over"); });
      b.addEventListener("dragleave", function () { b.classList.remove("over"); });
      b.addEventListener("drop", function (e) { e.preventDefault(); b.classList.remove("over"); drop(b); });
      b.addEventListener("click", function (e) { if (e.target.closest(".chip")) return; drop(b); });
    });
    pool.addEventListener("dragover", function (e) { e.preventDefault(); });
    pool.addEventListener("drop", function (e) { e.preventDefault(); if (sel) { pool.appendChild(sel); sel.classList.remove("sel"); sel = null; } });
    $("#buildReset").onclick = init;
    $("#buildCheck").onclick = function () {
      var fb = $("#buildFb"), right = 0, tot = 0, notes = [];
      $$(".chip").forEach(function (c) {
        var b = c.closest(".bucket"); tot++;
        c.classList.remove("right", "wrong");
        if (!b) { c.classList.add("wrong"); notes.push("Sin clasificar: " + c._d.d); return; }
        var ok = (b.dataset.b === "ok") === c._d.ok;
        c.classList.add(ok ? "right" : "wrong"); if (ok) right++; else notes.push(c._d.d + " → " + c._d.x);
      });
      fb.classList.remove("hidden");
      fb.innerHTML = '<span class="score">' + right + "/" + tot + "</span> bien clasificados." + (notes.length ? "<ul style='margin:8px 0 0 18px'>" + notes.map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("") + "</ul>" : " ¡Expediente impecable!");
    };
    init();
  }

  /* ---------- M8: encuentra el error ---------- */
  function buildErr() {
    var box = $("#errBox"), i = 0, score = 0, order = shuffle(ERRS);
    function render() {
      if (i >= order.length) {
        box.innerHTML = '<p class="score">' + score + "/" + order.length + '</p><p style="color:var(--mute)">Aciertos. Los casos son ilustrativos (sugeridos).</p><button class="btn small" id="erAgain">Reintentar</button>';
        $("#erAgain").onclick = function () { i = 0; score = 0; order = shuffle(ERRS); render(); }; return;
      }
      var e = order[i];
      box.innerHTML = "<h4>Caso " + (i + 1) + " de " + order.length + ": " + esc(e.t) + ' <span class="tag">sugerido</span></h4>' + e.h +
        e.o.map(function (o, k) { return '<button class="opt" data-k="' + k + '">' + esc(o) + "</button>"; }).join("") + '<div id="erFb"></div>';
      $$(".opt", box).forEach(function (b) {
        b.onclick = function () {
          var k = +b.dataset.k, ok = k === e.c; if (ok) score++;
          $$(".opt", box).forEach(function (x) { x.disabled = true; if (+x.dataset.k === e.c) x.classList.add("right"); });
          if (!ok) b.classList.add("wrong");
          $("#erFb").innerHTML = '<div class="feedback">' + (ok ? "✅ <b>¡Bien visto!</b> " : "❌ <b>Casi.</b> ") + esc(e.x) + '</div><p style="margin-top:10px"><button class="btn small" id="erNext">Siguiente →</button></p>';
          $("#erNext").onclick = function () { i++; render(); };
        };
      });
    }
    render();
  }

  /* ---------- M9: quiz, flashcards, certificado ---------- */
  function buildQuiz() {
    var box = $("#quizBox"), qs, i, score;
    function start() { qs = shuffle(QUIZ); i = 0; score = 0; render(); }
    function render() {
      if (i >= qs.length) {
        var pct = Math.round(score / qs.length * 100), pass = pct >= 80;
        if (pct > state.quizBest) { state.quizBest = pct; save(); }
        if (pass) { markDone(total - 1); unlockCert(); }
        box.innerHTML = '<h3>Resultado</h3><p class="score">' + pct + "%</p><p>" + score + " de " + qs.length + " correctas. " + (pass ? "🎉 ¡Aprobado! Ya puedes generar tu certificado." : "Necesitas 80% para aprobar. Repasa las flashcards e inténtalo otra vez.") + '</p><p style="color:var(--mute)">Mejor resultado: ' + state.quizBest + '%</p><button class="btn small" id="qAgain">Reintentar</button>';
        $("#qAgain").onclick = start; return;
      }
      var q = qs[i], idx = shuffle(q.o.map(function (_, k) { return k; }));
      box.innerHTML = '<div class="meter"><i style="width:' + Math.round(i / qs.length * 100) + '%"></i></div><p style="color:var(--mute)">Pregunta ' + (i + 1) + " de " + qs.length + "</p><h3>" + esc(q.q) + "</h3>" +
        idx.map(function (k) { return '<button class="opt" data-k="' + k + '">' + esc(q.o[k]) + "</button>"; }).join("") + '<div id="qFb"></div>';
      $$(".opt", box).forEach(function (b) {
        b.onclick = function () {
          var ok = +b.dataset.k === q.c; if (ok) score++;
          $$(".opt", box).forEach(function (x) { x.disabled = true; if (+x.dataset.k === q.c) x.classList.add("right"); });
          if (!ok) b.classList.add("wrong");
          $("#qFb").innerHTML = '<div class="feedback">' + esc(q.x) + '</div><p style="margin-top:10px"><button class="btn small" id="qNext">' + (i === qs.length - 1 ? "Ver resultado" : "Siguiente →") + "</button></p>";
          $("#qNext").onclick = function () { i++; render(); };
        };
      });
    }
    start();
  }

  function buildFlash() {
    var i = 0, f = $("#flash");
    function show() { f.classList.remove("flip"); $("#flF").textContent = FLASH[i][0]; $("#flB").textContent = FLASH[i][1]; $("#flN").textContent = (i + 1) + " / " + FLASH.length; }
    f.onclick = function () { f.classList.toggle("flip"); };
    $("#flPrev").onclick = function () { i = (i - 1 + FLASH.length) % FLASH.length; show(); };
    $("#flNext").onclick = function () { i = (i + 1) % FLASH.length; show(); };
    show();
  }

  function unlockCert() {
    $("#certMsg").textContent = "¡Aprobaste! Escribe tu nombre para generar el certificado.";
    $("#certForm").classList.remove("hidden");
  }

  function buildCert() {
    if (state.quizBest >= 80) unlockCert();
    $("#certBtn").onclick = function () {
      var name = ($("#certName").value || "").trim(); if (!name) { $("#certName").focus(); return; }
      var cv = $("#certCanvas"), g = cv.getContext("2d"), W = cv.width, H = cv.height;
      var gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, "#0b1126"); gr.addColorStop(1, "#1a3a6e");
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
      g.strokeStyle = "#12b0d0"; g.lineWidth = 6; g.strokeRect(40, 40, W - 80, H - 80);
      g.strokeStyle = "rgba(18,176,208,.4)"; g.lineWidth = 2; g.strokeRect(58, 58, W - 116, H - 116);
      g.textAlign = "center"; g.fillStyle = "#ffffff";
      g.font = "800 54px 'DM Sans',sans-serif"; g.fillText("ExpoCredit", W / 2, 170);
      g.fillStyle = "#12b0d0"; g.font = "600 26px 'DM Sans',sans-serif"; g.fillText("FORMACIÓN BDO", W / 2, 210);
      g.fillStyle = "#ffffff"; g.font = "700 40px 'DM Sans',sans-serif"; g.fillText("Certificado de finalización", W / 2, 330);
      g.font = "400 26px 'DM Sans',sans-serif"; g.fillText("Se otorga a", W / 2, 400);
      g.fillStyle = "#12b0d0"; g.font = "800 62px 'DM Sans',sans-serif"; g.fillText(name, W / 2, 490);
      g.fillStyle = "#ffffff"; g.font = "400 26px 'DM Sans',sans-serif";
      g.fillText("por completar la formación “Un expediente bien preparado desde el primer envío”", W / 2, 565);
      g.fillText("con un resultado de " + state.quizBest + "% en la evaluación final.", W / 2, 605);
      g.fillStyle = "#9fb0d8"; g.font = "400 22px 'DM Sans',sans-serif";
      g.fillText(new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" }), W / 2, 700);
      cv.classList.remove("hidden"); $("#certDl").classList.remove("hidden");
    };
    $("#certDl").onclick = function () {
      var a = document.createElement("a"); a.download = "certificado-expocredit-bdo.png"; a.href = $("#certCanvas").toDataURL("image/png"); a.click();
    };
  }

  /* ---------- Tema, pager ---------- */
  function setTheme(t) {
    document.documentElement.setAttribute("data-theme", t); state.theme = t; save();
    $("#themeBtn").textContent = t === "dark" ? "🌙" : "☀️";
  }

  function init() {
    load();
    buildNav(); buildJourney(); initTabs();
    buildKycAcc(); initDebtor(); buildCountries(); buildKycBuilder(); buildNos(); buildSwipe(); buildSegs();
    buildTop(); buildChecklist(); buildBuild(); buildErr(); buildQuiz(); buildFlash(); buildCert();
    $("#themeBtn").onclick = function () { setTheme(state.theme === "dark" ? "light" : "dark"); };
    $("#menuBtn").onclick = function () { $("#sidebar").classList.toggle("open"); };
    $("#prevBtn").onclick = function () { go(state.cur - 1); };
    $("#nextBtn").onclick = function () { go(state.cur + 1); };
    $("#doneBtn").onclick = function () { markDone(state.cur); if (state.cur < total - 1) go(state.cur + 1); };
    setTheme(state.theme || "dark");
    go(state.cur || 0);
  }
  init();
})();
