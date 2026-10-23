import { useEffect, useRef, useState } from "react";
import { sfx, tone } from "@/audio/audio";

const W = 520;
const H = 360;
const GRAV = 0.018;
const THRUST = 0.045;

export function LunarLander() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"ready" | "flying" | "landed" | "crashed">("ready");
  const [fuel, setFuel] = useState(100);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const keys: Record<string, boolean> = {};
    const down = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
      keys[e.key] = true;
      if (stateRef.current !== "flying" && (e.key === " " || e.key === "Enter")) reset();
    };
    const up = (e: KeyboardEvent) => (keys[e.key] = false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    // terrain with one flat pad
    const padX = 180 + Math.random() * 200;
    const padW = 66;
    const ground: number[] = [];
    let y = H - 60;
    for (let x = 0; x <= W; x += 10) {
      if (x > padX - padW / 2 && x < padX + padW / 2) ground.push(H - 70);
      else {
        y += (Math.random() - 0.5) * 22;
        y = Math.max(H - 140, Math.min(H - 30, y));
        ground.push(y);
      }
    }
    const groundAt = (x: number) => ground[Math.max(0, Math.min(ground.length - 1, Math.round(x / 10)))] ?? H - 60;

    const ship = { x: 60, y: 40, vx: 0.6, vy: 0, a: 0, fuel: 100 };
    function reset() {
      ship.x = 60;
      ship.y = 40;
      ship.vx = 0.6;
      ship.vy = 0;
      ship.a = 0;
      ship.fuel = 100;
      setFuel(100);
      setState("flying");
    }

    let raf = 0;
    let thrustTick = 0;
    const loop = () => {
      const s = stateRef.current;
      if (s === "flying") {
        if (keys["ArrowLeft"]) ship.a -= 0.04;
        if (keys["ArrowRight"]) ship.a += 0.04;
        const thrusting = (keys["ArrowUp"] || keys[" "]) && ship.fuel > 0;
        if (thrusting) {
          ship.vx += Math.sin(ship.a) * THRUST;
          ship.vy -= Math.cos(ship.a) * THRUST;
          ship.fuel = Math.max(0, ship.fuel - 0.28);
          if (++thrustTick % 6 === 0) {
            tone({ freq: 90 + Math.random() * 30, dur: 0.06, type: "sawtooth", gain: 0.03 });
            setFuel(Math.round(ship.fuel));
          }
        }
        ship.vy += GRAV;
        ship.x += ship.vx;
        ship.y += ship.vy;
        if (ship.x < 0) ship.x = W;
        if (ship.x > W) ship.x = 0;

        const g = groundAt(ship.x);
        if (ship.y + 10 >= g) {
          const onPad = Math.abs(ship.x - padX) < padW / 2 - 6;
          const gentle = ship.vy < 0.9 && Math.abs(ship.vx) < 0.45 && Math.abs(ship.a) < 0.25;
          ship.y = g - 10;
          if (onPad && gentle) {
            setState("landed");
            tone({ freq: 660, dur: 0.3, type: "sine", gain: 0.08 });
            tone({ freq: 990, dur: 0.4, type: "sine", gain: 0.06, delay: 0.2 });
          } else {
            setState("crashed");
            sfx.error();
          }
        }
      }

      ctx.fillStyle = "#05070c";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#1a2433";
      for (let i = 0; i < 40; i++) {
        ctx.fillRect((i * 97) % W, (i * 53) % (H - 120), 1, 1);
      }
      // ground
      ctx.strokeStyle = "#9fb6c9";
      ctx.beginPath();
      ground.forEach((gy, i) => (i === 0 ? ctx.moveTo(0, gy) : ctx.lineTo(i * 10, gy)));
      ctx.stroke();
      ctx.strokeStyle = "#6fe08a";
      ctx.beginPath();
      ctx.moveTo(padX - padW / 2, H - 70);
      ctx.lineTo(padX + padW / 2, H - 70);
      ctx.stroke();

      // ship
      ctx.save();
      ctx.translate(ship.x, ship.y);
      ctx.rotate(ship.a);
      ctx.strokeStyle = stateRef.current === "crashed" ? "#e06a5a" : "#dfe9f2";
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.lineTo(7, 8);
      ctx.lineTo(-7, 8);
      ctx.closePath();
      ctx.stroke();
      if ((keys["ArrowUp"] || keys[" "]) && stateRef.current === "flying" && ship.fuel > 0) {
        ctx.strokeStyle = "#ffbe5a";
        ctx.beginPath();
        ctx.moveTo(-3, 9);
        ctx.lineTo(0, 15 + Math.random() * 6);
        ctx.lineTo(3, 9);
        ctx.stroke();
      }
      ctx.restore();

      ctx.fillStyle = "#8fa8bd";
      ctx.font = "10px monospace";
      ctx.fillText(`VELOCITY  ${(ship.vy * 40).toFixed(0)}`, 10, 16);
      ctx.fillText(`DRIFT     ${(ship.vx * 40).toFixed(0)}`, 10, 30);
      ctx.fillText(`FUEL      ${ship.fuel.toFixed(0)}`, 10, 44);
      raf = requestAnimationFrame(loop);
    };
    loop();

    (cv as HTMLCanvasElement & { __reset?: () => void }).__reset = reset;

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  const start = () => {
    const cv = ref.current as (HTMLCanvasElement & { __reset?: () => void }) | null;
    cv?.__reset?.();
  };

  return (
    <div className="os-pane os-lander">
      <canvas ref={ref} width={W} height={H} className="os-lander-canvas" />
      <div className="os-lander-hud">
        <span>
          {state === "ready" && "Arrow keys to rotate, Up to burn. Land on the green pad, slowly."}
          {state === "flying" && `fuel ${fuel}`}
          {state === "landed" && "Contact. Nothing broke."}
          {state === "crashed" && "That was not landing. That was arriving."}
        </span>
        <button className="os-linkbtn" onClick={start}>
          {state === "ready" ? "Start" : "Try again"}
        </button>
      </div>
    </div>
  );
}
