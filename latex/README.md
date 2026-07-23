# LaTeX documents

This directory is the authoritative source for the project documents:

- `proposal/main.tex` builds `docs/dog_cnn_research_proposal.pdf`;
- `report.tex` builds `docs/dog_cnn_report.pdf`;
- `poster.tex` builds `docs/dog_cnn_poster.pdf`;
- `presentation.tex` builds `docs/dog_cnn_presentation.pdf`;
- `slides.tex` builds `docs/dog_cnn_slides.pdf`.

The proposal keeps its original sections, bibliography, cover and Wikimedia-sourced images together in `latex/proposal/`. The completed report chapters, appendices, tables, references and editable TikZ diagram sources are stored alongside the four root documents.

## Local editing and compilation

From the repository root in PowerShell:

```powershell
.\latex\build-local.ps1 report
```

Replace `report` with `proposal`, `poster`, `presentation`, `slides` or `all`. The script prepares the figures, compiles the requested document and copies the finished PDF into `docs/`.

After the first preparation run, LaTeX Workshop can also compile the root `.tex` file directly while you edit. Overleaf is not required.

The local script uses MiKTeX's `pdflatex` and `bibtex` commands directly. It does not use `latexmk`, so Perl is not required.

## Manual GitHub build

Pushing LaTeX source does not regenerate the public PDFs. When a public rebuild is wanted:

1. open the repository's **Actions** tab;
2. select **Build LaTeX documents**;
3. choose **Run workflow**.

That manual workflow collects the figures, compiles all five documents, uploads the five-PDF artifact and refreshes the corresponding files in `docs/`. Visitors only receive the last completed PDFs; opening one never starts a build.
