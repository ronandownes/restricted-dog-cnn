import * as pdfjsLib from "https://cdn.jsdelivr.net/npm/pdfjs-dist@6.1.200/build/pdf.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@6.1.200/build/pdf.worker.mjs";

const documents = {
  report: {
    title: "Report",
    description: "The complete MSc Data Analytics capstone report.",
    file: "dog_cnn_report.pdf"
  },
  poster: {
    title: "Poster",
    description: "The research poster summarising the question, method and findings.",
    file: "dog_cnn_poster.pdf"
  },
  presentation: {
    title: "Presentation",
    description: "The full viva presentation with the project narrative and evidence.",
    file: "dog_cnn_presentation.pdf"
  },
  slides: {
    title: "Slides",
    description: "The concise slide deck for viewing or presenting full screen.",
    file: "dog_cnn_slides.pdf"
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const tabs = [...document.querySelectorAll("[data-document]")];
  const title = document.querySelector("#document-title");
  const description = document.querySelector("#document-description");
  const stage = document.querySelector("#document-stage");
  const presentation = document.querySelector("#pdf-presentation");
  const pagesContainer = document.querySelector("#pdf-pages");
  const loading = document.querySelector("#pdf-loading");
  const fullscreenButton = document.querySelector("#fullscreen-button");
  const openButton = document.querySelector("#open-button");
  const downloadButton = document.querySelector("#download-button");
  const previousPageButton = document.querySelector("#pdf-previous");
  const nextPageButton = document.querySelector("#pdf-next");
  const currentPageLabel = document.querySelector("#pdf-current-page");
  const totalPagesLabel = document.querySelector("#pdf-total-pages");

  let selectedKey = "report";
  let currentPage = 1;
  let pdfDocument = null;
  let loadingTask = null;
  let pageObserver = null;
  let renderObserver = null;
  let loadSequence = 0;

  const selectedDocument = () => documents[selectedKey];
  const pdfUrl = () => `docs/${selectedDocument().file}`;

  const updatePageControls = () => {
    const total = pdfDocument?.numPages || 1;
    currentPageLabel.textContent = String(currentPage);
    totalPagesLabel.textContent = String(total);
    previousPageButton.disabled = currentPage <= 1;
    nextPageButton.disabled = currentPage >= total;
  };

  const renderPage = async (holder) => {
    if (!pdfDocument || holder.dataset.rendered === "true" || holder.dataset.rendering === "true") return;
    holder.dataset.rendering = "true";
    const pageNumber = Number(holder.dataset.page);
    try {
      const page = await pdfDocument.getPage(pageNumber);
      const original = page.getViewport({scale: 1});
      const displayWidth = Math.max(holder.clientWidth, 280);
      const scale = displayWidth / original.width;
      const viewport = page.getViewport({scale});
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const canvas = holder.querySelector("canvas");
      const context = canvas.getContext("2d", {alpha: false});

      canvas.width = Math.floor(viewport.width * pixelRatio);
      canvas.height = Math.floor(viewport.height * pixelRatio);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      await page.render({
        canvasContext: context,
        viewport,
        transform: pixelRatio === 1 ? null : [pixelRatio, 0, 0, pixelRatio, 0, 0]
      }).promise;
      holder.dataset.rendered = "true";
      holder.classList.add("rendered");
    } catch {
      holder.querySelector(".pdf-page-placeholder").textContent = `Page ${pageNumber} could not be rendered`;
    } finally {
      holder.dataset.rendering = "false";
    }
  };

  const createContinuousPages = async (sequence) => {
    const firstPage = await pdfDocument.getPage(1);
    if (sequence !== loadSequence) return;
    const firstViewport = firstPage.getViewport({scale: 1});
    const ratio = `${firstViewport.width} / ${firstViewport.height}`;
    const fragment = document.createDocumentFragment();

    for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber += 1) {
      const holder = document.createElement("section");
      holder.className = "pdf-page";
      holder.dataset.page = String(pageNumber);
      holder.style.aspectRatio = ratio;
      holder.innerHTML = `<span class="pdf-page-placeholder">Page ${pageNumber}</span><canvas aria-label="${selectedDocument().title}, page ${pageNumber}"></canvas><small>${pageNumber}</small>`;
      fragment.appendChild(holder);
    }

    pagesContainer.replaceChildren(fragment);
    loading.hidden = true;
    currentPage = 1;
    updatePageControls();

    renderObserver?.disconnect();
    renderObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) renderPage(entry.target);
      });
    }, {root: presentation, rootMargin: "1200px 0px", threshold: 0.01});

    pageObserver?.disconnect();
    pageObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (!visible.length) return;
      currentPage = Number(visible[0].target.dataset.page);
      updatePageControls();
    }, {root: presentation, threshold: [0.25, 0.5, 0.75]});

    pagesContainer.querySelectorAll(".pdf-page").forEach((holder) => {
      renderObserver.observe(holder);
      pageObserver.observe(holder);
    });
    renderPage(pagesContainer.querySelector(".pdf-page"));
  };

  const loadDocument = async () => {
    const sequence = ++loadSequence;
    pageObserver?.disconnect();
    renderObserver?.disconnect();
    pagesContainer.replaceChildren();
    loading.hidden = false;
    loading.innerHTML = `<strong>Loading ${selectedDocument().title}</strong><span>Reading the compiled PDF without changing it.</span><i><b></b></i>`;

    try {
      loadingTask?.destroy();
      loadingTask = pdfjsLib.getDocument(pdfUrl());
      loadingTask.onProgress = ({loaded, total}) => {
        if (sequence !== loadSequence) return;
        const percent = total ? Math.min(loaded / total * 100, 100) : 25;
        const amount = total ? `${Math.round(percent)}%` : `${(loaded / 1048576).toFixed(1)} MB`;
        loading.innerHTML = `<strong>Loading ${selectedDocument().title}</strong><span>${amount} · compiled LaTeX PDF</span><i><b style="width:${percent}%"></b></i>`;
      };
      pdfDocument = await loadingTask.promise;
      if (sequence !== loadSequence) return;
      await createContinuousPages(sequence);
    } catch {
      if (sequence !== loadSequence) return;
      loading.innerHTML = `The continuous reader could not load this PDF. <a href="${pdfUrl()}" target="_blank" rel="noopener">Open the PDF directly ↗</a>`;
    }
  };

  const scrollToPage = (page) => {
    if (!pdfDocument) return;
    const targetPage = Math.max(1, Math.min(pdfDocument.numPages, page));
    const holder = pagesContainer.querySelector(`[data-page="${targetPage}"]`);
    if (!holder) return;
    currentPage = targetPage;
    updatePageControls();
    renderPage(holder);
    holder.scrollIntoView({behavior: "smooth", block: "start"});
  };

  const selectDocument = (key, updateAddress = true) => {
    selectedKey = documents[key] ? key : "report";
    const selected = selectedDocument();
    currentPage = 1;
    pdfDocument = null;

    title.textContent = selected.title;
    description.textContent = selected.description;
    openButton.href = pdfUrl();
    downloadButton.href = pdfUrl();
    downloadButton.setAttribute("download", selected.file);

    tabs.forEach((tab) => {
      const active = tab.dataset.document === selectedKey;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });

    if (updateAddress) {
      const url = new URL(window.location);
      url.searchParams.set("document", selectedKey);
      window.history.replaceState({}, "", url);
    }
    presentation.scrollTop = 0;
    loadDocument();
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => selectDocument(tab.dataset.document));
  });
  previousPageButton.addEventListener("click", () => scrollToPage(currentPage - 1));
  nextPageButton.addEventListener("click", () => scrollToPage(currentPage + 1));

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await stage.requestFullscreen();
      } catch {
        window.open(openButton.href, "_blank", "noopener");
      }
    } else {
      await document.exitFullscreen();
    }
  };

  fullscreenButton.addEventListener("click", toggleFullscreen);

  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const tag = event.target?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
      event.preventDefault();
      scrollToPage(currentPage + 1);
    } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
      event.preventDefault();
      scrollToPage(currentPage - 1);
    } else if (event.key.toLowerCase() === "f") {
      event.preventDefault();
      toggleFullscreen();
    }
  });

  const rerenderNearbyPages = () => {
    if (!pdfDocument) return;
    for (let page = Math.max(1, currentPage - 1); page <= Math.min(pdfDocument.numPages, currentPage + 1); page += 1) {
      const holder = pagesContainer.querySelector(`[data-page="${page}"]`);
      if (!holder) continue;
      holder.dataset.rendered = "false";
      holder.classList.remove("rendered");
      renderPage(holder);
    }
  };

  document.addEventListener("fullscreenchange", () => {
    fullscreenButton.textContent = document.fullscreenElement ? "Exit full screen" : "Full screen";
    setTimeout(rerenderNearbyPages, 120);
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(rerenderNearbyPages, 180);
  });

  const requested = new URLSearchParams(window.location.search).get("document");
  selectDocument(documents[requested] ? requested : "report", false);
});
