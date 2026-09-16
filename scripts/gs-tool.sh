#!/usr/bin/env bash
# Thin wrapper around clasp (Google's Apps Script CLI, run via npx so it's
# never added as a project dependency - see CLAUDE.md's "no new dependencies"
# rule) so supplier-intake-apps-script.gs can be pushed/deployed/watched from
# the terminal instead of copy-pasting into the Apps Script web editor by hand.
#
# ONE-TIME SETUP (must be done interactively by a human - clasp login opens a
# real browser OAuth flow that can't be scripted):
#   1. mkdir -p scripts/supplier-intake-gs-project
#   2. cd scripts/supplier-intake-gs-project
#   3. npx @google/clasp login
#   4. Open the Sheet -> Extensions -> Apps Script -> Project Settings (gear
#      icon) -> copy the "Script ID" shown there.
#   5. npx @google/clasp clone <SCRIPT_ID> --rootDir .
#      This downloads the LIVE .gs file(s) + appsscript.json into this
#      directory. Diff the downloaded file against
#      scripts/supplier-intake-apps-script.gs before changing anything -
#      they may have drifted (that reference copy has known gaps, see its
#      own placeholder comments on sanitizeName/jsonResponse/
#      preventFormulaInjection, and a sendStage2ReceiptEmail function this
#      session found missing entirely - confirm live status of all of these
#      before trusting either copy as canonical).
#   6. (Optional, needed for `logs`) In the Apps Script editor: Project
#      Settings -> "Change project" under Google Cloud Platform (GCP)
#      Project, switch off the default hidden project onto a real/standard
#      GCP project. clasp logs doesn't work against the default project.
#
# Everyday use, from scripts/supplier-intake-gs-project/ (after setup above):
#   ../gs-tool.sh push              upload local file changes, no new version
#   ../gs-tool.sh deploy "<note>"   push + update the LIVE deployment in place
#                                    (same /exec URL - asks which deployment
#                                    ID first time, then remembers it in
#                                    .clasp-deployment-id, gitignored)
#   ../gs-tool.sh logs              tail Cloud Logging in real time - watch
#                                    this, then flip a Sheet's Stage cell to
#                                    "Approved for Stage 2" in another tab to
#                                    see onStageEdit fire (or fail) live.

set -euo pipefail

if [ ! -f ".clasp.json" ]; then
  echo "No .clasp.json here. Run this from scripts/supplier-intake-gs-project/" >&2
  echo "after completing the one-time setup in this file's header comment." >&2
  exit 1
fi

CMD="${1:-}"
DEPLOYMENT_ID_FILE=".clasp-deployment-id"

case "$CMD" in
  push)
    npx @google/clasp push
    ;;
  deploy)
    NOTE="${2:-supplier-intake-apps-script update}"
    npx @google/clasp push
    if [ -f "$DEPLOYMENT_ID_FILE" ]; then
      DEPLOYMENT_ID=$(cat "$DEPLOYMENT_ID_FILE")
      echo "Updating existing deployment $DEPLOYMENT_ID (keeps the same /exec URL)..."
      npx @google/clasp deploy -i "$DEPLOYMENT_ID" -d "$NOTE"
    else
      echo "No saved deployment ID yet. Listing current deployments:"
      npx @google/clasp deployments
      echo
      echo "Copy the deployment ID whose URL matches the live GOOGLE_APPS_SCRIPT_URL" >&2
      echo "(the one that's NOT \"@HEAD\"), save it, then rerun:" >&2
      echo "  echo '<deployment-id>' > $DEPLOYMENT_ID_FILE" >&2
      echo "  ../gs-tool.sh deploy \"$NOTE\"" >&2
      exit 1
    fi
    ;;
  logs)
    npx @google/clasp logs --watch
    ;;
  *)
    echo "Usage: $0 {push|deploy \"<note>\"|logs}" >&2
    exit 1
    ;;
esac
