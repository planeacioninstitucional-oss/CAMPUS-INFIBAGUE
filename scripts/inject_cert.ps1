$ErrorActionPreference = "Stop"

$imagePath = "assets/plantilla-certificado.jpg"
$jsPath = "js/certificates.js"

Write-Host "Reading image from $imagePath..."
if (-not (Test-Path $imagePath)) {
    Write-Error "Image file not found!"
    exit 1
}

$bytes = [IO.File]::ReadAllBytes($imagePath)
$base64 = [Convert]::ToBase64String($bytes)
$dataUri = "data:image/jpeg;base64," + $base64

Write-Host "Reading JS file from $jsPath..."
$jsContent = Get-Content -Path $jsPath -Raw -Encoding UTF8

$target = 'const CERTIFICADO_BG = "PLACEHOLDER";'

if ($jsContent.Contains($target)) {
    Write-Host "Target placeholder found. Replacing..."
    $newContent = $jsContent.Replace($target, "const CERTIFICADO_BG = `"$dataUri`";")
    Set-Content -Path $jsPath -Value $newContent -Encoding UTF8
    Write-Host "Successfully injected base64 image into certificates.js"
} else {
    Write-Error "Placeholder not found in certificates.js"
    exit 1
}
