import { useEffect, useState } from "react";
import { OsProvider, useOs } from "./store";
import { BootScreen } from "./boot/BootScreen";
import { Desktop } from "./desktop/Desktop";
import { PoweredOff, ShuttingDown } from "./shutdown/ShutdownScreen";
import { resumeAudio, sfx } from "@/audio/audio";
import { MobileOs } from "@/components/MobileOs";

export function Ee663582OS() {
  const [mounted, setMounted] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setMobile(window.innerWidth < 860 || window.matchMedia("(pointer: coarse)").matches);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!mounted) return <div className="fixed inset-0 bg-black" />;
  if (mobile) return <MobileOs />;

  return (
    <OsProvider>
      <Session />
    </OsProvider>
  );
}

function Session() {
  const os = useOs();

  /* system click sound + cursor/theme application */
  useEffect(() => {
    const click = () => {
      resumeAudio();
      sfx.click();
    };
    window.addEventListener("pointerdown", click);
    return () => window.removeEventListener("pointerdown", click);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset["cursor"] = os.cursor;
    root.dataset["theme"] = os.theme;
    root.dataset["soft"] = os.softness ? "on" : "off";
  }, [os.cursor, os.theme, os.softness]);

  /* try to start ambient audio as soon as the browser allows it */
  useEffect(() => {
    if (os.phase !== "desktop") return;
    const t = window.setTimeout(() => {
      resumeAudio();
    }, 200);
    return () => window.clearTimeout(t);
  }, [os.phase]);

  switch (os.phase) {
    case "post":
    case "boot":
      return <BootScreen />;
    case "shutting-down":
      return <ShuttingDown restarting={false} />;
    case "restarting":
      return <ShuttingDown restarting />;
    case "off":
      return <PoweredOff />;
    default:
      return (
        <div className="os-root">
          <Desktop />
        </div>
      );
  }
}
