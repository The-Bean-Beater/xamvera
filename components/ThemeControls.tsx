"use client";

import { useEffect, useState } from "react";

const themeStorageKey = "xamvera-theme";
const themes = ["system", "light", "dark"] as const;
type Theme = (typeof themes)[number];

export function ThemeControls() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const savedTheme = localStorage.getItem(themeStorageKey);
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }
  }, []);

  function applyTheme(nextTheme: Theme) {
    setTheme(nextTheme);

    if (nextTheme === "system") {
      document.documentElement.removeAttribute("data-theme");
      localStorage.removeItem(themeStorageKey);
    } else {
      document.documentElement.dataset.theme = nextTheme;
      localStorage.setItem(themeStorageKey, nextTheme);
    }
  }

  return (
    <div className="theme-toggle" role="group" aria-label="Theme">
      {themes.map((option) => (
        <button className={theme === option ? "active" : ""} key={option} type="button" onClick={() => applyTheme(option)}>
          {option[0].toUpperCase() + option.slice(1)}
        </button>
      ))}
    </div>
  );
}
