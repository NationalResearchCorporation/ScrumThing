# mergeVersions - find assemblyInfo files with merge conflicts around version and resolve them
#
# Alex Gallichotte - 2015/03/11

param()

Set-StrictMode -Version 2

# load versionLibrary.psm1 in the same directory as our script
Import-Module -Name (Join-Path (Split-Path (Get-Variable MyInvocation).Value.MyCommand.Path) 'versionLibrary.psm1') -DisableNameChecking

function main {
    $gitRoot = Get-GitRoot

    $projectConfig = Get-ProjectConfig $gitRoot

    $unmergedAssemblyInfos = Get-UnmergedAssemblyInfos $gitRoot $projectConfig

    Merge-AssemblyInfos $gitRoot $unmergedAssemblyInfos
}

function Get-UnmergedAssemblyInfos {
    param([string]$gitRoot, [PSCustomObject]$projectConfig)

    $unmergedFiles = Get-UnmergedFiles
    $projects = $projectConfig | Get-Member -MemberType NoteProperty | Select-Object -ExpandProperty Name

    $unmergedAssemblyInfos = @()
    ForEach ($project in $projects) {
        $assemblyInfo = $projectConfig.$project.AssemblyInfo
        if ($unmergedFiles.Contains($assemblyInfo)) {
            $unmergedAssemblyInfos = $unmergedAssemblyInfos + $assemblyInfo
        }
    }

    return ,$unmergedAssemblyInfos
}

function Merge-AssemblyInfos {
    param([string]$gitRoot, [string[]]$assemblyInfos)

    ForEach ($assemblyInfo in $assemblyInfos) {
        Write-Host ('Attempting merge: ' + $assemblyInfo)
        $path = Join-Path $gitRoot -ChildPath $assemblyInfo

        $lines = Get-Content $path
        $outputLines = @()

        $merged = $false

        for ($i = 0; $i -lt $lines.Count; $i++) {
            if ($lines[$i].StartsWith("<<<<<<<")) {
                $j = $i
                $j++

                $beforeLines = @()
                while (! $lines[$j].StartsWith("=======")) {
                    $beforeLines = $beforeLines + $lines[$j]
                    $j++
                }
                $j++

                $afterLines = @()
                while (! $lines[$j].StartsWith(">>>>>>>")) {
                    $afterLines = $afterLines + $lines[$j]
                    $j++
                }
                $j++

                $versionOne = Get-CurrentVersion $beforeLines               
                $versionTwo = Get-CurrentVersion $afterLines               

                if ($beforeLines.Length -eq 1 -and $afterLines.Length -eq 1 -and $versionOne -ne $null -and $versionTwo -ne $null) {
                    $higherVersion = Get-HigherVersion $versionOne $versionTwo
                    $lowerVersion = Get-LowerVersion $versionOne $versionTwo
                    $lastUpdatedVersionComponent = Get-LastUpdatedVersionComponent $lowerVersion
                    $mergedVersion = Increment-Version $higherVersion $lastUpdatedVersionComponent

                    $escapedBeforeVersion = [regex]::Escape($versionOne)
                    $outputLines += ($beforeLines -replace $versionOne, $mergedVersion)

                    Write-Host ('HEAD version:   ' + $versionOne)
                    Write-Host ('branch version: ' + $versionTwo)
                    Write-Host ('merged version:    ' + $mergedVersion)

                    $merged = $true
                    $i = $j
                }
            } else {
                $outputLines += $lines[$i]
            }
        }

        if ($merged) {
            $outputLines | Out-File -filepath $path
            Write-Host 'Wrote to file'

            $addCommand = Get-AddCommand $assemblyInfo $gitRoot $true
            Invoke-Expression $addCommand
            Write-Host 'Merge resolved and staged'
        } else {
            Write-Host 'Could not find versions to merge'
        }
    }
}

main