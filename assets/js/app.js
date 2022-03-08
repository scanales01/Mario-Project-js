class Sprite
{
	constructor(x1, y1, width1, height1, type1, image_url)
	{
        this.image_loc = "assets/images/"
		this.x = x1;
		this.y = y1;
		this.width = width1;
		this.height = height1;
		this.type = type1;
		this.image = new Image();
		this.image.src = this.image_loc.concat(image_url);
		this.remove = false;
		this.remove_q = false;
		//this.update = update_method;
		//this.onclick = onclick_method;
	}
	change_image(new_image)
	{
		this.image.src = this.image_loc.concat(new_image);
	}
	move(dx, dy)
	{
		this.dest_x = this.x + dx;
		this.dest_y = this.y + dy;
	}
	
	store_prev_pos()
	{
		this.px = this.x;
		this.py = this.y;
	}
}


class Goomba extends Sprite
{
	constructor(x, y, width, height, type, image_url)
	{
		super(x, y, width, height, type, image_url);
		this.goomba_images = [];
		this.goomba_images.push(new Image());
		this.goomba_images[0].src = image_url;
		this.goomba_images.push(new Image());
		this.goomba_images[1].src = "goomba2.png";
		this.speed = 5;
		this.collide = false;
		this.fire = false;
		this.burn = 0;
	}
	
	update()
	{
		if(this.fire)
		{
			this.change_image("goomba2.png");
			this.remove_q = true;
			this.speed = 0;
			this.burn++;
			if(this.burn > 50)
			{
				this.remove = true;
			}
		}
		if(this.collide)
		{
			this.speed = -this.speed;
			this.collide = false;
		}
		this.x += this.speed;
	}
	
	onclick(x, y)
	{
	
	}
	
	collision_exit(t)
	{
		if(this.x + this.width >= t.x)
		{
			this.collide = true;
			if(t.type === "fireball")
				this.fire = true;
		}
		if(this.x <= t.x + t.width)
		{
			this.collide = true;
			if(t.type === "fireball")
				this.fire = true;
		}
	}
}

class Fireball extends Sprite
{
	constructor(x, y, width, height, type, image_url)
	{
		super(x, y, width, height, type, image_url);
		this.x_speed = 8;
		this.vert_velocity = 1.2;
		this.collide = false;
	}
	
	update()
	{
		if(this.y > 500 - this.height)
		{
			this.bounce();
			this.y += this.vert_velocity;
		}
		else
		{
			this.vert_velocity += 2;
			this.y += this.vert_velocity;
		}
		this.x += this.x_speed;
		//if(this.x - ( - 200) > 800)
			//this.remove = true;
	}
	
	bounce()
	{
		this.vert_velocity = -10;
	}
	
	collision_exit(t)
	{
		if(this.x + this.width > t.x)
		{
			this.collide = true;
			if(t.type === "goomba" && t.remove_q == false)
				this.remove = true;
		}	
		if(this.x < t.x + t.width)
		{
			this.collide = true;
			if(t.type === "goomba" && t.remove_q == false)
				this.remove = true;
		}	
	}
	
	onClick(x, y)
	{
	
	}
}


class Mario extends Sprite
{
	constructor(x, y, width, height, type, image_url)
	{
		super(x, y, width, height, type, image_url);
		
		//images
		this.mario_images = [];
		this.mario_images.push(new Image());
		this.mario_images[0].src = image_url;
		for(let i = 1; i < 6; i++)
		{
			this.mario_images.push(new Image());
			this.mario_images[i].src = "mario" + i + ".png";
		}
		this.image_num = 0;
		
		//gravity
		this.vert_velocity = 2.0;
		this.onSurface = false;
		
		//jumping
		this.inAir = false;
		this.airTime = 0;
		this.jump = false;
		this.attack = false;
	}
	
