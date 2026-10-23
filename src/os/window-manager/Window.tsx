import { useCallback, useEffect, useRef, type ReactNode } from "react";
import type { WindowState } from "../types";
import { TASKBAR_H, useOs } from "../store";
import { Ico, type IconName } from "../icons";

const MIN_W = 320;
const MIN_H = 180;

type Edge = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

export function Win({ win, children }: { win: WindowState; children: ReactNode }) {
  const { focusWindow, closeWindow, minimizeWindow, toggleMaximize, moveWindow, resizeWindow, focusedId } =
    useOs();
  const active = focusedId === win.id;
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const resize = useRef<{ edge: Edge; sx: number; sy: number; x: number; y: number; w: number; h: number } | null>(
    null,
  );

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (drag.current) {
        const maxY = window.innerHeight - TASKBAR_H - 28;
        moveWindow(
          win.id,
          Math.max(-win.width + 90, Math.min(window.innerWidth - 60, e.clientX - drag.current.dx)),
          Math.max(0, Math.min(maxY, e.clientY - drag.current.dy)),
        );
      } else if (resize.current) {
        const r = resize.current;
        const dx = e.clientX - r.sx;
        const dy = e.clientY - r.sy;
        let { x, y, w, h } = r;
        if (r.edge.includes("e")) w = Math.max(MIN_W, r.w + dx);
        if (r.edge.includes("s")) h = Math.max(MIN_H, r.h + dy);
        if (r.edge.includes("w")) {
          w = Math.max(MIN_W, r.w - dx);
          x = r.x + (r.w - w);
        }
        if (r.edge.includes("n")) {
          h = Math.max(MIN_H, r.h - dy);
          y = r.y + (r.h - h);
        }
        resizeWindow(win.id, w, h, x, y);
      }
    },
    [moveWindow, resizeWindow, win.id, win.width],
  );

  const stop = useCallback(() => {
    drag.current = null;
    resize.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", stop);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", stop);
    };
  }, [onPointerMove, stop]);

  if (win.minimized) return null;

  const style = win.maximized
    ? { left: 0, top: 0, width: "100%", height: `calc(100% - ${TASKBAR_H}px)`, zIndex: win.z }
    : { left: win.x, top: win.y, width: win.width, height: win.height, zIndex: win.z };

  const startDrag = (e: React.PointerEvent) => {
    if (win.maximized) return;
    drag.current = { dx: e.clientX - win.x, dy: e.clientY - win.y };
    focusWindow(win.id);
  };

  const startResize = (edge: Edge) => (e: React.PointerEvent) => {
    e.stopPropagation();
    if (win.maximized || !win.resizable) return;
    resize.current = { edge, sx: e.clientX, sy: e.clientY, x: win.x, y: win.y, w: win.width, h: win.height };
    focusWindow(win.id);
  };

  return (
    <div
      className={`os-window${active ? " is-active" : ""}${win.maximized ? " is-max" : ""}`}
      style={style}
      onPointerDown={() => focusWindow(win.id)}
      role="dialog"
      aria-label={win.title}
    >
      <div className="os-titlebar" onPointerDown={startDrag} onDoubleClick={() => toggleMaximize(win.id)}>
        <span className="os-titlebar-ico">
          <Ico name={win.icon as IconName} size={16} />
        </span>
        <span className="os-titlebar-text">{win.title}</span>
        <div className="os-winbtns">
          <button
            className="os-winbtn"
            aria-label="Minimize"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => minimizeWindow(win.id)}
          >
            <svg viewBox="0 0 12 12">
              <rect x="2" y="7.5" width="8" height="1.6" />
            </svg>
          </button>
          <button
            className="os-winbtn"
            aria-label="Maximize"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => toggleMaximize(win.id)}
          >
            <svg viewBox="0 0 12 12">
              <rect x="2.5" y="2.5" width="7" height="7" fill="none" strokeWidth="1.4" stroke="currentColor" />
            </svg>
          </button>
          <button
            className="os-winbtn os-winbtn-close"
            aria-label="Close"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => closeWindow(win.id)}
          >
            <svg viewBox="0 0 12 12">
              <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.6" fill="none" />
            </svg>
          </button>
        </div>
      </div>
      <div className="os-window-body">{children}</div>
      {!win.maximized && win.resizable && (
        <>
          <span className="os-rz os-rz-n" onPointerDown={startResize("n")} />
          <span className="os-rz os-rz-s" onPointerDown={startResize("s")} />
          <span className="os-rz os-rz-e" onPointerDown={startResize("e")} />
          <span className="os-rz os-rz-w" onPointerDown={startResize("w")} />
          <span className="os-rz os-rz-ne" onPointerDown={startResize("ne")} />
          <span className="os-rz os-rz-nw" onPointerDown={startResize("nw")} />
          <span className="os-rz os-rz-se" onPointerDown={startResize("se")} />
          <span className="os-rz os-rz-sw" onPointerDown={startResize("sw")} />
        </>
      )}
    </div>
  );
}
