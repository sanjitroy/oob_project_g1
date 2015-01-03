var s_width = window.innerWidth ;
var s_height = window.innerHeight ;
BasicGame = {
    PLAYER_HEALTH : 5,
    PLAYER_SCORE : 0 ,
    ENEMY_DELAY : 5000

};

BasicGame.Game = function (game) {

	//	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;	//	the tween manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator

    //	You can use any of these from any function within this State.
    //	But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

BasicGame.Game.prototype = {
    
    preload: function(){

        this.load.image('background','assets/starfield.png');
        this.load.image('earth','assets/earth.png');
        this.load.image('alien','assets/bullets.png');
        this.load.image('bullet','assets/blue_las1.png');
        this.load.image('planet', 'assets/planet.png')
    },


	create: function () {

	   this.back = this.add.sprite(0,0,'background');
       this.back.scale.x = 1 ;
       this.back.scale.y = 1 ;

       this.planet = this.add.sprite(((this.game.world.width/2)-40),(s_height-80),'planet');
       //this.planet = this.add.sprite(0,(s_height-80),'earth');
       this.planet.scale.y = 1 ;
       this.planet.scale.x = 1 ;
       this.physics.enable(this.planet, Phaser.Physics.ARCADE) ;
       //var w_ratio = 1920/(s_width) ;
       //var h_ratio = 144/w_ratio ;

       //this.planet.anchor.setTo(1 ,1 ) ;
       

       //this.planet.z = 100 ;

       //this.alien = this.add.sprite((200),(s_height/2),'alien');
       this.enemyPool = this.add.group();
       this.enemyPool.enableBody = true ;
       this.enemyPool.physicsBodyType = Phaser.Physics.ARCADE ;
       this.enemyPool.createMultiple(50, 'alien') ;

       this.enemyPool.setAll('outOfBoundsKill', true) ;
       this.enemyPool.setAll('checkWorldBounds', true) ;
       this.nextEnemyAt = 0 ;
       //this.enemyDelay = 5000 ;

       //this.shots = [] ;
       this.laserPool = this.add.group() ;
       this.laserPool.enableBody = true ;
       this.laserPool.physicsBodyType = Phaser.Physics.ARCADE ;
       this.laserPool.createMultiple(100, 'bullet');

       this.laserPool.setAll('outOfBoundsKill', true);
       this.laserPool.setAll('checkWorldBounds', true);
       this.nextShotAt = 0 ;
       this.shotDelay = 100 ;

       //pointer_1 = new Phaser.Pointer() ;

	},

	update: function () {
        //if(pointer_1.isDown){
            //console.log("POinter 1 is down");
        if(this.input.activePointer.isDown){
            this.fire(this.input.x);
            //this.enemy(this.input.x);
        }

        this.gravity_check();

        this.spawnEnemey();

        this.enemy_gravity_check() ;
        this.physics.arcade.overlap(this.laserPool, this.enemyPool, this.enemyHit, null, this); 
        this.physics.arcade.overlap(this.planet, this.enemyPool, this.planetHit, null, this);
        //this.physics.arcade.overlap(this.enemyPool, this.enemyPool,this.collidingenemy, null);
	},

    fire : function(x_cor){

        if(this.nextShotAt > this.time.now ){
            return ;
        }

        this.nextShotAt = this.time.now + this.shotDelay ;

        var bullet = this.laserPool.getFirstExists(false); 

        bullet.reset(x_cor, 700) ;
        bullet.body.velocity.y = -1 ;
        bullet.scale.x = 0.5 ;
        bullet.scale.y = 0.05 ;
        //this.game.camera.follow(bullet);
        /**

        var bullet = this.add.sprite(x_cor,800,'bullet') ;
        bullet.scale.x = 0.3 ;
        bullet.scale.y = 0.3 ;
        this.physics.enable(bullet, Phaser.Physics.ARCADE);
        bullet.body.velocity.y = -1 ;
        this.shots.push(bullet);
        **/
    },

    spawnEnemey : function(){
        //console.log("Enemy spawner called ... ")
        if(this.nextEnemyAt < this.time.now && this.enemyPool.countDead() > 0){
            
           
            this.nextEnemyAt = this.time.now + BasicGame.ENEMY_DELAY ;

            var enemy = this.enemyPool.getFirstExists(false); 
            //console.log("Creating enemies ... ")
            //console.log("Dead enemies .. " + this.enemyPool.countDead());
            enemy.reset(this.rnd.integerInRange(10,s_width-10), 0) ;
            enemy.body.velocity.y = 30 ;
            //bullet.scale.x = 0.3 ;
            //bullet.scale.y = 0.3 ;
        }

    },

    enemyHit : function(bullet, enemy){
        //bullet.kill() ;
        enemy.kill() ;
        BasicGame.PLAYER_SCORE += 10 ;
        console.log("SCORE : "+ BasicGame.PLAYER_SCORE ); 
        
        if(BasicGame.PLAYER_SCORE >= 100 && BasicGame.PLAYER_SCORE <= 200){
            console.log("Level Up :D ") ;
            BasicGame.ENEMY_DELAY = 1000 ;
        }
        else if(BasicGame.PLAYER_SCORE > 200 && BasicGame.PLAYER_SCORE <= 300){
            console.log("Level so very up XD ") ;
            BasicGame.ENEMY_DELAY = 100 ;  
        }
        
    },

    planetHit : function(planet, enemy){
        //console.log("planet hit") ;
        BasicGame.PLAYER_HEALTH -- ;
        console.log("PLAYER HEALTH : " + BasicGame.PLAYER_HEALTH) ;
        if(BasicGame.PLAYER_HEALTH == 0){
            planet.kill() ;
        }
        enemy.kill() ;
    },


    gravity_check : function(){
        /**
        for(var i=0 ; i<this.shots.length ; i++){
            if(this.shots[i].y <= 400){
                this.shots[i].body.velocity.y = -1000 ;
            }
            else{
                this.shots[i].body.velocity.y -= 0.5 ;   
            }
        }
        **/

        this.laserPool.forEachAlive(function(bullet){
            if(bullet.y <= 0.66*s_height){
                bullet.scale.x = 0.3 ;
                bullet.scale.y = 0.3 ;
                bullet.body.velocity.y = -2000 ;
            }
            else{
                bullet.body.velocity.y -= 1 ;   
            }
        });
    },

    enemy_gravity_check : function(){
        this.enemyPool.forEachAlive(function(enemy){
            if(enemy.y > 0.66*s_height){

                //enemy.body.velocity.y += 10 ;
                var k=(s_height-enemy.y)/(enemy.x-(s_width/2));
                if(enemy.x>s_width/2 && BasicGame.PLAYER_HEALTH>0){
                    enemy.body.velocity.x = -1000/Math.sqrt(1+k*k);
                    enemy.body.velocity.y = -k*enemy.body.velocity.x;

                }
                else
                if(enemy.x<s_width/2 && BasicGame.PLAYER_HEALTH>0){
                    enemy.body.velocity.x = 1000/Math.sqrt(1+k*k);
                    enemy.body.velocity.y = -k*enemy.body.velocity.x;
                }
                else if(enemy.x==s_width/2 && BasicGame.PLAYER_HEALTH>0){
                    enemy.body.velocity.y = 1000;

                }
                else if(enemy.x>s_width/2){
                    enemy.body.velocity.x = 10/Math.sqrt(1+k*k);
                    enemy.body.velocity.y = -k*enemy.body.velocity.x;
                }
                else{
                    enemy.body.velocity.x = -10/Math.sqrt(1+k*k);
                    enemy.body.velocity.y = -k*enemy.body.velocity.x;
                }
            }
            else{
                //enemy.body.velocity.y += 1 ;   
            }
        });
    },

    render: function() {
        //this.game.debug.body(this.shots);

    },

	quitGame: function (pointer) {

		//	Here you should destroy anything you no longer need.
		//	Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//	Then let's go back to the main menu.
		this.state.start('MainMenu');

	}

};
