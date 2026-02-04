# Script to fix Prisma EPERM error
# Run this script from the project root directory

Write-Host "Starting Prisma fix..." -ForegroundColor Green

# Step 1: Remove .prisma folder if exists
Write-Host "`nStep 1: Removing old .prisma folder..." -ForegroundColor Yellow
if (Test-Path "node_modules\.prisma") {
    Remove-Item -Recurse -Force "node_modules\.prisma" -ErrorAction SilentlyContinue
    Write-Host "✓ Removed .prisma folder" -ForegroundColor Green
} else {
    Write-Host "✓ .prisma folder doesn't exist" -ForegroundColor Green
}

# Step 2: Generate Prisma Client
Write-Host "`nStep 2: Generating Prisma Client..." -ForegroundColor Yellow
try {
    npx prisma generate
    Write-Host "✓ Prisma Client generated successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Error generating Prisma Client: $_" -ForegroundColor Red
    exit 1
}

# Step 3: Run Migration
Write-Host "`nStep 3: Running migration..." -ForegroundColor Yellow
try {
    npx prisma migrate dev --name add_website_settings_and_contact_submissions
    Write-Host "✓ Migration completed successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Error running migration: $_" -ForegroundColor Red
    Write-Host "Note: If migration already exists, this is normal" -ForegroundColor Yellow
}

Write-Host "`n✓ All done! You can now restart your dev server with: npm run dev" -ForegroundColor Green
