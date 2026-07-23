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
  const viewer = document.querySelector("#document-viewer");
  const stage = document.querySelector("#document-stage");
  const fullscreenButton = document.querySelector("#fullscreen-button");
  const openButton = document.querySelector("#open-button");
  const downloadButton = document.querySelector("#download-button");

  const selectDocument = (key, updateAddress = true) => {
    const selected = documents[key] || documents.report;
    const pdfUrl = `https://raw.githubusercontent.com/ronandownes/restricted-dog-cnn/main/docs/${selected.file}`;

    title.textContent = selected.title;
    description.textContent = selected.description;
    viewer.data = `${pdfUrl}#view=FitH`;
    viewer.setAttribute("aria-label", `${selected.title} PDF viewer`);
    openButton.href = pdfUrl;
    downloadButton.href = pdfUrl;
    downloadButton.setAttribute("download", selected.file);

    tabs.forEach((tab) => {
      const active = tab.dataset.document === key;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });

    if (updateAddress) {
      const url = new URL(window.location);
      url.searchParams.set("document", key);
      window.history.replaceState({}, "", url);
    }
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => selectDocument(tab.dataset.document));
  });

  fullscreenButton.addEventListener("click", async () => {
    if (!document.fullscreenElement) {
      try {
        await stage.requestFullscreen();
      } catch {
        window.open(openButton.href, "_blank", "noopener");
      }
    } else {
      await document.exitFullscreen();
    }
  });

  document.addEventListener("fullscreenchange", () => {
    fullscreenButton.textContent = document.fullscreenElement ? "Exit full screen" : "Full screen";
  });

  const requested = new URLSearchParams(window.location.search).get("document");
  selectDocument(documents[requested] ? requested : "report", false);
});
