import { DashboardPanels } from "@/components/dashboard/DashboardPanels";
import { getDashboardData } from "@/lib/data/dashboard";

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <section className="view active" id="dashboard">
      <div className="page-heading">
        <p className="eyebrow">Student home</p>
        <h1>Dashboard</h1>
        <p>Daily practice, unit readiness, and missed-question review are personalized from saved attempts.</p>
      </div>
      <DashboardPanels data={data} />
    </section>
  );
}
