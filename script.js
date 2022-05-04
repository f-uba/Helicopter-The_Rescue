function Start() {
	$("#init").hide();
	$("#gameBackground").append("<div id='player' class='animationHelicopter'></div>");
	$("#gameBackground").append("<div id='enemyOne' class='animationEnemyOne'></div>");
	$("#gameBackground").append("<div id='enemyTwo'></div>");
	$("#gameBackground").append("<div id='friend' class='animationFriend'></div>");

	var game = {}
	var speed = 7.5;
	var positionY = parseInt(Math.random() * 334);
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
}