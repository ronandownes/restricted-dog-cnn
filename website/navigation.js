document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#primary-navigation");
  const mobileQuery = window.matchMedia("(max-width: 1180px)");

  if (!button || !navigation) return;

  navigation.innerHTML = `
    <details class="nav-dropdown">
      <summary>Study</summary>
      <div class="nav-dropdown-menu">
        <a href="index.html#context"><strong>Irish context</strong></a>
        <a href="index.html#data"><strong>Data preparation</strong></a>
        <a href="index.html#compute"><strong>Compute and Colab</strong></a>
        <a href="notebooks.html?notebook=data"><strong>01 · Data Preparation notebook</strong></a>
        <a href="notebooks.html?notebook=benchmark"><strong>02 · Benchmark notebook</strong></a>
        <a href="notebooks.html?notebook=fine"><strong>03 · Fine-tuning notebook</strong></a>
        <a href="notebooks.html?notebook=gradcam"><strong>04 · Grad-CAM notebook</strong></a>
      </div>
    </details>
    <details class="nav-dropdown">
      <summary>Results</summary>
      <div class="nav-dropdown-menu">
        <a href="index.html#benchmark"><strong>Six-CNN benchmark</strong></a>
        <a href="index.html#fine"><strong>Fine-tuning</strong></a>
        <a href="gradcam.html"><strong>Grad-CAM study</strong></a>
      </div>
    </details>
    <details class="nav-dropdown">
      <summary>Discussion</summary>
      <div class="nav-dropdown-menu">
        <a href="theory.html"><strong>Discussion overview</strong></a>
        <a href="metrics.html"><strong>Metrics guide</strong></a>
        <a href="learning-curves.html"><strong>Learning curves</strong></a>
        <a href="theory.html#bitter-lesson"><strong>Feature engineering</strong></a>
        <a href="theory.html#benchmark-lifecycle"><strong>Benchmark lifecycle</strong></a>
        <a href="theory.html#cnn"><strong>CNN foundations</strong></a>
        <a href="theory.html#training"><strong>Training methods</strong></a>
        <a href="theory.html#architectures"><strong>CNN architectures</strong></a>
        <a href="theory.html#transformers"><strong>Transformers and LLMs</strong></a>
      </div>
    </details>
    <details class="nav-dropdown">
      <summary>Submissions</summary>
      <div class="nav-dropdown-menu">
        <a href="documents.html?document=proposal"><strong>Proposal</strong></a>
        <a href="documents.html?document=report"><strong>Report</strong></a>
        <a class="explained-link" href="documents.html?document=slides"><strong>Slides</strong><small>Self-study version</small></a>
        <a href="documents.html?document=poster"><strong>Poster</strong></a>
        <a class="explained-link" href="documents.html?document=presentation"><strong>Presentation</strong><small>Presenter-led version</small></a>
        <a href="https://github.com/ronandownes/restricted-dog-cnn" target="_blank" rel="noopener"><strong>GitHub repository</strong></a>
      </div>
    </details>
  `;

  const computeSection = document.querySelector("#compute");
  const gradcamSection = document.querySelector("#gradcam");
  if (computeSection && gradcamSection) {
    gradcamSection.insertAdjacentElement("afterend", computeSection);
  }

  const closeMenu = () => {
    navigation.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Open navigation menu");
    document.body.classList.remove("menu-open");
    navigation.querySelectorAll("details[open]").forEach((menu) => {
      menu.removeAttribute("open");
    });
  };

  const dropdowns = Array.from(navigation.querySelectorAll(".nav-dropdown"));
  const closeDropdowns = (except = null) => {
    dropdowns.forEach((menu) => {
      if (menu !== except) menu.removeAttribute("open");
    });
  };

  dropdowns.forEach((menu) => {
    menu.addEventListener("toggle", () => {
      if (menu.open) closeDropdowns(menu);
    });
  });

  button.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
    button.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );
    document.body.classList.toggle("menu-open", isOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (!event.target.closest("a")) return;
    if (mobileQuery.matches) closeMenu();
    else closeDropdowns();
  });

  document.addEventListener("pointerdown", (event) => {
    if (!navigation.contains(event.target) && !button.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("focusin", (event) => {
    if (!navigation.contains(event.target) && !button.contains(event.target)) {
      closeDropdowns();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      button.focus();
    }
  });

  mobileQuery.addEventListener("change", (event) => {
    if (!event.matches) closeMenu();
  });

  window.addEventListener("scroll", closeMenu, { passive: true });
  window.addEventListener("resize", closeMenu, { passive: true });
  window.addEventListener("orientationchange", closeMenu);
  window.addEventListener("hashchange", closeMenu);
  window.addEventListener("pagehide", closeMenu);
});
