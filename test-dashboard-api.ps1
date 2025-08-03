# Test Dashboard APIs
Write-Host "Testing Dashboard APIs..." -ForegroundColor Green

# Base URL
$baseUrl = "http://localhost:3001/api"

# Test admin dashboard
Write-Host "`n1. Testing Admin Dashboard..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/dashboard/admin" -Method GET -Headers @{
        "Authorization" = "Bearer $adminToken"
        "Content-Type" = "application/json"
    }
    Write-Host "✅ Admin Dashboard - Success" -ForegroundColor Green
    Write-Host "   Total Students: $($response.totalStudents)" -ForegroundColor Cyan
    Write-Host "   Total Staff: $($response.totalStaff)" -ForegroundColor Cyan
    Write-Host "   Total Classes: $($response.totalClasses)" -ForegroundColor Cyan
    Write-Host "   Attendance Rate: $($response.attendanceRate)%" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Admin Dashboard - Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test teacher dashboard
Write-Host "`n2. Testing Teacher Dashboard..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/dashboard/teacher" -Method GET -Headers @{
        "Authorization" = "Bearer $teacherToken"
        "Content-Type" = "application/json"
    }
    Write-Host "✅ Teacher Dashboard - Success" -ForegroundColor Green
    Write-Host "   Total Students: $($response.totalStudents)" -ForegroundColor Cyan
    Write-Host "   Total Classes: $($response.totalClasses)" -ForegroundColor Cyan
    Write-Host "   Attendance Rate: $($response.attendanceRate)%" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Teacher Dashboard - Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test student dashboard
Write-Host "`n3. Testing Student Dashboard..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/dashboard/student" -Method GET -Headers @{
        "Authorization" = "Bearer $studentToken"
        "Content-Type" = "application/json"
    }
    Write-Host "✅ Student Dashboard - Success" -ForegroundColor Green
    Write-Host "   Student Name: $($response.profile.firstName) $($response.profile.lastName)" -ForegroundColor Cyan
    Write-Host "   Current Class: $($response.profile.currentClass)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Student Dashboard - Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test parent dashboard
Write-Host "`n4. Testing Parent Dashboard..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/dashboard/parent" -Method GET -Headers @{
        "Authorization" = "Bearer $studentToken"
        "Content-Type" = "application/json"
    }
    Write-Host "✅ Parent Dashboard - Success" -ForegroundColor Green
    Write-Host "   Children Count: $($response.children.Count)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Parent Dashboard - Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test analytics
Write-Host "`n5. Testing Analytics..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/dashboard/analytics?period=month" -Method GET -Headers @{
        "Authorization" = "Bearer $adminToken"
        "Content-Type" = "application/json"
    }
    Write-Host "✅ Analytics - Success" -ForegroundColor Green
    Write-Host "   Period: $($response.period)" -ForegroundColor Cyan
    Write-Host "   Student Growth: $($response.growth.students)" -ForegroundColor Cyan
    Write-Host "   Staff Growth: $($response.growth.staff)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Analytics - Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nDashboard API Testing Complete!" -ForegroundColor Green 