# PowerShell script to convert markdown to PDF
# Requires pandoc to be installed

Write-Host "Converting School Management System Summary to PDF..." -ForegroundColor Green

# Check if pandoc is installed
try {
    pandoc --version | Out-Null
    Write-Host "Pandoc found. Proceeding with conversion..." -ForegroundColor Green
} catch {
    Write-Host "Error: Pandoc is not installed or not in PATH." -ForegroundColor Red
    Write-Host "Please install pandoc from: https://pandoc.org/installing.html" -ForegroundColor Yellow
    Write-Host "After installation, restart your terminal and run this script again." -ForegroundColor Yellow
    exit 1
}

# Convert markdown to PDF
try {
    pandoc "School_Management_System_Complete_Summary.md" `
        -o "School_Management_System_Complete_Summary.pdf" `
        --pdf-engine=wkhtmltopdf `
        --toc `
        --toc-depth=3 `
        --number-sections `
        --css=style.css `
        --metadata title="School Management System - Complete Development Summary" `
        --metadata author="Development Team" `
        --metadata date="$(Get-Date -Format 'MMMM dd, yyyy')"
    
    if (Test-Path "School_Management_System_Complete_Summary.pdf") {
        Write-Host "PDF created successfully!" -ForegroundColor Green
        Write-Host "File location: $(Get-Location)\School_Management_System_Complete_Summary.pdf" -ForegroundColor Cyan
        
        # Open the PDF file
        Write-Host "Opening PDF file..." -ForegroundColor Yellow
        Start-Process "School_Management_System_Complete_Summary.pdf"
    } else {
        Write-Host "Error: PDF file was not created." -ForegroundColor Red
    }
} catch {
    Write-Host "Error during conversion: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Trying alternative conversion method..." -ForegroundColor Yellow
    
    # Alternative method using basic pandoc
    try {
        pandoc "School_Management_System_Complete_Summary.md" -o "School_Management_System_Complete_Summary.pdf"
        Write-Host "PDF created using basic conversion!" -ForegroundColor Green
        Start-Process "School_Management_System_Complete_Summary.pdf"
    } catch {
        Write-Host "Alternative conversion also failed." -ForegroundColor Red
        Write-Host "You can manually convert the markdown file using:" -ForegroundColor Yellow
        Write-Host "pandoc School_Management_System_Complete_Summary.md -o School_Management_System_Complete_Summary.pdf" -ForegroundColor Cyan
    }
} 