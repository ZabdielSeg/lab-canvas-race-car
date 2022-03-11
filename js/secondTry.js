window.onload = () => {
    document.getElementById('start-button').onclick = () => {
      if(gameStarted === false){
        startGame();
        gameStarted = true;
      } else {
        if(gameOver === true){
          // restart();
        gameStarted = false;
        }
      } 

      document.getElementById('restart-button').onclick = () => {
        restart();
        gameStarted = false;
        restartButtonDiv.style.visibility = 'hidden';
      }
    };
  
    function startGame() {
      area.start();
    
    }
  };

  const mainButton = document.getElementById('start-button');
  const restartButtonDiv = document.getElementById('restart-button');
  let gameStarted = false;
  let area = {
      start: function(){
          this.interval = setInterval(updateCanvas, 20);
        //   console.log(this)
      },

      stop: function (){
        clearInterval(this.interval);
      }
  };

  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  let time = 0;


  let imgB = new Image();
  // imgB.addEventListener('load', () => {
  //     // imgBDraw();
  // });
  imgB.src = 'images/road.png';

  // function imgDraw(){
  //     ctx.drawImage(img, 50, 0, 400, 600);
  // }

  class BackGroung {
      constructor(img, x, y, width, height){
        this.img = img;
        this.x = x;
        this.y = y;
        this.width = width;
        this. height = height;
        this.speed = +2;
      }

      move(){
        this.y += this.speed;
        this.y %= 700;
      }

      draw(){
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        if (this.speed < 0) {
          ctx.drawImage(this.img, this.x, this.y + this.height, this.width, this.height);
        } else {
          ctx.drawImage(this.img, this.x, this.y - this.height, this.width, this.height);
        }
      }
  }

  const actBack = new BackGroung(imgB, 50, 0, 400, 700);
  class Car1 {
    constructor(x, y, width, height){
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
  
      const img = new Image();
      img.addEventListener('load', () => {
        this.img = img;
        this.draw();
      });
  
      img.src = 'images/car.png';
    }
  
    moveLeft(){
      this.x -= 5;
    }
  
    moveRight(){
      this.x += 5;
    }
  
    draw() {
      ctx.drawImage(this.img, this.x, this.y, this.width, this. height);
    }

    left() {
        return this.x;
      }
    right() {
        return this.x + this.width;
      }
    top() {
        return this.y;
      }
    bottom() {
        return this.y + this.height;
      }
    crashWith(obstacle) {
        return !(this.bottom() < obstacle.top() || this.top() > obstacle.bottom() || this.right() < obstacle.left() || this.left() > obstacle.right());
      }
    checkLimit(){
        if(this.x <= 100){
          this.x += 10;
        } 
        if (this.x === 370){
          this.x -= 10;
        }
      }
  }

  const car = new Car1(235, 500, 30, 60);


  class Obstacle {
    constructor(x, y, height, width, color, identifier){
      this.x = x;
      this.y = y;
      this. height = height;
      this.width = width;
      this.color = color;
      this.identifier = identifier;
    }
  
    drawObstacle(){
    //   const context = ctx;
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    left() {
        return this.x;
      }
    right() {
        return this.x + this.width;
      }
    top() {
        return this.y;
      }
    bottom() {
        return this.y + this.height;
      }
    crashWith(obstacle) {
      // console.log(this.x, this.y, obstacle.x, obstacle.y);
        return !(this.bottom() < obstacle.top() || this.top() > obstacle.bottom() || this.right() < obstacle.left() || this.left() > obstacle.right());
      }
    // otherTry(gdr){
    //   this.identifier += 2;
    //   gdr.identifier += 2;
    // }
    hit(){
      this.y = 0;
      this.x = 0;
      this.width = 0;
      this.height = 0;
    }
  }

  let obstaclesArr = [];
  function updateObstacles (){
    let realObstacles = obstaclesArr.filter(obstacle => obstacle.identifier === 7);
    for (let i = 0; i < realObstacles.length; i++) {
      realObstacles[i].y += 3;
      realObstacles[i].drawObstacle();
    }
    if (time % 100 === 0){
      let y = 0;
      let minWidth = 100;
      let maxWidth = 200;
      let width = Math.floor(Math.random() * (maxWidth - minWidth +1) + minWidth);
      let xBorder = 385;
      let xBorderLeft = 100;
      let x = Math.floor(Math.random() * ((xBorder - width) - xBorderLeft +1 ) + xBorderLeft);
      obstaclesArr.push(new Obstacle(x, y, 10, width, 'blue', 7));
    //   obstaclesArr.push(new Obstacle( width - gap, y, 10, y + width + gap, 'red'));
    }
  }

  let bulletsArr = [];
  function createBullets(){
    let y = car.y;
    let x = car.x + 10;
    let width = 10;
    let height = 10;
    bulletsArr.push(new Obstacle(x, y, height, width, 'yellow', 7));
    // bulletsArr.push(new Obstacle(x + 30, y, height, width, 'yellow', 7));
  }

  function updateBullets(){
    let realBulletsArr = bulletsArr.filter(bullet => bullet.identifier === 7);
    for (let i = 0; i < realBulletsArr.length; i++){
      realBulletsArr[i].y -= 5;
      realBulletsArr[i].drawObstacle();
    }
  }
  let gameOver = false;

  function checkCrashBullets(){
    for(let i = 0; i < bulletsArr.length; i++){
      for(let j = 0; j < obstaclesArr.length; j++){
        if(bulletsArr[i].crashWith(obstaclesArr[j])){
          bulletsArr[i].hit();
          obstaclesArr[j].hit();
          time += 100;
        }
      }
    }
}
  
function checkGameOver (){
    const crashed = obstaclesArr.some( obstacle => car.crashWith(obstacle));
    if (crashed){
      gameOver = true;
      area.stop();
      obstaclesArr = [];
      bulletsArr = [];
      // mainButton.innerHTML = 'RestartGame';
      restartButtonDiv.style.visibility = 'visible';
      // restartButtonDiv.style.display = '';
    } else {
      restartButtonDiv.style.visibility = 'hidden';
      gameOver = false;
    }
 }
// if (!gameOver){
//   mainButton.innerHTML = 'StartGame';
// }

function score(){
    let points = Math.floor(time / 20);
    ctx.font = '18px serif';
    ctx.fillStyle = 'black';
    ctx.fillText(`Score: ${points}`, 100, 100)
}

function restart(){
  ctx.clearRect(0, 0, 500, 700);
  car.x = 235;
  car.y = 500;
  car.draw();
  time = 0;
  // mainButton.innerHTML = 'StartGame';
}

  function updateCanvas() {
      time += 1;
      ctx.clearRect(0, 0, 500, 700);
    //   imgDraw()
      actBack.move();
      actBack.draw();
      car.draw();
      car.checkLimit();
      updateObstacles();
      updateBullets();
      checkCrashBullets();
      checkGameOver();
      score();

      // requestAnimationFrame(updateCanvas)
  }
  // actBack.draw();
  document.addEventListener('keydown', e => {
    switch(e.which) {
      case 37:
        car.moveLeft();
        break;
      case 39:
        car.moveRight();
        break;
      case 32:
        createBullets();
        break;
    }
    // updateCanvas();
  }); 