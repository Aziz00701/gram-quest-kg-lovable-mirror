(function () {
  const avatarByName = {
    "Айбек": "/assets/visuals/avatars-2-src.png",
    "Айдана": "/assets/visuals/avatars-0-src.png",
    "Нурбек": "/assets/visuals/avatars-4-src.png",
    "Элина": "/assets/visuals/avatars-1-src.png",
    "Бекзат": "/assets/visuals/avatars-3-src.png",
    "Мээрим": "/assets/visuals/avatars-5-src.png",
    "Сезим": "/assets/visuals/avatars-9-src.png",
    "Тимур": "/assets/visuals/avatars-8-src.png",
    "Алина": "/assets/visuals/avatars-5-src.png",
    "Снежный барс": "/assets/visuals/avatars-10-src.png",
    "Орёл": "/assets/visuals/avatars-11-src.png",
    "Учитель": "/assets/visuals/avatars-6-src.png",
    "Учительница": "/assets/visuals/avatars-7-src.png",
    "Книголюб": "/assets/visuals/avatars-1-src.png",
    "Чемпион": "/assets/visuals/avatars-11-src.png"
  };

  const avatarByEmoji = {
    "👦": avatarByName["Айбек"],
    "👧": avatarByName["Айдана"],
    "🧒": avatarByName["Нурбек"],
    "👩‍🎓": avatarByName["Элина"],
    "🧑‍🎓": avatarByName["Бекзат"],
    "📚": avatarByName["Мээрим"],
    "✏️": avatarByName["Сезим"],
    "🏔️": avatarByName["Тимур"],
    "🌸": avatarByName["Алина"],
    "🐆": avatarByName["Снежный барс"],
    "🦅": avatarByName["Орёл"],
    "👨‍🏫": avatarByName["Учитель"],
    "👩‍🏫": avatarByName["Учительница"],
    "📖": avatarByName["Книголюб"]
  };

  function routeClass() {
    document.body.classList.add("sgq-polished");
    document.body.classList.toggle("sgq-route-home", location.pathname === "/" || location.pathname === "");
    document.body.classList.toggle("sgq-route-map", location.pathname.startsWith("/map"));
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

  function polishAvatars() {
    document.querySelectorAll("button[title]").forEach((button) => {
      const src = avatarByName[button.getAttribute("title") || ""];
      const span = button.querySelector("span:not(.absolute)");
      if (src && span) replaceEmojiAvatar(span, src, button.getAttribute("title"));
    });

    document.querySelectorAll('[style*="background-color"]').forEach((node) => {
      const text = (node.textContent || "").trim();
      if (text.length > 6) return;
      const src = avatarByEmoji[text];
      if (src) replaceEmojiAvatar(node, src, node.getAttribute("title") || text);
    });
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
      '<img src="/assets/visuals/avatars-10-src.png" alt="">',
      '<img src="/assets/visuals/avatars-2-src.png" alt="">'
    ].join("");
    heroCard.appendChild(wrap);
  }

  function addMapScene() {
    if (!document.body.classList.contains("sgq-route-map")) return;
    if (document.querySelector(".sgq-map-scene")) return;
    const title = Array.from(document.querySelectorAll("main h1")).find((h) =>
      h.textContent.includes("Карта грамматического путешествия")
    );
    const header = title?.closest("header");
    if (!header) return;
    const scene = document.createElement("div");
    scene.className = "sgq-map-scene";
    scene.innerHTML = '<span>Путешествие по Кыргызстану стало живее: выбирай уровень и двигайся к Grammar Summit.</span><img src="/assets/visuals/avatars-8-src.png" alt="">';
    header.insertAdjacentElement("afterend", scene);
  }

  function polish() {
    routeClass();
    polishAvatars();
    addHomeScene();
    addMapScene();
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
