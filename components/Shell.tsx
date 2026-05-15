"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import type { CurrentUserProfile } from "@/lib/data/profile";

const navItems = [
  { href: "/", label: "Home", short: "H" },
  { href: "/dashboard", label: "Dashboard", short: "D" },
  { href: "/courses", label: "Courses", short: "C" },
  { href: "/practice", label: "Practice", short: "P" },
  { href: "/settings", label: "Settings", short: "S" }
];

function titleForPath(pathname: string) {
  if (pathname.startsWith("/dashboard")) return "Dashboard";
  if (pathname.startsWith("/courses")) return "Courses";
  if (pathname.startsWith("/practice")) return "Practice";
  if (pathname.startsWith("/settings")) return "Settings";
  return "Home";
}

export function Shell({
  children,
  profile
}: {
  children: ReactNode;
  profile: CurrentUserProfile;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem("xamvera-sidebar-collapsed") === "true");
  }, []);

  const activeTitle = useMemo(() => titleForPath(pathname), [pathname]);

  function toggleSidebar() {
    if (window.matchMedia("(max-width: 980px)").matches) {
      setSidebarOpen((value) => !value);
      return;
    }

    setCollapsed((value) => {
      localStorage.setItem("xamvera-sidebar-collapsed", String(!value));
      return !value;
    });
  }

  return (
    <div className={`app-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`} id="sidebar">
        <Link className="brand" href="/" aria-label="XamVera home">
          <span className="brand-mark" aria-hidden="true">
            <img src="/assets/xanvera-mark-tight-192.png" alt="" />
          </span>
          <span>
            <strong>XamVera</strong>
            <small>AP mastery workspace</small>
          </span>
        </Link>

        <nav className="nav-list" aria-label="Main navigation">
          {navItems.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                className={`nav-item ${active ? "active" : ""}`}
                data-short={item.short}
                href={item.href}
                key={item.href}
                title={item.label}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-note">
          <span>Current Build</span>
          <strong>AP World beta</strong>
          <p>Course shell, practice flow, and review pipeline are staged before public question expansion.</p>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <button className="menu-button" type="button" aria-label={collapsed ? "Expand menu" : "Collapse menu"} onClick={toggleSidebar}>
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className="topbar-title">
            <img src="/assets/xanvera-mark-tight-192.png" alt="" aria-hidden="true" />
            <span>AP Practice Hub</span>
            <strong>{activeTitle}</strong>
          </div>

          <div className="topbar-actions">
            <Link className="secondary-button compact" href="/courses">
              Courses
            </Link>
            <Link className="primary-button compact" href="/practice">
              Practice
            </Link>
            {profile ? (
              <form action="/auth/signout" method="post">
                <button className="secondary-button compact" type="submit">
                  Sign Out
                </button>
              </form>
            ) : (
              <Link className="secondary-button compact" href="/login">
                Log In
              </Link>
            )}
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
