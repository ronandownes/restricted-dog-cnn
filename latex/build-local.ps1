param(
    [ValidateSet("proposal", "report", "poster", "presentation", "slides", "all")]
    [string]$Target = "report"
)

$ErrorActionPreference = "Stop"

$LatexDirectory = $PSScriptRoot
$RepositoryRoot = Split-Path -Parent $LatexDirectory
$FiguresDirectory = Join-Path $LatexDirectory "figures"
$DocsDirectory = Join-Path $RepositoryRoot "docs"

if (-not (Get-Command pdflatex -ErrorAction SilentlyContinue)) {
    throw "pdflatex was not found. Install MiKTeX or TeX Live, then restart PowerShell."
}

if (-not (Get-Command bibtex -ErrorAction SilentlyContinue)) {
    throw "bibtex was not found. Open MiKTeX Console, install updates, then restart PowerShell."
}

New-Item -ItemType Directory -Force -Path $FiguresDirectory | Out-Null
New-Item -ItemType Directory -Force -Path $DocsDirectory | Out-Null

Write-Host "Preparing project figures..." -ForegroundColor Cyan

Copy-Item `
    (Join-Path $RepositoryRoot "benchmark\figures\model_zoo_four_metric_comparison_presentation.pdf") `
    $FiguresDirectory -Force

Copy-Item `
    (Join-Path $RepositoryRoot "benchmark\figures\InceptionResNetV2_confusion_matrix.png") `
    $FiguresDirectory -Force

Copy-Item `
    (Join-Path $RepositoryRoot "fine_tuning\figures\FineTuned_InceptionResNetV2_learning_curves.png") `
    $FiguresDirectory -Force

Copy-Item `
    (Join-Path $RepositoryRoot "fine_tuning\figures\Model_confusion_matrix.png") `
    (Join-Path $FiguresDirectory "FineTuned_InceptionResNetV2_confusion_matrix.png") -Force

Copy-Item `
    (Join-Path $RepositoryRoot "gradcam\figures\*.png") `
    $FiguresDirectory -Force

Write-Host "Compiling editable diagrams..." -ForegroundColor Cyan

Get-ChildItem (Join-Path $LatexDirectory "diagram_sources\*.tex") | ForEach-Object {
    & pdflatex `
        -file-line-error `
        -halt-on-error `
        -interaction=nonstopmode `
        "-output-directory=$FiguresDirectory" `
        $_.FullName

    if ($LASTEXITCODE -ne 0) {
        throw "Diagram compilation failed: $($_.Name)"
    }
}

$Documents = if ($Target -eq "all") {
    @("report", "poster", "presentation", "slides")
} elseif ($Target -eq "proposal") {
    @()
} else {
    @($Target)
}

$PublicNames = @{
    report       = "dog_cnn_report.pdf"
    poster       = "dog_cnn_poster.pdf"
    presentation = "dog_cnn_presentation.pdf"
    slides       = "dog_cnn_slides.pdf"
}

Push-Location $LatexDirectory
try {
    foreach ($Document in $Documents) {
        Write-Host "Compiling $Document.tex..." -ForegroundColor Cyan

        # First pass creates the auxiliary files and discovers references.
        & pdflatex `
            -file-line-error `
            -halt-on-error `
            -interaction=nonstopmode `
            "$Document.tex"

        if ($LASTEXITCODE -ne 0) {
            throw "Compilation failed: $Document.tex"
        }

        # Run BibTeX only when the document's auxiliary file requests it.
        $AuxiliaryFile = Join-Path $LatexDirectory "$Document.aux"
        if (
            (Test-Path $AuxiliaryFile) -and
            (Select-String -Path $AuxiliaryFile -Pattern "\\bibdata" -Quiet)
        ) {
            Write-Host "Building bibliography for $Document..." -ForegroundColor Cyan
            & bibtex $Document

            if ($LASTEXITCODE -ne 0) {
                throw "Bibliography compilation failed: $Document"
            }
        }

        # Two final passes resolve citations, contents and cross-references.
        1..2 | ForEach-Object {
            & pdflatex `
                -file-line-error `
                -halt-on-error `
                -interaction=nonstopmode `
                "$Document.tex"

            if ($LASTEXITCODE -ne 0) {
                throw "Compilation failed on final pass: $Document.tex"
            }
        }

        Copy-Item `
            (Join-Path $LatexDirectory "$Document.pdf") `
            (Join-Path $DocsDirectory $PublicNames[$Document]) -Force

        Write-Host "Created docs\$($PublicNames[$Document])" -ForegroundColor Green
    }
}
finally {
    Pop-Location
}

if ($Target -eq "proposal" -or $Target -eq "all") {
    $ProposalDirectory = Join-Path $LatexDirectory "proposal"
    Write-Host "Compiling proposal\main.tex..." -ForegroundColor Cyan

    Push-Location $ProposalDirectory
    try {
        & pdflatex `
            -file-line-error `
            -halt-on-error `
            -interaction=nonstopmode `
            "main.tex"

        if ($LASTEXITCODE -ne 0) {
            throw "Compilation failed: proposal\main.tex"
        }

        if (
            (Test-Path "main.aux") -and
            (Select-String -Path "main.aux" -Pattern "\\bibdata" -Quiet)
        ) {
            Write-Host "Building bibliography for proposal..." -ForegroundColor Cyan
            & bibtex main

            if ($LASTEXITCODE -ne 0) {
                throw "Bibliography compilation failed: proposal"
            }
        }

        1..2 | ForEach-Object {
            & pdflatex `
                -file-line-error `
                -halt-on-error `
                -interaction=nonstopmode `
                "main.tex"

            if ($LASTEXITCODE -ne 0) {
                throw "Compilation failed on final pass: proposal\main.tex"
            }
        }

        Copy-Item `
            (Join-Path $ProposalDirectory "main.pdf") `
            (Join-Path $DocsDirectory "dog_cnn_proposal.pdf") -Force

        Write-Host "Created docs\dog_cnn_proposal.pdf" -ForegroundColor Green
    }
    finally {
        Pop-Location
    }
}

Write-Host "Local LaTeX build complete." -ForegroundColor Green
