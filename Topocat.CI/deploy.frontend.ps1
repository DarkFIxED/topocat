Param (
	[Parameter(Mandatory=$True)]
	$RemoteHost,
	[Parameter(Mandatory=$True)]
	$Site,
	[Parameter(Mandatory=$True)]
	$UserName,
	[Parameter(Mandatory=$True)]
	$Password
)

$outputArchive = "deploy-package.zip"
$initialLocation = Get-Location;
$frontendFolder = "./../Topocat.Frontend"
$buildFolder = "dist/topocat"

Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope CurrentUser -Force

cd ./../Topocat.Frontend
ng build --prod
Set-Location $initialLocation

Copy-Item -Path "./web.config" -Destination "$($frontendFolder)/$($buildFolder)"
rm "./$($outputArchive)" -ea ig

Add-Type -assembly "system.io.compression.filesystem"
[io.compression.zipfile]::CreateFromDirectory("$($frontendFolder)/$($buildFolder)", "./$($outputArchive)")

Invoke-Expression "& MSDeploy.exe -source:package=$outputArchive -dest:contentPath=`"$Site`",computerName=`"$RemoteHost/MSDeploy.axd`",username=`"$UserName`",password=`"$Password`",authtype=`"Basic`",includeAcls=`"False`" -verb:sync -disableLink:AppPoolExtension -disableLink:ContentExtension -disableLink:CertificateExtension -allowUntrusted"

