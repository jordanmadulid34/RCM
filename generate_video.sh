#!/bin/bash
set -e

# Create a high quality 1080p MP4 video looping through real Rotary photos
# using gentle panning/zooming (Ken Burns effect) and crossfades

IMG_DIR="public/assets/images"
OUT_FILE="public/videos/news-banner.mp4"

ffmpeg -y \
  -loop 1 -t 4 -i "$IMG_DIR/rotary_peace.jpg" \
  -loop 1 -t 4 -i "$IMG_DIR/rotary_connect.jpg" \
  -loop 1 -t 4 -i "$IMG_DIR/rotary_empower.jpg" \
  -loop 1 -t 4 -i "$IMG_DIR/brotherhood_agreement.jpg" \
  -loop 1 -t 4 -i "$IMG_DIR/rotary_savelives.jpg" \
  -loop 1 -t 4 -i "$IMG_DIR/rotary_transform.jpg" \
  -filter_complex "
    [0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='min(zoom+0.0015,1.15)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=100:s=1920x1080,setpts=PTS-STARTPTS[v0];
    [1:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='min(zoom+0.0015,1.15)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=100:s=1920x1080,setpts=PTS-STARTPTS[v1];
    [2:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='min(zoom+0.0015,1.15)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=100:s=1920x1080,setpts=PTS-STARTPTS[v2];
    [3:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='min(zoom+0.0015,1.15)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=100:s=1920x1080,setpts=PTS-STARTPTS[v3];
    [4:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='min(zoom+0.0015,1.15)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=100:s=1920x1080,setpts=PTS-STARTPTS[v4];
    [5:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='min(zoom+0.0015,1.15)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=100:s=1920x1080,setpts=PTS-STARTPTS[v5];
    [v0][v1]glitch=0:0[v01];
    [v0][v1]xfade=transition=fade:duration=1:offset=3[xf1];
    [xf1][v2]xfade=transition=fade:duration=1:offset=6[xf2];
    [xf2][v3]xfade=transition=fade:duration=1:offset=9[xf3];
    [xf3][v4]xfade=transition=fade:duration=1:offset=12[xf4];
    [xf4][v5]xfade=transition=fade:duration=1:offset=15[outv]
  " \
  -map "[outv]" \
  -c:v libx264 -preset fast -pix_fmt yuv420p -r 25 \
  "$OUT_FILE"

cp "$OUT_FILE" "dist/videos/news-banner.mp4"
echo "Successfully generated $OUT_FILE"
