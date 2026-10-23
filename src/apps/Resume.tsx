const RESUME = `ee663582
Software developer — interfaces, systems, and small strange machines

CONTACT
  email     ee663582@ee663582.os
  location  available remotely

SUMMARY
  Developer with a hardware-first curiosity and a long habit of taking
  systems apart to understand them. Comfortable across front-end
  engineering, interaction design, and low-level browser APIs. Builds
  things end to end and prefers few dependencies.

SKILLS
  Languages     TypeScript, JavaScript, HTML, CSS, Python
  Frameworks    React, Vite, Node.js
  Browser APIs  Canvas, Web Audio, IndexedDB, Service Workers
  Other         Git, Linux, hardware repair, debugging by stubbornness

SELECTED WORK
  ee663582.OS (2026)
    A fictional operating system built as a portfolio. Custom window
    manager, simulated filesystem, runtime-generated sound design,
    three small games. No UI framework used for the system layer.

  Tide (2025)
    Offline-first notes tool that keeps a version of every save.
    Local-first storage, per-save history, conflict resolution.

  Sonar (2025)
    Audio-reactive visualiser. FFT analysis mapped to a canvas
    height-field renderer at 60fps on integrated graphics.

EXPERIENCE
  Independent developer                            2022 — present
    Front-end and full-stack work for small teams. Interface systems,
    performance work, and prototypes that had to feel real quickly.

  Repairs and support (informal)                   2016 — 2020
    Phone, laptop and desktop repair for a school staff room and
    everyone they recommended me to. ~40 repairs.

EDUCATION
  Self-taught, continuously, since roughly 2010.
  Formal study in computer science.

NOTES
  First computer: 25 December.
  Destroyed a drive partition in 2019 and recovered from it.
  Still opens things to see what is inside.`;

export function Resume() {
  return (
    <div className="os-notepad-view">
      <pre className="os-notepad-text os-readonly">{RESUME}</pre>
    </div>
  );
}
