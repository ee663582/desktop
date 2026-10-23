import { useEffect, useRef, useState } from "react";
import { Puzzle } from "@/games/Puzzle";

function useDraggable(startX: number, startY: number) {
  const [pos, setPos] = useState({ x: startX, y: startY });
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!drag.current) return;
      setPos({
        x: Math.max(0, Math.min(window.innerWidth - 180, e.clientX - drag.current.dx)),
        y: Math.max(0, Math.min(window.innerHeight - 200, e.clientY - drag.current.dy)),
      });
    };
    const up = () => (drag.current = null);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, []);
  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y };
  };
  return { pos, onPointerDown };
}

export function Gadgets() {
  return (
    <>
      <SystemMeter />
      <PuzzleGadget />
    </>
  );
}

function SystemMeter() {
  const { pos, onPointerDown } = useDraggable(
    typeof window !== "undefined" ? window.innerWidth - 200 : 900,
    28,
  );
  const [cpu, setCpu] = useState(12);
  const [mem, setMem] = useState(38);
  const frame = useRef({ last: performance.now(), count: 0, fps: 60 });

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const f = frame.current;
      f.count++;
      const now = performance.now();
      if (now - f.last > 900) {
        f.fps = (f.count * 1000) / (now - f.last);
        f.count = 0;
        f.last = now;
        const load = Math.max(3, Math.min(99, Math.round(100 - (f.fps / 60) * 78 + Math.random() * 8)));
        setCpu(load);
        const anyPerf = performance as Performance & { memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number } };
        if (anyPerf.memory) {
          setMem(Math.round((anyPerf.memory.usedJSHeapSize / anyPerf.memory.jsHeapSizeLimit) * 100));
        } else setMem((m) => Math.max(20, Math.min(85, m + (Math.random() - 0.5) * 6)));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="os-gadget" style={{ left: pos.x, top: pos.y }} onPointerDown={onPointerDown}>
      <div className="os-gadget-title">System Meter</div>
      <div className="os-gauges">
        <Gauge label="CPU" value={cpu} />
        <Gauge label="MEM" value={Math.round(mem)} />
      </div>
      <div className="os-gadget-foot">ee663582-DISK · C:</div>
    </div>
  );
}

function Gauge({ label, value }: { label: string; value: number }) {
  const angle = -120 + (value / 100) * 240;
  return (
    <div className="os-gauge">
      <svg viewBox="0 0 60 60">
        <circle cx="30" cy="30" r="26" className="os-gauge-face" />
        <path d="M11 47A26 26 0 1149 47" className="os-gauge-arc" />
        <line x1="30" y1="30" x2="30" y2="10" className="os-gauge-needle" transform={`rotate(${angle} 30 30)`} />
        <circle cx="30" cy="30" r="3" className="os-gauge-hub" />
      </svg>
      <span>
        {label} {value}%
      </span>
    </div>
  );
}

function PuzzleGadget() {
  const { pos, onPointerDown } = useDraggable(
    typeof window !== "undefined" ? window.innerWidth - 200 : 900,
    200,
  );
  return (
    <div className="os-gadget" style={{ left: pos.x, top: pos.y }}>
      <div className="os-gadget-title" onPointerDown={onPointerDown}>
        Puzzle
      </div>
      <Puzzle compact />
    </div>
  );
}
