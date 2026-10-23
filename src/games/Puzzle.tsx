import { useCallback, useEffect, useState } from "react";
import { sfx } from "@/audio/audio";

const SIZE = 4;
const SOLVED = [...Array(SIZE * SIZE - 1)].map((_, i) => i + 1).concat(0);

function shuffle(): number[] {
  const t = [...SOLVED];
  let blank = t.length - 1;
  for (let i = 0; i < 300; i++) {
    const opts = neighbours(blank);
    const pick = opts[Math.floor(Math.random() * opts.length)] ?? blank;
    const a = t[blank] ?? 0;
    t[blank] = t[pick] ?? 0;
    t[pick] = a;
    blank = pick;
  }
  return t;
}

function neighbours(i: number): number[] {
  const r = Math.floor(i / SIZE);
  const c = i % SIZE;
  const out: number[] = [];
  if (r > 0) out.push(i - SIZE);
  if (r < SIZE - 1) out.push(i + SIZE);
  if (c > 0) out.push(i - 1);
  if (c < SIZE - 1) out.push(i + 1);
  return out;
}

export function Puzzle({ compact = false }: { compact?: boolean }) {
  const [tiles, setTiles] = useState<number[]>(SOLVED);
  const [moves, setMoves] = useState(0);

  useEffect(() => setTiles(shuffle()), []);

  const solved = tiles.every((t, i) => t === SOLVED[i]);

  const move = useCallback(
    (i: number) => {
      const blank = tiles.indexOf(0);
      if (!neighbours(blank).includes(i)) return;
      const t = [...tiles];
      const a = t[blank] ?? 0;
      t[blank] = t[i] ?? 0;
      t[i] = a;
      setTiles(t);
      setMoves((m) => m + 1);
      sfx.click();
    },
    [tiles],
  );

  return (
    <div className={`os-puzzle${compact ? " is-compact" : ""}`}>
      <div className="os-puzzle-grid">
        {tiles.map((t, i) => (
          <button
            key={i}
            className={`os-tile${t === 0 ? " is-blank" : ""}`}
            onClick={() => move(i)}
            disabled={t === 0}
          >
            {t === 0 ? "" : t}
          </button>
        ))}
      </div>
      <div className="os-puzzle-foot">
        <span>{solved ? "Solved." : `${moves} moves`}</span>
        <button
          className="os-linkbtn"
          onClick={() => {
            setTiles(shuffle());
            setMoves(0);
          }}
        >
          Shuffle
        </button>
      </div>
    </div>
  );
}
