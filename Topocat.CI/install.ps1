echo "Copying CI configs..."
New-Item -ItemType File -Path ./../Topocat.Frontend/src/environments/environment.ts -Force
Copy-Item ./environment.ts ./../Topocat.Frontend/src/environments/environment.ts -Force
Copy-Item ./karma.conf.js ./../Topocat.Frontend/karma.conf.js -Force