; Registers SEN Launcher as a selectable default browser (http/https/html) so it appears in Windows "Default apps".
!macro customInstall
  WriteRegStr HKCU "Software\Classes\SENLauncher.URL" "" "SEN Launcher URL"
  WriteRegStr HKCU "Software\Classes\SENLauncher.URL" "URL Protocol" ""
  WriteRegStr HKCU "Software\Classes\SENLauncher.URL\shell\open\command" "" '"$INSTDIR\${APP_EXECUTABLE_FILENAME}" "%1"'
  WriteRegStr HKCU "Software\Classes\SENLauncher.HTML" "" "SEN Launcher HTML Document"
  WriteRegStr HKCU "Software\Classes\SENLauncher.HTML\shell\open\command" "" '"$INSTDIR\${APP_EXECUTABLE_FILENAME}" "%1"'
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\SENLauncher" "" "SEN Launcher"
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\SENLauncher\Capabilities" "ApplicationName" "SEN Launcher"
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\SENLauncher\Capabilities" "ApplicationDescription" "Launcher, browser, download manager and media player"
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\SENLauncher\Capabilities\URLAssociations" "http" "SENLauncher.URL"
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\SENLauncher\Capabilities\URLAssociations" "https" "SENLauncher.URL"
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\SENLauncher\Capabilities\FileAssociations" ".htm" "SENLauncher.HTML"
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\SENLauncher\Capabilities\FileAssociations" ".html" "SENLauncher.HTML"
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\SENLauncher\shell\open\command" "" '"$INSTDIR\${APP_EXECUTABLE_FILENAME}"'
  WriteRegStr HKCU "Software\RegisteredApplications" "SENLauncher" "Software\Clients\StartMenuInternet\SENLauncher\Capabilities"
!macroend
!macro customUnInstall
  DeleteRegKey HKCU "Software\Classes\SENLauncher.URL"
  DeleteRegKey HKCU "Software\Classes\SENLauncher.HTML"
  DeleteRegKey HKCU "Software\Clients\StartMenuInternet\SENLauncher"
  DeleteRegValue HKCU "Software\RegisteredApplications" "SENLauncher"
!macroend
