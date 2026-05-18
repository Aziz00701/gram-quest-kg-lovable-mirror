(function () {
  const avatarByName = {
    "\u0410\u0439\u0431\u0435\u043a": "/assets/visuals/avatars-2-src.png",
    "\u0410\u0439\u0434\u0430\u043d\u0430": "/assets/visuals/avatars-0-src.png",
    "\u041d\u0443\u0440\u0431\u0435\u043a": "/assets/visuals/avatars-4-src.png",
    "\u042d\u043b\u0438\u043d\u0430": "/assets/visuals/avatars-1-src.png",
    "\u0411\u0435\u043a\u0437\u0430\u0442": "/assets/visuals/avatars-3-src.png",
    "\u041c\u044d\u044d\u0440\u0438\u043c": "/assets/visuals/avatars-5-src.png",
    "\u0421\u0435\u0437\u0438\u043c": "/assets/visuals/avatars-9-src.png",
    "\u0422\u0438\u043c\u0443\u0440": "/assets/visuals/avatars-8-src.png",
    "\u0410\u043b\u0438\u043d\u0430": "/assets/visuals/avatars-0-src.png"
  };

  const allowedAvatarNames = new Set(Object.keys(avatarByName));

  const avatarByEmoji = {
    "\ud83d\udc66": avatarByName["\u0410\u0439\u0431\u0435\u043a"],
    "\ud83d\udc67": avatarByName["\u0410\u0439\u0434\u0430\u043d\u0430"],
    "\ud83e\uddd2": avatarByName["\u041d\u0443\u0440\u0431\u0435\u043a"],
    "\ud83d\udc69\u200d\ud83c\udf93": avatarByName["\u042d\u043b\u0438\u043d\u0430"],
    "\ud83e\uddd1\u200d\ud83c\udf93": avatarByName["\u0411\u0435\u043a\u0437\u0430\u0442"],
    "\ud83d\udcda": avatarByName["\u041c\u044d\u044d\u0440\u0438\u043c"],
    "\u270f\ufe0f": avatarByName["\u0421\u0435\u0437\u0438\u043c"],
    "\ud83c\udfd4\ufe0f": avatarByName["\u0422\u0438\u043c\u0443\u0440"],
    "\ud83c\udf38": avatarByName["\u0410\u043b\u0438\u043d\u0430"]
  };

  function routeClass() {
    document.body.classList.add("sgq-polished");
    document.body.classList.toggle("sgq-route-home", location.pathname === "/" || location.pathname === "");
    document.body.classList.toggle("sgq-route-map", location.pathname.startsWith("/map"));
    document.body.classList.toggle("sgq-route-students", location.pathname.startsWith("/students"));
  }

  function image(src, alt) {
    const img = document.createElement("img");
    img.className = "sgq-avatar-img";
    img.src = src;
    img.alt = alt || "";
    img.loading = "lazy";
    return img;
  }

  function replaceEmojiAvatar(target, src, label) {
    if (!target || !src || target.querySelector(".sgq-avatar-img")) return;
    target.dataset.sgqAvatar = label || "avatar";
    target.textContent = "";
    target.appendChild(image(src, label));
  }

  function polishAvatarPicker() {
    document.querySelectorAll("main button[title]").forEach((button) => {
      const title = button.getAttribute("title") || "";
      if (!allowedAvatarNames.has(title)) {
        button.dataset.sgqHiddenAvatar = "true";
        return;
      }

      button.dataset.sgqHiddenAvatar = "false";
      const span = button.querySelector("span:not(.absolute)");
      replaceEmojiAvatar(span, avatarByName[title], title);
    });
  }

  function polishSavedAvatars() {
    document.querySelectorAll('[style*="background-color"]').forEach((node) => {
      const text = (node.textContent || "").trim();
      if (text.length > 6) return;
      const src = avatarByEmoji[text];
      if (src) replaceEmojiAvatar(node, src, node.getAttribute("title") || text);
    });
  }

  function polishAvatars() {
    polishAvatarPicker();
    polishSavedAvatars();
  }

  function removeLovableBadge() {
    document.getElementById("lovable-badge")?.remove();
  }

  function addHomeScene() {
    if (!document.body.classList.contains("sgq-route-home")) return;
    const heroCard = document.querySelector('main .kyrgyz-card svg[viewBox="0 0 600 340"]')?.parentElement;
    if (!heroCard) return;

    if (!heroCard.querySelector(".sgq-visual-characters")) {
      const wrap = document.createElement("div");
      wrap.className = "sgq-visual-characters";
      wrap.innerHTML = [
        '<img src="/assets/visuals/avatars-0-src.png" alt="">',
        '<div class="sgq-visual-guide"><img src="/assets/visuals/avatars-10-src.png" alt=""></div>',
        '<img src="/assets/visuals/avatars-2-src.png" alt="">'
      ].join("");
      heroCard.appendChild(wrap);
    }

    if (!heroCard.querySelector(".sgq-hero-guide-bubble")) {
      const bubble = document.createElement("div");
      bubble.className = "sgq-hero-guide-bubble";
      bubble.textContent = "Hi! I'm your guide. Let's learn English grammar together!";
      heroCard.appendChild(bubble);
    }
  }

  function polishHomeLeopard() {
    if (!document.body.classList.contains("sgq-route-home")) return;

    const heroCard = document.querySelector('main .kyrgyz-card svg[viewBox="0 0 600 340"]')?.parentElement;
    heroCard?.querySelectorAll(".grid.grid-cols-3").forEach((labels) => {
      labels.dataset.sgqHideHomeLabels = "true";
    });

    document.querySelectorAll('main [class*="-bottom-2"][class*="-left"]').forEach((guide) => {
      if (!(guide.textContent || "").includes("Hi! I'm your guide")) return;
      guide.dataset.sgqHideHomeSnow = "true";
    });

    document.querySelectorAll("main *").forEach((node) => {
      if (node.closest(".sgq-hero-guide-bubble")) return;

      const text = Array.from(node.childNodes)
        .filter((child) => child.nodeType === Node.TEXT_NODE)
        .map((child) => child.textContent)
        .join("")
        .trim();
      if (!text) return;

      if (text.includes("Hi! I'm your guide")) {
        const guide = node.closest(".flex.items-end.gap-3") || node.closest(".absolute") || node;
        guide.dataset.sgqHideHomeSnow = "true";
      }

      if (text === "\ud83d\udc06 \u0421\u043d\u0435\u0436\u043d\u044b\u0439 \u0431\u0430\u0440\u0441" || text === "\u0421\u043d\u0435\u0436\u043d\u044b\u0439 \u0431\u0430\u0440\u0441") {
        node.dataset.sgqHideHomeSnow = "true";
      }

      if (text.includes("Snow Leopard Speed")) {
        node.textContent = text.replace("Snow Leopard Speed, ", "").replace(", Snow Leopard Speed", "");
      }
    });

    document.querySelectorAll("main div").forEach((node) => {
      const text = (node.textContent || "").trim();
      if (text === "\ud83d\udc06 \u0421\u043d\u0435\u0436\u043d\u044b\u0439 \u0431\u0430\u0440\u0441" || text === "\u0421\u043d\u0435\u0436\u043d\u044b\u0439 \u0431\u0430\u0440\u0441") {
        node.dataset.sgqHideHomeSnow = "true";
      }
    });

    document.querySelectorAll(".sgq-home-leopard-guide").forEach((guide) => {
      const leopards = guide.querySelectorAll(".sgq-home-leopard-img");
      leopards.forEach((img, index) => {
        if (index > 0) img.remove();
      });
    });
  }

  function addMapScene() {
    if (!document.body.classList.contains("sgq-route-map")) return;
    if (document.querySelector(".sgq-map-scene")) return;
    const title = Array.from(document.querySelectorAll("main h1")).find((h) =>
      h.textContent.includes("\u041a\u0430\u0440\u0442\u0430 \u0433\u0440\u0430\u043c\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u043e\u0433\u043e \u043f\u0443\u0442\u0435\u0448\u0435\u0441\u0442\u0432\u0438\u044f")
    );
    const header = title?.closest("header");
    if (!header) return;
    const scene = document.createElement("div");
    scene.className = "sgq-map-scene";
    scene.innerHTML = '<span>\u041f\u0443\u0442\u0435\u0448\u0435\u0441\u0442\u0432\u0438\u0435 \u043f\u043e \u041a\u044b\u0440\u0433\u044b\u0437\u0441\u0442\u0430\u043d\u0443 \u0441\u0442\u0430\u043b\u043e \u0436\u0438\u0432\u0435\u0435: \u0432\u044b\u0431\u0438\u0440\u0430\u0439 \u0443\u0440\u043e\u0432\u0435\u043d\u044c \u0438 \u0434\u0432\u0438\u0433\u0430\u0439\u0441\u044f \u043a Grammar Summit.</span><img class="sgq-map-runner-girl" src="/assets/visuals/avatars-9-src.png" alt=""><img class="sgq-map-runner-boy" src="/assets/visuals/avatars-8-src.png" alt="">';
    header.insertAdjacentElement("afterend", scene);
  }

  function polishMapLeopardTip() {
    if (!document.body.classList.contains("sgq-route-map")) return;

    document.querySelectorAll('main .animate-slide-up').forEach((guide) => {
      if (!(guide.textContent || "").includes("Tip:")) return;
      const svg = guide.querySelector('svg[viewBox="0 0 100 100"], svg[viewbox="0 0 100 100"]');
      if (!svg) return;

      guide.classList.add("sgq-map-leopard-tip");
      svg.dataset.sgqHideMapTipSvg = "true";
      svg.style.display = "none";

      if (guide.querySelector(".sgq-map-tip-leopard")) return;

      const img = image("/assets/visuals/avatars-10-src.png", "Snow leopard guide");
      img.className = "sgq-map-tip-leopard";
      guide.prepend(img);
    });
  }

  function polish() {
    removeLovableBadge();
    routeClass();
    polishAvatars();
    addHomeScene();
    addMapScene();
    polishMapLeopardTip();
    polishHomeLeopard();
  }

  let started = false;
  let scheduled = false;

  function schedulePolish() {
    if (!started || scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      polish();
    });
  }

  function startAfterHydration() {
    if (started) return;
    started = true;
    polish();
    new MutationObserver(schedulePolish).observe(document.documentElement, { childList: true, subtree: true });
  }

  const pushState = history.pushState;
  const replaceState = history.replaceState;
  history.pushState = function () {
    const result = pushState.apply(this, arguments);
    schedulePolish();
    return result;
  };
  history.replaceState = function () {
    const result = replaceState.apply(this, arguments);
    schedulePolish();
    return result;
  };
  window.addEventListener("popstate", schedulePolish);
  window.addEventListener("load", () => setTimeout(startAfterHydration, 900), { once: true });
  setTimeout(startAfterHydration, 1800);
})();
