import Phaser from "phaser";

export default class VisualNovelVictory extends Phaser.Scene {
  constructor() {
    super("VisualNovelVictory");
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
      { speaker: "David", text: "It went amazing, your advice really worked! Turns out she had feeling for me as well, but was also hesitating!" },
      { speaker: "David", text: "I'm not sure why, but I suddenly got the courage to ask her out, and it worked!" },
      { speaker: "David", text: "The coffee shop we went to was also really nice, we talked about a lot of things there." },
      { speaker: "Cupid", text: "Glad it went well. If you ever have some relationship problems in the future, just let me know." },
      { speaker: "Cupid", text: "And, if you know anyone that also has relationship troubles, then them my way, I'll see what I can do." },
      { speaker: "David", text: "Thanks man, I'll do just that." },
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