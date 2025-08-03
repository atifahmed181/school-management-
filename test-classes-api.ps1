# Classes API Test Script
Write-Host "=== Classes API Testing ===" -ForegroundColor Green

# Step 1: Register a test user
Write-Host "1. Registering test user..." -ForegroundColor Yellow
$registerBody = @{
    name = "Test Admin"
    email = "testadmin@school.com"
    password = "test123"
    role = "admin"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-WebRequest -Uri "http://localhost:4000/api/auth/register" -Method POST -Body $registerBody -ContentType "application/json"
    Write-Host "✅ User registered successfully" -ForegroundColor Green
    Write-Host "Response: $($registerResponse.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 2: Login to get token
Write-Host "`n2. Logging in..." -ForegroundColor Yellow
$loginBody = @{
    email = "testadmin@school.com"
    password = "test123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-WebRequest -Uri "http://localhost:4000/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $loginData = $loginResponse.Content | ConvertFrom-Json
    $token = $loginData.token
    Write-Host "✅ Login successful" -ForegroundColor Green
    Write-Host "Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

# Step 3: Test Classes API endpoints
$headers = @{
    Authorization = "Bearer $token"
    "Content-Type" = "application/json"
}

# Test 3.1: Get all classes (should be empty initially)
Write-Host "`n3.1 Testing GET /api/classes..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000/api/classes" -Method GET -Headers $headers
    Write-Host "✅ GET /api/classes successful" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ GET /api/classes failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3.2: Create a class
Write-Host "`n3.2 Testing POST /api/classes..." -ForegroundColor Yellow
$classData = @{
    name = "Grade 10-A"
    gradeLevel = "10"
    section = "A"
    academicYear = "2024-2025"
    capacity = 30
    description = "Science section for Grade 10"
    roomNumber = "101"
    schedule = "Monday-Friday 8:00 AM - 2:00 PM"
    isActive = $true
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000/api/classes" -Method POST -Body $classData -Headers $headers
    Write-Host "✅ POST /api/classes successful" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
    $createdClass = $response.Content | ConvertFrom-Json
    $classId = $createdClass.class.id
} catch {
    Write-Host "❌ POST /api/classes failed: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

# Test 3.3: Create another class
Write-Host "`n3.3 Creating second class..." -ForegroundColor Yellow
$classData2 = @{
    name = "Grade 9-B"
    gradeLevel = "9"
    section = "B"
    academicYear = "2024-2025"
    capacity = 25
    description = "Arts section for Grade 9"
    roomNumber = "102"
    schedule = "Monday-Friday 8:30 AM - 2:30 PM"
    isActive = $true
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000/api/classes" -Method POST -Body $classData2 -Headers $headers
    Write-Host "✅ Second class created successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Second class creation failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3.4: Get all classes (should now have 2 classes)
Write-Host "`n3.4 Testing GET /api/classes (should have 2 classes)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000/api/classes" -Method GET -Headers $headers
    Write-Host "✅ GET /api/classes successful" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ GET /api/classes failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3.5: Get class by ID
Write-Host "`n3.5 Testing GET /api/classes/$classId..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000/api/classes/$classId" -Method GET -Headers $headers
    Write-Host "✅ GET /api/classes/$classId successful" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ GET /api/classes/$classId failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3.6: Update class
Write-Host "`n3.6 Testing PUT /api/classes/$classId..." -ForegroundColor Yellow
$updateData = @{
    capacity = 35
    description = "Updated: Science section for Grade 10 with increased capacity"
    roomNumber = "103"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000/api/classes/$classId" -Method PUT -Body $updateData -Headers $headers
    Write-Host "✅ PUT /api/classes/$classId successful" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ PUT /api/classes/$classId failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3.7: Search classes
Write-Host "`n3.7 Testing GET /api/classes/search?q=Grade..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000/api/classes/search?q=Grade" -Method GET -Headers $headers
    Write-Host "✅ Search successful" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Search failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3.8: Get class statistics
Write-Host "`n3.8 Testing GET /api/classes/stats/overview..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000/api/classes/stats/overview" -Method GET -Headers $headers
    Write-Host "✅ Statistics successful" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Statistics failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3.9: Test filtering
Write-Host "`n3.9 Testing GET /api/classes?gradeLevel=10..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000/api/classes?gradeLevel=10" -Method GET -Headers $headers
    Write-Host "✅ Filtering successful" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Filtering failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Testing Complete ===" -ForegroundColor Green 