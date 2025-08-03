# Test Authentication with curl
Write-Host "Testing Authentication with curl" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green

# Test 1: Check if server is running
Write-Host "`n1. Checking if server is running..." -ForegroundColor Yellow
try {
    $response = curl -s http://localhost:4000/api/auth/login
    Write-Host "✅ Server is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Server is not running" -ForegroundColor Red
    exit
}

# Test 2: Try to access protected endpoint without token
Write-Host "`n2. Testing access without token..." -ForegroundColor Yellow
try {
    $response = curl -s -w "%{http_code}" http://localhost:4000/api/students
    if ($response -match "401") {
        Write-Host "✅ Correctly blocked without token (401)" -ForegroundColor Green
    } else {
        Write-Host "❌ Should have been blocked" -ForegroundColor Red
    }
} catch {
    Write-Host "✅ Server blocked access (expected)" -ForegroundColor Green
}

# Test 3: Login to get token
Write-Host "`n3. Logging in..." -ForegroundColor Yellow
$loginData = '{"email":"admin@school.com","password":"admin123"}'
try {
    $response = curl -s -X POST -H "Content-Type: application/json" -d $loginData http://localhost:4000/api/auth/login
    Write-Host "Login response: $response" -ForegroundColor Cyan
    
    if ($response -match "token") {
        Write-Host "✅ Login successful" -ForegroundColor Green
    } else {
        Write-Host "❌ Login failed" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Login error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=====================================" -ForegroundColor Green
Write-Host "Authentication Test Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green 