export type AppId =
  | "computer"
  | "explorer"
  | "project"
  | "about"
  | "resume"
  | "notepad"
  | "settings"
  | "music"
  | "games"
  | "chess"
  | "lander"
  | "puzzle"
  | "recyclebin";

export interface WindowSpec {
  appId: AppId;
  title: string;
  icon: string;
  width?: number;
  height?: number;
  resizable?: boolean;
  /** identity key: opening the same key focuses the existing window */
  key?: string;
  payload?: Record<string, unknown>;
}

export interface WindowState extends WindowSpec {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
  resizable: boolean;
  restore?: { x: number; y: number; width: number; height: number };
}

export type Phase = "off" | "post" | "boot" | "desktop" | "shutting-down" | "restarting";

export interface DesktopIconState {
  id: string;
  label: string;
  icon: string;
  x: number;
  y: number;
  open: WindowSpec;
}
