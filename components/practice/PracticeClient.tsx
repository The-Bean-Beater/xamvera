"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { apCourses, getCourseById } from "@/lib/data/courses";
import type { PracticeQuestion } from "@/lib/data/practice";
import { submitPracticeAttempt } from "@/lib/actions/practice";

function isActiveMcqPractice(courseId: string, mode: string) {
  return courseId === "ap-world-history-modern" && mode === "MCQ";
}

export function PracticeClient({
  initialCourseId,
  questions
}: {
  initialCourseId: string;
  questions: PracticeQuestion[];
}) {
  const router = useRouter();
  const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId);
  const [activeMode, setActiveMode] = useState("MCQ");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [saveMessage, setSaveMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const questionStartedAt = useRef(Date.now());
  const course = getCourseById(selectedCourseId);
  const question = questions[currentQuestionIndex];
  const canPractice = isActiveMcqPractice(selectedCourseId, activeMode) && Boolean(question);

  useEffect(() => {
    questionStartedAt.current = Date.now();
  }, [currentQuestionIndex]);

  const sourceRows = useMemo(
    () =>
      course.active
        ? [
            ["Public practice", "Original AP-style seed questions"],
            ["Source bank", "College Board and third-party materials kept private"],
            ["Persistence", "Attempts and mastery save to Supabase when signed in"]
          ]
        : [
            ["Course shell", "Navigation and layout placeholder ready"],
            ["Source bank", "No public questions connected yet"],
            ["Practice status", "Waiting for approved question database"]
          ],
    [course.active]
  );

  function selectAnswer(answerIndex: number) {
    if (!question || selectedAnswerIndex !== null) return;

    setSelectedAnswerIndex(answerIndex);
    const responseTime = Date.now() - questionStartedAt.current;

    startTransition(async () => {
      const result = await submitPracticeAttempt({
        questionId: question.id,
        selectedAnswerIndex: answerIndex,
        responseTime
      });

      if ("error" in result && result.error) {
        setSaveMessage(result.error);
      } else {
        setSaveMessage(`Progress saved. Mastery is now ${result.masteryScore}%.`);
        router.refresh();
      }
    });
  }

  function nextQuestion() {
    setSelectedAnswerIndex(null);
    setSaveMessage("");
    setCurrentQuestionIndex((index) => (index === questions.length - 1 ? 0 : index + 1));
  }

  function resetPractice() {
    setSelectedAnswerIndex(null);
    setSaveMessage("");
    setCurrentQuestionIndex(0);
  }

  return (
    <>
      <div className="page-heading practice-heading">
        <div>
          <p className="eyebrow">Practice room</p>
          <h1>Practice</h1>
          <p>Practice adapts to the selected AP course. AP World MCQs now save attempts and concept mastery.</p>
        </div>
        <label className="course-select-label">
          Course
          <select
            aria-label="Select AP practice course"
            value={selectedCourseId}
            onChange={(event) => {
              setSelectedCourseId(event.target.value);
              setCurrentQuestionIndex(0);
              setSelectedAnswerIndex(null);
            }}
          >
            {apCourses.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mode-row" aria-label="Practice modes">
        {["MCQ", "FRQ", "Weak Units", "Timed Set"].map((mode) => (
          <button className={`mode-button ${activeMode === mode ? "active" : ""}`} key={mode} type="button" onClick={() => setActiveMode(mode)}>
            {mode === "MCQ" ? "MCQ Practice" : mode === "FRQ" ? "FRQ Drill" : mode}
          </button>
        ))}
      </div>

      <div className="practice-layout">
        <section className="panel question-card" aria-live="polite">
          {canPractice ? (
            <>
              <div className="question-topline">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span>{question.skill} | {question.difficulty} | {question.period}</span>
              </div>
              <div className="stimulus-box">{question.stimulus}</div>
              <h2>{question.prompt}</h2>
              <div className="answer-stack">
                {question.choices.map((choice, index) => {
                  const answered = selectedAnswerIndex !== null;
                  const selected = selectedAnswerIndex === index;
                  const correct = index === question.answerIndex;
                  return (
                    <button
                      className={`${selected ? "selected" : ""} ${answered && correct ? "correct" : ""} ${answered && selected && !correct ? "incorrect" : ""}`}
                      key={choice}
                      type="button"
                      onClick={() => selectAnswer(index)}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>
              {selectedAnswerIndex !== null && (
                <div className="feedback-box">
                  <strong>{selectedAnswerIndex === question.answerIndex ? "Correct" : "Not quite"}</strong>
                  {question.explanation}
                  {saveMessage && <small>{saveMessage}</small>}
                  {isPending && <small>Saving progress...</small>}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="question-topline">
                <span>{activeMode === "MCQ" ? "MCQ Practice" : `${activeMode} Mode`}</span>
                <span>{course.category} | {course.status}</span>
              </div>
              <div className="stimulus-box">
                {course.active
                  ? "This mode is staged for the next build. The public beta currently has MCQ seed practice for AP World."
                  : "This course shell is ready for layout testing. Questions will appear after the source, remix, and approval databases are connected."}
              </div>
              <h2>{course.title} practice is queued for the approved question bank.</h2>
              <div className="answer-stack">
                <div className="empty-state-row">Source bank pending</div>
                <div className="empty-state-row">Remix review pending</div>
                <div className="empty-state-row">Approved practice pending</div>
              </div>
            </>
          )}

          <div className="question-actions">
            <button className="secondary-button" type="button" onClick={resetPractice}>
              Reset
            </button>
            <button className="primary-button" type="button" onClick={nextQuestion} disabled={!canPractice}>
              {currentQuestionIndex === questions.length - 1 ? "Finish Set" : "Next Question"}
            </button>
          </div>
        </section>

        <aside className="panel source-panel">
          <span className="panel-label">{course.status}</span>
          <h2>{course.title}</h2>
          <div className="source-list">
            {sourceRows.map(([label, value]) => (
              <div key={label}>
                <strong>{label}</strong>
                <span>{value}</span>
              </div>
            ))}
          </div>
          <div className="study-settings-card">
            <strong>Session shape</strong>
            <span>{activeMode === "MCQ" ? "MCQ Practice" : `${activeMode} Mode`}</span>
            <span>Unit-aware review</span>
            <span>Missed-question loop</span>
          </div>
        </aside>
      </div>
    </>
  );
}
