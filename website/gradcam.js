const RAW =
  'https://raw.githubusercontent.com/ronandownes/restricted-dog-cnn/main';

const cases = [
  [
    'FN',
    'Staffordshire Bull Terrier',
    'FN_staffordshire_bullterrier_n02093256_2987_gradcam.png',
    'A restricted-class image that the model missed. Inspect whether attention falls on weak or ambiguous breed evidence.'
  ],
  [
    'FN',
    'Staffordshire Bull Terrier',
    'FN_staffordshire_bullterrier_n02093256_5325_gradcam.png',
    'The heatmap helps test whether pose, crop or background competed with the dog’s morphology.'
  ],
  [
    'FN',
    'Staffordshire Bull Terrier',
    'FN_staffordshire_bullterrier_n02093256_5988_gradcam.png',
    'A second kind of miss: relevant regions may be present without producing a sufficiently strong restricted score.'
  ],
  [
    'FP',
    'Black-and-tan Coonhound',
    'FP_black-and-tan_coonhound_n02089078_1454_gradcam.png',
    'A false restricted prediction. Shared head, coat or body features may resemble evidence learned from restricted breeds.'
  ],
  [
    'FP',
    'Kelpie',
    'FP_kelpie_n02105412_7370_gradcam.png',
    'The map can expose reliance on silhouette, ears or contextual structure rather than a uniquely diagnostic feature.'
  ],
  [
    'FP',
    'Weimaraner',
    'FP_weimaraner_n02092339_3028_gradcam.png',
    'Body shape, pose, coat contrast and contextual structure may have contributed to this false positive.'
  ],
  [
    'TN',
    'Curly-coated Retriever',
    'TN_curly-coated_retriever_n02099429_1465_gradcam.png',
    'A correctly unrestricted prediction. The map shows where evidence supporting that outcome was concentrated.'
  ],
  [
    'TN',
    'Greater Swiss Mountain Dog',
    'TN_greater_swiss_mountain_dog_n02107574_2662_gradcam.png',
    'Correct classification does not guarantee sound reasoning; background and co-occurring features still deserve inspection.'
  ],
  [
    'TN',
    'Kelpie',
    'TN_kelpie_n02105412_7810_gradcam.png',
    'Compare this correct Kelpie case with the false-positive Kelpie to see how image context can alter model attention.'
  ],
  [
    'TP',
    'German Shepherd',
    'TP_german_shepherd_n02106662_13368_gradcam.png',
    'Attention concentrated around the head and ears in this correctly restricted prediction.'
  ],
  [
    'TP',
    'Rottweiler',
    'TP_rottweiler_n02106550_4962_gradcam.png',
    'A correct restricted prediction; inspect whether the strongest regions align with the dog rather than its surroundings.'
  ],
  [
    'TP',
    'Staffordshire Bull Terrier',
    'TP_staffordshire_bullterrier_n02093256_8205_gradcam.png',
    'Compare this successful detection with the three missed Staffordshire Bull Terrier examples.'
  ]
];

