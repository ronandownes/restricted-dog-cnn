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
  const fullscreenButton = document.querySelector("#fullscreen-button");
  const openButton = document.querySelector("#open-button");
  const downloadButton = document.querySelector("#download-button");
  const previousPageButton = document.querySelector("#pdf-previous");
  const nextPageButton = document.querySelector("#pdf-next");
  const currentPageLabel = document.querySelector("#pdf-current-page");
  const totalPagesLabel = document.querySelector("#pdf-total-pages");
  let selectedKey = "report";
  let currentPage = 1;

  const displayPage = (page, focusViewer = false) => {
    const selected = documents[selectedKey];
    currentPage = Math.max(1, Math.min(selected.pages, page));
    const pdfUrl = `docs/${selected.file}`;
    viewer.src = `${pdfUrl}#page=${currentPage}&view=FitH`;
    currentPageLabel.textContent = String(currentPage);
    totalPagesLabel.textContent = String(selected.pages);
    previousPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === selected.pages;
    if (focusViewer) viewer.focus();
  };

  const selectDocument = (key, updateAddress = true) => {
    selectedKey = documents[key] ? key : "report";
    const selected = documents[selectedKey];
    const pdfUrl = `docs/${selected.file}`;
    currentPage = 1;

    title.textContent = selected.title;
    description.textContent = selected.description;
    viewer.title = `${selected.title} PDF viewer`;
    openButton.href = pdfUrl;
    downloadButton.href = pdfUrl;
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
    displayPage(1);
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
      event.preventDefault();
      displayPage(currentPage + 1);
    } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
      event.preventDefault();
      displayPage(currentPage - 1);
    } else if (event.key.toLowerCase() === "f") {
      event.preventDefault();
      toggleFullscreen();
    }
  });

  document.addEventListener("fullscreenchange", () => {
    fullscreenButton.textContent = document.fullscreenElement ? "Exit full screen" : "Full screen";
  });

  const requested = new URLSearchParams(window.location.search).get("document");
  selectDocument(documents[requested] ? requested : "report", false);
});
