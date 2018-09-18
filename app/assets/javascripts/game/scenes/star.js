class StarScene extends Phaser.Scene {
  constructor() {
    super({ key: 'stars', active: true });
    this.name = 'stars';
    this.starCount = 300;
    this.stars = [];
  }

  preload() {
    game.starScene = this;

    this.load.path = getAssetPath();
    this.load.multiatlas('stars', 'multipass.json');
  }

  create() {
    let speeds = [25, 50, 75, 100, 125, 150, 175, 200];

    let layers = {};
    speeds.forEach(function(speed) {
      layers[speed] = [];
    });

    for (var i = 0; i < this.starCount; i++) {
      let starSpeed = speeds.sample()

      layers[starSpeed].push({
        contrast: [20,30,40,60,70,80,90].sample(),
        color: ['blue', 'green', 'yellow', 'orange', 'red', 'purple'].sample(),
        scale: [0.3, 0.5, 0.8, 1].sample(),
        speed: starSpeed,
        rotation: ([0, 30, 45].sample() / 180) * Math.PI,
        scaleDirection: ['x', 'both', 'both'].sample(),
        x: Math.floor(Math.random() * screen.width),
        y: Math.floor(Math.random() * screen.height)
      });
    }

    Object.keys(layers).forEach(function(layerSpeed) {
      layers[layerSpeed].forEach(function(currentStar) {
        let texture = 'stars/' + currentStar.color + '/' + currentStar.contrast;
        let current = game.starScene.physics.add.sprite(currentStar.x, currentStar.y, 'stars', texture);

        if (currentStar.scaleDirection == 'x' && currentStar.rotation == 0) {
          current.scaleX = currentStar.scale;
        }
        else if (currentStar.scaleDirection == 'y' && currentStar.rotation == 0) {
          current.scaleY = currentStar.scale;
        }
        else {
          current.scaleX = currentStar.scale;
          current.scaleY = currentStar.scale;
        }

        current.setVelocityX(-currentStar.speed);

        if (currentStar.scale < 0.8) {
          current.setRotation(currentStar.rotation);
        }

        game.starScene.stars.push(current);
      });
    });

    let overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 1.0);
    overlay.fillRect(0, 0, game.width, game.height);
    overlay.alpha = 0.5;
  }

  update() {
    let scene = this;
    this.stars.forEach(function(star) {
      scene.physics.world.wrap(star, star.width);
    });
  }
}
