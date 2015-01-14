
var BasicGame = {

    /* Here we've just got some global level vars that persist regardless of State swaps */
  //  score: 0,

    /* If the music in your game needs to play through-out a few State swaps, then you could reference it here */
   // music: null,

    /* Your game can check BasicGame.orientated in internal loops to know if it should pause or not */
    //orientated: false
    GAME_HEIGHT : 1500,
    GAME_WIDTH : 1000,
    PLAYER_HEALTH : 10,
    PLAYER_SCORE : 0 ,
    RED_ENEMY_DELAY : 5000,
    BLUE_ENEMY_DELAY : 5000,
    GREEN_ENEMY_DELAY : 5000,
    ENEMY_INIT_SPEED : 30,
    RED_ENEMY_HEALTH : 1,
    BLUE_ENEMY_HEALTH : 1 ,
    GREEN_ENEMY_HEALTH : 1,
    SPARTICLE_ENEMY_DELAY : 2000,
    SHOT_DELAY : 100,
    ENEMY_DAMAGE : 1,
    SCORE_POINTS : 10,
    GRAVITY_FIELD : 0.66,
    LEVEL : 1,
    LEVEL_BOUND : 1000,
    ALLOWED_BULLETS : 0,
    GAME_DEFEAT : 0 

};



BasicGame.Boot = function (game) {

};

BasicGame.Boot.prototype = {

    init: function () {

        this.input.maxPointers = 2;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        BasicGame.GAME_HEIGHT = this.game.height ;
        BasicGame.GAME_WIDTH = this.game.width ;
        this.scale.setScreenSize(true);
        /**
        this.scale.minWidth = 480;
        this.scale.minHeight = 720;
        this.scale.maxWidth = 1024;
        this.scale.maxHeight = 1536;
        this.scale.setScreenSize(true);
        //this.scale.startFullScreen();
        /**
        this.stage.disableVisibilityChange = true;

        if (this.game.device.desktop)
        {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.setMinMax(480, 260, 1024, 768);
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
        }
        else
        {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.setMinMax(480, 260, 1024, 768);
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.scale.forceOrientation(true, false);
            this.scale.setResizeCallback(this.gameResized, this);
            this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
            this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
        }
        **/

    },

    preload: function () {

        //  Here we load the assets required for our preloader (in this case a background and a loading bar)
        this.load.image('preloaderBackground', 'assets/logo.png');
        this.load.image('preloaderBar', 'assets/logo_back.png');

    },

    create: function () {

        this.state.start('Preloader');

    },

    gameResized: function (width, height) {

        //  This could be handy if you need to do any extra processing if the game resizes.
        //  A resize could happen if for example swapping orientation on a device or resizing the browser window.
        //  Note that this callback is only really useful if you use a ScaleMode of RESIZE and place it inside your main game state.

    },

    enterIncorrectOrientation: function () {

        BasicGame.orientated = false;

        document.getElementById('orientation').style.display = 'block';

    },

    leaveIncorrectOrientation: function () {

        BasicGame.orientated = true;

        document.getElementById('orientation').style.display = 'none';

    }

};