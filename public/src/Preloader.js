
BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {

		//	These are the assets we loaded in Boot.js
		//	A nice sparkly background and a loading progress bar
		
		this.preloadBar = this.add.sprite(this.game.width/2, this.game.height/2, 'preloaderBar');
		this.preloadBar.anchor.setTo(0.5,0.5) ;
		this.preloadBar.scale.x = 1 ;
		this.preloadBar.scale.y = 1 ;
		this.background = this.add.sprite(this.game.width/2, this.game.height/2, 'preloaderBackground');
		this.background.anchor.setTo(0.5,0.5) ;
		this.background.scale.x = BasicGame.GAME_WIDTH/1000 ;
		this.background.scale.y = BasicGame.GAME_HEIGHT/1000 ;
		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.
		this.load.setPreloadSprite(this.preloadBar);


		//this.load.image('background','assets/back.jpg');

		this.load.image('logoeffects', 'assets/logo-effects.png');
		this.load.image('playbut', 'assets/play.png');
        this.load.image('background','assets/back1.png');
        //this.load.image('earth','assets/earth.png');

        this.load.image('bull','assets/bullets.png');
        this.load.image('alien','assets/enemy_red.png');

        this.load.image('bullet','assets/blue_laser.png');
        this.load.image('green_bullet', 'assets/green_laser.png');
        this.load.image('red_bullet', 'assets/red_laser.png');
        this.load.image('orange_bullet','assets/orange_laser.png');
        this.load.image('yellow_bullet','assets/yellow_laser.png');
        this.load.image('violet_bullet','assets/violet_laser.png');

        this.load.image('planet', 'assets/planet.png');
        this.load.image('blue_aliens', 'assets/enemy_blue.png');
        this.load.image('green_aliens', 'assets/enemy_green.png');
        this.load.image('space_particles', 'assets/particles.png');
        //this.game.stage.backgroundColor = '#1E1E1E';
		//	Here we load the rest of the assets our game needs.
		//	As this is just a Project Template I've not provided these assets, the lines below won't work as the files themselves will 404, they are just an example of use.
		//this.load.image('titlepage', 'images/title.jpg');
		//this.load.atlas('playButton', 'images/play_button.png', 'images/play_button.json');
		//this.load.audio('titleMusic', ['audio/main_menu.mp3']);
		//this.load.bitmapFont('caslon', 'fonts/caslon.png', 'fonts/caslon.xml');
		//	+ lots of other required assets here

	},

	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		this.preloadBar.cropEnabled = false;
		this.Effects = this.add.sprite(this.game.width/2, this.game.height/2, 'logoeffects');
		this.Effects.anchor.setTo(0.5,0.5) ;
		this.Effects.scale.x = BasicGame.GAME_WIDTH/1000 ;
		this.Effects.scale.y = BasicGame.GAME_HEIGHT/1000 ;
		this.start_time = this.time.now ;
		//this.state.start('Game') ;

	},
	
	update: function () {

		//	You don't actually need to do this, but I find it gives a much smoother game experience.
		//	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
		//	You can jump right into the menu if you want and still play the music, but you'll have a few
		//	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
		//	it's best to wait for it to decode here first, then carry on.
		
		//	If you don't have any music in your game then put the game.state.start line into the create function and delete
		//	the update function completely.
		/**
		if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
		{
			this.ready = true;
			this.state.start('MainMenu');
		}
		**/
		if((this.time.now-this.start_time) > 5000){
			this.state.start('MainMenu') ;
		}

	}

};
