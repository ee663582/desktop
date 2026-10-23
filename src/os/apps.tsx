import { lazy, Suspense } from "react";
import type { WindowState } from "./types";
import { Explorer, RecycleBin } from "@/apps/Explorer";
import { ProjectWindow } from "@/apps/ProjectWindow";
import { About } from "@/apps/About";
import { Resume } from "@/apps/Resume";
import { Notepad } from "@/apps/Notepad";
import { Settings } from "@/apps/Settings";
import { MusicPlayer } from "@/apps/MusicPlayer";
import { GamesLauncher } from "@/apps/GamesLauncher";

const Chess = lazy(() => import("@/games/Chess").then((m) => ({ default: m.Chess })));
const LunarLander = lazy(() => import("@/games/LunarLander").then((m) => ({ default: m.LunarLander })));
const Puzzle = lazy(() => import("@/games/Puzzle").then((m) => ({ default: m.Puzzle })));

export function AppSurface({ win }: { win: WindowState }) {
  switch (win.appId) {
    case "computer":
    case "explorer":
      return <Explorer win={win} />;
    case "recyclebin":
      return <RecycleBin />;
    case "project":
      return <ProjectWindow win={win} />;
    case "about":
      return <About />;
    case "resume":
      return <Resume />;
    case "notepad":
      return <Notepad win={win} />;
    case "settings":
      return <Settings />;
    case "music":
      return <MusicPlayer />;
    case "games":
      return <GamesLauncher />;
    case "chess":
      return (
        <Suspense fallback={<Loading />}>
          <Chess />
        </Suspense>
      );
    case "lander":
      return (
        <Suspense fallback={<Loading />}>
          <LunarLander />
        </Suspense>
      );
    case "puzzle":
      return (
        <Suspense fallback={<Loading />}>
          <div className="os-pane">
            <Puzzle />
          </div>
        </Suspense>
      );
    default:
      return <div className="os-pane">This application could not be started.</div>;
  }
}

function Loading() {
  return <div className="os-pane os-dim">Loading...</div>;
}
