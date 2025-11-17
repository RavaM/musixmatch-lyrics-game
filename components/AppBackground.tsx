import ColorBends from "./ColorBends";
import CurvedLoop from "./CurvedLoop";
import { Interface } from "./Interface";

export const AppBackground = () => {
  return (
    <div className="absolute inset-0">
      <ColorBends
        colors={["#ff0000", "#00ff00", "#0000ff"]}
        rotation={0}
        speed={0.1}
        scale={1}
        frequency={1}
        warpStrength={1}
        mouseInfluence={0.5}
        parallax={0.5}
        noise={0.08}
      />
      <div className="fixed left-0 right-0 pointer-events-none -bottom-52 sm:bottom-0">
        <CurvedLoop
          marqueeText={"Who ✦ Sings? ✦ by ✦ Musixmatch ✦"}
          speed={3}
          curveAmount={600}
          direction="left"
          interactive={false}
        />
      </div>
    </div>
  );
};
