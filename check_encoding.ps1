$filePath = "c:\Users\carlo\Documents\Projetos\Quest4Couple_v3\js\articlesData.js"
$bytes = [System.IO.File]::ReadAllBytes($filePath)
Write-Host "File size: $($bytes.Length) bytes"
Write-Host "First 20 bytes: $($bytes[0..19] -join ' ')"

# Read as UTF-8
$text = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

# Check for garbled patterns (UTF-8 bytes misread as Latin-1)
$garbledPatterns = @('Ã¢', 'Ã©', 'Ã£', 'Ãº', 'Ã§', 'Ã³', 'Ã­', 'Ãª', 'Ã´', 'Ã¡', 'Ã ', 'Ã¼', 'Ã±', 'Ã¶', 'ÃŸ', 'Ã', 'Â')
$totalGarbled = 0
foreach ($p in $garbledPatterns) {
    $count = ([regex]::Matches($text, [regex]::Escape($p))).Count
    if ($count -gt 0) {
        Write-Host "  Pattern '$p': $count occurrences"
        $totalGarbled += $count
    }
}
Write-Host "Total garbled occurrences: $totalGarbled"

# Show a sample of lines with garbled chars
$lines = $text -split "`n"
$shown = 0
for ($i = 0; $i -lt $lines.Length -and $shown -lt 5; $i++) {
    if ($lines[$i] -match 'Ã¢|Ã©|Ã£|Ãº|Ã§|Ã³|Ã­|Ãª|Ã¡') {
        Write-Host "Line $($i+1): $($lines[$i].Substring(0, [Math]::Min(120, $lines[$i].Length)))"
        $shown++
    }
}