	update()
	{
		//ground & tube physics
		this.vert_velocity += 1.3;
		this.dest_y += this.vert_velocity;
		
		if(this.onSurface == true)
		{
			this.vert_velocity = 0.0;
			this.inAir = false;
			this.airTime = 0;
		}
		else
			this.inAir = true;	
		
		//jump
		if(this.jump == true && this.airTime <= 5)
		{
			this.vert_velocity += -5.0;
			this.airTime++;
			this.inAir = true;
		}
		
		if(this.dest_x === undefined)
		{
			this.image_num = 0;
			return;
		}
		if(this.x < this.dest_x)
		{
			this.x += 5;
			this.image_num = (this.image_num + 1)%6;
			if(this.image_num === 0)
				this.image_num++;
		}
		else if(this.x > this.dest_x)
		{
			this.x += -5;
			this.image_num = (this.image_num + 1)%6;
			if(this.image_num === 0)
				this.image_num++;
		}
		if(this.y < this.dest_y)
			this.y += this.vert_velocity;
		else if(this.y > this.dest_y)
			this.y += this.vert_velocity;
		this.change_image("mario" + this.image_num + ".png");
		this.onSurface = false;
		this.attack = false;
	}
	
	onclick(x, y)
	{
		//this.dest_x = x;
		//this.dest_y = y;
	}
	
	attack()
	{
		this.attack = true;
	}
	
	collision_exit(t)
	{
		if(this.x + this.width >= t.x && this.px + this.width <= t.x)
		{
			this.x = t.x - this.width;
			this.dest_x = this.x;
		}
		if(this.x <= t.x + t.width && this.px >= t.x + t.width)
		{
			this.x = t.x + t.width;
			this.dest_x = this.x;
		}
		if(this.y <= t.y + t.height && this.py >= t.y + t.height)
		{
			this.y = t.y + t.height;
			this.dest_y = this.y;
		}
		if(this.y + this.height >= t.y && this.py + this.height <= t.y)
		{
			this.y = t.y - this.height;
			this.dest_y = this.y;
			this.onSurface = true;
		}
	}
}

class Tube extends Sprite
{
	constructor(x, y, width, height, type, image_url)
	{
		super(x, y, width, height, type, image_url);
	}
	
	update()
	{
	
	}
	
	onclick(x, y)
	{
	
	}
}

class brick extends Sprite
{
	constructor(x, y, width, height, type, image_url)
	{
		super(x, y, width, height, type, image_url);
	}
	
	update()
	{
	
	}
	
	onclick(x, y)
	{
	
	}
}


class Model
{
	constructor()
	{
		this.sprites = [];
		//this.sprites.push(new Sprite(200, 100, "lettuce.png", Sprite.prototype.sit_still, Sprite.prototype.ignore_click));
		//this.turtle = new Sprite(50, 50, "turtle.png", Sprite.prototype.go_toward_destination, Sprite.prototype.set_destination);
		this.sprites.push(new Tube(400, 450, 55, 400, "tube", "tube.png"));
		this.mario = new Mario(200, 405, 60, 95, "mario", "mario0.png");
		this.sprites.push(this.mario);
		this.sprites.push(new Tube(650, 350, 55, 400, "tube", "tube.png"));
		this.sprites.push(new Goomba(470, 382, 99, 118, "goomba", "goomba1.png"));
		for(let i = 0; i < 800; i+= 16)
		{
			this.sprites.push(new brick(i, 500, 16, 16, "brick", "ground.png"));
			for(let j = 516; j < 600; j += 16)
			{
				this.sprites.push(new brick(i, j, 16, 16, "brick", "ground.png"));
			}
		}
	}

	update()
	{
		if(this.mario.attack)
			this.sprites.push(new Fireball(this.mario.x - (this.mario.width/2), this.mario.y + (this.mario.height/3), 47, 47, "fireball", "fireball.png"));
		for(let i = 0; i < this.sprites.length; i++)
		{
			this.sprites[i].update();
			if(this.sprites[i].type === "goomba" || this.sprites[i].type === "fireball")
			{
				if(this.sprites[i].remove == true)
				{
					this.sprites.splice(i, 1);
					this.update();
					break;
				}
			}
			if(this.sprites[i].type === "mario" || this.sprites[i].type === "goomba")
				this.collision(this.sprites[i]);
		}
	}

