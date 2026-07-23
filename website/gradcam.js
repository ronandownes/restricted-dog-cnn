const RAW='https://raw.githubusercontent.com/ronandownes/restricted-dog-cnn/main';
const cases=[
['FN','Staffordshire Bull Terrier','FN_staffordshire_bullterrier_n02093256_2987_gradcam.png','A restricted-class image that the model missed. Inspect whether attention falls on weak or ambiguous breed evidence.'],
['FN','Staffordshire Bull Terrier','FN_staffordshire_bullterrier_n02093256_5325_gradcam.png','The heatmap helps test whether pose, crop or background competed with the dog’s morphology.'],
['FN','Staffordshire Bull Terrier','FN_staffordshire_bullterrier_n02093256_5988_gradcam.png','A second kind of miss: relevant regions may be present without producing a sufficiently strong restricted score.'],
['FP','Black-and-tan Coonhound','FP_black-and-tan_coonhound_n02089078_1454_gradcam.png','A false restricted prediction. Shared head, coat or body features may resemble evidence learned from restricted breeds.'],
['FP','Kelpie','FP_kelpie_n02105412_7370_gradcam.png','The map can expose reliance on silhouette, ears or contextual structure rather than a uniquely diagnostic feature.'],
['FP','Weimaraner','FP_weimaraner_n02092339_3028_gradcam.png','Body shape, pose, coat contrast and contextual structure may have contributed to this false positive.'],
['TN','Curly-coated Retriever','TN_curly-coated_retriever_n02099429_1465_gradcam.png','A correctly unrestricted prediction. The map shows where evidence supporting that outcome was concentrated.'],
['TN','Greater Swiss Mountain Dog','TN_greater_swiss_mountain_dog_n02107574_2662_gradcam.png','Correct classification does not guarantee sound reasoning; background and co-occurring features still deserve inspection.'],
['TN','Kelpie','TN_kelpie_n02105412_7810_gradcam.png','Compare this correct Kelpie case with the false-positive Kelpie to see how image context can alter model attention.'],
['TP','German Shepherd','TP_german_shepherd_n02106662_13368_gradcam.png','Attention concentrated around the head and ears in this correctly restricted prediction.'],
['TP','Rottweiler','TP_rottweiler_n02106550_4962_gradcam.png','A correct restricted prediction; inspect whether the strongest regions align with the dog rather than its surroundings.'],
['TP','Staffordshire Bull Terrier','TP_staffordshire_bullterrier_n02093256_8205_gradcam.png','Compare this successful detection with the three missed Staffordshire Bull Terrier examples.']
];
document.addEventListener('DOMContentLoaded',()=>{
  const gallery=document.getElementById('gallery');
  const labels={TP:'True positive',TN:'True negative',FP:'False positive',FN:'False negative'};
  gallery.innerHTML=cases.map(([cat,breed,file,note])=>{const url=`${RAW}/gradcam/figures/${file}`;return `<article class="card gradcam-case" data-cat="${cat}"><a href="${url}" target="_blank" rel="noopener"><img src="${url}" alt="${labels[cat]}: ${breed}" loading="lazy"></a><div class="card-copy"><span class="tag ${cat}">${labels[cat]}</span><h2>${breed}</h2><p>${note}</p><a href="metrics.html#confusion-matrix">Review ${cat} terminology →</a></div></article>`}).join('');
  document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{
    document.querySelectorAll('.filter').forEach(item=>item.classList.remove('active'));
    button.classList.add('active');
    document.querySelectorAll('.gradcam-case').forEach(card=>card.hidden=button.dataset.f!=='all'&&card.dataset.cat!==button.dataset.f);
  }));
});
