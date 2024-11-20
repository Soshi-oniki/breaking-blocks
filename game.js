const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
const ballRadius = 10;
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
const brickRowCount = 3; //ブロックの行数
const brickColumnCount = 5; //ブロックの列数
const brickWidth = 75; //各ブロックの幅
const brickHeight = 20; //各ブロックの高さ
const brickPadding = 10; //ブロック同士の間隔
const brickOffsetTop = 30; // 画面上部からブロックの位置を30ピクセルに設定
const brickOffsetLeft = 30; //画面左側からブロックの位置を30ピクセルに設定
let score = 0;

const bricks = [];
for(let c = 0; c < brickColumnCount; c++)
  {
    bricks[c] = [];
    for(let r = 0; r < brickRowCount; r++)
      {
        bricks[c][r] = {x:0,y:0,status:1};
      }
  }

function drawBall() 
{
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#FF0000";
  ctx.fill();
  ctx.closePath();
}

function draw() 
{
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawScore();
  collisionDetection();
  drawBricks();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) 
  {
    dx = -dx;
  }

  if (y + dy < ballRadius) 
    {
      dy = -dy;
    } 
    else if (y + dy > canvas.height - ballRadius) 
      {
        if(x > paddleX && x < paddleX + paddleWidth) 
          {
            dy = -dy;
          }
      else 
      {
        alert("GAME OVER");
        document.location.reload();
        clearInterval(interval); // Needed for Chrome to end game
      }
    }
    
    x += dx;
    y += dy;

    if (rightPressed) 
      {
        paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth);
      }
     else if (leftPressed) 
      {
        paddleX = Math.max(paddleX - 7, 0);
      }
    }

function drawPaddle() 
{
  // 描画を開始
  ctx.beginPath();
  
  // 四角形（パドル）の描画。四角形の位置と大きさを指定する。
  // 引数は順に、四角形の左上角のx座標、y座標、幅、高さ
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  
  // パドルの色を青に設定（#0095DD）
  ctx.fillStyle = "#0095DD";
  
  // 四角形を塗りつぶす
  ctx.fill();
  
  // 描画を終了
  ctx.closePath();
}

function drawBricks() 
{
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
        if(bricks[c][r].status === 1)
      {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function keyDownHandler(e)
{
  if(e.key === "Right" || e.key === "ArrowRight") 
    {
      rightPressed = true;
    }
    else if(e.key === "Left" || e.key === "ArrowLeft")
      {
        leftPressed = true;
      }
}

function keyUpHandler(e) 
{
  if (e.key === "Right" || e.key === "ArrowRight") 
    {
      rightPressed = false;
    }
   else if (e.key === "Left" || e.key === "ArrowLeft") 
    {
      leftPressed = false;
    }
}

function touchMoveHandler(e) {
  const touchX = e.touches[0].clientX;
  const canvasRect = canvas.getBoundingClientRect();
  paddleX = touchX - canvasRect.left - paddleWidth / 2;
  paddleX = Math.max(0, Math.min(canvas.width - paddleWidth, paddleX));
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score === brickRowCount * brickColumnCount) 
          {
            alert("YOU WIN, CONGRATULATIONS!");
            document.location.reload();
            clearInterval(interval);
          }
        }
      }
    }
  }
}

function drawScore()
{
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Score: ${score}`, 8, 20);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
canvas.addEventListener("touchmove", touchMoveHandler, false);

// リサイズ対応（オプション）
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  paddleX = (canvas.width - paddleWidth) / 2;
  x = canvas.width / 2;
  y = canvas.height - 30;
}

window.addEventListener("resize", resizeCanvas, false);
resizeCanvas(); // 初期ロード時s

const interval = setInterval(draw, 10);