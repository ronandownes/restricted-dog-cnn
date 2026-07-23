document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#primary-navigation");
  const mobileQuery = window.matchMedia("(max-width: 1180px)");

  if (!button || !navigation) return;

  navigation.querySelectorAll(".nav-dropdown > summary").forEach((summary) => {
    const label = summary.textContent.trim();
    if (label === "Theory & Methods" || label === "Theory") summary.textContent = "Learning Hub";
    if (label === "Links & Resources" || label === "Resources") summary.textContent = "Links";
  });

  const dataLink = [...navigation.querySelectorAll(":scope > a")]
    .find((link) => link.textContent.trim() === "Data");
  if (dataLink && ![...navigation.querySelectorAll(":scope > a")]
    .some((link) => link.textContent.trim() === "Compute")) {
    const computeLink = document.createElement("a");
    computeLink.href = "index.html#compute";
    computeLink.textContent = "Compute";
    dataLink.insertAdjacentElement("afterend", computeLink);
  }

  const learningSummary = [...navigation.querySelectorAll(".nav-dropdown > summary")]
    .find((summary) => summary.textContent.trim() === "Learning Hub");
  let outputsSummary = [...navigation.querySelectorAll(".nav-dropdown > summary")]
    .find((summary) => ["Outputs", "Submissions"].includes(summary.textContent.trim()));
  if (!outputsSummary && learningSummary) {
    const outputs = document.createElement("details");
    outputs.className = "nav-dropdown";
    outputs.innerHTML = `<summary>Submissions</summary><div class="nav-dropdown-menu"></div>`;
    learningSummary.parentElement.insertAdjacentElement("beforebegin", outputs);
    outputsSummary = outputs.querySelector("summary");
  }
  const outputsMenu = outputsSummary?.parentElement.querySelector(".nav-dropdown-menu");
  if (outputsMenu) {
    outputsSummary.textContent = "Submissions";
    outputsMenu.innerHTML = `
      <a class="explained-link" href="documents.html?document=slides"><strong>Slides</strong><small>Self-study version</small></a>
      <a href="documents.html?document=poster"><strong>Poster</strong></a>
      <a class="explained-link" href="documents.html?document=presentation"><strong>Presentation</strong><small>Presenter-led version</small></a>
      <a href="documents.html?document=report"><strong>Report</strong></a>
    `;
  }

  const linksSummary = [...navigation.querySelectorAll(".nav-dropdown > summary")]
    .find((summary) => summary.textContent.trim() === "Links");
  const linksMenu = linksSummary?.parentElement.querySelector(".nav-dropdown-menu");
  if (linksMenu) {
    linksMenu.innerHTML = `
      <a href="https://github.com/ronandownes/restricted-dog-cnn" target="_blank" rel="noopener"><strong>Repository</strong></a>
      <a href="https://github.com/ronandownes/restricted-dog-cnn/tree/main/docs" target="_blank" rel="noopener"><strong>All documents</strong></a>
      <a href="notebooks.html?notebook=data"><strong>01 · Data Preparation</strong></a>
      <a href="notebooks.html?notebook=benchmark"><strong>02 · Benchmarking CNNs</strong></a>
      <a href="notebooks.html?notebook=fine"><strong>03 · Fine-tuning InceptionResNetV2</strong></a>
      <a href="notebooks.html?notebook=gradcam"><strong>04 · Grad-CAM</strong></a>
      <a href="https://github.com/ronandownes/restricted-dog-cnn/tree/main/notebooks" target="_blank" rel="noopener"><strong>All notebooks</strong></a>
    `;
  }

  const learningMenu = learningSummary?.parentElement.querySelector(".nav-dropdown-menu");
  if (learningMenu) {
    learningMenu.innerHTML = `
      <a href="theory.html"><strong>Learning Hub</strong></a>
      <a href="theory.html#binary-classifier"><strong>Binary classifier</strong></a>
      <a href="theory.html#bitter-lesson"><strong>Feature engineering</strong></a>
      <a href="theory.html#imagenet"><strong>ImageNet</strong></a>
      <a href="theory.html#cnn"><strong>CNN foundations</strong></a>
      <a href="theory.html#training"><strong>Training methods</strong></a>
      <a href="theory.html#architectures"><strong>CNN architectures</strong></a>
      <a href="metrics.html"><strong>Metrics guide</strong></a>
      <a href="learning-curves.html"><strong>Learning curves</strong></a>
      <a href="theory.html#gradcam"><strong>Grad-CAM theory</strong></a>
      <a href="theory.html#transformers"><strong>Beyond CNNs</strong></a>
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
