const RAW='https://raw.githubusercontent.com/ronandownes/restricted-dog-cnn/main';
const colors={Accuracy:'#2c6fb0',Precision:'#d87922',Recall:'#22865a',F1:'#c84444'};
const mutedColors={Accuracy:'#8fb4d8',Precision:'#e7b27d',Recall:'#8cc8ab',F1:'#de9797'};
const models=[
{name:'VGG16',year:'2014 · Uniform deep CNN',input:'224×224',idea:'A simple stack of repeated 3×3 convolutions. Pooling progressively reduces spatial size while the number of learned feature channels grows.',route:['3×3 conv blocks','Max pooling','Deep feature maps'],why:'VGG made depth systematic and easy to understand, but it is comparatively heavy and lacks skip connections.',Accuracy:87.4,Precision:60.3,Recall:92.1,F1:72.9},
{name:'ResNet50',year:'2015 · Residual connections',input:'224×224',idea:'Residual blocks add a shortcut path around several transformations, allowing information and gradients to bypass them.',route:['Stem convolution','Residual blocks','Identity shortcuts'],why:'The network can learn a residual change rather than rebuilding the entire representation at every block, making deeper optimisation more reliable.',Accuracy:91.7,Precision:70.9,Recall:93.7,F1:80.7},
{name:'InceptionV3',year:'2015 · Multi-scale processing',input:'299×299',idea:'Parallel branches examine features using different convolutional paths, then concatenate their outputs.',route:['Parallel branches','Factorised convolutions','Concatenated features'],why:'The model can combine evidence at several effective spatial scales without using one uniformly expensive pathway.',Accuracy:96.1,Precision:84.4,Recall:96.8,F1:90.2},
{name:'Xception',year:'2016 · Separable convolutions',input:'299×299',idea:'Depthwise-separable convolution first filters each channel spatially and then mixes information across channels.',route:['Depthwise spatial filtering','1×1 channel mixing','Residual flow'],why:'Separating spatial and channel processing reduces redundant computation while retaining strong representational capacity.',Accuracy:96.0,Precision:83.7,Recall:97.4,F1:90.0},
{name:'InceptionResNetV2',year:'2016 · Inception + residual',input:'299×299',idea:'Multi-branch Inception processing is combined with residual shortcut connections in a large, expressive feature extractor.',route:['Inception branches','Feature concatenation','Residual addition'],why:'It joins multi-scale representation learning with easier gradient flow. It produced the best frozen balance here and became the fine-tuning backbone.',Accuracy:96.8,Precision:86.9,Recall:97.4,F1:91.8},
{name:'NASNetMobile',year:'2017 · Architecture search',input:'224×224',idea:'Repeated normal and reduction cells were discovered through neural architecture search rather than designed entirely by hand.',route:['Normal cells','Reduction cells','Mobile feature extractor'],why:'It targets efficiency on constrained hardware, but architecture-search pedigree did not make it the best model for this particular dataset.',Accuracy:94.8,Precision:79.9,Recall:96.3,F1:87.4}
];
const cases=[
['FN','Staffordshire Bull Terrier','FN_staffordshire_bullterrier_n02093256_2987_gradcam.png'],['FN','Staffordshire Bull Terrier','FN_staffordshire_bullterrier_n02093256_5325_gradcam.png'],['FN','Staffordshire Bull Terrier','FN_staffordshire_bullterrier_n02093256_5988_gradcam.png'],['FP','Black-and-tan Coonhound','FP_black-and-tan_coonhound_n02089078_1454_gradcam.png'],['FP','Kelpie','FP_kelpie_n02105412_7370_gradcam.png'],['FP','Weimaraner','FP_weimaraner_n02092339_3028_gradcam.png'],['TN','Curly-coated Retriever','TN_curly-coated_retriever_n02099429_1465_gradcam.png'],['TN','Greater Swiss Mountain Dog','TN_greater_swiss_mountain_dog_n02107574_2662_gradcam.png'],['TN','Kelpie','TN_kelpie_n02105412_7810_gradcam.png'],['TP','German Shepherd','TP_german_shepherd_n02106662_13368_gradcam.png'],['TP','Rottweiler','TP_rottweiler_n02106550_4962_gradcam.png'],['TP','Staffordshire Bull Terrier','TP_staffordshire_bullterrier_n02093256_8205_gradcam.png']];
let i=0,fineView=0,bChart,fChart;
const valueLabels={id:'values',afterDatasetsDraw(c){const x=c.ctx;x.save();x.font='800 13px system-ui';x.textAlign='center';x.fillStyle='#122033';c.data.datasets.forEach((d,di)=>c.getDatasetMeta(di).data.forEach((bar,j)=>{if(d.data[j]!=null){const v=Number(d.data[j]),suffix=d.unit==='points'?' pts':'%';x.fillText(`${v>0&&d.unit==='points'?'+':''}${v.toFixed(d.unit==='points'?2:1)}${suffix}`,bar.x,v<0?bar.y+17:bar.y-7)}}));x.restore()}};Chart.register(valueLabels);
function story(n){return [
['Baseline established','VGG16 begins with strong recall, but precision and F1 leave substantial room for improvement.'],
['A clear step forward','ResNet50 improves all four headline metrics, with especially large gains in precision and F1.'],
['The benchmark moves into the mid-90s','InceptionV3 produces another substantial improvement across all four headline metrics.'],
['Newer does not mean uniformly better','Xception raises recall slightly, but accuracy, precision and F1 edge down relative to InceptionV3.'],
['Best frozen balance','InceptionResNetV2 improves accuracy, precision and F1 while recall stays level. It is selected for fine-tuning.'],
['Historical progress is not task-specific progress','NASNetMobile is historically later, yet all four headline metrics decline relative to InceptionResNetV2.']][n]}
function update(){const m=models[i],s=story(i),keys=['Accuracy','Precision','Recall','F1'];count.textContent=`${i+1} of 6`;model.textContent=m.name;year.textContent=m.year;headline.textContent=s[0];commentary.textContent=s[1];prev.disabled=i===0;next.disabled=i===5;tiles.innerHTML=keys.map(k=>`<div class="tile" style="--c:${colors[k]}"><small>${k}</small><b>${m[k].toFixed(1)}%</b></div>`).join('');architecture.innerHTML=`<div><small>HIGH-LEVEL ARCHITECTURE · INPUT ${m.input}</small><h3>${m.name}: what happens inside?</h3><p>${m.idea}</p></div><div class="architecture-route">${m.route.map((x,j)=>`${j?'<i>→</i>':''}<b>${x}</b>`).join('')}</div><p class="architecture-why"><strong>Why it matters:</strong> ${m.why}</p>`;if(i===0)deltas.innerHTML='<div class="delta"><span>Comparison</span><b>Starting point</b></div>';else{const p=models[i-1];deltas.innerHTML=keys.map(k=>{const d=+(m[k]-p[k]).toFixed(1),cl=Math.abs(d)<.05?'':d>0?'up':'down',ar=Math.abs(d)<.05?'→':d>0?'↑':'↓';return `<div class="delta ${cl}"><span>${k} vs ${p.name}</span><b>${ar} ${d>0?'+':''}${d.toFixed(1)} pts</b></div>`}).join('')}bChart.data.datasets[0].data=keys.map(k=>m[k]);bChart.update()}
const metricKeys=['Accuracy','Precision','Recall','F1'];
const frozen=[97.08,87.38,98.42,92.57];
const fineTuned=[98.25,93.88,96.84,95.34];
const differences=fineTuned.map((v,j)=>+(v-frozen[j]).toFixed(2));
const fineViews=[
  {title:'InceptionResNetV2 — frozen CNN base',summary:'Only the new classification head had learned the restricted-dog task.'},
  {title:'InceptionResNetV2 — fine-tuned CNN base',summary:'The result after its final 20 base layers were allowed to adapt.'},
  {title:'Frozen versus fine-tuned',summary:'Muted colours show the frozen-base result; richer colours show the fine-tuned result.'},
  {title:'Change after fine-tuning',summary:'Three metrics improved; recall decreased by 1.58 percentage points.'}
];
function performanceDataset(label,data,backgroundColor){return{label,data,backgroundColor,borderRadius:8,maxBarThickness:88}}
function updateFine(){
  const view=fineViews[fineView];
  fineCount.textContent=`${fineView+1} of 4`;
  fineTitle.textContent=view.title;
  fineSummary.textContent=view.summary;
  finePrev.disabled=fineView===0;
  fineNext.disabled=fineView===3;
  fChart.options.plugins.legend.display=fineView===2;
  if(fineView===0){
    fChart.data.datasets=[performanceDataset('Frozen CNN base',frozen,metricKeys.map(k=>mutedColors[k]))];
    fChart.options.scales.y.min=84;fChart.options.scales.y.max=100;
    fChart.options.scales.y.title.text='Performance before fine-tuning (%)';
    fChart.options.scales.y.ticks.callback=v=>v+'%';
  }else if(fineView===1){
    fChart.data.datasets=[performanceDataset('Fine-tuned CNN base',fineTuned,metricKeys.map(k=>colors[k]))];
    fChart.options.scales.y.min=84;fChart.options.scales.y.max=100;
    fChart.options.scales.y.title.text='Performance after fine-tuning (%)';
    fChart.options.scales.y.ticks.callback=v=>v+'%';
  }else if(fineView===2){
    fChart.data.datasets=[
      performanceDataset('Frozen CNN base',frozen,metricKeys.map(k=>mutedColors[k])),
      performanceDataset('Fine-tuned CNN base',fineTuned,metricKeys.map(k=>colors[k]))
    ];
    fChart.options.scales.y.min=84;fChart.options.scales.y.max=100;
    fChart.options.scales.y.title.text='Test performance (%)';
    fChart.options.scales.y.ticks.callback=v=>v+'%';
  }else{
    fChart.data.datasets=[{label:'Difference',data:differences,unit:'points',backgroundColor:metricKeys.map(k=>colors[k]),borderRadius:8,maxBarThickness:88}];
    fChart.options.scales.y.min=-7;fChart.options.scales.y.max=7;
    fChart.options.scales.y.title.text='Change (percentage points)';
    fChart.options.scales.y.ticks.callback=v=>(v>0?'+':'')+v;
  }
  fChart.update();
}
window.addEventListener('DOMContentLoaded',()=>{
  bChart=new Chart(document.getElementById('benchmarkChart'),{type:'bar',data:{labels:metricKeys,datasets:[{data:[],backgroundColor:metricKeys.map(k=>colors[k]),borderRadius:10,maxBarThickness:88}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{min:55,max:100,ticks:{callback:v=>v+'%'},title:{display:true,text:'Test performance (%)'}},x:{grid:{display:false}}}}});
  fChart=new Chart(document.getElementById('fineChart'),{type:'bar',data:{labels:metricKeys,datasets:[]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',onClick:()=>{}}},scales:{y:{min:84,max:100,ticks:{callback:v=>v+'%'},title:{display:true,text:'Test performance (%)'}},x:{grid:{display:false}}}}});
  const fr={Accuracy:97.08,Precision:87.38,Recall:98.42,F1:92.57},ft={Accuracy:98.25,Precision:93.88,Recall:96.84,F1:95.34};
  fineDeltas.innerHTML=metricKeys.map(k=>{const d=+(ft[k]-fr[k]).toFixed(2),ar=d>0?'↑':'↓';return `<div class="delta metric-change" style="--c:${colors[k]}"><span>${k}</span><b>${ar} ${d>0?'+':''}${d.toFixed(2)} pts</b></div>`}).join('');
  gallery.innerHTML=cases.map(([cat,breed,file])=>{const url=`${RAW}/gradcam/figures/${file}`,lab={TP:'True positive',TN:'True negative',FP:'False positive',FN:'False negative'}[cat];let note='Representative case from the fixed twelve-image explanation sample.';if(file.includes('german_shepherd'))note='Attention concentrated around the head and ears in this correctly restricted prediction.';if(file.includes('weimaraner'))note='Body shape, pose, coat contrast and contextual structure may have contributed to this false positive.';return `<article class="card" data-cat="${cat}"><a href="${url}" target="_blank"><img src="${url}" alt="${lab}: ${breed}" loading="lazy"></a><div class="card-copy"><span class="tag ${cat}">${lab}</span><h3>${breed}</h3><p class="muted">${note}</p></div></article>`}).join('');
  document.querySelectorAll('.filter').forEach(b=>b.onclick=()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.querySelectorAll('.card').forEach(c=>c.hidden=b.dataset.f!=='all'&&c.dataset.cat!==b.dataset.f)});
  prev.onclick=()=>{if(i){i--;update()}};
  next.onclick=()=>{if(i<5){i++;update()}};
  finePrev.onclick=()=>{if(fineView){fineView--;updateFine()}};
  fineNext.onclick=()=>{if(fineView<3){fineView++;updateFine()}};
  update();
  updateFine();
});
