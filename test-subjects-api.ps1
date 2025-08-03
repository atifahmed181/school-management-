# Test Subjects Management API
$baseUrl = "http://localhost:4000/api"

Write-Host "Testing Subjects Management API..." -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green

# Test 1: Create Subject
Write-Host "`n1. Creating Subject..." -ForegroundColor Yellow
$subjectData = @{
    name = "Advanced Mathematics"
    code = "MATH201"
    category = "Core"
    description = "Advanced mathematical concepts including calculus and algebra"
    credits = 4
    gradeLevel = "Grade 11"
    department = "Mathematics"
    isActive = $true
    syllabus = "Calculus, Linear Algebra, Statistics"
    textbook = "Advanced Mathematics by Smith"
    maxStudents = 30
    prerequisites = "MATH101"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/subjects" -Method POST -Body $subjectData -ContentType "application/json"
    Write-Host "✅ Subject created successfully!" -ForegroundColor Green
    Write-Host "   ID: $($response.subject.id)" -ForegroundColor Cyan
    $subjectId = $response.subject.id
} catch {
    Write-Host "❌ Failed to create subject!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Response: $responseBody" -ForegroundColor Red
    }
    exit 1
}

# Test 2: Create Another Subject
Write-Host "`n2. Creating Another Subject..." -ForegroundColor Yellow
$subjectData2 = @{
    name = "Physics Fundamentals"
    code = "PHYS101"
    category = "Core"
    description = "Introduction to physics concepts and principles"
    credits = 3
    gradeLevel = "Grade 10"
    department = "Science"
    isActive = $true
    syllabus = "Mechanics, Thermodynamics, Waves"
    textbook = "Physics Fundamentals by Johnson"
    maxStudents = 25
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/subjects" -Method POST -Body $subjectData2 -ContentType "application/json"
    Write-Host "✅ Second subject created successfully!" -ForegroundColor Green
    Write-Host "   ID: $($response.subject.id)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Failed to create second subject!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Get All Subjects
Write-Host "`n3. Getting All Subjects..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/subjects" -Method GET
    Write-Host "✅ Retrieved all subjects successfully!" -ForegroundColor Green
    Write-Host "   Total Subjects: $($response.pagination.totalItems)" -ForegroundColor Cyan
    Write-Host "   Subjects:" -ForegroundColor Cyan
    foreach ($subject in $response.subjects) {
        Write-Host "     - $($subject.name) ($($subject.code)) - $($subject.department)" -ForegroundColor White
    }
} catch {
    Write-Host "❌ Failed to get subjects!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Get Subject by ID
Write-Host "`n4. Getting Subject by ID..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/subjects/$subjectId" -Method GET
    Write-Host "✅ Retrieved subject by ID successfully!" -ForegroundColor Green
    Write-Host "   Name: $($response.subject.name)" -ForegroundColor Cyan
    Write-Host "   Code: $($response.subject.code)" -ForegroundColor Cyan
    Write-Host "   Department: $($response.subject.department)" -ForegroundColor Cyan
    Write-Host "   Credits: $($response.subject.credits)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Failed to get subject by ID!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Search Subjects
Write-Host "`n5. Searching Subjects..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/subjects/search?q=Mathematics" -Method GET
    Write-Host "✅ Subject search successful!" -ForegroundColor Green
    Write-Host "   Found: $($response.subjects.Count) subject(s)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Failed to search subjects!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Get Subjects by Category
Write-Host "`n6. Getting Subjects by Category..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/subjects/category/Core" -Method GET
    Write-Host "✅ Retrieved subjects by category successfully!" -ForegroundColor Green
    Write-Host "   Core Subjects: $($response.subjects.Count)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Failed to get subjects by category!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 7: Get Subjects by Department
Write-Host "`n7. Getting Subjects by Department..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/subjects/department/Mathematics" -Method GET
    Write-Host "✅ Retrieved subjects by department successfully!" -ForegroundColor Green
    Write-Host "   Mathematics Subjects: $($response.subjects.Count)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Failed to get subjects by department!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 8: Get Subject Statistics
Write-Host "`n8. Getting Subject Statistics..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/subjects/stats" -Method GET
    Write-Host "✅ Subject statistics retrieved successfully!" -ForegroundColor Green
    Write-Host "   Total Subjects: $($response.totalSubjects)" -ForegroundColor Cyan
    Write-Host "   Active Subjects: $($response.activeSubjects)" -ForegroundColor Cyan
    Write-Host "   Core Subjects: $($response.coreSubjects)" -ForegroundColor Cyan
    Write-Host "   Elective Subjects: $($response.electiveSubjects)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Failed to get subject statistics!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 9: Update Subject
Write-Host "`n9. Updating Subject..." -ForegroundColor Yellow
$updateData = @{
    credits = 5
    description = "Updated description for Advanced Mathematics"
    maxStudents = 35
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/subjects/$subjectId" -Method PUT -Body $updateData -ContentType "application/json"
    Write-Host "✅ Subject updated successfully!" -ForegroundColor Green
    Write-Host "   New Credits: $($response.subject.credits)" -ForegroundColor Cyan
    Write-Host "   New Max Students: $($response.subject.maxStudents)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Failed to update subject!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 Subjects Management API Tests Completed!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green 