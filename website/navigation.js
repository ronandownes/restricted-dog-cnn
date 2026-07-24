document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#primary-navigation");
  const mobileQuery = window.matchMedia("(max-width: 1180px)");

  if (!button || !navigation) return;

  navigation.innerHTML = `
    <a class="nav-direct" href="index.html#context"><strong>Introduction</strong></a>
    <details class="nav-dropdown">
      <summary>Methodology</summary>
      <div class="nav-dropdown-menu">
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
        <a href="index.html#benchmark"><strong>CNN benchmarks</strong></a>
        <a href="index.html#fine"><strong>Fine-tuning</strong></a>
        <a href="gradcam.html"><strong>Grad-CAM study</strong></a>
      </div>
    </details>
    <details class="nav-dropdown">
      <summary>Literature Review</summary>
      <div class="nav-dropdown-menu">
        <a href="theory.html"><strong>Literature review overview</strong></a>
        <a href="theory.html#bitter-lesson"><strong>Feature engineering</strong></a>
        <a href="theory.html#benchmark-lifecycle"><strong>Benchmark lifecycle</strong></a>
        <a href="theory.html#imagenet"><strong>ImageNet and transfer learning</strong></a>
        <a href="theory.html#cnn"><strong>CNN foundations</strong></a>
        <a href="theory.html#training"><strong>Training methods</strong></a>
        <a href="theory.html#architectures"><strong>CNN architectures</strong></a>
        <a href="theory.html#gradcam"><strong>Grad-CAM theory</strong></a>
        <a href="theory.html#transformers"><strong>Transformers and LLMs</strong></a>
        <a href="theory.html#sources"><strong>Papers and sources</strong></a>
      </div>
    </details>
    <details class="nav-dropdown">
      <summary>Discussion</summary>
      <div class="nav-dropdown-menu">
        <a href="discussion.html"><strong>Project interpretation</strong></a>
        <a href="discussion.html#benchmark-finding"><strong>Benchmark findings</strong></a>
        <a href="discussion.html#fine-tuning-finding"><strong>Fine-tuning trade-off</strong></a>
        <a href="discussion.html#learning-curve-finding"><strong>Learning curves</strong></a>
        <a href="discussion.html#gradcam-finding"><strong>Grad-CAM findings</strong></a>
        <a href="discussion.html#limitations"><strong>Limitations and conclusion</strong></a>
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

  const dataSection = document.querySelector("#data .wrap");
  const dataPipeline = document.querySelector("#data .data-pipeline");
  if (dataSection && dataPipeline && !document.querySelector("#restrictedBreedCoverage")) {
    const coverage = document.createElement("div");
    coverage.id = "restrictedBreedCoverage";
    coverage.className = "breed-coverage-card";
    coverage.innerHTML = `
      <div class="breed-coverage-heading">
        <div><small>STANFORD DOGS COVERAGE</small><h3>Irish restricted breeds represented in the dataset</h3></div>
        <span>6 represented · 5 not represented</span>
      </div>
      <div class="breed-coverage-table-wrap">
        <table class="breed-coverage-table">
          <thead><tr><th>Represented</th><th>Not represented</th></tr></thead>
          <tbody>
            <tr><td>Rottweiler</td><td>American Pit Bull Terrier</td></tr>
            <tr><td>German Shepherd</td><td>English Bull Terrier</td></tr>
            <tr><td>Doberman Pinscher</td><td>Japanese Akita</td></tr>
            <tr><td>Bull Mastiff</td><td>Japanese Tosa</td></tr>
            <tr><td>Rhodesian Ridgeback</td><td>Bandog</td></tr>
            <tr><td>Staffordshire Bull Terrier</td><td aria-label="No sixth unrepresented breed">—</td></tr>
          </tbody>
        </table>
      </div>
      <p class="breed-coverage-note">Only the six represented breeds were used to construct the restricted image class.</p>
    `;
    dataPipeline.insertAdjacentElement("beforebegin", coverage);

    const coverageStyle = document.createElement("style");
    coverageStyle.textContent = `
      .breed-coverage-card{margin:0 0 32px;background:#fff;border:1px solid var(--line);border-radius:20px;overflow:hidden;box-shadow:var(--shadow)}
      .breed-coverage-heading{display:flex;align-items:end;justify-content:space-between;gap:24px;padding:24px 28px 18px;background:linear-gradient(135deg,#fff,#edf4fb)}
      .breed-coverage-heading small{display:block;color:var(--blue);font-size:.72rem;font-weight:900;letter-spacing:.1em}
      .breed-coverage-heading h3{margin:.25rem 0 0;font-size:1.55rem}
      .breed-coverage-heading>span{flex:0 0 auto;padding:7px 11px;border-radius:999px;background:var(--navy);color:#fff;font-size:.82rem;font-weight:850}
      .breed-coverage-table-wrap{overflow-x:auto}
      .breed-coverage-table{width:100%;border-collapse:collapse;font-size:1rem}
      .breed-coverage-table th{width:50%;padding:14px 22px;text-align:left;background:#173f73;color:#fff;font-size:.9rem;letter-spacing:.03em}
      .breed-coverage-table th+th{background:#7f3f3f}
      .breed-coverage-table td{padding:13px 22px;border-bottom:1px solid var(--line);font-weight:700}
      .breed-coverage-table tr:nth-child(even) td{background:#f6f8fb}
      .breed-coverage-table td+td{border-left:1px solid var(--line)}
      .breed-coverage-note{margin:0;padding:16px 22px 20px;color:var(--muted);font-size:.93rem}
      @media(max-width:700px){
        .breed-coverage-heading{align-items:flex-start;flex-direction:column;padding:20px}
        .breed-coverage-heading>span{align-self:flex-start}
        .breed-coverage-table{font-size:.9rem}
        .breed-coverage-table th,.breed-coverage-table td{padding:11px 12px;vertical-align:top}
      }
    `;
    document.head.appendChild(coverageStyle);
  }

  const datasetBiasParagraph = document.querySelector("#context .boundary-card p");
  if (datasetBiasParagraph) {
    datasetBiasParagraph.textContent = "The binary target aggregates six fine-grained restricted breed classes into a single positive superclass, while the negative class comprises 24 reproducibly sampled unrestricted breeds that provide contrasting examples for training. Breed-level results and Grad-CAM therefore matter alongside headline accuracy.";
  }

  const finePrev = document.querySelector("#finePrev");
  const fineNext = document.querySelector("#fineNext");
  if (finePrev) finePrev.textContent = "← Previous";
  if (fineNext) fineNext.textContent = "Next →";

  if (typeof fineViews !== "undefined" && fineViews[3]) {
    fineViews[3].title = "Difference due to fine-tuning";
    fineViews[3].summary = "Change in each metric after fine-tuning.";
  }

  const syncFineDifferenceView = () => {
    if (typeof fineView === "undefined" || fineView !== 3) return;
    if (typeof fChart !== "undefined" && fChart?.data?.datasets?.[0]) {
      fChart.data.datasets[0].unit = "percent";
      fChart.options.scales.y.title.text = "Change (%)";
      fChart.update("none");
    }
    document.querySelectorAll("#fineDeltas b").forEach((value) => {
      value.textContent = value.textContent.replace(" pts", "%");
    });
  };

  finePrev?.addEventListener("click", () => requestAnimationFrame(syncFineDifferenceView));
  fineNext?.addEventListener("click", () => requestAnimationFrame(syncFineDifferenceView));
  syncFineDifferenceView();

  const computeSection = document.querySelector("#compute");
  const gradcamSection = document.querySelector("#gradcam");
  if (computeSection && gradcamSection) gradcamSection.insertAdjacentElement("afterend", computeSection);

  const closeMenu = () => {
    navigation.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Open navigation menu");
    document.body.classList.remove("menu-open");
    navigation.querySelectorAll("details[open]").forEach((menu) => menu.removeAttribute("open"));
  };

  const dropdowns = Array.from(navigation.querySelectorAll(".nav-dropdown"));
  const closeDropdowns = (except = null) => dropdowns.forEach((menu) => { if (menu !== except) menu.removeAttribute("open"); });
  dropdowns.forEach((menu) => menu.addEventListener("toggle", () => { if (menu.open) closeDropdowns(menu); }));

  button.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
    button.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    document.body.classList.toggle("menu-open", isOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (!event.target.closest("a")) return;
    if (mobileQuery.matches) closeMenu(); else closeDropdowns();
  });
  document.addEventListener("pointerdown", (event) => { if (!navigation.contains(event.target) && !button.contains(event.target)) closeMenu(); });
  document.addEventListener("focusin", (event) => { if (!navigation.contains(event.target) && !button.contains(event.target)) closeDropdowns(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") { closeMenu(); button.focus(); } });
  mobileQuery.addEventListener("change", (event) => { if (!event.matches) closeMenu(); });
  window.addEventListener("scroll", closeMenu, { passive: true });
  window.addEventListener("resize", closeMenu, { passive: true });
  window.addEventListener("orientationchange", closeMenu);
  window.addEventListener("hashchange", closeMenu);
  window.addEventListener("pagehide", closeMenu);
});