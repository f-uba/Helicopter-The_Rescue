function Start() {
	$("#init").hide();
	$("#gameBackground").append("<div id='player' class='animationHelicopter'></div>");
	$("#gameBackground").append("<div id='enemyOne' class='animationEnemyOne'></div>");
	$("#gameBackground").append("<div id='enemyTwo'></div>");
	$("#gameBackground").append("<div id='friend' class='animationFriend'></div>");
	$("#gameBackground").append("<div id='scoreboard'></div>");
	$("#gameBackground").append("<div id='energy'></div>");

	var game = {}
	var gameOver = false;
	var speed = 7.5;
	var positionY = parseInt(Math.random() * 334);
	var shotEnable = true;
	var actualEnergy = 3;
	var points = 0;
	var saves = 0;
	var lost = 0;
	var key = {
		W: 87,
		S: 83,
		D: 68
	}

	game.timer = setInterval(Loop,30);
	game.pressed = [];

	$(document).keydown(function(e){
		game.pressed[e.which] = true;
	});
	
	$(document).keyup(function(e){
		game.pressed[e.which] = false;
	});
	
	function Loop() {
		BackgroundMove();
		PlayerMove();
		EnemyOneMove();
		EnemyTwoMove();
		FriendMove();
		Collision();
		Scoreboard();
		Energy();
	}

	function BackgroundMove() {
		left = parseInt($("#gameBackground").css("background-position"));
		$("#gameBackground").css("background-position", left - 3);	
	}

	function PlayerMove() {	
		if (game.pressed[key.W]) {
			var top = parseInt($("#player").css("top"));
			$("#player").css("top", top - 10);
			
			if (top<=0) $("#player").css("top", top + 10);
		}
		
		if (game.pressed[key.S]) {		
			var top = parseInt($("#player").css("top"));
			$("#player").css("top", top + 10);	

			if (top>=434) $("#player").css("top", top - 10);
		}
		
		if (game.pressed[key.D]) {
			Shot();
		}
	}

	function EnemyOneMove() {
		positionX = parseInt($("#enemyOne").css("left"));
		$("#enemyOne").css("left", positionX - speed);
		$("#enemyOne").css("top", positionY);
			
		if (positionX <= 0) {
			positionY = parseInt(Math.random() * 334);
			$("#enemyOne").css("left", 694);
			$("#enemyOne").css("top", positionY);		
		}	
	}

	function EnemyTwoMove() {
        positionX = parseInt($("#enemyTwo").css("left"));
		$("#enemyTwo").css("left", positionX - 4);
				
		if (positionX <= 0) $("#enemyTwo").css("left", 775);
	}

	function FriendMove() {
		positionX = parseInt($("#friend").css("left"));
		$("#friend").css("left", positionX + 1);
					
		if (positionX > 906) $("#friend").css("left", 0);
	}

	function Shot() {
		if (shotEnable == true) {
			var top = parseInt($("#player").css("top"))
			var positionX = parseInt($("#player").css("left"))

			shotEnable = false;
			shotTop = top + 37;
			shotX = positionX + 190;

			$("#gameBackground").append("<div id='shot'></div");
			$("#shot").css("top", shotTop);
			$("#shot").css("left", shotX);

			var shotTime = window.setInterval(MakeShot, 30);
		}
	 
		function MakeShot() {
			positionX = parseInt($("#shot").css("left"));
			$("#shot").css("left", positionX + 15); 

			if (positionX > 900) {
				window.clearInterval(shotTime);
				shotTime = null;
				$("#shot").remove();
				shotEnable = true;				
		    }
		}	 
	}

	function Collision() {
		var collisionOne = ($("#player").collision($("#enemyOne")));
		var collisionTwo = ($("#player").collision($("#enemyTwo")));
		var collisionThree = ($("#shot").collision($("#enemyOne")));
		var collisionFour = ($("#shot").collision($("#enemyTwo")));
		var collisionFive = ($("#player").collision($("#friend")));
		var collisionSix = ($("#enemyTwo").collision($("#friend")));

		if (collisionOne.length > 0) {
			enemyOneX = parseInt($("#enemyOne").css("left"));
			enemyOneY = parseInt($("#enemyOne").css("top"));
			ExplosionOne(enemyOneX, enemyOneY);
		
			positionY = parseInt(Math.random() * 334);
			$("#enemyOne").css("left", 694);
			$("#enemyOne").css("top", positionY);
			points -= 50
			actualEnergy--;
		}	

		if (collisionTwo.length > 0) {
			enemyTwoX = parseInt($("#enemyTwo").css("left"));
			enemyTwoY = parseInt($("#enemyTwo").css("top"));
			ExplosionTwo(enemyTwoX, enemyTwoY);
			$("#enemyTwo").remove();
			RepositioningEnemyTwo();
			points -= 25;
			actualEnergy--;			
		}

		if (collisionThree.length > 0) {
			enemyOneX = parseInt($("#enemyOne").css("left"));
			enemyOneY = parseInt($("#enemyOne").css("top"));	
			ExplosionOne(enemyOneX, enemyOneY);
			$("#shot").css("left",950);			
			positionY = parseInt(Math.random() * 334);
			$("#enemyOne").css("left", 694);
			$("#enemyOne").css("top", positionY);
			points += 100;			
		}

		if (collisionFour.length > 0) {
			enemyTwoX = parseInt($("#enemyTwo").css("left"));
			enemyTwoY = parseInt($("#enemyTwo").css("top"));
			$("#enemyTwo").remove();
			ExplosionTwo(enemyTwoX, enemyTwoY);
			$("#shot").css("left", 950);
			RepositioningEnemyTwo();
			points += 50;	
		}

		if (collisionFive.length > 0) {
			RepositioningFriend();
			$("#friend").remove();
			saves++;
		}

		if (collisionSix.length > 0) {
			friendX = parseInt($("#friend").css("left"));
			friendY = parseInt($("#friend").css("top"));
			ExplosionThree(friendX, friendY);
			$("#friend").remove();
			RepositioningFriend();
			points -= 100;	
			lost++;	
		}
	}

	function ExplosionOne(enemyOneX, enemyOneY) {
		$("#gameBackground").append("<div id='explosionOne'></div");
		$("#explosionOne").css("background-image", "url(images/explosion.png)");
		var div=$("#explosionOne");
		div.css("top", enemyOneY);
		div.css("left", enemyOneX);
		div.animate({width:200, opacity:0}, "slow");
		
		var explosionTime = window.setInterval(removeExplosion, 1000);
		
		function removeExplosion() {			
			div.remove();
			window.clearInterval(explosionTime);
			explosionTime = null;		
		}			
	}

	function ExplosionTwo(enemyTwoX, enemyTwoY) {	
		$("#gameBackground").append("<div id='explosionTwo'></div");
		$("#explosionTwo").css("background-image", "url(images/explosion.png)");
		var div2=$("#explosionTwo");
		div2.css("top", enemyTwoY);
		div2.css("left", enemyTwoX);
		div2.animate({width:200, opacity:0}, "slow");
		
		var explosiomTwoTime = window.setInterval(removeExplosion, 1000);
		
		function removeExplosion() {
			div2.remove();
			window.clearInterval(explosiomTwoTime);
			explosiomTwoTime = null;
		}
	}

	function ExplosionThree(friendX, friendY) {
		$("#gameBackground").append("<div id='explosionThree' class='animationFriendDeath'></div");
		$("#explosionThree").css("top", friendY);
		$("#explosionThree").css("left", friendX);
		var explosionTimeThree = window.setInterval(removeExplosion, 1000);
		
		function removeExplosion() {
			$("#explosionThree").remove();
			window.clearInterval(explosionTimeThree);
			explosionTimeThree = null;	
		}
	}

	function RepositioningEnemyTwo() {
		var collisionFourTime = window.setInterval(RepositioningFour, 5000);
			
		function RepositioningFour() {
			window.clearInterval(collisionFourTime);
			collisionFourTime = null;
				
			if (gameOver == false) {
				$("#gameBackground").append("<div id=enemyTwo></div");
			}	
		}	
	}

	function RepositioningFriend() {
		var friendTime = window.setInterval(RepositioningSix, 4000);
		
		function RepositioningSix() {
			window.clearInterval(friendTime);
			friendTime = null;
			
			if (gameOver == false) {	
				$("#gameBackground").append("<div id='friend' class='animationFriend'></div>");	
			}		
		}
	}

	function Scoreboard() {
		$("#scoreboard").html("<h2> Pontos: " + points + " Salvos: " + 
		saves + " Perdidos: " + lost + "</h2>");
	}

	function Energy() {
		if (actualEnergy == 3) {
			$("#energy").css("background-image", "url(images/energyThree.png)");
		}
	
		if (actualEnergy == 2) {
			$("#energy").css("background-image", "url(images/energyTwo.png)");
		}
	
		if (actualEnergy == 1) {	
			$("#energy").css("background-image", "url(images/energyOne.png)");
		}
	
		if (actualEnergy == 0) {
			$("#energy").css("background-image", "url(images/energyZero.png)");
		}
	}
}