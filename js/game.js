var mouseX = 0;
var mouseY = 0;
var currentDate;
var gameLength = 300;	//in seconds
var sphereFound = 0; 
var gameEnded = false;
var soundRepeater;
var timeRepeater;
var beepFrequency = 500;
var ballSize = 50;
var ballX = 0;
var ballY = 0;
var regionDifferenceWidth = 180;

jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()) + "px");
    return this;
}


$(document).ready(function(){
	createMenu();
});

function hideBall(num){
	var width = parseInt($(window).width()) - parseInt($('#score_space').outerWidth());
	var height = parseInt($(window).height()) - parseInt($('#score_space').outerHeight());
	
	ballY = getRandomBetween(0, height - ballSize);
	ballX = getRandomBetween(0, width - ballSize);
	
	var container = document.createElement("div");    //a div to put the dragonBall
	container.setAttribute("id", "container");
	
	var gameScreen = document.getElementById("gameScreen");
	gameScreen.appendChild(container);
	
	$("#container").click(function(){
		clearInterval(soundRepeater);
		$('#container').unbind("click");
		$("#container").center();
        $("#container").animate({height: "100px", width: "100px", opacity: 1},{speed: "slow", complete: function(){
			
			sphereFound = sphereFound + 1;
			var audio = new Audio("sounds/found2.mp3");
			audio.volume = 1;
			audio.play();
			clearInterval(timeRepeater);
			setTimeout(function(){
				$("#container").remove();
				if (sphereFound != 7){
					hideBall(sphereFound);
					timeRepeater = window.setInterval(function(){ updateTimer(); }, 1000);
					soundRepeater = window.setInterval(function(){ playIt(); }, beepFrequency);
				}else{
					document.getElementById("score_space").innerHTML = "Timer:<br><p id=\"score\">"+gameLength+"</p><p>Spheres found: "+sphereFound+"/7</p>";
					clearInterval(timeRepeater);
					winMenu("Congratulations! You have found the 7 dragon balls!");
				}		
			}, 3000);    //after 3 seconds remove the ball and start the next one
			
		}});
    });
    //adding dragon ball image
    var container = document.getElementById("container");
    
    var img = document.createElement("img");
    img.setAttribute("src", "images/Dragon_Balls_"+(7-num)+".png")
    img.setAttribute("class","sphere");
    
    container.appendChild(img);
    
    $('#container').css('top', ballY+"px");
	$('#container').css('left', ballX+"px");
	$('#container').css('opacity', 0);
}

function createMenu(){
	var div = document.createElement("div");
	div.setAttribute("id", "menu");
	
	var menuContent = document.createElement("div");
	menuContent.setAttribute("id", "menu_content");
	
	var title = document.createElement("h1");
	title.innerHTML = "Find the Dragon Balls";
	
	var playButton = document.createElement("button");
	playButton.setAttribute("class", "btn btn-primary btn-lg");
	playButton.setAttribute("id", "play_button");
	playButton.innerHTML = "<p id=\"startText\"><strong>Start Game</strong></p>";
	
	var instructions = document.createElement("p");
	instructions.setAttribute("id", "instructions");
	instructions.innerHTML = "By moving the Dragon Radar designed by Bulma, help Goku to find all the seven dragon balls guided by the sound they emit!";
	
	var warning = document.createElement("div");
	warning.setAttribute("id", "warning");
	warning.innerHTML = "<p id=\"warning_text\">Make sure your audio is turned on before playing.</p>";
	
	menuContent.appendChild(title);
	menuContent.appendChild(instructions);
	menuContent.appendChild(warning);
	menuContent.appendChild(playButton);
	
	div.appendChild(menuContent);
	
	var screen = document.getElementById("gameScreen");
	screen.appendChild(div);
	
	//setting handler to the click event of the start game button
	$('#play_button').click(function(){
		$('#menu').remove();     //undraw the menu
		
		/** Draw Score **/
		var scoreDiv = document.createElement("div");
		scoreDiv.setAttribute("id","score_space");
		scoreDiv.innerHTML = "Timer:<br><p id=\"score\">"+gameLength+"</p><p>Spheres found: 0/7</p>";
		var screen = document.getElementById("gameScreen");
		screen.appendChild(scoreDiv);
		/** end draw score **/
		
		currentDate = new Date();
		hideBall(sphereFound);
		timer();
		setGameScreenHandlers();
		timeRepeater = window.setInterval(function(){ updateTimer(); }, 1000);
		
	}); 
	
}

