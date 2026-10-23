import { useEffect, useRef } from "react";
import { useOs } from "@/os/store";
import { sfx } from "@/audio/audio";

const TRACK = {
  title: "under (loop)",
  artist: "A.",
  album: "things recorded from a bedroom",
};

export function MusicPlayer() {
  const os = useOs();
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let t = 0;
    const draw = () => {
      t += os.musicPlaying && !os.muted ? 0.05 : 0.008;
      const { width: w, height: h } = c;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "#7fd0ff";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const amp = os.musicPlaying && !os.muted ? 10 * os.volume + 4 : 1.5;
        const y = h / 2 + Math.sin(x * 0.06 + t) * amp * Math.sin(x * 0.011 + t * 0.6);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [os.musicPlaying, os.muted, os.volume]);

  return (
    <div className="os-player">
      <div className="os-player-screen">
        <canvas ref={canvas} width={360} height={56} />
        <div className="os-player-track">
          <strong>{TRACK.title}</strong>
          <span>
            {TRACK.artist} — {TRACK.album}
          </span>
          <span className="os-dim">{os.musicPlaying ? (os.muted ? "muted" : "playing") : "stopped"}</span>
        </div>
      </div>
      <div className="os-player-controls">
        <button
          onClick={() => {
            sfx.click();
            os.setMusicPlaying(true);
          }}
          aria-label="Play"
        >
          ▶
        </button>
        <button
          onClick={() => {
            sfx.click();
            os.setMusicPlaying(false);
          }}
          aria-label="Pause"
        >
          ❚❚
        </button>
        <button
          onClick={() => {
            sfx.click();
            os.setMusicPlaying(false);
          }}
          aria-label="Stop"
        >
          ■
        </button>
        <button
          className={os.muted ? "is-on" : ""}
          onClick={() => {
            os.setMuted(!os.muted);
          }}
          aria-label="Mute"
        >
          {os.muted ? "🔇" : "🔊"}
        </button>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(os.volume * 100)}
          onChange={(e) => os.setVolume(Number(e.target.value) / 100)}
          aria-label="Volume"
        />
      </div>
      <div className="os-statusbar">
        <span>Player controls all system sound</span>
        <span>{Math.round(os.volume * 100)}%</span>
      </div>
    </div>
  );
}
