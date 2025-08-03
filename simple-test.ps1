# Simple Classes API Test
Write-Host "Testing Classes API..." -ForegroundColor Green

# Step 1: Login and get token
Write-Host "1. Logging in..." -ForegroundColor Yellow
$loginResponse = Invoke-WebRequest -Uri "http://localhost:4000/api/auth/login" -Method POST -Body '{"email":"testadmin@school.com","password":"test123"}' -ContentType "application/json"
$loginData = $loginResponse.Content | ConvertFrom-Json
$token = $loginData.token

Write-Host "✅ Login successful" -ForegroundColor Green
Write-Host "Token received: $($token.Length) characters" -ForegroundColor Gray

# Step 2: Test Classes API without authentication (should fail)
Write-Host "`n2. Testing without authentication..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000/api/classes" -Method GET
    Write-Host "❌ Should have failed - no auth required" -ForegroundColor Red
} catch {
    Write-Host "✅ Correctly requires authentication" -ForegroundColor Green
}

# Step 3: Test with authentication
Write-Host "`n3. Testing with authentication..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000/api/classes" -Method GET -Headers $headers
    Write-Host "✅ Classes API working!" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Classes API failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "This might be a permission issue" -ForegroundColor Yellow
}

Write-Host "`nTest completed!" -ForegroundColor Green 