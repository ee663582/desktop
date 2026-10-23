import horizon from "@/assets/wallpaper-horizon.png";
import deep from "@/assets/wallpaper-deep.png";
import winter from "@/assets/wallpaper-winter.png";

export interface Wallpaper {
  id: string;
  name: string;
  src: string;
  note: string;
}

export const wallpapers: Wallpaper[] = [
  { id: "horizon", name: "horizon_2512.jpg", src: horizon, note: "the evening the machine arrived" },
  { id: "deep", name: "under.jpg", src: deep, note: "looking up" },
  { id: "winter", name: "grey_sea.jpg", src: winter, note: "nothing happening, slowly" },
];

export const defaultWallpaperId = "horizon";
