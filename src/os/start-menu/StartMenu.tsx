import { useState } from "react";
import { useOs } from "../store";
import { Ico, type IconName } from "../icons";
import type { WindowSpec } from "../types";
import { sfx } from "@/audio/audio";

interface Entry {
  label: string;
  icon: IconName;
  spec: WindowSpec;
}

const LEFT: Entry[] = [
  { label: "About ee663582", icon: "user", spec: { appId: "about", title: "About ee663582", icon: "user", key: "about", width: 620, height: 500 } },
  { label: "Work", icon: "folder", spec: { appId: "explorer", title: "Work", icon: "folder", key: "fs-work", width: 700, height: 440, payload: { nodeId: "work" } } },
  { label: "Archive", icon: "archive", spec: { appId: "explorer", title: "Archive", icon: "archive", key: "fs-archive", width: 700, height: 440, payload: { nodeId: "archive" } } },
  { label: "Resume", icon: "text", spec: { appId: "resume", title: "Resume.txt - Notepad", icon: "text", key: "resume", width: 620, height: 520 } },
  { label: "Notepad", icon: "notepad", spec: { appId: "notepad", title: "Untitled - Notepad", icon: "notepad", width: 560, height: 420 } },
  { label: "Games", icon: "games", spec: { appId: "games", title: "Games", icon: "games", key: "games", width: 520, height: 320 } },
  { label: "Settings", icon: "settings", spec: { appId: "settings", title: "Settings", icon: "settings", key: "settings", width: 560, height: 430 } },
];

const RIGHT: Entry[] = [
  { label: "Computer", icon: "computer", spec: { appId: "computer", title: "Computer", icon: "computer", key: "computer", width: 720, height: 460 } },
  { label: "Documents", icon: "folder", spec: { appId: "explorer", title: "Documents", icon: "folder", key: "fs-documents", width: 700, height: 440, payload: { nodeId: "documents" } } },
  { label: "Pictures", icon: "folder", spec: { appId: "explorer", title: "Pictures", icon: "folder", key: "fs-pictures", width: 700, height: 440, payload: { nodeId: "pictures" } } },
];

const SEARCHABLE = [...LEFT, ...RIGHT];

export function StartMenu({ close }: { close: () => void }) {
  const os = useOs();
  const [q, setQ] = useState("");
  const results = q.trim()
    ? SEARCHABLE.filter((e) => e.label.toLowerCase().includes(q.trim().toLowerCase()))
    : null;

  const launch = (e: Entry) => {
    sfx.click();
    os.openWindow(e.spec);
    close();
  };

  return (
    <div className="os-startmenu">
      <div className="os-sm-user">
        <div className="os-sm-avatar">A</div>
        <span>ee663582</span>
      </div>
      <div className="os-sm-cols">
        <div className="os-sm-left">
          {(results ?? LEFT).map((e) => (
            <button key={e.label} onClick={() => launch(e)}>
              <Ico name={e.icon} size={22} />
              <span>{e.label}</span>
            </button>
          ))}
          {results?.length === 0 && <div className="os-menu-empty">No results.</div>}
        </div>
        <div className="os-sm-right">
          {RIGHT.map((e) => (
            <button key={e.label} onClick={() => launch(e)}>
              {e.label}
            </button>
          ))}
          <hr />
          <button
            onClick={() => {
              sfx.click();
              os.openWindow({
                appId: "explorer",
                title: "ee663582",
                icon: "folder",
                key: "fs-ee663582",
                width: 700,
                height: 440,
                payload: { nodeId: "ee663582" },
              });
              close();
            }}
          >
            ee663582
          </button>
          <button
            onClick={() => {
              sfx.click();
              os.openWindow({ appId: "recyclebin", title: "Recycle Bin", icon: "recycle", key: "bin", width: 560, height: 360 });
              close();
            }}
          >
            Recycle Bin
          </button>
        </div>
      </div>
      <div className="os-sm-search">
        <Ico name="search" size={16} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search programs and files"
          aria-label="Search"
        />
      </div>
      <div className="os-sm-power">
        <button
          onClick={() => {
            close();
            os.shutdown();
          }}
        >
          <Ico name="power" size={16} /> Shut Down
        </button>
        <button
          onClick={() => {
            close();
            os.restart();
          }}
        >
          <Ico name="restart" size={16} /> Restart
        </button>
      </div>
    </div>
  );
}
