import { useState } from "react";
import { wallpapers } from "@/data/wallpapers";
import { useOs, type CursorStyle, type ThemeStyle } from "@/os/store";
import { sfx } from "@/audio/audio";

const TABS = ["Wallpaper", "Appearance", "Sound", "Cursor"] as const;
type Tab = (typeof TABS)[number];

export function Settings() {
  const os = useOs();
  const [tab, setTab] = useState<Tab>("Wallpaper");

  return (
    <div className="os-settings">
      <div className="os-tabs">
        {TABS.map((t) => (
          <button
            key={t}
            className={tab === t ? "is-active" : ""}
            onClick={() => {
              sfx.click();
              setTab(t);
            }}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="os-pane os-settings-body">
        {tab === "Wallpaper" && (
          <>
            <h2>Desktop Background</h2>
            <div className="os-wall-grid">
              {wallpapers.map((w) => (
                <button
                  key={w.id}
                  className={`os-wall${os.wallpaper === w.id ? " is-sel" : ""}`}
                  onClick={() => {
                    sfx.click();
                    os.setWallpaper(w.id);
                  }}
                >
                  <img src={w.src} alt={w.name} loading="lazy" width={1920} height={1200} />
                  <span>{w.name}</span>
                </button>
              ))}
            </div>
            <p className="os-dim">{wallpapers.find((w) => w.id === os.wallpaper)?.note}</p>
          </>
        )}

        {tab === "Appearance" && (
          <>
            <h2>Desktop Appearance</h2>
            <div className="os-field">
              <span>Window colour</span>
              <div className="os-seg">
                {(["aero", "graphite", "highcontrast"] as ThemeStyle[]).map((t) => (
                  <button key={t} className={os.theme === t ? "is-active" : ""} onClick={() => os.setTheme(t)}>
                    {t === "aero" ? "Aero Glass" : t === "graphite" ? "Graphite" : "High Contrast"}
                  </button>
                ))}
              </div>
            </div>
            <label className="os-check">
              <input type="checkbox" checked={os.softness} onChange={(e) => os.setSoftness(e.target.checked)} />
              Display softness (simulates an older panel)
            </label>
          </>
        )}

        {tab === "Sound" && (
          <>
            <h2>Volume &amp; Music</h2>
            <div className="os-field">
              <span>System volume</span>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(os.volume * 100)}
                onChange={(e) => os.setVolume(Number(e.target.value) / 100)}
              />
              <output>{Math.round(os.volume * 100)}</output>
            </div>
            <label className="os-check">
              <input type="checkbox" checked={os.muted} onChange={(e) => os.setMuted(e.target.checked)} />
              Mute all system sound
            </label>
            <label className="os-check">
              <input
                type="checkbox"
                checked={os.musicPlaying}
                onChange={(e) => os.setMusicPlaying(e.target.checked)}
              />
              Background music
            </label>
          </>
        )}

        {tab === "Cursor" && (
          <>
            <h2>Pointer Style</h2>
            <div className="os-seg os-seg-col">
              {(["aero", "classic", "inverted"] as CursorStyle[]).map((c) => (
                <button key={c} className={os.cursor === c ? "is-active" : ""} onClick={() => os.setCursor(c)}>
                  {c === "aero" ? "Aero (default)" : c === "classic" ? "Classic white" : "Inverted black"}
                </button>
              ))}
            </div>
            <p className="os-dim">Move the pointer over the desktop to see the change.</p>
          </>
        )}
      </div>
    </div>
  );
}
