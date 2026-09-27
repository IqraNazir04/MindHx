// Saves a completed check-in to the signed-in user's history: first its
// scores (POST /checkins), then the same PDF report the results page
// offers for download (PUT /checkins/{id}/report), so they can download it
// again from their dashboard - e.g. to show a doctor.
//
// Progress is remembered in sessionStorage per result, so reloading
// /results doesn't create a duplicate entry, and a retry after a failure
// only redoes the step that failed.

import type { Result } from "../components/CheckInResultsBody";
import { saveCheckIn, uploadCheckInReport } from "./auth";
import { resultsPdfBlob, type CheckInDetailForPdf, type PreparedFor } from "./resultsPdf";

const SAVED_KEY = "mindhx:last-result-saved";

type SaveProgress = { checkInId: string; reportSaved: boolean };

function readProgress(): SaveProgress | null {
  try {
    const raw = sessionStorage.getItem(SAVED_KEY);
    return raw ? JSON.parse(raw) as SaveProgress : null;
  } catch {
    return null;
  }
}

function writeProgress(progress: SaveProgress): void {
  try {
    sessionStorage.setItem(SAVED_KEY, JSON.stringify(progress));
  } catch {
    // Storage unavailable - worst case a reload saves the check-in again.
  }
}

// Called when a new result replaces the last one (see HomeClient), so the
// next /results visit saves it rather than treating it as already saved.
export function resetSaveProgress(): void {
  try {
    sessionStorage.removeItem(SAVED_KEY);
  } catch {
    // Nothing to reset.
  }
}

export function isSavedToHistory(): boolean {
  return Boolean(readProgress()?.reportSaved);
}

// One save at a time: React runs mount effects twice in development, and
// two overlapping calls would otherwise both see "nothing saved yet" and
// create two history entries for the same check-in.
let inFlight: Promise<void> | null = null;

export function saveResultToHistory(result: Result, preparedFor: PreparedFor, detail?: CheckInDetailForPdf): Promise<void> {
  if (!inFlight) {
    inFlight = runSave(result, preparedFor, detail).finally(() => {
      inFlight = null;
    });
  }
  return inFlight;
}

async function runSave(result: Result, preparedFor: PreparedFor, detail?: CheckInDetailForPdf): Promise<void> {
  let progress = readProgress();
  if (progress?.reportSaved) return;

  if (!progress) {
    // The scores and support plan the backend computed - the per-question
    // detail, transcript, and written text go only into the PDF below.
    const checkInId = await saveCheckIn({
      riskScore: result.risk_score,
      band: result.band,
      routingDecision: result.routing_decision,
      themes: result.themes ?? [],
      components: result.components,
      supportPlan: result.support_plan,
    });
    progress = { checkInId, reportSaved: false };
    writeProgress(progress);
  }

  await uploadCheckInReport(progress.checkInId, resultsPdfBlob(result, preparedFor, detail));
  writeProgress({ ...progress, reportSaved: true });
}
