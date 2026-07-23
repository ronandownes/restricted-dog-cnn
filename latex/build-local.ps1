param(
    [ValidateSet("report", "poster", "presentation", "slides", "all")]
    [string]$Target = "report"
)

$ErrorActionPreference = "Stop"

$LatexDirectory = $PSScriptRoot
$RepositoryRoot = Split-Path -Parent $LatexDirectory
$FiguresDirectory = Join-Path $LatexDirectory "figures"
$DocsDirectory = Join-Path $RepositoryRoot "docs"

if (-not (Get-Command latexmk -ErrorAction SilentlyContinue)) {
    throw "latexmk was not found. Install MiKTeX or TeX Live, then restart PowerShell."
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
    & latexmk `
        -pdf `
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

        & latexmk `
            -pdf `
            -file-line-error `
            -halt-on-error `
            -interaction=nonstopmode `
            "$Document.tex"

        if ($LASTEXITCODE -ne 0) {
            throw "Compilation failed: $Document.tex"
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

Write-Host "Local LaTeX build complete." -ForegroundColor Green
