# autoVersion - automatically increment version numbers in AssemblyInfo.cs files
# Alex Gallichotte - 2015/03/05

param([string]$component, [string]$file)

Set-StrictMode -Version 2

# load versionLibrary.psm1 in the same directory as our script
Import-Module -Name (Join-Path (Split-Path (Get-Variable MyInvocation).Value.MyCommand.Path) 'versionLibrary.psm1') -DisableNameChecking

function main {
    Check-Parameters $component $file

    $currentVersion = Get-CurrentVersion (Get-Content $file)
    Write-Host ('Current version: ' + $currentVersion)

    $newVersion = Increment-Version $currentVersion $component
    Write-Host ('New version ' + $newVersion)

    Update-File $currentVersion $newVersion $file
}

function Print-Usage {
    Write-Host @"
autoVersion.ps1 - automatically increment version numbers in AssemblyInfo.cs files
Four component version numbers have the following format:

    major.minor.update.revision (e.g. 1.3.2.6)

Usage: autoVersion.ps1 <version component> <assemblyinfo.cs file>

    <version component> - Either "major", "minor", "update", or "revision"
    <assemblyinfo.cs file> - Path to an AssemblyInfo.cs file
"@
}

function Check-Parameters {
    param([string]$component, [string]$file)

    $error = $null

    if ([string]::IsNullOrWhiteSpace($component) -or [string]::IsNullOrWhiteSpace($file)) {
        $error = 'You must specify both parameters'
    }
    elseif ($component -ne 'major' -and $component -ne 'minor' -and $component -ne 'update' -and $component -ne 'revision') {
        $error = '<component> must be one of `"major`", `"minor`", `"update`", or `"revision`"'
    }
    elseif (! (Test-Path $file)) {
        $error = 'Specified file is not a valid path'
    }

    if (! [string]::IsNullOrWhitespace($error)) {
        Write-Host ('Error: ' + $error)
        Print-Usage
        Exit
    }
}

function Update-File {
    param([string]$currentVersion, [string]$newVersion, [string]$file)

    $escapedCurrentVersion = [regex]::Escape($currentVersion)
    (Get-Content $file) -replace $escapedCurrentVersion, $newVersion | Out-File $file -Encoding 'UTF8'
}

main