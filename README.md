# Restricted Dog Image Classification Using CNN Transfer Learning

## LaTeX documents

The complete report, poster, presentation and slide sources are maintained in [`latex/`](latex/README.md). GitHub Actions compiles all four documents automatically and refreshes the PDFs in [`docs/`](docs/), so the project does not depend on Overleaf.

**Benchmarking ImageNet-pretrained convolutional neural networks for restricted-versus-unrestricted dog image classification**

**Ronan Downes**  
MSc in Data Analytics, CCT College Dublin  
Supervisor: Sam Weiss

---

## Project Overview

This repository contains the experimental implementation and supporting
artefacts for an MSc Data Analytics dissertation investigating transfer
learning for binary dog-image classification.

A classification task was constructed from the **Stanford Dogs dataset**
using six restricted breeds represented in the dataset and 24 reproducibly
selected unrestricted breeds.

Six ImageNet-pretrained convolutional neural networks were evaluated as
frozen feature extractors under a common experimental pipeline:

- VGG16
- ResNet50
- InceptionV3
- Xception
- InceptionResNetV2
- NASNetMobile

The strongest frozen model was then fine-tuned by unfreezing its final
20 layers. Model behaviour was subsequently examined using Grad-CAM.

The project focuses on controlled benchmarking, reproducibility,
metric-aware evaluation and critical interpretation of model outputs.

---

## Research Questions

The study addresses five questions:

1. How well do six frozen ImageNet-pretrained CNNs distinguish the
   constructed restricted and unrestricted classes under a common pipeline?

2. Which architecture provides the strongest balance of precision,
   recall, F1, PR-AUC and MCC?

3. What changes after limited fine-tuning of the strongest frozen model,
   particularly in the false-positive/false-negative trade-off?

4. What do Grad-CAM visualisations reveal about image regions associated
   with correct and incorrect predictions?

5. Why can the experimental classifier not be treated as an autonomous
   legal breed-identification system?

---

## Dataset Construction

The experiment uses the **Stanford Dogs dataset**, which contains images
from 120 dog breeds.

The constructed binary dataset contains:

| Class | Breeds |
|---|---:|
| Restricted | 6 |
| Unrestricted | 24 |
| **Total** | **30** |

The restricted breeds represented in the dataset are:

- Bull Mastiff
- Doberman Pinscher
- German Shepherd
- Rhodesian Ridgeback
- Rottweiler
- Staffordshire Bull Terrier

The 24 unrestricted breeds were reproducibly selected from the remaining
Stanford Dogs categories.

The original image dataset is **not distributed in this repository**.
The data-preparation notebook reconstructs the experimental dataset from
the source data.

---

## Experimental Pipeline

```text
Stanford Dogs
      │
      ▼
Dataset Construction
      │
      ▼
Preprocessing and Augmentation
      │
      ▼
Six Frozen ImageNet CNNs
      │
      ▼
Multi-Metric Evaluation
      │
      ▼
InceptionResNetV2
      │
      ▼
Limited Fine-Tuning
      │
      ▼
Held-Out Test Evaluation
      │
      ▼
Grad-CAM Analysis
```

The same prepared data splits and common classification strategy were
used to support controlled comparison between architectures.

---

## Frozen CNN Benchmark

The six pretrained architectures were first evaluated with their
ImageNet feature backbones frozen.

| CNN | Accuracy | Precision | Recall | F1 |
|---|---:|---:|---:|---:|
| VGG16 | 87.4% | 60.3% | 92.1% | 72.9% |
| ResNet50 | 91.7% | 70.9% | 93.7% | 80.7% |
| InceptionV3 | 96.1% | 84.4% | 96.8% | 90.2% |
| Xception | 96.0% | 83.7% | 97.4% | 90.0% |
| **InceptionResNetV2** | **96.8%** | **86.9%** | **97.4%** | **91.8%** |
| NASNetMobile | 94.8% | 79.9% | 96.3% | 87.4% |

**InceptionResNetV2 was selected as the strongest frozen architecture
for subsequent fine-tuning.**

The complete saved evaluation gives the selected frozen model an
accuracy of **97.08%**, recall of **98.42%**, and F1 score of **92.57%**.

---

## Fine-Tuning

The selected InceptionResNetV2 model was fine-tuned using:

- final 20 layers unfrozen
- learning rate of `1e-5`
- maximum of 15 epochs
- class weighting
- early stopping
- best-validation checkpoint retention

### Frozen vs Fine-Tuned InceptionResNetV2

