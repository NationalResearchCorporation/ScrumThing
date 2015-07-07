# checkVersions - looks at staged git changes and ensures the version number(s) have been updated accordingly
#
# Alex Gallichotte - 2015/03/06

param([string]$command)

Set-StrictMode -Version 2

# load versionLibrary.psm1 in the same directory as our script
Import-Module -Name (Join-Path (Split-Path (Get-Variable MyInvocation).Value.MyCommand.Path) 'versionLibrary.psm1') -DisableNameChecking

# TODO - we need a better check for version number updates than just "AssemblyInfo.cs is different"

function main {
    Check-Parameters $command

    $gitRoot = Get-GitRoot

    $projectConfig = Get-ProjectConfig $gitRoot

    do {
        $stagedFiles = Get-StagedFiles
        $unversionedProjects = Get-UnversionedProjects $stagedFiles $projectConfig
    } while (Check-UnstagedAssemblyInfoFiles $projectConfig $unversionedProjects)

    if ($unversionedProjects.Count -ne 0) {
        if ($command -eq 'check') {
            Check-Projects  $projectConfig $unversionedProjects $gitRoot
        }
        if ($command -eq 'fix') {
            Fix-Projects    $projectConfig $unversionedProjects $gitRoot
        }
        if ($command -eq 'prompt') {
            Prompt-Projects $projectConfig $unversionedProjects $gitRoot
        }
    }
}

function Print-Usage {
    Write-Host @"
checkVersions.ps1 - looks at staged git changes and ensures the version number(s) have been updated accordingly

In order to ensure continuous integration, we must ensure that every commit results in a version number being incremented.
For example, if you make a modification within $\Reveal\DataAccess, you should increment the corresponding version in the
file $\Reveal\DataAccess\DataAccess\Properties\AssemblyInfo.cs.

Usage: autoVersion.ps1 <check|fix|prompt>

    check -  ensure version numbers have been updated wherever necessary, and return an error if not
    fix -    ensure version numbers have been updated wherever necessary, and automatically increment the revision if not
    prompt - ensure version numbers have been updated wherever necessary, and prompt user to update if not
"@
}

function Check-Parameters {
    param([string]$command)

    if ([string]::IsNullOrWhitespace($command)) {
        Print-Usage
        Exit
    }

    $error = $null;

    if ($command -ne 'check' -and $command -ne 'fix' -and $command -ne 'prompt') {
        $error = 'Command must be either "check", "fix", or "prompt"'
    }

    if ($error -ne $null) {
        Write-Host ('Error: ' + $error)
        Print-Usage
        Exit
    }
}

function Get-UnversionedProjects {
    param([string[]]$stagedFiles, [PSCustomObject]$projectConfig)

    $unversionedProjects = @{}

    # extracting all keys for PSCustomObject is not obvious (i.e. $projects = $projectConfig.Keys)
    $projects = $projectConfig | Get-Member -MemberType NoteProperty | Select-Object -ExpandProperty Name

    ForEach ($file in $stagedFiles) {
        ForEach ($project in $projects) {
            ForEach ($dir in $projectConfig.$project.Directories) {

                if ($file.StartsWith($dir)) {
                    if (! $stagedFiles.Contains($projectConfig.$project.AssemblyInfo)) {
                        $unversionedProjects[$project] = $TRUE;
                    }
                }
            }
        }
    }

    return ,$unversionedProjects.Keys
}

function Check-UnstagedAssemblyInfoFiles {
    param([PSCustomObject]$projectConfig, [string[]]$unversionedProjects)
    
    $modifiedFiles = Get-ModifiedFiles
    $modifiedProjects = @()

    ForEach ($project in $unversionedProjects) {
        if ($modifiedFiles -ne $null -and $modifiedFiles.Contains($projectConfig.$project.AssemblyInfo)) {
            $modifiedProjects += $project
        }
    }

    $filesStaged = $false

    if ($modifiedProjects.Count -ne 0) {
        Write-Host 'Warning: version files have been modified but not staged - do you want to add them now?'

        ForEach ($project in $modifiedProjects) {
            $add = $null
            while ($add -eq $null) {
                Write-Host -ForegroundColor Yellow (' * ' + $project) -NoNewline
                $input = (Read-Host ' [Y]es / [n]o').ToLower()

                if ($input -eq 'y' -or $input -eq 'yes' -or $input -eq '') {
                    $add = $true
                }
                if ($input -eq 'no' -or $input -eq 'n') {
                    $add = $false
                }
            }

            if ($add) {
                $filesStaged = $true
                $addCommand = Get-AddCommand $projectConfig.$project.AssemblyInfo $gitRoot $TRUE
                Invoke-Expression $addCommand
            }
        }
        Write-Host
    }

    return $filesStaged
}

function Check-Projects {
    param([PSCustomObject]$projectConfig, [string[]]$unversionedProjects, [string]$gitRoot)

    $maxLength = ($unversionedProjects | Measure-Object -Property Length -Maximum).Maximum

    Write-Host -ForegroundColor Red 'ERROR: The following projects have changed without updating version numbers!!'
    Write-Host
    ForEach ($project in $unversionedProjects) {
        $updateCommand = Get-UpdateCommand $projectConfig.$project.AssemblyInfo $gitRoot $project 'revision' $FALSE

        $listItem = ' * ' + $project.PadRight($maxLength)

        Write-Host -ForegroundColor Yellow $listItem -NoNewline
        Write-Host (' (use "' + $updateCommand + '" to update)')
    }
    Exit 1
}

function Fix-Projects {
    param([PSCustomObject]$projectConfig, [string[]]$unversionedProjects, [string]$gitRoot)

    ForEach ($project in $unversionedProjects) {
        $updateCommand = Get-UpdateCommand $projectConfig.$project.AssemblyInfo $gitRoot $project 'revision' $FALSE
        $addCommand =    Get-AddCommand    $projectConfig.$project.AssemblyInfo $gitRoot $TRUE

        Write-Host "Incrementing revision number for " -NoNewline
        Write-Host -ForegroundColor Yellow $project

        Invoke-Expression $updateCommand
        Invoke-Expression $addCommand
    }
}

function Prompt-Projects {
    param([PSCustomObject]$projectConfig, [string[]]$unversionedProjects, [string]$gitRoot)

    Write-Host 'Updating version numbers (major.minor.update.revision)'

    ForEach ($project in $unversionedProjects) {
        $component = $null
        while ($component -eq $null) {
            $component = Read-Host ('Which component for ' + $project + '? [revision]')
            if ($component -eq '') {
                $component = 'revision'
            }
            if ($component -ne 'major' -and $component -ne 'minor' -and $component -ne 'update' -and $component -ne 'revision') {
                $component = $null
                Write-Host 'Component must be one of "major", "minor", "update", "revision"'
            }
            Write-Host
        }

        $updateCommand = Get-UpdateCommand $projectConfig.$project.AssemblyInfo $gitRoot $project $component $FALSE
        $addCommand =    Get-AddCommand    $projectConfig.$project.AssemblyInfo $gitRoot $TRUE

        Invoke-Expression $updateCommand
        Invoke-Expression $addCommand
    }
}

main