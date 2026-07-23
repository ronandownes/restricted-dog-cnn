const notebooks = {
  data: {
    title: "Notebook 01 · Data Preparation",
    description: "Dataset acquisition, class construction, reproducible sampling and train/validation/test splitting.",
    file: "01_Data_Preparation.ipynb"
  },
  benchmark: {
    title: "Notebook 02 · Frozen Model Benchmarking",
    description: "The six ImageNet-pretrained CNN comparison, including saved metrics, curves and confusion matrices.",
    file: "02_Frozen_Model_Benchmarking.ipynb"
  },
  fine: {
    title: "Notebook 03 · Selected Model Fine-tuning",
    description: "InceptionResNetV2 before and after selective unfreezing, with the saved training and evaluation outputs.",
    file: "03_Selected_Model_Fine_Tuning.ipynb"
  },
  gradcam: {
    title: "Notebook 04 · Grad-CAM Explainability",
    description: "Grad-CAM preparation and class-specific explanation outputs for the selected CNN.",
    file: "04_Model_Explainability.ipynb"
  }
};

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const joinSource = (source) => Array.isArray(source) ? source.join("") : (source || "");

const inlineMarkdown = (value) => escapeHtml(value)
  .replace(/`([^`]+)`/g, "<code>$1</code>")
  .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
  .replace(/\*([^*]+)\*/g, "<em>$1</em>")
  .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1 ↗</a>');

const renderMarkdown = (source) => {
  const lines = joinSource(source).replace(/\r/g, "").split("\n");
  const html = [];
  let paragraph = [];
  let list = null;
  let fenced = false;
  let code = [];

  const flushParagraph = () => {
    if (paragraph.length) html.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
    paragraph = [];
  };
  const closeList = () => {
    if (list) html.push(`</${list}>`);
    list = null;
  };

  lines.forEach((line) => {
    if (line.trim().startsWith("```")) {
      flushParagraph();
      closeList();
      if (fenced) {
        html.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
        code = [];
      }
      fenced = !fenced;
      return;
    }
    if (fenced) {
      code.push(line);
      return;
    }
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      closeList();
      const level = Math.min(heading[1].length + 1, 6);
      html.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      return;
    }
    const bullet = line.match(/^\s*[-*]\s+(.+)$/);
    const numbered = line.match(/^\s*\d+[.)]\s+(.+)$/);
    if (bullet || numbered) {
      flushParagraph();
      const wanted = bullet ? "ul" : "ol";
      if (list !== wanted) {
        closeList();
        list = wanted;
        html.push(`<${list}>`);
      }
      html.push(`<li>${inlineMarkdown((bullet || numbered)[1])}</li>`);
      return;
    }
    if (!line.trim()) {
      flushParagraph();
      closeList();
      return;
    }
    paragraph.push(line.trim());
  });
  flushParagraph();
  closeList();
  return html.join("");
};

const renderOutput = (output) => {
  if (output.output_type === "stream") {
    return `<pre class="output-stream">${escapeHtml(joinSource(output.text))}</pre>`;
  }
  if (output.output_type === "error") {
    return `<pre class="output-error">${escapeHtml((output.traceback || []).join("\n"))}</pre>`;
  }
  const data = output.data || {};
  if (data["image/png"]) {
    return `<img class="notebook-output-image" src="data:image/png;base64,${joinSource(data["image/png"]).replace(/\s/g, "")}" alt="Saved notebook chart or visual output">`;
  }
  if (data["image/jpeg"]) {
    return `<img class="notebook-output-image" src="data:image/jpeg;base64,${joinSource(data["image/jpeg"]).replace(/\s/g, "")}" alt="Saved notebook visual output">`;
  }
  if (data["text/html"]) {
    return `<div class="notebook-html-output">${joinSource(data["text/html"])}</div>`;
  }
  if (data["text/plain"]) {
    return `<pre class="output-plain">${escapeHtml(joinSource(data["text/plain"]))}</pre>`;
  }
  return "";
};

const renderCell = (cell, index) => {
  if (cell.cell_type === "markdown") {
    return `<section class="notebook-cell markdown-cell">${renderMarkdown(cell.source)}</section>`;
  }
  if (cell.cell_type !== "code") return "";
  const execution = cell.execution_count ?? "·";
  const outputs = (cell.outputs || []).map(renderOutput).filter(Boolean).join("");
  return `<section class="notebook-cell code-cell" data-cell="${index}">
    <div class="cell-label">In&nbsp;[${execution}]</div>
    <pre class="cell-source"><code>${escapeHtml(joinSource(cell.source))}</code></pre>
    ${outputs ? `<div class="cell-output"><span>Saved output</span>${outputs}</div>` : ""}
  </section>`;
};

