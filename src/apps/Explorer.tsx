import { useMemo, useState } from "react";
import { fileSystem, findNode, pathOf, type FsNode } from "@/data/filesystem";
import { Ico } from "@/os/icons";
import { useOs } from "@/os/store";
import { sfx } from "@/audio/audio";
import type { WindowState } from "@/os/types";

export function Explorer({ win }: { win: WindowState }) {
  const startId = (win.payload?.["nodeId"] as string | undefined) ?? "computer";
  const [currentId, setCurrentId] = useState(startId);
  const [selected, setSelected] = useState<string | null>(null);
  const { openWindow } = useOs();

  const node = findNode(currentId) ?? fileSystem;
  const trail = useMemo(() => pathOf(currentId) ?? [fileSystem], [currentId]);
  const children = node.children ?? [];

  const go = (id: string) => {
    sfx.click();
    setSelected(null);
    setCurrentId(id);
  };

  const openNode = (n: FsNode) => {
    if (n.kind === "folder") return go(n.id);
    if (n.kind === "project") {
      openWindow({
        appId: "project",
        title: n.name,
        icon: n.icon,
        key: `project-${n.projectId}`,
        width: 640,
        height: 520,
        payload: { projectId: n.projectId },
      });
      return;
    }
    if (n.kind === "app") {
      const map: Record<string, { appId: WindowState["appId"]; title: string; icon: string; w: number; h: number; key?: string }> = {
        about: { appId: "about", title: "About ee663582", icon: "user", w: 620, h: 500, key: "about" },
        resume: { appId: "resume", title: "Resume.txt - Notepad", icon: "text", w: 620, h: 520, key: "resume" },
        notepad: { appId: "notepad", title: "Untitled - Notepad", icon: "notepad", w: 560, h: 420 },
        settings: { appId: "settings", title: "Settings", icon: "settings", w: 560, h: 430, key: "settings" },
        music: { appId: "music", title: "Player", icon: "music", w: 420, h: 300, key: "music" },
        games: { appId: "games", title: "Games", icon: "games", w: 520, h: 320, key: "games" },
      };
      const m = map[n.app ?? ""];
      if (m)
        openWindow({
          appId: m.appId,
          title: m.title,
          icon: m.icon,
          width: m.w,
          height: m.h,
          ...(m.key ? { key: m.key } : {}),
        });
      return;
    }
    openWindow({
      appId: "notepad",
      title: `${n.name} - Notepad`,
      icon: "text",
      key: `txt-${n.id}`,
      width: 560,
      height: 420,
      payload: { readOnlyBody: n.body ?? "", fileName: n.name },
    });
  };

  const up = trail.length > 1 ? (trail[trail.length - 2]?.id ?? null) : null;

  return (
    <div className="os-explorer">
      <div className="os-exp-bar">
        <button className="os-navbtn" disabled={!up} onClick={() => up && go(up)} aria-label="Up one level">
          ◀
        </button>
        <div className="os-crumbs">
          {trail.map((t, i) => (
            <span key={t.id}>
              <button onClick={() => go(t.id)}>{t.name}</button>
              {i < trail.length - 1 && <span className="os-crumb-sep">▸</span>}
            </span>
          ))}
        </div>
      </div>
      <div className="os-exp-main">
        <aside className="os-exp-side">
          <div className="os-exp-sidehead">Favourites</div>
          <button onClick={() => go("ee663582")}>
            <Ico name="folder" size={16} /> ee663582
          </button>
          <button onClick={() => go("work")}>
            <Ico name="folder" size={16} /> Work
          </button>
          <button onClick={() => go("archive")}>
            <Ico name="archive" size={16} /> Archive
          </button>
          <button onClick={() => go("documents")}>
            <Ico name="folder" size={16} /> Documents
          </button>
          <button onClick={() => go("pictures")}>
            <Ico name="folder" size={16} /> Pictures
          </button>
          <div className="os-exp-sidehead">Computer</div>
          <button onClick={() => go("c")}>
            <Ico name="drive" size={16} /> Local Disk (C:)
          </button>
        </aside>
        <div className="os-exp-files" onClick={() => setSelected(null)}>
          {children.length === 0 && <div className="os-exp-empty">This folder is empty.</div>}
          {children.map((c) => (
            <button
              key={c.id}
              className={`os-file${selected === c.id ? " is-sel" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setSelected(c.id);
              }}
              onDoubleClick={() => openNode(c)}
            >
              <Ico name={c.icon} size={36} />
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="os-statusbar">
        <span>{children.length} item(s)</span>
        <span>{selected ? findNode(selected)?.size ?? "" : node.name}</span>
      </div>
    </div>
  );
}

export function RecycleBin() {
  return (
    <div className="os-explorer">
      <div className="os-exp-bar">
        <div className="os-crumbs">
          <button>Recycle Bin</button>
        </div>
      </div>
      <div className="os-exp-files os-bin">
        <div className="os-exp-empty">
          <p>The Recycle Bin is empty.</p>
          <p className="os-dim">
            (I emptied it in 2019 and have been slightly nervous about this folder ever since.)
          </p>
        </div>
      </div>
      <div className="os-statusbar">
        <span>0 item(s)</span>
        <span>0 bytes</span>
      </div>
    </div>
  );
}
