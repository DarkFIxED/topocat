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

cd ./../Topocat.Frontend
Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope CurrentUser -Force
ng build --prod
Copy-Item -Path "./../Topocat.CI/web.config" -Destination "./dist/topocat"
rm "./$($outputArchive)" -ea ig
Compress-Archive -Path "./dist/topocat/*.*" -DestinationPath "./$($outputArchive)"

Invoke-Expression "& MSDeploy.exe -source:package=$outputArchive -dest:auto,computerName=`"$RemoteHost/MSDeploy.axd?site=$Site`",username=`"$UserName`",password=`"$Password`",authtype=`"Basic`",includeAcls=`"False`" -verb:sync -disableLink:AppPoolExtension -disableLink:ContentExtension -disableLink:CertificateExtension -allowUntrusted"

Set-Location $initialLocation