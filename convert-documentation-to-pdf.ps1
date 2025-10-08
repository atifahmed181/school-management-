# PowerShell Script to Convert Markdown to PDF
# Multiple methods provided - use whichever works best for you

Write-Host "=== Markdown to PDF Converter ===" -ForegroundColor Green
Write-Host ""

$mdFile = "COMPLETE_TECHNICAL_DOCUMENTATION.md"
$pdfFile = "COMPLETE_TECHNICAL_DOCUMENTATION.pdf"

Write-Host "Options to convert '$mdFile' to PDF:" -ForegroundColor Yellow
Write-Host ""

Write-Host "METHOD 1: Using Pandoc (Recommended)" -ForegroundColor Cyan
Write-Host "----------------------------------------"
Write-Host "1. Install Pandoc: https://pandoc.org/installing.html"
Write-Host "2. Install MiKTeX (for PDF): https://miktex.org/download"
Write-Host "3. Run command:"
Write-Host "   pandoc COMPLETE_TECHNICAL_DOCUMENTATION.md -o COMPLETE_TECHNICAL_DOCUMENTATION.pdf --pdf-engine=pdflatex" -ForegroundColor White
Write-Host ""

Write-Host "METHOD 2: Using VS Code Extension" -ForegroundColor Cyan
Write-Host "----------------------------------------"
Write-Host "1. Install VS Code extension: 'Markdown PDF' by yzane"
Write-Host "2. Open the .md file in VS Code"
Write-Host "3. Right-click in the editor"
Write-Host "4. Select 'Markdown PDF: Export (pdf)'"
Write-Host ""

Write-Host "METHOD 3: Using Online Converter" -ForegroundColor Cyan
Write-Host "----------------------------------------"
Write-Host "1. Visit: https://www.markdowntopdf.com/"
Write-Host "   OR: https://cloudconvert.com/md-to-pdf"
Write-Host "2. Upload: $mdFile"
Write-Host "3. Download the generated PDF"
Write-Host ""

Write-Host "METHOD 4: Using Chrome Browser" -ForegroundColor Cyan
Write-Host "----------------------------------------"
Write-Host "1. Install VS Code extension: 'Markdown Preview Enhanced'"
Write-Host "2. Open the .md file"
Write-Host "3. Right-click -> 'Markdown Preview Enhanced: Open Preview'"
Write-Host "4. In preview, right-click -> 'Chrome (Puppeteer) -> PDF'"
Write-Host ""

Write-Host "METHOD 5: Using GitHub (Simple)" -ForegroundColor Cyan
Write-Host "----------------------------------------"
Write-Host "1. Push the .md file to GitHub"
Write-Host "2. View it on GitHub (it will render beautifully)"
Write-Host "3. Use Chrome's Print to PDF:"
Write-Host "   - Press Ctrl+P"
Write-Host "   - Select 'Save as PDF'"
Write-Host "   - Save"
Write-Host ""

Write-Host "METHOD 6: Using Typora (Best Formatting)" -ForegroundColor Cyan
Write-Host "----------------------------------------"
Write-Host "1. Download Typora: https://typora.io/"
Write-Host "2. Open $mdFile in Typora"
Write-Host "3. File -> Export -> PDF"
Write-Host ""

Write-Host ""
Write-Host "=== Trying to auto-convert using Pandoc... ===" -ForegroundColor Green

# Check if pandoc is installed
$pandocInstalled = Get-Command pandoc -ErrorAction SilentlyContinue

if ($pandocInstalled) {
    Write-Host "✓ Pandoc found! Converting..." -ForegroundColor Green
    
    try {
        pandoc $mdFile -o $pdfFile --pdf-engine=pdflatex -V geometry:margin=1in
        
        if (Test-Path $pdfFile) {
            Write-Host "✓ SUCCESS! PDF created: $pdfFile" -ForegroundColor Green
            Write-Host "Opening PDF..." -ForegroundColor Cyan
            Start-Process $pdfFile
        } else {
            Write-Host "✗ Conversion failed. Try installing MiKTeX for PDF support." -ForegroundColor Red
        }
    }
    catch {
        Write-Host "✗ Error during conversion: $_" -ForegroundColor Red
        Write-Host "Try installing MiKTeX: https://miktex.org/download" -ForegroundColor Yellow
    }
}
else {
    Write-Host "✗ Pandoc not installed" -ForegroundColor Yellow
    Write-Host "Install Pandoc from: https://pandoc.org/installing.html" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "For now, use one of the methods above (METHOD 2 or 3 are easiest)" -ForegroundColor Green
}

Write-Host ""
Write-Host "File location: $(Get-Location)\$mdFile" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to open the markdown file..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Open the markdown file
Start-Process $mdFile

