# Script to fix Prisma generate EPERM error
# This script stops Node processes and regenerates Prisma Client

Write-Host "Stopping Node.js processes..." -ForegroundColor Yellow

# Get all Node processes except Cursor's internal processes
$nodeProcesses = Get-Process | Where-Object { 
    $_.ProcessName -eq "node" -and 
    $_.Path -notlike "*cursor*" -and
    $_.Path -notlike "*Cursor*"
}

if ($nodeProcesses) {
    Write-Host "Found $($nodeProcesses.Count) Node.js process(es) to stop" -ForegroundColor Yellow
    $nodeProcesses | ForEach-Object {
        Write-Host "Stopping process: $($_.Id) - $($_.Path)" -ForegroundColor Gray
        try {
            Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
        } catch {
            Write-Host "Could not stop process $($_.Id)" -ForegroundColor Red
        }
    }
    Start-Sleep -Seconds 2
} else {
    Write-Host "No Node.js processes found to stop" -ForegroundColor Green
}

# Navigate to project directory
$projectPath = Get-ChildItem "G:\Nextjs-Project" -Directory | Where-Object { $_.Name -like "*Jinan*" } | Select-Object -First 1

if ($projectPath) {
    Set-Location $projectPath.FullName
    Write-Host "`nCurrent directory: $(Get-Location)" -ForegroundColor Cyan
    
    # Try to unlock the file by removing it
    $prismaEnginePath = "node_modules\.prisma\client\query_engine-windows.dll.node"
    if (Test-Path $prismaEnginePath) {
        Write-Host "Attempting to remove locked Prisma engine file..." -ForegroundColor Yellow
        try {
            Remove-Item $prismaEnginePath -Force -ErrorAction SilentlyContinue
            Start-Sleep -Seconds 1
        } catch {
            Write-Host "Could not remove file (may be locked)" -ForegroundColor Yellow
        }
    }
    
    Write-Host "`nGenerating Prisma Client..." -ForegroundColor Cyan
    npx prisma generate
    
    Write-Host "`nRunning Prisma migration..." -ForegroundColor Cyan
    npx prisma migrate dev --name add_user_isactive
    
    Write-Host "`nDone!" -ForegroundColor Green
} else {
    Write-Host "Project directory not found!" -ForegroundColor Red
}

