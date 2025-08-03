# Test Fees API
$baseUrl = "http://localhost:4000/api"

Write-Host "Testing Fees API" -ForegroundColor Green
Write-Host "================" -ForegroundColor Green

# Test 1: Create fee types
Write-Host "`n1. Creating fee types..." -ForegroundColor Yellow

$feeTypes = @(
    @{
        name = "Tuition Fee"
        description = "Monthly tuition fee for academic year"
        amount = 5000
    },
    @{
        name = "Library Fee"
        description = "Annual library membership fee"
        amount = 1000
    },
    @{
        name = "Exam Fee"
        description = "Semester examination fee"
        amount = 1500
    }
)

$createdFees = @()

foreach ($fee in $feeTypes) {
    $response = Invoke-RestMethod -Uri "$baseUrl/fees" -Method POST -Body ($fee | ConvertTo-Json) -ContentType "application/json"
    $createdFees += $response.fee
    Write-Host "Created: $($fee.name) - $($fee.amount)" -ForegroundColor Cyan
}

# Test 2: Get all fee types
Write-Host "`n2. Getting all fee types..." -ForegroundColor Yellow

$response = Invoke-RestMethod -Uri "$baseUrl/fees" -Method GET

Write-Host "Response:" -ForegroundColor Cyan
$response | ConvertTo-Json -Depth 10

# Test 3: Update a fee type
Write-Host "`n3. Updating a fee type..." -ForegroundColor Yellow

if ($createdFees.Count -gt 0) {
    $feeToUpdate = $createdFees[0]
    $updateData = @{
        amount = 5500
        description = "Updated: Monthly tuition fee for academic year"
    }
    
    $response = Invoke-RestMethod -Uri "$baseUrl/fees/$($feeToUpdate.id)" -Method PUT -Body ($updateData | ConvertTo-Json) -ContentType "application/json"
    
    Write-Host "Updated fee:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
}

# Test 4: Create fee payments (assuming we have students)
Write-Host "`n4. Creating fee payments..." -ForegroundColor Yellow

# First, let's get some students to create payments for
try {
    $studentsResponse = Invoke-RestMethod -Uri "$baseUrl/students" -Method GET
    $students = $studentsResponse.students
    
    if ($students -and $students.Count -gt 0) {
        $student = $students[0]
        $fee = $createdFees[0]
        
        $paymentData = @{
            studentId = $student.id
            feeId = $fee.id
            amountPaid = $fee.amount
            paymentDate = (Get-Date).ToString("yyyy-MM-dd")
            paymentMethod = "Cash"
            remarks = "Payment received in full"
        }
        
        $response = Invoke-RestMethod -Uri "$baseUrl/fees/payments" -Method POST -Body ($paymentData | ConvertTo-Json) -ContentType "application/json"
        
        Write-Host "Created payment:" -ForegroundColor Cyan
        $response | ConvertTo-Json -Depth 10
    } else {
        Write-Host "No students found to create payments for" -ForegroundColor Red
    }
} catch {
    Write-Host "Error getting students: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Get all payments
Write-Host "`n5. Getting all payments..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/fees/payments" -Method GET
    
    Write-Host "Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error getting payments: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Get payments by student (if we have students)
Write-Host "`n6. Getting payments by student..." -ForegroundColor Yellow

try {
    if ($students -and $students.Count -gt 0) {
        $student = $students[0]
        $response = Invoke-RestMethod -Uri "$baseUrl/fees/student/$($student.id)" -Method GET
        
        Write-Host "Payments for student $($student.firstName) $($student.lastName):" -ForegroundColor Cyan
        $response | ConvertTo-Json -Depth 10
    } else {
        Write-Host "No students found to test payments by student" -ForegroundColor Red
    }
} catch {
    Write-Host "Error getting payments by student: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 7: Delete a fee type (optional - comment out if you want to keep the data)
Write-Host "`n7. Deleting a fee type..." -ForegroundColor Yellow

if ($createdFees.Count -gt 1) {
    $feeToDelete = $createdFees[1]
    $response = Invoke-RestMethod -Uri "$baseUrl/fees/$($feeToDelete.id)" -Method DELETE
    
    Write-Host "Deleted fee: $($feeToDelete.name)" -ForegroundColor Cyan
    Write-Host "Response: $($response.message)" -ForegroundColor Cyan
}

Write-Host "`nFees API tests completed!" -ForegroundColor Green 