import Link from "next/link";

export default function HomePage() {
  return (
    <section className="view active" id="home">
      <section className="hero-study">
        <div className="hero-copy">
          <p className="eyebrow">AP World beta</p>
          <h1>XamVera</h1>
          <p>Build exam-ready practice from reviewed AP-style questions, unit skills, and source-based sets.</p>
          <div className="hero-stats" aria-label="XamVera AP study status">
            <span>
              <strong>9</strong> AP World units
            </span>
            <span>
              <strong>MCQ</strong> source-based practice
            </span>
            <span>
              <strong>Admin</strong> review pipeline
            </span>
          </div>
          <div className="hero-actions">
            <Link className="primary-button" href="/practice">
              Start AP World Practice
            </Link>
            <Link className="secondary-button" href="/courses">
              Browse Courses
            </Link>
          </div>
        </div>

        <div className="study-console" aria-label="Study dashboard preview">
          <div className="console-header">
            <span>Today</span>
            <strong>AP World History</strong>
          </div>
          <div className="console-grid">
            <div className="console-block strong">
              <span>Unit 2</span>
              <strong>Networks of Exchange</strong>
            </div>
            <div className="console-block">
              <span>Accuracy</span>
              <strong>Synced</strong>
            </div>
            <div className="console-block">
              <span>Mode</span>
              <strong>MCQ</strong>
            </div>
          </div>
          <div className="unit-map" aria-hidden="true">
            <span className="complete"></span>
            <span className="active"></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="console-question">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </section>

      <section className="home-grid">
        <article className="panel focus-card">
          <span className="panel-label">Study Flow</span>
          <h2>Pick course, drill units, review misses</h2>
          <div className="flow-steps" aria-label="XamVera study flow">
            <span>Course</span>
            <span>Unit</span>
            <span>Practice</span>
            <span>Review</span>
          </div>
        </article>
        <article className="panel">
          <span className="panel-label">Live Course</span>
          <h2>AP World History: Modern</h2>
          <p>Seed practice is active while source and remix databases stay behind admin review.</p>
        </article>
        <article className="panel">
          <span className="panel-label">Catalog</span>
          <h2>Core AP courses</h2>
          <p>History, social science, English, math, computer science, and science shells are ready as placeholders.</p>
        </article>
      </section>
    </section>
  );
}
