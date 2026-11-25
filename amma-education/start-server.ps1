# PowerShell Lightweight Local Web Server for AMMA EDUCATION Portal
$port = 3000
$root = $PSScriptRoot

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  AMMA EDUCATION (DDU-GKY) - Local Web Server" -ForegroundColor Yellow
Write-Host "  Center: Guntupalli, Near Vijayawada, Andhra Pradesh" -ForegroundColor White
Write-Host "  In-Charge: Manikanta (7396538004)" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Starting local server at http://localhost:$port/" -ForegroundColor Green
Write-Host "Public Portal: http://localhost:$port/index.html" -ForegroundColor White
Write-Host "Admin Portal:  http://localhost:$port/admin.html" -ForegroundColor White
Write-Host "Press Ctrl+C to stop the server anytime." -ForegroundColor Gray
Write-Host "----------------------------------------------------------"

# Launch default browser
Start-Process "http://localhost:$port/index.html"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($urlPath)) {
            $urlPath = "index.html"
        }

        $filePath = Join-Path $root $urlPath
        if (Test-Path $filePath -PathType Leaf) {
            $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = switch ($extension) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".svg"  { "image/svg+xml" }
                ".json" { "application/json" }
                default { "application/octet-stream" }
            }

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 - File Not Found: $urlPath")
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
        $response.Close()
    }
} finally {
    $listener.Stop()
}
