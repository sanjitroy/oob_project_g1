var s_width = window.innerWidth ;
var s_height = window.innerHeight ;
BasicGame = {
    PLAYER_HEALTH : 5,
    PLAYER_SCORE : 0 ,
    RED_ENEMY_DELAY : 500,
    BLUE_ENEMY_DELAY : 600,
    GREEN_ENEMY_DELAY : 1000

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

        this.load.image('background','assets/back.jpg');
        this.load.image('earth','assets/earth.png');
        this.load.image('bull','assets/bullets.png');
        this.load.image('alien','assets/enemy_red.png');
        this.load.image('bullet','assets/blue_laser.png');
        this.load.image('green_bullet', 'assets/green_laser.png');
        this.load.image('red_bullet', 'assets/red_laser.png');
        this.load.image('planet', 'assets/planet.png');
        this.load.image('blue_aliens', 'assets/enemy_blue.png');
        this.load.image('green_aliens', 'assets/enemy_green.png');
        this.load.image('space_particles', 'assets/particle.png');
        this.game.stage.backgroundColor = '#1E1E1E';
    },


	create: function () {
       
	   //this.back = this.add.sprite(0,0,'background');
       //this.back.scale.x = 1 ;
       //this.back.scale.y = 1 ;
       this.sparticle = this.add.sprite((this.game.world.width/2),(this.game.world.height/2),'space_particles');
       
       this.planet = this.add.sprite(((this.game.world.width/2)-40),(s_height-80),'planet');
       //this.planet = this.add.sprite(0,(s_height-80),'earth');
       this.planet.scale.y = 0.5 ;
       this.planet.scale.x = 0.5 ;
       this.physics.enable(this.planet, Phaser.Physics.ARCADE) ;
       //var w_ratio = 1920/(s_width) ;
       //var h_ratio = 144/w_ratio ;

       //this.planet.anchor.setTo(1 ,1 ) ;
       

       //this.planet.z = 100 ;

       //this.alien = this.add.sprite((200),(s_height/2),'alien');
       //red enemy creations. 
       this.enemyPool = this.add.group();
       this.enemyPool.enableBody = true ;
       this.enemyPool.physicsBodyType = Phaser.Physics.ARCADE ;
       this.enemyPool.createMultiple(50, 'alien') ;

       this.enemyPool.setAll('outOfBoundsKill', true) ;
       this.enemyPool.setAll('checkWorldBounds', true) ;
       this.nextEnemyAt = 0 ;
       this.enemyDelay = 5000 ;

       //blue enemy creations
       this.blue_enemyPool = this.add.group();
       this.blue_enemyPool.enableBody = true ;
       this.blue_enemyPool.physicsBodyType = Phaser.Physics.ARCADE ;
       this.blue_enemyPool.createMultiple(50, 'blue_aliens') ;

       this.blue_enemyPool.setAll('outOfBoundsKill', true) ;
       this.blue_enemyPool.setAll('checkWorldBounds', true) ;
       this.nextblue_EnemyAt = 0 ;
       this.blue_enemyDelay = 5000 ;

       //green enemy creation 
       this.green_enemyPool = this.add.group();
       this.green_enemyPool.enableBody = true ;
       this.green_enemyPool.physicsBodyType = Phaser.Physics.ARCADE ;
       this.green_enemyPool.createMultiple(50, 'green_aliens') ;

       this.green_enemyPool.setAll('outOfBoundsKill', true) ;
       this.green_enemyPool.setAll('checkWorldBounds', true) ;
       this.nextgreen_EnemyAt = 0 ;
       this.green_enemyDelay = 5000 ;

       //this.shots = [] ;
       //blue laser creations 
       this.laserPool = this.add.group() ;
       this.laserPool.enableBody = true ;
       this.laserPool.physicsBodyType = Phaser.Physics.ARCADE ;
       this.laserPool.createMultiple(100, 'bullet');

       this.laserPool.setAll('outOfBoundsKill', true);
       this.laserPool.setAll('checkWorldBounds', true);


       //green laser creations 
       this.green_laserPool = this.add.group() ;
       this.green_laserPool.enableBody = true ;
       this.green_laserPool.physicsBodyType = Phaser.Physics.ARCADE ;
       this.green_laserPool.createMultiple(100, 'green_bullet');

       this.green_laserPool.setAll('outOfBoundsKill', true);
       this.green_laserPool.setAll('checkWorldBounds', true);


       //red laser creations 
       this.red_laserPool = this.add.group() ;
       this.red_laserPool.enableBody = true ;
       this.red_laserPool.physicsBodyType = Phaser.Physics.ARCADE ;
       this.red_laserPool.createMultiple(100, 'red_bullet');

       this.red_laserPool.setAll('outOfBoundsKill', true);
       this.red_laserPool.setAll('checkWorldBounds', true);

       this.nextShotAt = 0 ;
       this.shotDelay = 100 ;

       this.laser_names = [this.laserPool,this.green_laserPool,this.red_laserPool];
       //pointer_1 = new Phaser.Pointer() ;

       
       this.score = this.add.text((this.game.world.width/2),(this.game.world.height-100),'XP : ',{
        font : '20px monospace', fill : '#fff', align : 'center'
       });
       this.score.anchor.setTo(0.5,0.5);

       this.score_l_bound = 0 ;
       this.score_u_bound = 100 ;
       this.levelUp = 0 ;
       this.levelV = "" ;
       this.io = 0 ;
       this.levelNum =1 ;
       this.levelText = this.add.text((this.game.world.width/2),(25),'Level 1 in \n'+ this.levelV,{
        font : '20px monospace', fill : '#fff', align : 'center'
       });
       this.levelText.anchor.setTo(0.5,0.5);

       this.announcement ;
       this.anncExp = 0;


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

        this.enemy_gravity_check();

        this.physics.arcade.overlap(this.laserPool, this.enemyPool, this.enemyHit, null, this);
        this.physics.arcade.overlap(this.green_laserPool, this.enemyPool, this.enemyHit, null, this);
        this.physics.arcade.overlap(this.red_laserPool, this.enemyPool, this.enemyHit, null, this);

        this.physics.arcade.overlap(this.laserPool, this.blue_enemyPool, this.blue_hit, null, this);
        this.physics.arcade.overlap(this.green_laserPool, this.blue_enemyPool, this.blue_hit, null, this);
        this.physics.arcade.overlap(this.red_laserPool, this.blue_enemyPool, this.blue_hit, null, this);

        this.physics.arcade.overlap(this.laserPool, this.green_enemyPool, this.green_hit, null, this);
        this.physics.arcade.overlap(this.green_laserPool, this.green_enemyPool, this.green_hit, null, this);
        this.physics.arcade.overlap(this.red_laserPool, this.green_enemyPool, this.green_hit, null, this);

        this.physics.arcade.overlap(this.planet, this.enemyPool, this.planetHit, null, this);
        this.physics.arcade.overlap(this.planet, this.blue_enemyPool, this.planetHit, null, this);
        this.physics.arcade.overlap(this.planet, this.green_enemyPool, this.planetHit, null, this);

        //this.physics.arcade.overlap(this.enemyPool, this.enemyPool,this.collidingenemy, null);
        
        this.updateScores();
	},

    fire : function(x_cor){

        if(this.nextShotAt > this.time.now ){
            return ;
        }

        this.nextShotAt = this.time.now + this.shotDelay ;

        var bullet = this.laser_names[this.rnd.integerInRange(0,2)].getFirstExists(false); 

        bullet.reset(x_cor, s_height-80) ;
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
            
           
            this.nextEnemyAt = this.time.now + BasicGame.RED_ENEMY_DELAY ;

            var enemy = this.enemyPool.getFirstExists(false); 
            //console.log("Creating enemies ... ")
            //console.log("Dead enemies .. " + this.enemyPool.countDead());
            enemy.reset(this.rnd.integerInRange(10,s_width-10), 0, 2) ;
            enemy.anchor.setTo(0.5,1);
            enemy.body.velocity.y = 30 ;
            enemy.scale.x = 0.5 ;
            enemy.scale.y = 0.5 ;
            //bullet.scale.y = 0.3 ;
        }

        if(this.nextblue_EnemyAt < this.time.now && this.blue_enemyPool.countDead() > 0){
            //console.log("Getting new enemies .. ")
            this.nextblue_EnemyAt = this.time.now + BasicGame.BLUE_ENEMY_DELAY ;

            var blue_enemy = this.blue_enemyPool.getFirstExists(false) ;
            blue_enemy.reset(this.rnd.integerInRange(10,s_width-10),0);
            blue_enemy.anchor.setTo(0.5,1);
            blue_enemy.body.velocity.y = 30 ;
            blue_enemy.scale.x = 0.5 ;
            blue_enemy.scale.y = 0.5 ;
        }

        if(this.nextgreen_EnemyAt < this.time.now && this.green_enemyPool.countDead() > 0){
            this.nextgreen_EnemyAt = this.time.now + BasicGame.GREEN_ENEMY_DELAY ;
            var green_enemy = this.green_enemyPool.getFirstExists(false);
            green_enemy.reset(this.rnd.integerInRange(10,s_width-10),0);
            green_enemy.anchor.setTo(0.5,1);
            green_enemy.body.velocity.y = 30 ;
            green_enemy.scale.x = 0.5 ;
            green_enemy.scale.y = 0.5 ;
        }
    },

    enemyHit : function(bullet, enemy){
        bullet.kill() ;
        //enemy.kill() ;
        enemy.damage(1); 
        BasicGame.PLAYER_SCORE += 10 ;
        //console.log("SCORE : "+ BasicGame.PLAYER_SCORE ); 
        
        
    },

    green_hit : function(g_bullet,enemy){
        enemy.kill() ;
        g_bullet.kill(); 
        BasicGame.PLAYER_SCORE += 10 ;
    },

    blue_hit : function(r_bullet,enemy){
        r_bullet.kill();
        enemy.kill();
        BasicGame.PLAYER_SCORE += 10 ;
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



        this.green_laserPool.forEachAlive(function(bullet){
            if(bullet.y <= 0.66*s_height){
                bullet.scale.x = 0.3 ;
                bullet.scale.y = 0.3 ;
                bullet.body.velocity.y = -2000 ;
            }
            else{
                bullet.body.velocity.y -= 1 ;   
            }
        });


        this.red_laserPool.forEachAlive(function(bullet){
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

      this.enemyPool.forEachAlive(this.enemy_velocity_check);
      this.green_enemyPool.forEachAlive(this.enemy_velocity_check);
      this.blue_enemyPool.forEachAlive(this.enemy_velocity_check);
      /**
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
      **/
    },

    enemy_velocity_check: function(enemy){
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
    },

    updateScores: function(){
        this.score.setText("XP : "+ BasicGame.PLAYER_SCORE );
        if(BasicGame.PLAYER_SCORE >= this.score_l_bound && BasicGame.PLAYER_SCORE <= this.score_u_bound){
            //console.log("Level Up :D ") ;
            this.levelUp = (this.score_u_bound - BasicGame.PLAYER_SCORE)/10 ;
            //console.log(this.xcd);
            this.levelV = "" ;
            for(io=0;io<=this.levelUp;io++){
                this.levelV += "+" ; 
            }
            //console.log(this.levelV);
            this.levelText.setText("Level "+this.levelNum + " in \n"+ this.levelV);
            //BasicGame.ENEMY_DELAY -= 20 ;
        }
        else {
            //console.log("Level up up up up up ... :D :D  ") ;
            BasicGame.ENEMY_DELAY -= 500 ;
            //console.log("Enemy Delay : "+ BasicGame.ENEMY_DELAY);
            this.score_l_bound = this.score_u_bound ;
            this.score_u_bound = this.score_l_bound + 100 ;
            this.announcement = this.add.text((this.game.world.width/2),(this.game.world.height/2),'Level Up',{
                font : '30px monospace', fill : '#fff', align : 'center'
            });
            this.levelNum++ ;
            this.announcement.anchor.setTo(0.5,0.5);
            this.anncExp = this.time.now + 5000 ;
        }

        if(this.anncExp > 0 && this.time.now > this.anncExp){
            this.announcement.destroy() ;
        }
        
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
