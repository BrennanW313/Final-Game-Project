import Phaser from "phaser";

export default class VisualNovelLoss extends Phaser.Scene {
  constructor() {
    super("VisualNovelLoss");
  }

  preload() {
    this.load.image("office", "assets/therapistoffice.jpg");
    this.load.image("mc", "assets/middleagedcupidNoBackground.png");
    this.load.image("David","assets/david.png")
  }

  create() {
    this.add.image(this.scale.width / 2, this.scale.height / 2, "office")
      .setDisplaySize(this.scale.width, this.scale.height);

    this.dialogueIndex = 0;
    this.add.image(550,560,"mc")
    this.add.image(1500,560,"David")

    this.dialogue = [
      { speaker: "Cupid", text: "Well, how did the date go?" },
      { speaker: "David", text: "I kinda doubted your advice, and it seems my suspicions were correct." },
      { speaker: "David", text: "I never got the courage to ask her out. You made it seem so easy, but I guess the real world doesn't work like that." },
      { speaker: "David", text: "Thanks for everything, goodbye." },
      { speaker: "Cupid", text: "Wait!" },
      { speaker: "Cupid", text: "Damn it." },
    ];

    // Name box
    this.nameBox = this.add.rectangle(50, this.scale.height - 160, 300, 40, 0x000000)
      .setOrigin(0)
      .setAlpha(0.7);
    this.nameText = this.add.text(60, this.scale.height - 152, '', {
      fontSize: '24px',
      fill: '#ffffff',
      fontFamily: 'sans-serif'
    });

    // Dialogue box
    this.dialogueBox = this.add.rectangle(50, this.scale.height - 110, this.scale.width - 100, 100, 0x000000)
      .setOrigin(0)
      .setAlpha(0.7);
    this.dialogueText = this.add.text(60, this.scale.height - 100, '', {
      fontSize: '22px',
      fill: '#ffffff',
      wordWrap: { width: this.scale.width - 120 },
      fontFamily: 'sans-serif'
    });

    

    this.input.on("pointerdown", () => this.advanceDialogue());

    this.advanceDialogue();
  }

  advanceDialogue() {
    const line = this.dialogue[this.dialogueIndex];
    this.nameText.setText(line.speaker);
    this.dialogueText.setText(line.text);
    this.dialogueIndex++;
  }

}