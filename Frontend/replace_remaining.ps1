## ------------------------------------------------------------------
## replace_remaining.ps1
##   Second‑pass bulk colour replacement
##   • Replaces any remaining Tailwind orange utilities
##   • Replaces every "#ff7a2d" hex with the emerald primary #0F9D58
##   • Swaps "Nigeria" → "Pakistan"
##   • Uses raw file reads/writes to avoid line‑join issues
##   • Skips locked files quietly (try/catch)
## ------------------------------------------------------------------

$src = 'C:\Users\mugha\OneDrive\Desktop\234deals-FullStack-Copy\Main folder\234deals-frontend1\Frontend\src'

Get-ChildItem -Path $src -Recurse -Include *.tsx,*.ts,*.js,*.jsx |
ForEach-Object {
    try {
        $content = Get-Content -LiteralPath $_.FullName -Raw -ErrorAction Stop

        $content = $content -replace '#ff7a2d',          '#0F9D58'
        $content = $content -replace 'bg-orange-600',   'bg-[#0F9D58]'
        $content = $content -replace 'bg-orange-500',   'bg-[#15803d]'
        $content = $content -replace 'bg-orange-400',   'bg-[#1e9c5a]'
        $content = $content -replace 'bg-orange-300',   'bg-[#2ddf62]'
        $content = $content -replace 'bg-orange-200',   'bg-[#2ddf62]'
        $content = $content -replace 'bg-orange-100',   'bg-[#8fe8b1]'
        $content = $content -replace 'bg-orange-50',    'bg-[#8fe8b1]'

        $content = $content -replace 'hover:bg-orange-600','hover:bg-[#0F9D58]'
        $content = $content -replace 'hover:bg-orange-500','hover:bg-[#15803d]'
        $content = $content -replace 'hover:bg-orange-400','hover:bg-[#1e9c5a]'
        $content = $content -replace 'hover:bg-orange-50', 'hover:bg-[#8fe8b1]'

        $content = $content -replace 'border-orange-600','border-[#0F9D58]'

        $content = $content -replace 'text-orange-600', 'text-[#0F9D58]'
        $content = $content -replace 'text-orange-500', 'text-[#15803d]'
        $content = $content -replace 'text-orange-400', 'text-[#1e9c5a]'

        $content = $content -replace 'shadow-orange-100','shadow-[#8fe8b1]'
        $content = $content -replace 'shadow-orange-200','shadow-[#2ddf62]'
        $content = $content -replace 'shadow-orange-500','shadow-[#15803d]'
        $content = $content -replace 'shadow-orange-600','shadow-[#0F9D58]'

        $content = $content -replace 'from-\[#ff7a2d\]','from-[#0F9D58]'
        $content = $content -replace 'to-\[#ff7a2d\]','to-[#0F9D58]'

        $content = $content -replace 'Nigeria','Pakistan'

        Set-Content -Path $_.FullName -Value $content -Force -ErrorAction Stop
    }
    catch {
        # Skip files that are locked or cause an I/O error
    }
}
