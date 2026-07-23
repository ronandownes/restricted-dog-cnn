const RAW = 'https://raw.githubusercontent.com/ronandownes/restricted-dog-cnn/main';

const curves = {
  VGG16: {
    title: 'VGG16',
    image: `${RAW}/benchmark/figures/VGG16_learning_curves.png`,
    summary: 'Training and validation accuracy improve together but settle well below the stronger architectures. Loss falls on both splits without a sustained validation reversal. The main story is a lower performance plateau, not severe overfitting.',
    verdict: 'Stable learning, but a comparatively limited plateau'
  },
  ResNet50: {
    title: 'ResNet50',
    image: `${RAW}/benchmark/figures/ResNet50_learning_curves.png`,
    summary: 'The curves show a substantial improvement from the early epochs and then begin to level. Compare the training–validation gap with VGG16 and the stronger Inception-family models before judging generalisation.',
    verdict: 'Clear convergence with a stronger plateau than VGG16'
  },
  InceptionV3: {
    title: 'InceptionV3',
    image: `${RAW}/benchmark/figures/InceptionV3_learning_curves.png`,
    summary: 'Accuracy reaches a high level while loss declines and stabilises. The paired training and validation curves remain close, suggesting that the frozen ImageNet features transfer well to this task.',
    verdict: 'High, well-aligned training and validation performance'
  },
  Xception: {
    title: 'Xception',
    image: `${RAW}/benchmark/figures/Xception_learning_curves.png`,
    summary: 'The model reaches high accuracy and low loss. Read the small fluctuations as part of the overall pattern: the important question is whether validation deteriorates consistently while training continues to improve.',
    verdict: 'Strong convergence with small epoch-to-epoch variation'
  },
  InceptionResNetV2: {
    title: 'InceptionResNetV2',
    image: `${RAW}/benchmark/figures/InceptionResNetV2_learning_curves.png`,
    summary: 'Accuracy rises quickly and the training and validation curves remain close. Both loss curves fall together and remain stable, with no late validation-loss reversal.',
    verdict: 'Strong, stable convergence'
  },
  NASNetMobile: {
    title: 'NASNetMobile',
    image: `${RAW}/benchmark/figures/NASNetMobile_learning_curves.png`,
    summary: 'Training progresses successfully, but the final benchmark metrics remain below InceptionResNetV2. This is a useful reminder that a healthy curve does not guarantee the best comparative test performance.',
    verdict: 'Successful learning, but not the strongest final model'
  },
  FineTuned: {
    title: 'Fine-tuned InceptionResNetV2',
    image: `${RAW}/fine_tuning/figures/FineTuned_InceptionResNetV2_learning_curves.png`,
    summary: 'The fine-tuning stage begins from already useful pretrained features, so accuracy starts high. Training and validation remain close, loss stays low, and there is no sustained divergence as selected deeper layers adapt.',
    verdict: 'Controlled fine-tuning without obvious curve divergence'
  }
};

window.addEventListener('DOMContentLoaded', () => {
  const image = document.getElementById('curveImage');
  const title = document.getElementById('curveTitle');
  const summary = document.getElementById('curveSummary');
  const verdict = document.getElementById('curveVerdict');

  document.querySelectorAll('.curve-choice').forEach(button => {
    button.addEventListener('click', () => {
      const curve = curves[button.dataset.model];
      if (!curve) return;

      document.querySelectorAll('.curve-choice').forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      image.src = curve.image;
      image.alt = `${curve.title} learning curves`;
      title.textContent = curve.title;
      summary.textContent = curve.summary;
      verdict.textContent = curve.verdict;
    });
  });
});
