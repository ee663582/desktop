import { Ico } from "@/os/icons";
import { useOs } from "@/os/store";

const GAMES = [
  { appId: "chess" as const, title: "Chess", desc: "Against a very average opponent.", w: 520, h: 600 },
  { appId: "lander" as const, title: "Lunar Lander", desc: "Land slowly. That is the whole game.", w: 560, h: 480 },
  { appId: "puzzle" as const, title: "Puzzle", desc: "Fifteen tiles, one empty square.", w: 400, h: 470 },
];

export function GamesLauncher() {
  const { openWindow } = useOs();
  return (
    <div className="os-pane os-games">
      <div className="os-games-grid">
        {GAMES.map((g) => (
          <button
            key={g.appId}
            className="os-game-tile"
            onDoubleClick={() =>
              openWindow({ appId: g.appId, title: g.title, icon: "games", key: g.appId, width: g.w, height: g.h })
            }
            onClick={() =>
              openWindow({ appId: g.appId, title: g.title, icon: "games", key: g.appId, width: g.w, height: g.h })
            }
          >
            <Ico name="games" size={40} />
            <strong>{g.title}</strong>
            <span>{g.desc}</span>
          </button>
        ))}
      </div>
      <p className="os-dim">
        I started making games because I wanted to know what was underneath the ones I was playing.
      </p>
    </div>
  );
}
