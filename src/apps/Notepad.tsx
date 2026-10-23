import { useEffect, useRef, useState } from "react";
import { notesStorageKey, useOs } from "@/os/store";
import { sfx } from "@/audio/audio";
import type { WindowState } from "@/os/types";

type SavedNotes = Record<string, string>;

function readNotes(): SavedNotes {
  try {
    return JSON.parse(localStorage.getItem(notesStorageKey) ?? "{}") as SavedNotes;
  } catch {
    return {};
  }
}

function writeNotes(n: SavedNotes) {
  try {
    localStorage.setItem(notesStorageKey, JSON.stringify(n));
  } catch {
    /* storage unavailable */
  }
}

export function Notepad({ win }: { win: WindowState }) {
  const readOnlyBody = win.payload?.["readOnlyBody"] as string | undefined;
  const initialName = (win.payload?.["fileName"] as string | undefined) ?? null;
  const { setWindowTitle, closeWindow } = useOs();

  const [text, setText] = useState(readOnlyBody ?? "");
  const [fileName, setFileName] = useState<string | null>(initialName);
  const [dirty, setDirty] = useState(false);
  const [menu, setMenu] = useState<null | "file" | "open">(null);
  const [confirmClose, setConfirmClose] = useState(false);
  const [saveAs, setSaveAs] = useState<string | null>(null);
  const area = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setWindowTitle(win.id, `${dirty ? "*" : ""}${fileName ?? "Untitled"} - Notepad`);
  }, [dirty, fileName, setWindowTitle, win.id]);

  const readOnly = readOnlyBody !== undefined;

  const doSave = (name: string) => {
    const notes = readNotes();
    notes[name] = text;
    writeNotes(notes);
    setFileName(name);
    setDirty(false);
    setSaveAs(null);
    sfx.click();
  };

  const handleSave = () => {
    setMenu(null);
    if (fileName && !readOnly) doSave(fileName);
    else setSaveAs(fileName ?? "untitled.txt");
  };

  const handleClose = () => {
    if (dirty) {
      sfx.error();
      setConfirmClose(true);
    } else closeWindow(win.id);
  };

  const saved = readNotes();

  return (
    <div className="os-notepad-view">
      <div className="os-menubar">
        <button className={menu === "file" ? "is-open" : ""} onClick={() => setMenu(menu === "file" ? null : "file")}>
          File
        </button>
        <button onClick={() => setMenu(null)}>Edit</button>
        <button onClick={() => setMenu(null)}>Format</button>
        <button onClick={() => setMenu(null)}>Help</button>
        {menu === "file" && (
          <div className="os-menu">
            <button
              onClick={() => {
                setMenu(null);
                if (dirty) {
                  sfx.error();
                  setConfirmClose(true);
                } else {
                  setText("");
                  setFileName(null);
                  setDirty(false);
                }
              }}
            >
              New
            </button>
            <button onClick={() => setMenu("open")}>Open...</button>
            <button onClick={handleSave}>Save</button>
            <button
              onClick={() => {
                setMenu(null);
                setSaveAs(fileName ?? "untitled.txt");
              }}
            >
              Save As...
            </button>
            <hr />
            <button onClick={handleClose}>Exit</button>
          </div>
        )}
        {menu === "open" && (
          <div className="os-menu">
            {Object.keys(saved).length === 0 && <div className="os-menu-empty">No saved notes on this machine.</div>}
            {Object.keys(saved).map((k) => (
              <button
                key={k}
                onClick={() => {
                  setText(saved[k] ?? "");
                  setFileName(k);
                  setDirty(false);
                  setMenu(null);
                }}
              >
                {k}
              </button>
            ))}
          </div>
        )}
      </div>

      {readOnly ? (
        <pre className="os-notepad-text os-readonly">{text}</pre>
      ) : (
        <textarea
          ref={area}
          className="os-notepad-text"
          spellCheck={false}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setDirty(true);
          }}
          aria-label="Notepad document"
        />
      )}

      {saveAs !== null && (
        <div className="os-modal">
          <div className="os-dialog">
            <div className="os-dialog-title">Save As</div>
            <div className="os-dialog-body">
              <label htmlFor="np-name">File name:</label>
              <input id="np-name" value={saveAs} onChange={(e) => setSaveAs(e.target.value)} autoFocus />
              <p className="os-dim">Saved to this computer only. Unsaved notes are lost when the window closes.</p>
            </div>
            <div className="os-dialog-foot">
              <button onClick={() => saveAs.trim() && doSave(saveAs.trim())}>Save</button>
              <button onClick={() => setSaveAs(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {confirmClose && (
        <div className="os-modal">
          <div className="os-dialog">
            <div className="os-dialog-title">Notepad</div>
            <div className="os-dialog-body">
              <p>Do you want to save changes to {fileName ?? "Untitled"}?</p>
            </div>
            <div className="os-dialog-foot">
              <button
                onClick={() => {
                  setConfirmClose(false);
                  handleSave();
                }}
              >
                Save
              </button>
              <button onClick={() => closeWindow(win.id)}>Don&apos;t Save</button>
              <button onClick={() => setConfirmClose(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="os-statusbar">
        <span>{fileName ?? "Untitled"}</span>
        <span>
          {text.length} chars{dirty ? " · unsaved" : ""}
        </span>
      </div>
    </div>
  );
}
