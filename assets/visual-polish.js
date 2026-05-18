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

  function addHomeScene() {
    if (!document.body.classList.contains("sgq-route-home")) return;
    if (document.querySelector(".sgq-visual-characters")) return;
    const heroCard = document.querySelector('main .kyrgyz-card svg[viewBox="0 0 600 340"]')?.parentElement;
    if (!heroCard) return;
    const wrap = document.createElement("div");
    wrap.className = "sgq-visual-characters";
    wrap.innerHTML = [
      '<img src="/assets/visuals/avatars-0-src.png" alt="">',
      '<img src="/assets/visuals/avatars-2-src.png" alt="">'
    ].join("");
    heroCard.appendChild(wrap);
  }

  function polishHomeLeopard() {
    if (!document.body.classList.contains("sgq-route-home")) return;

    document.querySelectorAll('main [class*="-bottom-2"][class*="-left"]').forEach((guide) => {
      if (!(guide.textContent || "").includes("Hi! I'm your guide")) return;
      guide.dataset.sgqHideHomeSnow = "false";
      guide.classList.add("sgq-home-leopard-guide");
      if (!guide.querySelector(".sgq-home-leopard-img")) {
        const img = image("/assets/visuals/avatars-10-src.png", "\u0421\u043d\u0435\u0436\u043d\u044b\u0439 \u0431\u0430\u0440\u0441");
        img.className = "sgq-home-leopard-img";
        guide.prepend(img);
      }
    });

    document.querySelectorAll("main *").forEach((node) => {
      const text = Array.from(node.childNodes)
        .filter((child) => child.nodeType === Node.TEXT_NODE)
        .map((child) => child.textContent)
        .join("")
        .trim();
      if (!text) return;

      if (text.includes("Hi! I'm your guide")) {
        const guide = node.closest(".flex.items-end.gap-3") || node.closest(".absolute") || node;
        guide.dataset.sgqHideHomeSnow = "false";
        guide.classList.add("sgq-home-leopard-guide");
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
    scene.innerHTML = '<span>\u041f\u0443\u0442\u0435\u0448\u0435\u0441\u0442\u0432\u0438\u0435 \u043f\u043e \u041a\u044b\u0440\u0433\u044b\u0437\u0441\u0442\u0430\u043d\u0443 \u0441\u0442\u0430\u043b\u043e \u0436\u0438\u0432\u0435\u0435: \u0432\u044b\u0431\u0438\u0440\u0430\u0439 \u0443\u0440\u043e\u0432\u0435\u043d\u044c \u0438 \u0434\u0432\u0438\u0433\u0430\u0439\u0441\u044f \u043a Grammar Summit.</span><img src="/assets/visuals/avatars-8-src.png" alt="">';
    header.insertAdjacentElement("afterend", scene);
  }

  function polish() {
    routeClass();
    polishAvatars();
    addHomeScene();
    addMapScene();
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
