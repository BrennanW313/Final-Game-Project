import Phaser from "phaser";

export default class VisualNovel2 extends Phaser.Scene {
  constructor() {
    super("VisualNovel2");
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
      { speaker: "Cupid", text: "(Well then. My first client.)" },
      { speaker: "Cupid", text: "Alright David, could you tell me about the problem you have?" },
      { speaker: "David", text: "Getting right into it then, huh. Alright, so, I got this childhood friend of mine that I've known for a while named Sarah." },
      { speaker: "David", text: "We've been together ever since we were kids, but I started to develop feelings towards her in High school, but I didn't want to ruin the friendship we currently had so I haven't done anything." },
      { speaker: "David", text: "We both decided to go to the same college, and I've finally mustered up the courage to ask her on a date. Though, I want it to go well, what should I do? " },
      { speaker: "David", text: "I never thought about what we would actually do on the date, as I was too excited that she accepted." },
      { speaker: "Cupid", text: "Well thats an interesting story. Well, what's the location of the date you chose?" },
      { speaker: "Davod", text: "We chose to go to Central Park, as I thought it could be a great place to walk around. But I didn't think beyond that. What should I do?" },
      { speaker: "Cupid", text: "Look David, as long as you genuinely express your feelings and don't try and hide them, things will go well. If you think the date is going well, why don't you take her to a coffee shop after?" },
      { speaker: "David", text: "Oh that's a good idea! Thanks, lets hope my date goes well!" },
      { speaker: "Cupid", text: "Yup, good luck David." },
      { speaker: "Cupid", text: "(Guess I should go set up in Central Park then.)" }
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
      this.scene.start("SniperGame"); // Transition to the sniper game
      return;
    }

    const line = this.dialogue[this.dialogueIndex];
    this.nameText.setText(line.speaker);
    this.dialogueText.setText(line.text);
    this.dialogueIndex++;
  }

}