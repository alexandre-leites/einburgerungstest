/* eslint-disable no-console */
(() => {
  const APP = {
    prefix: "ebt.",
    version: 1,
    defaultLang: "de",
    defaultState: "Berlin",
    testTotal: 33,
    testGermanyCount: 30,
    testStateCount: 3,
    testDurationMs: 60 * 60 * 1000,
    trainDefaultCredits: 10,
    trainCooldownMinMs: 3 * 60 * 1000,
    trainCooldownMaxMs: 10 * 60 * 1000,
  };

  const UI = {
    de: {
      home: "Home",
      modes: "Modi",
      memorization: "Memorieren",
      training: "Training",
      test: "Test",
      review: "Wiederholen",
      tools: "Tools",
      statistics: "Statistiken",
      myDictionary: "Mein Wörterbuch",
      settings: "Einstellungen",
      language: "Sprache",
      stateForTest: "Bundesland (für Test)",
      resetLocalData: "Lokale Daten zurücksetzen",
      back: "Zurück",
      next: "Nächste",
      timer: "Timer",
      progress: "Fortschritt",
      start: "Start",
      resume: "Fortsetzen",
      newTest: "Neuer Test",
      confirm: "Bestätigen",
      cancel: "Abbrechen",
      ok: "OK",
      resetConfirm: "Möchtest du alle lokalen Daten (Statistiken, Sitzungen, Wörterbuch) wirklich löschen?",
      dataResetDone: "Lokale Daten gelöscht.",
      loading: "Lade…",
      loadFailed: "Konnte Daten nicht laden.",
      introTitle: "Dein Self-learning für den Einbürgerungstest",
      introText:
        "Wähle einen Modus im Menü. Fragen werden zufällig gemischt. Die Position der richtigen Antwort bleibt immer gleich (1–4).",
      testRulesTitle: "Test-Regeln",
      testRulesText:
        "Während des Tests erhältst du 33 Fragen. Du hast 60 Minuten Zeit. Für jede Frage wählst du die richtige Antwort aus vier Möglichkeiten. Wenn du mindestens 17 Fragen richtig beantwortest, bestehst du.",
      testComposition:
        "Zusammensetzung: 30 allgemeine Fragen (Deutschland) + 3 Fragen aus deinem Bundesland.",
      question: "Frage",
      answered: "Beantwortet",
      finishTest: "Test beenden",
      finishTestConfirm: "Möchtest du den Test wirklich beenden? Danach siehst du das Ergebnis.",
      testFinished: "Test beendet",
      pass: "Bestanden",
      fail: "Nicht bestanden",
      correct: "Richtig",
      wrong: "Falsch",
      skipped: "Übersprungen",
      accuracy: "Genauigkeit",
      noStatsYet: "Noch keine Statistiken. Beantworte ein paar Fragen im Training oder im Test.",
      sortBy: "Sortieren nach",
      mostWrong: "Meiste Fehler",
      mostCorrect: "Meiste Treffer",
      mostSkipped: "Meist übersprungen",
      bestAccuracy: "Beste Quote",
      worstAccuracy: "Schlechteste Quote",
      attempts: "Versuche",
      openInTraining: "Im Training öffnen",
      word: "Wort",
      baseDictionary: "Basis-Wörterbuch",
      myNote: "Meine Notiz",
      save: "Speichern",
      remove: "Entfernen",
      notInBaseDictionary: "Nicht im Basis-Wörterbuch gefunden.",
      noDefinition: "Keine Definition verfügbar (nur Beispiele).",
      emptyDictionary: "Noch keine Wörter gespeichert. Klicke auf ein Wort in einer Frage/Antwort.",
      export: "Exportieren",
      import: "Importieren",
      importPlaceholder: "JSON einfügen und importieren…",
      importDone: "Importiert.",
      invalidJson: "Ungültiges JSON.",
      copiedToClipboard: "In die Zwischenablage kopiert.",
      imageMissing: "Bild konnte nicht geladen werden.",
    },
    en: {
      home: "Home",
      modes: "Modes",
      memorization: "Memorization",
      training: "Training",
      test: "Test",
      review: "Review",
      tools: "Tools",
      statistics: "Statistics",
      myDictionary: "My dictionary",
      settings: "Settings",
      language: "Language",
      stateForTest: "State (for test)",
      resetLocalData: "Reset local data",
      back: "Back",
      next: "Next",
      timer: "Timer",
      progress: "Progress",
      start: "Start",
      resume: "Resume",
      newTest: "New test",
      confirm: "Confirm",
      cancel: "Cancel",
      ok: "OK",
      resetConfirm: "Do you really want to delete all local data (stats, sessions, dictionary)?",
      dataResetDone: "Local data cleared.",
      loading: "Loading…",
      loadFailed: "Failed to load data.",
      introTitle: "Your self-learning for the Einbürgerungstest",
      introText:
        "Pick a mode in the menu. Questions are shuffled. The position of the correct answer stays the same (1–4).",
      testRulesTitle: "Test rules",
      testRulesText:
        "During the test, you will receive 33 questions. You have 60 minutes to answer them. For each question, you must choose the correct answer from four possible answers. If you answer at least 17 questions correctly, you will pass the test.",
      testComposition: "Composition: 30 general questions (Germany) + 3 questions from your state.",
      question: "Question",
      answered: "Answered",
      finishTest: "Finish test",
      finishTestConfirm: "Do you really want to finish the test? You will then see the result.",
      testFinished: "Test finished",
      pass: "Pass",
      fail: "Fail",
      correct: "Correct",
      wrong: "Wrong",
      skipped: "Skipped",
      accuracy: "Accuracy",
      noStatsYet: "No stats yet. Answer a few questions in Training or Test.",
      sortBy: "Sort by",
      mostWrong: "Most wrong",
      mostCorrect: "Most correct",
      mostSkipped: "Most skipped",
      bestAccuracy: "Best accuracy",
      worstAccuracy: "Worst accuracy",
      attempts: "Attempts",
      openInTraining: "Open in training",
      word: "Word",
      baseDictionary: "Base dictionary",
      myNote: "My note",
      save: "Save",
      remove: "Remove",
      notInBaseDictionary: "Not found in base dictionary.",
      noDefinition: "No definition available (examples only).",
      emptyDictionary: "No saved words yet. Click a word in any question/answer.",
      export: "Export",
      import: "Import",
      importPlaceholder: "Paste JSON and import…",
      importDone: "Imported.",
      invalidJson: "Invalid JSON.",
      copiedToClipboard: "Copied to clipboard.",
      imageMissing: "Image could not be loaded.",
    },
    pt: {
      home: "Home",
      modes: "Modos",
      memorization: "Memorização",
      training: "Treino",
      test: "Teste",
      review: "Revisão",
      tools: "Ferramentas",
      statistics: "Estatísticas",
      myDictionary: "Meu dicionário",
      settings: "Configurações",
      language: "Idioma",
      stateForTest: "Estado (para teste)",
      resetLocalData: "Resetar dados locais",
      back: "Voltar",
      next: "Próxima",
      timer: "Cronômetro",
      progress: "Progresso",
      start: "Iniciar",
      resume: "Continuar",
      newTest: "Novo teste",
      confirm: "Confirmar",
      cancel: "Cancelar",
      ok: "OK",
      resetConfirm: "Deseja mesmo apagar todos os dados locais (estatísticas, sessões, dicionário)?",
      dataResetDone: "Dados locais apagados.",
      loading: "Carregando…",
      loadFailed: "Falha ao carregar dados.",
      introTitle: "Seu self-learning para o Einbürgerungstest",
      introText:
        "Escolha um modo no menu. As perguntas são embaralhadas. A posição da resposta correta sempre fica igual (1–4).",
      testRulesTitle: "Regras do teste",
      testRulesText:
        "During the test, you will receive a booklet containing 33 questions. You have 60 minutes to answer them. For each question, you must choose the correct answer from four possible answers. If you answer at least 17 questions correctly, you will pass the test.",
      testComposition: "Composição: 30 questões gerais (Alemanha) + 3 questões do seu estado.",
      question: "Pergunta",
      answered: "Respondidas",
      finishTest: "Finalizar teste",
      finishTestConfirm: "Deseja mesmo finalizar o teste? Em seguida você verá o resultado.",
      testFinished: "Teste finalizado",
      pass: "Aprovado",
      fail: "Reprovado",
      correct: "Acertos",
      wrong: "Erros",
      skipped: "Puladas",
      accuracy: "Precisão",
      noStatsYet: "Sem estatísticas ainda. Responda algumas questões no Treino ou no Teste.",
      sortBy: "Ordenar por",
      mostWrong: "Mais erradas",
      mostCorrect: "Mais acertadas",
      mostSkipped: "Mais puladas",
      bestAccuracy: "Melhor precisão",
      worstAccuracy: "Pior precisão",
      attempts: "Tentativas",
      openInTraining: "Abrir no treino",
      word: "Palavra",
      baseDictionary: "Dicionário base",
      myNote: "Minha nota",
      save: "Salvar",
      remove: "Remover",
      notInBaseDictionary: "Não encontrada no dicionário base.",
      noDefinition: "Sem definição disponível (apenas exemplos).",
      emptyDictionary: "Nenhuma palavra salva ainda. Clique em uma palavra de qualquer pergunta/resposta.",
      export: "Exportar",
      import: "Importar",
      importPlaceholder: "Cole o JSON e importe…",
      importDone: "Importado.",
      invalidJson: "JSON inválido.",
      copiedToClipboard: "Copiado para a área de transferência.",
      imageMissing: "Não foi possível carregar a imagem.",
    },
  };

  const state = {
    questions: [],
    questionsById: new Map(),
    baseDictionary: {},
    lang: APP.defaultLang,
    selectedState: APP.defaultState,
    route: "home",
    activeSession: null, // {mode, orderIds, index, ...}
    testTicker: null,
    currentWord: null,
  };

  const els = {};

  function key(name) {
    return `${APP.prefix}${name}`;
  }

  function readJSON(storageKey, fallback) {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (err) {
      return fallback;
    }
  }

  function writeJSON(storageKey, value) {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }

  function t(id) {
    const dict = UI[state.lang] ?? UI.de;
    return dict[id] ?? UI.de[id] ?? id;
  }

  function setText(el, text) {
    el.textContent = text;
  }

  function toast(message) {
    setText(els.toast, message);
    els.toast.hidden = false;
    window.clearTimeout(toast._t);
    toast._t = window.setTimeout(() => {
      els.toast.hidden = true;
    }, 2200);
  }

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function formatTimeMs(ms) {
    const clamped = Math.max(0, ms);
    const totalSec = Math.floor(clamped / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${pad2(min)}:${pad2(sec)}`;
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = array[i];
      array[i] = array[j];
      array[j] = tmp;
    }
    return array;
  }

  function randInt(minInclusive, maxInclusive) {
    const min = Math.ceil(minInclusive);
    const max = Math.floor(maxInclusive);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function tokenize(text) {
    const re = /([A-Za-zÄÖÜäöüß]+|\s+|[^A-Za-zÄÖÜäöüß\s]+)/g;
    return String(text ?? "").match(re) ?? [];
  }

  function normalizeWord(word) {
    return String(word ?? "")
      .trim()
      .replace(/^[^A-Za-zÄÖÜäöüß]+|[^A-Za-zÄÖÜäöüß]+$/g, "");
  }

  function findBaseDictionaryEntry(word) {
    const w = normalizeWord(word);
    if (!w) return null;
    const canon = w.toLowerCase();
    if (state.baseDictionary[canon]) return { key: canon, entry: state.baseDictionary[canon] };
    return null;
  }

  function escapeRegExp(str) {
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function highlightWord(text, word) {
    const w = normalizeWord(word);
    if (!w) return String(text ?? "");
    const escaped = escapeRegExp(w);
    // Unicode letter boundaries (avoid missing ÄÖÜäöüß)
    const re = new RegExp(`(^|[^\\p{L}])(${escaped})(?=[^\\p{L}]|$)`, "giu");
    return String(text ?? "").replace(re, (m, p1, p2) => `${p1}<strong>${p2}</strong>`);
  }

  function statsReadAll() {
    return readJSON(key("statsById"), {});
  }

  function statsBump(questionId, isCorrect) {
    const all = statsReadAll();
    const current = all[questionId] ?? { correct: 0, wrong: 0, skipped: 0, lastAnsweredAt: null, lastSkippedAt: null };
    const updated = {
      ...current,
      correct: current.correct + (isCorrect ? 1 : 0),
      wrong: current.wrong + (isCorrect ? 0 : 1),
      lastAnsweredAt: new Date().toISOString(),
    };
    all[questionId] = updated;
    writeJSON(key("statsById"), all);
  }

  function statsBumpSkip(questionId) {
    const all = statsReadAll();
    const current = all[questionId] ?? { correct: 0, wrong: 0, skipped: 0, lastAnsweredAt: null, lastSkippedAt: null };
    const updated = {
      ...current,
      skipped: (current.skipped ?? 0) + 1,
      lastSkippedAt: new Date().toISOString(),
    };
    all[questionId] = updated;
    writeJSON(key("statsById"), all);
  }

  function accuracyOf(stat) {
    const total = (stat?.correct ?? 0) + (stat?.wrong ?? 0);
    if (!total) return null;
    return (stat.correct ?? 0) / total;
  }

  function myDictReadAll() {
    return readJSON(key("myDictionary"), {});
  }

  function myDictWriteAll(all) {
    writeJSON(key("myDictionary"), all);
  }

  function canonicalWordKey(wordRaw) {
    return normalizeWord(wordRaw).toLowerCase();
  }

  function isMobileNav() {
    return window.matchMedia("(max-width: 980px)").matches;
  }

  function syncSidebarForViewport() {
    if (isMobileNav()) {
      // entering mobile: remove desktop collapsed state and ensure overlay matches is-open
      els.sidebar.classList.remove("is-collapsed");
      const isOpen = els.sidebar.classList.contains("is-open");
      els.overlay.hidden = !isOpen;
      return;
    }
    // entering desktop: close mobile overlay state and keep sidebar expanded by default
    els.sidebar.classList.remove("is-open");
    els.overlay.hidden = true;
  }

  function openSidebar() {
    if (!isMobileNav()) return;
    els.sidebar.classList.add("is-open");
    els.overlay.hidden = false;
  }

  function closeSidebar() {
    if (!isMobileNav()) return;
    els.sidebar.classList.remove("is-open");
    els.overlay.hidden = true;
  }

  function toggleSidebar() {
    if (isMobileNav()) {
      const isOpen = els.sidebar.classList.contains("is-open");
      if (isOpen) closeSidebar();
      else openSidebar();
      return;
    }
    // desktop: collapse/expand sidebar (no overlay)
    els.sidebar.classList.toggle("is-collapsed");
    els.overlay.hidden = true;
  }

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.hidden = false;
    modal.style.display = "grid";
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.hidden = true;
    modal.style.display = "none";
  }

  function confirmDialog(text, onOk) {
    setText(els.confirmText, text);
    openModal("confirmModal");
    const handler = () => {
      els.confirmOkBtn.removeEventListener("click", handler);
      closeModal("confirmModal");
      onOk();
    };
    els.confirmOkBtn.addEventListener("click", handler);
  }

  function setRoute(route) {
    const next = route || "home";
    state.route = next;
    window.location.hash = `#/${next}`;
  }

  function getRouteFromHash() {
    const raw = window.location.hash || "#/home";
    const cleaned = raw.replace(/^#\/?/, "");
    return cleaned || "home";
  }

  function setActiveNav(route) {
    document.querySelectorAll(".nav__item[data-route]").forEach((btn) => {
      const isActive = btn.getAttribute("data-route") === route;
      if (isActive) btn.setAttribute("aria-current", "page");
      else btn.removeAttribute("aria-current");
    });
  }

  function setTopbar(title, meta) {
    setText(els.routeTitle, title);
    setText(els.routeMeta, meta ?? "");
  }

  function setProgress(current, total) {
    setText(els.progressValue, `${current}/${total}`);
  }

  function setTimerVisible(visible) {
    els.timerPill.hidden = !visible;
  }

  function stopTestTicker() {
    if (state.testTicker) window.clearInterval(state.testTicker);
    state.testTicker = null;
  }

  function updateTestTimerUI(testSession) {
    const now = Date.now();
    const remaining = testSession.endTimeMs - now;
    setText(els.timerValue, formatTimeMs(remaining));
    if (remaining <= 0) {
      finishTest(true);
    }
  }

  function pickQuestionsForTest() {
    const germany = state.questions.filter((q) => q.category === "GERMANY");
    const stateQs = state.questions.filter((q) => q.category === state.selectedState);
    const germanyPick = shuffle([...germany]).slice(0, APP.testGermanyCount);
    const statePick = shuffle([...stateQs]).slice(0, APP.testStateCount);
    return [...germanyPick, ...statePick];
  }

  function getPracticeQuestions() {
    return state.questions.filter((q) => q.category === state.selectedState);
  }

  function getPracticeQuestionIds() {
    return getPracticeQuestions().map((q) => q._id);
  }

  function sessionKeyForMode(mode) {
    return key(`session.${mode}`);
  }

  function loadSession(mode) {
    return readJSON(sessionKeyForMode(mode), null);
  }

  function saveSession(mode, session) {
    writeJSON(sessionKeyForMode(mode), session);
  }

  function clearSession(mode) {
    localStorage.removeItem(sessionKeyForMode(mode));
  }

  function ensureSessionForMode(mode) {
    if (mode === "test") {
      let session = loadSession("test");
      if (!session || session.version !== APP.version) session = null;
      if (!session || session.state !== state.selectedState || !Array.isArray(session.questionIds)) {
        const qs = pickQuestionsForTest();
        session = {
          version: APP.version,
          mode: "test",
          state: state.selectedState,
          startTimeMs: Date.now(),
          endTimeMs: Date.now() + APP.testDurationMs,
          questionIds: qs.map((q) => q._id),
          index: 0,
          answers: {}, // id -> optionIndex
          finished: false,
          finishedAtMs: null,
          score: null,
        };
        saveSession("test", session);
      }
      state.activeSession = session;
      return session;
    }

    let session = loadSession(mode);
    if (!session || session.version !== APP.version) session = null;
    if (mode === "train") {
      const poolIds = getPracticeQuestionIds();
      if (!poolIds.length) {
        session = {
          version: APP.version,
          mode: "train",
          state: state.selectedState,
          poolIds: [],
          currentQuestionId: null,
          history: [],
          creditsById: {},
          nextEligibleAtById: {},
          sessionStatsById: {},
          answeredCount: 0,
          currentAttempt: null,
        };
        saveSession("train", session);
        state.activeSession = session;
        return session;
      }

      if (!session || session.mode !== "train" || session.state !== state.selectedState) {
        session = {
          version: APP.version,
          mode: "train",
          state: state.selectedState,
          poolIds,
          currentQuestionId: null,
          history: [],
          creditsById: {}, // id -> credits (default APP.trainDefaultCredits)
          nextEligibleAtById: {}, // id -> epoch ms (default 0)
          sessionStatsById: {}, // id -> {correct, wrong}
          answeredCount: 0,
          currentAttempt: null, // {chosenIndex,isCorrect, at}
        };
      }
      // refresh poolIds if questions file changed
      session.poolIds = poolIds;
      if (!session.currentQuestionId) {
        session.currentQuestionId = pickNextTrainingQuestionId(session, Date.now());
        if (session.currentQuestionId) {
          markTrainingShown(session, session.currentQuestionId, Date.now());
        }
        saveSession("train", session);
      }
      state.activeSession = session;
      return session;
    }

    if (!session || !Array.isArray(session.orderIds)) {
      const poolIds = getPracticeQuestionIds();
      const orderIds = shuffle(poolIds);
      session = {
        version: APP.version,
        mode,
        state: state.selectedState,
        orderIds,
        index: 0,
      };
      saveSession(mode, session);
    }
    // if state changed since session was created, reset the session to the new pool
    if (session.state && session.state !== state.selectedState) {
      clearSession(mode);
      return ensureSessionForMode(mode);
    }
    state.activeSession = session;
    return session;
  }

  function getTrainCredits(session, qid) {
    const raw = session.creditsById?.[qid];
    return typeof raw === "number" ? raw : APP.trainDefaultCredits;
  }

  function setTrainCredits(session, qid, credits) {
    if (!session.creditsById) session.creditsById = {};
    session.creditsById[qid] = credits;
  }

  function getTrainNextEligibleAt(session, qid) {
    const raw = session.nextEligibleAtById?.[qid];
    return typeof raw === "number" ? raw : 0;
  }

  function setTrainNextEligibleAt(session, qid, ts) {
    if (!session.nextEligibleAtById) session.nextEligibleAtById = {};
    session.nextEligibleAtById[qid] = ts;
  }

  function bumpTrainSessionStats(session, qid, isCorrect) {
    if (!session.sessionStatsById) session.sessionStatsById = {};
    const current = session.sessionStatsById[qid] ?? { correct: 0, wrong: 0 };
    session.sessionStatsById[qid] = {
      correct: current.correct + (isCorrect ? 1 : 0),
      wrong: current.wrong + (isCorrect ? 0 : 1),
    };
  }

  function pickNextTrainingQuestionId(session, nowMs) {
    const ids = Array.isArray(session.poolIds) && session.poolIds.length ? session.poolIds : getPracticeQuestionIds();
    const eligible = [];
    let totalWeight = 0;
    ids.forEach((qid) => {
      const credits = getTrainCredits(session, qid);
      if (credits <= 0) return;
      const nextAt = getTrainNextEligibleAt(session, qid);
      if (nextAt > nowMs) return;
      eligible.push({ qid, weight: credits });
      totalWeight += credits;
    });

    if (!eligible.length || totalWeight <= 0) {
      // Fallback: ignore cooldown (should be rare with a large pool)
      const all = ids
        .map((qid) => ({ qid, weight: Math.max(0, getTrainCredits(session, qid)) }))
        .filter((x) => x.weight > 0);
      const sum = all.reduce((acc, x) => acc + x.weight, 0);
      if (!all.length || sum <= 0) return ids[0] ?? null;
      let r = Math.random() * sum;
      for (const it of all) {
        r -= it.weight;
        if (r <= 0) return it.qid;
      }
      return all[all.length - 1].qid;
    }

    let r = Math.random() * totalWeight;
    for (const it of eligible) {
      r -= it.weight;
      if (r <= 0) return it.qid;
    }
    return eligible[eligible.length - 1].qid;
  }

  function markTrainingShown(session, qid, nowMs) {
    const delay = randInt(APP.trainCooldownMinMs, APP.trainCooldownMaxMs);
    setTrainNextEligibleAt(session, qid, nowMs + delay);
  }

  function getQuestionById(id) {
    return state.questionsById.get(id) ?? null;
  }

  function getQuestionTranslation(question) {
    if (state.lang === "en") return question.question?.text_en ?? null;
    if (state.lang === "pt") return question.question?.text_pt ?? null;
    return null;
  }

  function getOptionTranslation(question, optionIndex) {
    if (state.lang === "en") return question.options_en?.[optionIndex] ?? null;
    if (state.lang === "pt") return question.options_pt?.[optionIndex] ?? null;
    return null;
  }

  function renderSelectableText(container, text) {
    const tokens = tokenize(text);
    tokens.forEach((tok) => {
      if (/^[A-Za-zÄÖÜäöüß]+$/.test(tok)) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "word";
        b.dataset.word = tok;
        b.textContent = tok;
        container.appendChild(b);
      } else {
        container.appendChild(document.createTextNode(tok));
      }
    });
  }

  function renderQuestionCard(question, opts) {
    const {
      mode,
      showOnlyCorrect,
      onChoose,
      chosenIndex,
      revealCorrectness,
      disableOptions,
      showTranslation,
      showFeedback,
      feedback, // { chosenIndex, isCorrect }
    } = opts;

    const card = document.createElement("div");
    card.className = "card";

    const head = document.createElement("div");
    head.className = "question__head";

    const idLine = document.createElement("div");
    idLine.className = "question__id";
    setText(idLine, `${t("question")} • ${question._id} • ${question.category}`);

    const textLine = document.createElement("div");
    textLine.className = "question__text";
    renderSelectableText(textLine, question.question?.text ?? "");

    head.appendChild(idLine);
    head.appendChild(textLine);

    const translation = showTranslation ? getQuestionTranslation(question) : null;
    if (translation) {
      const tr = document.createElement("div");
      tr.className = "question__translation";
      tr.textContent = translation;
      head.appendChild(tr);
    }

    if (question.question?.image) {
      const img = document.createElement("img");
      img.className = "question__image";
      img.loading = "lazy";
      img.alt = question._id;
      img.src = question.question.image;
      img.addEventListener("error", () => {
        img.remove();
        toast(t("imageMissing"));
      });
      head.appendChild(img);
    }

    card.appendChild(head);

    const optionsWrap = document.createElement("div");
    optionsWrap.className = "options";

    const labels = ["1", "2", "3", "4"];
    question.options.forEach((optText, idx) => {
      const item = document.createElement("div");
      item.className = "option";
      item.setAttribute("role", "button");
      item.tabIndex = disableOptions ? -1 : 0;
      if (disableOptions) {
        item.classList.add("is-disabled");
        item.setAttribute("aria-disabled", "true");
      }

      if (showOnlyCorrect && idx !== question.answerIndex) {
        optText = "------";
      } else if (showOnlyCorrect && idx === question.answerIndex) {
        item.classList.add("option--correct");
      }

      if (mode === "test" && typeof chosenIndex === "number" && idx === chosenIndex) {
        item.classList.add("option--chosen");
      }

      if (showFeedback && feedback && typeof feedback.chosenIndex === "number") {
        const isChosen = feedback.chosenIndex === idx;
        const isCorrect = question.answerIndex === idx;
        if (revealCorrectness) {
          if (isCorrect) item.classList.add("option--correct");
          else if (isChosen && !feedback.isCorrect) item.classList.add("option--wrong");
        }
      }

      const top = document.createElement("div");
      top.className = "option__top";

      const badge = document.createElement("div");
      badge.className = "option__badge";
      setText(badge, labels[idx]);

      const text = document.createElement("div");
      text.className = "option__text";
      renderSelectableText(text, optText);

      top.appendChild(badge);
      top.appendChild(text);
      item.appendChild(top);

      const optTr = showTranslation ? getOptionTranslation(question, idx) : null;
      const shouldShowOptTranslation = !!optTr && (!showOnlyCorrect || idx === question.answerIndex);
      if (shouldShowOptTranslation) {
        const tr = document.createElement("div");
        tr.className = "option__translation";
        tr.textContent = optTr;
        item.appendChild(tr);
      }

      const activate = () => {
        if (disableOptions) return;
        onChoose?.(idx);
      };
      item.addEventListener("click", activate);
      item.addEventListener("keydown", (ev) => {
        if (disableOptions) return;
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          activate();
        }
      });
      optionsWrap.appendChild(item);
    });

    card.appendChild(optionsWrap);
    return card;
  }

  function renderHome() {
    setActiveNav("home");
    setTopbar(t("home"), "");
    setTimerVisible(false);
    setFooterVisible(false);
    setProgress(0, 0);

    els.main.innerHTML = "";

    const grid = document.createElement("div");
    grid.className = "grid grid--2";

    const intro = document.createElement("div");
    intro.className = "card";
    intro.innerHTML = `
      <div class="card__title">${t("introTitle")}</div>
      <div class="muted">${t("introText")}</div>
      <div class="row" style="margin-top:12px">
        <button class="btn btn--primary" type="button" data-go="mode/train">${t("training")}</button>
        <button class="btn" type="button" data-go="mode/memorization">${t("memorization")}</button>
        <button class="btn" type="button" data-go="mode/test">${t("test")}</button>
      </div>
    `;

    const testInfo = document.createElement("div");
    testInfo.className = "card";
    testInfo.innerHTML = `
      <div class="card__title">${t("testRulesTitle")}</div>
      <div class="muted">${t("testRulesText")}</div>
      <div class="muted" style="margin-top:10px">${t("testComposition")}</div>
    `;

    grid.appendChild(intro);
    grid.appendChild(testInfo);
    els.main.appendChild(grid);

    els.main.querySelectorAll("[data-go]").forEach((b) => {
      b.addEventListener("click", () => setRoute(b.getAttribute("data-go")));
    });

    setFooterButtons({
      backDisabled: true,
      nextDisabled: true,
    });
  }

  function setFooterButtons(opts) {
    const { backDisabled, nextDisabled, homeDisabled } = opts;
    els.backBtn.disabled = !!backDisabled;
    els.nextBtn.disabled = !!nextDisabled;
    els.homeBtn.disabled = !!homeDisabled;
  }

  function setFooterVisible(visible) {
    if (!els.pageFooter) return;
    els.pageFooter.hidden = !visible;
  }

  function renderMemorization() {
    setActiveNav("mode/memorization");
    ensureSessionForMode("memorization");
    const session = state.activeSession;
    const qid = session.orderIds[session.index];
    const q = getQuestionById(qid);
    if (!q) return;

    setTopbar(t("memorization"), `${q._id} • ${q.category}`);
    setTimerVisible(false);
    setFooterVisible(true);
    setProgress(session.index + 1, session.orderIds.length);

    const showTranslation = state.lang !== "de";

    els.main.innerHTML = "";
    els.main.appendChild(
      renderQuestionCard(q, {
        mode: "memorization",
        showOnlyCorrect: true,
        onChoose: null,
        chosenIndex: null,
        revealCorrectness: false,
        disableOptions: true,
        showTranslation,
        showFeedback: false,
        feedback: null,
      }),
    );

    setFooterButtons({
      backDisabled: session.index <= 0,
      nextDisabled: session.index >= session.orderIds.length - 1,
      homeDisabled: false,
    });
  }

  function renderTraining() {
    setActiveNav("mode/train");
    ensureSessionForMode("train");
    const session = state.activeSession;
    const qid = session.currentQuestionId;
    const q = getQuestionById(qid);
    if (!q) return;

    setTopbar(t("training"), `${q._id} • ${q.category}`);
    setTimerVisible(false);
    setFooterVisible(true);
    setProgress(session.answeredCount ?? 0, "∞");

    const showTranslation = state.lang !== "de";

    const feedback = session.currentAttempt ?? null;
    const locked = !!feedback;

    els.main.innerHTML = "";
    els.main.appendChild(
      renderQuestionCard(q, {
        mode: "train",
        showOnlyCorrect: false,
        revealCorrectness: true,
        disableOptions: locked,
        showTranslation,
        showFeedback: !!feedback,
        feedback,
        onChoose: (idx) => {
          const isCorrect = idx === q.answerIndex;
          statsBump(q._id, isCorrect);
          // update training credits for this session
          const currentCredits = getTrainCredits(session, qid);
          const nextCredits = Math.max(0, currentCredits + (isCorrect ? -1 : 2));
          setTrainCredits(session, qid, nextCredits);
          bumpTrainSessionStats(session, qid, isCorrect);
          session.answeredCount = (session.answeredCount ?? 0) + 1;
          session.currentAttempt = { chosenIndex: idx, isCorrect, at: new Date().toISOString() };
          saveSession("train", session);
          renderTraining();
        },
      }),
    );

    setFooterButtons({
      backDisabled: !Array.isArray(session.history) || session.history.length === 0,
      nextDisabled: false,
      homeDisabled: false,
    });
  }

  function renderTest() {
    setActiveNav("mode/test");
    const session = ensureSessionForMode("test");

    const qid = session.questionIds[session.index];
    const q = getQuestionById(qid);
    if (!q) return;

    setTopbar(t("test"), `${state.selectedState} • ${q._id}`);
    setTimerVisible(true);
    setFooterVisible(true);

    stopTestTicker();
    updateTestTimerUI(session);
    state.testTicker = window.setInterval(() => {
      const current = loadSession("test");
      if (!current || current.finished) return;
      updateTestTimerUI(current);
    }, 1000);

    const answeredCount = Object.keys(session.answers ?? {}).length;
    setProgress(answeredCount, APP.testTotal);

    const showTranslation = state.lang !== "de";

    els.main.innerHTML = "";
    const card = renderQuestionCard(q, {
      mode: "test",
      showOnlyCorrect: false,
      revealCorrectness: false,
      disableOptions: !!session.finished,
      showTranslation,
      showFeedback: false,
      feedback: null,
      chosenIndex: typeof session.answers[qid] === "number" ? session.answers[qid] : null,
      onChoose: (idx) => {
        const updated = loadSession("test");
        if (!updated || updated.finished) return;
        updated.answers[qid] = idx;
        if (!updated.skipped) updated.skipped = {};
        updated.skipped[qid] = false;
        saveSession("test", updated);
        renderTest();
      },
    });

    const actions = document.createElement("div");
    actions.className = "card";
    actions.innerHTML = `
      <div class="row">
        <div class="muted">${t("answered")}: <span class="mono">${answeredCount}/${APP.testTotal}</span></div>
        <div style="flex:1"></div>
        <button class="btn btn--primary" type="button" id="finishTestBtn">${t("finishTest")}</button>
      </div>
    `;
    actions.querySelector("#finishTestBtn").addEventListener("click", () => finishTest(false));

    els.main.appendChild(card);
    els.main.appendChild(actions);

    setFooterButtons({
      backDisabled: session.index <= 0,
      nextDisabled: session.index >= session.questionIds.length - 1,
      homeDisabled: false,
    });
  }

  function finishTest(auto) {
    stopTestTicker();
    const session = loadSession("test");
    if (!session || session.finished) {
      renderTestResults();
      return;
    }

    const finalize = () => {
      const s = loadSession("test");
      if (!s || s.finished) return;
      let correct = 0;
      s.questionIds.forEach((qid) => {
        const q = getQuestionById(qid);
        const chosen = s.answers?.[qid];
        const isCorrect = typeof chosen === "number" && q && chosen === q.answerIndex;
        if (isCorrect) correct += 1;
      });
      const wrong = APP.testTotal - correct;
      s.finished = true;
      s.finishedAtMs = Date.now();
      s.score = { correct, wrong };
      saveSession("test", s);

      // bump stats only once, at the end
      s.questionIds.forEach((qid) => {
        const q = getQuestionById(qid);
        const chosen = s.answers?.[qid];
        if (typeof chosen !== "number") {
          statsBumpSkip(qid);
          return;
        }
        const isCorrect = q && chosen === q.answerIndex;
        statsBump(qid, !!isCorrect);
      });

      renderTestResults();
    };

    if (auto) {
      finalize();
      return;
    }

    confirmDialog(t("finishTestConfirm"), finalize);
  }

  function renderTestResults() {
    setActiveNav("mode/test");
    const s = loadSession("test");
    setTimerVisible(false);
    setFooterVisible(true);
    els.main.innerHTML = "";

    const title = document.createElement("div");
    title.className = "card";
    const score = s?.score ?? { correct: 0, wrong: 0 };
    const passed = score.correct >= 17;
    const pct = Math.round((score.correct / APP.testTotal) * 100);
    const passLabel = passed ? t("pass") : t("fail");
    title.innerHTML = `
      <div class="card__title">${t("testFinished")}</div>
      <div class="row" style="margin-top:8px">
        <div class="pill"><span class="pill__label">${t("correct")}</span><span class="pill__value mono">${score.correct}</span></div>
        <div class="pill"><span class="pill__label">${t("wrong")}</span><span class="pill__value mono">${score.wrong}</span></div>
        <div class="pill"><span class="pill__label">${t("accuracy")}</span><span class="pill__value mono">${pct}%</span></div>
      </div>
      <div class="muted" style="margin-top:10px">${passLabel} (${passed ? ">=17" : "<17"})</div>
      <div class="row" style="margin-top:12px">
        <button class="btn btn--primary" type="button" id="newTestBtn">${t("newTest")}</button>
        <button class="btn" type="button" id="goStatsBtn">${t("statistics")}</button>
      </div>
    `;
    title.querySelector("#newTestBtn").addEventListener("click", () => {
      confirmDialog(t("newTest"), () => {
        clearSession("test");
        setRoute("mode/test");
      });
    });
    title.querySelector("#goStatsBtn").addEventListener("click", () => setRoute("stats"));

    els.main.appendChild(title);
    setTopbar(t("test"), s?.state ? `${s.state}` : "");
    setProgress(0, 0);

    setFooterButtons({
      backDisabled: true,
      nextDisabled: true,
      homeDisabled: false,
    });
  }

  function getStatsRows() {
    const all = statsReadAll();
    const rows = [];
    getPracticeQuestions().forEach((q) => {
      const stat = all[q._id];
      if (!stat) return;
      const total = (stat.correct ?? 0) + (stat.wrong ?? 0);
      const acc = accuracyOf(stat);
      rows.push({
        id: q._id,
        category: q.category,
        correct: stat.correct ?? 0,
        wrong: stat.wrong ?? 0,
        skipped: stat.skipped ?? 0,
        attempts: total,
        accuracy: acc ?? 0,
      });
    });
    return rows;
  }

  function renderReview() {
    setActiveNav("mode/review");
    setTopbar(t("review"), "");
    setTimerVisible(false);
    setFooterVisible(true);
    setProgress(0, 0);

    const rows = getStatsRows();
    if (!rows.length) {
      els.main.innerHTML = `<div class="card"><div class="card__title">${t("review")}</div><div class="muted">${t(
        "noStatsYet",
      )}</div></div>`;
      setFooterButtons({ backDisabled: true, nextDisabled: true, homeDisabled: false });
      return;
    }

    rows.sort((a, b) => b.wrong - a.wrong || a.accuracy - b.accuracy);
    const top = rows.slice(0, 30);

    els.main.innerHTML = "";
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<div class="card__title">${t("review")}</div><div class="muted">${t(
      "mostWrong",
    )}</div>`;

    const table = document.createElement("table");
    table.className = "table";
    table.innerHTML = `
      <thead>
        <tr>
          <th>${t("question")}</th>
          <th>${t("attempts")}</th>
          <th>${t("wrong")}</th>
          <th>${t("accuracy")}</th>
          <th></th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    const tbody = table.querySelector("tbody");
    top.forEach((r) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><span class="mono">${r.id}</span><div class="muted" style="margin-top:4px">${r.category}</div></td>
        <td class="mono">${r.attempts}</td>
        <td class="mono">${r.wrong}</td>
        <td class="mono">${Math.round(r.accuracy * 100)}%</td>
        <td><button class="btn btn--primary" type="button" data-open="${r.id}">${t("openInTraining")}</button></td>
      `;
      tbody.appendChild(tr);
    });

    card.appendChild(table);
    els.main.appendChild(card);

    els.main.querySelectorAll("[data-open]").forEach((b) => {
      b.addEventListener("click", () => {
        const id = b.getAttribute("data-open");
        const trainSession = ensureSessionForMode("train");
        const idx = trainSession.orderIds.indexOf(id);
        if (idx >= 0) {
          trainSession.index = idx;
          saveSession("train", trainSession);
        }
        setRoute("mode/train");
      });
    });

    setFooterButtons({ backDisabled: true, nextDisabled: true, homeDisabled: false });
  }

  function renderStats() {
    setActiveNav("stats");
    setTopbar(t("statistics"), "");
    setTimerVisible(false);
    setFooterVisible(true);
    setProgress(0, 0);

    const rows = getStatsRows();
    if (!rows.length) {
      els.main.innerHTML = `<div class="card"><div class="card__title">${t("statistics")}</div><div class="muted">${t(
        "noStatsYet",
      )}</div></div>`;
      setFooterButtons({ backDisabled: true, nextDisabled: true, homeDisabled: false });
      return;
    }

    const sort = readJSON(key("stats.sort"), "mostWrong");
    const sortRows = (which) => {
      if (which === "mostCorrect") return rows.sort((a, b) => b.correct - a.correct);
      if (which === "mostSkipped") return rows.sort((a, b) => b.skipped - a.skipped);
      if (which === "bestAccuracy") return rows.sort((a, b) => b.accuracy - a.accuracy);
      if (which === "worstAccuracy") return rows.sort((a, b) => a.accuracy - b.accuracy);
      return rows.sort((a, b) => b.wrong - a.wrong);
    };
    sortRows(sort);

    els.main.innerHTML = "";
    const card = document.createElement("div");
    card.className = "card";

    const sortSelectId = "statsSort";
    card.innerHTML = `
      <div class="row">
        <div class="card__title">${t("statistics")}</div>
        <div style="flex:1"></div>
        <label class="field" style="min-width:240px;margin:0" for="${sortSelectId}">
          <span class="field__label">${t("sortBy")}</span>
          <select class="field__control" id="${sortSelectId}">
            <option value="mostWrong">${t("mostWrong")}</option>
            <option value="mostCorrect">${t("mostCorrect")}</option>
            <option value="mostSkipped">${t("mostSkipped")}</option>
            <option value="bestAccuracy">${t("bestAccuracy")}</option>
            <option value="worstAccuracy">${t("worstAccuracy")}</option>
          </select>
        </label>
      </div>
    `;

    const table = document.createElement("table");
    table.className = "table";
    table.innerHTML = `
      <thead>
        <tr>
          <th>${t("question")}</th>
          <th>${t("attempts")}</th>
          <th>${t("correct")}</th>
          <th>${t("wrong")}</th>
          <th>${t("skipped")}</th>
          <th>${t("accuracy")}</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    const tbody = table.querySelector("tbody");
    rows.forEach((r) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><span class="mono">${r.id}</span><div class="muted" style="margin-top:4px">${r.category}</div></td>
        <td class="mono">${r.attempts}</td>
        <td class="mono">${r.correct}</td>
        <td class="mono">${r.wrong}</td>
        <td class="mono">${r.skipped}</td>
        <td class="mono">${Math.round(r.accuracy * 100)}%</td>
      `;
      tbody.appendChild(tr);
    });
    card.appendChild(table);
    els.main.appendChild(card);

    const sel = card.querySelector(`#${sortSelectId}`);
    sel.value = sort;
    sel.addEventListener("change", () => {
      writeJSON(key("stats.sort"), sel.value);
      renderStats();
    });

    setFooterButtons({ backDisabled: true, nextDisabled: true, homeDisabled: false });
  }

  function renderDictionary() {
    setActiveNav("dictionary");
    setTopbar(t("myDictionary"), "");
    setTimerVisible(false);
    setFooterVisible(true);
    setProgress(0, 0);

    const all = myDictReadAll();
    const words = Object.keys(all).sort((a, b) => a.localeCompare(b, "de"));

    els.main.innerHTML = "";
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<div class="card__title">${t("myDictionary")}</div>`;

    if (!words.length) {
      const empty = document.createElement("div");
      empty.className = "muted";
      empty.textContent = t("emptyDictionary");
      card.appendChild(empty);
      els.main.appendChild(card);
      setFooterButtons({ backDisabled: true, nextDisabled: true, homeDisabled: false });
      return;
    }

    const actions = document.createElement("div");
    actions.className = "grid";
    actions.innerHTML = `
      <div class="card" style="box-shadow:none">
        <div class="row">
          <button class="btn btn--primary" type="button" id="exportDictBtn">${t("export")}</button>
          <button class="btn" type="button" id="importDictBtn">${t("import")}</button>
        </div>
        <div class="stack" id="importBox" hidden style="margin-top:10px">
          <textarea class="textarea" id="importTextarea" rows="6" placeholder="${t("importPlaceholder")}"></textarea>
          <div class="row row--right">
            <button class="btn btn--ghost" type="button" id="importCancelBtn">${t("cancel")}</button>
            <button class="btn btn--primary" type="button" id="importOkBtn">${t("import")}</button>
          </div>
        </div>
      </div>
    `;

    card.appendChild(actions);

    const table = document.createElement("table");
    table.className = "table";
    table.innerHTML = `
      <thead>
        <tr>
          <th>${t("word")}</th>
          <th>${t("myNote")}</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    const tbody = table.querySelector("tbody");
    words.forEach((w) => {
      const display = all[w]?.word ?? w;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><button class="btn btn--ghost" type="button" data-word="${w}">${display}</button></td>
        <td class="muted">${(all[w]?.note ?? "").replaceAll("<", "&lt;").replaceAll(">", "&gt;")}</td>
      `;
      tbody.appendChild(tr);
    });
    card.appendChild(table);
    els.main.appendChild(card);

    const importBox = card.querySelector("#importBox");
    card.querySelector("#exportDictBtn").addEventListener("click", async () => {
      const payload = JSON.stringify(all, null, 2);
      await navigator.clipboard?.writeText(payload).catch(() => {});
      toast(t("copiedToClipboard"));
    });
    card.querySelector("#importDictBtn").addEventListener("click", () => {
      importBox.hidden = false;
      card.querySelector("#importTextarea").focus();
    });
    card.querySelector("#importCancelBtn").addEventListener("click", () => {
      importBox.hidden = true;
      card.querySelector("#importTextarea").value = "";
    });
    card.querySelector("#importOkBtn").addEventListener("click", () => {
      try {
        const raw = card.querySelector("#importTextarea").value;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object") throw new Error("bad");
        myDictWriteAll(parsed);
        toast(t("importDone"));
        renderDictionary();
      } catch (err) {
        toast(t("invalidJson"));
      }
    });

    card.querySelectorAll("[data-word]").forEach((b) => {
      b.addEventListener("click", () => openWordModal(b.getAttribute("data-word")));
    });

    setFooterButtons({ backDisabled: true, nextDisabled: true, homeDisabled: false });
  }

  function openWordModal(wordRaw) {
    const word = normalizeWord(wordRaw);
    const canon = canonicalWordKey(wordRaw);
    if (!word || !canon) return;
    state.currentWord = canon;

    setText(els.wordModalTitle, `${t("word")}: ${word}`);
    setText(els.wordModalSubtitle, state.lang === "de" ? "DE → EN/PT" : `${state.lang.toUpperCase()} (UI)`);
    setText(els.wordBaseTitle, t("baseDictionary"));
    setText(els.wordPersonalTitle, t("myNote"));
    els.wordNoteInput.placeholder =
      state.lang === "pt"
        ? "Ex.: lembrete pessoal, mnemônico, associação…"
        : state.lang === "en"
          ? "E.g., your mnemonic / note…"
          : "z.B. Merkhilfe / Notiz…";

    const base = findBaseDictionaryEntry(word);
    els.wordBaseContent.innerHTML = "";
    if (!base) {
      const p = document.createElement("div");
      p.className = "muted";
      p.textContent = t("notInBaseDictionary");
      els.wordBaseContent.appendChild(p);
    } else {
      const block = (langKey, label) => {
        const entry = base.entry?.[langKey];
        const wrap = document.createElement("div");
        wrap.className = "card";
        wrap.style.boxShadow = "none";
        wrap.innerHTML = `<div class="card__title">${label}</div>`;
        if (!entry) {
          const p = document.createElement("div");
          p.className = "muted";
          p.textContent = t("notInBaseDictionary");
          wrap.appendChild(p);
          return wrap;
        }
        const desc = document.createElement("div");
        desc.className = "muted";
        const descText = String(entry.description ?? "").trim();
        desc.textContent = descText ? descText : t("noDefinition");
        wrap.appendChild(desc);
        if (Array.isArray(entry.phrases) && entry.phrases.length) {
          const ul = document.createElement("div");
          ul.className = "stack";
          ul.style.marginTop = "10px";
          const highlightTarget =
            langKey === "de"
              ? word
              : String(entry.description ?? "").trim();
          entry.phrases.slice(0, 3).forEach((ph) => {
            const item = document.createElement("div");
            item.innerHTML = `• ${highlightWord(ph, highlightTarget)}`;
            ul.appendChild(item);
          });
          wrap.appendChild(ul);
        }
        return wrap;
      };

      els.wordBaseContent.appendChild(block("de", "DE"));
      els.wordBaseContent.appendChild(block("en", "EN"));
      els.wordBaseContent.appendChild(block("pt", "PT (Brasil)"));
    }

    const myAll = myDictReadAll();
    const existing = myAll[canon] ?? null;
    els.wordNoteInput.value = existing?.note ?? "";
    els.removeWordBtn.disabled = !existing;

    openModal("wordModal");
    els.wordNoteInput.focus();
  }

  function saveCurrentWordNote() {
    const wordKey = state.currentWord;
    if (!wordKey) return;
    const all = myDictReadAll();
    all[wordKey] = {
      word: all[wordKey]?.word ?? wordKey,
      note: els.wordNoteInput.value ?? "",
      updatedAt: new Date().toISOString(),
    };
    myDictWriteAll(all);
    toast(t("save"));
    els.removeWordBtn.disabled = false;
  }

  function removeCurrentWord() {
    const wordKey = state.currentWord;
    if (!wordKey) return;
    const all = myDictReadAll();
    if (!all[wordKey]) return;
    delete all[wordKey];
    myDictWriteAll(all);
    els.wordNoteInput.value = "";
    els.removeWordBtn.disabled = true;
    toast(t("remove"));
  }

  function onRouteChange() {
    const route = getRouteFromHash();
    state.route = route;
    closeSidebar();
    if (route !== "mode/test") stopTestTicker();

    if (route === "home") return renderHome();
    if (route === "mode/memorization") return renderMemorization();
    if (route === "mode/train") return renderTraining();
    if (route === "mode/test") {
      const s = loadSession("test");
      if (s?.finished) return renderTestResults();
      return renderTest();
    }
    if (route === "mode/review") return renderReview();
    if (route === "stats") return renderStats();
    if (route === "dictionary") return renderDictionary();

    return renderHome();
  }

  function syncStaticUITexts() {
    setText(els.brandSubtitle, "Self-learning");
    setText(els.navHome, t("home"));
    setText(els.navSectionModes, t("modes"));
    setText(els.navMem, t("memorization"));
    setText(els.navTrain, t("training"));
    setText(els.navTest, t("test"));
    setText(els.navReview, t("review"));
    setText(els.navSectionTools, t("tools"));
    setText(els.navStats, t("statistics"));
    setText(els.navDict, t("myDictionary"));
    setText(els.navSectionSettings, t("settings"));
    setText(els.languageLabel, t("language"));
    setText(els.stateLabel, t("stateForTest"));
    setText(els.resetBtn, t("resetLocalData"));
    setText(els.timerLabel, t("timer"));
    setText(els.progressLabel, t("progress"));
    setText(els.backBtn, t("back"));
    setText(els.homeBtn, t("home"));
    setText(els.nextBtn, t("next"));
    setText(els.wordBaseTitle, t("baseDictionary"));
    setText(els.wordPersonalTitle, t("myNote"));
    setText(els.saveWordBtn, t("save"));
    setText(els.removeWordBtn, t("remove"));
    setText(els.confirmTitle, t("confirm"));
    setText(els.confirmCancelBtn, t("cancel"));
    setText(els.confirmOkBtn, t("ok"));

    document.documentElement.lang = state.lang === "pt" ? "pt-BR" : state.lang;
  }

  function initStatesSelect() {
    const states = [...new Set(state.questions.map((q) => q.category))]
      .filter((c) => c && c !== "GERMANY")
      .sort((a, b) => a.localeCompare(b, "de"));
    els.stateSelect.innerHTML = "";
    states.forEach((s) => {
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s;
      els.stateSelect.appendChild(opt);
    });
    if (!states.includes(state.selectedState)) state.selectedState = states[0] ?? APP.defaultState;
    els.stateSelect.value = state.selectedState;
  }

  function initEvents() {
    els.sidebarOpenBtn.addEventListener("click", toggleSidebar);
    els.sidebarCloseBtn.addEventListener("click", closeSidebar);
    els.overlay.addEventListener("click", closeSidebar);

    document.querySelectorAll(".nav__item[data-route]").forEach((b) => {
      b.addEventListener("click", () => {
        const route = b.getAttribute("data-route");
        // Always close, even if route is already active (hashchange won't fire)
        closeSidebar();
        if (route === state.route) return;
        setRoute(route);
      });
    });

    els.languageSelect.addEventListener("change", () => {
      state.lang = els.languageSelect.value;
      writeJSON(key("lang"), state.lang);
      syncStaticUITexts();
      onRouteChange();
    });

    els.stateSelect.addEventListener("change", () => {
      state.selectedState = els.stateSelect.value;
      writeJSON(key("selectedState"), state.selectedState);
      clearSession("test");
      clearSession("memorization");
      clearSession("train");
      if (state.route === "mode/test") onRouteChange();
      if (state.route === "mode/memorization" || state.route === "mode/train" || state.route === "mode/review" || state.route === "stats") {
        onRouteChange();
      }
    });

    els.resetBtn.addEventListener("click", () => {
      confirmDialog(t("resetConfirm"), () => {
        Object.keys(localStorage)
          .filter((k) => k.startsWith(APP.prefix))
          .forEach((k) => localStorage.removeItem(k));
        stopTestTicker();
        state.lang = APP.defaultLang;
        state.selectedState = APP.defaultState;
        els.languageSelect.value = state.lang;
        initStatesSelect();
        syncStaticUITexts();
        toast(t("dataResetDone"));
        setRoute("home");
      });
    });

    els.backBtn.addEventListener("click", () => {
      const r = state.route;
      if (r === "mode/memorization") {
        const s = ensureSessionForMode("memorization");
        if (s.index > 0) {
          s.index -= 1;
          saveSession("memorization", s);
        }
        return onRouteChange();
      }
      if (r === "mode/train") {
        const s = ensureSessionForMode("train");
        if (Array.isArray(s.history) && s.history.length) {
          const prev = s.history.pop();
          if (prev) {
            s.currentQuestionId = prev;
            s.currentAttempt = null;
            saveSession("train", s);
          }
        }
        return onRouteChange();
      }
      if (r === "mode/test") {
        const s = loadSession("test");
        if (s && s.index > 0) {
          s.index -= 1;
          saveSession("test", s);
        }
        return onRouteChange();
      }
      setRoute("home");
    });

    els.homeBtn.addEventListener("click", () => setRoute("home"));

    els.nextBtn.addEventListener("click", () => {
      const r = state.route;
      if (r === "mode/memorization") {
        const s = ensureSessionForMode("memorization");
        if (s.index < s.orderIds.length - 1) {
          s.index += 1;
          saveSession("memorization", s);
        }
        return onRouteChange();
      }
      if (r === "mode/train") {
        const s = ensureSessionForMode("train");
        if (s.currentQuestionId && !s.currentAttempt) {
          statsBumpSkip(s.currentQuestionId);
        }
        if (!Array.isArray(s.history)) s.history = [];
        if (s.currentQuestionId) s.history.push(s.currentQuestionId);
        const nextId = pickNextTrainingQuestionId(s, Date.now());
        s.currentQuestionId = nextId;
        s.currentAttempt = null;
        if (nextId) markTrainingShown(s, nextId, Date.now());
        saveSession("train", s);
        return onRouteChange();
      }
      if (r === "mode/test") {
        const s = loadSession("test");
        if (s) {
          const currentQid = s.questionIds?.[s.index];
          const hasAnswer = typeof s.answers?.[currentQid] === "number";
          if (!s.skipped) s.skipped = {};
          if (currentQid && !hasAnswer && !s.skipped[currentQid]) {
            statsBumpSkip(currentQid);
            s.skipped[currentQid] = true;
          }
        }
        if (s && s.index < s.questionIds.length - 1) {
          s.index += 1;
          saveSession("test", s);
        }
        return onRouteChange();
      }
      setRoute("home");
    });

    document.addEventListener("click", (ev) => {
      const target = ev.target;
      if (!(target instanceof HTMLElement)) return;
      const modalId = target.getAttribute("data-close-modal");
      if (modalId) closeModal(modalId);
    });

    els.saveWordBtn.addEventListener("click", saveCurrentWordNote);
    els.removeWordBtn.addEventListener("click", removeCurrentWord);

    document.addEventListener("click", (ev) => {
      const target = ev.target;
      if (!(target instanceof HTMLElement)) return;
      const w = target.closest?.(".word");
      if (w && w instanceof HTMLElement) {
        ev.preventDefault();
        ev.stopPropagation();
        openWordModal(w.dataset.word);
      }
    });

    window.addEventListener("hashchange", onRouteChange);
    // keep sidebar state consistent when switching between mobile/desktop breakpoints
    const mq = window.matchMedia("(max-width: 980px)");
    const onMqChange = () => syncSidebarForViewport();
    if (typeof mq.addEventListener === "function") mq.addEventListener("change", onMqChange);
    else if (typeof mq.addListener === "function") mq.addListener(onMqChange);
    window.addEventListener("resize", onMqChange);
    window.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") {
        closeSidebar();
        closeModal("wordModal");
        closeModal("confirmModal");
      }
    });
  }

  async function loadData() {
    setText(els.main, t("loading"));
    try {
      const [qRes, dRes] = await Promise.all([fetch("assets/questions.json"), fetch("assets/dictionary.json")]);
      if (!qRes.ok) throw new Error("questions");
      const questions = await qRes.json();
      state.questions = questions;
      state.questionsById = new Map(questions.map((q) => [q._id, q]));

      if (dRes.ok) {
        state.baseDictionary = await dRes.json();
      } else {
        state.baseDictionary = {};
      }
    } catch (err) {
      console.error(err);
      els.main.innerHTML = `<div class="card"><div class="card__title">${t("loadFailed")}</div></div>`;
    }
  }

  async function init() {
    Object.assign(els, {
      sidebar: document.getElementById("sidebar"),
      overlay: document.getElementById("overlay"),
      main: document.getElementById("main"),
      sidebarOpenBtn: document.getElementById("sidebarOpenBtn"),
      sidebarCloseBtn: document.getElementById("sidebarCloseBtn"),
      brandSubtitle: document.getElementById("brandSubtitle"),
      routeTitle: document.getElementById("routeTitle"),
      routeMeta: document.getElementById("routeMeta"),
      timerPill: document.getElementById("timerPill"),
      timerLabel: document.getElementById("timerLabel"),
      timerValue: document.getElementById("timerValue"),
      progressLabel: document.getElementById("progressLabel"),
      progressValue: document.getElementById("progressValue"),
      languageSelect: document.getElementById("languageSelect"),
      stateSelect: document.getElementById("stateSelect"),
      resetBtn: document.getElementById("resetBtn"),
      backBtn: document.getElementById("backBtn"),
      homeBtn: document.getElementById("homeBtn"),
      nextBtn: document.getElementById("nextBtn"),
      pageFooter: document.getElementById("pageFooter"),
      toast: document.getElementById("toast"),
      navHome: document.getElementById("navHome"),
      navSectionModes: document.getElementById("navSectionModes"),
      navMem: document.getElementById("navMem"),
      navTrain: document.getElementById("navTrain"),
      navTest: document.getElementById("navTest"),
      navReview: document.getElementById("navReview"),
      navSectionTools: document.getElementById("navSectionTools"),
      navStats: document.getElementById("navStats"),
      navDict: document.getElementById("navDict"),
      navSectionSettings: document.getElementById("navSectionSettings"),
      languageLabel: document.getElementById("languageLabel"),
      stateLabel: document.getElementById("stateLabel"),
      wordModalTitle: document.getElementById("wordModalTitle"),
      wordModalSubtitle: document.getElementById("wordModalSubtitle"),
      wordBaseTitle: document.getElementById("wordBaseTitle"),
      wordBaseContent: document.getElementById("wordBaseContent"),
      wordPersonalTitle: document.getElementById("wordPersonalTitle"),
      wordNoteInput: document.getElementById("wordNoteInput"),
      saveWordBtn: document.getElementById("saveWordBtn"),
      removeWordBtn: document.getElementById("removeWordBtn"),
      confirmTitle: document.getElementById("confirmTitle"),
      confirmText: document.getElementById("confirmText"),
      confirmCancelBtn: document.getElementById("confirmCancelBtn"),
      confirmOkBtn: document.getElementById("confirmOkBtn"),
    });

    state.lang = readJSON(key("lang"), APP.defaultLang);
    state.selectedState = readJSON(key("selectedState"), APP.defaultState);
    els.languageSelect.value = state.lang;
    syncStaticUITexts();

    await loadData();
    initStatesSelect();
    // Ensure modals are not visible on load (helps even with cached CSS)
    closeModal("wordModal");
    closeModal("confirmModal");
    syncSidebarForViewport();
    // migrate personal dictionary keys to canonical lowercase (case-insensitive)
    try {
      const all = myDictReadAll();
      const migrated = {};
      let changed = false;
      Object.keys(all).forEach((k) => {
        const canon = canonicalWordKey(k);
        if (!canon) return;
        const v = all[k] ?? {};
        migrated[canon] = {
          word: v.word ?? k,
          note: v.note ?? "",
          updatedAt: v.updatedAt ?? null,
        };
        if (canon !== k) changed = true;
      });
      if (changed) myDictWriteAll(migrated);
    } catch (err) {
      // ignore
    }
    initEvents();

    setRoute(getRouteFromHash());
    onRouteChange();
  }

  init();
})();
