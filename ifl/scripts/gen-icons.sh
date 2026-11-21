#!/usr/bin/env bash
# IFL: every desktop icon from the master icon and the tray glyph (IFL.md).
# Needs ImageMagick 7 (magick), librsvg (rsvg-convert) and Python 3.
# The outputs are committed, so builds never run this.
set -euo pipefail
cd "$(dirname "$0")/../.."
MASTER=ifl/assets/ifl-chat-icon-1024.png
GLYPH=ifl/assets/tray.svg
A=src/assets
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

square() { magick "$MASTER" -resize "$1x$1" "$2"; }
# macOS draws app icons as they are: round the corners (~22%) ourselves.
rounded() {
  local s=$1 r=$(( $1 * 22 / 100 ))
  magick "$MASTER" -resize "${s}x${s}" \( -size "${s}x${s}" xc:none -fill white \
    -draw "roundrectangle 0,0,$((s - 1)),$((s - 1)),$r,$r" \) -alpha set -compose DstIn -composite "$2"
}
glyph() { # fill dot size out
  local ring='#000'
  [ "$2" = none ] && ring='#fff'
  sed -e "s/\"FILL\"/\"$1\"/" -e "s/\"DOT\"/\"$2\"/" -e "s/\"RING\"/\"$ring\"/" "$GLYPH" > "$TMP/glyph.svg"
  rsvg-convert -w "$3" -h "$3" "$TMP/glyph.svg" -o "$4"
}

for s in 32 64 128 256 512 1024; do rounded "$s" "$TMP/mac_$s.png"; done
# Pure-Python ICNS writer: PNG entries only, no TOC (electron-builder's
# app-builder reads icon.icns for the Linux icons and rejects a TOC entry).
python3 - "$A/icon.icns" "$TMP" <<'PY'
import struct, sys
out, tmp = sys.argv[1], sys.argv[2]
types = [('ic11', 32), ('ic12', 64), ('ic07', 128), ('ic13', 256), ('ic08', 256),
         ('ic14', 512), ('ic09', 512), ('ic10', 1024)]
body = b''
for kind, size in types:
    data = open(f'{tmp}/mac_{size}.png', 'rb').read()
    body += kind.encode() + struct.pack('>I', len(data) + 8) + data
open(out, 'wb').write(b'icns' + struct.pack('>I', len(body) + 8) + body)
PY
for s in 16 24 32 48 64 128 256; do square "$s" "$TMP/win_$s.png"; done
magick "$TMP"/win_{16,24,32,48,64,128,256}.png "$A/icon.ico"
square 48 "$A/appicon_48.png"
magick "$MASTER" -resize 24x24 -background none -gravity center -extent 32x32 "$A/appicon_with_spacing_32.png"
square 512 "$A/linux/app_icon.png"
magick -size 542x353 xc:'#34465F' "$A/osx/DMG_BG.png"

for theme in dark light; do
  if [ "$theme" = dark ]; then fill='#FFFFFF'; else fill='#000000'; fi
  for kind in "" _unread _mention; do
    case "$kind" in _unread) dot=$fill ;; _mention) dot='#D24B4E' ;; *) dot=none ;; esac
    glyph "$fill" "$dot" 16 "$A/linux/top_bar_${theme}${kind}_16.png"
    glyph "$fill" "$dot" 32 "$A/linux/top_bar_${theme}${kind}_16@2x.png"
    for s in 16 32 48; do glyph "$fill" "$dot" "$s" "$TMP/t$s.png"; done
    magick "$TMP/t16.png" "$TMP/t32.png" "$TMP/t48.png" "$A/windows/tray_${theme}${kind}.ico"
  done
done
for s in 16 20 24 32; do
  glyph '#000000' none "$s" "$A/osx/menuIcons/MenuIcon${s}Template.png"
  glyph '#000000' none $((s * 2)) "$A/osx/menuIcons/MenuIcon${s}Template@2x.png"
  glyph '#000000' '#000000' "$s" "$A/osx/menuIcons/MenuIconUnread${s}Template.png"
  glyph '#000000' '#000000' $((s * 2)) "$A/osx/menuIcons/MenuIconUnread${s}Template@2x.png"
done
echo "icons written under $A"
