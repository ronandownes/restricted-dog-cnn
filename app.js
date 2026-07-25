const RAW =
    'https://raw.githubusercontent.com/ronandownes/restricted-dog-cnn/main';

const colors = {
    Accuracy: '#2c6fb0',
    Precision: '#d87922',
    Recall: '#22865a',
    F1: '#c84444',
    MCC: '#7b3fa0',
    PrAuc: '#1a7a7a'
};

const mutedColors = {
    Accuracy: '#8fb4d8',
    Precision: '#e7b27d',
    Recall: '#8cc8ab',
    F1: '#de9797',
    MCC: '#c4a0d8',
    PrAuc: '#8ecece'
};

const architectureSlugs = {
    VGG16: 'vgg16',
    ResNet50: 'resnet50',
    InceptionV3: 'inceptionv3',
    Xception: 'xception',
    InceptionResNetV2: 'inceptionresnetv2',
    NASNetMobile: 'nasnetmobile'
};

const models = [
    {
        name: 'VGG16',
        year: '2014 · Uniform deep CNN',
        input: '224×224',
        idea:
            'A simple stack of repeated 3×3 convolutions. Pooling progressively reduces spatial size while the number of learned feature channels grows.',
        route: [
            '3×3 conv blocks',
            'Max pooling',
            'Deep feature maps'
        ],
        why:
            'VGG made depth systematic and easy to understand, but it is comparatively heavy and lacks skip connections.',
        cm: {
            tn: 723,
            fp: 115,
            fn: 15,
            tp: 175
        },
        Accuracy: 87.4,
        Precision: 60.3,
        Recall: 92.1,
        F1: 72.9,
        MCC: 67.6,
        PrAuc: 82.6
    },

    {
        name: 'ResNet50',
        year: '2015 · Residual connections',
        input: '224×224',
        idea:
            'Residual blocks add a shortcut path around several transformations, allowing information and gradients to bypass them.',
        route: [
            'Stem convolution',
            'Residual blocks',
            'Identity shortcuts'
        ],
        why:
            'The network can learn a residual change rather than rebuilding the entire representation at every block, making deeper optimisation more reliable.',
        cm: {
            tn: 765,
            fp: 73,
            fn: 12,
            tp: 178
        },
        Accuracy: 91.7,
        Precision: 70.9,
        Recall: 93.7,
        F1: 80.7,
        MCC: 76.8,
        PrAuc: 89.9
    },

    {
        name: 'InceptionV3',
        year: '2015 · Multi-scale processing',
        input: '299×299',
        idea:
            'Parallel branches examine features using different convolutional paths, then concatenate their outputs.',
        route: [
            'Parallel branches',
            'Factorised convolutions',
            'Concatenated features'
        ],
        why:
            'The model can combine evidence at several effective spatial scales without using one uniformly expensive pathway.',
        cm: {
            tn: 804,
            fp: 34,
            fn: 6,
            tp: 184
        },
        Accuracy: 96.1,
        Precision: 84.4,
        Recall: 96.8,
        F1: 90.2,
        MCC: 88.1,
        PrAuc: 96.9
    },

    {
        name: 'Xception',
        year: '2016 · Separable convolutions',
        input: '299×299',
        idea:
            'Depthwise-separable convolution first filters each channel spatially and then mixes information across channels.',
        route: [
            'Depthwise spatial filtering',
            '1×1 channel mixing',
            'Residual flow'
        ],
        why:
            'Separating spatial and channel processing reduces redundant computation while retaining strong representational capacity.',
        cm: {
            tn: 802,
            fp: 36,
            fn: 5,
            tp: 185
        },
        Accuracy: 96.0,
        Precision: 83.7,
        Recall: 97.4,
        F1: 90.0,
        MCC: 87.9,
        PrAuc: 97.4
    },

    {
        name: 'InceptionResNetV2',
        year: '2016 · Inception + residual',
        input: '299×299',
        idea:
            'Multi-branch Inception processing is combined with residual shortcut connections in a large, expressive feature extractor.',
        route: [
            'Inception branches',
            'Feature concatenation',
            'Residual addition'
        ],
        why:
            'It joins multi-scale representation learning with easier gradient flow. It produced the best frozen balance here and became the fine-tuning backbone.',
        cm: {
            tn: 810,
            fp: 28,
            fn: 5,
            tp: 185
        },
        Accuracy: 96.8,
        Precision: 86.9,
        Recall: 97.4,
        F1: 91.8,
        MCC: 90.6,
        PrAuc: 98.7,
        winner: true
    },

    {
        name: 'NASNetMobile',
        year: '2017 · Architecture search',
        input: '224×224',
        idea:
            'Repeated normal and reduction cells were discovered through neural architecture search rather than designed entirely by hand.',
        route: [
            'Normal cells',
            'Reduction cells',
            'Mobile feature extractor'
        ],
        why:
            'It targets efficiency on constrained hardware, but architecture-search pedigree did not make it the best model for this particular dataset.',
        cm: {
            tn: 792,
            fp: 46,
            fn: 7,
            tp: 183
        },
        Accuracy: 94.8,
        Precision: 79.9,
        Recall: 96.3,
        F1: 87.4,
        MCC: 84.7,
        PrAuc: 95.3
    }
];

let i = 0;
let fineView = 0;
let fineTunePopupShown = false;
let pageVisible = true;

let bChart;
let fChart;


// ======================================================
// WINNER CELEBRATION
// ======================================================

