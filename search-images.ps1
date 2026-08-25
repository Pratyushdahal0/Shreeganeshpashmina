Write-Host "Searching Downloads..."
$dl = "$env:USERPROFILE\Downloads"
if (Test-Path $dl) {
    Get-ChildItem -Path $dl -Include "*.jpeg","*.jpg","*.avif","*.png" -Recurse -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -match "WhatsApp|p1\.jpg|p2\.jpg|p3\.jpg|Plain-Maroon|Pashmina-Scarf" } |
        ForEach-Object { Write-Host "  FOUND: $($_.FullName) ($($_.Length) bytes)" }
}

Write-Host "Searching Desktop..."
$dt = "$env:USERPROFILE\Desktop"
if (Test-Path $dt) {
    Get-ChildItem -Path $dt -Include "*.jpeg","*.jpg","*.avif","*.png" -Recurse -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -match "WhatsApp|p1\.jpg|p2\.jpg|p3\.jpg|Plain-Maroon|Pashmina-Scarf" } |
        ForEach-Object { Write-Host "  FOUND: $($_.FullName) ($($_.Length) bytes)" }
}

Write-Host "Searching Pictures..."
$pic = "$env:USERPROFILE\Pictures"
if (Test-Path $pic) {
    Get-ChildItem -Path $pic -Include "*.jpeg","*.jpg","*.avif","*.png" -Recurse -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -match "WhatsApp|p1\.jpg|p2\.jpg|p3\.jpg|Plain-Maroon|Pashmina-Scarf" } |
        ForEach-Object { Write-Host "  FOUND: $($_.FullName) ($($_.Length) bytes)" }
}

Write-Host "Searching Documents..."
$doc = "$env:USERPROFILE\Documents"
if (Test-Path $doc) {
    Get-ChildItem -Path $doc -Include "*.jpeg","*.jpg","*.avif","*.png" -Recurse -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -match "WhatsApp|p1\.jpg|p2\.jpg|p3\.jpg|Plain-Maroon|Pashmina-Scarf" } |
        ForEach-Object { Write-Host "  FOUND: $($_.FullName) ($($_.Length) bytes)" }
}

Write-Host "Done searching."
