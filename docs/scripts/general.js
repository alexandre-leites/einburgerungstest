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
      memorizationRandom: "Zufällige Reihenfolge",
      memorizationOrdered: "Geordnet (nach ID)",
      goToId: "Zu ID springen",
      go: "Los",
      resetToFirst: "Zur ersten Frage",
      training: "Training",
      test: "Test",
      review: "Wiederholen",
      tools: "Tools",
      statistics: "Statistiken",
      myDictionary: "Mein Wörterbuch",
      settings: "Einstellungen",
      language: "Sprache",
      stateForTest: "Bundesland (für Test)",
      resetData: "Daten zurücksetzen",
      resetDataTitle: "Daten zurücksetzen",
      resetDataSubtitle: "Wähle aus, was gelöscht werden soll.",
      resetStats: "Statistiken",
      resetSessions: "Sitzungen",
      resetMyDictionary: "Mein Wörterbuch",
      resetOther: "Andere lokale Einstellungen",
      resetLanguage: "Sprache",
      resetState: "Bundesland",
      resetDone: "Ausgewählte Daten gelöscht.",
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
      homeWhatYouGetTitle: "Was du hier bekommst",
      homeWhatYouGetText:
        "Sprachen (DE/EN/PT), Wort-Menü (Definition/Beispiele oder ins Wörterbuch), persönliche Statistiken (richtig/falsch/übersprungen) und mehrere Lernmodi.",
      homeModesTitle: "Modi",
      homeModeMemTitle: "Memorieren",
      homeModeMemText: "Nur die richtige Antwort wird angezeigt (Position bleibt gleich).",
      homeModeTrainTitle: "Training",
      homeModeTrainText: "Mit Feedback (grün/rot) und Wiederholungen: schwere Fragen kommen öfter zurück.",
      homeModeTestTitle: "Test",
      homeModeTestText: "33 Fragen (30 Deutschland + 3 Bundesland), 60 Minuten, Ergebnis erst am Ende.",
      homeModeReviewTitle: "Wiederholen",
      homeModeReviewText: "Zeigt dir die Fragen, die du am häufigsten falsch machst oder überspringst.",
      startMode: "Iniciar",
      hideTip: "Nicht mehr anzeigen",
      tipMemorizationTitle: "Memorieren",
      tipMemorizationText:
        "Du siehst nur die richtige Antwort. Die anderen Positionen werden als „------“ angezeigt, damit du dir die Position merkst.",
      tipTrainingTitle: "Training",
      tipTrainingText:
        "Tippe eine Option an, um sofort Feedback zu bekommen. In dieser Sitzung kommen Fragen, die du oft falsch beantwortest, häufiger zurück.",
      tipTestTitle: "Test",
      tipTestText:
        "33 Fragen in 60 Minuten. Ergebnis erst am Ende. Nicht beantwortete Fragen zählen als übersprungen.",
      tipReviewTitle: "Wiederholen",
      tipReviewText: "Hier siehst du deine schwierigsten Fragen (falsch und übersprungen) und kannst gezielt üben.",
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
      yourAnswer: "Deine Antwort",
      correctAnswer: "Richtige Antwort",
      result: "Ergebnis",
      testDetails: "Test-Details",
      questionReview: "Fragenübersicht",
      totalTests: "Gesamte Tests",
      averageScore: "Durchschnittliche Punktzahl",
      passRate: "Bestehensquote",
      testHistory: "Test-Verlauf",
      date: "Datum",
      score: "Punktzahl",
      mostWrong: "Meiste Fehler",
      mostCorrect: "Meiste Treffer",
      mostSkipped: "Meist übersprungen",
      bestAccuracy: "Beste Quote",
      worstAccuracy: "Schlechteste Quote",
      attempts: "Versuche",
      openInTraining: "Im Training öffnen",
      word: "Wort",
      baseDictionary: "Basis-Wörterbuch",
      viewDefinition: "Definition & Beispiele",
      addToMyDictionary: "Zum Wörterbuch hinzufügen",
      removeFromMyDictionary: "Aus Wörterbuch entfernen",
      addedToMyDictionary: "Zum Wörterbuch hinzugefügt.",
      removedFromMyDictionary: "Aus Wörterbuch entfernt.",
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
      memorizationRandom: "Random order",
      memorizationOrdered: "Ordered (by ID)",
      goToId: "Jump to ID",
      go: "Go",
      resetToFirst: "Reset to first",
      training: "Training",
      test: "Test",
      review: "Review",
      tools: "Tools",
      statistics: "Statistics",
      myDictionary: "My dictionary",
      settings: "Settings",
      language: "Language",
      stateForTest: "State (for test)",
      resetData: "Reset data",
      resetDataTitle: "Reset data",
      resetDataSubtitle: "Choose what you want to delete.",
      resetStats: "Statistics",
      resetSessions: "Sessions",
      resetMyDictionary: "My dictionary",
      resetOther: "Other local settings",
      resetLanguage: "Language",
      resetState: "State",
      resetDone: "Selected data cleared.",
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
      homeWhatYouGetTitle: "What you get",
      homeWhatYouGetText:
        "Languages (DE/EN/PT), word context menu (definition/examples or add to dictionary), personal stats (right/wrong/skipped) and multiple learning modes.",
      homeModesTitle: "Modes",
      homeModeMemTitle: "Memorization",
      homeModeMemText: "Shows only the correct answer (position stays the same).",
      homeModeTrainTitle: "Training",
      homeModeTrainText: "Instant feedback (green/red) and repetitions: harder questions come back more often.",
      homeModeTestTitle: "Test",
      homeModeTestText: "33 questions (30 Germany + 3 state), 60 minutes, result only at the end.",
      homeModeReviewTitle: "Review",
      homeModeReviewText: "Shows questions you most often get wrong or skip.",
      startMode: "Start",
      hideTip: "Don’t show again",
      tipMemorizationTitle: "Memorization",
      tipMemorizationText:
        "You only see the correct answer. Other positions show “------” so you can memorize the answer position.",
      tipTrainingTitle: "Training",
      tipTrainingText:
        "Tap an option to get instant feedback. In this session, questions you miss often come back more frequently.",
      tipTestTitle: "Test",
      tipTestText:
        "33 questions in 60 minutes. Result only at the end. Unanswered questions count as skipped.",
      tipReviewTitle: "Review",
      tipReviewText: "See your hardest questions (wrong and skipped) and practice them again.",
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
      yourAnswer: "Your answer",
      correctAnswer: "Correct answer",
      result: "Result",
      testDetails: "Test details",
      questionReview: "Question review",
      totalTests: "Total tests",
      averageScore: "Average score",
      passRate: "Pass rate",
      testHistory: "Test history",
      date: "Date",
      score: "Score",
      mostWrong: "Most wrong",
      mostCorrect: "Most correct",
      mostSkipped: "Most skipped",
      bestAccuracy: "Best accuracy",
      worstAccuracy: "Worst accuracy",
      attempts: "Attempts",
      openInTraining: "Open in training",
      word: "Word",
      baseDictionary: "Base dictionary",
      viewDefinition: "Definition & examples",
      addToMyDictionary: "Add to my dictionary",
      removeFromMyDictionary: "Remove from my dictionary",
      addedToMyDictionary: "Added to your dictionary.",
      removedFromMyDictionary: "Removed from your dictionary.",
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
      memorizationRandom: "Ordem aleatória",
      memorizationOrdered: "Ordem por ID",
      goToId: "Ir para ID",
      go: "Ir",
      resetToFirst: "Voltar para a primeira",
      training: "Treino",
      test: "Teste",
      review: "Revisão",
      tools: "Ferramentas",
      statistics: "Estatísticas",
      myDictionary: "Meu dicionário",
      settings: "Configurações",
      language: "Idioma",
      stateForTest: "Estado (para teste)",
      resetData: "Resetar dados",
      resetDataTitle: "Resetar dados",
      resetDataSubtitle: "Selecione o que você quer deletar.",
      resetStats: "Estatísticas",
      resetSessions: "Sessões",
      resetMyDictionary: "Meu dicionário",
      resetOther: "Outras configurações locais",
      resetLanguage: "Idioma",
      resetState: "Estado",
      resetDone: "Dados selecionados apagados.",
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
      homeWhatYouGetTitle: "O que você tem aqui",
      homeWhatYouGetText:
        "Idiomas (DE/EN/PT), menu de palavra (definição/exemplos ou adicionar ao dicionário), estatísticas pessoais (acertos/erros/puladas) e vários modos de estudo.",
      homeModesTitle: "Modos",
      homeModeMemTitle: "Memorização",
      homeModeMemText: "Mostra apenas a resposta correta (a posição continua a mesma).",
      homeModeTrainTitle: "Treino",
      homeModeTrainText: "Feedback imediato (verde/vermelho) e repetições: as mais difíceis voltam mais.",
      homeModeTestTitle: "Teste",
      homeModeTestText: "33 questões (30 Alemanha + 3 estado), 60 minutos, resultado só no final.",
      homeModeReviewTitle: "Revisão",
      homeModeReviewText: "Mostra as questões que você mais erra ou mais pula.",
      startMode: "Iniciar",
      hideTip: "Não mostrar novamente",
      tipMemorizationTitle: "Memorização",
      tipMemorizationText:
        "Você vê apenas a resposta correta. As outras posições aparecem como “------” para memorizar a posição da resposta.",
      tipTrainingTitle: "Treino",
      tipTrainingText:
        "Toque em uma alternativa para ver o feedback na hora. Nesta sessão, as questões que você erra mais voltam com mais frequência.",
      tipTestTitle: "Teste",
      tipTestText:
        "33 questões em 60 minutos. Resultado só no final. Questões não respondidas contam como puladas.",
      tipReviewTitle: "Revisão",
      tipReviewText: "Veja as questões mais difíceis (erradas e puladas) e pratique novamente.",
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
      yourAnswer: "Sua resposta",
      correctAnswer: "Resposta correta",
      result: "Resultado",
      testDetails: "Detalhes do teste",
      questionReview: "Revisão das questões",
      totalTests: "Total de testes",
      averageScore: "Pontuação média",
      passRate: "Taxa de aprovação",
      testHistory: "Histórico de testes",
      date: "Data",
      score: "Pontuação",
      mostWrong: "Mais erradas",
      mostCorrect: "Mais acertadas",
      mostSkipped: "Mais puladas",
      bestAccuracy: "Melhor precisão",
      worstAccuracy: "Pior precisão",
      attempts: "Tentativas",
      openInTraining: "Abrir no treino",
      word: "Palavra",
      baseDictionary: "Dicionário base",
      viewDefinition: "Definição e exemplos",
      addToMyDictionary: "Adicionar ao meu dicionário",
      removeFromMyDictionary: "Remover do meu dicionário",
      addedToMyDictionary: "Adicionado ao seu dicionário.",
      removedFromMyDictionary: "Removido do seu dicionário.",
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
    baseDictionary: {}, // entries only (lemma -> {de,en,pt})
    baseDictionaryAliases: {}, // form -> lemma
    baseDictionaryIndex: new Map(), // canonical form -> lemma
    lang: APP.defaultLang,
    selectedState: APP.defaultState,
    route: "home",
    activeSession: null, // {mode, orderIds, index, ...}
    testTicker: null,
    currentWord: null,
    currentWordDisplay: null,
    ignoreNextWordClick: false,
    wordLongPressTimer: null,
    prevRoute: null,
    memOrderedShouldReset: false,
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
    if (!el) return;
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
    const lemma = state.baseDictionaryIndex.get(canon) ?? canon;
    const entry = state.baseDictionary[lemma];
    if (!entry) return null;
    return { key: lemma, entry };
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

  function myDictHas(wordKey) {
    const all = myDictReadAll();
    return !!all[wordKey];
  }

  function myDictAdd(wordKey, display) {
    const all = myDictReadAll();
    all[wordKey] = {
      word: display ?? wordKey,
      addedAt: all[wordKey]?.addedAt ?? new Date().toISOString(),
    };
    myDictWriteAll(all);
  }

  function myDictRemove(wordKey) {
    const all = myDictReadAll();
    if (!all[wordKey]) return;
    delete all[wordKey];
    myDictWriteAll(all);
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
      const exact = btn.getAttribute("data-route") === route;
      const prefix = btn.getAttribute("data-route-prefix");
      const isActive = exact || (prefix && route.startsWith(prefix));
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

  function getOrderedPracticeQuestionIds() {
    const ids = getPracticeQuestionIds();
    const parseId = (id) => {
      const parts = String(id).split("-");
      const n = Number(parts[1]);
      return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY;
    };
    return [...ids].sort((a, b) => parseId(a) - parseId(b) || a.localeCompare(b));
  }

  function getMemorizationQuestions() {
    return state.questions.filter((q) => q.category === "GERMANY" || q.category === state.selectedState);
  }

  function getMemorizationQuestionIds() {
    return getMemorizationQuestions().map((q) => q._id);
  }

  function getOrderedMemorizationQuestionIds() {
    const ids = getMemorizationQuestionIds();
    const parseId = (id) => {
      const parts = String(id).split("-");
      const n = Number(parts[1]);
      return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY;
    };
    return [...ids].sort((a, b) => parseId(a) - parseId(b) || a.localeCompare(b));
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

  function ensureMemorizationSession(orderMode) {
    const modeKey = orderMode === "ordered" ? "memorization.ordered" : "memorization.random";
    let session = loadSession(modeKey);
    if (!session || session.version !== APP.version) session = null;
    const orderIds = orderMode === "ordered" ? getOrderedMemorizationQuestionIds() : null;
    if (!session || !Array.isArray(session.orderIds) || session.state !== state.selectedState || session.orderMode !== orderMode) {
      session = {
        version: APP.version,
        mode: "memorization",
        state: state.selectedState,
        orderMode,
        orderIds: orderMode === "ordered" ? orderIds : shuffle(getMemorizationQuestionIds()),
        index: 0,
        createdAtMs: Date.now(),
      };
      saveSession(modeKey, session);
    } else {
      // refresh pool (ordered) but keep progress within bounds; random keeps its existing orderIds
      if (orderMode === "ordered") session.orderIds = orderIds;
      if (session.index >= session.orderIds.length) session.index = Math.max(0, session.orderIds.length - 1);
      saveSession(modeKey, session);
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
    grid.className = "grid";

    const intro = document.createElement("div");
    intro.className = "card";
    intro.innerHTML = `
      <div class="card__title">${t("introTitle")}</div>
      <div class="muted">${t("introText")}</div>
    `;

    const info = document.createElement("div");
    info.className = "card";
    info.innerHTML = `
      <div class="card__title">${t("homeWhatYouGetTitle")}</div>
      <div class="muted">${t("homeWhatYouGetText")}</div>
      <div class="card__title" style="margin-top:14px">${t("homeModesTitle")}</div>
      <div class="stack">
        <div><strong>${t("homeModeMemTitle")}</strong><div class="muted">${t("homeModeMemText")}</div></div>
        <div><strong>${t("homeModeTrainTitle")}</strong><div class="muted">${t("homeModeTrainText")}</div></div>
        <div><strong>${t("homeModeTestTitle")}</strong><div class="muted">${t("homeModeTestText")}</div></div>
        <div><strong>${t("homeModeReviewTitle")}</strong><div class="muted">${t("homeModeReviewText")}</div></div>
      </div>
      <div class="card__title" style="margin-top:14px">${t("testRulesTitle")}</div>
      <div class="muted">${t("testRulesText")}</div>
      <div class="muted" style="margin-top:10px">${t("testComposition")}</div>
    `;

    grid.appendChild(intro);
    grid.appendChild(info);
    els.main.appendChild(grid);

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

  function tipStorageKey(id) {
    return key(`ui.dismissTip.${id}`);
  }

  function isTipDismissed(id) {
    return !!readJSON(tipStorageKey(id), false);
  }

  function dismissTip(id) {
    writeJSON(tipStorageKey(id), true);
  }

  function renderTip(id, title, text) {
    if (isTipDismissed(id)) return null;
    const card = document.createElement("div");
    card.className = "card";
    card.style.boxShadow = "none";
    const header = document.createElement("div");
    header.className = "row";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "flex-start";
    header.style.gap = "12px";

    const left = document.createElement("div");
    const tEl = document.createElement("div");
    tEl.className = "card__title";
    tEl.textContent = title;
    const bEl = document.createElement("div");
    bEl.className = "muted";
    bEl.textContent = text;
    left.appendChild(tEl);
    left.appendChild(bEl);

    const close = document.createElement("button");
    close.type = "button";
    close.className = "btn btn--ghost";
    close.textContent = t("hideTip");
    close.addEventListener("click", () => {
      dismissTip(id);
      card.remove();
    });

    header.appendChild(left);
    header.appendChild(close);
    card.appendChild(header);
    return card;
  }

  function renderMemorization() {
    const orderMode = state.route === "mode/memorization/ordered" ? "ordered" : "random";
    setActiveNav(state.route);
    const session = ensureMemorizationSession(orderMode);
    if (orderMode === "ordered" && state.memOrderedShouldReset) {
      session.index = 0;
      saveSession("memorization.ordered", session);
      state.memOrderedShouldReset = false;
    }
    const qid = session.orderIds[session.index];
    const q = getQuestionById(qid);
    if (!q) return;

    const label = orderMode === "ordered" ? t("memorizationOrdered") : t("memorizationRandom");
    setTopbar(`${t("memorization")} • ${label}`, `${q._id} • ${q.category}`);
    setTimerVisible(false);
    setFooterVisible(true);
    setProgress(session.index + 1, session.orderIds.length);

    const showTranslation = state.lang !== "de";

    els.main.innerHTML = "";
    const tip = renderTip("memorization", t("tipMemorizationTitle"), t("tipMemorizationText"));
    if (tip) els.main.appendChild(tip);

    if (orderMode === "ordered") {
      const controls = document.createElement("div");
      controls.className = "card";
      controls.style.boxShadow = "none";
      controls.innerHTML = `
        <div class="row">
          <label class="field" style="min-width:220px;margin:0" for="memGoToIdInput">
            <span class="field__label">${t("goToId")}</span>
            <input class="field__control" id="memGoToIdInput" placeholder="1" />
          </label>
          <button class="btn btn--primary" type="button" id="memGoToIdBtn">${t("go")}</button>
          <button class="btn" type="button" id="memResetBtn">${t("resetToFirst")}</button>
        </div>
      `;
      els.main.appendChild(controls);

      const parseTarget = (raw) => {
        const s = String(raw ?? "").trim();
        if (!s) return null;
        const m = s.match(/frage-(\d+)/i) ?? s.match(/^(\d+)$/);
        if (!m) return null;
        return `frage-${Number(m[1])}`;
      };
      controls.querySelector("#memGoToIdBtn").addEventListener("click", () => {
        const target = parseTarget(controls.querySelector("#memGoToIdInput").value);
        if (!target) return;
        const idx = session.orderIds.indexOf(target);
        if (idx < 0) return;
        session.index = idx;
        saveSession("memorization.ordered", session);
        renderMemorization();
      });
      controls.querySelector("#memResetBtn").addEventListener("click", () => {
        session.index = 0;
        saveSession("memorization.ordered", session);
        renderMemorization();
      });
      controls.querySelector("#memGoToIdInput").addEventListener("keydown", (ev) => {
        if (ev.key !== "Enter") return;
        controls.querySelector("#memGoToIdBtn").click();
      });
    }

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
    const tip = renderTip("training", t("tipTrainingTitle"), t("tipTrainingText"));
    if (tip) els.main.appendChild(tip);
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
    const tip = renderTip("test", t("tipTestTitle"), t("tipTestText"));
    if (tip) els.main.appendChild(tip);
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

  function saveTestHistory(testSession) {
    const history = readJSON(key("testHistory"), []);
    const testRecord = {
      timestamp: testSession.finishedAtMs || Date.now(),
      state: testSession.state,
      score: testSession.score,
      passed: (testSession.score?.correct ?? 0) >= 17,
      questionIds: testSession.questionIds,
      answers: testSession.answers,
    };
    history.push(testRecord);
    // Keep last 50 tests only
    if (history.length > 50) history.shift();
    writeJSON(key("testHistory"), history);
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

      // Save test to history
      saveTestHistory(s);

      renderTestResults();
    };

    if (auto) {
      finalize();
      return;
    }

    confirmDialog(t("finishTestConfirm"), finalize);
  }

  function renderTestHistoryView() {
    setActiveNav("stats");
    const testRecord = readJSON(key("viewingTestHistory"), null);
    
    if (!testRecord) {
      setRoute("stats");
      return;
    }
    
    setTimerVisible(false);
    setFooterVisible(true);
    els.main.innerHTML = "";
    
    const date = new Date(testRecord.timestamp);
    const dateStr = date.toLocaleDateString(state.lang === "de" ? "de-DE" : state.lang === "pt" ? "pt-BR" : "en-US");
    const timeStr = date.toLocaleTimeString(state.lang === "de" ? "de-DE" : state.lang === "pt" ? "pt-BR" : "en-US", { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
    
    const score = testRecord.score?.correct ?? 0;
    const wrong = testRecord.score?.wrong ?? 0;
    const pct = Math.round((score / APP.testTotal) * 100);
    const passed = testRecord.passed;
    
    setTopbar(t("testDetails"), `${dateStr} ${timeStr}`);
    setProgress(0, 0);
    
    // Use EXACTLY the same structure as renderTestResults()
    const title = document.createElement("div");
    title.className = "card";
    const passLabel = passed ? t("pass") : t("fail");
    const resultBadgeStyle = passed 
      ? "background:#10b981;color:#fff;padding:10px 20px;border-radius:8px;font-weight:600;font-size:1.2em;display:inline-block" 
      : "background:#ef4444;color:#fff;padding:10px 20px;border-radius:8px;font-weight:600;font-size:1.2em;display:inline-block";
    
    title.innerHTML = `
      <div style="text-align:center">
        <div class="card__title">${t("testFinished")}</div>
        <div style="margin-top:14px">
          <span style="${resultBadgeStyle}">
            ${passed ? "✓" : "✗"} ${passLabel}
          </span>
        </div>
        <div class="row" style="margin-top:14px;justify-content:center">
          <div class="pill"><span class="pill__label">${t("correct")}</span><span class="pill__value mono">${score}</span></div>
          <div class="pill"><span class="pill__label">${t("wrong")}</span><span class="pill__value mono">${wrong}</span></div>
          <div class="pill"><span class="pill__label">${t("accuracy")}</span><span class="pill__value mono">${pct}%</span></div>
        </div>
        <div class="row" style="margin-top:14px;justify-content:center">
          <button class="btn" type="button" id="backToStatsBtn">${t("statistics")}</button>
        </div>
      </div>
    `;
    title.querySelector("#backToStatsBtn").addEventListener("click", () => setRoute("stats"));
    
    els.main.appendChild(title);
    
    // Add detailed question review table - SAME as renderTestResults()
    if (testRecord.questionIds && testRecord.questionIds.length > 0) {
      const reviewCard = document.createElement("div");
      reviewCard.className = "card";
      reviewCard.innerHTML = `<div class="card__title">${t("questionReview")}</div>`;
      
      const table = document.createElement("table");
      table.className = "table";
      table.innerHTML = `
        <thead>
          <tr>
            <th>${t("question")}</th>
            <th>${t("yourAnswer")}</th>
            <th>${t("correctAnswer")}</th>
            <th>${t("result")}</th>
          </tr>
        </thead>
        <tbody></tbody>
      `;
      
      const tbody = table.querySelector("tbody");
      
      // Get answer text: always show German, with translation below if needed
      const getAnswerTextWithTranslation = (q, optionIndex) => {
        const germanText = q.options[optionIndex];
        let html = germanText;
        
        if (state.lang !== "de") {
          let translation = "";
          if (state.lang === "en" && q.options_en?.[optionIndex]) {
            translation = q.options_en[optionIndex];
          } else if (state.lang === "pt" && q.options_pt?.[optionIndex]) {
            translation = q.options_pt[optionIndex];
          }
          
          if (translation && translation !== germanText) {
            html += `<div class="muted" style="margin-top:4px;font-size:0.9em">${translation}</div>`;
          }
        }
        
        return `<div style="max-width:400px">${html}</div>`;
      };
      
      testRecord.questionIds.forEach((qid) => {
        const q = getQuestionById(qid);
        if (!q) return;
        
        const questionNumber = qid.split("-")[1] || qid;
        const chosen = testRecord.answers?.[qid];
        const isCorrect = typeof chosen === "number" && chosen === q.answerIndex;
        const wasSkipped = typeof chosen !== "number";
        
        const yourAnswerText = wasSkipped 
          ? `<span class="muted">—</span>` 
          : getAnswerTextWithTranslation(q, chosen);
        
        const correctAnswerText = getAnswerTextWithTranslation(q, q.answerIndex);
        
        let resultBadge = "";
        if (wasSkipped) {
          resultBadge = `<span class="muted">${t("skipped")}</span>`;
        } else if (isCorrect) {
          resultBadge = `<span style="color:#10b981">✓ ${t("correct")}</span>`;
        } else {
          resultBadge = `<span style="color:#ef4444">✗ ${t("wrong")}</span>`;
        }
        
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>
            <button class="btn btn--ghost" style="padding:4px 8px" type="button" data-view-history-question="${qid}" data-chosen="${chosen ?? ''}">
              <span class="mono">${questionNumber}</span>
            </button>
            <div class="muted" style="margin-top:4px">${q.category}</div>
          </td>
          <td>${yourAnswerText}</td>
          <td>${correctAnswerText}</td>
          <td>${resultBadge}</td>
        `;
        tbody.appendChild(tr);
      });
      
      reviewCard.appendChild(table);
      
      // Add click event listeners to question buttons in THIS card
      reviewCard.querySelectorAll("[data-view-history-question]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const qid = btn.getAttribute("data-view-history-question");
          const chosenStr = btn.getAttribute("data-chosen");
          const chosen = chosenStr === "" ? undefined : parseInt(chosenStr, 10);
          const question = getQuestionById(qid);
          openQuestionReviewModal(question, chosen);
        });
      });
      
      els.main.appendChild(reviewCard);
    }
    
    setFooterButtons({
      backDisabled: false,
      nextDisabled: true,
      homeDisabled: false,
    });
  }

  function openQuestionReviewModal(question, chosenIndex) {
    if (!question) {
      console.error("openQuestionReviewModal: question is null");
      return;
    }
    
    // Remove existing modal if any
    const existing = document.getElementById("questionReviewModal");
    if (existing) existing.remove();
    
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.style.display = "grid";
    modal.id = "questionReviewModal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    
    const wasSkipped = typeof chosenIndex !== "number";
    const isCorrect = !wasSkipped && chosenIndex === question.answerIndex;
    
    const showTranslation = state.lang !== "de";
    
    // Build question display
    const questionNumber = question._id.split("-")[1] || question._id;
    
    // Create modal structure
    const backdrop = document.createElement("div");
    backdrop.className = "modal__backdrop";
    
    const panel = document.createElement("div");
    panel.className = "modal__panel";
    panel.style.maxWidth = "800px";
    
    const header = document.createElement("div");
    header.className = "modal__header";
    header.innerHTML = `
      <div>
        <div class="modal__title">${t("question")} ${questionNumber}</div>
        <div class="modal__subtitle">${question.category}</div>
      </div>
      <button class="icon-btn" type="button" data-close-modal="questionReviewModal" aria-label="Close">✕</button>
    `;
    
    const content = document.createElement("div");
    content.className = "modal__content";
    
    const card = document.createElement("div");
    card.className = "card";
    
    // Question text
    const questionTextDiv = document.createElement("div");
    questionTextDiv.className = "question__text";
    questionTextDiv.textContent = question.question?.text ?? "";
    
    if (showTranslation) {
      const translation = getQuestionTranslation(question);
      if (translation) {
        const trDiv = document.createElement("div");
        trDiv.className = "muted";
        trDiv.style.marginTop = "8px";
        trDiv.textContent = translation;
        questionTextDiv.appendChild(trDiv);
      }
    }
    
    card.appendChild(questionTextDiv);
    
    // Image if exists
    if (question.question?.image) {
      const img = document.createElement("img");
      img.className = "question__image";
      img.src = question.question.image;
      img.alt = question._id;
      img.loading = "lazy";
      img.style.marginTop = "12px";
      img.style.maxWidth = "100%";
      img.style.borderRadius = "8px";
      card.appendChild(img);
    }
    
    // Options
    const optionsDiv = document.createElement("div");
    optionsDiv.className = "options";
    optionsDiv.style.marginTop = "16px";
    
    const labels = ["1", "2", "3", "4"];
    question.options.forEach((optText, idx) => {
      const isChosen = !wasSkipped && chosenIndex === idx;
      const isCorrectOption = idx === question.answerIndex;
      
      const optionDiv = document.createElement("div");
      optionDiv.className = "option is-disabled";
      optionDiv.setAttribute("aria-disabled", "true");
      
      if (isCorrectOption) {
        optionDiv.classList.add("option--correct");
      } else if (isChosen && !isCorrect) {
        optionDiv.classList.add("option--wrong");
      }
      
      const topDiv = document.createElement("div");
      topDiv.className = "option__top";
      
      const badge = document.createElement("div");
      badge.className = "option__badge";
      badge.textContent = labels[idx];
      
      const text = document.createElement("div");
      text.className = "option__text";
      text.textContent = optText;
      
      if (showTranslation) {
        const optTr = getOptionTranslation(question, idx);
        if (optTr && optTr !== optText) {
          const trDiv = document.createElement("div");
          trDiv.className = "muted";
          trDiv.style.marginTop = "4px";
          trDiv.style.fontSize = "0.9em";
          trDiv.textContent = optTr;
          text.appendChild(trDiv);
        }
      }
      
      topDiv.appendChild(badge);
      topDiv.appendChild(text);
      optionDiv.appendChild(topDiv);
      optionsDiv.appendChild(optionDiv);
    });
    
    card.appendChild(optionsDiv);
    content.appendChild(card);
    panel.appendChild(header);
    panel.appendChild(content);
    modal.appendChild(backdrop);
    modal.appendChild(panel);
    
    document.body.appendChild(modal);
    
    // Add close event listeners
    backdrop.addEventListener("click", () => modal.remove());
    header.querySelector("[data-close-modal]").addEventListener("click", () => modal.remove());
    
    // Close on Escape key
    const escHandler = (ev) => {
      if (ev.key === "Escape") {
        modal.remove();
        document.removeEventListener("keydown", escHandler);
      }
    };
    document.addEventListener("keydown", escHandler);
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
    const resultBadgeStyle = passed 
      ? "background:#10b981;color:#fff;padding:10px 20px;border-radius:8px;font-weight:600;font-size:1.2em;display:inline-block" 
      : "background:#ef4444;color:#fff;padding:10px 20px;border-radius:8px;font-weight:600;font-size:1.2em;display:inline-block";
    
    title.innerHTML = `
      <div style="text-align:center">
        <div class="card__title">${t("testFinished")}</div>
        <div style="margin-top:14px">
          <span style="${resultBadgeStyle}">
            ${passed ? "✓" : "✗"} ${passLabel}
          </span>
        </div>
        <div class="row" style="margin-top:14px;justify-content:center">
          <div class="pill"><span class="pill__label">${t("correct")}</span><span class="pill__value mono">${score.correct}</span></div>
          <div class="pill"><span class="pill__label">${t("wrong")}</span><span class="pill__value mono">${score.wrong}</span></div>
          <div class="pill"><span class="pill__label">${t("accuracy")}</span><span class="pill__value mono">${pct}%</span></div>
        </div>
        <div class="row" style="margin-top:14px;justify-content:center">
          <button class="btn btn--primary" type="button" id="newTestBtn">${t("newTest")}</button>
          <button class="btn" type="button" id="goStatsBtn">${t("statistics")}</button>
        </div>
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

    // Add detailed question review table
    if (s && s.questionIds && s.questionIds.length > 0) {
      const reviewCard = document.createElement("div");
      reviewCard.className = "card";
      reviewCard.innerHTML = `<div class="card__title">${t("questionReview")}</div>`;

      const table = document.createElement("table");
      table.className = "table";
      table.innerHTML = `
        <thead>
          <tr>
            <th>${t("question")}</th>
            <th>${t("yourAnswer")}</th>
            <th>${t("correctAnswer")}</th>
            <th>${t("result")}</th>
          </tr>
        </thead>
        <tbody></tbody>
      `;

      const tbody = table.querySelector("tbody");
      s.questionIds.forEach((qid) => {
        const q = getQuestionById(qid);
        if (!q) return;

        const chosen = s.answers?.[qid];
        const isCorrect = typeof chosen === "number" && chosen === q.answerIndex;
        const wasSkipped = typeof chosen !== "number";

        // Extract question number from ID (frage-200 -> 200)
        const questionNumber = qid.split("-")[1] || qid;

        // Get answer text: always show German, with translation below if needed
        const getAnswerTextWithTranslation = (optionIndex) => {
          const germanText = q.options[optionIndex];
          let html = germanText;
          
          if (state.lang !== "de") {
            let translation = "";
            if (state.lang === "en" && q.options_en?.[optionIndex]) {
              translation = q.options_en[optionIndex];
            } else if (state.lang === "pt" && q.options_pt?.[optionIndex]) {
              translation = q.options_pt[optionIndex];
            }
            
            if (translation && translation !== germanText) {
              html += `<div class="muted" style="margin-top:4px;font-size:0.9em">${translation}</div>`;
            }
          }
          
          return `<div style="max-width:400px">${html}</div>`;
        };

        const yourAnswerText = wasSkipped 
          ? `<span class="muted">—</span>` 
          : getAnswerTextWithTranslation(chosen);
        
        const correctAnswerText = getAnswerTextWithTranslation(q.answerIndex);
        
        let resultBadge = "";
        if (wasSkipped) {
          resultBadge = `<span class="muted">${t("skipped")}</span>`;
        } else if (isCorrect) {
          resultBadge = `<span style="color:#10b981">✓ ${t("correct")}</span>`;
        } else {
          resultBadge = `<span style="color:#ef4444">✗ ${t("wrong")}</span>`;
        }

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>
            <button class="btn btn--ghost" style="padding:4px 8px" type="button" data-view-question="${qid}">
              <span class="mono">${questionNumber}</span>
            </button>
            <div class="muted" style="margin-top:4px">${q.category}</div>
          </td>
          <td>${yourAnswerText}</td>
          <td>${correctAnswerText}</td>
          <td>${resultBadge}</td>
        `;
        tbody.appendChild(tr);
      });

      reviewCard.appendChild(table);
      
      // Add click event listeners to view question buttons in THIS card
      reviewCard.querySelectorAll("[data-view-question]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const qid = btn.getAttribute("data-view-question");
          const question = getQuestionById(qid);
          const chosen = s.answers?.[qid];
          openQuestionReviewModal(question, chosen);
        });
      });
      
      els.main.appendChild(reviewCard);
    }

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
    // Get ALL questions (not just current state)
    state.questions.forEach((q) => {
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

  function getTestHistoryStats() {
    const history = readJSON(key("testHistory"), []);
    if (!history.length) return null;

    const totalTests = history.length;
    const totalCorrect = history.reduce((sum, test) => sum + (test.score?.correct ?? 0), 0);
    const passedTests = history.filter(test => test.passed).length;
    
    return {
      totalTests,
      averageScore: totalTests > 0 ? (totalCorrect / totalTests).toFixed(1) : 0,
      passRate: totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0,
      history: history.slice().reverse(), // Most recent first
    };
  }

  function renderReview() {
    setActiveNav("mode/review");
    setTopbar(t("review"), "");
    setTimerVisible(false);
    setFooterVisible(true);
    setProgress(0, 0);

    const rows = getStatsRows();
    if (!rows.length) {
      els.main.innerHTML = "";
      const tip = renderTip("review", t("tipReviewTitle"), t("tipReviewText"));
      if (tip) els.main.appendChild(tip);
      els.main.innerHTML += `<div class="card"><div class="card__title">${t("review")}</div><div class="muted">${t(
        "noStatsYet",
      )}</div></div>`;
      setFooterButtons({ backDisabled: true, nextDisabled: true, homeDisabled: false });
      return;
    }

    rows.sort((a, b) => b.wrong - a.wrong || a.accuracy - b.accuracy);
    const top = rows.slice(0, 30);

    els.main.innerHTML = "";
    const tip = renderTip("review", t("tipReviewTitle"), t("tipReviewText"));
    if (tip) els.main.appendChild(tip);
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
      // Extract question number from ID (frage-200 -> 200)
      const questionNumber = r.id.split("-")[1] || r.id;
      
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><span class="mono">${questionNumber}</span><div class="muted" style="margin-top:4px">${r.category}</div></td>
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

    els.main.innerHTML = "";

    // Show test history statistics first
    const testStats = getTestHistoryStats();
    if (testStats) {
      const summaryCard = document.createElement("div");
      summaryCard.className = "card";
      summaryCard.innerHTML = `
        <div class="card__title">${t("testHistory")}</div>
        <div class="row" style="margin-top:8px">
          <div class="pill"><span class="pill__label">${t("totalTests")}</span><span class="pill__value mono">${testStats.totalTests}</span></div>
          <div class="pill"><span class="pill__label">${t("averageScore")}</span><span class="pill__value mono">${testStats.averageScore}/${APP.testTotal}</span></div>
          <div class="pill"><span class="pill__label">${t("passRate")}</span><span class="pill__value mono">${testStats.passRate}%</span></div>
        </div>
      `;

      // Add recent tests table
      if (testStats.history.length > 0) {
        const historyTable = document.createElement("table");
        historyTable.className = "table";
        historyTable.style.marginTop = "14px";
        historyTable.innerHTML = `
          <thead>
            <tr>
              <th>${t("date")}</th>
              <th>${t("score")}</th>
              <th>${t("accuracy")}</th>
              <th>${t("result")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody></tbody>
        `;

        const historyTbody = historyTable.querySelector("tbody");
        testStats.history.slice(0, 10).forEach((test, idx) => {
          const date = new Date(test.timestamp);
          const dateStr = date.toLocaleDateString(state.lang === "de" ? "de-DE" : state.lang === "pt" ? "pt-BR" : "en-US");
          const timeStr = date.toLocaleTimeString(state.lang === "de" ? "de-DE" : state.lang === "pt" ? "pt-BR" : "en-US", { 
            hour: "2-digit", 
            minute: "2-digit" 
          });
          const score = test.score?.correct ?? 0;
          const wrong = test.score?.wrong ?? 0;
          const pct = Math.round((score / APP.testTotal) * 100);
          const resultBadge = test.passed 
            ? `<span style="color:#10b981">✓ ${t("pass")}</span>`
            : `<span style="color:#ef4444">✗ ${t("fail")}</span>`;

          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td><span class="mono">${dateStr}</span><div class="muted" style="margin-top:4px">${timeStr}</div></td>
            <td class="mono">${score}/${APP.testTotal}</td>
            <td class="mono">${pct}%</td>
            <td>${resultBadge}</td>
            <td><button class="btn btn--ghost" type="button" data-view-test="${idx}">👁️</button></td>
          `;
          historyTbody.appendChild(tr);
        });

        summaryCard.appendChild(historyTable);
        
        // Add click event listeners to view test buttons
        summaryCard.querySelectorAll("[data-view-test]").forEach((btn) => {
          btn.addEventListener("click", () => {
            const testIndex = parseInt(btn.getAttribute("data-view-test"), 10);
            const test = testStats.history[testIndex];
            // Save to temporary storage and navigate to view
            writeJSON(key("viewingTestHistory"), test);
            setRoute("test-history-view");
          });
        });
      }

      els.main.appendChild(summaryCard);
    }

    // Show per-question statistics
    const rows = getStatsRows();
    if (!rows.length) {
      const noStatsCard = document.createElement("div");
      noStatsCard.className = "card";
      noStatsCard.innerHTML = `<div class="card__title">${t("statistics")}</div><div class="muted">${t("noStatsYet")}</div>`;
      els.main.appendChild(noStatsCard);
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

    const card = document.createElement("div");
    card.className = "card";

    const sortSelectId = "statsSort";
    card.innerHTML = `
      <div class="row">
        <div class="card__title">${t("statistics")} • ${t("question")}</div>
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
      // Extract question number from ID (frage-200 -> 200)
      const questionNumber = r.id.split("-")[1] || r.id;
      
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><span class="mono">${questionNumber}</span><div class="muted" style="margin-top:4px">${r.category}</div></td>
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
          <th class="mono">Added</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    const tbody = table.querySelector("tbody");
    words.forEach((w) => {
      const display = all[w]?.word ?? w;
      const addedAt = all[w]?.addedAt ?? "";
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><button class="btn btn--ghost" type="button" data-word="${w}">${display}</button></td>
        <td class="mono muted">${String(addedAt).slice(0, 19).replace("T", " ")}</td>
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
        // accept both old schema (with note) and new schema
        const migrated = {};
        Object.keys(parsed).forEach((k) => {
          const canon = canonicalWordKey(k);
          if (!canon) return;
          const v = parsed[k] ?? {};
          migrated[canon] = {
            word: v.word ?? k,
            addedAt: v.addedAt ?? v.updatedAt ?? v.createdAt ?? new Date().toISOString(),
          };
        });
        myDictWriteAll(migrated);
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

  function isTouchPrimary() {
    // Prefer pointer/hover media queries over maxTouchPoints (which can be >0 on some desktops)
    try {
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const noHover = window.matchMedia("(hover: none)").matches;
      if (coarse && noHover) return true;
    } catch (err) {
      // ignore
    }
    return (navigator.maxTouchPoints ?? 0) > 0;
  }

  function closeWordContextMenu() {
    if (!els.wordContextMenu) return;
    els.wordContextMenu.hidden = true;
  }

  function positionContextMenu(x, y) {
    const menu = els.wordContextMenu;
    if (!menu) return;
    menu.style.left = "0px";
    menu.style.top = "0px";
    menu.hidden = false;
    const rect = menu.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width - 8;
    const maxY = window.innerHeight - rect.height - 8;
    const px = Math.max(8, Math.min(x, maxX));
    const py = Math.max(8, Math.min(y, maxY));
    menu.style.left = `${px}px`;
    menu.style.top = `${py}px`;
  }

  function openWordContextMenu(wordRaw, point) {
    const display = normalizeWord(wordRaw);
    const canon = canonicalWordKey(wordRaw);
    if (!display || !canon) return;
    const resolved = findBaseDictionaryEntry(display);
    state.currentWord = resolved?.key ?? canon; // store lemma as key when possible
    state.currentWordDisplay = display;

    setText(els.wordCtxViewBtn, t("viewDefinition"));
    const saved = myDictHas(state.currentWord);
    setText(els.wordCtxToggleBtn, saved ? t("removeFromMyDictionary") : t("addToMyDictionary"));

    positionContextMenu(point.x, point.y);
  }

  function openWordModal(wordRaw) {
    const word = normalizeWord(wordRaw);
    const canon = canonicalWordKey(wordRaw);
    if (!word || !canon) return;
    const resolved = findBaseDictionaryEntry(word);
    state.currentWord = resolved?.key ?? canon; // lemma when possible
    state.currentWordDisplay = word;

    const titleSuffix = resolved && resolved.key !== canon ? ` (${resolved.key})` : "";
    setText(els.wordModalTitle, `${t("word")}: ${word}${titleSuffix}`);
    setText(els.wordModalSubtitle, state.lang === "de" ? "DE → EN/PT" : `${state.lang.toUpperCase()} (UI)`);
    setText(els.wordBaseTitle, t("baseDictionary"));

    const base = resolved ?? findBaseDictionaryEntry(word);
    els.wordBaseContent.innerHTML = "";
    if (!base) {
      const p = document.createElement("div");
      p.className = "muted";
      p.textContent = t("notInBaseDictionary");
      els.wordBaseContent.appendChild(p);
    } else {
      const langs = [
        { key: "de", label: "DE" },
        { key: "en", label: "EN" },
        { key: "pt", label: "PT" },
      ];

      const defaultTab = state.lang === "pt" ? "pt" : state.lang === "en" ? "en" : "de";
      const tabIdPrefix = `wordTab-${Date.now()}`;

      const tabs = document.createElement("div");
      tabs.className = "tabs";
      tabs.setAttribute("role", "tablist");

      const panelsWrap = document.createElement("div");

      const setActive = (activeKey) => {
        langs.forEach((l) => {
          const btn = tabs.querySelector(`[data-tab="${l.key}"]`);
          const panel = panelsWrap.querySelector(`[data-panel="${l.key}"]`);
          if (!btn || !panel) return;
          const isActive = l.key === activeKey;
          btn.setAttribute("aria-selected", String(isActive));
          btn.tabIndex = isActive ? 0 : -1;
          panel.hidden = !isActive;
        });
      };

      const renderPanel = (langKey) => {
        const entry = base.entry?.[langKey];
        const panel = document.createElement("div");
        panel.className = "tab-panel";
        panel.dataset.panel = langKey;
        panel.setAttribute("role", "tabpanel");
        panel.id = `${tabIdPrefix}-panel-${langKey}`;
        panel.hidden = true;

        if (!entry) {
          const p = document.createElement("div");
          p.className = "muted";
          p.textContent = t("notInBaseDictionary");
          panel.appendChild(p);
          return panel;
        }

        const desc = document.createElement("div");
        desc.className = "muted";
        const descText = String(entry.description ?? "").trim();
        desc.textContent = descText ? descText : t("noDefinition");
        panel.appendChild(desc);

        if (Array.isArray(entry.phrases) && entry.phrases.length) {
          const ul = document.createElement("div");
          ul.className = "stack";
          const highlightTarget = langKey === "de" ? word : String(entry.description ?? "").trim();
          entry.phrases.slice(0, 6).forEach((ph) => {
            const item = document.createElement("div");
            item.innerHTML = `• ${highlightWord(ph, highlightTarget)}`;
            ul.appendChild(item);
          });
          panel.appendChild(ul);
        }
        return panel;
      };

      langs.forEach((l, idx) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "tab";
        btn.dataset.tab = l.key;
        btn.id = `${tabIdPrefix}-tab-${l.key}`;
        btn.setAttribute("role", "tab");
        btn.setAttribute("aria-controls", `${tabIdPrefix}-panel-${l.key}`);
        btn.setAttribute("aria-selected", "false");
        btn.tabIndex = -1;
        btn.textContent = l.label;
        btn.addEventListener("click", () => setActive(l.key));
        btn.addEventListener("keydown", (ev) => {
          if (ev.key !== "ArrowLeft" && ev.key !== "ArrowRight") return;
          ev.preventDefault();
          const next = ev.key === "ArrowRight" ? idx + 1 : idx - 1;
          const wrapped = (next + langs.length) % langs.length;
          const nextKey = langs[wrapped].key;
          setActive(nextKey);
          const nextBtn = tabs.querySelector(`[data-tab="${nextKey}"]`);
          nextBtn?.focus();
        });
        tabs.appendChild(btn);
        panelsWrap.appendChild(renderPanel(l.key));
      });

      els.wordBaseContent.appendChild(tabs);
      els.wordBaseContent.appendChild(panelsWrap);
      setActive(defaultTab);
    }

    openModal("wordModal");
  }

  function onRouteChange() {
    const route = getRouteFromHash();
    state.prevRoute = state.route;
    state.route = route;
    if (route === "mode/memorization/ordered" && state.prevRoute !== "mode/memorization/ordered") {
      state.memOrderedShouldReset = true;
    }
    closeSidebar();
    if (route !== "mode/test") stopTestTicker();

    if (route === "home") return renderHome();
    if (route === "mode/memorization/random") return renderMemorization();
    if (route === "mode/memorization/ordered") return renderMemorization();
    if (route === "mode/train") return renderTraining();
    if (route === "mode/test") {
      const s = loadSession("test");
      if (s?.finished) return renderTestResults();
      return renderTest();
    }
    if (route === "mode/review") return renderReview();
    if (route === "stats") return renderStats();
    if (route === "test-history-view") return renderTestHistoryView();
    if (route === "dictionary") return renderDictionary();

    return renderHome();
  }

  function syncStaticUITexts() {
    setText(els.brandSubtitle, "Self-learning");
    setText(els.navHome, t("home"));
    setText(els.navSectionModes, t("modes"));
    setText(els.navMemTitle, t("memorization"));
    setText(els.navMemRandom, t("memorizationRandom"));
    setText(els.navMemOrdered, t("memorizationOrdered"));
    setText(els.navTrain, t("training"));
    setText(els.navTest, t("test"));
    setText(els.navReview, t("review"));
    setText(els.navSectionTools, t("tools"));
    setText(els.navStats, t("statistics"));
    setText(els.navDict, t("myDictionary"));
    setText(els.navSectionSettings, t("settings"));
    setText(els.languageLabel, t("language"));
    setText(els.stateLabel, t("stateForTest"));
    setText(els.resetBtn, t("resetData"));
    setText(els.timerLabel, t("timer"));
    setText(els.progressLabel, t("progress"));
    setText(els.backBtn, t("back"));
    setText(els.homeBtn, t("home"));
    setText(els.nextBtn, t("next"));
    setText(els.wordBaseTitle, t("baseDictionary"));
    setText(els.confirmTitle, t("confirm"));
    setText(els.confirmCancelBtn, t("cancel"));
    setText(els.confirmOkBtn, t("ok"));

    setText(els.resetDataTitle, t("resetDataTitle"));
    setText(els.resetDataSubtitle, t("resetDataSubtitle"));
    setText(els.resetStatsLabel, t("resetStats"));
    setText(els.resetSessionsLabel, t("resetSessions"));
    setText(els.resetDictionaryLabel, t("resetMyDictionary"));
    setText(els.resetOtherLabel, t("resetOther"));
    setText(els.resetLanguageLabel, t("resetLanguage"));
    setText(els.resetStateLabel, t("resetState"));
    setText(els.resetDataCancelBtn, t("cancel"));
    setText(els.resetDataOkBtn, t("ok"));

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
      clearSession("memorization.random");
      clearSession("memorization.ordered");
      clearSession("train");
      if (state.route === "mode/test") onRouteChange();
      if (state.route === "mode/memorization" || state.route === "mode/train" || state.route === "mode/review" || state.route === "stats") {
        onRouteChange();
      }
      if (state.route === "mode/memorization/random" || state.route === "mode/memorization/ordered") {
        onRouteChange();
      }
    });

    els.resetBtn.addEventListener("click", () => {
      // defaults: everything checked except language + state
      els.resetChkStats.checked = true;
      els.resetChkSessions.checked = true;
      els.resetChkDictionary.checked = true;
      els.resetChkOther.checked = true;
      els.resetChkLanguage.checked = false;
      els.resetChkState.checked = false;
      openModal("resetDataModal");
    });

    els.resetDataOkBtn.addEventListener("click", () => {
      const delStats = !!els.resetChkStats.checked;
      const delSessions = !!els.resetChkSessions.checked;
      const delDict = !!els.resetChkDictionary.checked;
      const delOther = !!els.resetChkOther.checked;
      const delLang = !!els.resetChkLanguage.checked;
      const delState = !!els.resetChkState.checked;

      const keys = Object.keys(localStorage).filter((k) => k.startsWith(APP.prefix));
      keys.forEach((k) => {
        if (!delLang && k === key("lang")) return;
        if (!delState && k === key("selectedState")) return;

        if (delStats && (k === key("statsById") || k === key("stats.sort") || k === key("testHistory"))) {
          localStorage.removeItem(k);
          return;
        }
        if (delSessions && k.startsWith(key("session."))) {
          localStorage.removeItem(k);
          return;
        }
        if (delDict && k === key("myDictionary")) {
          localStorage.removeItem(k);
          return;
        }

        // Anything else under our prefix
        if (delOther) {
          localStorage.removeItem(k);
        }
      });

      stopTestTicker();
      closeModal("resetDataModal");

      // re-load state/lang only if user chose to delete them
      if (delLang) state.lang = readJSON(key("lang"), APP.defaultLang);
      if (delState) state.selectedState = readJSON(key("selectedState"), APP.defaultState);

      els.languageSelect.value = state.lang;
      initStatesSelect();
      syncStaticUITexts();
      toast(t("resetDone"));
      onRouteChange();
    });

    els.backBtn.addEventListener("click", () => {
      const r = state.route;
      if (r === "test-history-view") {
        return setRoute("stats");
      }
      if (r === "mode/memorization/random" || r === "mode/memorization/ordered") {
        const orderMode = r === "mode/memorization/ordered" ? "ordered" : "random";
        const modeKey = orderMode === "ordered" ? "memorization.ordered" : "memorization.random";
        const s = loadSession(modeKey);
        if (s.index > 0) {
          s.index -= 1;
          saveSession(modeKey, s);
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
      if (r === "mode/memorization/random" || r === "mode/memorization/ordered") {
        const orderMode = r === "mode/memorization/ordered" ? "ordered" : "random";
        const modeKey = orderMode === "ordered" ? "memorization.ordered" : "memorization.random";
        const s = loadSession(modeKey) ?? ensureMemorizationSession(orderMode);
        if (s.index < s.orderIds.length - 1) {
          s.index += 1;
          saveSession(modeKey, s);
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
          
          // If on last question, finish test instead of moving forward
          if (s.index === s.questionIds.length - 1) {
            return finishTest(false);
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

    els.wordCtxViewBtn.addEventListener("click", () => {
      closeWordContextMenu();
      openWordModal(state.currentWordDisplay ?? state.currentWord);
    });
    els.wordCtxToggleBtn.addEventListener("click", () => {
      const key = state.currentWord;
      const display = state.currentWordDisplay ?? key;
      if (!key) return;
      if (myDictHas(key)) {
        myDictRemove(key);
        toast(t("removedFromMyDictionary"));
      } else {
        myDictAdd(key, display);
        toast(t("addedToMyDictionary"));
      }
      closeWordContextMenu();
      if (state.route === "dictionary") renderDictionary();
    });

    document.addEventListener("click", (ev) => {
      const target = ev.target;
      if (!(target instanceof HTMLElement)) return;
      const w = target.closest?.(".word");
      if (w && w instanceof HTMLElement) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        if (state.ignoreNextWordClick) {
          state.ignoreNextWordClick = false;
          return;
        }
        // Use layout breakpoint instead of touch heuristics:
        // - mobile layout: tap opens definition
        // - desktop layout: click opens context menu
        if (isMobileNav()) {
          openWordModal(w.dataset.word);
          return;
        }
        const r = w.getBoundingClientRect();
        openWordContextMenu(w.dataset.word, { x: r.left + r.width / 2, y: r.bottom + 8 });
      }
    });

    document.addEventListener("click", (ev) => {
      const target = ev.target;
      if (!(target instanceof HTMLElement)) return;
      // Don't close the menu on the same click that targets a word (desktop opens from that click)
      if (target.closest?.(".word")) return;
      if (target.closest?.("#wordContextMenu")) return;
      closeWordContextMenu();
    });

    document.addEventListener(
      "touchstart",
      (ev) => {
        const target = ev.target;
        if (!(target instanceof HTMLElement)) return;
        const w = target.closest?.(".word");
        if (!(w instanceof HTMLElement)) return;
        if (!isTouchPrimary()) return;
        if (state.wordLongPressTimer) window.clearTimeout(state.wordLongPressTimer);
        const touch = ev.touches?.[0];
        if (!touch) return;
        state.wordLongPressTimer = window.setTimeout(() => {
          state.ignoreNextWordClick = true;
          openWordContextMenu(w.dataset.word, { x: touch.clientX, y: touch.clientY });
        }, 450);
      },
      { passive: true },
    );

    document.addEventListener(
      "touchend",
      () => {
        if (state.wordLongPressTimer) window.clearTimeout(state.wordLongPressTimer);
        state.wordLongPressTimer = null;
      },
      { passive: true },
    );
    document.addEventListener(
      "touchcancel",
      () => {
        if (state.wordLongPressTimer) window.clearTimeout(state.wordLongPressTimer);
        state.wordLongPressTimer = null;
      },
      { passive: true },
    );

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
        closeWordContextMenu();
      }
      
      // Arrow key navigation for memorization mode (desktop only)
      if (ev.key === "ArrowLeft" || ev.key === "ArrowRight") {
        const r = state.route;
        if (r === "mode/memorization/random" || r === "mode/memorization/ordered") {
          // Don't interfere if user is typing in an input field
          if (ev.target.tagName === "INPUT" || ev.target.tagName === "TEXTAREA" || ev.target.isContentEditable) {
            return;
          }
          
          ev.preventDefault();
          
          if (ev.key === "ArrowLeft") {
            // Trigger back button
            els.backBtn.click();
          } else if (ev.key === "ArrowRight") {
            // Trigger next button
            els.nextBtn.click();
          }
        }
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
        const rawDict = await dRes.json();
        // Support format:
        // - { "aliases": {form: lemma}, "<lemma>": {de/en/pt...}, ... }
        // - or legacy: { "<lemma>": {de/en/pt...}, ... }
        const aliases = rawDict?.aliases && typeof rawDict.aliases === "object" ? rawDict.aliases : {};
        const entries = { ...rawDict };
        delete entries.aliases;
        state.baseDictionary = entries;
        state.baseDictionaryAliases = aliases;

        const index = new Map();
        Object.keys(entries).forEach((lemma) => index.set(String(lemma).toLowerCase(), String(lemma).toLowerCase()));
        Object.keys(aliases).forEach((form) => {
          const lemma = String(aliases[form] ?? "").toLowerCase();
          if (!lemma) return;
          if (!entries[lemma]) return;
          index.set(String(form).toLowerCase(), lemma);
        });
        state.baseDictionaryIndex = index;
      } else {
        state.baseDictionary = {};
        state.baseDictionaryAliases = {};
        state.baseDictionaryIndex = new Map();
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
      navMemTitle: document.getElementById("navMemTitle"),
      navMemRandom: document.getElementById("navMemRandom"),
      navMemOrdered: document.getElementById("navMemOrdered"),
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
      wordContextMenu: document.getElementById("wordContextMenu"),
      wordCtxViewBtn: document.getElementById("wordCtxViewBtn"),
      wordCtxToggleBtn: document.getElementById("wordCtxToggleBtn"),
      confirmTitle: document.getElementById("confirmTitle"),
      confirmText: document.getElementById("confirmText"),
      confirmCancelBtn: document.getElementById("confirmCancelBtn"),
      confirmOkBtn: document.getElementById("confirmOkBtn"),

      resetDataTitle: document.getElementById("resetDataTitle"),
      resetDataSubtitle: document.getElementById("resetDataSubtitle"),
      resetStatsLabel: document.getElementById("resetStatsLabel"),
      resetSessionsLabel: document.getElementById("resetSessionsLabel"),
      resetDictionaryLabel: document.getElementById("resetDictionaryLabel"),
      resetOtherLabel: document.getElementById("resetOtherLabel"),
      resetLanguageLabel: document.getElementById("resetLanguageLabel"),
      resetStateLabel: document.getElementById("resetStateLabel"),
      resetChkStats: document.getElementById("resetChkStats"),
      resetChkSessions: document.getElementById("resetChkSessions"),
      resetChkDictionary: document.getElementById("resetChkDictionary"),
      resetChkOther: document.getElementById("resetChkOther"),
      resetChkLanguage: document.getElementById("resetChkLanguage"),
      resetChkState: document.getElementById("resetChkState"),
      resetDataCancelBtn: document.getElementById("resetDataCancelBtn"),
      resetDataOkBtn: document.getElementById("resetDataOkBtn"),
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
    closeWordContextMenu();
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
          addedAt: v.addedAt ?? v.updatedAt ?? v.createdAt ?? new Date().toISOString(),
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
