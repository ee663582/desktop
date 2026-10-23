import { useEffect, useRef, useState } from "react";
import { TASKBAR_H, useOs } from "../store";
import { Ico, type IconName } from "../icons";
import { wallpapers } from "@/data/wallpapers";
import { Win } from "../window-manager/Window";
import { AppSurface } from "../apps";
import { Gadgets } from "./Gadgets";
import { Taskbar } from "../taskbar/Taskbar";
import { sfx } from "@/audio/audio";

export function Desktop() {
  const os = useOs();
  const [selected, setSelected] = useState<string | null>(null);
  const wall = wallpapers.find((w) => w.id === os.wallpaper) ?? wallpapers[0]!;

  return (
    <div className="os-desktop" style={{ backgroundImage: `url(${wall.src})` }}>
      <div
        className="os-iconfield"
        style={{ bottom: TASKBAR_H }}
        onPointerDown={() => setSelected(null)}
      >
        {os.icons.map((icon) => (
          <DesktopIcon
            key={icon.id}
            id={icon.id}
            label={icon.label}
            icon={icon.icon as IconName}
            x={icon.x}
            y={icon.y}
            selected={selected === icon.id}
            onSelect={() => setSelected(icon.id)}
            onOpen={() => os.openWindow(icon.open)}
            onMove={(x, y) => os.moveIcon(icon.id, x, y)}
          />
        ))}
      </div>

      <Gadgets />

      {os.windows.map((w) => (
        <Win key={w.id} win={w}>
          <AppSurface win={w} />
        </Win>
      ))}

      <Taskbar />
    </div>
  );
}

function DesktopIcon({
  label,
  icon,
  x,
  y,
  selected,
  onSelect,
  onOpen,
  onMove,
}: {
  id: string;
  label: string;
  icon: IconName;
  x: number;
  y: number;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
  onMove: (x: number, y: number) => void;
}) {
  const drag = useRef<{ dx: number; dy: number; moved: boolean } | null>(null);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!drag.current) return;
      drag.current.moved = true;
      onMove(
        Math.max(0, Math.min(window.innerWidth - 90, e.clientX - drag.current.dx)),
        Math.max(0, Math.min(window.innerHeight - TASKBAR_H - 90, e.clientY - drag.current.dy)),
      );
    };
    const up = () => (drag.current = null);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [onMove]);

  return (
    <button
      className={`os-desktop-icon${selected ? " is-sel" : ""}`}
      style={{ left: x, top: y }}
      onPointerDown={(e) => {
        e.stopPropagation();
        onSelect();
        drag.current = { dx: e.clientX - x, dy: e.clientY - y, moved: false };
      }}
      onDoubleClick={() => {
        sfx.click();
        onOpen();
      }}
    >
      <Ico name={icon} size={38} />
      <span>{label}</span>
    </button>
  );
}
