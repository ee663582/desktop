import type { IconName } from "@/os/icons";
import { projects } from "./projects";

export interface FsNode {
  id: string;
  name: string;
  icon: IconName;
  kind: "folder" | "project" | "text" | "app";
  /** for kind === 'project' */
  projectId?: string;
  /** for kind === 'text' */
  body?: string;
  /** for kind === 'app' */
  app?: string;
  size?: string;
  modified?: string;
  children?: FsNode[];
}

const projectNode = (id: string): FsNode => {
  const p = projects.find((x) => x.id === id)!;
  return {
    id: `p-${p.id}`,
    name: p.file,
    icon: p.type === "game" ? "games" : p.type === "website" ? "app" : p.type === "hardware" ? "picture" : "app",
    kind: "project",
    projectId: p.id,
    size: `${20 + (p.name.length % 40)} KB`,
    modified: p.year,
  };
};

export const fileSystem: FsNode = {
  id: "computer",
  name: "Computer",
  icon: "computer",
  kind: "folder",
  children: [
    {
      id: "c",
      name: "Local Disk (C:)",
      icon: "drive",
      kind: "folder",
      children: [
        {
          id: "ee663582",
          name: "ee663582",
          icon: "folder",
          kind: "folder",
          children: [
            {
              id: "about",
              name: "About",
              icon: "folder",
              kind: "folder",
              children: [
                { id: "about-app", name: "about ee663582.txt", icon: "text", kind: "app", app: "about", size: "6 KB" },
                {
                  id: "colophon",
                  name: "colophon.txt",
                  icon: "text",
                  kind: "text",
                  size: "1 KB",
                  modified: "2026",
                  body: `ee663582.OS
build 1.0

Written from nothing. No window library, no UI kit for the system
itself. Every window, every beep, every folder is code in this
repository.

Things that are real:
  - the window manager
  - the filesystem you are browsing
  - the sounds (generated, not recorded)
  - Notepad, and the notes it saves to this machine

Things that are fiction:
  - the BIOS
  - the hardware
  - the idea that any of this is Windows`,
                },
              ],
            },
            {
              id: "work",
              name: "Work",
              icon: "folder",
              kind: "folder",
              children: [
                {
                  id: "featured",
                  name: "Featured",
                  icon: "folder",
                  kind: "folder",
                  children: projects.filter((p) => p.category === "featured").map((p) => projectNode(p.id)),
                },
                {
                  id: "archive",
                  name: "Archive",
                  icon: "archive",
                  kind: "folder",
                  children: projects.filter((p) => p.category === "archive").map((p) => projectNode(p.id)),
                },
                {
                  id: "readme-work",
                  name: "read me first.txt",
                  icon: "text",
                  kind: "text",
                  size: "1 KB",
                  modified: "2026",
                  body: `Featured is the work I would show someone who asked.

Archive is everything else: things I built, experimented with,
learned from, or simply wanted to make. Some of it is bad. I have
not quietly deleted the bad ones, because the bad ones are the
reason the other ones exist.`,
                },
              ],
            },
            {
              id: "documents",
              name: "Documents",
              icon: "folder",
              kind: "folder",
              children: [
                { id: "resume-file", name: "Resume.txt", icon: "text", kind: "app", app: "resume", size: "4 KB" },
                {
                  id: "notes",
                  name: "Notes",
                  icon: "folder",
                  kind: "folder",
                  children: [
                    {
                      id: "note-terminal",
                      name: "terminal.txt",
                      icon: "text",
                      kind: "text",
                      size: "1 KB",
                      modified: "2018",
                      body: `I spent a whole week trying to get into the terminal on a
computer that was not mine, in a lab where the command prompt
had been disabled by policy.

I got in eventually. There was nothing in there. That was not
the point.`,
                    },
                    {
                      id: "note-drive",
                      name: "the drive.txt",
                      icon: "text",
                      kind: "text",
                      size: "1 KB",
                      modified: "2019",
                      body: `I deleted the wrong partition during a reinstall.

Windows was gone. Not corrupted - gone, along with the recovery
image, because I had also removed that.

Three days of a borrowed laptop, a USB stick, and forum posts
from 2011. I came out the other side with a different operating
system, a slightly better understanding of what a bootloader is,
and the permanent habit of backing things up twice.`,
                    },
                  ],
                },
              ],
            },
            {
              id: "pictures",
              name: "Pictures",
              icon: "folder",
              kind: "folder",
              children: [
                { id: "pic-1", name: "horizon_2512.jpg", icon: "picture", kind: "text", size: "2.1 MB", modified: "unknown", body: "[ image: a dark sea at dusk, one light on the horizon ]" },
                { id: "pic-2", name: "under.jpg", icon: "picture", kind: "text", size: "1.8 MB", modified: "unknown", body: "[ image: looking up at the surface from underneath ]" },
                { id: "pic-3", name: "grey_sea.jpg", icon: "picture", kind: "text", size: "1.4 MB", modified: "unknown", body: "[ image: grey water, one wooden post, no weather to speak of ]" },
              ],
            },
          ],
        },
        {
          id: "system",
          name: "ee663582.OS",
          icon: "folder",
          kind: "folder",
          children: [
            { id: "notepad-app", name: "notepad.exe", icon: "notepad", kind: "app", app: "notepad", size: "48 KB" },
            { id: "settings-app", name: "settings.exe", icon: "settings", kind: "app", app: "settings", size: "72 KB" },
            { id: "music-app", name: "player.exe", icon: "music", kind: "app", app: "music", size: "96 KB" },
            { id: "games-app", name: "games", icon: "games", kind: "app", app: "games", size: "—" },
            {
              id: "boot-log",
              name: "boot.log",
              icon: "text",
              kind: "text",
              size: "2 KB",
              modified: "today",
              body: `[0.00] POST complete
[0.41] ee663582.OS kernel loaded
[0.88] mounting C:
[1.02] loading personal environment
[1.44] loading workspace
[1.90] loading memories ......... OK
[2.10] session start

note to self: the memories stage does nothing. i left it in
because i like seeing it.`,
            },
          ],
        },
      ],
    },
  ],
};

export function findNode(id: string, root: FsNode = fileSystem): FsNode | null {
  if (root.id === id) return root;
  for (const c of root.children ?? []) {
    const hit = findNode(id, c);
    if (hit) return hit;
  }
  return null;
}

export function pathOf(id: string, root: FsNode = fileSystem, trail: FsNode[] = []): FsNode[] | null {
  const next = [...trail, root];
  if (root.id === id) return next;
  for (const c of root.children ?? []) {
    const hit = pathOf(id, c, next);
    if (hit) return hit;
  }
  return null;
}
