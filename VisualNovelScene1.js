import Phaser from "phaser";

export default class VisualNovel1 extends Phaser.Scene {
  constructor() {
    super("VisualNovel1");
  }

  preload() {
    this.load.image("bg", "assets/sky.png");
    this.load.image("mc", "assets/middleagedcupidNoBackground.png");
    this.load.image("God","assets/god.png")
  }

  create() {
    this.add.image(this.scale.width / 2, this.scale.height / 2, "bg")
      .setDisplaySize(this.scale.width, this.scale.height);

    this.dialogueIndex = 0;
    this.add.image(550,560,"mc")
    this.add.image(1500,288,"God").setScale(.5)

    this.dialogue = [
      { speaker: "Cupid", text: "I've been in retirement for hundreds of years. What did you call me for?" },
      { speaker: "God", text: "Now now, don't talk that way. Look, due to how the world is right now, less and less people are falling in love." },
      { speaker: "Cupid", text: "And how am I going to deal with that? No one believes in me anymore." },
      { speaker: "God", text: "See, now that's where I come in. I'll set you up as a therapist to talk about love advice." },
      { speaker: "God", text: "All you have to do is tell them their date will surely go well, suggest a location, and go there to make things happen." },
      { speaker: "God", text: "Then, your name will be spread through word of mouth as the therapist that makes your love always work out!" },
      { speaker: "Cupid", text: "Fine. What do I even get out of this?" },
      { speaker: "God", text: "Look just do this for me for say, 100 years or so, then I'll give you the freedom to do whatever you want." },
      { speaker: "Cupid", text: "Eh, good enough. Where you sending me?" },
      { speaker: "God", text: "To good old New York!" },
      { speaker: "Cupid", text: "How the hell do you expect me to be able to hit my shot in such a crowd? With a bow and arrow no less?" },
      { speaker: "God", text: "I've updated your weapon to that of a sniper rifle, so as long as your aim is good, you should be able to hit your shots. I can only give you 3 bullets at a time though." },
      { speaker: "Cupid.", text: "Huh." },
      { speaker: "Cupid.", text: "Well, this should work." },
      { speaker: "God", text: "Alright, have fun!" }
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
    if (this.dialogueIndex >= this.dialogue.length) {
      this.scene.start("VisualNovel2"); // Transition to the sniper game
      return;
    }

    const line = this.dialogue[this.dialogueIndex];
    this.nameText.setText(line.speaker);
    this.dialogueText.setText(line.text);
    this.dialogueIndex++;
  }

}
  