function injectCelebrationStyles() {
    const style = document.createElement('style');

    style.textContent = `
        @keyframes fireworkBurst {
            0% {
                transform: translate(-50%, -50%) scale(0.2);
                opacity: 1;
            }
            100% {
                transform:
                    translate(
                        calc(-50% + var(--tx)),
                        calc(-50% + var(--ty))
                    )
                    scale(var(--scale));
                opacity: 0;
            }
        }

        @keyframes stampIn {
            0% {
                transform: translate(-50%, -50%) scale(0.1) rotate(-10deg);
                opacity: 0;
            }
            40% {
                transform: translate(-50%, -50%) scale(1.15) rotate(2deg);
                opacity: 1;
            }
            60% {
                transform: translate(-50%, -50%) scale(0.95) rotate(-1deg);
                opacity: 1;
            }
            80% {
                transform: translate(-50%, -50%) scale(1.05) rotate(0.5deg);
                opacity: 1;
            }
            100% {
                transform: translate(-50%, -50%) scale(1) rotate(0deg);
                opacity: 1;
            }
        }

        @keyframes glowPulse {
            0%, 100% {
                box-shadow:
                    0 0 30px rgba(255, 215, 0, 0.4),
                    0 0 60px rgba(255, 215, 0, 0.2);
            }
            50% {
                box-shadow:
                    0 0 50px rgba(255, 215, 0, 0.7),
                    0 0 100px rgba(255, 215, 0, 0.3);
            }
        }

        @keyframes rotateRays {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }

        @keyframes stampFadeOut {
            0% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
            100% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(1.4);
            }
        }

        @keyframes confettiFall {
            0% {
                transform: translateY(-20px) rotate(0deg) scale(1);
                opacity: 1;
            }
            100% {
                transform:
                    translateY(calc(100vh + 100px))
                    rotate(var(--rotation))
                    scale(0.3);
                opacity: 0;
            }
        }

        .winner-stamp {
            position: fixed;
            left: 50%;
            top: 50%;
            z-index: 100000;
            transform: translate(-50%, -50%);
            pointer-events: none;
            animation:
                stampIn 600ms
                cubic-bezier(0.34, 1.56, 0.64, 1)
                forwards;
        }

        .winner-stamp-badge {
            position: relative;
            display: inline-block;
            padding: 32px 48px;
            border-radius: 20px;
            background:
                linear-gradient(
                    135deg,
                    #1a1a2e,
                    #16213e
                );
            color: white;
            text-align: center;
            border: 3px solid #ffd700;
            animation:
                glowPulse 2s ease-in-out infinite;
            box-shadow:
                0 20px 60px rgba(0, 0, 0, 0.5);
            min-width: 360px;
        }

        .winner-stamp-badge::before {
            content: '';
            position: absolute;
            inset: -6px;
            border-radius: 24px;
            background:
                conic-gradient(
                    from 0deg,
                    #ffd700,
                    #ff8a00,
                    #ffd700,
                    #ff8a00,
                    #ffd700
                );
            z-index: -1;
            animation:
                rotateRays 4s linear infinite;
            padding: 2px;
            -webkit-mask:
                linear-gradient(#fff 0 0) content-box,
                linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
        }

        .winner-stamp-badge .stamp-icon {
            display: block;
            font-size: 3.2rem;
            margin-bottom: 8px;
        }

        .winner-stamp-badge .stamp-label {
            display: block;
            font-size:
                clamp(1.45rem, 3.6vw, 2.35rem);
            font-weight: 900;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            color: #ffd700;
            margin-bottom: 12px;
            line-height: 1.05;
        }

        .winner-stamp-badge .stamp-name {
            display: block;
            font-size:
                clamp(1.8rem, 4.2vw, 2.8rem);
            font-weight: 900;
            background:
                linear-gradient(
                    135deg,
                    #ffd700,
                    #ff8a00
                );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            line-height: 1.1;
        }

        .winner-stamp.leaving {
            animation:
                stampFadeOut 400ms ease-in forwards;
        }

        .finetune-stamp {
            position: fixed;
            left: 50%;
            top: 50%;
            z-index: 100000;
            transform: translate(-50%, -50%);
            pointer-events: none;
            animation:
                stampIn 600ms
                cubic-bezier(0.34, 1.56, 0.64, 1)
                forwards;
        }

        .finetune-stamp-badge {
            position: relative;
            display: inline-block;
            padding: 32px 48px;
            border-radius: 20px;
            background:
                linear-gradient(
                    135deg,
                    #0a1628,
                    #1a2a4a
                );
            color: white;
            text-align: center;
            border: 3px solid #4a9eff;
            animation:
                finetuneGlow 2s ease-in-out infinite;
            box-shadow:
                0 20px 60px rgba(0, 0, 0, 0.5);
            min-width: 360px;
        }

        @keyframes finetuneGlow {
            0%, 100% {
                box-shadow:
                    0 0 40px rgba(74, 158, 255, 0.4),
                    0 0 80px rgba(74, 158, 255, 0.15);
            }
            50% {
                box-shadow:
                    0 0 60px rgba(74, 158, 255, 0.7),
                    0 0 120px rgba(74, 158, 255, 0.25),
                    0 0 180px rgba(0, 212, 170, 0.15);
            }
        }

        .finetune-stamp-badge::before {
            content: '';
            position: absolute;
            inset: -6px;
            border-radius: 24px;
            background:
                conic-gradient(
                    from 0deg,
                    #4a9eff,
                    #00d4aa,
                    #4a9eff,
                    #00d4aa,
                    #4a9eff
                );
            z-index: -1;
            animation:
                rotateRays 4s linear infinite;
            padding: 2px;
            -webkit-mask:
                linear-gradient(#fff 0 0) content-box,
                linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
        }

        .finetune-stamp-badge .stamp-icon {
            display: block;
            font-size: 2.8rem;
            margin-bottom: 8px;
        }

        .finetune-stamp-badge .stamp-label {
            display: block;
            font-size:
                clamp(1.45rem, 3.6vw, 2.35rem);
            font-weight: 900;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            color: #4a9eff;
            margin-bottom: 12px;
            line-height: 1.05;
        }

        .finetune-stamp-badge .stamp-name {
            display: block;
            font-size:
                clamp(1.55rem, 4vw, 2.55rem);
            font-weight: 900;
            background:
                linear-gradient(
                    135deg,
                    #4a9eff,
                    #00d4aa
                );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            line-height: 1.1;
        }

        .finetune-stamp.leaving {
            animation:
                stampFadeOut 400ms ease-in forwards;
        }

        .celebration-fireworks {
            position: fixed;
            inset: 0;
            z-index: 99999;
            overflow: hidden;
            pointer-events: none;
        }

        .firework-particle {
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
            animation:
                fireworkBurst var(--duration)
                ease-out forwards;
        }

        .confetti-piece {
            position: fixed;
            z-index: 100001;
            pointer-events: none;
            animation:
                confettiFall var(--duration)
                ease-in forwards;
        }

        .winner-badge {
            display: inline-block;
            margin-left: 8px;
            padding: 2px 10px;
            border-radius: 999px;
            background:
                linear-gradient(
                    135deg,
                    #ffd700,
                    #ff8a00
                );
            color: #fff;
            font-size: 0.7rem;
            font-weight: 900;
            letter-spacing: 0.05em;
            vertical-align: middle;
            box-shadow:
                0 2px 10px
                rgba(190, 125, 0, 0.25);
        }
    `;

    document.head.appendChild(style);
}


injectCelebrationStyles();


// ======================================================
// CELEBRATION HELPERS
// ======================================================

