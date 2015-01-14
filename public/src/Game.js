/*
* List of changes :
* Sanjit -
* 1. Changed updateParticles function().
* 2. Changed background particle delay. 
*
* Marchuso -
*/
var s_width = window.innerWidth ;
var s_height = window.innerHeight ;
/**
BasicGame = {
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
    GRAVITY_FIELD : 0.66 
};
**/

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
    this.emitter;

    //	You can use any of these from any function within this State.
    //	But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

BasicGame.Game.prototype = {
    
    preload: function(){
      /**
        //this.load.image('background','assets/back.jpg');
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
        this.game.stage.backgroundColor = '#1E1E1E';
        **/
    },


	create: function () {
       
	     this.back = this.add.tileSprite(0,0,this.game.width, this.game.height,'background');
       //this.back.autoScroll(0,10);
       //this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'space');
       //this.back.scale.x = 1 ;
       //this.back.scale.y = 1 ;

       //this.sparticle = this.add.sprite((this.game.world.width/2),(this.game.world.height/2),'space_particles');
       //SParticle group for background particle addition.
       this.sparticle = this.add.group();
	     this.sparticle.enableBody = true ;
	     this.sparticle.physicsBodyType = Phaser.Physics.ARCADE ;
	     this.sparticle.createMultiple(100 , 'space_particles' ) ;
	     this.nextSparticleAt = 0;
	   
	     this.sparticle.setAll( 'outOfBoundsKill' , true ) ;
	     this.sparticle.setAll( 'checkWorldBounds' , true ) ;

	     //PLanet sprite loading 
       this.planet = this.add.sprite(((this.game.world.width/2)),(this.game.world.height-40),'planet');  
       //this.planet = this.add.sprite(0,(s_height-80),'earth');
       this.planet.scale.y = 1 ;
       this.planet.scale.x = 1 ;
       this.planet.anchor.setTo(0.5,0.5);
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
       this.enemyPool.createMultiple(100, 'alien') ;

       this.enemyPool.setAll('outOfBoundsKill', true) ;
       this.enemyPool.setAll('checkWorldBounds', true) ;
       this.nextEnemyAt = 0 ;
       //this.enemyDelay = 5000 ;

       //blue enemy creations
       this.blue_enemyPool = this.add.group();
       this.blue_enemyPool.enableBody = true ;
       this.blue_enemyPool.physicsBodyType = Phaser.Physics.ARCADE ;
       this.blue_enemyPool.createMultiple(50, 'blue_aliens') ;

       this.blue_enemyPool.setAll('outOfBoundsKill', true) ;
       this.blue_enemyPool.setAll('checkWorldBounds', true) ;
       this.nextblue_EnemyAt = 0 ;
       //this.blue_enemyDelay = 5000 ;

       //green enemy creation 
       this.green_enemyPool = this.add.group();
       this.green_enemyPool.enableBody = true ;
       this.green_enemyPool.physicsBodyType = Phaser.Physics.ARCADE ;
       this.green_enemyPool.createMultiple(50, 'green_aliens') ;

       this.green_enemyPool.setAll('outOfBoundsKill', true) ;
       this.green_enemyPool.setAll('checkWorldBounds', true) ;
       this.nextgreen_EnemyAt = 0 ;
       //this.green_enemyDelay = 5000 ;

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


       //yellow laser creations
       this.yellow_laserPool = this.add.group() ;
       this.yellow_laserPool.enableBody = true ;
       this.yellow_laserPool.physicsBodyType = Phaser.Physics.ARCADE ;
       this.yellow_laserPool.createMultiple(100, 'yellow_bullet');

       this.yellow_laserPool.setAll('outOfBoundsKill', true);
       this.yellow_laserPool.setAll('checkWorldBounds', true);


       //orange laser creations
       this.orange_laserPool = this.add.group() ;
       this.orange_laserPool.enableBody = true ;
       this.orange_laserPool.physicsBodyType = Phaser.Physics.ARCADE ;
       this.orange_laserPool.createMultiple(100, 'orange_bullet');

       this.orange_laserPool.setAll('outOfBoundsKill', true);
       this.orange_laserPool.setAll('checkWorldBounds', true);


       //voilet laser creations 
       this.violet_laserPool = this.add.group() ;
       this.violet_laserPool.enableBody = true ;
       this.violet_laserPool.physicsBodyType = Phaser.Physics.ARCADE ;
       this.violet_laserPool.createMultiple(100, 'violet_bullet');

       this.violet_laserPool.setAll('outOfBoundsKill', true);
       this.violet_laserPool.setAll('checkWorldBounds', true);


       this.nextShotAt = 0 ;
       //this.shotDelay = 100 ;

       this.laser_names = [this.laserPool,this.green_laserPool,this.red_laserPool,this.yellow_laserPool,this.orange_laserPool,this.violet_laserPool];
       //pointer_1 = new Phaser.Pointer() ;

       
       this.score = this.add.text((this.game.world.width/2),(this.game.world.height-100),'XP : ',{
        font : '20px monospace', fill : '#15C6FF', align : 'center'
       });
       this.score.anchor.setTo(0.5,0.5);

       this.score_l_bound = 0 ;
       this.score_u_bound = 100 ;
       this.levelUp = 0 ;
       this.levelV = "" ;
       this.io = 0 ;
       this.levelNum =1 ;
       this.levelText = this.add.text((this.game.world.width/2),(25),'Level 1 in \n'+ this.levelV,{
        font : '20px monospace', fill : '#15C6FF', align : 'center'
       });
       this.levelText.anchor.setTo(0.5,0.5);

       this.announcement ;
       this.anncExp = 0;


       this.emtr = this.game.add.emitter(0,0,20);
       this.emtr.makeParticles('space_particles') ;
       //this.emtr.minParticleScale = 0.5;
       //this.emtr.maxParticleScale = 0.5;
       this.emtr.physicsBodyType = Phaser.Physics.ARCADE ;
       this.emtr.gravity = 200 ;

       this.lvlUp = false ;
       this.lvlDwn = false ;
       //this.arrcheck = [this.fire,this.updateParticle] ;

       this.allw_bulls = 0 ;
       this.updatelog = this.add.text((this.game.world.width/2),((this.game.world.height/2)+30),' ',{
                font : '15px monospace', fill : '#15C6FF', align : 'center'
        }); ;

	},

	update: function () {
        //if(pointer_1.isDown){
            //console.log("POinter 1 is down");
        if(this.input.activePointer.isDown){
            
            this.fire(this.input.x);
            //this.enemy(this.input.x);
        }
        /**
        if(this.shotDelay>100){
          this.shotDelay-- ;
        }
        else{
          this.shotDelay = 100 ;
        }
        **/
		    this.updateParticle();
        //this.particle_updaters.BasicGame.Level() ;
        this.gravity_check();

        this.spawnEnemey();

        this.enemy_gravity_check();

        this.physics.arcade.overlap(this.laserPool, this.enemyPool, this.enemyHit, null, this);
        this.physics.arcade.overlap(this.green_laserPool, this.enemyPool, this.enemyHit, null, this);
        this.physics.arcade.overlap(this.red_laserPool, this.enemyPool, this.enemyHit, null, this);
        this.physics.arcade.overlap(this.yellow_laserPool, this.enemyPool, this.enemyHit, null, this);
        this.physics.arcade.overlap(this.orange_laserPool, this.enemyPool, this.enemyHit, null, this);
        this.physics.arcade.overlap(this.violet_laserPool, this.enemyPool, this.enemyHit, null, this);

        this.physics.arcade.overlap(this.laserPool, this.blue_enemyPool, this.blue_hit, null, this);
        this.physics.arcade.overlap(this.green_laserPool, this.blue_enemyPool, this.blue_hit, null, this);
        this.physics.arcade.overlap(this.red_laserPool, this.blue_enemyPool, this.blue_hit, null, this);
        this.physics.arcade.overlap(this.yellow_laserPool, this.blue_enemyPool, this.blue_hit, null, this)
        this.physics.arcade.overlap(this.orange_laserPool, this.blue_enemyPool, this.blue_hit, null, this)
        this.physics.arcade.overlap(this.violet_laserPool, this.blue_enemyPool, this.blue_hit, null, this)

        this.physics.arcade.overlap(this.laserPool, this.green_enemyPool, this.green_hit, null, this);
        this.physics.arcade.overlap(this.green_laserPool, this.green_enemyPool, this.green_hit, null, this);
        this.physics.arcade.overlap(this.red_laserPool, this.green_enemyPool, this.green_hit, null, this);
        this.physics.arcade.overlap(this.yellow_laserPool, this.green_enemyPool, this.green_hit, null, this);
        this.physics.arcade.overlap(this.orange_laserPool, this.green_enemyPool, this.green_hit, null, this);
        this.physics.arcade.overlap(this.violet_laserPool, this.green_enemyPool, this.green_hit, null, this);

        this.physics.arcade.overlap(this.planet, this.enemyPool, this.planetHit, null, this);
        this.physics.arcade.overlap(this.planet, this.blue_enemyPool, this.planetHit, null, this);
        this.physics.arcade.overlap(this.planet, this.green_enemyPool, this.planetHit, null, this);

        //this.physics.arcade.overlap(this.enemyPool, this.enemyPool,this.collidingenemy, null);
        
        this.updateScores();
		
	},
	
  
	updateParticle : function() {
		if(this.nextSparticleAt < this.time.now && this.sparticle.countDead() > 0){
            
           
            this.nextSparticleAt = this.time.now + BasicGame.SPARTICLE_ENEMY_DELAY ;

            var spart = this.sparticle.getFirstExists(false); 
            //console.log("Creating enemies ... ")
            //console.log("Dead enemies .. " + this.enemyPool.countDead());
            spart.reset( this.game.world.width/2 , this.game.world.height-80 ) ;
            //spart.anchor.setTo(0.5,0.5);
			      spart.body.velocity.x = this.rnd.integerInRange(-50,50) ;
            spart.body.velocity.y = -this.rnd.integerInRange(0,50) ;
            //enemy.scale.x = 0.5 ;
            //enemy.scale.y = 0.5 ;
            //bullet.scale.y = 0.3 ;
        }
	},
	
    fire : function(x_cor){

        if(this.nextShotAt > this.time.now ){
            return ;
        }

        this.nextShotAt = this.time.now + BasicGame.SHOT_DELAY ;
        //this.shotDelay += 5 ;
        
      
         //var bullet = this.laser_names[this.rnd.integerInRange(0,2)].getFirstExists(false); 
        var bullet = this.laser_names[this.rnd.integerInRange(0,BasicGame.ALLOWED_BULLETS)].getFirstExists(false); 
        bullet.anchor.setTo(0.5,0);
        bullet.reset(x_cor, this.game.world.height) ;
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
            //parameters - x,y,health
            enemy.reset(this.rnd.integerInRange(10,this.game.world.width-10), 0, BasicGame.RED_ENEMY_HEALTH) ;
            enemy.anchor.setTo(0.5,1);
            enemy.body.velocity.y = BasicGame.ENEMY_INIT_SPEED ;
            enemy.scale.x = 0.5 ;
            enemy.scale.y = 0.5 ;
            //bullet.scale.y = 0.3 ;
        }

        if(this.nextblue_EnemyAt < this.time.now && this.blue_enemyPool.countDead() > 0){
            //console.log("Getting new enemies .. ")
            this.nextblue_EnemyAt = this.time.now + BasicGame.BLUE_ENEMY_DELAY ;

            var blue_enemy = this.blue_enemyPool.getFirstExists(false) ;
            blue_enemy.reset(this.rnd.integerInRange(10,this.game.world.width-10),0,BasicGame.BLUE_ENEMY_HEALTH);
            blue_enemy.anchor.setTo(0.5,1);
            blue_enemy.body.velocity.y = BasicGame.ENEMY_INIT_SPEED ;
            blue_enemy.scale.x = 0.5 ;
            blue_enemy.scale.y = 0.5 ;
        }

        if(this.nextgreen_EnemyAt < this.time.now && this.green_enemyPool.countDead() > 0){
            this.nextgreen_EnemyAt = this.time.now + BasicGame.GREEN_ENEMY_DELAY ;
            var green_enemy = this.green_enemyPool.getFirstExists(false);
            green_enemy.reset(this.rnd.integerInRange(10,this.game.world.width-10),0,BasicGame.GREEN_ENEMY_HEALTH);
            green_enemy.anchor.setTo(0.5,1);
            green_enemy.body.velocity.y = BasicGame.ENEMY_INIT_SPEED ;
            green_enemy.scale.x = 0.5 ;
            green_enemy.scale.y = 0.5 ;
        }
    },

    enemyHit : function(bullet, enemy){
        this.emtr.x = bullet.x ;
        this.emtr.y = bullet.y ;
        this.emtr.start(true, 500, null, 10);
        bullet.kill() ;
        //enemy.kill() ;
        enemy.damage(BasicGame.ENEMY_DAMAGE); 
        BasicGame.PLAYER_SCORE += BasicGame.SCORE_POINTS ;
        //console.log("SCORE : "+ BasicGame.PLAYER_SCORE ); 
        
        
    },

    green_hit : function(g_bullet,enemy){
        this.emtr.x = g_bullet.x ;
        this.emtr.y = g_bullet.y ;
        this.emtr.start(true, 500, null, 10);
        enemy.damage(BasicGame.ENEMY_DAMAGE) ;
        g_bullet.kill(); 
        BasicGame.PLAYER_SCORE += BasicGame.SCORE_POINTS ;
    },

    blue_hit : function(r_bullet,enemy){
        this.emtr.x = r_bullet.x ;
        this.emtr.y = r_bullet.y ;
        this.emtr.start(true, 500, null, 10);
        r_bullet.kill();
        enemy.damage(BasicGame.ENEMY_DAMAGE);
        BasicGame.PLAYER_SCORE += BasicGame.SCORE_POINTS ;
    },

    planetHit : function(planet, enemy){
        //console.log("planet hit") ;
        BasicGame.PLAYER_HEALTH -- ;
        this.planet.scale.x -= 0.1 ;
        this.planet.scale.y -= 0.1 ;
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
            if(bullet.y <= BasicGame.GRAVITY_FIELD*s_height){
                bullet.scale.x = 0.3 ;
                bullet.scale.y = 0.3 ;
                bullet.body.velocity.y = -2000 ;
            }
            else{
                bullet.body.velocity.y -= 1 ;   
            }
        });



        this.green_laserPool.forEachAlive(function(bullet){
            if(bullet.y <= BasicGame.GRAVITY_FIELD*s_height){
                bullet.scale.x = 0.3 ;
                bullet.scale.y = 0.3 ;
                bullet.body.velocity.y = -2000 ;
            }
            else{
                bullet.body.velocity.y -= 1 ;   
            }
        });


        this.red_laserPool.forEachAlive(function(bullet){
            if(bullet.y <= BasicGame.GRAVITY_FIELD*s_height){
                bullet.scale.x = 0.3 ;
                bullet.scale.y = 0.3 ;
                bullet.body.velocity.y = -2000 ;
            }
            else{
                bullet.body.velocity.y -= 1 ;   
            }
        });

        this.yellow_laserPool.forEachAlive(function(bullet){
            if(bullet.y <= BasicGame.GRAVITY_FIELD*s_height){
                bullet.scale.x = 0.3 ;
                bullet.scale.y = 0.3 ;
                bullet.body.velocity.y = -2000 ;
            }
            else{
                bullet.body.velocity.y -= 1 ;   
            }
        });

        this.violet_laserPool.forEachAlive(function(bullet){
            if(bullet.y <= BasicGame.GRAVITY_FIELD*s_height){
                bullet.scale.x = 0.3 ;
                bullet.scale.y = 0.3 ;
                bullet.body.velocity.y = -2000 ;
            }
            else{
                bullet.body.velocity.y -= 1 ;   
            }
        });

        this.orange_laserPool.forEachAlive(function(bullet){
            if(bullet.y <= BasicGame.GRAVITY_FIELD*s_height){
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
        if(enemy.y > BasicGame.GRAVITY_FIELD*s_height){

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
        if(BasicGame.PLAYER_SCORE <= BasicGame.LEVEL_BOUND){
            //console.log("Level Up :D ") ;
            /**
            this.levelUp = (this.score_u_bound - BasicGame.PLAYER_SCORE)/10 ;
            //console.log(this.xcd);
            this.levelV = "" ;
            for(io=0;io<=this.levelUp;io++){
                this.levelV += "+" ; 
            }
            //console.log(this.levelV);
            this.levelText.setText("Level "+this.levelNum + " in \n"+ this.levelV);
            //BasicGame.ENEMY_DELAY -= 20 ;
            **/
            this.levelText.setText("Enemy vesrion v" + BasicGame.LEVEL+".0-stable" );
        }
        else {
            this.levelUpdate() ;
            
        }

        if(this.anncExp > 0 && this.time.now > this.anncExp){
            this.announcement.destroy() ;
            this.updatelog.destroy() ;
        }
        
    },

    levelUpdate: function(){
      this.announcement = this.add.text((this.game.world.width/2),(this.game.world.height/2),'Enemy updated',{
                font : '30px monospace', fill : '#15C6FF', align : 'center'
            });
      this.updatelog.destroy() ;
      this.announcement.anchor.setTo(0.5,0.5) ;
      this.anncExp = this.time.now + 5000 ;

      if(BasicGame.PLAYER_SCORE < 200){
        this.updatelog = this.add.text(10,this.game.world.height-10,'Update Log : \n' + 'Red enemies build time decreased.' ,{
                font : '15px monospace', fill : '#15C6FF', align : 'left'
        });
        this.updatelog.anchor.setTo(0,1) ;
        BasicGame.LEVEL = 2 ;
        BasicGame.LEVEL_BOUND = 200 ;
        BasicGame.RED_ENEMY_DELAY = 4000 ;
        //this.allw_bulls = 1 ;
      }

      else if(BasicGame.PLAYER_SCORE < 300){
        this.updatelog = this.add.text((this.game.world.width/2),((this.game.world.height/2)+30),'Update Log : \n' + 'Red enemies build time decreased.' ,{
                font : '15px monospace', fill : '#15C6FF', align : 'center'
        });
        this.updatelog.anchor.setTo(0.5,0.5) ;
        BasicGame.LEVEL = 3 ;
        BasicGame.LEVEL_BOUND = 300 ;
        BasicGame.RED_ENEMY_DELAY = 3000 ;
        //this.allw_bulls = 2 ;
      }

      else if(BasicGame.PLAYER_SCORE < 400){
        this.updatelog = this.add.text((this.game.world.width/2),((this.game.world.height/2)+30),'Update Log : \n' + 'Red enemies build time decreased.' ,{
                font : '15px monospace', fill : '#15C6FF', align : 'center'
        });
        this.updatelog.anchor.setTo(0.5,0.5) ;
        BasicGame.LEVEL = 4 ;
        BasicGame.LEVEL_BOUND = 400 ;
        BasicGame.RED_ENEMY_DELAY = 2000 ;
      }

      else if(BasicGame.PLAYER_SCORE < 500){
        this.updatelog = this.add.text((this.game.world.width/2),((this.game.world.height/2)+30),'Update Log : \n' + 'Red enemies build time decreased.' ,{
                font : '15px monospace', fill : '#15C6FF', align : 'center'
        });
        this.updatelog.anchor.setTo(0.5,0.5) ;
        BasicGame.LEVEL = 5 ;
        BasicGame.LEVEL_BOUND = 500 ;
        BasicGame.RED_ENEMY_DELAY = 1000 ;
      }

      else if(BasicGame.PLAYER_SCORE < 600){
        this.updatelog = this.add.text((this.game.world.width/2),((this.game.world.height/2)+30),'Update Log : \n' + 'Red enemies build time decreased.' ,{
                font : '15px monospace', fill : '#15C6FF', align : 'center'
        });
        this.updatelog.anchor.setTo(0.5,0.5) ;
        BasicGame.LEVEL = 6 ;
        BasicGame.LEVEL_BOUND = 600 ;
        BasicGame.RED_ENEMY_DELAY = 500 ;
      }

      else if(BasicGame.PLAYER_SCORE < 700){
        this.updatelog = this.add.text((this.game.world.width/2),((this.game.world.height/2)+30),'Update Log : \n' + 'Red enemies build back to normal \n'+'Blue enemies build time decreased \n'+ 'Red enemies chasis made harder' ,{
                font : '15px monospace', fill : '#15C6FF', align : 'center'
        });
        this.updatelog.anchor.setTo(0.5,0.5) ;
        BasicGame.LEVEL = 7 ;
        BasicGame.LEVEL_BOUND = 700 ;
        BasicGame.RED_ENEMY_DELAY = 5000 ;
        BasicGame.RED_ENEMY_HEALTH = 2 ;
        BasicGame.BLUE_ENEMY_DELAY = 4000 ;
      }

      else if(BasicGame.PLAYER_SCORE < 800){
        this.updatelog = this.add.text((this.game.world.width/2),((this.game.world.height/2)+30),'Update Log : \n' + 'Blue enemies build time decreased.' ,{
                font : '15px monospace', fill : '#15C6FF', align : 'center'
        });
        this.updatelog.anchor.setTo(0.5,0.5) ;
        BasicGame.LEVEL = 8 ;
        BasicGame.LEVEL_BOUND = 800 ;
        BasicGame.BLUE_ENEMY_DELAY = 3000 ;
      }

      else if(BasicGame.PLAYER_SCORE < 900){
        this.updatelog = this.add.text((this.game.world.width/2),((this.game.world.height/2)+30),'Update Log : \n' + 'Blue enemies build time decreased.' ,{
                font : '15px monospace', fill : '#15C6FF', align : 'center'
        });
        this.updatelog.anchor.setTo(0.5,0.5) ;
        BasicGame.LEVEL = 9 ;
        BasicGame.LEVEL_BOUND = 900 ;
        BasicGame.BLUE_ENEMY_DELAY = 2000 ;
      }

      else if(BasicGame.PLAYER_SCORE < 1000){
        this.updatelog = this.add.text((this.game.world.width/2),((this.game.world.height/2)+30),'Update Log : \n' + 'Blue enemies build time decreased.' ,{
                font : '15px monospace', fill : '#15C6FF', align : 'center'
        });
        this.updatelog.anchor.setTo(0.5,0.5) ;
        BasicGame.LEVEL = 10 ;
        BasicGame.LEVEL_BOUND = 1000 ;
        BasicGame.BLUE_ENEMY_DELAY = 1000 ;
      }

      else if(BasicGame.PLAYER_SCORE < 1100){
        this.updatelog = this.add.text((this.game.world.width/2),((this.game.world.height/2)+30),'Update Log : \n' + 'Blue enemies build time decreased.' ,{
                font : '15px monospace', fill : '#15C6FF', align : 'center'
        });
        this.updatelog.anchor.setTo(0.5,0.5) ;
        BasicGame.LEVEL = 11 ;
        BasicGame.LEVEL_BOUND = 1100 ;
        BasicGame.BLUE_ENEMY_DELAY = 500 ;
      }

      else if(BasicGame.PLAYER_SCORE < 1200){
        this.updatelog = this.add.text((this.game.world.width/2),((this.game.world.height/2)+30),'Update Log : \n' + 'Blue enemies build back to normal \n'+'Green enemies build time decreased \n'+ 'Blue enemies chasis made harder' ,{
                font : '15px monospace', fill : '#15C6FF', align : 'center'
        });
        this.updatelog.anchor.setTo(0.5,0.5) ;
        BasicGame.LEVEL = 12 ;
        BasicGame.LEVEL_BOUND = 1200 ;
        BasicGame.BLUE_ENEMY_DELAY = 5000 ;
        BasicGame.BLUE_ENEMY_HEALTH = 2 ;
        BasicGame.GREEN_ENEMY_DELAY = 4000 ;
      }

      else if(BasicGame.PLAYER_SCORE < 1300){
        this.updatelog = this.add.text((this.game.world.width/2),((this.game.world.height/2)+30),'Update Log : \n' + 'Green enemies build time decreased \n' ,{
                font : '15px monospace', fill : '#15C6FF', align : 'center'
        });
        this.updatelog.anchor.setTo(0.5,0.5) ;
        BasicGame.LEVEL = 13 ;
        BasicGame.LEVEL_BOUND = 1300 ;
        BasicGame.GREEN_ENEMY_DELAY = 3000 ;
      }

      else if(BasicGame.PLAYER_SCORE < 1400){
        this.updatelog = this.add.text((this.game.world.width/2),((this.game.world.height/2)+30),'Update Log : \n' + 'Green enemies build time decreased \n' ,{
                font : '15px monospace', fill : '#15C6FF', align : 'center'
        });
        this.updatelog.anchor.setTo(0.5,0.5) ;
        BasicGame.LEVEL = 14 ;
        BasicGame.LEVEL_BOUND = 1400 ;
        BasicGame.GREEN_ENEMY_DELAY = 2000 ;
      }

      else if(BasicGame.PLAYER_SCORE < 1500){
        this.updatelog = this.add.text((this.game.world.width/2),((this.game.world.height/2)+30),'Update Log : \n' + 'Green enemies build time decreased \n' ,{
                font : '15px monospace', fill : '#15C6FF', align : 'center'
        });
        this.updatelog.anchor.setTo(0.5,0.5) ;
        BasicGame.LEVEL = 15 ;
        BasicGame.LEVEL_BOUND = 1500 ;
        BasicGame.GREEN_ENEMY_DELAY = 1000 ;
      }

      else if(BasicGame.PLAYER_SCORE < 1600){
        this.updatelog = this.add.text((this.game.world.width/2),((this.game.world.height/2)+30),'Update Log : \n' + 'Green enemies build time decreased \n' ,{
                font : '15px monospace', fill : '#15C6FF', align : 'center'
        });
        this.updatelog.anchor.setTo(0.5,0.5) ;
        BasicGame.LEVEL = 16 ;
        BasicGame.LEVEL_BOUND = 1600 ;
        BasicGame.GREEN_ENEMY_DELAY = 500 ;
      }

      else if(BasicGame.PLAYER_SCORE < 1700){
        this.updatelog = this.add.text((this.game.world.width/2),((this.game.world.height/2)+30),'Update Log : \n' + 'Green enemies build back to normal \n'+ 'Green enemies chasis made harder' ,{
                font : '15px monospace', fill : '#15C6FF', align : 'center'
        });
        this.updatelog.anchor.setTo(0.5,0.5) ;
        BasicGame.LEVEL = 17 ;
        BasicGame.LEVEL_BOUND = 1700 ;
        BasicGame.GREEN_ENEMY_DELAY = 5000 ;
        BasicGame.GREEN_ENEMY_HEALTH = 2 ;
      }

      else if(BasicGame.PLAYER_SCORE < 1800){
        this.updatelog = this.add.text((this.game.world.width/2),((this.game.world.height/2)+30),'Update Log : \n' + 'Red enemies powered up \n',{
                font : '15px monospace', fill : '#15C6FF', align : 'center'
        });
        this.updatelog.anchor.setTo(0.5,0.5) ;
        BasicGame.LEVEL = 18 ;
        BasicGame.LEVEL_BOUND = 1800 ;
        BasicGame.RED_ENEMY_HEALTH = 4 ;
      }

      else if(BasicGame.PLAYER_SCORE < 1900){
        this.updatelog = this.add.text((this.game.world.width/2),((this.game.world.height/2)+30),'Update Log : \n' + 'Red enemies powered up \n',{
                font : '15px monospace', fill : '#15C6FF', align : 'center'
        });
        this.updatelog.anchor.setTo(0.5,0.5) ;
        BasicGame.LEVEL = 19 ;
        BasicGame.LEVEL_BOUND = 1900 ;
        BasicGame.BLUE_ENEMY_HEALTH = 4 ;
      }

      else if(BasicGame.PLAYER_SCORE < 2000){
        this.updatelog = this.add.text((this.game.world.width/2),((this.game.world.height/2)+30),'Update Log : \n' + 'Red enemies powered up \n',{
                font : '15px monospace', fill : '#15C6FF', align : 'center'
        });
        this.updatelog.anchor.setTo(0.5,0.5) ;
        BasicGame.LEVEL = 20 ;
        BasicGame.LEVEL_BOUND = 2000 ;
        BasicGame.GREEN_ENEMY_HEALTH = 4 ;
      }

      else if(BasicGame.PLAYER_SCORE < 2100){
        this.updatelog = this.add.text((this.game.world.width/2),((this.game.world.height/2)+30),'Update Log : \n' + 'Red enemies powered up \n',{
                font : '15px monospace', fill : '#15C6FF', align : 'center'
        });
        this.updatelog.anchor.setTo(0.5,0.5) ;
        BasicGame.LEVEL = 21 ;
        BasicGame.LEVEL_BOUND = 2100 ;
        BasicGame.RED_ENEMY_DELAY = 4000 ;
        BasicGame.BLUE_ENEMY_DELAY = 4000 ;
        BasicGame.GREEN_ENEMY_DELAY = 4000 ;
      }

      else if(BasicGame.PLAYER_SCORE < 2200){
        this.updatelog = this.add.text((this.game.world.width/2),((this.game.world.height/2)+30),'Update Log : \n' + 'Red enemies powered up \n',{
                font : '15px monospace', fill : '#15C6FF', align : 'center'
        });
        this.updatelog.anchor.setTo(0.5,0.5) ;
        BasicGame.LEVEL = 22 ;
        BasicGame.LEVEL_BOUND = 2200 ;
        BasicGame.RED_ENEMY_DELAY = 3000 ;
        BasicGame.BLUE_ENEMY_DELAY = 3000 ;
        BasicGame.GREEN_ENEMY_DELAY = 3000 ;
      }

      else if(BasicGame.PLAYER_SCORE < 2300){
        this.updatelog = this.add.text((this.game.world.width/2),((this.game.world.height/2)+30),'Update Log : \n' + 'Red enemies powered up \n',{
                font : '15px monospace', fill : '#15C6FF', align : 'center'
        });
        this.updatelog.anchor.setTo(0.5,0.5) ;
        BasicGame.LEVEL = 23 ;
        BasicGame.LEVEL_BOUND = 2300 ;
        BasicGame.RED_ENEMY_DELAY = 2000 ;
        BasicGame.BLUE_ENEMY_DELAY = 2000 ;
        BasicGame.GREEN_ENEMY_DELAY = 2000 ;
      }

      else if(BasicGame.PLAYER_SCORE < 2400){
        this.updatelog = this.add.text((this.game.world.width/2),((this.game.world.height/2)+30),'Update Log : \n' + 'Red enemies powered up \n',{
                font : '15px monospace', fill : '#15C6FF', align : 'center'
        });
        this.updatelog.anchor.setTo(0.5,0.5) ;
        BasicGame.LEVEL = 24 ;
        BasicGame.LEVEL_BOUND = 2400 ;
        BasicGame.RED_ENEMY_DELAY = 1000 ;
        BasicGame.BLUE_ENEMY_DELAY = 1000 ;
        BasicGame.GREEN_ENEMY_DELAY = 1000 ;
      }

      else if(BasicGame.PLAYER_SCORE < 2500){
        this.updatelog = this.add.text((this.game.world.width/2),((this.game.world.height/2)+30),'Update Log : \n' + 'Red enemies powered up \n',{
                font : '15px monospace', fill : '#15C6FF', align : 'center'
        });
        this.updatelog.anchor.setTo(0.5,0.5) ;
        BasicGame.LEVEL = 25 ;
        BasicGame.LEVEL_BOUND = 2500 ;
        BasicGame.RED_ENEMY_DELAY = 500 ;
        BasicGame.BLUE_ENEMY_DELAY = 500 ;
        BasicGame.GREEN_ENEMY_DELAY = 500 ;
      }

      else{
        BasicGame.PLAYER_SCORE = 0 ;
        BasicGame.GAME_DEFEAT += 1 ;
        BasicGame.LEVEL = 1 ;
        BasicGame.LEVEL_BOUND = 100 ;
        BasicGame.RED_ENEMY_DELAY = 5000 ;
        BasicGame.BLUE_ENEMY_DELAY = 5000 ;
        BasicGame.GREEN_ENEMY_DELAY = 5000 ;
        BasicGame.RED_ENEMY_HEALTH = 1 ;
        BasicGame.BLUE_ENEMY_HEALTH = 1 ;
        BasicGame.GREEN_ENEMY_HEALTH = 1 ;
        BasicGame.ALLOWED_BULLETS = 0 ;
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