function winMenu(message){
	var div = document.createElement("div");
	div.setAttribute("id", "menu2");
	
	var menuContent = document.createElement("div");
	menuContent.setAttribute("id", "menu_content");
	
	var title = document.createElement("h1");
	title.innerHTML = message;
	
	var playButton = document.createElement("button");
	playButton.setAttribute("class", "btn btn-primary btn-lg");
	playButton.setAttribute("id", "play_again");
	playButton.innerHTML = "<p id=\"startText\"><strong>Play Again!</strong></p>";
	
	
	menuContent.appendChild(title);
	menuContent.appendChild(playButton);
	
	div.appendChild(menuContent);
	
	var screen = document.getElementById("gameScreen");
	screen.appendChild(div);
	
	$('#play_again').click(function(){
		$('#menu2').remove();     //undraw the menu
		gameLength = 300;
		sphereFound = 0;
		/** Draw Score **/
		var scoreDiv = document.getElementById("score_space");
		scoreDiv.innerHTML = "Timer:<br><p id=\"score\">"+gameLength+"</p><p>Spheres found: 0/7</p>";
		/** end draw score **/
		
		hideBall(sphereFound);
		timer();
		setGameScreenHandlers();
		timeRepeater = window.setInterval(function(){ updateTimer(); }, 1000);
		
	});
}

function updateTimer(){
	if (gameLength > 0)
		gameLength -= 1;
	else{
		clearInterval(timeRepeater);
		clearInterval(soundRepeater);
		$("#container").remove();
		winMenu("Sorry, time is over :( ! You found "+sphereFound+" out of 7 dragon balls");
	}
	document.getElementById("score_space").innerHTML = "Timer:<br><p id=\"score\">"+gameLength+"</p><p>Spheres found: "+sphereFound+"/7</p>";
}

function trackCursor(event){
	if ($("#gameScreen:hover").length != 0){
		//change beep frequency here according to the hidden ball location
		if((mouseX >= ballX) && (mouseX <= ballX + ballSize) && (mouseY >= ballY) && (mouseY <= ballY + ballSize)){
			audioName = "sounds/beep1000.wav";
		}else if((mouseX >= ballX - regionDifferenceWidth/2) && (mouseX <= ballX + ballSize + regionDifferenceWidth/2) && (mouseY >= ballY - regionDifferenceWidth/2) && (mouseY <= ballY + ballSize + regionDifferenceWidth/2)){
			audioName = "sounds/beep500.wav";
		}else if((mouseX >= ballX - 2*regionDifferenceWidth) && (mouseX <= ballX + ballSize + 2*regionDifferenceWidth) && (mouseY >= ballY - 2*regionDifferenceWidth) && (mouseY <= ballY + ballSize + 2*regionDifferenceWidth)){
			audioName = "sounds/beep200.wav";
		}else{
			audioName = "sounds/beep.wav";
		}
		
		
	}
}

function playIt(){
	var audio = new Audio(audioName);
	audio.volume = 1;
	audio.play();
}

function timer(){
	
	soundRepeater = window.setInterval(function(){ playIt(); }, beepFrequency);
	window.setInterval(function(){ trackCursor(); }, 50);
}

function setGameScreenHandlers(){
	$("#gameScreen").mousemove(function(e){
		mouseX = e.clientX;
		mouseY = e.clientY;
	});
}

/**
 * Returns a random number in the range [min,max)
 */
function getRandomBetween(min, max) {
    return Math.random() * (max - min) + min;
}
