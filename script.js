document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const menuToggle = document.getElementById("menuToggle");
  const overlay = document.querySelector(".overlay");
  const items = sidebar.querySelectorAll("a.item");

  // Desktop: collapsed ou expandido
  let collapsed = false;

  // Função para alternar sidebar no desktop
  function toggleSidebarDesktop() {
    collapsed = !collapsed;
    if (collapsed) {
      sidebar.classList.add("collapsed");
    } else {
      sidebar.classList.remove("collapsed");
    }
  }

  // Função para abrir/fechar sidebar no mobile
  function toggleSidebarMobile(show) {
    if (show) {
      sidebar.classList.add("show");
      overlay.classList.add("active");
    } else {
      sidebar.classList.remove("show");
      overlay.classList.remove("active");
    }
  }

  // Clique no botão do menu
  menuToggle.addEventListener("click", () => {
    if (window.innerWidth > 980) {
      toggleSidebarDesktop();
    } else {
      const isShown = sidebar.classList.contains("show");
      toggleSidebarMobile(!isShown);
    }
  });

  // Clique no overlay fecha sidebar mobile
  overlay.addEventListener("click", () => toggleSidebarMobile(false));

  // Smooth scroll e fechamento mobile
  items.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      if (window.innerWidth <= 980) toggleSidebarMobile(false);
    });
  });

  // Highlight de links conforme scroll
  const anchors = [
    ...document.querySelectorAll("main .card, main section"),
  ].filter((s) => s.id);
  function onScroll() {
    const top = window.scrollY + 120;
    let currentId = null;
    for (const a of anchors) {
      if (a.offsetTop <= top) currentId = a.id;
    }
    items.forEach((it) =>
      it.classList.toggle("active", it.getAttribute("href") === "#" + currentId)
    );
  }
  document.addEventListener("scroll", onScroll);
  onScroll();

  // Swipe gestures para mobile
  let touchStartX = 0;
  document.addEventListener(
    "touchstart",
    (e) => (touchStartX = e.changedTouches[0].clientX)
  );
  document.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (dx > 80) toggleSidebarMobile(true);
    if (dx < -80) toggleSidebarMobile(false);
  });

  // Ajusta sidebar ao redimensionar
  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
      sidebar.classList.remove("show");
      overlay.classList.remove("active");
    }
  });
});
