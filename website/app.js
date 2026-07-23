const RAW='https://raw.githubusercontent.com/ronandownes/restricted-dog-cnn/main';
const colors={Accuracy:'#2c6fb0',Precision:'#d87922',Recall:'#22865a',F1:'#c84444'};
const mutedColors={Accuracy:'#8fb4d8',Precision:'#e7b27d',Recall:'#8cc8ab',F1:'#de9797'};
const architectureSlugs={VGG16:'vgg16',ResNet50:'resnet50',InceptionV3:'inceptionv3',Xception:'xception',InceptionResNetV2:'inceptionresnetv2',NASNetMobile:'nasnetmobile'};
const models=[
{name:'VGG16',year:'2014 · Uniform deep CNN',input:'224×224',idea:'A simple stack of repeated 3×3 convolutions. Pooling progressively reduces spatial size while the number of learned feature channels grows.',route:['3×3 conv blocks','Max pooling','Deep feature maps'],why:'VGG made depth systematic and easy to understand, but it is comparatively heavy and lacks skip connections.',cm:{tn:723,fp:115,fn:15,tp:175},Accuracy:87.4,Precision:60.3,Recall:92.1,F1:72.9},
{name:'ResNet50',year:'2015 · Residual connections',input:'224×224',idea:'Residual blocks add a shortcut path around several transformations, allowing information and gradients to bypass them.',route:['Stem convolution','Residual blocks','Identity shortcuts'],why:'The network can learn a residual change rather than rebuilding the entire representation at every block, making deeper optimisation more reliable.',cm:{tn:765,fp:73,fn:12,tp:178},Accuracy:91.7,Precision:70.9,Recall:93.7,F1:80.7},
{name:'InceptionV3',year:'2015 · Multi-scale processing',input:'299×299',idea:'Parallel branches examine features using different convolutional paths, then concatenate their outputs.',route:['Parallel branches','Factorised convolutions','Concatenated features'],why:'The model can combine evidence at several effective spatial scales without using one uniformly expensive pathway.',cm:{tn:804,fp:34,fn:6,tp:184},Accuracy:96.1,Precision:84.4,Recall:96.8,F1:90.2},
{name:'Xception',year:'2016 · Separable convolutions',input:'299×299',idea:'Depthwise-separable convolution first filters each channel spatially and then mixes information across channels.',route:['Depthwise spatial filtering','1×1 channel mixing','Residual flow'],why:'Separating spatial and channel processing reduces redundant computation while retaining strong representational capacity.',cm:{tn:802,fp:36,fn:5,tp:185},Accuracy:96.0,Precision:83.7,Recall:97.4,F1:90.0},
{name:'InceptionResNetV2',year:'2016 · Inception + residual',input:'299×299',idea:'Multi-branch Inception processing is combined with residual shortcut connections in a large, expressive feature extractor.',route:['Inception branches','Feature concatenation','Residual addition'],why:'It joins multi-scale representation learning with easier gradient flow. It produced the best frozen balance here and became the fine-tuning backbone.',cm:{tn:810,fp:28,fn:5,tp:185},Accuracy:96.8,Precision:86.9,Recall:97.4,F1:91.8},
{name:'NASNetMobile',year:'2017 · Architecture search',input:'224×224',idea:'Repeated normal and reduction cells were discovered through neural architecture search rather than designed entirely by hand.',route:['Normal cells','Reduction cells','Mobile feature extractor'],why:'It targets efficiency on constrained hardware, but architecture-search pedigree did not make it the best model for this particular dataset.',cm:{tn:792,fp:46,fn:7,tp:183},Accuracy:94.8,Precision:79.9,Recall:96.3,F1:87.4}
];
let i=0,fineView=0,bChart,fChart;
const valueLabels={id:'values',afterDatasetsDraw(c){const x=c.ctx;x.save();x.font='800 13px system-ui';x.textAlign='center';x.fillStyle='#122033';c.data.datasets.forEach((d,di)=>c.getDatasetMeta(di).data.forEach((bar,j)=>{if(d.data[j]!=null){const v=Number(d.data[j]),suffix=d.unit==='points'?' pts':'%';x.fillText(`${v>0&&d.unit==='points'?'+':''}${v.toFixed(d.unit==='points'?2:1)}${suffix}`,bar.x,v<0?bar.y+17:bar.y-7)}}));x.restore()}};Chart.register(valueLabels);
function story(n){return [
['Baseline established','VGG16 begins with strong recall, but precision and F1 leave substantial room for improvement.'],
['A clear step forward','ResNet50 improves all four headline metrics, with especially large gains in precision and F1.'],
['The benchmark moves into the mid-90s','InceptionV3 produces another substantial improvement across all four headline metrics.'],
['Newer does not mean uniformly better','Xception raises recall slightly, but accuracy, precision and F1 edge down relative to InceptionV3.'],
['Best frozen balance','InceptionResNetV2 improves accuracy, precision and F1 while recall stays level. It is selected for fine-tuning.'],
['Historical progress is not task-specific progress','NASNetMobile is historically later, yet all four headline metrics decline relative to InceptionResNetV2.']][n]}
function matrixMarkup(cm){return `<div class="matrix-axis top">Predicted class</div><div class="matrix-axis side">True class</div><div class="matrix-labels columns"><span>Unrestricted</span><span>Restricted</span></div><div class="matrix-labels rows"><span>Unrestricted</span><span>Restricted</span></div><div class="matrix-cells"><div class="cm-tn"><small>True negative</small><b>${cm.tn}</b></div><div class="cm-fp"><small>False positive</small><b>${cm.fp}</b></div><div class="cm-fn"><small>False negative</small><b>${cm.fn}</b></div><div class="cm-tp"><small>True positive</small><b>${cm.tp}</b></div></div>`}
function update(){const m=models[i],s=story(i),keys=['Accuracy','Precision','Recall','F1'];count.textContent=`${i+1} of 6`;model.textContent=m.name;year.textContent=m.year;headline.textContent=s[0];commentary.textContent=s[1];prev.disabled=i===0;next.disabled=i===5;tiles.innerHTML=keys.map(k=>`<div class="tile" style="--c:${colors[k]}"><small>${k}</small><b>${m[k].toFixed(1)}%</b></div>`).join('');benchmarkMatrix.innerHTML=matrixMarkup(m.cm);benchmarkCurveTitle.textContent=`${m.name} learning curves`;benchmarkCurveImage.src=`${RAW}/benchmark/figures/${m.name}_learning_curves.png`;benchmarkCurveImage.alt=`${m.name} training and validation accuracy and loss curves`;architecture.innerHTML=`<div><small>HIGH-LEVEL ARCHITECTURE · INPUT ${m.input}</small><h3>${m.name}: what happens inside?</h3><p>${m.idea}</p></div><div class="architecture-route">${m.route.map((x,j)=>`${j?'<i>→</i>':''}<b>${x}</b>`).join('')}</div><p class="architecture-why"><strong>Why it matters:</strong> ${m.why}</p><a class="return-link" href="theory.html#${architectureSlugs[m.name]}">Open the ${m.name} architecture explanation →</a>`;if(i===0)deltas.innerHTML='<div class="delta"><span>Comparison</span><b>Starting point</b></div>';else{const p=models[i-1];deltas.innerHTML=keys.map(k=>{const d=+(m[k]-p[k]).toFixed(1),cl=Math.abs(d)<.05?'':d>0?'up':'down',ar=Math.abs(d)<.05?'→':d>0?'↑':'↓';return `<div class="delta ${cl}"><span>${k} vs ${p.name}</span><b>${ar} ${d>0?'+':''}${d.toFixed(1)} pts</b></div>`}).join('')}bChart.data.datasets[0].data=keys.map(k=>m[k]);bChart.update()}
const metricKeys=['Accuracy','Precision','Recall','F1'];
const frozen=[96.79,86.85,97.37,91.81];
const fineTuned=[97.96,92.89,96.32,94.57];
const differences=fineTuned.map((v,j)=>+(v-frozen[j]).toFixed(2));
const frozenMatrix={tn:810,fp:28,fn:5,tp:185};
const fineTunedMatrix={tn:824,fp:14,fn:7,tp:183};
const fineViews=[
  {title:'Before fine-tuning',summary:'InceptionResNetV2 with its pretrained CNN base frozen.'},
  {title:'After fine-tuning',summary:'The same model after its final 20 base layers were allowed to adapt.'},
  {title:'Side-by-side comparison',summary:'Muted bars show before; richer bars show after fine-tuning.'},
  {title:'Difference after fine-tuning',summary:'Positive bars improved; the negative recall bar shows the trade-off.'}
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
    fChart.data.datasets=[performanceDataset('Before fine-tuning',frozen,metricKeys.map(k=>mutedColors[k]))];
    finePanel.innerHTML=`<p class="eyebrow">Frozen CNN base</p><h3>Confusion matrix</h3><div class="compact-matrix">${matrixMarkup(frozenMatrix)}</div><a class="matrix-help" href="metrics.html#confusion-matrix">How to read this matrix →</a>`;
  }else if(fineView===1){
    fChart.data.datasets=[performanceDataset('After fine-tuning',fineTuned,metricKeys.map(k=>colors[k]))];
    finePanel.innerHTML=`<p class="eyebrow">Final 20 layers trainable</p><h3>Confusion matrix</h3><div class="compact-matrix">${matrixMarkup(fineTunedMatrix)}</div><a class="matrix-help" href="metrics.html#confusion-matrix">How to read this matrix →</a>`;
  }else if(fineView===2){
    fChart.data.datasets=[
      performanceDataset('Before fine-tuning',frozen,metricKeys.map(k=>mutedColors[k])),
      performanceDataset('After fine-tuning',fineTuned,metricKeys.map(k=>colors[k]))
    ];
    finePanel.innerHTML=`<p class="eyebrow">What changed?</p><h3>Fine-tuning improved three metrics.</h3><div class="change-list"><div><span>Accuracy</span><b>+1.17 pts</b></div><div><span>Precision</span><b>+6.04 pts</b></div><div class="down"><span>Recall</span><b>−1.05 pts</b></div><div><span>F1</span><b>+2.76 pts</b></div></div>`;
  }else{
    fChart.data.datasets=[{label:'Difference',data:differences,unit:'points',backgroundColor:metricKeys.map(k=>colors[k]),borderRadius:8,maxBarThickness:88}];
    finePanel.innerHTML=`<p class="eyebrow">Error trade-off</p><h3>Fewer false positives, but two more false negatives.</h3><div class="change-list errors"><div><span>False positives</span><b>28 → 14</b><small>14 fewer</small></div><div class="down"><span>False negatives</span><b>5 → 7</b><small>2 more</small></div><div><span>Correct predictions</span><b>995 → 1,007</b><small>12 more</small></div></div>`;
  }
  const differenceView=fineView>=2;
  fChart.options.scales.y.min=differenceView&&fineView===3?-7:84;
  fChart.options.scales.y.max=differenceView&&fineView===3?7:100;
  fChart.options.scales.y.title.text=fineView===3?'Change (percentage points)':'Test performance (%)';
  fChart.options.scales.y.ticks.callback=fineView===3?v=>(v>0?'+':'')+v:v=>v+'%';
  const values=fineView===0?frozen:fineView===1?fineTuned:differences;
  fineDeltas.innerHTML=metricKeys.map((k,j)=>`<div class="delta metric-change" style="--c:${colors[k]}"><span>${k}</span><b>${fineView<2?values[j].toFixed(2)+'%':`${values[j]>0?'+':''}${values[j].toFixed(2)} pts`}</b></div>`).join('');
  const frozenUrl=`${RAW}/benchmark/figures/InceptionResNetV2_learning_curves.png`,tunedUrl=`${RAW}/fine_tuning/figures/FineTuned_InceptionResNetV2_learning_curves.png`;
  if(fineView===0){fineCurveTitle.textContent='Before fine-tuning';fineCurveStrip.innerHTML=`<img src="${frozenUrl}" alt="InceptionResNetV2 learning curves before fine-tuning">`}
  else if(fineView===1){fineCurveTitle.textContent='After fine-tuning';fineCurveStrip.innerHTML=`<img src="${tunedUrl}" alt="InceptionResNetV2 learning curves after fine-tuning">`}
  else{fineCurveTitle.textContent='Before and after learning curves';fineCurveStrip.innerHTML=`<div class="curve-pair"><figure><img src="${frozenUrl}" alt="Learning curves before fine-tuning"><figcaption>Before fine-tuning</figcaption></figure><figure><img src="${tunedUrl}" alt="Learning curves after fine-tuning"><figcaption>After fine-tuning</figcaption></figure></div>`}
  fChart.update();
}
function setupExpandableVisuals(){
  const overlay=document.createElement('div');
  overlay.className='visual-overlay';
  overlay.hidden=true;
  overlay.innerHTML='<div class="visual-overlay-toolbar"><strong id="visualOverlayTitle">Expanded visual</strong><span>Press Esc to close</span><button type="button" aria-label="Close expanded visual">×</button></div><div class="visual-overlay-content"></div>';
  document.body.appendChild(overlay);
  const content=overlay.querySelector('.visual-overlay-content'),title=overlay.querySelector('strong'),closeButton=overlay.querySelector('button');
  const close=async()=>{if(document.fullscreenElement)await document.exitFullscreen().catch(()=>{});overlay.hidden=true;content.replaceChildren();document.body.classList.remove('visual-open')};
  const open=async source=>{
    title.textContent=source.getAttribute('aria-label')||'Expanded visual';
    content.replaceChildren();
    const canvas=source.querySelector('canvas');
    if(canvas){
      const image=document.createElement('img');
      image.src=canvas.toDataURL('image/png');
      image.alt=title.textContent;
      content.appendChild(image);
    }else{
      const clone=source.cloneNode(true);
      clone.classList.remove('expandable-visual');
      clone.removeAttribute('role');clone.removeAttribute('tabindex');
      clone.querySelectorAll('[id]').forEach(node=>node.removeAttribute('id'));
      content.appendChild(clone);
    }
    overlay.hidden=false;document.body.classList.add('visual-open');
    await overlay.requestFullscreen?.().catch(()=>{});
    closeButton.focus();
  };
  document.querySelectorAll('.expandable-visual').forEach(source=>{
    source.addEventListener('click',event=>{if(event.target.closest('a,button'))return;open(source)});
    source.addEventListener('keydown',event=>{if((event.key==='Enter'||event.key===' ')&&!event.target.closest('a,button')){event.preventDefault();open(source)}});
  });
  closeButton.addEventListener('click',close);
  overlay.addEventListener('click',event=>{if(event.target===overlay)close()});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!overlay.hidden)close()});
  document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement&&!overlay.hidden)close()});
}
window.addEventListener('DOMContentLoaded',()=>{
  bChart=new Chart(document.getElementById('benchmarkChart'),{type:'bar',data:{labels:metricKeys,datasets:[{data:[],backgroundColor:metricKeys.map(k=>colors[k]),borderRadius:10,maxBarThickness:88}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{min:55,max:100,ticks:{callback:v=>v+'%'},title:{display:true,text:'Test performance (%)'}},x:{grid:{display:false}}}}});
  fChart=new Chart(document.getElementById('fineChart'),{type:'bar',data:{labels:metricKeys,datasets:[]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',onClick:()=>{}}},scales:{y:{min:84,max:100,ticks:{callback:v=>v+'%'},title:{display:true,text:'Test performance (%)'}},x:{grid:{display:false}}}}});
  prev.onclick=()=>{if(i){i--;update()}};
  next.onclick=()=>{if(i<5){i++;update()}};
  finePrev.onclick=()=>{if(fineView){fineView--;updateFine()}};
  fineNext.onclick=()=>{if(fineView<3){fineView++;updateFine()}};
  update();
  updateFine();
  setupExpandableVisuals();
});