function createFireworkParticle(
    container,
    originX,
    originY
) {
    const fireworkColors = [
        '#ffd93d',
        '#ff6b6b',
        '#6bcb77',
        '#4d96ff',
        '#ff9f43',
        '#a29bfe',
        '#fd79a8',
        '#00cec9',
        '#ffffff'
    ];

    const particle =
        document.createElement('span');

    particle.className =
        'firework-particle';

    const angle =
        Math.random() * Math.PI * 2;

    const distance =
        60 + Math.random() * 180;

    const size =
        3 + Math.random() * 6;

    const duration =
        600 + Math.random() * 500;

    const color =
        fireworkColors[
            Math.floor(
                Math.random() *
                fireworkColors.length
            )
        ];

    particle.style.left =
        `${originX}%`;

    particle.style.top =
        `${originY}%`;

    particle.style.width =
        `${size}px`;

    particle.style.height =
        `${size}px`;

    particle.style.background =
        color;

    particle.style.boxShadow =
        `0 0 ${size * 2}px ${color}`;

    particle.style.setProperty(
        '--tx',
        `${Math.cos(angle) * distance}px`
    );

    particle.style.setProperty(
        '--ty',
        `${Math.sin(angle) * distance}px`
    );

    particle.style.setProperty(
        '--scale',
        `${0.2 + Math.random() * 0.7}`
    );

    particle.style.setProperty(
        '--duration',
        `${duration}ms`
    );

    container.appendChild(particle);

    setTimeout(
        () => particle.remove(),
        duration + 100
    );
}


function createConfetti(count = 50) {
    const colors = [
        '#ffd700',
        '#ff6b6b',
        '#4d96ff',
        '#6bcb77',
        '#ff9f43',
        '#a29bfe',
        '#fd79a8',
        '#00cec9'
    ];

    const container =
        document.body;

    for (
        let confettiIndex = 0;
        confettiIndex < count;
        confettiIndex++
    ) {
        const piece =
            document.createElement('div');

        piece.className =
            'confetti-piece';

        const size =
            4 + Math.random() * 8;

        const color =
            colors[
                Math.floor(
                    Math.random() *
                    colors.length
                )
            ];

        const left =
            Math.random() * 100;

        const duration =
            1500 + Math.random() * 2000;

        const rotation =
            (Math.random() - 0.5) * 720;

        const delay =
            Math.random() * 400;

        const shape =
            Math.random() > 0.5
                ? '50%'
                : '2px';

        piece.style.cssText = `
            left: ${left}%;
            top: -15px;
            width: ${size}px;
            height:
                ${size * (0.6 + Math.random() * 0.8)}px;
            background: ${color};
            border-radius: ${shape};
            --duration: ${duration}ms;
            --rotation: ${rotation}deg;
            animation-delay: ${delay}ms;
        `;

        container.appendChild(piece);

        setTimeout(
            () => piece.remove(),
            duration + delay + 100
        );
    }
}


function fireworkExplosion(
    burstCount = 5
) {
    document
        .querySelectorAll(
            '.celebration-fireworks'
        )
        .forEach(
            element => element.remove()
        );

    const fireworks =
        document.createElement('div');

    fireworks.className =
        'celebration-fireworks';

    document.body.appendChild(
        fireworks
    );

    const bursts = [
        [30, 35],
        [50, 25],
        [70, 35],
        [35, 55],
        [65, 55]
    ];

    const activeBursts =
        burstCount === 3
            ? bursts.slice(0, 3)
            : bursts;

    activeBursts.forEach(
        ([x, y], burstIndex) => {
            setTimeout(() => {
                const particleCount =
                    burstCount === 3
                        ? 20
                        : 25;

                for (
                    let particleIndex = 0;
                    particleIndex <
                    particleCount;
                    particleIndex++
                ) {
                    createFireworkParticle(
                        fireworks,
                        x,
                        y
                    );
                }
            }, burstIndex * 80);
        }
    );

    setTimeout(
        () => fireworks.remove(),
        2000
    );
}


// ======================================================
// BENCHMARK WINNER CELEBRATION
// ======================================================

function showWinnerStamp() {
    document
        .querySelectorAll(
            '.winner-stamp'
        )
        .forEach(
            element => element.remove()
        );

    const winnerData =
        models.find(
            modelData =>
                modelData.winner
        );

    const stamp =
        document.createElement('div');

    stamp.className =
        'winner-stamp';

    stamp.innerHTML = `
        <div class="winner-stamp-badge">
            <span class="stamp-icon">
                🏆
            </span>

            <span class="stamp-label">
                Benchmark Winner Decided
            </span>

            <span class="stamp-name">
                ${winnerData.name}
            </span>
        </div>
    `;

    document.body.appendChild(
        stamp
    );

    createConfetti(50);

    setTimeout(() => {
        stamp.classList.add(
            'leaving'
        );
    }, 2800);

    setTimeout(() => {
        stamp.remove();
    }, 3300);
}


function celebrateWinnerArrival() {
    if (!models[i].winner) {
        return;
    }

    fireworkExplosion(5);

    setTimeout(() => {
        showWinnerStamp();
    }, 300);
}


// ======================================================
// FINE-TUNING CELEBRATION
// ======================================================

function showFineTuneStamp() {
    document
        .querySelectorAll(
            '.finetune-stamp'
        )
        .forEach(
            element => element.remove()
        );

    const stamp =
        document.createElement('div');

    stamp.className =
        'finetune-stamp';

    stamp.innerHTML = `
        <div class="finetune-stamp-badge">
            <span class="stamp-icon">
                📈
            </span>

            <span class="stamp-label">
                Fine-Tuning Improvement
            </span>

            <span class="stamp-name">
                FineTuned_InceptionResNetV2
            </span>
        </div>
    `;

    document.body.appendChild(
        stamp
    );

    createConfetti(60);

    setTimeout(() => {
        stamp.classList.add(
            'leaving'
        );
    }, 3200);

    setTimeout(() => {
        stamp.remove();
    }, 3700);
}


function celebrateFineTune() {
    fireworkExplosion(4);
    createConfetti(60);

    setTimeout(() => {
        showFineTuneStamp();
    }, 300);
}


// ======================================================
// RESET FUNCTIONS
// ======================================================

function resetBenchmark() {
    i = 0;
    fineTunePopupShown = false;

    update();

    document
        .querySelectorAll(
            '.winner-stamp, ' +
            '.finetune-stamp, ' +
            '.winner-arrival, ' +
            '.fine-tune-arrival'
        )
        .forEach(
            element => element.remove()
        );

    document
        .querySelectorAll(
            '.celebration-fireworks'
        )
        .forEach(
            element => element.remove()
        );
}


function resetFineTuning() {
    fineView = 0;
    fineTunePopupShown = false;

    updateFine();

    document
        .querySelectorAll(
            '.finetune-stamp, ' +
            '.fine-tune-arrival'
        )
        .forEach(
            element => element.remove()
        );

    document
        .querySelectorAll(
            '.celebration-fireworks'
        )
        .forEach(
            element => element.remove()
        );
}


