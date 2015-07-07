param()

Set-StrictMode -Version 2

# load versionLibrary.psm1 in the same directory as our script
Import-Module -Name (Join-Path (Split-Path (Get-Variable MyInvocation).Value.MyCommand.Path) 'versionLibrary.psm1') -DisableNameChecking -Force

function main {
    $versionOne = '0.0.0.0'
    $versionTwo = '0.0.1.5'

    $higherVersion = Get-HigherVersion $versionOne $versionTwo
    Write-Host "Higher version - $higherVersion"

    $lowerVersion = Get-LowerVersion $versionOne $versionTwo
    Write-Host "Lower-version - $lowerVersion"

    $lastUpdatedVersionComponent = Get-LastUpdatedVersionComponent $lowerVersion
    Write-Host "Last updated component of lower version - $lastUpdatedVersionComponent"

    $newVersion = Increment-Version $higherVersion $lastUpdatedVersionComponent
    Write-Host "Merged Version - $newVersion"
}

main