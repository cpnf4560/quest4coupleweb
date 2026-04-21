$filePath = "c:\Users\carlo\Documents\Projetos\Quest4Couple_v3\js\articlesData.js"
$bytes = [System.IO.File]::ReadAllBytes($filePath)
Write-Host "File size: $($bytes.Length) bytes"
Write-Host "First 3 bytes: $($bytes[0]) $($bytes[1]) $($bytes[2])"

# Read as UTF-8 and check for garbled patterns
$text = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)
$lines = $text.Split("`n")
Write-Host "Total lines: $($lines.Length)"
Write-Host "Line 2: $($lines[1].Trim())"
Write-Host "Line 3: $($lines[2].Trim())"

# Check if "Dinâmicas" is correct (should NOT have Ã)
if ($text.Contains([char]0x00C3)) {
    Write-Host "WARNING: File contains garbled characters (Ã pattern found)"
} else {
    Write-Host "OK: No garbled characters detected"
}

# Check for the word "Dinâmicas" properly encoded
if ($text.Contains("Dinâmicas")) {
    Write-Host "OK: 'Dinâmicas' found correctly encoded"
} else {
    Write-Host "WARNING: 'Dinâmicas' not found - may still be corrupted"
}