// ======================================================
// CHART VALUE LABELS
// ======================================================

const valueLabels = {
    id: 'values',

    afterDatasetsDraw(chart) {
        const ctx =
            chart.ctx;

        ctx.save();

        ctx.font =
            '800 13px system-ui';

        ctx.textAlign =
            'center';

        ctx.fillStyle =
            '#122033';

        chart.data.datasets.forEach(
            (
                dataset,
                datasetIndex
            ) => {
                chart
                    .getDatasetMeta(
                        datasetIndex
                    )
                    .data
                    .forEach(
                        (
                            bar,
                            j
                        ) => {
                            if (
                                dataset.data[j] ==
                                null
                            ) {
                                return;
                            }

                            const value =
                                Number(
                                    dataset.data[j]
                                );

                            const suffix =
                                dataset.unit ===
                                'points'
                                    ? ' pts'
                                    : '%';

                            const label =
                                `${
                                    value > 0 &&
                                    dataset.unit ===
                                    'points'
                                        ? '+'
                                        : ''
                                }${
                                    value.toFixed(
                                        dataset.unit ===
                                        'points'
                                            ? 2
                                            : 1
                                    )
                                }${suffix}`;

                            ctx.fillText(
                                label,
                                bar.x,
                                value < 0
                                    ? bar.y + 17
                                    : bar.y - 7
                            );
                        }
                    );
            }
        );

        ctx.restore();
    }
};


Chart.register(
    valueLabels
);


// ======================================================
// BENCHMARK STORY
// ======================================================

function story(n) {
    return [
        [
            'Baseline established',
            'VGG16 begins with strong recall, but precision and F1 leave substantial room for improvement.'
        ],
        [
            'A clear step forward',
            'ResNet50 improves all four headline metrics, with especially large gains in precision and F1.'
        ],
        [
            'The benchmark moves into the mid-90s',
            'InceptionV3 produces another substantial improvement across all four headline metrics.'
        ],
        [
            'Newer does not mean uniformly better',
            'Xception raises recall slightly, but accuracy, precision and F1 edge down relative to InceptionV3.'
        ],
        [
            '🏆 WINNER! Best frozen balance',
            'InceptionResNetV2 improves accuracy, precision and F1 while recall stays level. It is selected for fine-tuning.'
        ],
        [
            'Historical progress is not task-specific progress',
            'NASNetMobile is historically later, yet all four headline metrics decline relative to InceptionResNetV2.'
        ]
    ][n];
}


// ======================================================
// CONFUSION MATRICES
// ======================================================

function matrixMarkup(cm) {
    return `
        <div class="matrix-axis top">
            Predicted class
        </div>

        <div class="matrix-axis side">
            True class
        </div>

        <div class="matrix-labels columns">
            <span>Restricted</span>
            <span>Unrestricted</span>
        </div>

        <div class="matrix-labels rows">
            <span>Restricted</span>
            <span>Unrestricted</span>
        </div>

        <div class="matrix-cells">
            <div class="cm-tp">
                <small>
                    True positive
                </small>
                <b>${cm.tp}</b>
            </div>

            <div class="cm-fn">
                <small>
                    False negative
                </small>
                <b>${cm.fn}</b>
            </div>

            <div class="cm-fp">
                <small>
                    False positive
                </small>
                <b>${cm.fp}</b>
            </div>

            <div class="cm-tn">
                <small>
                    True negative
                </small>
                <b>${cm.tn}</b>
            </div>
        </div>
    `;
}


function matrixDifferenceMarkup() {
    return `
        <div class="matrix-axis top">
            Predicted class
        </div>

        <div class="matrix-axis side">
            True class
        </div>

        <div class="matrix-labels columns">
            <span>Restricted</span>
            <span>Unrestricted</span>
        </div>

        <div class="matrix-labels rows">
            <span>Restricted</span>
            <span>Unrestricted</span>
        </div>

        <div
            class="
                matrix-cells
                matrix-differences
            "
        >
            <div class="delta-bad">
                <small>
                    True positive
                </small>
                <b>−2</b>
            </div>

            <div class="delta-bad">
                <small>
                    False negative
                </small>
                <b>+2</b>
            </div>

            <div class="delta-good">
                <small>
                    False positive
                </small>
                <b>−14</b>
            </div>

            <div class="delta-good">
                <small>
                    True negative
                </small>
                <b>+14</b>
            </div>
        </div>
    `;
}


// ======================================================
// BENCHMARK UPDATE
// ======================================================

