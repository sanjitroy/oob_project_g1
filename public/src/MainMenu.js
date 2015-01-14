
BasicGame.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;

};

BasicGame.MainMenu.prototype = {

	create: function () {

		//	We've already preloaded our assets, so let's kick right into the Main Menu itself.
		//	Here all we're doing is playing some music and adding a picture and button
		//	Naturally I expect you to do something significantly better :)
		this.back = this.add.tileSprite(0,0,this.game.width, this.game.height,'background');
		//this.music = this.add.audio('titleMusic');
		//this.music.play();

		//this.add.sprite(0, 0, 'titlepage');
		this.game_name = this.add.text((this.game.world.width/2),(this.game.world.height*0.2),'LASER INVADERS',{
        font : '30px monospace', fill : '#15C6FF', align : 'center', fontWeight: 'bold'
       });
       this.game_name.anchor.setTo(0.5,0);

		this.playButton = this.add.button(BasicGame.GAME_WIDTH/2, BasicGame.GAME_HEIGHT*0.5, 'playbut', this.startGame, this, 'playbut', 'playbut', 'playbut');
		this.playButton.anchor.setTo(0.5,0.5) ;

		
	},

	update: function () {

		//	Do some nice funky main menu effect here

	},

	startGame: function (pointer) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		//this.music.stop();

		//	And start the actual game
		this.state.start('Game');

	}

};
