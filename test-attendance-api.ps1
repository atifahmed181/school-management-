# Test Attendance Management API
$baseUrl = "http://localhost:4000/api"

Write-Host "Testing Attendance Management API..." -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# First, we need to create some test data (students and classes)
Write-Host "`n📋 Setting up test data..." -ForegroundColor Yellow

# Create a test class first
$classData = @{
    name = "Test Class 10A"
    gradeLevel = "Grade 10"
    section = "A"
    academicYear = "2024-2025"
    capacity = 30
    description = "Test class for attendance API"
} | ConvertTo-Json

try {
    $classResponse = Invoke-RestMethod -Uri "$baseUrl/classes" -Method POST -Body $classData -ContentType "application/json"
    $classId = $classResponse.class.id
    Write-Host "✅ Test class created with ID: $classId" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create test class!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Create test students
$studentData1 = @{
    firstName = "Alice"
    lastName = "Johnson"
    dateOfBirth = "2008-03-15"
    gender = "female"
    studentId = "STU001"
    currentClass = "Grade 10A"
    admissionDate = "2024-09-01"
    address = "123 Test Street"
    city = "Test City"
    state = "Test State"
    postalCode = "12345"
    phoneNumber = "+1234567890"
    email = "alice.johnson@test.com"
    emergencyContactName = "John Johnson"
    emergencyContactPhone = "+1234567891"
    fatherName = "John Johnson"
    motherName = "Mary Johnson"
} | ConvertTo-Json

$studentData2 = @{
    firstName = "Bob"
    lastName = "Smith"
    dateOfBirth = "2008-07-22"
    gender = "male"
    studentId = "STU002"
    currentClass = "Grade 10A"
    admissionDate = "2024-09-01"
    address = "456 Test Avenue"
    city = "Test City"
    state = "Test State"
    postalCode = "12345"
    phoneNumber = "+1234567892"
    email = "bob.smith@test.com"
    emergencyContactName = "Jane Smith"
    emergencyContactPhone = "+1234567893"
    fatherName = "Tom Smith"
    motherName = "Jane Smith"
} | ConvertTo-Json

try {
    $student1Response = Invoke-RestMethod -Uri "$baseUrl/students" -Method POST -Body $studentData1 -ContentType "application/json"
    $student1Id = $student1Response.student.id
    Write-Host "✅ Test student 1 created with ID: $student1Id" -ForegroundColor Green
    
    $student2Response = Invoke-RestMethod -Uri "$baseUrl/students" -Method POST -Body $studentData2 -ContentType "application/json"
    $student2Id = $student2Response.student.id
    Write-Host "✅ Test student 2 created with ID: $student2Id" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create test students!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 1: Mark Student Attendance
Write-Host "`n1. Marking Student Attendance..." -ForegroundColor Yellow
$today = Get-Date -Format "yyyy-MM-dd"
$attendanceData = @{
    classId = $classId
    date = $today
    attendanceData = @(
        @{
            studentId = $student1Id
            status = "present"
            remarks = "On time"
        },
        @{
            studentId = $student2Id
            status = "late"
            remarks = "Arrived 10 minutes late"
        }
    )
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/attendance/students" -Method POST -Body $attendanceData -ContentType "application/json"
    Write-Host "✅ Student attendance marked successfully!" -ForegroundColor Green
    Write-Host "   Records created: $($response.count)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Failed to mark student attendance!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Response: $responseBody" -ForegroundColor Red
    }
}

# Test 2: Get Class Attendance
Write-Host "`n2. Getting Class Attendance..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/attendance/class/$classId/$today" -Method GET
    Write-Host "✅ Class attendance retrieved successfully!" -ForegroundColor Green
    Write-Host "   Attendance records: $($response.attendance.Count)" -ForegroundColor Cyan
    foreach ($record in $response.attendance) {
        Write-Host "     - $($record.student.firstName) $($record.student.lastName): $($record.status)" -ForegroundColor White
    }
} catch {
    Write-Host "❌ Failed to get class attendance!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Get Today's Attendance
Write-Host "`n3. Getting Today's Attendance..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/attendance/today" -Method GET
    Write-Host "✅ Today's attendance retrieved successfully!" -ForegroundColor Green
    Write-Host "   Date: $($response.date)" -ForegroundColor Cyan
    Write-Host "   Student records: $($response.studentAttendance.Count)" -ForegroundColor Cyan
    Write-Host "   Staff records: $($response.staffAttendance.Count)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Failed to get today's attendance!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Get Attendance Statistics
Write-Host "`n4. Getting Attendance Statistics..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/attendance/stats?classId=$classId" -Method GET
    Write-Host "✅ Attendance statistics retrieved successfully!" -ForegroundColor Green
    Write-Host "   Total Records: $($response.totalRecords)" -ForegroundColor Cyan
    Write-Host "   Present: $($response.presentCount)" -ForegroundColor Cyan
    Write-Host "   Absent: $($response.absentCount)" -ForegroundColor Cyan
    Write-Host "   Late: $($response.lateCount)" -ForegroundColor Cyan
    Write-Host "   Attendance %: $($response.attendancePercentage)%" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Failed to get attendance statistics!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Get Attendance by Date Range
Write-Host "`n5. Getting Attendance by Date Range..." -ForegroundColor Yellow
try {
    $startDate = (Get-Date).AddDays(-7).ToString("yyyy-MM-dd")
    $endDate = $today
    $response = Invoke-RestMethod -Uri "$baseUrl/attendance/range?startDate=$startDate&endDate=$endDate&classId=$classId" -Method GET
    Write-Host "✅ Attendance by date range retrieved successfully!" -ForegroundColor Green
    Write-Host "   Records found: $($response.attendance.Count)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Failed to get attendance by date range!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Update Attendance Record
Write-Host "`n6. Updating Attendance Record..." -ForegroundColor Yellow
# First, get the attendance record to update
try {
    $attendanceResponse = Invoke-RestMethod -Uri "$baseUrl/attendance/class/$classId/$today" -Method GET
    if ($attendanceResponse.attendance.Count -gt 0) {
        $attendanceId = $attendanceResponse.attendance[0].id
        $updateData = @{
            status = "absent"
            remarks = "Updated to absent due to illness"
        } | ConvertTo-Json

        $response = Invoke-RestMethod -Uri "$baseUrl/attendance/$attendanceId" -Method PUT -Body $updateData -ContentType "application/json"
        Write-Host "✅ Attendance record updated successfully!" -ForegroundColor Green
        Write-Host "   New Status: $($response.attendance.status)" -ForegroundColor Cyan
        Write-Host "   New Remarks: $($response.attendance.remarks)" -ForegroundColor Cyan
    } else {
        Write-Host "⚠️  No attendance records found to update" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Failed to update attendance record!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 Attendance Management API Tests Completed!" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green 