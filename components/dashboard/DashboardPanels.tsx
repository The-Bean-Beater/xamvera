import Link from "next/link";
import type { DashboardData } from "@/lib/data/dashboard";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric"
  }).format(new Date(value));
}

export function DashboardPanels({ data }: { data: DashboardData }) {
  return (
    <div className="dashboard-grid">
      <section className="panel plan-panel">
        <div className="panel-heading-inline">
          <span className="panel-label">Today&apos;s Plan</span>
          <span className="status-badge">Live</span>
        </div>
        <h2>{data.recommendedFocus}</h2>
        <div className="task-list">
          <Link href="/practice">
            <span>01</span>
            <strong>10 minute MCQ warmup</strong>
            <small>{data.recentAccuracy ? `${data.recentAccuracy}% recent accuracy` : "Establish today's baseline"}</small>
          </Link>
          <Link href="/courses">
            <span>02</span>
            <strong>Check course readiness</strong>
            <small>{data.masteryProgress}% average concept mastery</small>
          </Link>
          <Link href="/settings">
            <span>03</span>
            <strong>Confirm study preferences</strong>
            <small>{data.streak} day streak</small>
          </Link>
        </div>
      </section>

      <section className="panel readiness-panel">
        <span className="panel-label">Readiness</span>
        <h2>Mastery progress</h2>
        <div className="readiness-list">
          <div>
            <strong>AP World History</strong>
            <span>{data.masteryProgress ? "Synced from saved practice" : "Ready for first saved set"}</span>
            <meter min="0" max="100" value={data.masteryProgress}>
              {data.masteryProgress}%
            </meter>
          </div>
          <div>
            <strong>Recent accuracy</strong>
            <span>{data.recentAccuracy}% across latest attempts</span>
            <meter min="0" max="100" value={data.recentAccuracy}>
              {data.recentAccuracy}%
            </meter>
          </div>
          <div>
            <strong>Streak</strong>
            <span>{data.streak} active study day{data.streak === 1 ? "" : "s"}</span>
            <meter min="0" max="30" value={Math.min(data.streak, 30)}>
              {data.streak}
            </meter>
          </div>
        </div>
      </section>

      <section className="panel wide pipeline-panel">
        <span className="panel-label">Adaptive Focus</span>
        <h2>What to study today</h2>
        <div className="pipeline-grid">
          <div>
            <strong>Weak units</strong>
            <span>{data.weakUnits.length ? data.weakUnits.map((unit) => `${unit.unit} (${unit.score}%)`).join(", ") : "Practice more to identify weak units."}</span>
          </div>
          <div>
            <strong>Recent practice</strong>
            <span>{data.recentPractice.length ? `${data.recentPractice.length} saved attempt${data.recentPractice.length === 1 ? "" : "s"}` : "No saved attempts yet."}</span>
          </div>
          <div>
            <strong>XP</strong>
            <span>{data.xp} points from saved work</span>
          </div>
        </div>
      </section>

      <section className="panel wide">
        <span className="panel-label">Practice History</span>
        <h2>Latest attempts</h2>
        <div className="source-list">
          {data.recentPractice.length ? (
            data.recentPractice.map((attempt, index) => (
              <div key={`${attempt.createdAt}-${index}`}>
                <strong>{attempt.correct ? "Correct" : "Missed"} - {formatDate(attempt.createdAt)}</strong>
                <span>{attempt.question}</span>
              </div>
            ))
          ) : (
            <div>
              <strong>No attempts saved yet</strong>
              <span>Answer AP World questions in Practice to populate this dashboard.</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
