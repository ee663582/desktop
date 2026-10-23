import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { DesktopIconState, Phase, WindowSpec, WindowState } from "./types";
import { defaultWallpaperId } from "@/data/wallpapers";
import { setMasterVolume, sfx, startHum, startMusic, stopHum, stopMusic, resumeAudio } from "@/audio/audio";

export const TASKBAR_H = 40;

const LS = {
  wallpaper: "ee663582.os/wallpaper",
  volume: "ee663582.os/volume",
  muted: "ee663582.os/muted",
  cursor: "ee663582.os/cursor",
  theme: "ee663582.os/theme",
  notes: "ee663582.os/notes",
};

export type CursorStyle = "aero" | "classic" | "inverted";
export type ThemeStyle = "aero" | "graphite" | "highcontrast";

interface OsState {
  phase: Phase;
  windows: WindowState[];
  focusedId: string | null;
  icons: DesktopIconState[];
  wallpaper: string;
  volume: number;
  muted: boolean;
  musicPlaying: boolean;
  cursor: CursorStyle;
  theme: ThemeStyle;
  softness: boolean;
}

interface OsApi extends OsState {
  setPhase: (p: Phase) => void;
  openWindow: (spec: WindowSpec) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  toggleFromTaskbar: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  resizeWindow: (id: string, w: number, h: number, x?: number, y?: number) => void;
  setWindowTitle: (id: string, title: string) => void;
  moveIcon: (id: string, x: number, y: number) => void;
  setWallpaper: (id: string) => void;
  setVolume: (v: number) => void;
  setMuted: (m: boolean) => void;
  setMusicPlaying: (p: boolean) => void;
  setCursor: (c: CursorStyle) => void;
  setTheme: (t: ThemeStyle) => void;
  setSoftness: (s: boolean) => void;
  shutdown: () => void;
  restart: () => void;
  powerOn: () => void;
}

const OsContext = createContext<OsApi | null>(null);

export const initialIcons: DesktopIconState[] = [
  { id: "i-computer", label: "Computer", icon: "computer", x: 24, y: 20, open: { appId: "computer", title: "Computer", icon: "computer", key: "computer", width: 720, height: 460 } },
  { id: "i-work", label: "Work", icon: "folder", x: 24, y: 118, open: { appId: "explorer", title: "Work", icon: "folder", key: "fs-work", width: 700, height: 440, payload: { nodeId: "work" } } },
  { id: "i-archive", label: "Archive", icon: "archive", x: 24, y: 216, open: { appId: "explorer", title: "Archive", icon: "archive", key: "fs-archive", width: 700, height: 440, payload: { nodeId: "archive" } } },
  { id: "i-about", label: "About ee663582", icon: "user", x: 24, y: 314, open: { appId: "about", title: "About ee663582", icon: "user", key: "about", width: 620, height: 500 } },
  { id: "i-resume", label: "Resume.txt", icon: "text", x: 128, y: 412, open: { appId: "resume", title: "Resume.txt - Notepad", icon: "text", key: "resume", width: 620, height: 520 } },
  { id: "i-notepad", label: "Notepad", icon: "notepad", x: 130, y: 22, open: { appId: "notepad", title: "Untitled - Notepad", icon: "notepad", width: 560, height: 420 } },
  { id: "i-games", label: "Games", icon: "games", x: 132, y: 128, open: { appId: "games", title: "Games", icon: "games", key: "games", width: 520, height: 320 } },
  { id: "i-settings", label: "Settings", icon: "settings", x: 26, y: 412, open: { appId: "settings", title: "Settings", icon: "settings", key: "settings", width: 560, height: 430 } },
  { id: "i-music", label: "Player", icon: "music", x: 134, y: 228, open: { appId: "music", title: "Player", icon: "music", key: "music", width: 420, height: 300 } },
  { id: "i-bin", label: "Recycle Bin", icon: "recycle", x: 26, y: 508, open: { appId: "recyclebin", title: "Recycle Bin", icon: "recycle", key: "bin", width: 560, height: 360 } },
];

let seq = 1;

