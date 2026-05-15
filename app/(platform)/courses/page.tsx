import { CoursesClient } from "@/app/(platform)/courses/CoursesClient";

export default function CoursesPage() {
  return (
    <section className="view active" id="courses">
      <CoursesClient />
    </section>
  );
}
