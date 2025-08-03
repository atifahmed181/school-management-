# Simple PDF conversion script
Write-Host "Converting markdown to PDF..." -ForegroundColor Green

# Check if pandoc exists
$pandocPath = Get-Command pandoc -ErrorAction SilentlyContinue
if (-not $pandocPath) {
    Write-Host "Pandoc not found. Please install pandoc first." -ForegroundColor Red
    Write-Host "Download from: https://pandoc.org/installing.html" -ForegroundColor Yellow
    exit 1
}

# Simple conversion
try {
    pandoc "School_Management_System_Complete_Summary.md" -o "School_Management_System_Complete_Summary.pdf"
    
    if (Test-Path "School_Management_System_Complete_Summary.pdf") {
        Write-Host "PDF created successfully!" -ForegroundColor Green
        Write-Host "File: $(Get-Location)\School_Management_System_Complete_Summary.pdf" -ForegroundColor Cyan
        
        # Try to open the PDF
        Start-Process "School_Management_System_Complete_Summary.pdf" -ErrorAction SilentlyContinue
    } else {
        Write-Host "PDF creation failed." -ForegroundColor Red
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
} 