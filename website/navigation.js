document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#primary-navigation");
  const mobileQuery = window.matchMedia("(max-width: 1000px)");

  if (!button || !navigation) return;

  navigation.querySelectorAll(".nav-dropdown > summary").forEach((summary) => {
    const label = summary.textContent.trim();
    if (label === "Theory & Methods" || label === "Theory") summary.textContent = "Learning Hub";
    if (label === "Links & Resources" || label === "Resources") summary.textContent = "Links";
  });

  const linksSummary = [...navigation.querySelectorAll(".nav-dropdown > summary")]
    .find((summary) => summary.textContent.trim() === "Links");
  const linksMenu = linksSummary?.parentElement.querySelector(".nav-dropdown-menu");
  if (linksMenu) {
    linksMenu.innerHTML = `
      <a href="https://github.com/ronandownes/restricted-dog-cnn" target="_blank" rel="noopener"><strong>Repository</strong></a>
      <a href="documents.html?document=report"><strong>Report</strong></a>
      <a href="documents.html?document=poster"><strong>Poster</strong></a>
      <a class="explained-link" href="documents.html?document=slides"><strong>Slides</strong><small>For students and self-study</small></a>
      <a class="explained-link" href="documents.html?document=presentation"><strong>Presentation</strong><small>For presenters · staged reveals</small></a>
      <a href="https://github.com/ronandownes/restricted-dog-cnn/tree/main/docs" target="_blank" rel="noopener"><strong>All documents</strong></a>
      <a href="notebooks.html?notebook=data"><strong>01 · Data Preparation</strong></a>
      <a href="notebooks.html?notebook=benchmark"><strong>02 · Benchmarking CNNs</strong></a>
      <a href="notebooks.html?notebook=fine"><strong>03 · Fine-tuning InceptionResNetV2</strong></a>
      <a href="notebooks.html?notebook=gradcam"><strong>04 · Grad-CAM</strong></a>
      <a href="https://github.com/ronandownes/restricted-dog-cnn/tree/main/notebooks" target="_blank" rel="noopener"><strong>All notebooks</strong></a>
    `;
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
    if (mobileQuery.matches && event.target.closest("a")) closeMenu();
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
});
