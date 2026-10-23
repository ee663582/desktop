import { useOs } from "../store";

export function ShuttingDown({ restarting }: { restarting: boolean }) {
  return (
    <div className="os-crt fixed inset-0 grid place-items-center bg-[#0a1420]">
      <div className="os-shutdown">
        <div className="os-spinner" />
        <p>{restarting ? "Restarting..." : "Shutting down..."}</p>
        <p className="os-dim">Saving nothing in particular</p>
      </div>
    </div>
  );
}

export function PoweredOff() {
  const { powerOn } = useOs();
  return (
    <div className="os-off fixed inset-0 grid place-items-center bg-black">
      <div className="os-off-inner">
        <p className="os-off-hint">It&apos;s now safe to turn off your computer.</p>
        <button className="os-power-btn" onClick={powerOn} aria-label="Power on">
          <span />
        </button>
        <p className="os-dim">press to start ee663582.OS</p>
      </div>
    </div>
  );
}
