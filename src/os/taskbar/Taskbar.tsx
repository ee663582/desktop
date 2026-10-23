import { useEffect, useState } from "react";
import { useOs } from "../store";
import { Ico, type IconName } from "../icons";
import { StartMenu } from "../start-menu/StartMenu";
import { sfx } from "@/audio/audio";

export function Taskbar() {
  const os = useOs();
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000 * 15);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (!el.closest(".os-startmenu") && !el.closest(".os-startbtn")) setOpen(false);
    };
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, []);

  return (
    <>
      {open && <StartMenu close={() => setOpen(false)} />}
      <div className="os-taskbar">
        <button
          className={`os-startbtn${open ? " is-open" : ""}`}
          onClick={() => {
            sfx.click();
            setOpen((o) => !o);
          }}
          aria-label="Start"
        >
          <span className="os-orb" />
        </button>

        <div className="os-tasks">
          {os.windows.map((w) => (
            <button
              key={w.id}
              className={`os-task${os.focusedId === w.id && !w.minimized ? " is-active" : ""}${w.minimized ? " is-min" : ""}`}
              onClick={() => os.toggleFromTaskbar(w.id)}
              title={w.title}
            >
              <Ico name={w.icon as IconName} size={16} />
              <span>{w.title}</span>
            </button>
          ))}
        </div>

        <div className="os-tray">
          <button
            className="os-tray-btn"
            onClick={() => os.setMuted(!os.muted)}
            aria-label={os.muted ? "Unmute" : "Mute"}
            title={os.muted ? "Muted" : `Volume ${Math.round(os.volume * 100)}%`}
          >
            {os.muted ? "🔇" : "🔊"}
          </button>
          <button
            className="os-tray-btn"
            onClick={() =>
              os.openWindow({ appId: "music", title: "Player", icon: "music", key: "music", width: 420, height: 300 })
            }
            aria-label="Player"
          >
            ♪
          </button>
          <div className="os-clock">
            <span>{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            <span>{now.toLocaleDateString()}</span>
          </div>
          <button className="os-showdesktop" aria-label="Show desktop" onClick={() => sfx.click()} />
        </div>
      </div>
    </>
  );
}