document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.getElementById('gallery');

  if (!gallery) {
    console.error('Grad-CAM gallery element not found.');
    return;
  }

  const labels = {
    TP: 'True positive',
    TN: 'True negative',
    FP: 'False positive',
    FN: 'False negative'
  };

  let activeFilter = 'all';
  let filteredCases = [...cases];
  let currentIndex = 0;

  gallery.innerHTML = `
    <section class="gradcam-viewer">

      <div class="gradcam-progress">
        <span id="gradcamCounter"></span>
      </div>

      <div class="gradcam-navigation">
        <button
          id="gradcamPrevious"
          class="gradcam-nav-button"
          type="button"
          aria-label="Show previous Grad-CAM example"
        >
          ← Previous
        </button>

        <button
          id="gradcamNext"
          class="gradcam-nav-button gradcam-next-button"
          type="button"
          aria-label="Show next Grad-CAM example"
        >
          Next →
        </button>
      </div>

      <article class="gradcam-slide" id="gradcamSlide">

        <div class="gradcam-image-wrap">
          <a
            id="gradcamImageLink"
            href="#"
            target="_blank"
            rel="noopener"
          >
            <img
              id="gradcamImage"
              src=""
              alt=""
            >
          </a>
        </div>

        <div class="gradcam-description">
          <span id="gradcamTag" class="tag"></span>

          <h2 id="gradcamBreed"></h2>

          <p id="gradcamNote"></p>

          <a
            id="gradcamTermsLink"
            class="gradcam-terms-link"
            href="metrics.html#confusion-matrix"
          ></a>
        </div>

      </article>

    </section>
  `;

  const image = document.getElementById('gradcamImage');
  const imageLink = document.getElementById('gradcamImageLink');
  const tag = document.getElementById('gradcamTag');
  const breedHeading = document.getElementById('gradcamBreed');
  const noteText = document.getElementById('gradcamNote');
  const termsLink = document.getElementById('gradcamTermsLink');
  const counter = document.getElementById('gradcamCounter');
  const previousButton = document.getElementById('gradcamPrevious');
  const nextButton = document.getElementById('gradcamNext');

  function renderCase() {
    if (filteredCases.length === 0) {
      image.removeAttribute('src');
      image.alt = '';

      imageLink.removeAttribute('href');

      tag.className = 'tag';
      tag.textContent = '';

      breedHeading.textContent = 'No examples available';

      noteText.textContent =
        'There are no Grad-CAM examples in this category.';

      termsLink.textContent = '';
      counter.textContent = '';

      previousButton.disabled = true;
      nextButton.disabled = true;

      return;
    }

    const [category, breed, file, note] =
      filteredCases[currentIndex];

    const url = `${RAW}/gradcam/figures/${file}`;

    image.src = url;
    image.alt = `${labels[category]}: ${breed}`;

    imageLink.href = url;

    tag.className = `tag ${category}`;
    tag.textContent = labels[category];

    breedHeading.textContent = breed;
    noteText.textContent = note;

    termsLink.textContent =
      `Review ${category} terminology →`;

    counter.textContent =
      `${currentIndex + 1} of ${filteredCases.length}`;

    previousButton.disabled =
      filteredCases.length <= 1;

    nextButton.disabled =
      filteredCases.length <= 1;
  }

  function showPreviousCase() {
    if (filteredCases.length <= 1) {
      return;
    }

    currentIndex =
      (
        currentIndex -
        1 +
        filteredCases.length
      ) %
      filteredCases.length;

    renderCase();
  }

  function showNextCase() {
    if (filteredCases.length <= 1) {
      return;
    }

    currentIndex =
      (currentIndex + 1) %
      filteredCases.length;

    renderCase();
  }

  previousButton.addEventListener(
    'click',
    showPreviousCase
  );

  nextButton.addEventListener(
    'click',
    showNextCase
  );

  document.addEventListener('keydown', event => {
    const activeElement =
      document.activeElement;

    const isTyping =
      activeElement &&
      (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.isContentEditable
      );

    if (isTyping) {
      return;
    }

    if (event.key === 'ArrowLeft') {
      showPreviousCase();
    }

    if (event.key === 'ArrowRight') {
      showNextCase();
    }
  });

  document
    .querySelectorAll('.filter')
    .forEach(button => {
      button.addEventListener('click', () => {
        document
          .querySelectorAll('.filter')
          .forEach(item => {
            item.classList.remove('active');
          });

        button.classList.add('active');

        activeFilter =
          button.dataset.f || 'all';

        filteredCases =
          activeFilter === 'all'
            ? [...cases]
            : cases.filter(
                ([category]) =>
                  category === activeFilter
              );

        currentIndex = 0;

        renderCase();
      });
    });

  renderCase();
});