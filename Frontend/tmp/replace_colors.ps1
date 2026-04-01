$targetColor = "#f45c03"
$oldColors = @(
    "#FF6B35", "#FF6339", "#FF7A4D", "#E85A28", "#E85A2E", 
    "#ea580c", "#f97316", "#D44D1F", "#D14F23", "#FF5520",
    "#D44D1F", "#D14F23", "#FF8C42"
)

$files = Get-ChildItem -Path "src" -Recurse -Include *.tsx,*.ts,*.css,*.js

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $modified = $false
    
    foreach ($oldColor in $oldColors) {
        if ($content -match [regex]::Escape($oldColor)) {
            $content = $content -replace [regex]::Escape($oldColor), $targetColor
            $modified = $true
        }
    }
    
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content
        Write-Host "Updated $($file.FullName)"
    }
}