function update() {
    const modelData =
        models[i];

    const currentStory =
        story(i);

    const keys = [
        'Accuracy',
        'Precision',
        'Recall',
        'F1',
        'MCC',
        'PrAuc'
    ];

    const winnerText =
        modelData.winner
            ? ' · 🏆 WINNER'
            : '';

    model.textContent =
        modelData.name;

    year.textContent =
        modelData.year;

    benchmarkMetricsModel.textContent =
        `${modelData.name}${winnerText}`;

    benchmarkMatrixModel.textContent =
        `${modelData.name}${winnerText}`;

    headline.textContent =
        currentStory[0];

    commentary.textContent =
        currentStory[1];

    prev.disabled =
        i === 0;

    next.disabled =
        i === models.length - 1;

    next.textContent =
        'Next →';

    const tileLabel = {
        Accuracy: 'Accuracy',
        Precision: 'Precision',
        Recall: 'Recall',
        F1: 'F1',
        MCC: 'MCC',
        PrAuc: 'PR-AUC'
    };

    tiles.innerHTML =
        keys
            .map(
                key => `
                    <div
                        class="tile"
                        style="--c:${colors[key]}"
                    >
                        <small>
                            ${tileLabel[key]}
                        </small>

                        <b>
                            ${modelData[
                                key
                            ].toFixed(1)}%
                        </b>
                    </div>
                `
            )
            .join('');

    benchmarkMatrix.innerHTML =
        matrixMarkup(
            modelData.cm
        );

    benchmarkCurveTitle.textContent =
        `${modelData.name}${winnerText} · ` +
        'training and validation accuracy and loss';

    benchmarkCurveImage.src =
        `${RAW}/benchmark/figures/` +
        `${modelData.name}_learning_curves.png`;

    benchmarkCurveImage.alt =
        `${modelData.name} ` +
        'training and validation accuracy and loss curves';

    architecture.innerHTML = `
        <div>
            <small>
                HIGH-LEVEL ARCHITECTURE ·
                INPUT ${modelData.input}
            </small>

            <h3>
                ${modelData.name}:
                what happens inside?

                ${
                    modelData.winner
                        ? `
                            <span
                                class="winner-badge"
                            >
                                🏆 WINNER
                            </span>
                        `
                        : ''
                }
            </h3>

            <p>
                ${modelData.idea}
            </p>
        </div>

        <div class="architecture-route">
            ${
                modelData.route
                    .map(
                        (
                            item,
                            routeIndex
                        ) =>
                            `${
                                routeIndex
                                    ? '<i>→</i>'
                                    : ''
                            }<b>${item}</b>`
                    )
                    .join('')
            }
        </div>

        <p class="architecture-why">
            <strong>
                Why it matters:
            </strong>

            ${modelData.why}
        </p>

        <a
            class="return-link"
            href="
                theory.html#
                ${
                    architectureSlugs[
                        modelData.name
                    ]
                }
            "
        >
            Open the
            ${modelData.name}
            architecture explanation →
        </a>
    `;

    if (i === 0) {
        deltas.innerHTML = `
            <div class="delta">
                <span>
                    Comparison
                </span>

                <b>
                    Starting point
                </b>
            </div>
        `;
    } else {
        const previousModel =
            models[i - 1];

        const deltaLabels = {
            Accuracy: 'Accuracy',
            Precision: 'Precision',
            Recall: 'Recall',
            F1: 'F1',
            MCC: 'MCC',
            PrAuc: 'PR-AUC'
        };

        deltas.innerHTML =
            keys
                .map(key => {
                    const difference =
                        +(
                            modelData[key] -
                            previousModel[key]
                        ).toFixed(1);

                    const cssClass =
                        Math.abs(
                            difference
                        ) < 0.05
                            ? ''
                            : difference > 0
                                ? 'up'
                                : 'down';

                    const arrow =
                        Math.abs(
                            difference
                        ) < 0.05
                            ? '→'
                            : difference > 0
                                ? '↑'
                                : '↓';

                    return `
                        <div
                            class="
                                delta
                                ${cssClass}
                            "
                        >
                            <span>
                                ${
                                    deltaLabels[key]
                                }
                                vs
                                ${
                                    previousModel.name
                                }
                            </span>

                            <b>
                                ${arrow}${
                                    difference > 0
                                        ? '+'
                                        : ''
                                }${
                                    difference.toFixed(
                                        1
                                    )
                                }
                                pts
                            </b>
                        </div>
                    `;
                })
                .join('');
    }

    bChart
        .data
        .datasets[0]
        .data =
        keys.map(
            key => modelData[key]
        );

    bChart
        .options
        .plugins
        .title
        .text =
        modelData.winner
            ? `${modelData.name} · 🏆 WINNER`
            : modelData.name;

    bChart.update('none');
}


// ======================================================
// FINE-TUNING DATA
// ======================================================

const metricKeys = [
    'Accuracy',
    'Precision',
    'Recall',
    'F1',
    'MCC',
    'PrAuc'
];

const frozen = [
    96.79,
    86.85,
    97.37,
    91.81,
    90.60,
    98.70
];

const fineTuned = [
    97.96,
    92.89,
    96.32,
    94.57,
    93.12,
    99.10
];

const differences =
    fineTuned.map(
        (value, j) =>
            +(
                value -
                frozen[j]
            ).toFixed(2)
    );

const frozenMatrix = {
    tn: 810,
    fp: 28,
    fn: 5,
    tp: 185
};

const fineTunedMatrix = {
    tn: 824,
    fp: 14,
    fn: 7,
    tp: 183
};

const fineViews = [
    {
        title:
            'Before fine-tuning',
        summary:
            'InceptionResNetV2 with its pretrained CNN base frozen.'
    },
    {
        title:
            'After fine-tuning',
        summary:
            'The same model after its final 20 base layers were allowed to adapt.'
    },
    {
        title:
            'Fine-tuning side by side',
        summary:
            'Muted bars show before; richer bars show after fine-tuning.'
    },
    {
        title:
            'Fine-tuning impact',
        summary:
            'Positive bars improved; the negative recall bar shows the trade-off.'
    }
];


function performanceDataset(
    label,
    data,
    backgroundColor
) {
    return {
        label,
        data,
        backgroundColor,
        borderRadius: 8,
        maxBarThickness: 88
    };
}


// ======================================================
// FINE-TUNING UPDATE
// ======================================================

