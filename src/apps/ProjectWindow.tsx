import { projects } from "@/data/projects";
import type { WindowState } from "@/os/types";

export function ProjectWindow({ win }: { win: WindowState }) {
  const id = win.payload?.["projectId"] as string;
  const p = projects.find((x) => x.id === id);
  if (!p) return <div className="os-pane">File not found.</div>;

  return (
    <div className="os-pane os-project">
      <div className="os-project-head">
        <h1>{p.name}</h1>
        <div className="os-project-meta">
          <span>{p.type}</span>
          <span>·</span>
          <span>{p.year}</span>
          <span>·</span>
          <span>{p.category === "featured" ? "Featured" : "Archive"}</span>
        </div>
      </div>

      <div className="os-project-preview" aria-hidden="true">
        <div className="os-preview-grid" />
        <span>{p.file}</span>
      </div>

      <p className="os-project-desc">{p.description}</p>

      <h2>What I built</h2>
      <ul>
        {p.built.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>

      <h2>Tools</h2>
      <div className="os-chips">
        {p.technologies.map((t) => (
          <span key={t} className="os-chip">
            {t}
          </span>
        ))}
      </div>

      {p.note && <p className="os-project-note">{p.note}</p>}

      {p.url && (
        <p>
          <a href={p.url} target="_blank" rel="noreferrer">
            Open link
          </a>
        </p>
      )}
    </div>
  );
}
