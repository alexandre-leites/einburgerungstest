/**
 * Home renderer — extracted from general.js.
 *
 * Loaded before general.js. `registerRoutes()` in general.js uses
 * `R.home = R.home || <default>` so whatever we register here wins.
 */
(function () {
  "use strict";

  window.EBT = window.EBT || {};
  window.EBT.Render = window.EBT.Render || {};

  window.EBT.Render.home = function renderHome() {
    const Core = window.EBT.Core;
    const View = window.EBT.View;
    const Templates = window.EBT.Templates;
    if (!Core || !View || !Templates) return;

    const t = Core.t;

    View.setActiveRoute("home");
    View.setTitle(t("home"), "");
    View.setTimer({ visible: false });
    View.setFooterVisible(false);
    View.setProgress(0, 0);

    const frag = Templates.render("tpl-home", {
      introTitle: t("introTitle"),
      introText: t("introText"),
      whatYouGetTitle: t("homeWhatYouGetTitle"),
      whatYouGetText: t("homeWhatYouGetText"),
      modesTitle: t("homeModesTitle"),
      modeMemTitle: t("homeModeMemTitle"),
      modeMemText: t("homeModeMemText"),
      modeTrainTitle: t("homeModeTrainTitle"),
      modeTrainText: t("homeModeTrainText"),
      modeTestTitle: t("homeModeTestTitle"),
      modeTestText: t("homeModeTestText"),
      modeReviewTitle: t("homeModeReviewTitle"),
      modeReviewText: t("homeModeReviewText"),
      testRulesTitle: t("testRulesTitle"),
      testRulesText: t("testRulesText"),
      testComposition: t("testComposition"),
    });

    View.mountMain(frag);
    View.setFooterState({ backDisabled: true, nextDisabled: true });
  };
})();
