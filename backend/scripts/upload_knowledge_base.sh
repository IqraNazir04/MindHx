#!/usr/bin/env bash
# Uploads backend/knowledge_base/*.md to the admin reference-document store on
# a running MindHx instance (local or live). Run this yourself with your own
# admin credentials - the password is only read into this shell, never saved
# or sent anywhere but the site's own /admin/login endpoint.
#
# Usage:
#   ./backend/scripts/upload_knowledge_base.sh                # targets https://mindhx.com/api
#   BASE_URL=http://127.0.0.1:8000 ./backend/scripts/upload_knowledge_base.sh
#
# BASE_URL is the API's address. On the deployed site the API is served under
# /api (next.config.ts proxies it); https://mindhx.com/admin/login is the web
# page, not the endpoint.
#
# The live site must already be running a backend build that knows the new
# intents (safety, stress, meditation, grief, pain, conditions) - i.e. this
# commit must be deployed first, or uploads for those intents will be
# rejected with "intent must be one of [...]".

set -euo pipefail

BASE_URL="${BASE_URL:-https://mindhx.com/api}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KB_DIR="$SCRIPT_DIR/../knowledge_base"

read -r -p "Admin email: " ADMIN_EMAIL
read -r -s -p "Admin password: " ADMIN_PASSWORD
echo

echo "Logging in to $BASE_URL ..."
# Built via python3's json.dumps, not bash string interpolation - a password
# containing a '"', '\', '$', or backtick would otherwise corrupt the JSON
# body (or get partially shell-expanded) before it ever reaches curl.
LOGIN_PAYLOAD="$(ADMIN_EMAIL="$ADMIN_EMAIL" ADMIN_PASSWORD="$ADMIN_PASSWORD" python3 -c '
import json, os
print(json.dumps({"email": os.environ["ADMIN_EMAIL"], "password": os.environ["ADMIN_PASSWORD"]}))
')"
LOGIN_RESPONSE="$(curl -sS -X POST "$BASE_URL/admin/login" \
  -H "Content-Type: application/json" \
  -d "$LOGIN_PAYLOAD")"
unset ADMIN_PASSWORD LOGIN_PAYLOAD

TOKEN="$(printf '%s' "$LOGIN_RESPONSE" | python3 -c 'import json,sys; print(json.load(sys.stdin)["access_token"])' 2>/dev/null || true)"
if [ -z "$TOKEN" ]; then
  echo "Login failed: $LOGIN_RESPONSE"
  exit 1
fi
echo "Logged in."

# Uploading never retires the previous version of a document - each run would
# otherwise just pile another copy of the same title on top of the last,
# leaving stale (possibly pre-fix) chunks active and retrievable alongside
# the fresh ones. Before each upload, delete any existing document with the
# exact same title so a re-run truly replaces it instead of accumulating.
retire_existing() {
  local title="$1"
  local existing
  existing="$(curl -sS "$BASE_URL/admin/documents" -H "Authorization: Bearer $TOKEN")"
  local ids
  ids="$(printf '%s' "$existing" | TITLE="$title" python3 -c '
import json, os, sys
title = os.environ["TITLE"]
docs = json.load(sys.stdin)
for doc in docs:
    if doc.get("title") == title:
        print(doc["id"])
')"
  if [ -n "$ids" ]; then
    while IFS= read -r doc_id; do
      [ -z "$doc_id" ] && continue
      echo "  Retiring previous version ($doc_id) ..."
      curl -sS -o /dev/null -X DELETE "$BASE_URL/admin/documents/$doc_id" -H "Authorization: Bearer $TOKEN"
    done <<< "$ids"
  fi
}

upload() {
  local filename="$1" title="$2" intent="$3" source_name="$4"
  echo "Uploading $filename (intent=$intent) ..."
  retire_existing "$title"
  local http_code
  http_code="$(curl -sS -o /tmp/mindhx_upload_resp.json -w '%{http_code}' -X POST "$BASE_URL/admin/documents" \
    -H "Authorization: Bearer $TOKEN" \
    -F "title=$title" \
    -F "intent=$intent" \
    -F "source_name=$source_name" \
    -F "file=@$KB_DIR/$filename;type=text/markdown")"
  if [ "$http_code" != "201" ]; then
    echo "  FAILED ($http_code): $(cat /tmp/mindhx_upload_resp.json)"
    rm -f /tmp/mindhx_upload_resp.json
    exit 1
  fi
  echo "  OK"
  rm -f /tmp/mindhx_upload_resp.json
}

upload "00_safety_crisis_protocol.md" "Safety and Crisis Protocol" "safety" \
  "WHO mhGAP Intervention Guide; Stanley-Brown Safety Planning Intervention; TherapyRoute Pakistan helplines; PSCA Helpline-15"
upload "01_stress.md" "Stress and Burnout" "stress" \
  "WHO Stress fact sheet; WHO Doing What Matters in Times of Stress; ICD-11 Burn-out; McEwen 1998"
upload "02_meditation_mindfulness.md" "Meditation, Mindfulness and Relaxation Techniques" "meditation" \
  "Kabat-Zinn MBSR; Goyal et al. JAMA Internal Medicine 2014; NICE NG222; Balban et al. Cell Reports Medicine 2023"
upload "03_grief_bereavement.md" "Grief and Bereavement" "grief" \
  "Stroebe & Schut Dual Process Model; ICD-11/DSM-5-TR Prolonged Grief Disorder; Shear et al. JAMA 2005"
upload "04_pain_mind_body.md" "Pain and the Mind-Body Connection" "pain" \
  "NICE NG193; Melzack & Wall Gate Control Theory; Vlaeyen & Linton Fear-Avoidance Model; Moseley & Butler Explain Pain"
upload "05_mental_health_conditions.md" "Common Mental Health Conditions and Screening" "conditions" \
  "ICD-11; DSM-5-TR; NICE NG222/CG113/NG116; PHQ-9/GAD-7 validation studies"
upload "06_therapies_treatment.md" "Evidence-Based Therapies and Treatment Options" "therapy" \
  "NICE guidelines; Linehan DBT; Hayes et al. ACT; WHO mhGAP; Shapiro EMDR"
upload "07_motivational_messages.md" "Supportive and Motivational Messages" "general" \
  "Adapted from motivational-interviewing principles (Miller & Rollnick)"

echo "All 8 knowledge-base documents uploaded to $BASE_URL."
