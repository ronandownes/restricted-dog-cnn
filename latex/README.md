# LaTeX documents

This directory is the authoritative source for the project documents:

- `report.tex` builds `docs/dog_cnn_report.pdf`;
- `poster.tex` builds `docs/dog_cnn_poster.pdf`;
- `presentation.tex` builds `docs/dog_cnn_presentation.pdf`;
- `slides.tex` builds `docs/dog_cnn_slides.pdf`.

The report chapters, appendices, tables, references and editable TikZ diagram sources are stored alongside the four root documents.

## Automatic GitHub build

The workflow at `.github/workflows/build-latex.yml`:

1. collects the existing benchmark, fine-tuning and Grad-CAM figures;
2. compiles the editable TikZ diagrams;
3. compiles all four LaTeX documents;
4. uploads the four PDFs as one workflow artifact;
5. refreshes the corresponding PDFs in `docs/`.

Overleaf is not required. Locally, open the repository in VS Code with LaTeX Workshop and compile any of the four root `.tex` files.