document.addEventListener("DOMContentLoaded", () => {
  const tabs = [...document.querySelectorAll("[data-notebook]")];
  const title = document.querySelector("#notebook-title");
  const description = document.querySelector("#notebook-description");
  const status = document.querySelector("#notebook-status");
  const reader = document.querySelector("#notebook-reader");
  const stage = document.querySelector("#notebook-stage");
  const codeButton = document.querySelector("#code-button");
  const fullscreenButton = document.querySelector("#notebook-fullscreen");
  const sourceButton = document.querySelector("#notebook-source");
  const downloadButton = document.querySelector("#notebook-download");
  let requestNumber = 0;

  const selectNotebook = async (key, updateAddress = true) => {
    const selectedKey = notebooks[key] ? key : "data";
    const selected = notebooks[selectedKey];
    const notebookUrl = `notebooks/${selected.file}`;
    const sourceUrl = `https://github.com/ronandownes/restricted-dog-cnn/blob/main/notebooks/${selected.file}`;
    const currentRequest = ++requestNumber;

    title.textContent = selected.title;
    description.textContent = selected.description;
    sourceButton.href = sourceUrl;
    downloadButton.href = notebookUrl;
    downloadButton.setAttribute("download", selected.file);
    tabs.forEach((tab) => {
      const active = tab.dataset.notebook === selectedKey;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    status.hidden = false;
    status.textContent = "Loading saved notebook…";
    reader.replaceChildren();

    try {
      const response = await fetch(notebookUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const total = Number(response.headers.get("content-length")) || 0;
      let received = 0;
      let notebookText = "";
      if (response.body?.getReader) {
        const readerStream = response.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const {done, value} = await readerStream.read();
          if (done) break;
          received += value.length;
          notebookText += decoder.decode(value, {stream: true});
          if (currentRequest !== requestNumber) {
            await readerStream.cancel();
            return;
          }
          const amount = total ? `${Math.round(received / total * 100)}%` : `${(received / 1048576).toFixed(1)} MB`;
          status.innerHTML = `<strong>Loading ${selected.title}</strong><span>${amount} · reading saved outputs, not running code</span><i><b style="width:${total ? Math.min(received / total * 100, 100) : 35}%"></b></i>`;
        }
        notebookText += decoder.decode();
      } else {
        notebookText = await response.text();
      }
      status.innerHTML = `<strong>Preparing the saved cells…</strong><span>No analysis is being rerun.</span>`;
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const notebook = JSON.parse(notebookText);
      if (currentRequest !== requestNumber) return;
      reader.innerHTML = (notebook.cells || []).map(renderCell).join("");
      status.hidden = true;
      stage.scrollTop = 0;
    } catch (error) {
      status.hidden = false;
      status.innerHTML = `This browser could not load the notebook here. <a href="${sourceUrl}" target="_blank" rel="noopener">Open it on GitHub instead ↗</a>`;
    }

    if (updateAddress) {
      const url = new URL(window.location);
      url.searchParams.set("notebook", selectedKey);
      window.history.replaceState({}, "", url);
    }
  };

  tabs.forEach((tab) => tab.addEventListener("click", () => selectNotebook(tab.dataset.notebook)));

  codeButton.addEventListener("click", () => {
    const hidden = document.body.classList.toggle("notebook-code-hidden");
    codeButton.textContent = hidden ? "Show code" : "Hide code";
    codeButton.setAttribute("aria-pressed", String(hidden));
  });

  fullscreenButton.addEventListener("click", async () => {
    if (!document.fullscreenElement) {
      try {
        await stage.requestFullscreen();
      } catch {
        window.open(sourceButton.href, "_blank", "noopener");
      }
    } else {
      await document.exitFullscreen();
    }
  });

  document.addEventListener("fullscreenchange", () => {
    fullscreenButton.textContent = document.fullscreenElement ? "Exit full screen" : "Full screen";
  });

  const requested = new URLSearchParams(window.location.search).get("notebook");
  selectNotebook(notebooks[requested] ? requested : "data", false);
});
