# Test Registration Endpoint
$baseUrl = "http://localhost:4000/api"

Write-Host "Testing Registration Endpoint..." -ForegroundColor Green

# Test data
$testUser = @{
    name = "Test User"
    email = "test@example.com"
    password = "password123"
    role = "admin"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -Body $testUser -ContentType "application/json"
    Write-Host "Registration successful!" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json)" -ForegroundColor Yellow
} catch {
    Write-Host "Registration failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Red
    }
}

Write-Host "`nTesting with teacher role..." -ForegroundColor Green

$testTeacher = @{
    name = "Test Teacher"
    email = "teacher@example.com"
    password = "password123"
    role = "teacher"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -Body $testTeacher -ContentType "application/json"
    Write-Host "Teacher registration successful!" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json)" -ForegroundColor Yellow
} catch {
    Write-Host "Teacher registration failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Red
    }
} 