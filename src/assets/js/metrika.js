const metrika = () => {
  (function (m, e, t, r, i, k, a) {
    m[i] =
      m[i] ||
      function () {
        (m[i].a = m[i].a || []).push(arguments);
      };
    m[i].l = 1 * new Date();
    for (var j = 0; j < document.scripts.length; j++) {
      if (document.scripts[j].src === r) {
        return;
      }
    }
    (k = e.createElement(t)),
      (a = e.getElementsByTagName(t)[0]),
      (k.async = 1),
      (k.src = r),
      a.parentNode.insertBefore(k, a);
  })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

  ym(90307050, "init", {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
  });
};

if (
  navigator.language === "en-US" &&
  document.referrer.indexOf(window.location.hostname) === -1
) {
  window.addEventListener("scroll", metrika, { once: true });
} else {
  metrika();
}
