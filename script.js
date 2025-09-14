// script.js
document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const menuToggle = document.getElementById("menuToggle");
  const menuToggleInside = document.getElementById("menuToggleInside");
  const main = document.getElementById("main");
  const items = [...sidebar.querySelectorAll("a.item")];

  // --- helpers para abrir/fechar com comportamento diferente Desktop / Mobile ---
  function openMenu() {
    sidebar.classList.add("open");
    if (window.innerWidth <= 900) {
      overlay.classList.add("active");
      main.classList.add("shrink");
      document.body.style.overflow = "hidden"; // evita scroll do body quando menu móvel aberto
    } else {
      // desktop: menu aberto, mas sem overlay nem "shrink"
      overlay.classList.remove("active");
      main.classList.remove("shrink");
      document.body.style.overflow = "";
    }
  }

  function closeMenu() {
    sidebar.classList.remove("open");
    overlay.classList.remove("active");
    main.classList.remove("shrink");
    document.body.style.overflow = "";
  }

  function toggleMenu(force = null) {
    const isOpen = sidebar.classList.contains("open");
    if (force === true) return openMenu();
    if (force === false) return closeMenu();
    return isOpen ? closeMenu() : openMenu();
  }

  // inicializa estado conforme largura da tela
  if (window.innerWidth > 900) {
    openMenu(); // desktop: menu visível por padrão (sem overlay)
  } else {
    closeMenu(); // mobile: fechado por padrão
  }

  // evento do botão do header
  menuToggle.addEventListener("click", (e) => {
    e.preventDefault();
    toggleMenu();
  });

  // botão interno (se existir)
  if (menuToggleInside) {
    menuToggleInside.addEventListener("click", () => toggleMenu(false));
    menuToggleInside.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") toggleMenu(false);
    });
  }

  // fechar ao clicar no overlay
  overlay.addEventListener("click", () => toggleMenu(false));

  // fechar com ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") toggleMenu(false);
  });

  // fechar/abrir ao redimensionar (desktop vs mobile)
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      openMenu();
    } else {
      closeMenu();
    }
  });

  // --- smooth scroll + fecha no mobile ao clicar no item ---
  items.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const target = document.querySelector(href);
      if (!target) return;

      // calcula posição ajustada (leva em conta header fixo)
      const headerOffset = 90; // ajuste fino (pode alterar)
      const rectTop = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: rectTop - headerOffset, behavior: "smooth" });

      // se for mobile, fecha o menu
      if (window.innerWidth <= 900) toggleMenu(false);
    });
  });

  // --- highlight active link on scroll ---
  const anchors = [...document.querySelectorAll("main .card, main section")].filter((s) => s.id);

  function onScroll() {
    const top = window.scrollY + 120; // offset para considerar header fixo
    let currentId = null;
    for (const a of anchors) {
      if (a.offsetTop <= top) currentId = a.id;
    }
    items.forEach((it) => {
      const href = it.getAttribute("href") || "";
      it.classList.toggle("active", href === "#" + currentId);
    });
  }
  // usa passive listener para performance
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // --- mobile: swipe para abrir/fechar sidebar ---
  let touchStartX = 0;
  document.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].clientX;
  });
  document.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (dx > 80) {
      // swipe da esquerda pra direita -> abrir
      openMenu();
    } else if (dx < -80) {
      // swipe da direita pra esquerda -> fechar
      closeMenu();
    }
  });
});
