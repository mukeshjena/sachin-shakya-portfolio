# scripts/generate-favicons.ps1
# Generates complete suite of high-resolution favicons, touch icons, and OG preview from sachin-logo.png

Add-Type -AssemblyName System.Drawing

$sourcePath = "C:\Users\LenovO\Downloads\sachin-logo.png"
$publicDir = Join-Path $PSScriptRoot "..\public"

if (!(Test-Path $sourcePath)) {
    Write-Error "Source logo file not found at: $sourcePath"
    exit 1
}

$sourceImg = [System.Drawing.Image]::FromFile($sourcePath)

function Resize-Image {
    param(
        [System.Drawing.Image]$Image,
        [int]$Width,
        [int]$Height,
        [string]$DestinationPath
    )

    $targetBmp = New-Object System.Drawing.Bitmap($Width, $Height)
    $graphics = [System.Drawing.Graphics]::FromImage($targetBmp)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    $graphics.DrawImage($Image, 0, 0, $Width, $Height)
    $targetBmp.Save($DestinationPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $targetBmp.Dispose()
    Write-Host "Generated: $DestinationPath ($Width x $Height)"
}

# 1. Standard Web & Apple Favicons
Resize-Image -Image $sourceImg -Width 16 -Height 16 -DestinationPath (Join-Path $publicDir "favicon-16x16.png")
Resize-Image -Image $sourceImg -Width 32 -Height 32 -DestinationPath (Join-Path $publicDir "favicon-32x32.png")
Resize-Image -Image $sourceImg -Width 48 -Height 48 -DestinationPath (Join-Path $publicDir "favicon-48x48.png")
Resize-Image -Image $sourceImg -Width 180 -Height 180 -DestinationPath (Join-Path $publicDir "apple-touch-icon.png")
Resize-Image -Image $sourceImg -Width 192 -Height 192 -DestinationPath (Join-Path $publicDir "icon-192x192.png")
Resize-Image -Image $sourceImg -Width 512 -Height 512 -DestinationPath (Join-Path $publicDir "icon-512x512.png")

# 2. Favicon.ico (copy 32x32 or 48x48 as favicon.ico)
$icoBmp = New-Object System.Drawing.Bitmap((Join-Path $publicDir "favicon-32x32.png"))
$icoPath = Join-Path $publicDir "favicon.ico"
$iconHandle = $icoBmp.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($iconHandle)
$fileStream = New-Object System.IO.FileStream($icoPath, [System.IO.FileMode]::Create)
$icon.Save($fileStream)
$fileStream.Close()
$icoBmp.Dispose()
Write-Host "Generated: $icoPath (32x32 ICO)"

# 3. OpenGraph 1200x630 Card (Dark instrument panel theme)
$ogWidth = 1200
$ogHeight = 630
$ogBmp = New-Object System.Drawing.Bitmap($ogWidth, $ogHeight)
$ogG = [System.Drawing.Graphics]::FromImage($ogBmp)
$ogG.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$ogG.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$ogG.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

# Deep petrol navy background #06121a
$bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(6, 18, 26))
$ogG.FillRectangle($bgBrush, 0, 0, $ogWidth, $ogHeight)

# Subtle hairline grid/border
$borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(60, 130, 180, 200), 2)
$ogG.DrawRectangle($borderPen, 32, 32, ($ogWidth - 64), ($ogHeight - 64))

# Draw Logo on left (240x240)
$logoSize = 240
$ogG.DrawImage($sourceImg, 80, 195, $logoSize, $logoSize)

# Fonts
$fontTitle = New-Object System.Drawing.Font("Arial", 42, [System.Drawing.FontStyle]::Bold)
$fontSubtitle = New-Object System.Drawing.Font("Arial", 22, [System.Drawing.FontStyle]::Regular)
$fontBadge = New-Object System.Drawing.Font("Arial", 16, [System.Drawing.FontStyle]::Bold)
$fontMetric = New-Object System.Drawing.Font("Arial", 28, [System.Drawing.FontStyle]::Bold)
$fontMetricLabel = New-Object System.Drawing.Font("Arial", 14, [System.Drawing.FontStyle]::Regular)

# Brushes
$paperBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(232, 241, 244))
$amberBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 176, 32))
$cyanBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(73, 199, 232))
$mistBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(147, 174, 186))

# Text layout
$ogG.DrawString("EXECUTIVE PORTFOLIO // CLOUD ARCHITECTURE", $fontBadge, $amberBrush, 360, 150)
$ogG.DrawString("Sachin Shakya", $fontTitle, $paperBrush, 360, 190)
$ogG.DrawString("Lead Cloud Architect & DevOps Consultant", $fontSubtitle, $cyanBrush, 360, 265)
$ogG.DrawString("AWS · Microsoft Azure · Kubernetes · Terraform · SRE", $fontSubtitle, $mistBrush, 360, 310)

# Metrics Strip
$metricY = 400
$ogG.DrawString("`$170K/MO", $fontMetric, $amberBrush, 360, $metricY)
$ogG.DrawString("Cloud Cost Reduction", $fontMetricLabel, $mistBrush, 360, ($metricY + 42))

$ogG.DrawString("40% MTTR", $fontMetric, $cyanBrush, 620, $metricY)
$ogG.DrawString("Incident Reduction", $fontMetricLabel, $mistBrush, 620, ($metricY + 42))

$ogG.DrawString("2,000+", $fontMetric, $paperBrush, 860, $metricY)
$ogG.DrawString("Cloud Resources", $fontMetricLabel, $mistBrush, 860, ($metricY + 42))

$ogPath = Join-Path $publicDir "og-image.png"
$ogBmp.Save($ogPath, [System.Drawing.Imaging.ImageFormat]::Png)

$ogG.Dispose()
$ogBmp.Dispose()
$sourceImg.Dispose()

Write-Host "Generated: $ogPath (1200 x 630 OpenGraph card)"
Write-Host "All favicon and OG assets generated successfully!"
