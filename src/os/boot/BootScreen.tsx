import { useEffect, useRef, useState } from "react";
import { useOs } from "../store";
import { resumeAudio, sfx } from "@/audio/audio";

const POST_LINES: { text: string; delay: number }[] = [
  { text: "ee663582 COMPUTER SYSTEM", delay: 220 },
  { text: "BIOS v2.06  /  POST", delay: 120 },
  { text: "", delay: 60 },
  { text: "Memory Test ............... OK", delay: 420 },
  { text: "Storage Detection ......... OK", delay: 300 },
  { text: "Keyboard .................. OK", delay: 220 },
  { text: "Display ................... OK", delay: 220 },
  { text: "System Devices ............ OK", delay: 260 },
  { text: "", delay: 120 },
  { text: "Primary Master  : ee663582-DISK  120GB", delay: 200 },
  { text: "Primary Slave   : None", delay: 140 },
  { text: "", delay: 200 },
  { text: "Detecting operating system...", delay: 700 },
  { text: "ee663582.OS", delay: 900 },
];

const BOOT_LINES: { text: string; delay: number }[] = [
  { text: "Starting ee663582.OS...", delay: 900 },
  { text: "", delay: 200 },
  { text: "Loading system files ...", delay: 700 },
  { text: "Loading personal environment ...", delay: 750 },
  { text: "Loading workspace ...", delay: 700 },
  { text: "Loading memories ...", delay: 1100 },
];

export function BootScreen() {
  const { phase, setPhase } = useOs();
  const [lines, setLines] = useState<string[]>([]);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    setLines([]);
    const src = phase === "post" ? POST_LINES : BOOT_LINES;
    let t = phase === "post" ? 500 : 250;
    if (phase === "post") {
      window.setTimeout(() => sfx.biosBeep(), 260);
    }
    src.forEach((l) => {
      t += l.delay;
      timers.current.push(
        window.setTimeout(() => {
          setLines((prev) => [...prev, l.text]);
          if (l.text) sfx.post();
        }, t),
      );
    });
    timers.current.push(
      window.setTimeout(
        () => {
          if (phase === "post") setPhase("boot");
          else {
            sfx.startup();
            setPhase("desktop");
          }
        },
        t + (phase === "post" ? 1100 : 900),
      ),
    );
    const copy = timers.current;
    return () => {
      copy.forEach((id) => window.clearTimeout(id));
      timers.current = [];
    };
  }, [phase, setPhase]);

  return (
    <div className="os-crt fixed inset-0 overflow-hidden bg-black" onPointerDown={() => resumeAudio()}>
      <div className="os-post h-full w-full px-8 py-7">
        {phase === "post" ? (
          <>
            <pre className="whitespace-pre-wrap">
              {lines.map((l, i) => (
                <div key={i} className={l === "ee663582.OS" ? "os-post-em" : undefined}>
                  {l || "\u00A0"}
                </div>
              ))}
            </pre>
            <span className="os-caret" />
            <div className="os-post-foot">
              <span>Press DEL to enter setup</span>
              <span>Press F12 for boot options</span>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center">
            <div className="os-boot-mark">ee663582.OS</div>
            <div className="os-boot-lines">
              {lines.map((l, i) => (
                <div key={i}>{l || "\u00A0"}</div>
              ))}
            </div>
            <div className="os-boot-bar">
              <span />
            </div>
            <div className="os-boot-copy">© 2026 — all of it built by hand</div>
          </div>
        )}
      </div>
    </div>
  );
}
