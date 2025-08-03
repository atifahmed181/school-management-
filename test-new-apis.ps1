# Test New APIs (Exams, Reports, Dashboard)
$baseUrl = "http://localhost:4000/api"

Write-Host "Testing New APIs (Exams, Reports, Dashboard)..." -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green

# Step 1: Login to get token
Write-Host "`n1. Logging in..." -ForegroundColor Yellow
$loginBody = @{
    email = "admin@school.com"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $loginData = $loginResponse.Content | ConvertFrom-Json
    $token = $loginData.token
    Write-Host "✅ Login successful" -ForegroundColor Green
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

$headers = @{
    Authorization = "Bearer $token"
    "Content-Type" = "application/json"
}

# Step 2: Test Exams API
Write-Host "`n2. Testing Exams API..." -ForegroundColor Cyan
Write-Host "----------------------" -ForegroundColor Cyan

# Create a test class first (if needed)
Write-Host "Creating test class..." -ForegroundColor Yellow
$classData = @{
    name = "Test Class 10A"
    gradeLevel = "10"
    section = "A"
    academicYear = "2024-2025"
    capacity = 30
    description = "Test class for exam API"
} | ConvertTo-Json

try {
    $classResponse = Invoke-WebRequest -Uri "$baseUrl/classes" -Method POST -Body $classData -Headers $headers
    $classData = $classResponse.Content | ConvertFrom-Json
    $classId = $classData.class.id
    Write-Host "✅ Test class created with ID: $classId" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Class creation failed, using existing class" -ForegroundColor Yellow
    $classId = 1
}

# Create a test subject first (if needed)
Write-Host "Creating test subject..." -ForegroundColor Yellow
$subjectData = @{
    name = "Test Mathematics"
    code = "MATH101"
    category = "Core"
    description = "Test subject for exam API"
    credits = 4
    gradeLevel = "Grade 10"
    department = "Mathematics"
} | ConvertTo-Json

try {
    $subjectResponse = Invoke-WebRequest -Uri "$baseUrl/subjects" -Method POST -Body $subjectData -Headers $headers
    $subjectData = $subjectResponse.Content | ConvertFrom-Json
    $subjectId = $subjectData.subject.id
    Write-Host "✅ Test subject created with ID: $subjectId" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Subject creation failed, using existing subject" -ForegroundColor Yellow
    $subjectId = 1
}

# Create an exam
Write-Host "Creating exam..." -ForegroundColor Yellow
$examData = @{
    name = "Midterm Mathematics Test"
    examType = "midterm"
    classId = $classId
    subjectId = $subjectId
    examDate = "2024-12-15"
    startTime = "09:00"
    endTime = "11:00"
    totalMarks = 100
    passingMarks = 40
    instructions = "Bring calculator and ruler"
    venue = "Room 101"
} | ConvertTo-Json

try {
    $examResponse = Invoke-WebRequest -Uri "$baseUrl/exams" -Method POST -Body $examData -Headers $headers
    $examData = $examResponse.Content | ConvertFrom-Json
    $examId = $examData.exam.id
    Write-Host "✅ Exam created with ID: $examId" -ForegroundColor Green
} catch {
    Write-Host "❌ Exam creation failed: $($_.Exception.Message)" -ForegroundColor Red
    $examId = 1
}

# Get all exams
Write-Host "Getting all exams..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/exams" -Method GET -Headers $headers
    Write-Host "✅ GET /api/exams successful" -ForegroundColor Green
} catch {
    Write-Host "❌ GET /api/exams failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Get exam by ID
Write-Host "Getting exam by ID..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/exams/$examId" -Method GET -Headers $headers
    Write-Host "✅ GET /api/exams/$examId successful" -ForegroundColor Green
} catch {
    Write-Host "❌ GET /api/exams/$examId failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 3: Test Reports API
Write-Host "`n3. Testing Reports API..." -ForegroundColor Cyan
Write-Host "----------------------" -ForegroundColor Cyan

# Dashboard overview report
Write-Host "Getting dashboard overview..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/reports/dashboard/overview" -Method GET -Headers $headers
    Write-Host "✅ GET /api/reports/dashboard/overview successful" -ForegroundColor Green
} catch {
    Write-Host "❌ GET /api/reports/dashboard/overview failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Attendance report
Write-Host "Getting attendance report..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/reports/attendance" -Method GET -Headers $headers
    Write-Host "✅ GET /api/reports/attendance successful" -ForegroundColor Green
} catch {
    Write-Host "❌ GET /api/reports/attendance failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Financial report
Write-Host "Getting financial report..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/reports/financial" -Method GET -Headers $headers
    Write-Host "✅ GET /api/reports/financial successful" -ForegroundColor Green
} catch {
    Write-Host "❌ GET /api/reports/financial failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 4: Test Dashboard API
Write-Host "`n4. Testing Dashboard API..." -ForegroundColor Cyan
Write-Host "------------------------" -ForegroundColor Cyan

# Admin dashboard
Write-Host "Getting admin dashboard..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/dashboard/admin" -Method GET -Headers $headers
    Write-Host "✅ GET /api/dashboard/admin successful" -ForegroundColor Green
} catch {
    Write-Host "❌ GET /api/dashboard/admin failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Analytics
Write-Host "Getting analytics..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/dashboard/analytics" -Method GET -Headers $headers
    Write-Host "✅ GET /api/dashboard/analytics successful" -ForegroundColor Green
} catch {
    Write-Host "❌ GET /api/dashboard/analytics failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== New APIs Testing Complete ===" -ForegroundColor Green
Write-Host "✅ Exams API tested" -ForegroundColor Green
Write-Host "✅ Reports API tested" -ForegroundColor Green
Write-Host "✅ Dashboard API tested" -ForegroundColor Green 