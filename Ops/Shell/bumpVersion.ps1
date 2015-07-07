# bumpVersion - Increments a version component of a projects AssemblyInfo.cs file
#
# Eric Barsalou - 2015/04/10

param([string]$component, [string]$project)

Set-StrictMode -Version 2

# load versionLibrary.psm1 in the same directory as our script
Import-Module -Name (Join-Path (Split-Path (Get-Variable MyInvocation).Value.MyCommand.Path) 'versionLibrary.psm1') -DisableNameChecking

function main {
    $gitRoot = Get-GitRoot
    $projectConfig = Get-ProjectConfig $gitRoot
    Check-Parameters $component $project $projectConfig

    $updateCommand = Get-UpdateCommand $projectConfig.$project.AssemblyInfo $gitRoot $project $component $FALSE
    Invoke-Expression $updateCommand
}

function Print-Usage {
    Write-Host @"
bumpVersion.ps1 - Conveniently increments a component of a project's AssemblyInfo.cs

Usage: bumpVersion.ps1 <major|minor|update|revision> <project>
"@
}

function Check-Parameters {
    param([string]$component, [string]$project, [PSCustomObject]$projectConfig)

    if ([string]::IsNullOrWhitespace($component) -or [string]::IsNullOrWhitespace($project)) {
        Print-Usage
        Exit
    }

    $error = $null;

    if ($component -ne 'major' -and $component -ne 'minor' -and $component -ne 'update' -and $component -ne 'revision') {
        $error = 'Component must be "major", "minor", "update" or "revision"'
    }

    if ($projectConfig.PSObject.Properties.Match($project).Count -eq 0) {
        $error = 'Unknown project: ' + $project
    }

    if ($error -ne $null) {
        Write-Host ('Error: ' + $error)
        Print-Usage
        Exit
    }
}

main
