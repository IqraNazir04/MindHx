import { crisisCopy, emergencyNumbers, mentalHealthHelplines, type CrisisLanguage } from "../lib/crisisCopy";
import { StepIcon, type StepIconKey } from "./StepIcons";

// One icon per "Right now" step, in the fixed order crisisCopy.steps is
// always written in (call for immediate danger, reach out to a helpline or
// trusted person, remove access to means, follow up with a professional).
const STEP_ICONS: StepIconKey[] = ["headsetCoach", "twoPeople", "shield", "stethoscope"];

// The crisis/emergency steps + notice + find-help content - shared by the
// standalone /emergency page and the banner embedded at the top of
// /results when a completed check-in itself triggers the crisis signal.
// Deliberately excludes the eyebrow/title/lede heading: each caller renders
// its own, at the heading level appropriate for that page (an h1 on the
// standalone page; an h2 when embedded above the rest of /results, which
// already has its own h1).
export default function CrisisBanner({ language }: { language: CrisisLanguage }) {
  const text = crisisCopy[language];
  return (
    <>
      {/* Numbers first: the one thing someone in danger needs within reach. */}
      <section className="emergency-numbers" aria-label={text.callNow}>
        <p className="card-kicker">{text.callNow}</p>
        <div className="emergency-number-list">
          {emergencyNumbers.map((entry) => (
            <a key={entry.number} className="emergency-number" href={`tel:${entry.number}`}>
              <strong dir="ltr">{entry.number}</strong>
              <span>{language === "ur" ? entry.ur : entry.en}</span>
            </a>
          ))}
        </div>
      </section>
      <section className="emergency-numbers" aria-label={text.helplinesTitle}>
        <p className="card-kicker">{text.helplinesTitle}</p>
        <div className="emergency-number-list">
          {mentalHealthHelplines.map((entry) => (
            <a key={entry.tel} className="emergency-number" href={`tel:${entry.tel}`}>
              <strong dir="ltr">{entry.number}</strong>
              <span>{language === "ur" ? entry.ur : entry.en}</span>
            </a>
          ))}
        </div>
        <p className="emergency-helplines-note">{text.helplinesNote}</p>
      </section>
      <section className="emergency-steps">
        <p className="card-kicker">{text.stepsTitle}</p>
        <ol>{text.steps.map((step, index) => <li key={step}><StepIcon icon={STEP_ICONS[index] ?? "shield"} /><span>{step}</span></li>)}</ol>
      </section>
      <div className="crisis-card emergency-notice"><StepIcon icon="gauge" /><span>{text.notDiagnosis}</span></div>
      <section className="therapist-contact">
        <div>
          <p className="card-kicker">{text.findHelp}</p>
          <p>{text.findHelpBody}</p>
        </div>
        <div className="resource-note">
          <b>{text.readyTitle}</b>
          <p>{text.readyBody}</p>
        </div>
      </section>
    </>
  );
}
