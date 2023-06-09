var MathHelper = {
	randomRange: function (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
};

var Particles = (function () {

	var list = [];

	var Particle = function (x, y, size, xSpeed, ySpeed, life, opacity) {

		this.x = x;
		this.y = y;
		this.maxSize = size;
		this.maxOpacity = opacity;
		this.size = 1;
		this.opacity = 0;
		this.xSpeed = xSpeed || 1;
		this.ySpeed = ySpeed || 1;
		this.life = life;
		this.element = document.createElement('div');

		this.element.style.cssText = 
			'background-color:#F00;position:absolute;' + 
			'opacity:' + this.opacity + ';' +
			'width:' + this.size + 'px;' + 
			'height:' + this.size + 'px;' + 
			'border-radius:' + this.size + 'px;' + 
			'left:' + x + 'px;' + 
			'top:' + y + 'px;';
	};

	Particle.prototype = {
		
		setOpacity: function (opacity) {

			this.opacity = opacity;
			this.element.style.opacity = opacity / 100;
		},

		setSize: function (size) {

			this.size = size;
			this.element.style.borderRadius = this.element.style.height = this.element.style.width = size + "px";
		},

		setX: function (x) {

			this.x = x;
			this.element.style.left = x + "px";
		},

		setY: function (y) {

			this.y = y;
			this.element.style.top = y + "px";
		}
	}

	var createNew = function (x, y, size, xSpeed, ySpeed, life, opacity) {

		var particle = new Particle(x, y, size, xSpeed, ySpeed, life, opacity);
		list.push(particle);
		return particle;
	};

	var animate = function () {
		
		var i = list.length;

		while (i--) {

			var particle = list[i];

			particle.life--;

			// Animate in
			if (particle.life > 0) {


				if (particle.opacity < particle.maxOpacity) {

					particle.setOpacity(particle.opacity + 10);
				}
				
				if (particle.size < particle.maxSize) {

					particle.setSize(particle.size + 1);
				}
			} 

			particle.setX(particle.x + particle.xSpeed);
			particle.setY(particle.y + particle.ySpeed);

			// Animate out
			if (particle.life <= 0) {

				particle.setSize(particle.size - 1);
				particle.setOpacity(particle.opacity - 1);

				if (particle.size <= 0) {

					particle.element.parentNode.removeChild(particle.element);
					list.splice(i, 1);
				}
			}	
		}
	};

	return {
		createNew: createNew,
		animate: animate
	}

})();

var Stage = (function () {

	var stage = document.getElementById('stage');

	var addChild = function (thing) {

		stage.appendChild(thing.element);
	};

	return {
		addChild: addChild
	};

})();

var Renderer = (function () {

	var frameNumber = 0;

	var render = function (callback, fps) {

		fps = fps || 30;

		if (frameNumber == fps * 100) frameNumber = 0;

		callback();

		frameNumber++;

		setTimeout(function () {

			render(callback);
		}, 1000 / fps);
	};

	var getFrameNumber = function () {

		return frameNumber;
	};

	return {
		render: render,
		getFrameNumber: getFrameNumber
	};

})();

Renderer.render(function () {

	var density = 30,
		speed = 5;

	while(density--) {

		Stage.addChild(Particles.createNew(
			Math.random() * window.innerWidth, // x
			Math.random() * window.innerHeight, // y
			MathHelper.randomRange(2, 8), // size
			MathHelper.randomRange(-speed, speed), // xSpeed
			MathHelper.randomRange(-speed, speed), // ySpeed
			MathHelper.randomRange(10, 20), // life
			MathHelper.randomRange(1, 80) // opacity
		));
	}

	Particles.animate();

}, 60);