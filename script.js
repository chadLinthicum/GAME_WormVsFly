const DEBUG = false; 

canvas = document.getElementById('gameCanvas');
ctx = canvas.getContext('2d');
// set canvas to be a tab stop
canvas.setAttribute('tabindex','0');
// set focus to the canvas so keystrokes are immediately handled
canvas.focus();

//game
let playerScore = 0;
let showingWinScreen = false;

let score = 0;
scoreNumber = document.getElementById('scoreNumber');
scoreNumber.textContent=(score);

//snake head and body coordinates
let snake = [
  {
    x : 100,
    y : 100, 
  },
]

//snake attributes
let snakeWidth = 18;
let snakeHeight = 18;
const SNAKE_MOVEMENT = 20;
let snakeSpeed = 100;
let snakeDirection = ''; //set to '' to have snake idle at start of game
let snakeSkinColor = '#FF69B4';
let snakeEyeSize = 5;
let snakeEyeA = 2;
let snakeEyeB = 11; 
let snakeEyeColor = '#000000';

//fly attributes
let flyX;
let flyY;
const FLY_WIDTH = 18;
const FLY_HEIGHT = 18;  
let randomLoc = Math.floor(Math.random() * 19);
let flySpeed = 1000;
let flyPIX = document.getElementById('flyPIX');


window.onload = function (event) {
  event.preventDefault(); //not sure if this works but page was refreshing unexpectedly so I added this
  
  canvas.addEventListener('keydown', handleKeyPress);
  
  setInterval(function() {
    drawEverything();
  }, snakeSpeed);

  if (DEBUG) {
    snakeDirection = 'right'
    flyX = 220;
    flyY = 100;
  } else {
    flySpawn();
    setInterval(function() {
      flyMovement();
    }, flySpeed);
  }
}




function drawEverything () {

  //game board
  var gradient = ctx.createRadialGradient(200, 200, 100, 200, 200, 250);
  gradient.addColorStop(0, '#934B22');
  gradient.addColorStop(1, '#562E17');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width,canvas.height);

  //grid
  grid();

  snakeMovement();

  // snake head  
  colorRect(snake[0].x,snake[0].y,snakeWidth,snakeHeight, snakeSkinColor);

  // snake eyes
  if (snakeDirection === 'up') {
    colorRect(snake[0].x + snakeEyeA,snake[0].y + snakeEyeA,snakeEyeSize,snakeEyeSize,snakeEyeColor);
    colorRect(snake[0].x + snakeEyeB,snake[0].y + snakeEyeA,snakeEyeSize,snakeEyeSize,snakeEyeColor);
  } else if (snakeDirection === 'down') {
    colorRect(snake[0].x + snakeEyeA,snake[0].y + snakeEyeB,snakeEyeSize,snakeEyeSize,snakeEyeColor);
    colorRect(snake[0].x + snakeEyeB,snake[0].y + snakeEyeB,snakeEyeSize,snakeEyeSize,snakeEyeColor);
  } else if (snakeDirection === 'left') {
    colorRect(snake[0].x + snakeEyeA,snake[0].y + snakeEyeA,snakeEyeSize,snakeEyeSize,snakeEyeColor);
    colorRect(snake[0].x + snakeEyeA,snake[0].y + snakeEyeB,snakeEyeSize,snakeEyeSize,snakeEyeColor);
  } else if (snakeDirection === 'right') {
    colorRect(snake[0].x + snakeEyeB,snake[0].y + snakeEyeA,snakeEyeSize,snakeEyeSize,snakeEyeColor);
    colorRect(snake[0].x + snakeEyeB,snake[0].y + snakeEyeB,snakeEyeSize,snakeEyeSize,snakeEyeColor);
  } else {
    colorRect(snake[0].x + snakeEyeB,snake[0].y + snakeEyeA,snakeEyeSize,snakeEyeSize,snakeEyeColor);
    colorRect(snake[0].x + snakeEyeB,snake[0].y + snakeEyeB,snakeEyeSize,snakeEyeSize,snakeEyeColor);
  }
  
  //fly
  ctx.drawImage(flyPIX,flyX,flyY,FLY_WIDTH,FLY_HEIGHT);

  //eat fly
  if (snake[0].x == flyX && snake[0].y == flyY) {
    flyX = specialRandom(flyCoordinate); 
    flyY = specialRandom(flyCoordinate); 
    score++;
    scoreNumber.textContent=(score);
    colorRect(100,100,100,100, snakeSkinColor);

    snake[0].x = snake[0].x;
    console.log(snake[0].x);
    
    snakeCopy = [...snake];
    snakeCopy.push({x : snake[0].x, y : snake[0].y});
    console.log(snake, snakeCopy);
  }

  gameOver();
}

