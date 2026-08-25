# Check OneDrive version history / recycle bin for deleted upload files
# Also search common locations for the original WhatsApp images

$missingFiles = @(
    "1787647600437_Plain-Maroon-Pashmina-Shawl-Giftmandu_111341__90939.jpg",
    "1787647470532_Plain-Maroon-Pashmina-Shawl-Giftmandu_111341__90939.jpg",
    "1787646793079_p3.jpg",
    "1787646687493_p1.jpg",
    "1787646609398_p2.jpg",
    "1787646474944_Brands-Officially-Licensed-Factory-Wholesale-Winter-Classic-Solid-Color-Soft-Warm-Knitting-Pashmina-Scarf-for-Women.avif",
    "1787646105412_WhatsApp_Image_2026-08-25_at_2.04.40_pm.jpeg",
    "1787646012737_WhatsApp_Image_2026-08-25_at_2.04.40_pm.jpeg",
    "1787645864872_WhatsApp_Image_2026-08-25_at_1.59.01_pm.jpeg",
    "1787645848548_WhatsApp_Image_2026-08-25_at_1.52.01_pm__1_.jpeg",
    "1787645433233_WhatsApp_Image_2026-08-25_at_1.52.00_pm.jpeg",
    "1787645333036_WhatsApp_Image_2026-08-25_at_1.51.59_pm.jpeg",
    "1787645010572_WhatsApp_Image_2026-08-24_at_9.44.55_pm__1_.jpeg",
    "1787644983972_WhatsApp_Image_2026-08-24_at_9.44.55_pm.jpeg",
    "1787644977933_WhatsApp_Image_2026-08-24_at_9.44.55_pm__2_.jpeg",
    "1787644972898_WhatsApp_Image_2026-08-24_at_9.44.55_pm__1_.jpeg"
)

Write-Host "=== Checking Windows Recycle Bin ==="
try {
    $shell = New-Object -ComObject Shell.Application
    $recycleBin = $shell.NameSpace(10)
    $rbItems = $recycleBin.Items()
    Write-Host "Total Recycle Bin items: $($rbItems.Count)"
    foreach ($rbItem in $rbItems) {
        $n = $rbItem.Name
        if ($n -match "uploads|WhatsApp_Image|p1\.jpg|p2\.jpg|p3\.jpg|Plain-Maroon|Pashmina-Scarf") {
            Write-Host "  FOUND IN RECYCLE BIN: $n"
        }
    }
} catch {
    Write-Host "  Could not access Recycle Bin: $_"
}

Write-Host ""
Write-Host "=== Searching OneDrive for original source images ==="
$searchPaths = @(
    "$env:USERPROFILE\Downloads",
    "$env:USERPROFILE\Pictures",
    "$env:USERPROFILE\Desktop",
    "$env:USERPROFILE\Documents"
)

# Original source filenames (before timestamp prefix)
$sourceNames = @(
    "Plain-Maroon-Pashmina-Shawl-Giftmandu_111341__90939.jpg",
    "p1.jpg", "p2.jpg", "p3.jpg",
    "Brands-Officially-Licensed-Factory-Wholesale-Winter-Classic-Solid-Color-Soft-Warm-Knitting-Pashmina-Scarf-for-Women.avif",
    "WhatsApp Image 2026-08-25 at 2.04.40 pm.jpeg",
    "WhatsApp Image 2026-08-25 at 1.59.01 pm.jpeg",
    "WhatsApp Image 2026-08-25 at 1.52.01 pm (1).jpeg",
    "WhatsApp Image 2026-08-25 at 1.52.00 pm.jpeg",
    "WhatsApp Image 2026-08-25 at 1.51.59 pm.jpeg",
    "WhatsApp Image 2026-08-24 at 9.44.55 pm.jpeg",
    "WhatsApp Image 2026-08-24 at 9.44.55 pm (1).jpeg",
    "WhatsApp Image 2026-08-24 at 9.44.55 pm (2).jpeg"
)

$found = @()
foreach ($searchPath in $searchPaths) {
    if (Test-Path $searchPath) {
        Write-Host "  Searching $searchPath..."
        foreach ($srcName in $sourceNames) {
            $matches = Get-ChildItem -Path $searchPath -Filter $srcName -Recurse -ErrorAction SilentlyContinue
            foreach ($m in $matches) {
                Write-Host "    FOUND: $($m.FullName) ($($m.Length) bytes)"
                $found += $m.FullName
            }
        }
    }
}

# Also check WhatsApp Media folder
$waPath = "$env:USERPROFILE\OneDrive\Documents\WhatsApp"
if (Test-Path $waPath) {
    Write-Host "  Searching WhatsApp folder..."
    $waMatches = Get-ChildItem -Path $waPath -Include "*.jpeg","*.jpg","*.avif" -Recurse -ErrorAction SilentlyContinue | Where-Object { $_.LastWriteTime -gt (Get-Date "2026-08-18") }
    foreach ($m in $waMatches) {
        Write-Host "    FOUND: $($m.FullName) ($($m.Length) bytes)"
        $found += $m.FullName
    }
}

Write-Host ""
if ($found.Count -eq 0) {
    Write-Host "=== No original source images found locally ==="
    Write-Host "TIP: You can recover them from OneDrive web:"
    Write-Host "  1. Go to https://onedrive.live.com"
    Write-Host "  2. Click the Recycle Bin in the left sidebar"
    Write-Host "  3. Look for the 'uploads' folder or individual image files"
    Write-Host "  4. Select and click 'Restore' to bring them back"
} else {
    Write-Host "=== Found $($found.Count) source images ==="
}
