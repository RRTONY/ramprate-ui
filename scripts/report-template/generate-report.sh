#!/bin/bash
# Renders a RampRate-branded PDF report from report-template.html.
#
# Usage:
#   ./generate-report.sh "<title>" "<subtitle>" "<date>" <body-html-file> <output.pdf>
#
# <body-html-file> should contain one or more <section><h2>...</h2>...</section>
# blocks (see report-template.html's CSS for the .callout/table styles available).
#
# Requires Google Chrome installed locally. Always verify the output with
# `pdfinfo` (page size must read "A4") and by rendering at least one middle
# page with `pdftoppm` before treating a report as done - see the verification
# steps run when this template was built.

set -euo pipefail

if [ "$#" -ne 5 ]; then
  echo "Usage: $0 <title> <subtitle> <date> <body-html-file> <output.pdf>" >&2
  exit 1
fi

TITLE="$1"
SUBTITLE="$2"
DATE="$3"
BODY_FILE="$4"
OUTPUT_PDF="$5"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE="$SCRIPT_DIR/report-template.html"
TMP_HTML="$(mktemp -t ramprate-report-XXXXXX).html"

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
if [ ! -x "$CHROME" ]; then
  echo "Google Chrome not found at expected path: $CHROME" >&2
  exit 1
fi

python3 - "$TEMPLATE" "$BODY_FILE" "$TITLE" "$SUBTITLE" "$DATE" "$TMP_HTML" <<'PYEOF'
import sys
template_path, body_path, title, subtitle, date, out_path = sys.argv[1:7]
with open(template_path) as f:
    tpl = f.read()
with open(body_path) as f:
    body = f.read()
out = (tpl
       .replace("{{TITLE}}", title)
       .replace("{{SUBTITLE}}", subtitle)
       .replace("{{DATE}}", date)
       .replace("{{BODY}}", body))
with open(out_path, "w") as f:
    f.write(out)
PYEOF

"$CHROME" \
  --headless --disable-gpu --no-sandbox \
  --print-to-pdf="$OUTPUT_PDF" \
  --no-pdf-header-footer \
  "file://$TMP_HTML"

rm -f "$TMP_HTML"

echo "Wrote $OUTPUT_PDF"
pdfinfo "$OUTPUT_PDF" 2>/dev/null | grep -E "Pages|Page size" || true
