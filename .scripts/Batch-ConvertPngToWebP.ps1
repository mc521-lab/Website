param(
    [Parameter(Mandatory=$true)]
    [string]$Path
)

# 检查路径是否存在
if (-Not (Test-Path $Path)) {
    Write-Host "路径不存在: $Path"
    exit 1
}

# 获取所有 png 文件，递归子目录
$pngFiles = Get-ChildItem -Path $Path -Filter *.png -File -Recurse

$total = $pngFiles.Count
if ($total -eq 0) {
    Write-Host "未找到 PNG 文件。"
    exit 0
}

$count = 0
foreach ($file in $pngFiles) {
    $count++
    $webpPath = [System.IO.Path]::ChangeExtension($file.FullName, ".webp")
    
    Write-Host "[$count/$total] 转换: $($file.FullName) -> $($webpPath)"
    
    # ffmpeg 转换
    ffmpeg -y -i $file.FullName $webpPath | Out-Null
}

Write-Host "转换完成，共 $total 个文件。"
