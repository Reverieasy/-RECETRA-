# RECETRA Development Server Manager
# PowerShell script to easily start/stop development servers

param(
    [Parameter(Position=0)]
    [ValidateSet("web", "mobile", "both", "stop", "status")]
    [string]$Action = "status"
)

# Function to check if a port is in use
function Test-Port {
    param([int]$Port)
    try {
        $connection = Test-NetConnection -ComputerName localhost -Port $Port -InformationLevel Quiet -WarningAction SilentlyContinue
        return $connection.TcpTestSucceeded
    }
    catch {
        return $false
    }
}

# Function to kill processes by port
function Stop-ProcessByPort {
    param([int]$Port)
    try {
        $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
        foreach ($pid in $processes) {
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            Write-Host "Killed process on port $Port (PID: $pid)" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "No processes found on port $Port" -ForegroundColor Gray
    }
}

# Function to start web server
function Start-WebServer {
    Write-Host "Starting Web Server..." -ForegroundColor Green
    if (Test-Port -Port 5173) {
        Write-Host "Port 5173 is already in use. Stopping existing process..." -ForegroundColor Yellow
        Stop-ProcessByPort -Port 5173
        Start-Sleep -Seconds 2
    }
    
    Set-Location "web"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"
    Set-Location ".."
    Write-Host "Web server started on http://localhost:5173" -ForegroundColor Green
}

# Function to start mobile server
function Start-MobileServer {
    Write-Host "Starting Mobile Server..." -ForegroundColor Green
    if (Test-Port -Port 8081) {
        Write-Host "Port 8081 is already in use. Stopping existing process..." -ForegroundColor Yellow
        Stop-ProcessByPort -Port 8081
        Start-Sleep -Seconds 2
    }
    
    Set-Location "mobile"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start"
    Set-Location ".."
    Write-Host "Mobile server started. Check Expo for QR code." -ForegroundColor Green
}

# Function to stop all servers
function Stop-AllServers {
    Write-Host "Stopping all development servers..." -ForegroundColor Red
    
    # Kill common development ports
    $ports = @(3000, 5173, 8081, 19000, 19001, 19002)
    foreach ($port in $ports) {
        Stop-ProcessByPort -Port $port
    }
    
    # Kill Node.js processes
    try {
        Get-Process | Where-Object {$_.ProcessName -like "*node*" -or $_.ProcessName -like "*npm*" -or $_.ProcessName -like "*expo*"} | Stop-Process -Force -ErrorAction SilentlyContinue
        Write-Host "Stopped all Node.js/Expo processes" -ForegroundColor Yellow
    }
    catch {
        Write-Host "No Node.js processes found" -ForegroundColor Gray
    }
    
    Write-Host "All servers stopped!" -ForegroundColor Green
}

# Function to show server status
function Show-ServerStatus {
    Write-Host "=== RECETRA Development Server Status ===" -ForegroundColor Cyan
    
    $webPort = Test-Port -Port 5173
    $mobilePort = Test-Port -Port 8081
    
    Write-Host "Web Server (Port 5173): " -NoNewline
    if ($webPort) {
        Write-Host "RUNNING" -ForegroundColor Green
        Write-Host "  → http://localhost:5173" -ForegroundColor Gray
    } else {
        Write-Host "STOPPED" -ForegroundColor Red
    }
    
    Write-Host "Mobile Server (Port 8081): " -NoNewline
    if ($mobilePort) {
        Write-Host "RUNNING" -ForegroundColor Green
        Write-Host "  → Check Expo for QR code" -ForegroundColor Gray
    } else {
        Write-Host "STOPPED" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\start-dev.ps1 web      - Start web server only"
    Write-Host "  .\start-dev.ps1 mobile   - Start mobile server only"
    Write-Host "  .\start-dev.ps1 both     - Start both servers"
    Write-Host "  .\start-dev.ps1 stop     - Stop all servers"
    Write-Host "  .\start-dev.ps1 status   - Show server status (default)"
}

# Main execution
switch ($Action.ToLower()) {
    "web" {
        Start-WebServer
    }
    "mobile" {
        Start-MobileServer
    }
    "both" {
        Start-WebServer
        Start-Sleep -Seconds 3
        Start-MobileServer
    }
    "stop" {
        Stop-AllServers
    }
    "status" {
        Show-ServerStatus
    }
    default {
        Show-ServerStatus
    }
}

