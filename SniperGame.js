import Phaser from "phaser";

export default class SniperGame extends Phaser.Scene {
  constructor() {
    super("SniperGame");
  }

  preload() {
    this.load.image("target", "assets/Couple.png");
    this.load.image("crosshair", "assets/crosshair.png");
    this.load.image("sniper", "assets/sniper.png");
    this.load.image("background", "assets/city.jpg");
    this.load.spritesheet('obstacle', 'assets/walk.png', { frameWidth: 64, frameHeight: 64 });
    this.load.audio('gunshot', 'assets/sniper rifle sound effect.mp3');
    this.load.audio('success', 'assets/LoveSfx.mp3');
    this.load.audio('fail', 'assets/fail.mp3');
  }

  create() {
    this.background = this.add.image(0, 0, "background").setOrigin(0).setDepth(-1).setScale(3.1);
    this.score = 0;
    this.ammo = 3;
    this.gameOver = false;
    this.gunshotSound = this.sound.add('gunshot', { volume: 0.1 });
    this.loveSound = this.sound.add('success', { volume: 0.3 });
    this.failSound = this.sound.add('fail', { volume: 0.05 });
    // Fixed sniper position at the bottom center
    this.sniperPosition = new Phaser.Math.Vector2(900, 900);
  
    // Optional: draw a sniper image at the bottom
    this.add.image(this.sniperPosition.x, this.sniperPosition.y, "sniper").setScale(0.1);
  
    // Crosshair and laser
    this.crosshair = this.add.image(900, 800, "crosshair").setDepth(1).setScale(0.1);
    this.input.setDefaultCursor("none");
    this.laser = this.add.graphics().setDepth(0);
  
    // UI
    this.ammoText = this.add.text(10, 10, "Ammo: 3", {
      fontSize: "20px",
      fill: "#ffffff",
    });
  
    // Groups
    this.targets = this.physics.add.group();
    this.obstacles = this.physics.add.group();
  
    // Spawn one stationary target
    this.spawnTarget();
  
    // Spawn moving obstacles at regular intervals
    this.time.addEvent({
      delay: 700, // Adjust delay to control frequency of spawning
      callback: this.spawnObstacle,
      callbackScope: this,
      loop: true,
    });
  
    this.input.on("pointerdown", this.shoot, this);
    this.canShoot = false;

    this.countdownText = this.add.text(890, 250, "", {
      fontSize: "48px",
      fill: "#ffffff",
    });

    let countdown = 5;

    const countdownTimer = this.time.addEvent({
      delay: 1000,
      repeat: 6, // Will run 4 times: 3, 2, 1, GO
      callback: () => {
        if (countdown > 0) {
          this.countdownText.setText(countdown);
          countdown--;
        } else if (countdown === 0) {
          this.countdownText.setText("GO!");
          countdown--;
        } else {
          this.countdownText.destroy();   // Clear "GO!" text
          this.canShoot = true;           // Enable shooting
          countdownTimer.remove();        // Stop countdown
        }
      },
    
    });
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('obstacle', { start: 27, end: 35 }),
      frameRate: 16,
      repeat: -1
    });
    
  }

  update() {
    const pointer = this.input.activePointer;
    const pointerPos = pointer.positionToCamera(this.cameras.main);
    const pointerX = pointerPos.x;
    const pointerY = pointerPos.y;
  
    this.crosshair.setPosition(pointerX, pointerY);
  
    if (this.gameOver) return;
  
    this.laser.clear();
  
    const angle = Phaser.Math.Angle.Between(
      this.sniperPosition.x,
      this.sniperPosition.y,
      pointerX,
      pointerY
    );
  
    const maxDistance = 2000;
    const startX = this.sniperPosition.x + 2;
    const startY = this.sniperPosition.y - 40;
    const endX = startX + Math.cos(angle) * maxDistance;
    const endY = startY + Math.sin(angle) * maxDistance;
  
    const laserLine = new Phaser.Geom.Line(startX, startY, endX, endY);
  
    let closestPoint = new Phaser.Geom.Point(pointerX, pointerY);
    let closestDistance = Phaser.Math.Distance.Between(startX, startY, pointerX, pointerY);
  
    // Check obstacles first and update closest point if an obstacle is closer
    this.obstacles.getChildren().forEach(obstacle => {
      const bounds = obstacle.getBounds();
      const edges = [
        new Phaser.Geom.Line(bounds.left, bounds.top, bounds.right, bounds.top),
        new Phaser.Geom.Line(bounds.right, bounds.top, bounds.right, bounds.bottom),
        new Phaser.Geom.Line(bounds.right, bounds.bottom, bounds.left, bounds.bottom),
        new Phaser.Geom.Line(bounds.left, bounds.bottom, bounds.left, bounds.top)
      ];
  
      edges.forEach(edge => {
        const intersection = new Phaser.Geom.Point();
        if (Phaser.Geom.Intersects.LineToLine(laserLine, edge, intersection)) {
          const dist = Phaser.Math.Distance.Between(startX, startY, intersection.x, intersection.y);
          if (dist < closestDistance) {
            closestPoint = intersection;
            closestDistance = dist;
          }
        }
      });
    });
  
    // Now check if the laser reaches the pointer and is closer than any obstacle intersection
    const pointerCircle = new Phaser.Geom.Circle(pointerX, pointerY, 10);
    if (Phaser.Geom.Intersects.LineToCircle(laserLine, pointerCircle)) {
      const pointerDistance = Phaser.Math.Distance.Between(startX, startY, pointerX, pointerY);
      if (pointerDistance < closestDistance) {
        closestPoint = new Phaser.Geom.Point(pointerX, pointerY);
        closestDistance = pointerDistance;
      }
    }
  
    const laserEndX = closestPoint.x;
    const laserEndY = closestPoint.y;
  
    this.laser.lineStyle(2, 0xff0000, 0.8);
    this.laser.beginPath();
    this.laser.moveTo(startX, startY);
    this.laser.lineTo(laserEndX, laserEndY);
    this.laser.strokePath();
  
    // Check if target went off screen
    this.targets.getChildren().forEach(target => {
      if (target.x > this.game.config.width + target.displayWidth) {
        this.loseGame();
      }
    });
  }

  shoot(pointer) {
    if (this.gameOver || this.ammo <= 0 || !this.canShoot) return;
    
  
    this.ammo--;
    this.ammoText.setText("Ammo: " + this.ammo);
  
    // Create a laser line from sniper to pointer (crosshair)
    const startX = this.sniperPosition.x+3;
    const startY = this.sniperPosition.y - 40;

    const laserLine = new Phaser.Geom.Line(startX, startY, pointer.x, pointer.y);
  
    let laserEndX = pointer.x;
    let laserEndY = pointer.y;
    let hitTarget = false;
    let hitObstacle = false; // Flag to check if the laser hits an obstacle
  
    // Check for laser collision with obstacles and stop the laser if it hits one
    this.obstacles.getChildren().forEach(obstacle => {
      const bounds = obstacle.getBounds(); // Get the obstacle's bounding box
      if (Phaser.Geom.Intersects.LineToRectangle(laserLine, bounds)) {
        const intersectionPoints = Phaser.Geom.Intersects.GetLineToRectangle(laserLine, bounds);
        if (intersectionPoints.length > 0) {
          // Block the laser at the first intersection with an obstacle
          laserEndX = intersectionPoints[0].x;
          laserEndY = intersectionPoints[0].y;
          hitObstacle = true; // Mark that the laser hit an obstacle
        }
      }
      this.gunshotSound.play();
    });
  
    // If the laser hit an obstacle, trigger loss
    if (hitObstacle) {
      this.loseGame(); // Trigger the loss screen if the laser hit an obstacle
      return; // Don't proceed further
    }
  
    // Check for laser collision with target and destroy target if hit
    this.targets.getChildren().forEach(target => {
      const targetCircle = new Phaser.Geom.Circle(target.x, target.y, target.displayWidth / 2);
      if (Phaser.Geom.Intersects.LineToCircle(laserLine, targetCircle)) {
        target.destroy(); // Destroy the target when hit
        laserEndX = target.x;
        laserEndY = target.y;
        hitTarget = true; // Hit the target
      }
    });
  
    // Trigger win if the laser hits the target
    if (hitTarget) {
      this.laser.clear();
      this.winGame(); // Trigger win if the target is hit
    } else if (this.ammo === 0) {
      this.loseGame(); // Trigger lose if ammo runs out
    }
  
    // Draw the laser line (from sniper to the point it was blocked or crosshair)
    this.laser.clear();
    this.laser.lineStyle(2, 0xff0000, 0.8); // Laser style (red color)
    this.laser.beginPath();
    this.laser.moveTo(this.sniperPosition.x, this.sniperPosition.y);
    this.laser.lineTo(laserEndX, laserEndY); // End laser at intersection or crosshair
    this.laser.strokePath();
  }

  spawnTarget() {
    const x = -100; // Start off screen
    const y = 100;
  
    const target = this.targets.create(x, y, 'target').setScale(2);
    target.anims.play('walkDavid', true); // Play the same animation
  
    target.body.setVelocityX(100); // Move right
    
    target.flipX = false; // Flip if needed
    target.setImmovable(true);
  }

  spawnObstacle() {
    const direction = Phaser.Math.Between(0, 1) === 0 ? "left" : "right";
    const y = Phaser.Math.Between(200, 450);
    const x = direction === "left" ? -50 : 1900;
    const speed = Phaser.Math.Between(100, 200);
  
    const obstacle = this.obstacles.create(x, y, 'obstacle').setScale(2);
    obstacle.anims.play('walk', true);
  
    if (direction === "left") {
      obstacle.body.setVelocityX(speed);
      obstacle.flipX = false;
    } else {
      obstacle.body.setVelocityX(-speed);
      obstacle.flipX = true;
    }
  
    obstacle.setImmovable(true);
  }

  winGame() {
    this.gameOver = true;
    this.laser.setDepth(-200); // ✅ Clear the laser
    this.add.text(800, 220, "Good Shot!", {
      fontSize: "30px",
      fill: "#45f016",
    }).setDepth(10);
    this.loveSound.play();
    let countdown = 3;
    const countdownTimer = this.time.addEvent({
      delay: 1000,
      repeat: 4, // Will run 4 times: 3, 2, 1, GO
      callback: () => {
        if (countdown > 0) {
          countdown--;
        } else {
          this.transitionToNovelV();        // Stop countdown
        }
      },
    });
    
  }

  loseGame() {
    this.gameOver = true;
    this.laser.clear();
    this.add.text(650, 220, "You failed to Spark Romance!", {
      fontSize: "30px",
      fill: "#ff0000",
    }).setDepth(10);
    this.failSound.play();
    let countdown = 3;
    const countdownTimer = this.time.addEvent({
      delay: 1000,
      repeat: 4, // Will run 4 times: 3, 2, 1, GO
      callback: () => {
        if (countdown > 0) {
          countdown--;
        } else {
          this.transitionToNovelL();        // Stop countdown
        }
      },
    });
  }

  transitionToNovelV() {
    this.input.setDefaultCursor("default");
    this.scene.start("VisualNovelVictory");
  }
  transitionToNovelL() {
    this.input.setDefaultCursor("default");
    this.scene.start("VisualNovelLoss");
  }

}
