# Web report v2

Replace the existing `website/` folder in your repository with the supplied `website/` folder.
Also copy `.github/workflows/pages.yml` into the repository root.

The site now includes:
- one-model-at-a-time benchmark storytelling;
- exact values printed on the chart;
- previous-model delta indicators;
- fine-tuning comparison with the same visual language;
- HTML-rendered frozen and fine-tuned confusion matrices;
- all 12 Grad-CAM images loaded from the GitHub repository;
- direct links to the executed notebooks and PDFs.

## Go live
After committing and pushing, open GitHub → Settings → Pages and select **GitHub Actions** as the source.
The expected URL is `https://ronandownes.github.io/restricted-dog-cnn/`.
