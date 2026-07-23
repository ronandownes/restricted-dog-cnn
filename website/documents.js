import * as pdfjsLib from "https://cdn.jsdelivr.net/npm/pdfjs-dist@6.1.200/build/pdf.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@6.1.200/build/pdf.worker.mjs";

const documents = {
  report: {
    title: "Report",
    description: "The complete MSc Data Analytics capstone report.",
    file: "dog_cnn_report.pdf",
    pages: 72
  },
  poster: {
    title: "Poster",
    description: "The research poster summarising the question, method and findings.",
    file: "dog_cnn_poster.pdf",
    pages: 1
  },
  presentation: {
    title: "Presentation",
    description: "The full viva presentation with the project narrative and evidence.",
    file: "dog_cnn_presentation.pdf",
    pages: 64
  },
  slides: {
    title: "Slides",
    description: "The concise slide deck for viewing or presenting full screen.",
    file: "dog_cnn_slides.pdf",
    pages: 21
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const tabs = [...document.querySelectorAll("[data-document]")];
  const title = document.querySelector("#document-title");
  const description = document.querySelector("#document-description");
  const viewer = document.querySelector("#document-viewer");
  const stage = document.querySelector("#document-stage");
  const presentation = document.querySelector("#pdf-presentation");
  const canvas = document.querySelector("#pdf-canvas");
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
  let loadedFile = "";
  let renderTask = null;

  const selectedDocument = () => documents[selectedKey];
  const pdfUrl = () => `docs/${selectedDocument().file}`;

  const updatePageControls = () => {
    currentPageLabel.textContent = String(currentPage);
    totalPagesLabel.textContent = String(selectedDocument().pages);
    previousPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === selectedDocument().pages;
  };

  const renderPage = async () => {
    if (!pdfDocument || !document.fullscreenElement) return;
    currentPage = Math.max(1, Math.min(pdfDocument.numPages, currentPage));
    updatePageControls();
    loading.hidden = false;
    loading.textContent = `Rendering page ${currentPage}…`;

    if (renderTask) {
      try { renderTask.cancel(); } catch {}
    }

    const page = await pdfDocument.getPage(currentPage);
    const original = page.getViewport({scale: 1});
    const availableWidth = Math.max(stage.clientWidth - 28, 320);
    const availableHeight = Math.max(stage.clientHeight - 92, 240);
    const fitScale = Math.min(availableWidth / original.width, availableHeight / original.height);
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const viewport = page.getViewport({scale: fitScale});

    canvas.width = Math.floor(viewport.width * pixelRatio);
    canvas.height = Math.floor(viewport.height * pixelRatio);
    canvas.style.width = `${Math.floor(viewport.width)}px`;
    canvas.style.height = `${Math.floor(viewport.height)}px`;

    const context = canvas.getContext("2d", {alpha: false});
    renderTask = page.render({
      canvasContext: context,
      viewport,
      transform: pixelRatio === 1 ? null : [pixelRatio, 0, 0, pixelRatio, 0, 0]
    });
    try {
      await renderTask.promise;
      loading.hidden = true;
    } catch (error) {
      if (error?.name !== "RenderingCancelledException") {
        loading.textContent = "This page could not be rendered. Select Open PDF to use Chrome’s viewer.";
      }
    } finally {
      renderTask = null;
    }
  };

  const loadPresentation = async () => {
    presentation.hidden = false;
    viewer.hidden = true;
    loading.hidden = false;
    loading.textContent = "Preparing full-screen PDF…";
    try {
      if (!pdfDocument || loadedFile !== selectedDocument().file) {
        pdfDocument = await pdfjsLib.getDocument(pdfUrl()).promise;
        loadedFile = selectedDocument().file;
        selectedDocument().pages = pdfDocument.numPages;
      }
      await renderPage();
    } catch {
      loading.textContent = "Presentation view could not load. Press Esc and select Open PDF.";
    }
  };

  const showBrowserViewer = () => {
    presentation.hidden = true;
    viewer.hidden = false;
  };

  const displayPage = async (page) => {
    currentPage = Math.max(1, Math.min(selectedDocument().pages, page));
    updatePageControls();
    if (document.fullscreenElement) {
      await renderPage();
    }
  };

  const selectDocument = (key, updateAddress = true) => {
    selectedKey = documents[key] ? key : "report";
    const selected = selectedDocument();
    currentPage = 1;
    pdfDocument = null;
    loadedFile = "";

    title.textContent = selected.title;
    description.textContent = selected.description;
    viewer.src = `${pdfUrl()}#page=1&view=FitH`;
    viewer.title = `${selected.title} PDF viewer`;
    openButton.href = pdfUrl();
    downloadButton.href = pdfUrl();
    downloadButton.setAttribute("download", selected.file);
    updatePageControls();

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
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => selectDocument(tab.dataset.document));
  });

  previousPageButton.addEventListener("click", () => displayPage(currentPage - 1));
  nextPageButton.addEventListener("click", () => displayPage(currentPage + 1));

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
      if (!document.fullscreenElement) return;
      event.preventDefault();
      displayPage(currentPage + 1);
    } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
      if (!document.fullscreenElement) return;
      event.preventDefault();
      displayPage(currentPage - 1);
    } else if (event.key.toLowerCase() === "f") {
      event.preventDefault();
      toggleFullscreen();
    }
  });

  document.addEventListener("fullscreenchange", async () => {
    const active = Boolean(document.fullscreenElement);
    fullscreenButton.textContent = active ? "Exit full screen" : "Full screen";
    if (active) {
      await loadPresentation();
    } else {
      showBrowserViewer();
    }
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    if (!document.fullscreenElement) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(renderPage, 120);
  });

  const requested = new URLSearchParams(window.location.search).get("document");
  selectDocument(documents[requested] ? requested : "report", false);
});
