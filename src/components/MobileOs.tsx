import { useState } from "react";
import { archive, featured, projects, type Project } from "@/data/projects";
import wallpaper from "@/assets/wallpaper-horizon.png";

type View = "home" | "work" | "archive" | "about" | "resume" | "project";

export function MobileOs() {
  const [view, setView] = useState<View>("home");
  const [project, setProject] = useState<Project | null>(null);

  const open = (p: Project) => {
    setProject(p);
    setView("project");
  };

  return (
    <div className="mob" style={{ backgroundImage: `url(${wallpaper})` }}>
      <header className="mob-bar">
        <button onClick={() => setView("home")} className="mob-brand">
          ee663582.OS
        </button>
        <span className="mob-note">mobile session</span>
      </header>

      <main className="mob-body">
        {view === "home" && (
          <>
            <p className="mob-lead">
              This machine is meant to be used with a mouse and a keyboard. On a phone you get the contents
              without the desktop.
            </p>
            <div className="mob-grid">
              <button onClick={() => setView("work")}>Work</button>
              <button onClick={() => setView("archive")}>Archive</button>
              <button onClick={() => setView("about")}>About ee663582</button>
              <button onClick={() => setView("resume")}>Resume</button>
            </div>
          </>
        )}

        {(view === "work" || view === "archive") && (
          <>
            <h1>{view === "work" ? "Featured" : "Archive"}</h1>
            <ul className="mob-list">
              {(view === "work" ? featured : archive).map((p) => (
                <li key={p.id}>
                  <button onClick={() => open(p)}>
                    <strong>{p.name}</strong>
                    <span>
                      {p.type} · {p.year}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {view === "project" && project && (
          <article className="mob-article">
            <h1>{project.name}</h1>
            <p className="mob-note">
              {project.type} · {project.year}
            </p>
            <p>{project.description}</p>
            <h2>What I built</h2>
            <ul>
              {project.built.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <h2>Tools</h2>
            <p>{project.technologies.join(", ")}</p>
            {project.note && <p className="mob-note">{project.note}</p>}
            <button className="mob-back" onClick={() => setView(project.category === "featured" ? "work" : "archive")}>
              Back
            </button>
          </article>
        )}

        {view === "about" && (
          <article className="mob-article">
            <h1>About ee663582</h1>
            <p>The first computer in the house arrived on 25 December. I opened it almost immediately.</p>
            <p>
              Then the television, a radio, a printer that never worked again. Parts became other things — a
              motor from a dead optical drive became a desk fan. At school I repaired teachers&apos; phones.
            </p>
            <p>
              Windows 7 was the thing I explored longest: every folder, every hidden setting, every option I
              was not supposed to change. I played games, then wondered how they were made, then made one.
            </p>
            <p>
              I spent weeks trying to reach the terminal on locked-down machines. Then I reset my own computer,
              deleted the wrong partition, lost Windows entirely, and spent three days getting a different
              operating system running.
            </p>
            <p>
              I learn by touching things, taking them apart, sometimes breaking them, and figuring out how to
              put them back together. This site is the newest version of that habit.
            </p>
          </article>
        )}

        {view === "resume" && (
          <article className="mob-article">
            <h1>Resume</h1>
            <p>Software developer — interfaces, systems, and small strange machines.</p>
            <h2>Skills</h2>
            <p>TypeScript, JavaScript, React, Node.js, Canvas, Web Audio, IndexedDB, Python, Linux, Git.</p>
            <h2>Selected work</h2>
            <ul>
              {projects
                .filter((p) => p.category === "featured")
                .map((p) => (
                  <li key={p.id}>
                    <strong>{p.name}</strong> ({p.year}) — {p.description.split(".")[0]}.
                  </li>
                ))}
            </ul>
            <h2>Experience</h2>
            <p>Independent developer, 2022 — present. Informal repair work, 2016 — 2020 (~40 repairs).</p>
            <h2>Contact</h2>
            <p>ee663582@ee663582.os</p>
          </article>
        )}
      </main>

      <footer className="mob-foot">Open on a computer for the full system.</footer>
    </div>
  );
}
