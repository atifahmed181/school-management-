# Test Staff Management API
$baseUrl = "http://localhost:4000/api"

Write-Host "Testing Staff Management API..." -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Test 1: Create Staff Member
Write-Host "`n1. Creating Staff Member..." -ForegroundColor Yellow
$staffData = @{
    employeeId = "EMP001"
    firstName = "John"
    lastName = "Doe"
    dateOfBirth = "1985-05-15"
    gender = "male"
    phoneNumber = "+1234567890"
    email = "john.doe@school.com"
    address = "123 Main Street"
    city = "New York"
    state = "NY"
    postalCode = "10001"
    hireDate = "2020-09-01"
    position = "Teacher"
    department = "Mathematics"
    qualification = "MSc Mathematics"
    specialization = "Algebra"
    salary = 50000.00
    status = "active"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/staff" -Method POST -Body $staffData -ContentType "application/json"
    Write-Host "✅ Staff member created successfully!" -ForegroundColor Green
    Write-Host "   ID: $($response.staff.id)" -ForegroundColor Cyan
    $staffId = $response.staff.id
} catch {
    Write-Host "❌ Failed to create staff member!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Response: $responseBody" -ForegroundColor Red
    }
    exit 1
}

# Test 2: Create Another Staff Member
Write-Host "`n2. Creating Another Staff Member..." -ForegroundColor Yellow
$staffData2 = @{
    employeeId = "EMP002"
    firstName = "Jane"
    lastName = "Smith"
    dateOfBirth = "1990-08-20"
    gender = "female"
    phoneNumber = "+1234567891"
    email = "jane.smith@school.com"
    address = "456 Oak Avenue"
    city = "New York"
    state = "NY"
    postalCode = "10002"
    hireDate = "2021-01-15"
    position = "Teacher"
    department = "Science"
    qualification = "PhD Physics"
    specialization = "Physics"
    salary = 55000.00
    status = "active"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/staff" -Method POST -Body $staffData2 -ContentType "application/json"
    Write-Host "✅ Second staff member created successfully!" -ForegroundColor Green
    Write-Host "   ID: $($response.staff.id)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Failed to create second staff member!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Get All Staff
Write-Host "`n3. Getting All Staff..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/staff" -Method GET
    Write-Host "✅ Retrieved all staff successfully!" -ForegroundColor Green
    Write-Host "   Total Staff: $($response.pagination.totalItems)" -ForegroundColor Cyan
    Write-Host "   Staff Members:" -ForegroundColor Cyan
    foreach ($staff in $response.staff) {
        Write-Host "     - $($staff.firstName) $($staff.lastName) ($($staff.position))" -ForegroundColor White
    }
} catch {
    Write-Host "❌ Failed to get staff!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Get Staff by ID
Write-Host "`n4. Getting Staff by ID..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/staff/$staffId" -Method GET
    Write-Host "✅ Retrieved staff by ID successfully!" -ForegroundColor Green
    Write-Host "   Name: $($response.staff.firstName) $($response.staff.lastName)" -ForegroundColor Cyan
    Write-Host "   Position: $($response.staff.position)" -ForegroundColor Cyan
    Write-Host "   Department: $($response.staff.department)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Failed to get staff by ID!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Search Staff
Write-Host "`n5. Searching Staff..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/staff/search?q=John" -Method GET
    Write-Host "✅ Staff search successful!" -ForegroundColor Green
    Write-Host "   Found: $($response.staff.Count) staff member(s)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Failed to search staff!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Get Staff Statistics
Write-Host "`n6. Getting Staff Statistics..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/staff/stats" -Method GET
    Write-Host "✅ Staff statistics retrieved successfully!" -ForegroundColor Green
    Write-Host "   Total Staff: $($response.totalStaff)" -ForegroundColor Cyan
    Write-Host "   Active Staff: $($response.activeStaff)" -ForegroundColor Cyan
    Write-Host "   Teachers: $($response.teachers)" -ForegroundColor Cyan
    Write-Host "   Admins: $($response.admins)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Failed to get staff statistics!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 7: Update Staff
Write-Host "`n7. Updating Staff..." -ForegroundColor Yellow
$updateData = @{
    salary = 52000.00
    remarks = "Updated salary and added remarks"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/staff/$staffId" -Method PUT -Body $updateData -ContentType "application/json"
    Write-Host "✅ Staff updated successfully!" -ForegroundColor Green
    Write-Host "   New Salary: $($response.staff.salary)" -ForegroundColor Cyan
    Write-Host "   Remarks: $($response.staff.remarks)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Failed to update staff!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 Staff Management API Tests Completed!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green 