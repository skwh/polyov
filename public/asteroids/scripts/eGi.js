// another version of eGi.js.
var GAME_ON = false;
var INTERVAL_SECONDS = 0.033;
var $_;
var timers = function(){};
(function() {
	window.addEventListener('load',windowLoaded,false);
	function windowLoaded() {
		var consoleOpt, game, devMode = false;
		try {
			var cDom = document.getElementById("theCanvas");
			var ctxt = cDom.getContext("2d");
			var hidden = document.getElementById("eGi_req").textContent;
		} catch (e) {
			alert("ERROR W/windowLoaded, " + e);
			return;	
		}
		hidden = hidden.split(",");
		for (var i=0;i<hidden.length;i++) {
			hidden[i] = hidden[i].toLowerCase();
			if (hidden[i] == "console") {
				consoleOpt = true;	
			} else if (hidden[i] == "hook") {
				var colon = hidden[i+1].indexOf(":") + 1;
				var gName = hidden[i+1].slice(colon);
				game = window[gName];	
			} else if (hidden[i] == "devmode") {
				devMode = true;
			}
		}
		egi = new eGi(consoleOpt,cDom,ctxt,game,devMode);
		egi.start();
	}
	var eGi = function(console,cDom,ctxt,game,devMode) {
		$_ = this;
		this.game = game;
		this.console = console;	
		this.cDom = cDom;
		this.ctxt = ctxt;
		this.devMode = devMode;
	};
	eGi.prototype.start = function() {
		$_.mainMenu();
		this.cDom.addEventListener('click',$_.gameApp,false);
	};
	var Console = function() {};
	Console.log = function(text) {
		if ($_.console) {
			try {
				console.log(text);	
			} catch (e) {
				alert("Console is not supported by the browser. Shutting it off...");
				$_.console = false;
			}
		}
	}
	Console.loggedEvents = [];
	Console.addLoggedEvent = function(items) {
		try {
			Console.loggedEvents.push(items);
		} catch (e) {
			Console.log("ERROR, Cannont push item " + items + " to loggedEvents because of " + e);
		}
	}
	//Custom functions for the game
	eGi.prototype.resetGame = function(scale) {
		if (scale == 1) {
			asteroids.lives = 3;
			asteroids.asteroid_count = 0;
		}
		if (scale == 2) {
			asteroids.lives = 3;
			asteroids.asteroid_count = 0;
			asteroids.score = 0;	
		}
		if (scale == 3) {
			asteroids.lives = 3;
			asteroids.asteroid_count = 0;
			asteroids.score = 0;
			player.statsReset();	
		}
	};
	eGi.prototype.mainMenu = function() {
		$_.mapObjs = [];
		this.backgroundColor = "#111";
		this.ctxt.fillStyle = "#111";
		this.ctxt.font = "24pt Courier New";
		this.ctxt.fillRect(0,0,this.cDom.width,this.cDom.height);
		this.ctxt.fillStyle = "#FFF";
		this.ctxt.fillText("ASTEROIDS",160,230);
		this.ctxt.font = "18pt Courier New";
		this.ctxt.fillText("Click to start!",140,260);	
	};
	eGi.prototype.gameApp = function() {
		if (GAME_ON !== true) {
			$_.mapObjs = [];
			window.addEventListener('keydown',$_.keyDownListener,false);
			window.addEventListener('keyup',$_.keyUpListener,false);
			$_.ctxt.clearRect(0,0,500,500);
			if ($_.devMode === true) {
				var r = confirm("Start cycle?");
				if (r) {
					timers.cycle1 = setInterval($_.cycle,toMS(INTERVAL_SECONDS));
				}
			} else {
				timers.cycle1 = setInterval($_.cycle,toMS(INTERVAL_SECONDS));	
			}
			$_.updateObjs();
			$_.setGameObjects();
			GAME_ON = true;
		}
	};
	eGi.prototype.drawObjs = function() {
		if (GAME_ON) {
			for (var i=0;i<$_.mapObjs.length;i++) {
				$_.mapObjs[i].draw($_.ctxt);
			}
		}
	};
	eGi.prototype.updateObjs = function() {
		$_.mapObjs = [];
		$_.mapObjs.push(player);
	};
	eGi.prototype.clear = function() {
		$_.ctxt.clearRect(0,0,500,500);
	};
	eGi.prototype.drawGui = function() {
		if (GAME_ON) {	
			$_.ctxt.font = "18pt Courier New";
			$_.ctxt.fillText(asteroids.score,5,25);
			var place = 45;
			for (var i=0;i<asteroids.lives;i++) {
				place += 20;
				$_.ctxt.drawImage(p_sprite,place,8);
			}
			place = 135;
			$_.ctxt.strokeStyle = "#FFFFFF";
			$_.ctxt.strokeRect(place,5,101,25);
			$_.ctxt.fillStyle = "#FF0000";
			$_.ctxt.fillRect(136,6,player.hull,23);
			$_.ctxt.fillStyle = "#FFFFFF";
			$_.ctxt.font = "12pt Courier New";
			$_.ctxt.fillText("Hull: " + player.hull + "%",136,25);
		}
	};
	eGi.prototype.cycle = function() {
		$_.clear();
		$_.checkCollisions();
		$_.drawObjs();
		$_.drawGui();
	};
	eGi.prototype.checkCollisions = function() {
		if (asteroids.asteroid_count <= 0) {
			$_.gameWin();	
			return;
		}
		for (var i=0;i<$_.mapObjs.length;i++) { //get one object to check
			var superBox = $_.mapObjs[i].hitBox; //get it's properties
			var objectName = $_.mapObjs[i].name;
			var isAsteroid =(objectName.indexOf("asteroid") == -1)?false:true; //is the object an asteroid?
			for (var y=0;y<$_.mapObjs.length;y++) { //get the object to check it against
				if (objectName !== $_.mapObjs[y].name) { //if we are not checking the object against its self
					var subName = $_.mapObjs[y].name;
					var subIsAsteroid = (subName.indexOf("asteroid") == -1)?false:true; //is the second object an asteroid?
					if (!(isAsteroid) || !(subIsAsteroid)) { //if we are not checking two asteroids against each other
						var subBox = $_.mapObjs[y].hitBox;
						var collision = rectIntersectsRect(superBox,subBox); //check for a collision using rectIntersectsRect
						if (collision) { //if there is a collision
							if ((objectName == "player" && subIsAsteroid) || (isAsteroid && subName == "player")) { //if either of the objects are the player, than the player dies
								var typeofAsteroid;
								if (subIsAsteroid)
									typeofAsteroid = subName.slice(subName.indexOf("tp_")+3);
								else
									typeofAsteroid = objectName.slice(objectName.indexOf("tp_")+3);
								if (typeofAsteroid == "big")
									player.death();		
								else if (typeofAsteroid == "med") {
									asteroids.asteroid_count--;
									player.damage(50);
									if (subIsAsteroid)
										$_.mapObjs.splice(y,1);
									else
										$_.mapObjs.splice(i,1);	
								} else if (typeofAsteroid == "sm") {
									asteroids.asteroid_count--;
									player.damage(25);
									if (subIsAsteroid)
										$_.mapObjs.splice(y,1);
									else
										$_.mapObjs.splice(i,1);
								}
								if (player.hull <= 0)
									player.death();
							} else if ((objectName == "blankObject" && subIsAsteroid) || (isAsteroid && subName == "blankObject")) { //if either of the objects are a bullet, then we destroy the asteroid @TODO: and the bullet, create more asteroids
								if (objectName == "blankObject") {
									$_.mapObjs[i].collided = true;
								} else if (subName == "blankObject") {
									$_.mapObjs[y].collided = true;
								}
								asteroids.asteroid_count--;
								if (isAsteroid) {
									asteroids.score += $_.mapObjs[i].scoreWorth;
									$_.mapObjs[i].breakUp();
								} else if (subIsAsteroid) {
									asteroids.score += $_.mapObjs[y].scoreWorth;
									$_.mapObjs[y].breakUp();	
								}
								Console.addLoggedEvent("The items being removed from $_.mapObjs are " + $_.mapObjs[i].name + " and " + $_.mapObjs[y].name + ".");
								$_.mapObjs.splice(Math.max(i,y),1);
								$_.mapObjs.splice(Math.min(i,y),1);
							}
						}
					}
				}
			}
		}
		var playerPos = $_.mapObjs.indexOf(player);
		if (playerPos == -1)
			$_.mapObjs.unshift(player);
	};
	eGi.prototype.setGameObjects = function() {
		if ($_.mapObjs.length > 2) {
			$_.updateObjs();	
		}
		var as1 = new asteroid(rn("coord"),rn("coord"),1,rn("rot"));
		$_.mapObjs.push(as1);
		var as2 = new asteroid(rn("coord"),rn("coord"),2,rn("rot"));
		$_.mapObjs.push(as2);
		var as3 = new asteroid(rn("coord"),rn("coord"),2,rn("rot"));
		$_.mapObjs.push(as3);
		var as4 = new asteroid(rn("coord"),rn("coord"),2,rn("rot"));
		$_.mapObjs.push(as4);
		var as5 = new asteroid(rn("coord"),rn("coord"),2,rn("rot"));
		$_.mapObjs.push(as5);
		asteroids.asteroid_count = 5;
	};
	eGi.prototype.gameOver = function() {
		clearInterval(timers.cycle1);
		GAME_ON = false;
		var restart = confirm("GAME OVER! FINAL SCORE:" + asteroids.score + " PLAY AGAIN?");
		$_.resetGame(3);
		$_.ctxt.clearRect(0,0,500,500);
		if (restart) {
			$_.gameApp();	
		} else if (!restart) {
			$_.mainMenu();	
		}
	};
	eGi.prototype.gameWin = function() {
		clearInterval(timers.cycle1);
		GAME_ON = false;
		var restart = confirm("YOU WIN! FINAL SCORE: " + asteroids.score + " PLAY AGAIN?");
		$_.resetGame(3);
		$_.ctxt.clearRect(0,0,500,500);
		if (restart) {
			$_.gameApp();
		} else {
			$_.mainMenu();	
		}
	};
	eGi.prototype.keyUpListener = function(event) {
		switch (event.keyCode) {
			case 32:
				player.firing = false;
				break;
			case 37:
				player.movingLeft = false;
				break;
			case 38:
				player.movingUp = false;
				break;
			case 39:
				player.movingRight = false;
				break;
			case 40:
				player.slowingDown = false;
				break;
			default:
				Console.loggedEvents.push("Case not found in keyUpListener " + event.keyCode);
				break;
		}
	};
	eGi.prototype.keyDownListener = function(event) {
		switch (event.keyCode) {
			case 32:
				player.fire();
				break;
			case 37:
				player.movingLeft = true;
				break;
			case 38:
				player.movingUp = true;
				break;
			case 39:
				player.movingRight = true;
				break;
			case 40:
				player.slowingDown = true;
				break;
			default:
				Console.loggedEvents.push("Case not found in keyDownListener " + event.keyCode);
				break;	
		}
	};
	// End of eGi.js
	// Asteroids.js, a really stupid script that I wrote
	function sF(number) {
		return Math.floor(number);	
	}
	function rn(type) {
		if (type == "coord") {
			return (Math.floor(Math.random()*$_.cDom.width)-15);	
		} else if (type == "rot") {
			return Math.floor(Math.random()*360);
		} else if (type == "break") {
			return Math.floor(Math.random()*5);	
		}
	}
	function drawBoundingBox(hitBox,context,color) {
		context.strokeStyle=color;
		context.beginPath();
		context.moveTo(hitBox.C1[0],hitBox.C1[1]);
		context.lineTo(hitBox.C2[0],hitBox.C2[1]);
		context.lineTo(hitBox.C3[0],hitBox.C3[1]);
		context.lineTo(hitBox.C4[0],hitBox.C4[1]);
		context.lineTo(hitBox.C1[0],hitBox.C1[1]);
		context.stroke();
	}
	function measureBox(x1,y1,x2,y2) {
		this.width = x2-x1;
		this.height = y2-y1;
		this.center = [this.width/2,this.height/2];
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;
	}
	function hitBox(x1,y1,x2,y2) {
		this.coords = [x1,y1,x2,y2];
		this.width = x2-x1;
		this.height = y2-y1;
	}
	hitBox.prototype.setCoords = function(x1,y1,x2,y2) {
		this.coords = [x1,y1,x2,y2];
		this.C1 = [x1,y1];
		this.C2 = [x2,y1];
		this.C3 = [x2,y2];
		this.C4 = [x1,y2];
		this.left = x1;
		this.top = y1;
		this.right = x2;
		this.bottom = y2;
	};
	function rectIntersectsRect(hitBox1,hitBox2) {
		if (!(hitBox1 instanceof hitBox) || !(hitBox2 instanceof hitBox)) {
			Console.addLoggedEvent("ERROR: INCORRECT VARIABLE TYPE PASSED TO rectIntersectsRect " + typeof hitBox1 + "," + typeof hitBox2);
			return;	
		} else {
			var isHorizontalCollision;
			var isVerticalCollision;
			var isContainedCollision;
			if (hitBox1.left < hitBox2.left && hitBox2.left < hitBox1.right)
				isHorizontalCollision = true;
			if (hitBox1.left < hitBox2.right && hitBox2.right < hitBox1.right)
				isHorizontalCollision = true;
			if (hitBox1.top < hitBox2.top && hitBox2.top < hitBox1.bottom)
				isVerticalCollision = true;
			if (hitBox1.top < hitBox2.bottom && hitBox2.bottom < hitBox1.bottom)
				isVerticalCollision = true;
			if (!isHorizontalCollision && !isVerticalCollision) {
				if (hitBox2.left < hitBox1.left && hitBox1.left < hitBox2.right) {
					if (hitBox2.top < hitBox1.top && hitBox1.top < hitBox2.bottom) {
						isContainsCollision = true;
					}
				}
			}
			if ((isHorizontalCollision && isVerticalCollision) || isContainedCollision)
				return true;
			else 
				return false;
		}
	};
	function toRadians(degrees) {
		return degrees * (Math.PI/180);	
	}
	function toMS(seconds) {
		return seconds*1000;	
	}
	var p_sprite = new Image();
	p_sprite.src = "plr.png";
	var p_sprite_2 = new Image();
	p_sprite_2.src = "plr3.png";
	var p_sprite_3 = new Image();
	p_sprite_3.src = "plr4.png";
	var p_sprite_4 = new Image();
	p_sprite_4.src = "plr_death.png";
	var a_sprite = new Image();
	a_sprite.src = "asteroid_test.png";
	var a2_sprite = new Image();
	a2_sprite.src = "asteroid_stg2.png";
	var a3_sprite = new Image();
	a3_sprite.src = "asteroid_stg3.png";
	var b_sprite = new Image();
	b_sprite.src = "bullet.png";
	var player = {
		x:250,
		y:250,
		sx:0,
		sy:0,
		sprite:p_sprite,
		rot:0,
		hull:100,
		name:"player",
		speed:1,
		rotspeed:5,
		firing:false,
		alive:true,
		invincible:true,
		resetting:false,
		movingLeft:false,
		movingRight:false,
		movingUp:false,
		slowingDown:false,
		decay:0.97,
		bSpeed:0.94,
		mSpeed:5,
		currentSpeed:0,
		hitBox:new hitBox(this.x,this.y,this.x+19,this.y+19),
		idColor:"#00CAF7",
		measureBox:new measureBox(0,0,19,19),
		draw:(function(context) {
			if (this.alive) {
				if (this.movingLeft) this.rot -= this.rotspeed;
				if (this.movingRight) this.rot += this.rotspeed;
				if (this.slowingDown) {
					this.sx *= this.bSpeed;
					this.sy *= this.bSpeed;
					if (Math.floor(this.currentSpeed) !== 0) this.sprite = p_sprite_3;
				} else {
					if (this.movingUp) {
						this.sx += this.speed * Math.sin(toRadians(this.rot));
						this.sy += this.speed * Math.cos(toRadians(this.rot));
						this.sprite = p_sprite_2;
					} else {
						this.sprite = p_sprite;
						this.sx *= this.decay;
						this.sy *= this.decay;
					}
				}
				this.currentSpeed = Math.sqrt((this.sx*this.sx) + (this.sy * this.sy));
				if (this.currentSpeed > this.mSpeed) {
					this.sx *= this.mSpeed/this.currentSpeed;
					this.sy *= this.mSpeed/this.currentSpeed;
				}
				this.x += this.sx;
				this.y -= this.sy;
				if (this.x > canvas.width+this.measureBox.width) {
					this.x = 0;
				} else if (this.x < -(this.measureBox.width)) {
					this.x = canvas.width-18;
				}
				if (this.y > canvas.height+this.measureBox.height) {
					this.y = 0;
				} else if (this.y < -(this.measureBox.height)) {
					this.y = canvas.height;
				}
				context.save();
				context.translate(this.x+this.measureBox.center[0],this.y+this.measureBox.center[1]);
				context.rotate(toRadians(this.rot));
				context.translate(-(this.x+this.measureBox.center[0]),-(this.y+this.measureBox.center[1]));
				context.drawImage(this.sprite,this.x,this.y);
				this.hitBox.setCoords(sF(this.x),sF(this.y),sF(this.x+19),sF(this.y+19));
				if ($_.devMode) drawBoundingBox(this.hitBox,context,this.idColor);	
				context.restore();
			}
		}),
		fire:function() {
			var thing = this;
			if (!this.firing && this.alive) {
				var blankObject = new bullet(this.x+this.measureBox.center[0]-2,this.y+this.measureBox.center[1],this.rot,"blankObject"); 
				$_.mapObjs.unshift(blankObject);
				this.firing = true;
				setTimeout((function() {
					if (!blankObject.collided) {
						$_.mapObjs.shift();
					}
					thing.firing = false;
				}),toMS(0.9));
			} else {
				if ($_.devMode) Console.log("Player is firing or dead, not allowed to fire");
			}
		},
		death:function() {
			this.alive = false;
			var thing = this;
			if (asteroids.lives > 0 && !this.alive) {
				if (!this.resetting) {
					--asteroids.lives;
					this.resetting = true;
				}
				this.statsReset();
				setTimeout((function() {
					thing.alive = true;
					thing.resetting = false;
				}),toMS(3));
			} else {
				if ($_.devMode) {
					var c = confirm("Player has " + asteroids.lives + " remaining. Game over! Continue?");
					if (c) {
						$_.gameOver();
					}
				} else {
					$_.gameOver();
				}
			}
		},
		statsReset:function() {
			this.x = 250;
			this.y = 250;
			this.sx = 0;
			this.sy = 0;
			this.rot = 0;
			this.hull = 100;
			this.currentSpeed = 0;
			this.movingLeft = false;
			this.movingRight =false;
			this.movingUp = false;
			this.slowingDown = false;
			this.sprite = p_sprite;
		},
		damage:(function(damage) {
			player.hull -= damage;
		})
	}
	function bullet(x,y,rot,name) {
		this.x = x;
		this.y = y;
		this.sx = 0;
		this.sy = 0;
		this.speed = 1;
		this.maxSpeed = 20;
		this.rot = rot;
		this.life = 1;
		this.sprite = b_sprite;
		this.name = name;
		this.measureBox = new measureBox(0,0,7,10);
		this.hitBox = new hitBox(this.x,this.y,this.x+7,this.y+10);
		this.idColor = "#F20000";
		this.collided = false;
	}
	bullet.prototype.draw = function(context) {
		if (this.x > canvas.width+this.measureBox.width) {
			this.x = 0;
		} else if (this.x < -(this.measureBox.width)) {
			this.x = canvas.width-18;
		}
		if (this.y > canvas.height+this.measureBox.height) {
			this.y = 0;
		} else if (this.y < -(this.measureBox.height)) {
			this.y = canvas.height;
		} 
		this.sx += this.speed * Math.sin(toRadians(this.rot));
		this.sy += this.speed * Math.cos(toRadians(this.rot));
		var cSpeed = Math.sqrt((this.sx*this.sx) + (this.sy * this.sy));
		if (cSpeed > this.maxSpeed) {
			this.sx *= this.maxSpeed/cSpeed;
			this.sy *= this.maxSpeed/cSpeed;	
		}
		this.x += this.sx;
		this.y -= this.sy;
		context.save();
		context.translate(this.x+this.measureBox.center[0],this.y+this.measureBox.center[1]);
		context.rotate(toRadians(this.rot));
		context.translate(-(this.x+this.measureBox.center[0]),-(this.y+this.measureBox.center[1]));
		context.drawImage(this.sprite,this.x,this.y);
		this.hitBox.setCoords(sF(this.x),sF(this.y),sF(this.x+7),sF(this.y+10));
		if ($_.devMode) drawBoundingBox(this.hitBox,context,this.idColor);
		context.restore();
	}
	function asteroid(x,y,speed,rot) {
		this.x = x;
		this.y = y;
		this.sx = 0;
		this.sy = 0;
		this.sprite = a_sprite;
		this.speed = speed;
		this.rot = rot;
		this.spriteRot = 0;
		this.rotSpeed = this.speed/3;
		this.maxSpeed = this.speed;
		this.measureBox = new measureBox(0,0,41,35);
		this.hitBox = new hitBox(this.x,this.y,this.x+41,this.y+35);
		this.idColor = "#0036D9";
		this.name = "asteroid_" + sF(this.rot) + " tp_big";
		this.stage = 1;
		this.scoreWorth = 5;
	}
	asteroid.prototype.draw = function(context) {
		if (this.x > canvas.width+this.measureBox.width) {
			this.x = 0;
		} else if (this.x < -(this.measureBox.width)) {
			this.x = canvas.width-this.measureBox.width;
		}
		if (this.y > canvas.height+this.measureBox.height) {
			this.y = 0;
		} else if (this.y < -(this.measureBox.height)) {
			this.y = canvas.height;
		}
		this.sx += this.speed * Math.sin(toRadians(this.rot));
		this.sy += this.speed * Math.cos(toRadians(this.rot));
		var cSpeed = Math.sqrt((this.sx*this.sx) + (this.sy * this.sy));
		if (cSpeed > this.maxSpeed) {
			this.sx *= this.maxSpeed/cSpeed;
			this.sy *= this.maxSpeed/cSpeed;	
		}
		this.x += this.sx;
		this.y -= this.sy;
		this.spriteRot += this.rotSpeed;
		context.save();
		context.translate(this.x+this.measureBox.center[0],this.y+this.measureBox.center[1]);
		context.rotate(toRadians(this.spriteRot));
		context.translate(-(this.x+this.measureBox.center[0]),-(this.y+this.measureBox.center[1]));
		context.drawImage(this.sprite,this.x,this.y);
		this.hitBox.setCoords(sF(this.x),sF(this.y),sF(this.x+this.measureBox.x2),sF(this.y+this.measureBox.y2));
		if ($_.devMode) drawBoundingBox(this.hitBox,context,this.idColor);
		context.restore();
	}
	asteroid.prototype.breakUp = function() {
		if (this.stage >= 3)
			return;
		var numAsteroids = sF(sF(Math.random()*10)/2);
		if (numAsteroids <= 0) numAsteroids = 2;
		if (numAsteroids >= 4) numAsteroids = 3;
		asteroids.asteroid_count += numAsteroids;
		var currentX = this.x;
		var currentY = this.y;
		var newStage = ++this.stage;
		for (var i=0;i<numAsteroids;i++) {
			if (newStage <= 3) {			
				var splitAsteroid = new asteroid(this.x,this.y,this.speed,rn("rot"));
				splitAsteroid.stage = newStage;
				if (splitAsteroid.stage == 2) {
					splitAsteroid.sprite = a2_sprite;
					splitAsteroid.hitBox = new hitBox(splitAsteroid.x,splitAsteroid.y,splitAsteroid.x+20,splitAsteroid.y+17);
					splitAsteroid.measureBox = new measureBox(0,0,20,17);
					splitAsteroid.scoreWorth = 10;
					splitAsteroid.name = splitAsteroid.name.replace(/tp_big/,"tp_med");
				} else if (splitAsteroid.stage == 3) {
					splitAsteroid.sprite = a3_sprite;
					splitAsteroid.hitBox = new hitBox(splitAsteroid.x,splitAsteroid.y,splitAsteroid.x+10,splitAsteroid.y+9);
					splitAsteroid.measureBox = new measureBox(0,0,10,9);
					splitAsteroid.scoreWorth = 15;
					splitAsteroid.name = splitAsteroid.name.replace(/(tp_med|tp_big)/,"tp_sm");
				}
				$_.mapObjs.push(splitAsteroid);
			}	
		}
	}
	var asteroids = {
		name:"asteroids",
		obj:objects,
		plr:player,
		ammo:bullet,
		type:"game",
		lives:3,
		score:0,
		asteroid_count:0
	}
	var canvas = new measureBox(0,0,500,500);
	var objects = [player];
})();