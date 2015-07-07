# versionLibrary - a variety of shared methods for 
#
# Alex Gallichotte - 2015/03/11

Set-StrictMode -Version 2

function Get-ProjectConfig {
    param([string]$gitRoot)

    $configPath = ($gitRoot + '/ProjectConfig.json') -replace '/', '\'

    if (! (Test-Path $configPath)) {
        Write-Host -ForegroundColor Red 'ERROR: Must specify ProjectConfig.json at root of the repository'
    }

    return Get-Content -Raw -Path $configPath | ConvertFrom-Json
}

# version operations

$componentMap = @{
    'major' = 0;
    'minor' = 1;
    'update' = 2;
    'revision' = 3;
}

$reverseComponentMap = @{
    0 = 'major';
    1 = 'minor';
    2 = 'update';
    3 = 'revision';
}

function Get-CurrentVersion {
    param([string[]]$lines)

    $m = $lines | Select-String -pattern '^\[assembly: AssemblyVersion\("([^"]+)"\)\]'

    if ($m.Matches.Length -ne 1) {
        Write-Host ('Error: could not find AssemblyVersion attribute in file')
        Exit
    }

    return $m.Matches.Groups[1].Value
}

function Extract-VersionArray {
    param([string]$stringVersion)

    $versionComponents = $stringVersion.Split('.')

    # ensure four version components
    $newComponents = 4 - $versionComponents.Length;
    for ($i = 0; $i -lt $newComponents; $i++) {
        $versionComponents += 0;
    }

    # convert strings to ints (and any * to 0)
    $versionComponents = $versionComponents | ForEach { if ($_ -eq '*') { 0 } else { [int]$_ } }

    return $versionComponents
}

function Increment-Version {
    param([string]$currentVersion, [string]$component)

    $versionComponents = Extract-VersionArray $currentVersion

    $i = $componentMap[$component]
    $versionComponents[$i]++

    for ($i++; $i -lt 4; $i++) {
        $versionComponents[$i] = 0;
    }

    return [string]::Join('.', $versionComponents)
}

# takes two version strings and returns the higher of the two
function Get-HigherVersion {
    param([string]$versionOne, [string]$versionTwo)
    
    $versionOneComponents = Extract-VersionArray $versionOne
    $versionTwoComponents = Extract-VersionArray $versionTwo

    $higherVersion = $versionOne
    for ($i = 0; $i -lt 4; $i++) {
        if ($versionOneComponents[$i] -lt $versionTwoComponents[$i]) {
            $higherVersion = $versionTwo
            break
        }
        if ($versionOneComponents[$i] -gt $versionTwoComponents[$i]) {
            break
        }
    }
    return $higherVersion
}

# takes two version strings and returns the lower of the two
function Get-LowerVersion {
    param([string]$versionOne, [string]$versionTwo)
    
    $versionOneComponents = Extract-VersionArray $versionOne
    $versionTwoComponents = Extract-VersionArray $versionTwo

    $lowerVersion = $versionOne
    for ($i = 0; $i -lt 4; $i++) {
        if ($versionTwoComponents[$i] -lt $versionOneComponents[$i]) {
            $lowerVersion = $versionTwo
            break
        }
        if ($versionTwoComponents[$i] -gt $versionOneComponents[$i]) {
            break
        }
    }
    return $lowerVersion
}

# takes a version string and returns the name of the component that was last updated.
# this is done by assuming that the semver incrementation rules are being followed.
# when this is the case, we can assume that (from right to left) the first non-zero
# version component was the last updated (and was, therefor, the semantic intent of that version).
# if no components are zero, then the intent must have been to update the revision component.
function Get-LastUpdatedVersionComponent {
    param([string]$version)
    
    $lastUpdatedVersionComponent = $reverseComponentMap[3]
    $versionComponents = Extract-VersionArray $version
    for ($i = 3; $i -ge 0; $i--) {
        if ($versionComponents[$i] -gt 0) {
            $lastUpdatedVersionComponent = $reverseComponentMap[$i]
            break
        }
    }
    return $lastUpdatedVersionComponent
}

# git commands

function Get-StagedFiles {
    return ,((git diff --name-only --cached) | Out-String -Stream)
}

function Get-ModifiedFiles {
    return ,((git diff --name-only) | Out-String -Stream)
}

function Get-UnmergedFiles {
    return ,((git diff --name-only --diff-filter=U) | Out-String -Stream)
}

function Get-GitRoot {
    return (git rev-parse --show-toplevel) | Out-String -Stream
}

# generate commands

function Get-UpdateCommand {
    param([string]$assemblyInfo, [string]$gitRoot, [string]$project, [string]$component, [bool]$useWinPaths)

    $autoVersionPath = Get-RelativePath $gitRoot 'Ops\Shell\autoVersion.ps1'
    $assemblyConfigPath = Get-RelativePath $gitRoot $assemblyInfo

    if (! $useWinPaths) {
        $autoVersionPath = Get-BashPath $autoVersionPath
        $assemblyConfigPath = Get-BashPath $assemblyConfigPath
    }
    
    return ('powershell ' + $autoVersionPath + ' ' + $component + ' ' + $assemblyConfigPath)
}

function Get-AddCommand {
    param([string]$assemblyInfo, [string]$gitRoot, [bool]$useWinPaths)

    $assemblyConfigPath = Get-RelativePath $gitRoot $assemblyInfo

    if (! $useWinPaths) {
        $assemblyConfigPath = Get-BashPath $assemblyConfigPath
    }
    
    return ('git add ' + $assemblyConfigPath)
}

# path manipulation

function Get-RelativePath {
    param([string]$root, [string]$path)

    $absPath = Join-Path $root -ChildPath $path
    $relPath = Resolve-Path -Relative $absPath

    return $relPath -replace '^\.\\'
}

function Get-BashPath {
    param([string]$path)

    return $path -replace '\\', '/' -replace ':'
}