function updateFine() {
    const view =
        fineViews[fineView];

    fineCount.textContent =
        `${fineView + 1} of ` +
        `${fineViews.length}`;

    fineTitle.textContent =
        view.title;

    fineSummary.textContent =
        view.summary;

    fineMetricsModel.textContent =
        `InceptionResNetV2 · ` +
        `${view.title}`;

    finePrev.disabled =
        fineView === 0;

    fineNext.disabled =
        fineView ===
        fineViews.length - 1;

    fineNext.textContent =
        'Next →';

    fChart
        .options
        .plugins
        .legend
        .display =
        fineView === 2;

    if (fineView === 0) {
        fChart.data.datasets = [
            performanceDataset(
                'Before fine-tuning',
                frozen,
                metricKeys.map(
                    key =>
                        mutedColors[key]
                )
            )
        ];

        finePanel.innerHTML = `
            <div
                class="visual-identity"
            >
                <small>
                    CONFUSION MATRIX ·
                    BEFORE FINE-TUNING
                </small>

                <strong>
                    InceptionResNetV2
                </strong>
            </div>

            <p class="eyebrow">
                Frozen CNN base
            </p>

            <div
                class="compact-matrix"
            >
                ${
                    matrixMarkup(
                        frozenMatrix
                    )
                }
            </div>

            <a
                class="matrix-help"
                href="
                    metrics.html#
                    confusion-matrix
                "
            >
                How to read this matrix →
            </a>
        `;
    } else if (fineView === 1) {
        fChart.data.datasets = [
            performanceDataset(
                'After fine-tuning',
                fineTuned,
                metricKeys.map(
                    key => colors[key]
                )
            )
        ];

        finePanel.innerHTML = `
            <div
                class="visual-identity"
            >
                <small>
                    CONFUSION MATRIX ·
                    AFTER FINE-TUNING
                </small>

                <strong>
                    InceptionResNetV2
                </strong>
            </div>

            <p class="eyebrow">
                Final 20 layers trainable
            </p>

            <div
                class="compact-matrix"
            >
                ${
                    matrixMarkup(
                        fineTunedMatrix
                    )
                }
            </div>

            <a
                class="matrix-help"
                href="
                    metrics.html#
                    confusion-matrix
                "
            >
                How to read this matrix →
            </a>
        `;
    } else if (fineView === 2) {
        fChart.data.datasets = [
            performanceDataset(
                'Before fine-tuning',
                frozen,
                metricKeys.map(
                    key =>
                        mutedColors[key]
                )
            ),
            performanceDataset(
                'After fine-tuning',
                fineTuned,
                metricKeys.map(
                    key =>
                        colors[key]
                )
            )
        ];

        finePanel.innerHTML = `
            <div
                class="visual-identity"
            >
                <small>
                    CONFUSION MATRICES ·
                    SIDE BY SIDE
                </small>

                <strong>
                    InceptionResNetV2
                </strong>
            </div>

            <div
                class="fine-matrices"
            >
                <div>
                    <p
                        class="eyebrow"
                    >
                        Frozen
                    </p>

                    <div
                        class="
                            compact-matrix
                        "
                    >
                        ${
                            matrixMarkup(
                                frozenMatrix
                            )
                        }
                    </div>
                </div>

                <div>
                    <p
                        class="eyebrow"
                    >
                        Fine-tuned
                    </p>

                    <div
                        class="
                            compact-matrix
                        "
                    >
                        ${
                            matrixMarkup(
                                fineTunedMatrix
                            )
                        }
                    </div>
                </div>
            </div>
        `;
    } else {
        fChart.data.datasets = [
            {
                label:
                    'Difference',
                data:
                    differences,
                unit:
                    'points',
                backgroundColor:
                    metricKeys.map(
                        key =>
                            colors[key]
                    ),
                borderRadius:
                    8,
                maxBarThickness:
                    88
            }
        ];

        finePanel.innerHTML = `
            <div
                class="visual-identity"
            >
                <small>
                    CONFUSION MATRIX ·
                    FINE-TUNED MINUS
                    FROZEN
                </small>

                <strong>
                    InceptionResNetV2
                </strong>
            </div>

            <div
                class="
                    compact-matrix
                    difference-matrix
                "
            >
                ${
                    matrixDifferenceMarkup()
                }
            </div>

            <p
                class="matrix-balance"
            >
                <strong>
                    Zero-sum check:
                </strong>

                +14 − 14 + 2 − 2 = 0.
                The same 1,028
                evaluation images were
                redistributed among the
                four cells.
            </p>
        `;
    }

    fChart
        .options
        .scales
        .y
        .min =
        fineView === 3
            ? -7
            : 84;

    fChart
        .options
        .scales
        .y
        .max =
        fineView === 3
            ? 7
            : 100;

    fChart
        .options
        .scales
        .y
        .title
        .text =
        fineView === 3
            ? 'Change (percentage points)'
            : 'Performance (%)';

    fChart
        .options
        .scales
        .y
        .ticks
        .callback =
        fineView === 3
            ? value =>
                (
                    value > 0
                        ? '+'
                        : ''
                ) + value
            : value =>
                value + '%';

    const values =
        fineView === 0
            ? frozen
            : fineView === 1
                ? fineTuned
                : differences;

    fineDeltas.innerHTML =
        metricKeys
            .map(
                (key, j) => `
                    <div
                        class="
                            delta
                            metric-change
                        "
                        style="
                            --c:${colors[key]}
                        "
                    >
                        <span>
                            ${key}
                        </span>

                        <b>
                            ${
                                fineView < 2
                                    ? values[j]
                                        .toFixed(2) +
                                        '%'
                                    : `${
                                        values[j] >
                                        0
                                            ? '+'
                                            : ''
                                    }${
                                        values[j]
                                            .toFixed(
                                                2
                                            )
                                    } pts`
                            }
                        </b>
                    </div>
                `
            )
            .join('');

    const frozenUrl =
        `${RAW}/benchmark/figures/` +
        'InceptionResNetV2_learning_curves.png';

    const tunedUrl =
        `${RAW}/fine_tuning/figures/` +
        'FineTuned_InceptionResNetV2_learning_curves.png';

    fineCurveVisual.hidden =
        fineView >= 2;

    if (fineView === 0) {
        fineCurveTitle.textContent =
            'InceptionResNetV2 · frozen learning curve';

        fineCurveStrip.innerHTML = `
            <img
                src="${frozenUrl}"
                alt="
                    InceptionResNetV2
                    learning curve with
                    its CNN base frozen
                "
            >
        `;
    } else if (fineView === 1) {
        fineCurveTitle.textContent =
            'InceptionResNetV2 · fine-tuned learning curve';

        fineCurveStrip.innerHTML = `
            <img
                src="${tunedUrl}"
                alt="
                    InceptionResNetV2
                    learning curve after
                    fine-tuning
                "
            >
        `;
    }

    fChart
        .options
        .plugins
        .title
        .text =
        `InceptionResNetV2 · ` +
        `${view.title}`;

    fChart.update('none');

    if (
        fineView === 1 &&
        !fineTunePopupShown
    ) {
        fineTunePopupShown =
            true;

        setTimeout(() => {
            celebrateFineTune();
        }, 300);
    }
}


// ======================================================
// EXPANDED VISUALS
// ======================================================

