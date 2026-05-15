"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { apCourses, getCourseById } from "@/lib/data/courses";

const filters = ["all", "History & Social Science", "Science", "Math & Computer Science", "English"];
const labels: Record<string, string> = {
  all: "All",
  "History & Social Science": "History",
  Science: "Science",
  "Math & Computer Science": "Math & CS",
  English: "English"
};

export function CoursesClient() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedCourseId, setSelectedCourseId] = useState("ap-world-history-modern");
  const selectedCourse = getCourseById(selectedCourseId);

  const filteredCourses = useMemo(
    () => (activeFilter === "all" ? apCourses : apCourses.filter((course) => course.category === activeFilter)),
    [activeFilter]
  );

  return (
    <>
      <div className="page-heading course-heading">
        <div>
          <p className="eyebrow">AP catalog</p>
          <h1>Courses</h1>
          <p>Core AP course shells are grouped for quick scanning. AP World is the active beta course.</p>
        </div>
        <div className="course-count">
          <strong>{apCourses.length}</strong>
          <span>course shells</span>
        </div>
      </div>

      <div className="filter-row" aria-label="Course filters">
        {filters.map((filter) => (
          <button
            className={`filter-pill ${activeFilter === filter ? "active" : ""}`}
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
          >
            {labels[filter]}
          </button>
        ))}
      </div>

      <div className="course-layout">
        <section className="course-grid" aria-label="AP course catalog">
          {filteredCourses.map((course) => (
            <article
              className={`course-card ${course.id === selectedCourseId ? "selected" : ""}`}
              key={course.id}
              onClick={() => setSelectedCourseId(course.id)}
            >
              <div className="course-card-top">
                <span>{course.category}</span>
                <mark className={course.active ? "active" : "placeholder"}>{course.status}</mark>
              </div>
              <h2>{course.title}</h2>
              <p>{course.focus}</p>
              <div className="course-meta">
                <span>{course.units} units</span>
                <span>{course.format}</span>
              </div>
              <Link className="secondary-button compact" href={`/practice?course=${course.id}`}>
                Practice
              </Link>
            </article>
          ))}
        </section>

        <aside className="panel course-detail" aria-live="polite">
          <span className="panel-label">Selected Course</span>
          <h2>{selectedCourse.title}</h2>
          <p>{selectedCourse.focus}</p>
          <div className="course-detail-list">
            <div>
              <strong>Category</strong>
              <span>{selectedCourse.category}</span>
            </div>
            <div>
              <strong>Exam format</strong>
              <span>{selectedCourse.format}</span>
            </div>
            <div>
              <strong>Status</strong>
              <span>{selectedCourse.status}</span>
            </div>
          </div>
          <div className="unit-pill-grid" aria-label={`${selectedCourse.short} units`}>
            {Array.from({ length: selectedCourse.units }, (_, index) => (
              <span className={selectedCourse.active && index < 2 ? "active" : ""} key={index}>
                Unit {index + 1}
              </span>
            ))}
          </div>
          <Link className="primary-button" href={`/practice?course=${selectedCourse.id}`}>
            Open Practice
          </Link>
        </aside>
      </div>
    </>
  );
}
