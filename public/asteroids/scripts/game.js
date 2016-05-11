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
	fire:(function() {
		var thing = this;
		if (!this.firing) {
			var blankObject = new bullet(this.x+this.measureBox.center[0]-2,this.y+this.measureBox.center[1],this.rot,"blankObject"); 
			$_.mapObjs.unshift(blankObject);
			this.firing = true;
			var timer2 = setTimeout((function() {
				if (!blankObject.collided) {
					$_.mapObjs.shift();
				}
				thing.firing = false;
			}),toMS(0.9));
		}
	}),
	death:(function() {
		this.alive = false;
		var thing = this;
		if (asteroids.lives >= 0 && !this.alive) {
			if (!this.resetting) {
				--asteroids.lives;
				Console.log(asteroids.lives);
				this.resetting = true;
			}
			this.statsReset(0);
			var timer3 = setTimeout((function() {
				thing.alive = true;
				thing.resetting = false;
			}),toMS(3));
		} else {
			$_.gameOver();
			this.statsReset(1);	
		}
	}),
	statsReset:(function(scale) {
		this.x = 250;
		this.y = 250;
		this.sx = 0;
		this.sy = 0;
		this.rot = 0;
		this.currentSpeed = 0;
		this.sprite = p_sprite;
		if (scale == 1) {
			asteroids.lives = 3;
		}
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
	this.name = "asteroid_" + sF(this.rot);
	this.stage = 1;
	this.scoreWorth = 5;
}
asteroid.prototype.draw = function(context) {
	if (this.x > canvas.width+this.measureBox.width) {
		this.x = 0;
	} else if (this.x < -(this.measureBox.width)) {
		this.x = canvas.width-41;
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
	ASTEROID_COUNT += numAsteroids;
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
			} else if (splitAsteroid.stage == 3) {
				splitAsteroid.sprite = a3_sprite;
				splitAsteroid.hitBox = new hitBox(splitAsteroid.x,splitAsteroid.y,splitAsteroid.x+10,splitAsteroid.y+9);
				splitAsteroid.measureBox = new measureBox(0,0,10,9);
				splitAsteroid.scoreWorth = 15;
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
	lives:3
}
var canvas = new measureBox(0,0,500,500);
var objects = [player];