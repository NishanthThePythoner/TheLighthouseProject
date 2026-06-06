# auto-sync.ps1
# Watches the project folder for edits and automatically pushes them to GitHub.

$folder = Get-Location
$filter = "*.*"

$fsw = New-Object IO.FileSystemWatcher $folder, $filter
$fsw.IncludeSubdirectories = $true
$fsw.EnableRaisingEvents = $true

# Track active sync
$global:IsSyncing = $false

$action = {
    $path = $Event.SourceEventArgs.FullPath
    
    # Exclude system folders, node_modules, and git files
    if ($path -match '\\\.git' -or $path -match '\\node_modules' -or $path -match 'auto-sync\.ps1' -or $path -match '\.crdownload$') {
        return
    }

    if ($global:IsSyncing) {
        return
    }

    $global:IsSyncing = $true
    
    # Debounce window (wait for typing/saving to finish)
    Start-Sleep -Seconds 5
    
    Write-Host "Syncing changes to GitHub..." -ForegroundColor Yellow
    
    try {
        git add .
        # Check if there are changes to commit
        $status = git status --porcelain
        if ($status) {
            git commit -m "Auto-update: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
            git push origin main
            Write-Host "Successfully synced to GitHub!" -ForegroundColor Green
        } else {
            Write-Host "No changes detected to commit." -ForegroundColor Gray
        }
    } catch {
        Write-Host "Error occurred during git sync: $_" -ForegroundColor Red
    } finally {
        $global:IsSyncing = $false
    }
}

$handlers = @()
$handlers += Register-ObjectEvent $fsw -EventName Created -Action $action
$handlers += Register-ObjectEvent $fsw -EventName Changed -Action $action
$handlers += Register-ObjectEvent $fsw -EventName Deleted -Action $action
$handlers += Register-ObjectEvent $fsw -EventName Renamed -Action $action

Write-Host "Lighthouse Auto-Sync is now running." -ForegroundColor Cyan
Write-Host "Watching: $folder" -ForegroundColor Cyan
Write-Host "Keep this window open. Press Ctrl+C to terminate." -ForegroundColor Yellow

try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    Write-Host "Shutting down file watcher..." -ForegroundColor Yellow
    $handlers | ForEach-Object { Unregister-Event -SourceIdentifier $_.Name }
}
