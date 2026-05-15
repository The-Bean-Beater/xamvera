import { PracticeClient } from "@/components/practice/PracticeClient";
import { getPracticeQuestions } from "@/lib/data/practice-loader";

export default async function PracticePage({
  searchParams
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  const params = await searchParams;
  const courseId = params.course || "ap-world-history-modern";
  const questions = await getPracticeQuestions(courseId);

  return (
    <section className="view active" id="practice">
      <PracticeClient initialCourseId={courseId} questions={questions} />
    </section>
  );
}
