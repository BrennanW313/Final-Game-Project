import Phaser from "phaser";
import SniperGame from "./SniperGame";
import VisualNovel2 from "./VisualNovelScene2";
import VisualNovel1 from "./VisualNovelScene1";
import VisualNovelVictory from "./VisualNovelVictory";
import VisualNovelLoss from "./VisualNovelLoss";

const config = {
  type: Phaser.AUTO,
  width: 1850, // base width
  height: 920, // base height
  scene: [VisualNovel1, SniperGame, VisualNovel2, VisualNovelVictory, VisualNovelLoss],
  scale: {
    mode: Phaser.Scale.NONE, // Disable automatic scaling
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
};

const game = new Phaser.Game(config);

