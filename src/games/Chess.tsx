import { useCallback, useMemo, useState } from "react";
import { sfx } from "@/audio/audio";

/** Minimal chess: full piece movement, no castling / en passant / promotion choice. */
type Piece = string; // "wp","bk" etc, "" = empty
type Board = Piece[];

const START: Board = [
  "br", "bn", "bb", "bq", "bk", "bb", "bn", "br",
  "bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp",
  ...Array(32).fill(""),
  "wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp",
  "wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr",
];

const GLYPH: Record<string, string> = {
  wk: "♔", wq: "♕", wr: "♖", wb: "♗", wn: "♘", wp: "♙",
  bk: "♚", bq: "♛", br: "♜", bb: "♝", bn: "♞", bp: "♟",
};

const inside = (r: number, c: number) => r >= 0 && r < 8 && c >= 0 && c < 8;

function moves(board: Board, i: number): number[] {
  const p = board[i] ?? "";
  if (!p) return [];
  const side = p[0];
  const type = p[1];
  const r = Math.floor(i / 8);
  const c = i % 8;
  const out: number[] = [];
  const push = (rr: number, cc: number) => {
    if (!inside(rr, cc)) return false;
    const t = board[rr * 8 + cc] ?? "";
    if (t && t[0] === side) return false;
    out.push(rr * 8 + cc);
    return !t;
  };
  const ray = (dr: number, dc: number) => {
    let rr = r + dr;
    let cc = c + dc;
    while (inside(rr, cc) && push(rr, cc)) {
      rr += dr;
      cc += dc;
    }
  };

  if (type === "p") {
    const dir = side === "w" ? -1 : 1;
    if (inside(r + dir, c) && !board[(r + dir) * 8 + c]) {
      out.push((r + dir) * 8 + c);
      const home = side === "w" ? 6 : 1;
      if (r === home && !board[(r + 2 * dir) * 8 + c]) out.push((r + 2 * dir) * 8 + c);
    }
    for (const dc of [-1, 1]) {
      const rr = r + dir;
      const cc = c + dc;
      if (inside(rr, cc)) {
        const t = board[rr * 8 + cc] ?? "";
        if (t && t[0] !== side) out.push(rr * 8 + cc);
      }
    }
  } else if (type === "n") {
    const jumps: [number, number][] = [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]];
    jumps.forEach(([dr, dc]) => push(r + dr, c + dc));
  } else if (type === "k") {
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) if (dr || dc) push(r + dr, c + dc);
  } else {
    const straight: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    const diag: [number, number][] = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
    if (type === "r" || type === "q") straight.forEach(([a, b]) => ray(a, b));
    if (type === "b" || type === "q") diag.forEach(([a, b]) => ray(a, b));
  }
  return out;
}

const VALUE: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 100 };

export function Chess() {
  const [board, setBoard] = useState<Board>(START);
  const [sel, setSel] = useState<number | null>(null);
  const [turn, setTurn] = useState<"w" | "b">("w");
  const [status, setStatus] = useState("White to move");

  const legal = useMemo(() => (sel === null ? [] : moves(board, sel)), [board, sel]);

  const blackReply = useCallback((b: Board) => {
    const candidates: { from: number; to: number; score: number }[] = [];
    b.forEach((p, i) => {
      if (p && p[0] === "b") {
        moves(b, i).forEach((to) => {
          const target = b[to] ?? "";
          candidates.push({
            from: i,
            to,
            score: (target ? (VALUE[target[1] ?? "p"] ?? 1) * 10 : 0) + Math.random() * 2 + (Math.floor(to / 8) > Math.floor(i / 8) ? 0.5 : 0),
          });
        });
      }
    });
    if (!candidates.length) {
      setStatus("Black cannot move. Game over.");
      return;
    }
    candidates.sort((x, y) => y.score - x.score);
    const m = candidates[0]!;
    const nb = [...b];
    const captured = nb[m.to] ?? "";
    nb[m.to] = nb[m.from] ?? "";
    nb[m.from] = "";
    if (nb[m.to] === "bp" && m.to >= 56) nb[m.to] = "bq";
    setBoard(nb);
    setTurn("w");
    setStatus(
      captured ? `Black takes your ${(captured[1] ?? "").toUpperCase()}. White to move.` : "White to move",
    );
    sfx.click();
  }, []);

  const click = (i: number) => {
    if (turn !== "w") return;
    const p = board[i];
    if (sel !== null && legal.includes(i)) {
      const nb = [...board];
      const captured = nb[i] ?? "";
      nb[i] = nb[sel] ?? "";
      nb[sel] = "";
      if (nb[i] === "wp" && i < 8) nb[i] = "wq";
      setBoard(nb);
      setSel(null);
      setTurn("b");
      setStatus(
        captured ? `You take the ${(captured[1] ?? "").toUpperCase()}. Black thinking...` : "Black thinking...",
      );
      sfx.click();
      if (captured === "bk") {
        setStatus("You win. That was allowed to happen.");
        setTurn("w");
        return;
      }
      window.setTimeout(() => blackReply(nb), 480);
      return;
    }
    if (p && p[0] === "w") {
      sfx.click();
      setSel(i === sel ? null : i);
    } else setSel(null);
  };

  return (
    <div className="os-pane os-chess">
      <div className="os-chessboard">
        {board.map((p, i) => {
          const dark = (Math.floor(i / 8) + i) % 2 === 1;
          return (
            <button
              key={i}
              className={`os-sq${dark ? " dark" : ""}${sel === i ? " sel" : ""}${legal.includes(i) ? " can" : ""}`}
              onClick={() => click(i)}
              aria-label={`square ${i}`}
            >
              <span className={p.startsWith("w") ? "pw" : "pb"}>{GLYPH[p] ?? ""}</span>
            </button>
          );
        })}
      </div>
      <div className="os-statusbar">
        <span>{status}</span>
        <button
          className="os-linkbtn"
          onClick={() => {
            setBoard(START);
            setSel(null);
            setTurn("w");
            setStatus("White to move");
          }}
        >
          New game
        </button>
      </div>
    </div>
  );
}