function reset() {
  if (DEBUG) {
    snakeDirection = 'right';
    snake[0].y = 100;
    snake[0].x = 100;
    flyX = 220;
    flyY = 100;
  }
  
  alert ("game over");
  snakeDirection = '';
  snake[0].y = 100;
  snake[0].x = 100;
  scoreNumber.textContent=(score = 0);
}

function gameOver() {
  if (snake[0].x < 0) {
    reset();
    } else if (snake[0].x > 380) {
      reset();
    } else if (snake[0].y > 380) {
      reset();
    } else if (snake[0].y < 0) {
      reset();
    } 
  }

//fly coordinate generation
const flyCoordinate = 20;
const specialRandom = (num = 1, limit = 380) => {
    const random = Math.random() * limit;
    const res = Math.round( random / num ) * num;
    return res;
};

//handle fly movement
function flyMovement() {
  var flyCoordinatesArray = ['up', 'down', 'left', 'right']
    let flyCoordinates = flyCoordinatesArray[Math.floor(Math.random() * flyCoordinatesArray.length)];
    if (flyCoordinates === 'up') {
      flyY = flyY - 20;
    } else if (flyCoordinates === 'down') {
      flyY = flyY + 20;
    } else if (flyCoordinates === 'left') {
      flyX = flyX - 20;
    } else if (flyCoordinates === 'right') {
      flyX = flyX + 20;
    }

    //prevent fly from going out of bounds
    if (flyY < 0) {
      flyY = flyY + 20;
    } else if (flyY > 380) {
      flyY = flyY - 20;
    } else if (flyX < 0) {
      flyX = flyX + 20;
    } else if (flyX > 380) {
      flyX = flyX - 20;
    }
}

function flySpawn() {
  if (flyX == snake[0].x || flyY == snake[0].y) {
  flyY = specialRandom(flyCoordinate);
  flyX = specialRandom(flyCoordinate);
  } else {
    flyY = specialRandom(flyCoordinate);
    flyX = specialRandom(flyCoordinate);
  }
}

// set snakeDirection variable
function handleKeyPress(event) {
  switch(event.keyCode) {
    case 38:
      if (snakeDirection === 'down' || snakeDirection === 'up') {
        return;
      } else {
          snakeDirection = 'up';
      }
      break;
    case 40:
      if (snakeDirection === 'up' || snakeDirection === 'down') {
        return;
      } else {
          snakeDirection = 'down';
      }
      break;
    case 37:
      if (snakeDirection === 'right' || snakeDirection === 'left') {
        return;
      } else {
          snakeDirection = 'left';
      }
      break;
    case 39:
      if (snakeDirection === 'left' || snakeDirection === 'right') {
        return;
      } else {
          snakeDirection = 'right';
      }
  }
}

// use snakeDirection variable to move snake
function snakeMovement () {
  if (snakeDirection === '') {
    return;
  } else if (snakeDirection === 'up') {
    snake[0].y += -SNAKE_MOVEMENT;
  } else if (snakeDirection === 'down') {
    snake[0].y += SNAKE_MOVEMENT;
  } else if (snakeDirection === 'left') {
    snake[0].x += -SNAKE_MOVEMENT;
  } else if (snakeDirection === 'right') {
    snake[0].x += SNAKE_MOVEMENT;
  } 
}

function grid() {
  for (var i=19; i<=800; i += 20)
  {
    //vertical lines
    ctx.moveTo(i,0);
    ctx.lineTo(i,805);

    //horizontal lines
    ctx.moveTo(0,i);
    ctx.lineTo(805,i);

    ctx.strokeStyle='#000000'; //other color of choice = #5A2E11
    ctx.stroke();
  }
}

function colorRect(leftX, topY, width, height, drawColor) {
  ctx.fillStyle = drawColor;
  ctx.fillRect(leftX, topY, width, height); 
}

function colorCircle(centerX, centerY, radius, drawColor) {
  ctx.fillStyle = drawColor;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  ctx.fill();
}