	onclick(x, y)
	{
		for(let i = 0; i < this.sprites.length; i++)
		{
			this.sprites[i].onclick(x, y);
		}
	}

	move(dx, dy)
	{
		this.mario.move(dx, dy);

	}
	
	collision(t)
	{
		for(let i = 0; i < this.sprites.length; i++)
		{
			let temp = this.sprites[i];
			//let temp2 = this.sprites[i+1%this.sprites.length];
			if(temp.type === "tube" || temp.type === "brick")
			{
				if(t.x >= temp.x + temp.width)
					continue;
				if(t.x + t.width <= temp.x)
					continue;
				if(t.y >= temp.y + temp.height)
					continue;
				if(t.y + t.height <= temp.y)
					continue;
				t.collision_exit(temp);
			}
			if(temp.type === "fireball" && t.type === "goomba")
			{
				if(t.x >= temp.x + temp.width)
					continue;
				else if(t.x + t.width <= temp.x)
					continue;
				else if(t.y >= temp.y + temp.height)
					continue;
				else if(t.y + t.height <= temp.y)
					continue;
				else
				{
					t.collision_exit(temp);
					temp.collision_exit(t);
				}
			}
		}
	}
}




class View
{
	constructor(model)
	{
		this.model = model;
		this.canvas = document.getElementById("game-box");
		//this.mario = new Image();
		//this.mario.src = "mario0.png";
	}

	update()
	{
		let ctx = this.canvas.getContext("2d");
		ctx.fillStyle = '#80FFFF';
		ctx.fillRect(0, 0, 800, 600);
		for(let i = 0; i < this.model.sprites.length; i++)
		{
			let sprite = this.model.sprites[i];
			ctx.drawImage(sprite.image, sprite.x - (this.model.sprites[1].x - 200), sprite.y);
		}
	}
}




class Controller
{
	constructor(model, view)
	{
		this.model = model;
		this.view = view;
		this.key_right = false;
		this.key_left = false;
		this.key_up = false;
		this.key_down = false;
		let self = this;
		view.canvas.addEventListener("click", function(event) { self.onClick(event); });
		document.addEventListener('keydown', function(event) { self.keyDown(event); }, false);
		document.addEventListener('keyup', function(event) { self.keyUp(event); }, false);
	}

	onClick(event)
	{
		this.model.onclick(event.pageX - this.view.canvas.offsetLeft, event.pageY - this.view.canvas.offsetTop);
	}

	keyDown(event)
	{
		if(event.keyCode == 39) this.key_right = true;
		else if(event.keyCode == 37) this.key_left = true;
		else if(event.keyCode == 38 || event.keyCode == 32) this.key_up = true;
		else if(event.keyCode == 40) this.key_down = true;
		else if(event.keyCode == 17)
			this.model.mario.attack = false;
	}

	keyUp(event)
	{
		if(event.keyCode == 39) this.key_right = false;
		else if(event.keyCode == 37) this.key_left = false;
		else if(event.keyCode == 38 || event.keyCode == 32) this.key_up = false;
		else if(event.keyCode == 40) this.key_down = false;
		else if(event.keyCode == 17) 
		{
			this.model.mario.attack = true;
		}
	}

	update()
	{
		this.model.mario.store_prev_pos();
		let dx = 0;
		let dy = 0;
		
		if(this.key_right) dx += 5;
		if(this.key_left) dx += -5;
		if(this.key_up) this.model.mario.jump = true;
		else
			this.model.mario.jump = false;
		//if(this.key_down) dy += 5;
		if(dx != 0 || this.model.mario.jump)
			this.model.move(dx, dy);
	}
}

   



class Game
{
	constructor()
	{
		this.model = new Model();
		this.view = new View(this.model);
		this.controller = new Controller(this.model, this.view);
	}

	onTimer()
	{
		this.controller.update();
		this.model.update();
		this.view.update();
	}
}

let game = new Game();
let timer = setInterval(function() { game.onTimer(); }, 40);