"use client";

import Link from "next/link";
import { startTransition, useEffect, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { ClinicalSignalGraphic } from "../components/SignalGraphics";
import { answerOptions, gadQuestions, gadQuestionsEn, k10Options, k10Questions, k10QuestionsEn, questions, questionsEn } from "../lib/questionnaires";
import { loadQuestionnaireDraft, saveQuestionnaireDraft } from "../lib/questionnaireDraft";
import { useLanguage } from "../lib/language";

const copy = {
  English: {
    eyebrow: "01 / CLINICAL CHECK-IN",
    titleLine1: "Three short,",
    titleLine2: "validated questionnaires.",
    intro: "PHQ-9, GAD-7, and K10 are the same validated questionnaires healthcare professionals already use. Answer honestly - there are no right answers, only a clearer picture.",
    clinical: "Clinical check-in",
    back: "Back to check-in",
    doneCta: "Done - back to check-in",
    next: "Next test",
  },
  اردو: {
    eyebrow: "01 / طبی جائزہ",
    titleLine1: "تین مختصر،",
    titleLine2: "مستند سوالنامے۔",
    intro: "PHQ-9، GAD-7، اور K10 وہی مستند سوالنامے ہیں جو ماہرین صحت پہلے سے استعمال کرتے ہیں۔ ایمانداری سے جواب دیں - کوئی صحیح یا غلط جواب نہیں، صرف ایک واضح تصویر ہے۔",
    clinical: "طبی جائزہ",
    back: "چیک ان پر واپس",
    doneCta: "مکمل - چیک ان پر واپس جائیں",
    next: "اگلا ٹیسٹ",
  },
};

export default function QuestionnaireClient() {
  const [language, setLanguage] = useLanguage();
  const isUrdu = language === "اردو";
  const text = copy[language];
  const languageKey = language as keyof typeof questions;

  const [answers, setAnswers] = useState(Array(questionsEn.length).fill(-1));
  const [gadAnswers, setGadAnswers] = useState(Array(gadQuestionsEn.length).fill(-1));
  const [k10Answers, setK10Answers] = useState(Array(k10QuestionsEn.length).fill(-1));
  const [activeScale, setActiveScale] = useState<"phq9" | "gad7" | "k10">("phq9");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const draft = loadQuestionnaireDraft({
      answers: Array(questionsEn.length).fill(-1),
      gadAnswers: Array(gadQuestionsEn.length).fill(-1),
      k10Answers: Array(k10QuestionsEn.length).fill(-1),
    });
    startTransition(() => {
      setAnswers(draft.answers);
      setGadAnswers(draft.gadAnswers);
      setK10Answers(draft.k10Answers);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    saveQuestionnaireDraft({ answers, gadAnswers, k10Answers });
  }, [answers, gadAnswers, k10Answers, loaded]);

  const activeQuestions = activeScale === "phq9" ? questions[languageKey] : activeScale === "gad7" ? gadQuestions[languageKey] : k10Questions[languageKey];
  const activeAnswers = activeScale === "phq9" ? answers : activeScale === "gad7" ? gadAnswers : k10Answers;
  const activeOptions = activeScale === "k10" ? k10Options[languageKey] : answerOptions[languageKey];
  const completedScales = [
    answers.every((answer) => answer > -1),
    gadAnswers.every((answer) => answer > -1),
    k10Answers.every((answer) => answer > -1),
  ].filter(Boolean).length;

  function updateActiveAnswer(questionIndex: number, optionIndex: number) {
    if (activeScale === "phq9") setAnswers(answers.map((answer, answerIndex) => answerIndex === questionIndex ? optionIndex : answer));
    if (activeScale === "gad7") setGadAnswers(gadAnswers.map((answer, answerIndex) => answerIndex === questionIndex ? optionIndex : answer));
    if (activeScale === "k10") setK10Answers(k10Answers.map((answer, answerIndex) => answerIndex === questionIndex ? optionIndex : answer));
  }

  function goToNextScale() {
    if (activeScale === "phq9") setActiveScale("gad7");
    else if (activeScale === "gad7") setActiveScale("k10");
  }

  return (
    <>
    <main className="resource-page" dir={isUrdu ? "rtl" : "ltr"}>
      <SiteHeader language={language} onToggleLanguage={() => setLanguage(isUrdu ? "English" : "اردو")} backHref="/" backLabel={text.back} />
      <section className="resource-hero">
        <p className="eyebrow">{text.eyebrow}</p>
        <h1>{text.titleLine1}<br /><em>{text.titleLine2}</em></h1>
        <p>{text.intro}</p>
      </section>
      <article className="signal-card phq-card">
        <ClinicalSignalGraphic />
        <div className="card-heading">
          <div>
            <p className="card-kicker">SIGNAL 01 · {completedScales} / 3 COMPLETE</p>
            <h2>{text.clinical}</h2>
          </div>
          <span className="progress-label">{activeAnswers.filter((answer) => answer > -1).length} / {activeQuestions.length}</span>
        </div>
        <div className="scale-tabs" role="group" aria-label={text.clinical}>
          <button type="button" className={activeScale === "phq9" ? "active" : ""} aria-pressed={activeScale === "phq9"} onClick={() => setActiveScale("phq9")}>PHQ-9</button>
          <button type="button" className={activeScale === "gad7" ? "active" : ""} aria-pressed={activeScale === "gad7"} onClick={() => setActiveScale("gad7")}>GAD-7</button>
          <button type="button" className={activeScale === "k10" ? "active" : ""} aria-pressed={activeScale === "k10"} onClick={() => setActiveScale("k10")}>K10</button>
        </div>
        <div className="question-progress"><span style={{ width: `${(activeAnswers.filter((answer) => answer > -1).length / activeQuestions.length) * 100}%` }} /></div>
        <div className="question-list">
          {activeQuestions.map((questionText, questionIndex) => (
            <div className="question-block" key={`${activeScale}-${questionIndex}`}>
              <p className="question-number">{activeScale.toUpperCase()} · {questionIndex + 1} / {activeQuestions.length}</p>
              <h3 id={`${activeScale}-q${questionIndex}`}>{questionText}</h3>
              <div className="answer-list" role="group" aria-labelledby={`${activeScale}-q${questionIndex}`}>
                {activeOptions.map((option, optionIndex) => (
                  <button key={option} type="button" className={activeAnswers[questionIndex] === optionIndex ? "selected" : ""} aria-pressed={activeAnswers[questionIndex] === optionIndex} onClick={() => updateActiveAnswer(questionIndex, optionIndex)}>
                    <span className="radio" />{option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        {activeScale !== "k10" && (
          <div className="question-actions">
            <button className="next-button" onClick={goToNextScale}>{text.next}<span>→</span></button>
          </div>
        )}
      </article>
      <div className="technique-actions">
        <Link className="result-primary" href="/">{text.doneCta} <span>→</span></Link>
      </div>
    </main>
    <SiteFooter language={language} />
    </>
  );
}
