# Simple Authentication Test
$baseUrl = "http://localhost:4000/api"

Write-Host "Testing Authentication" -ForegroundColor Green
Write-Host "=====================" -ForegroundColor Green

# Test 1: Try to access protected endpoint without token
Write-Host "`n1. Testing access without token (should fail)..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/students" -Method GET
    Write-Host "❌ FAILED: Should have been blocked without token" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ SUCCESS: Correctly blocked without token" -ForegroundColor Green
    } else {
        Write-Host "❌ Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 2: Login to get token
Write-Host "`n2. Logging in to get token..." -ForegroundColor Yellow
$loginData = @{
    email = "admin@school.com"
    password = "admin123"
}

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body ($loginData | ConvertTo-Json) -ContentType "application/json"
    
    if ($loginResponse.token) {
        $token = $loginResponse.token
        Write-Host "✅ SUCCESS: Login successful, token received" -ForegroundColor Green
    } else {
        Write-Host "❌ FAILED: No token in response" -ForegroundColor Red
        exit
    }
} catch {
    Write-Host "❌ FAILED: Login failed - $($_.Exception.Message)" -ForegroundColor Red
    exit
}

# Test 3: Access protected endpoint with token
Write-Host "`n3. Testing access with valid token..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/students" -Method GET -Headers $headers
    Write-Host "✅ SUCCESS: Access granted with valid token" -ForegroundColor Green
} catch {
    Write-Host "❌ FAILED: Access denied with valid token - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Test with invalid token
Write-Host "`n4. Testing access with invalid token (should fail)..." -ForegroundColor Yellow
$invalidHeaders = @{
    "Authorization" = "Bearer invalid_token_here"
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/students" -Method GET -Headers $invalidHeaders
    Write-Host "❌ FAILED: Should have been blocked with invalid token" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ SUCCESS: Correctly blocked with invalid token" -ForegroundColor Green
    } else {
        Write-Host "❌ Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 5: Test different endpoints
Write-Host "`n5. Testing different protected endpoints..." -ForegroundColor Yellow

$endpoints = @(
    "/staff",
    "/classes", 
    "/subjects",
    "/fees",
    "/attendance/today"
)

foreach ($endpoint in $endpoints) {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl$endpoint" -Method GET -Headers $headers
        Write-Host "✅ $endpoint - Access granted" -ForegroundColor Green
    } catch {
        Write-Host "❌ $endpoint - $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=====================================" -ForegroundColor Green
Write-Host "Authentication Test Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green 