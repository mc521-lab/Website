Remove-Item -Path mc521-nextjs-web.tar -Force

docker build -t mc521-nextjs-web .
docker save mc521-nextjs-web > mc521-nextjs-web.tar

[System.Media.SystemSounds]::Beep.Play()
Start-Sleep -Milliseconds 850
[System.Media.SystemSounds]::Beep.Play()
Start-Sleep -Milliseconds 850
[System.Media.SystemSounds]::Beep.Play()

scp .\mc521-nextjs-web.tar root@47.96.249.83:~/website