function setupExpandableVisuals() {
    const overlay =
        document.createElement(
            'div'
        );

    overlay.className =
        'visual-overlay';

    overlay.hidden =
        true;

    overlay.innerHTML = `
        <div
            class="
                visual-overlay-toolbar
            "
        >
            <button
                class="
                    visual-model-nav
                    visual-prev
                "
                type="button"
            >
                ← Previous
            </button>

            <strong
                id="visualOverlayTitle"
            >
                Expanded visual
            </strong>

            <button
                class="
                    visual-model-nav
                    visual-next
                "
                type="button"
            >
                Next →
            </button>

            <span>
                Press Esc to close
            </span>

            <button
                class="visual-close"
                type="button"
                aria-label="
                    Close expanded visual
                "
            >
                ×
            </button>
        </div>

        <div
            class="
                visual-overlay-content
            "
        ></div>
    `;

    document.body.appendChild(
        overlay
    );

    const content =
        overlay.querySelector(
            '.visual-overlay-content'
        );

    const title =
        overlay.querySelector(
            '#visualOverlayTitle'
        );

    const closeButton =
        overlay.querySelector(
            '.visual-close'
        );

    const previousButton =
        overlay.querySelector(
            '.visual-prev'
        );

    const nextButton =
        overlay.querySelector(
            '.visual-next'
        );

    const benchmarkVisuals =
        new Set([
            'benchmarkMetricsVisual',
            'benchmarkMatrixVisual',
            'benchmarkCurveVisual'
        ]);

    const fineVisuals =
        new Set([
            'fineMetricsVisual',
            'finePanel',
            'fineCurveVisual'
        ]);

    let activeSource =
        null;


    function visualName(source) {
        const modelData =
            models[i];

        const winnerText =
            modelData.winner
                ? ' · 🏆 WINNER'
                : '';

        if (
            source.id ===
            'benchmarkMetricsVisual'
        ) {
            return (
                `${modelData.name}` +
                `${winnerText}`
            );
        }

        if (
            source.id ===
            'benchmarkMatrixVisual'
        ) {
            return (
                `${modelData.name}` +
                `${winnerText}` +
                ' · Confusion matrix'
            );
        }

        if (
            source.id ===
            'benchmarkCurveVisual'
        ) {
            return (
                `${modelData.name}` +
                `${winnerText}` +
                ' · Training and validation curves'
            );
        }

        if (
            source.id ===
            'fineMetricsVisual'
        ) {
            return (
                'InceptionResNetV2 · ' +
                `${
                    fineViews[
                        fineView
                    ].title
                }`
            );
        }

        if (
            source.id ===
            'finePanel'
        ) {
            return (
                'InceptionResNetV2 · ' +
                `${
                    fineViews[
                        fineView
                    ].title
                }`
            );
        }

        if (
            source.id ===
            'fineCurveVisual'
        ) {
            return (
                'InceptionResNetV2 · ' +
                `${
                    fineViews[
                        fineView
                    ].title
                } learning curves`
            );
        }

        return (
            source.getAttribute(
                'aria-label'
            ) ||
            'Expanded visual'
        );
    }


    function createExpandedCopy(
        source
    ) {
        const canvas =
            source.querySelector(
                'canvas'
            );

        if (canvas) {
            const image =
                document.createElement(
                    'img'
                );

            image.src =
                canvas.toDataURL(
                    'image/png'
                );

            image.alt =
                visualName(source);

            image.style.cssText = `
                display: block;
                width: 100%;
                height: auto;
                max-height:
                    calc(
                        100vh - 110px
                    );
                object-fit: contain;
                margin: auto;
            `;

            return image;
        }

        const clone =
            source.cloneNode(
                true
            );

        clone.classList.remove(
            'expandable-visual'
        );

        clone.removeAttribute(
            'id'
        );

        clone.removeAttribute(
            'role'
        );

        clone.removeAttribute(
            'tabindex'
        );

        clone
            .querySelectorAll(
                '[id]'
            )
            .forEach(
                node =>
                    node.removeAttribute(
                        'id'
                    )
            );

        return clone;
    }


    function render(source) {
        title.textContent =
            visualName(source);

        content.replaceChildren();

        const expandedCopy =
            createExpandedCopy(
                source
            );

        content.appendChild(
            expandedCopy
        );

        const isBenchmark =
            benchmarkVisuals.has(
                source.id
            );

        const isFine =
            fineVisuals.has(
                source.id
            );

        previousButton.hidden =
            !(
                isBenchmark ||
                isFine
            );

        nextButton.hidden =
            !(
                isBenchmark ||
                isFine
            );

        if (isBenchmark) {
            previousButton.disabled =
                i === 0;

            nextButton.disabled =
                i ===
                models.length - 1;
        }

        if (isFine) {
            const finalFineView =
                source.id ===
                'fineCurveVisual'
                    ? 1
                    : fineViews.length -
                        1;

            previousButton.disabled =
                fineView === 0;

            nextButton.disabled =
                fineView ===
                finalFineView;
        }
    }


    async function close() {
        if (
            document.fullscreenElement
        ) {
            await document
                .exitFullscreen()
                .catch(() => {});
        }

        overlay.hidden =
            true;

        activeSource =
            null;

        content.replaceChildren();

        document.body.classList.remove(
            'visual-open'
        );
    }


    async function open(source) {
        activeSource =
            source;

        if (
            benchmarkVisuals.has(
                source.id
            )
        ) {
            i = 0;

            fineTunePopupShown =
                false;

            update();

            document
                .querySelectorAll(
                    '.winner-stamp, ' +
                    '.finetune-stamp, ' +
                    '.winner-arrival, ' +
                    '.fine-tune-arrival'
                )
                .forEach(
                    element =>
                        element.remove()
                );

            document
                .querySelectorAll(
                    '.celebration-fireworks'
                )
                .forEach(
                    element =>
                        element.remove()
                );
        }

        if (
            fineVisuals.has(
                source.id
            )
        ) {
            fineView = 0;

            fineTunePopupShown =
                false;

            updateFine();

            document
                .querySelectorAll(
                    '.finetune-stamp, ' +
                    '.fine-tune-arrival'
                )
                .forEach(
                    element =>
                        element.remove()
                );

            document
                .querySelectorAll(
                    '.celebration-fireworks'
                )
                .forEach(
                    element =>
                        element.remove()
                );
        }

        requestAnimationFrame(
            () => {
                requestAnimationFrame(
                    () => {
                        render(
                            source
                        );

                        overlay.hidden =
                            false;

                        document
                            .body
                            .classList
                            .add(
                                'visual-open'
                            );
                    }
                );
            }
        );

        await overlay
            .requestFullscreen?.()
            .catch(() => {});

        closeButton.focus();
    }


    function moveVisual(
        direction
    ) {
        if (!activeSource) {
            return;
        }

        if (
            benchmarkVisuals.has(
                activeSource.id
            )
        ) {
            const oldIndex =
                i;

            const nextIndex =
                Math.max(
                    0,
                    Math.min(
                        models.length -
                        1,
                        i +
                        direction
                    )
                );

            if (
                nextIndex === i
            ) {
                return;
            }

            i =
                nextIndex;

            update();

            requestAnimationFrame(
                () => {
                    requestAnimationFrame(
                        () => {
                            render(
                                activeSource
                            );

                            if (
                                !models[
                                    oldIndex
                                ].winner &&
                                models[
                                    i
                                ].winner
                            ) {
                                celebrateWinnerArrival();
                            }
                        }
                    );
                }
            );

            return;
        }

        if (
            fineVisuals.has(
                activeSource.id
            )
        ) {
            const finalFineView =
                activeSource.id ===
                'fineCurveVisual'
                    ? 1
                    : fineViews.length -
                        1;

            const nextView =
                Math.max(
                    0,
                    Math.min(
                        finalFineView,
                        fineView +
                        direction
                    )
                );

            if (
                nextView ===
                fineView
            ) {
                return;
            }

            fineView =
                nextView;

            updateFine();

            requestAnimationFrame(
                () => {
                    requestAnimationFrame(
                        () => {
                            render(
                                activeSource
                            );
                        }
                    );
                }
            );
        }
    }


    document
        .querySelectorAll(
            '.expandable-visual'
        )
        .forEach(source => {
            source.addEventListener(
                'click',
                event => {
                    if (
                        event.target.closest(
                            'a,button'
                        )
                    ) {
                        return;
                    }

                    open(source);
                }
            );

            source.addEventListener(
                'keydown',
                event => {
                    if (
                        (
                            event.key ===
                            'Enter' ||
                            event.key ===
                            ' '
                        ) &&
                        !event.target.closest(
                            'a,button'
                        )
                    ) {
                        event.preventDefault();

                        open(source);
                    }
                }
            );
        });

    previousButton.addEventListener(
        'click',
        () => moveVisual(-1)
    );

    nextButton.addEventListener(
        'click',
        () => moveVisual(1)
    );

    closeButton.addEventListener(
        'click',
        close
    );

    overlay.addEventListener(
        'click',
        event => {
            if (
                event.target ===
                overlay
            ) {
                close();
            }
        }
    );

    document.addEventListener(
        'keydown',
        event => {
            if (
                event.key ===
                'Escape' &&
                !overlay.hidden
            ) {
                close();
            }
        }
    );

    document.addEventListener(
        'fullscreenchange',
        () => {
            if (
                !document.fullscreenElement &&
                !overlay.hidden
            ) {
                close();
            }
        }
    );
}


