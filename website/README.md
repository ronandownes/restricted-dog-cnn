# Website files

This folder contains a static HTML/CSS/JavaScript web report for the
`restricted-dog-cnn` GitHub repository.

## Files

- `index.html` — landing page and web report
- `styles.css` — responsive styling
- `app.js` — interactive six-model benchmark stepper

## Recommended location in the repository

Copy these three files into:

```text
website/
├── index.html
├── styles.css
└── app.js
```

The relative links in `index.html` assume the existing repository structure:

```text
restricted-dog-cnn/
├── docs/
├── notebooks/
└── website/
```

## Benchmark interaction

The benchmark reveals models sequentially:

1. VGG16
2. ResNet50
3. InceptionV3
4. Xception
5. InceptionResNetV2
6. NASNetMobile

The accompanying commentary compares each newly revealed model with the previous one.
The final step explicitly highlights that NASNetMobile, although historically later, performs
worse than InceptionResNetV2 on all four headline metrics for this particular task.

## Next enhancement

Copy the existing Grad-CAM PNG files into `website/assets/gradcam/` and replace the
placeholder explainability section with a filterable gallery.
