#!/bin/sh
set -e

WORKING_DIR=$(pwd)
THIS_PATH=$(readlink -f "$0")
cd "$(dirname "$THIS_PATH")"
FULL_PATH=$(pwd)
cd "$WORKING_DIR"

# IFL: IFL Chat's desktop entry
cat <<EOS > com.iflgm.chat.desktop.desktop
[Desktop Entry]
Name=IFL Chat
Comment=League chat for the International Fantasy League
Exec="${FULL_PATH}/ifl-chat" %U
Terminal=false
Type=Application
MimeType=x-scheme-handler/iflchat
Icon="${FULL_PATH}/app_icon.png"
Categories=Network;InstantMessaging;
StartupWMClass=com.iflgm.chat.desktop
EOS

chmod +x com.iflgm.chat.desktop.desktop