| Metric | Frozen | Fine-Tuned |
|---|---:|---:|
| Accuracy | 97.08% | **98.25%** |
| Precision | 87.38% | **93.88%** |
| Recall | **98.42%** | 96.84% |
| F1 | 92.57% | **95.34%** |
| MCC | 0.9101 | **0.9428** |

Fine-tuning therefore changed the error trade-off rather than improving
every metric uniformly.

The fine-tuned model produced:

- **826 true negatives**
- **12 false positives**
- **6 false negatives**
- **184 true positives**

Compared with the frozen model, fine-tuning substantially reduced false
positives while introducing three additional false negatives.

---

## Model Explainability

Grad-CAM was used as a post-hoc visual diagnostic for fixed examples
representing:

- true positives
- true negatives
- false positives
- false negatives

The resulting heatmaps frequently overlapped the dog itself, but some
predictions also appeared to be influenced by pose, scale, contrast and
background structure.

Grad-CAM visualisations indicate regions associated with a prediction.
They **do not provide causal, behavioural or legal explanations**.

---

## Repository Structure

```text
restricted-dog-cnn/
│
├── README.md
├── .gitignore
├── requirements.txt
│
├── benchmark/
│   └── frozen-model benchmark artefacts
│
├── data/
│   └── dataset metadata and reproducibility artefacts
│
├── docs/
│   ├── dissertation
│   ├── research poster
│   └── viva presentation
│
├── fine_tuning/
│   └── fine-tuning results and figures
│
├── gradcam/
│   └── Grad-CAM explanation outputs
│
└── notebooks/
    ├── 01_Data_Preparation.ipynb
    ├── 02_Frozen_Model_Benchmarking.ipynb
    ├── 03_Fine_Tuning.ipynb
    └── 04_GradCAM.ipynb
```

Exact filenames may differ slightly from the abbreviated names above.

---

## Notebook Execution Order

Run the notebooks in the following order:

```text
01_Data_Preparation.ipynb
          ↓
02_Frozen_Model_Benchmarking.ipynb
          ↓
03_Fine_Tuning.ipynb
          ↓
04_GradCAM.ipynb
```

The notebooks form a staged pipeline: dataset preparation precedes
benchmarking, and the selected trained model is required for subsequent
fine-tuning and explanation.

---

## Evaluation Strategy

Performance was assessed using multiple complementary measures rather
than accuracy alone:

- Accuracy
- Precision
- Recall
- F1
- ROC-AUC
- PR-AUC
- Matthews Correlation Coefficient (MCC)
- Confusion-matrix counts

This is particularly important because the constructed dataset is
imbalanced and false positives and false negatives have different
interpretive consequences.

---

## Reproducibility

The repository preserves the executable notebooks and selected research
artefacts required to understand and reproduce the experimental workflow.

Large datasets, temporary runtime files and large trained-model
checkpoints are deliberately excluded from normal Git version control.

The project was developed primarily using Python, TensorFlow/Keras and
Jupyter/Google Colab GPU environments.

---

## Dissertation, Poster and Presentation

The `docs/` directory contains the principal academic outputs associated
with the project:

- MSc dissertation
- research poster
- viva presentation slides

These provide the full methodological, theoretical and ethical context
for the experimental work contained in the notebooks.

---

## Scope and Ethical Boundary

This repository documents an **academic image-classification experiment**.

The classifier cannot establish:

- legal breed identity
- genetic ancestry
- behaviour
- temperament
- dangerousness

Some legally relevant dog breeds and types are not represented in the
Stanford Dogs dataset, and the experimental data do not represent the
full diversity of dogs encountered in real-world conditions.

High predictive performance on this controlled dataset therefore does
**not** justify autonomous enforcement or other high-stakes deployment.

---

## Technologies

- Python
- TensorFlow
- Keras
- Jupyter Notebook
- Google Colab
- NumPy
- Pandas
- scikit-learn
- Matplotlib
- OpenCV
- Grad-CAM

---

## Academic Context

This repository accompanies the dissertation:

**Restricted Dog Breed Classification Using Deep Learning and Public Image Datasets**

MSc in Data Analytics  
CCT College Dublin  
2026

---

## Citation

If referencing this project academically:

> Downes, R. (2026). *Restricted Dog Breed Classification Using Deep
> Learning and Public Image Datasets*. MSc in Data Analytics,
> CCT College Dublin.

---

## Author

**Ronan Downes**  
MSc in Data Analytics  
CCT College Dublin
