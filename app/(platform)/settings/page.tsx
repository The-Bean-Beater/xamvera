import { ThemeControls } from "@/components/ThemeControls";
import { getCurrentUserProfile } from "@/lib/data/profile";

export default async function SettingsPage() {
  const profile = await getCurrentUserProfile();

  return (
    <section className="view active" id="settings">
      <div className="page-heading">
        <p className="eyebrow">Workspace</p>
        <h1>Settings</h1>
        <p>Theme, product settings, and account preferences live here.</p>
      </div>

      <div className="settings-grid">
        <section className="panel form-panel">
          <span className="panel-label">Appearance</span>
          <h2>Theme</h2>
          <ThemeControls />
        </section>

        <section className="panel form-panel">
          <span className="panel-label">Account</span>
          <h2>Study profile</h2>
          <label>
            Email
            <input type="text" value={profile?.email || "Not signed in"} readOnly aria-label="Account email" />
          </label>
          <label>
            Primary course
            <input type="text" value="AP World History: Modern" readOnly aria-label="Primary course" />
          </label>
          <form action="/auth/signout" method="post">
            <button className="primary-button" type="submit">
              Sign Out
            </button>
          </form>
        </section>
      </div>
    </section>
  );
}
