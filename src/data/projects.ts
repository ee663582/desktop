export interface Project {
  id: string;
  name: string;
  file: string;
  type: "website" | "application" | "game" | "experiment" | "hardware";
  category: "featured" | "archive";
  year: string;
  description: string;
  built: string[];
  technologies: string[];
  url?: string;
  note?: string;
}

export const projects: Project[] = [
  {
    id: "ee663582-os",
    name: "ee663582.OS",
    file: "ee663582-os.app",
    type: "application",
    category: "featured",
    year: "2026",
    description:
      "The thing you are currently inside. A fictional operating system with a window manager, a simulated filesystem, synthesised system sounds and a set of small applications. It is also the portfolio.",
    built: [
      "Window manager: drag, resize, focus, z-order, minimise, maximise, restore",
      "Simulated C:\\ filesystem with folders, files and an explorer",
      "Entire sound design generated at runtime with the Web Audio API",
      "Boot, shutdown and restart as real session states",
    ],
    technologies: ["React", "TypeScript", "CSS", "Web Audio API", "Canvas"],
    note: "Started as a joke about missing Windows 7. Stopped being a joke around the window manager.",
  },
  {
    id: "tide",
    name: "Tide",
    file: "tide.app",
    type: "application",
    category: "featured",
    year: "2025",
    description:
      "A small offline-first notes tool that keeps a version of every save, so nothing you type is ever really lost. Built after losing a partition and, with it, four years of notes.",
    built: [
      "Local-first storage layer with a per-save history stack",
      "Conflict resolution when the same note is edited in two tabs",
      "Keyboard-only navigation",
    ],
    technologies: ["TypeScript", "IndexedDB", "React", "Service Workers"],
  },
  {
    id: "sonar",
    name: "Sonar",
    file: "sonar.exe",
    type: "experiment",
    category: "featured",
    year: "2025",
    description:
      "An audio-reactive visualiser that draws the shape of a room's sound as a slow moving water surface. Runs entirely on the analyser node and a single canvas.",
    built: [
      "FFT analysis mapped to a height-field renderer",
      "60fps on integrated graphics by reusing a single image buffer",
    ],
    technologies: ["Canvas", "Web Audio API", "TypeScript"],
  },
  {
    id: "partition",
    name: "partition.log",
    file: "partition.log",
    type: "experiment",
    category: "archive",
    year: "2019",
    description:
      "Not a project. A text file I kept while trying to recover the drive I destroyed during a reinstall. Left in the archive because it is the most honest thing here.",
    built: ["Notes, commands, wrong guesses, and eventually the right one"],
    technologies: ["Command line", "Stubbornness"],
  },
  {
    id: "motor-fan",
    name: "Desk Fan From A Dead CD Drive",
    file: "fan.hardware",
    type: "hardware",
    category: "archive",
    year: "2016",
    description:
      "Took the spindle motor out of a broken optical drive, wired it to a battery and a cut-up plastic blade. It worked for about nine minutes and smelled like burnt hair.",
    built: ["The fan", "A small scorch mark on a desk"],
    technologies: ["Salvaged motor", "Soldering iron", "No supervision"],
  },
  {
    id: "phone-repairs",
    name: "Staff Room Repairs",
    file: "repairs.txt",
    type: "hardware",
    category: "archive",
    year: "2017",
    description:
      "For two years I was the person teachers brought their phones to. Cracked digitisers, dead charging ports, forgotten pattern locks, one laptop that only needed its RAM reseated.",
    built: ["Roughly forty repairs", "A reputation"],
    technologies: ["Screwdrivers", "Heat gun", "Patience"],
  },
  {
    id: "first-game",
    name: "Cave (first game)",
    file: "cave.exe",
    type: "game",
    category: "archive",
    year: "2018",
    description:
      "A one-screen game where a square avoids other squares. I made it because I wanted to know what a game actually was underneath. It is bad and I am keeping it.",
    built: ["A game loop", "Collision detection I wrote wrong three times"],
    technologies: ["JavaScript", "Canvas"],
  },
  {
    id: "batch-menu",
    name: "Boot Menu Experiments",
    file: "menu.bat",
    type: "experiment",
    category: "archive",
    year: "2017",
    description:
      "A batch file that pretended to be an operating system menu, run from the school computer lab. Probably the ancestor of the thing you are looking at now.",
    built: ["A menu", "A very slow realisation"],
    technologies: ["Batch", "cmd.exe"],
  },
  {
    id: "weather-site",
    name: "Coast Weather",
    file: "coast.html",
    type: "website",
    category: "archive",
    year: "2023",
    description:
      "A single page that shows tide and wind for one specific stretch of coastline. No settings, no accounts, one location.",
    built: ["A tiny fetch layer with caching", "An SVG tide curve"],
    technologies: ["HTML", "CSS", "JavaScript", "SVG"],
  },
];

export const featured = projects.filter((p) => p.category === "featured");
export const archive = projects.filter((p) => p.category === "archive");
