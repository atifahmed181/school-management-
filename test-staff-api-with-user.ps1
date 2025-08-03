# Test Staff API with User Creation
$baseUrl = "http://localhost:4000/api"

Write-Host "Testing Staff API with User Creation" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Test 1: Create a new staff member (should create user account)
Write-Host "`n1. Creating new staff member..." -ForegroundColor Yellow

$staffData = @{
    employeeId = "EMP003"
    firstName = "Jane"
    lastName = "Smith"
    middleName = "Marie"
    dateOfBirth = "1985-03-15"
    gender = "female"
    phoneNumber = "+1234567890"
    alternatePhone = "+1234567891"
    email = "jane.smith2@school.com"
    address = "456 Oak Street"
    city = "Springfield"
    state = "IL"
    postalCode = "62701"
    hireDate = "2023-08-15"
    position = "Teacher"
    department = "Mathematics"
    qualification = "MSc Mathematics"
    specialization = "Algebra"
    salary = 55000
    status = "active"
    remarks = "Excellent teacher with 5 years experience"
}

$response = Invoke-RestMethod -Uri "$baseUrl/staff" -Method POST -Body ($staffData | ConvertTo-Json) -ContentType "application/json"

Write-Host "Response:" -ForegroundColor Cyan
$response | ConvertTo-Json -Depth 10

# Test 2: Get all staff members
Write-Host "`n2. Getting all staff members..." -ForegroundColor Yellow

$response = Invoke-RestMethod -Uri "$baseUrl/staff" -Method GET

Write-Host "Response:" -ForegroundColor Cyan
$response | ConvertTo-Json -Depth 10

# Test 3: Get staff by ID (using the first staff member)
Write-Host "`n3. Getting staff member by ID..." -ForegroundColor Yellow

if ($response.staff -and $response.staff.Count -gt 0) {
    $staffId = $response.staff[0].id
    $response = Invoke-RestMethod -Uri "$baseUrl/staff/$staffId" -Method GET
    
    Write-Host "Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
} else {
    Write-Host "No staff members found to test get by ID" -ForegroundColor Red
}

# Test 4: Search staff members
Write-Host "`n4. Searching staff members..." -ForegroundColor Yellow

$response = Invoke-RestMethod -Uri "$baseUrl/staff/search?q=Jane" -Method GET

Write-Host "Response:" -ForegroundColor Cyan
$response | ConvertTo-Json -Depth 10

# Test 5: Get staff statistics
Write-Host "`n5. Getting staff statistics..." -ForegroundColor Yellow

$response = Invoke-RestMethod -Uri "$baseUrl/staff/stats" -Method GET

Write-Host "Response:" -ForegroundColor Cyan
$response | ConvertTo-Json -Depth 10

Write-Host "`nStaff API tests completed!" -ForegroundColor Green 