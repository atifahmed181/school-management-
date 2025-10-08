# PowerShell Script to Setup Backend .env File
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "School Management System - Backend Setup" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env already exists
if (Test-Path "backend\.env") {
    Write-Host "⚠️  backend\.env file already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (yes/no)"
    if ($overwrite -ne "yes") {
        Write-Host "Setup cancelled." -ForegroundColor Red
        exit
    }
}

Write-Host "📝 Let's configure your database connection..." -ForegroundColor Green
Write-Host ""

# Get PostgreSQL credentials
Write-Host "Enter your PostgreSQL database credentials:" -ForegroundColor Yellow
Write-Host "(Press Enter to use default values shown in brackets)" -ForegroundColor Gray
Write-Host ""

$dbHost = Read-Host "Database Host [localhost]"
if ([string]::IsNullOrWhiteSpace($dbHost)) { $dbHost = "localhost" }

$dbPort = Read-Host "Database Port [5432]"
if ([string]::IsNullOrWhiteSpace($dbPort)) { $dbPort = "5432" }

$dbName = Read-Host "Database Name [school_mgmt]"
if ([string]::IsNullOrWhiteSpace($dbName)) { $dbName = "school_mgmt" }

$dbUser = Read-Host "Database User [postgres]"
if ([string]::IsNullOrWhiteSpace($dbUser)) { $dbUser = "postgres" }

$dbPass = Read-Host "Database Password (REQUIRED - no default)" -AsSecureString
$dbPassPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPass))

if ([string]::IsNullOrWhiteSpace($dbPassPlain)) {
    Write-Host ""
    Write-Host "❌ Error: Database password is required!" -ForegroundColor Red
    Write-Host "Please run this script again and provide your PostgreSQL password." -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "Other settings (you can usually keep these as default):" -ForegroundColor Yellow

$jwtSecret = Read-Host "JWT Secret [school-mgmt-secret-key-2024]"
if ([string]::IsNullOrWhiteSpace($jwtSecret)) { $jwtSecret = "school-mgmt-secret-key-2024" }

$jwtExpires = Read-Host "JWT Expires In [1d]"
if ([string]::IsNullOrWhiteSpace($jwtExpires)) { $jwtExpires = "1d" }

$port = Read-Host "Server Port [4000]"
if ([string]::IsNullOrWhiteSpace($port)) { $port = "4000" }

# Create .env content
$envContent = @"
# Database Configuration
DB_HOST=$dbHost
DB_PORT=$dbPort
DB_NAME=$dbName
DB_USER=$dbUser
DB_PASS=$dbPassPlain

# JWT Configuration
JWT_SECRET=$jwtSecret
JWT_EXPIRES_IN=$jwtExpires

# Server Configuration
PORT=$port
"@

# Write to file
$envContent | Out-File -FilePath "backend\.env" -Encoding UTF8 -NoNewline

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "✅ Success! Configuration file created!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Configuration saved to: backend\.env" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your settings:" -ForegroundColor Yellow
Write-Host "  Database Host: $dbHost" -ForegroundColor Gray
Write-Host "  Database Port: $dbPort" -ForegroundColor Gray
Write-Host "  Database Name: $dbName" -ForegroundColor Gray
Write-Host "  Database User: $dbUser" -ForegroundColor Gray
Write-Host "  Database Password: ********" -ForegroundColor Gray
Write-Host "  Server Port: $port" -ForegroundColor Gray
Write-Host ""
Write-Host "📌 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Make sure PostgreSQL is running" -ForegroundColor White
Write-Host "  2. Make sure database '$dbName' exists (or it will be created)" -ForegroundColor White
Write-Host "  3. Start the backend server:" -ForegroundColor White
Write-Host "     cd backend" -ForegroundColor Gray
Write-Host "     npm install" -ForegroundColor Gray
Write-Host "     npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "🎉 Happy coding!" -ForegroundColor Green

