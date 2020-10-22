npm run test --silent > windows.actual.txt

Compare-Object -ReferenceObject (Get-Content .\windows.expected.txt) -DifferenceObject (Get-Content windows.actual.txt)

# Case needs to matter
# Last error code isn't working

if ($LASTEXITCODE) {
    Write-Output "Something broke in run-script-os for Windows"
    exit
}