// ======================================================
// PAGE VISIBILITY
// ======================================================

function handleVisibilityChange() {
    if (document.hidden) {
        pageVisible = false;
    } else {
        pageVisible = true;

        i = 0;

        fineTunePopupShown =
            false;

        update();

        fineView = 0;

        updateFine();

        document
            .querySelectorAll(
                '.winner-stamp, ' +
                '.finetune-stamp, ' +
                '.winner-arrival, ' +
                '.fine-tune-arrival'
            )
            .forEach(
                element =>
                    element.remove()
            );

        document
            .querySelectorAll(
                '.celebration-fireworks'
            )
            .forEach(
                element =>
                    element.remove()
            );
    }
}


document.addEventListener(
    'visibilitychange',
    handleVisibilityChange
);


// ======================================================
// PAGE INITIALISATION
// ======================================================

window.addEventListener(
    'DOMContentLoaded',
    () => {
        const fineNavStyle =
            document.createElement(
                'style'
            );

        fineNavStyle.textContent = `
            @media(max-width:700px) {
                #fine .stepper {
                    flex-direction: row;
                    gap: 8px;
                    align-items: center;
                }

                #fine .stepper .btn {
                    width: auto;
                    flex: 0 0 auto;
                    padding: 10px 12px;
                    font-size: .86rem;
                    white-space: nowrap;
                }

                #fine .stepper > div {
                    min-width: 0;
                    flex: 1 1 auto;
                }
            }
        `;

        document.head.appendChild(
            fineNavStyle
        );

        const chartLabels =
            metricKeys.map(
                key =>
                    ({
                        Accuracy:
                            'Accuracy',
                        Precision:
                            'Precision',
                        Recall:
                            'Recall',
                        F1:
                            'F1',
                        MCC:
                            'MCC',
                        PrAuc:
                            'PR-AUC'
                    })[key]
            );

        bChart =
            new Chart(
                document.getElementById(
                    'benchmarkChart'
                ),
                {
                    type:
                        'bar',

                    data: {
                        labels:
                            chartLabels,

                        datasets: [
                            {
                                data:
                                    [],

                                backgroundColor:
                                    metricKeys.map(
                                        key =>
                                            colors[
                                                key
                                            ]
                                    ),

                                borderRadius:
                                    10,

                                maxBarThickness:
                                    88
                            }
                        ]
                    },

                    options: {
                        responsive:
                            true,

                        maintainAspectRatio:
                            false,

                        animation:
                            false,

                        plugins: {
                            legend: {
                                display:
                                    false
                            },

                            title: {
                                display:
                                    true,

                                text:
                                    models[i]
                                        .name,

                                color:
                                    '#10294b',

                                font: {
                                    size:
                                        17,
                                    weight:
                                        'bold'
                                },

                                padding: {
                                    bottom:
                                        18
                                }
                            }
                        },

                        scales: {
                            y: {
                                min:
                                    55,

                                max:
                                    100,

                                ticks: {
                                    callback:
                                        value =>
                                            value +
                                            '%'
                                },

                                title: {
                                    display:
                                        true,

                                    text:
                                        'Performance (%)'
                                }
                            },

                            x: {
                                grid: {
                                    display:
                                        false
                                }
                            }
                        }
                    }
                }
            );

        fChart =
            new Chart(
                document.getElementById(
                    'fineChart'
                ),
                {
                    type:
                        'bar',

                    data: {
                        labels:
                            chartLabels,

                        datasets:
                            []
                    },

                    options: {
                        responsive:
                            true,

                        maintainAspectRatio:
                            false,

                        animation:
                            false,

                        plugins: {
                            legend: {
                                position:
                                    'bottom',

                                onClick:
                                    () => {}
                            },

                            title: {
                                display:
                                    true,

                                text:
                                    'InceptionResNetV2',

                                color:
                                    '#10294b',

                                font: {
                                    size:
                                        17,
                                    weight:
                                        'bold'
                                },

                                padding: {
                                    bottom:
                                        18
                                }
                            }
                        },

                        scales: {
                            y: {
                                min:
                                    84,

                                max:
                                    100,

                                ticks: {
                                    callback:
                                        value =>
                                            value +
                                            '%'
                                },

                                title: {
                                    display:
                                        true,

                                    text:
                                        'Performance (%)'
                                }
                            },

                            x: {
                                grid: {
                                    display:
                                        false
                                }
                            }
                        }
                    }
                }
            );

        prev.onclick = () => {
            if (i <= 0) {
                return;
            }

            const oldIndex =
                i;

            i--;

            update();

            if (
                !models[
                    oldIndex
                ].winner &&
                models[i].winner
            ) {
                celebrateWinnerArrival();
            }
        };

        next.onclick = () => {
            if (
                i >=
                models.length - 1
            ) {
                return;
            }

            const oldIndex =
                i;

            i++;

            update();

            if (
                !models[
                    oldIndex
                ].winner &&
                models[i].winner
            ) {
                celebrateWinnerArrival();
            }
        };

        finePrev.onclick = () => {
            if (
                fineView > 0
            ) {
                fineView--;

                updateFine();
            }
        };

        fineNext.onclick = () => {
            if (
                fineView <
                fineViews.length - 1
            ) {
                fineView++;

                updateFine();
            }
        };

        i = 0;

        fineView = 0;

        fineTunePopupShown =
            false;

        update();

        updateFine();

        setupExpandableVisuals();
    }
);