export function OsProvider({ children }: { children: ReactNode }) {
  const [phase, setPhaseRaw] = useState<Phase>("post");
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [icons, setIcons] = useState<DesktopIconState[]>(initialIcons);
  const [wallpaper, setWallpaperRaw] = useState(defaultWallpaperId);
  const [volume, setVolumeRaw] = useState(0.6);
  const [muted, setMutedRaw] = useState(false);
  const [musicPlaying, setMusicPlayingRaw] = useState(false);
  const [cursor, setCursorRaw] = useState<CursorStyle>("aero");
  const [theme, setThemeRaw] = useState<ThemeStyle>("aero");
  const [softness, setSoftnessRaw] = useState(true);
  const topZ = useRef(10);

  /* restore preferences */
  useEffect(() => {
    try {
      const w = localStorage.getItem(LS.wallpaper);
      if (w) setWallpaperRaw(w);
      const v = localStorage.getItem(LS.volume);
      if (v) setVolumeRaw(Number(v));
      const m = localStorage.getItem(LS.muted);
      if (m) setMutedRaw(m === "1");
      const c = localStorage.getItem(LS.cursor);
      if (c) setCursorRaw(c as CursorStyle);
      const t = localStorage.getItem(LS.theme);
      if (t) setThemeRaw(t as ThemeStyle);
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    setMasterVolume(muted ? 0 : volume);
  }, [muted, volume]);

  const setPhase = useCallback((p: Phase) => setPhaseRaw(p), []);

  const focusWindow = useCallback((id: string) => {
    topZ.current += 1;
    const z = topZ.current;
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, z, minimized: false } : w)));
    setFocusedId(id);
  }, []);

  const openWindow = useCallback(
    (spec: WindowSpec) => {
      resumeAudio();
      let existingId: string | null = null;
      setWindows((ws) => {
        if (spec.key) {
          const found = ws.find((w) => w.key === spec.key);
          if (found) {
            existingId = found.id;
            return ws;
          }
        }
        topZ.current += 1;
        const width = spec.width ?? 640;
        const height = spec.height ?? 440;
        const maxX = Math.max(20, (typeof window !== "undefined" ? window.innerWidth : 1280) - width - 20);
        const maxY = Math.max(
          10,
          (typeof window !== "undefined" ? window.innerHeight : 800) - height - TASKBAR_H - 20,
        );
        const offset = (ws.length % 6) * 26;
        const id = `w${seq++}`;
        const win: WindowState = {
          ...spec,
          id,
          width,
          height,
          x: Math.min(maxX, 90 + offset),
          y: Math.min(maxY, 50 + offset),
          z: topZ.current,
          minimized: false,
          maximized: false,
          resizable: spec.resizable ?? true,
        };
        setFocusedId(id);
        return [...ws, win];
      });
      // focusing an already-open window must happen outside the updater
      queueMicrotask(() => {
        if (existingId) focusWindow(existingId);
        else sfx.openWindow();
      });
    },
    [focusWindow],
  );

  const closeWindow = useCallback((id: string) => {
    sfx.closeWindow();
    setWindows((ws) => ws.filter((w) => w.id !== id));
    setFocusedId((f) => (f === id ? null : f));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    sfx.minimize();
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, minimized: true } : w)));
    setFocusedId((f) => (f === id ? null : f));
  }, []);

  const toggleMaximize = useCallback((id: string) => {
    sfx.click();
    setWindows((ws) =>
      ws.map((w) => {
        if (w.id !== id) return w;
        if (w.maximized) {
          const r = w.restore;
          return { ...w, maximized: false, ...(r ?? {}) };
        }
        return {
          ...w,
          maximized: true,
          restore: { x: w.x, y: w.y, width: w.width, height: w.height },
        };
      }),
    );
  }, []);

  const toggleFromTaskbar = useCallback(
    (id: string) => {
      const win = windows.find((w) => w.id === id);
      if (!win) return;
      if (!win.minimized && focusedId === id) minimizeWindow(id);
      else focusWindow(id);
    },
    [windows, focusedId, focusWindow, minimizeWindow],
  );

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, x, y } : w)));
  }, []);

  const resizeWindow = useCallback((id: string, width: number, height: number, x?: number, y?: number) => {
    setWindows((ws) =>
      ws.map((w) =>
        w.id === id ? { ...w, width, height, x: x ?? w.x, y: y ?? w.y } : w,
      ),
    );
  }, []);

  const setWindowTitle = useCallback((id: string, title: string) => {
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, title } : w)));
  }, []);

  const moveIcon = useCallback((id: string, x: number, y: number) => {
    setIcons((is) => is.map((i) => (i.id === id ? { ...i, x, y } : i)));
  }, []);

  const setWallpaper = useCallback((id: string) => {
    setWallpaperRaw(id);
    try {
      localStorage.setItem(LS.wallpaper, id);
    } catch {
      /* ignore */
    }
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeRaw(v);
    try {
      localStorage.setItem(LS.volume, String(v));
    } catch {
      /* ignore */
    }
  }, []);

  const setMuted = useCallback((m: boolean) => {
    setMutedRaw(m);
    try {
      localStorage.setItem(LS.muted, m ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);

  const setMusicPlaying = useCallback((p: boolean) => {
    setMusicPlayingRaw(p);
    if (p) {
      resumeAudio();
      startMusic();
    } else stopMusic();
  }, []);

  const setCursor = useCallback((c: CursorStyle) => {
    setCursorRaw(c);
    try {
      localStorage.setItem(LS.cursor, c);
    } catch {
      /* ignore */
    }
  }, []);

  const setTheme = useCallback((t: ThemeStyle) => {
    setThemeRaw(t);
    try {
      localStorage.setItem(LS.theme, t);
    } catch {
      /* ignore */
    }
  }, []);

  const setSoftness = useCallback((s: boolean) => setSoftnessRaw(s), []);

  const endSession = useCallback(() => {
    stopMusic();
    stopHum();
    setMusicPlayingRaw(false);
    setWindows([]);
    setFocusedId(null);
  }, []);

  const shutdown = useCallback(() => {
    sfx.shutdown();
    setPhaseRaw("shutting-down");
    window.setTimeout(() => {
      endSession();
      setPhaseRaw("off");
    }, 2600);
  }, [endSession]);

  const restart = useCallback(() => {
    sfx.shutdown();
    setPhaseRaw("restarting");
    window.setTimeout(() => {
      endSession();
      setIcons(initialIcons);
      setPhaseRaw("post");
    }, 2600);
  }, [endSession]);

  const powerOn = useCallback(() => {
    resumeAudio();
    setPhaseRaw("post");
  }, []);

  /* desktop hum follows the session */
  useEffect(() => {
    if (phase === "desktop") startHum();
    else stopHum();
  }, [phase]);

  const value = useMemo<OsApi>(
    () => ({
      phase,
      windows,
      focusedId,
      icons,
      wallpaper,
      volume,
      muted,
      musicPlaying,
      cursor,
      theme,
      softness,
      setPhase,
      openWindow,
      closeWindow,
      focusWindow,
      minimizeWindow,
      toggleMaximize,
      toggleFromTaskbar,
      moveWindow,
      resizeWindow,
      setWindowTitle,
      moveIcon,
      setWallpaper,
      setVolume,
      setMuted,
      setMusicPlaying,
      setCursor,
      setTheme,
      setSoftness,
      shutdown,
      restart,
      powerOn,
    }),
    [
      phase,
      windows,
      focusedId,
      icons,
      wallpaper,
      volume,
      muted,
      musicPlaying,
      cursor,
      theme,
      softness,
      setPhase,
      openWindow,
      closeWindow,
      focusWindow,
      minimizeWindow,
      toggleMaximize,
      toggleFromTaskbar,
      moveWindow,
      resizeWindow,
      setWindowTitle,
      moveIcon,
      setWallpaper,
      setVolume,
      setMuted,
      setMusicPlaying,
      setCursor,
      setTheme,
      setSoftness,
      shutdown,
      restart,
      powerOn,
    ],
  );

  return <OsContext.Provider value={value}>{children}</OsContext.Provider>;
}

export function useOs() {
  const ctx = useContext(OsContext);
  if (!ctx) throw new Error("useOs must be used inside OsProvider");
  return ctx;
}

export const notesStorageKey = LS.notes;
