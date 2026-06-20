Get-ChildItem -Path 'C:\Users\mugha\OneDrive\Desktop\234deals-FullStack-Copy\Main folder\234deals-frontend1\Frontend\src' -Recurse -Include *.tsx,*.ts,*.js,*.jsx | ForEach-Object {
    $c = (Get-Content -LiteralPath $_.FullName -ErrorAction Stop) -join "\n"
    $c = $c -replace '#ff7a2d', '#0F9D58'
    $c = $c -replace 'bg-orange-600', 'bg-[#0F9D58]'
    $c = $c -replace 'bg-orange-500', 'bg-[#15803d]'
    $c = $c -replace 'bg-orange-400', 'bg-[#1e9c5a]'
    $c = $c -replace 'bg-orange-300', 'bg-[#2ddf62]'
    $c = $c -replace 'bg-orange-200', 'bg-[#2ddf62]'
    $c = $c -replace 'bg-orange-100', 'bg-[#8fe8b1]'
    $c = $c -replace 'bg-orange-50',  'bg-[#8fe8b1]'
    $c = $c -replace 'hover:bg-orange-600', 'hover:bg-[#0F9D58]'
    $c = $c -replace 'hover:bg-orange-500', 'hover:bg-[#15803d]'
    $c = $c -replace 'hover:bg-orange-400', 'hover:bg-[#1e9c5a]'
    $c = $c -replace 'hover:bg-orange-50',  'hover:bg-[#8fe8b1]'
    $c = $c -replace 'border-orange-600', 'border-[#0F9D58]'
    $c = $c -replace 'text-orange-600', 'text-[#0F9D58]'
    $c = $c -replace 'text-orange-500', 'text-[#15803d]'
    $c = $c -replace 'text-orange-400', 'text-[#1e9c5a]'
    $c = $c -replace 'shadow-orange-100', 'shadow-[#8fe8b1]'
    $c = $c -replace 'shadow-orange-200', 'shadow-[#2ddf62]'
    $c = $c -replace 'shadow-orange-500', 'shadow-[#15803d]'
    $c = $c -replace 'shadow-orange-600', 'shadow-[#0F9D58]'
    $c = $c -replace 'from-\[#ff7a2d\]', 'from-[#0F9D58]'
    $c = $c -replace 'to-\[#ff7a2d\]', 'to-[#0F9D58]'
    $c = $c -replace 'Nigeria', 'Pakistan'
    try {
        Set-Content -Path $_.FullName -Value $c -Force -ErrorAction Stop
    } catch {
        # Skip files that are locked or cannot be written
    }
}
