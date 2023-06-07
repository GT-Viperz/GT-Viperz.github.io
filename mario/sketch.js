let tileSpriteSheet
let gamemap
let alienSpriteSheet
let alien
let alienSprites
let rows, cols
let tiles = []
let platforms = []
let rez = 2
let viewX = 0
let viewY = 0
let coins = 0
let lives = 3
let coinSound, hitSound, musicSound, jumpSound, deathSound, heartSound
let gameOver = false
let coinCount = 0
let enemySpriteSheet, enemySprites, pinkEnemySpriteSheet, greenEnemySpriteSheet
let pinkEnemy1, pinkEnemy2, pinkEnemy3, greenEnemy1, greenEnemy2, greenEnemy3, enemySpritesPink, enemySpritesGreen, enemies
// let friendSpriteSheet, friendSprites, yoriichiFriendSpriteSheet  //Sprite Sheet Is not Image
let yoriichiFriend, friends
let extraLivesCounter = 0 // counting the lives so its not more than 2

const SPACE = 32

WALKING_SPEED = 5
JUMP_VELOCITY = 15
const GRAVITY = 0.8

// define player
const PLAYER = '-1'
const ENEMY = '-2'
const FRIEND = '-3'

// define tiles
const TILE_BRICK = '0'
const TILE_EMPTY = '3'

// cloud blocks
const CLOUD_LEFT = '5'
const CLOUD_RIGHT = '6'

// bush blocks
const BUSH_LEFT = '1'
const BUSH_RIGHT = '2'

// mushroom tiles
const MUSHROOM_TOP = '9'
const MUSHROOM_BOTTOM = '10'

// jump block
const JUMP_BLOCK = '4'
const JUMP_BLOCK_HIT = '8'

// pole
const POLE_TOP = '7'
const POLE_MIDDLE = '11'
const POLE_BOT = '15'

//flag
const FLAG_LEFT = "12"
const FLAG_MIDDLE = "13"
const FLAG_RIGHT = "14"

const COLLIDABLES = [TILE_BRICK, JUMP_BLOCK, JUMP_BLOCK_HIT, MUSHROOM_TOP, FRIEND, POLE_BOT, POLE_TOP, PLAYER]

// margins
const LEFT_MARGIN = 60
const VERTICAL_MARGIN = 15
const RIGHT_MARGIN = 150

function preload() {
  tileSpriteSheet = loadImage('graphics/spritesheet.png')
  gamemap = loadTable('graphics/gamemap.csv')

  alienSpriteSheet = loadImage('graphics/blue_alien.png')
  pinkEnemySpriteSheet = loadImage('graphics/pink_alien.png')
  greenEnemySpriteSheet = loadImage('graphics/green_alien.png')
  yoriichiFriend= loadImage('graphics/yoriichi.png') //make sure these are all imported

  musicSound = loadSound('sounds/actionmusic.wav') //music file too big?
  coinSound = loadSound('sounds/coin.wav')
  hitSound = loadSound('sounds/hit.wav')
  jumpSound = loadSound('sounds/jump.wav')
  deathSound = loadSound('sounds/death.wav')
  heartSound = loadSound('sounds/kagura.wav')
}

function setup() {
  createCanvas(850, 480)
  frameRate(30)
  init()
}

function createAlien() {
  idleAlien = [alienSprites[0]]
  walkingAlien = alienSprites.slice(7, 11)
  jumpingAlien = [alienSprites[3]]

  alien = new AnimatedSprite(idleAlien[0], 74, 120, 'PLAYER', walkingAlien, idleAlien, jumpingAlien)
}

function createEnemies() {
  let idlePinkEnemy = [enemySpritesPink[0]]
  let walkingPinkEnemy = enemySpritesPink.slice(7, 11)
  pinkEnemy1 = new Enemy(idlePinkEnemy[0], 600, 355, 300, 900, ENEMY, idlePinkEnemy, walkingPinkEnemy) //WE NEED TO SET OUR OWN COORDS X, Y, LEFTBOUND, RIGHTBOUND
  pinkEnemy2 = new Enemy(idlePinkEnemy[0], 150, 380, 90, 280, ENEMY, idlePinkEnemy, walkingPinkEnemy) //THIS ONE IS GOOD NOW!
  pinkEnemy3 = new Enemy(idlePinkEnemy[0], 900, 652, 500, 1180, ENEMY, idlePinkEnemy, walkingPinkEnemy)

  let idleGreenEnemy = [enemySpritesGreen[0]]
  let walkingGreenEnemy = enemySpritesGreen.slice(7, 11)
  greenEnemy1 = new Enemy(idleGreenEnemy[0], 2613, 520, 405, 2800, ENEMY, idleGreenEnemy, walkingGreenEnemy) //PERFECT GUY
  greenEnemy2 = new Enemy(idleGreenEnemy[0], 320, 640, 400, 469, ENEMY, idleGreenEnemy, walkingGreenEnemy)
  greenEnemy3 = new Enemy(idleGreenEnemy[0], 500, 742, 400, 900, ENEMY, idleGreenEnemy, walkingGreenEnemy)

  enemies = [pinkEnemy1, pinkEnemy2, pinkEnemy3, greenEnemy1, greenEnemy2, greenEnemy3]
}

function createfriend() {
  // let jumpingYoriichiFriend = [friendSpritesYoriichi[0]]
  yoriichiFriend1 = new Friend(yoriichiFriend, 2540, 570, 140, 90, FRIEND) //lower yoriichi
  yoriichiFriend2 = new Friend(yoriichiFriend, 280, 124, 100, 80, FRIEND) //top yoriichi

  friends = [yoriichiFriend1, yoriichiFriend2]
}

function createPlatforms(gamemap) {
  platforms = []
  coinCount = 0

  rows = gamemap.getRowCount()
  cols = gamemap.getColumnCount()

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let spriteIndex = gamemap.getString(r, c)
      let sprite = tiles[spriteIndex]
      let tile = new Sprite(sprite, sprite.width * c, sprite.height * r, spriteIndex)
      platforms.push(tile)
      if (spriteIndex == JUMP_BLOCK) {
        coinCount++
      }
    }
  }
}

function init() {
  viewX = 0
  viewY = 0
  coins = 0
  lives = 3

  tiles = generateTiles(tileSpriteSheet, 16, 16)
  createPlatforms(gamemap)

  alienSprites = generateTiles(alienSpriteSheet, 16, 20)
  createAlien()

  enemySpritesPink = generateTiles(pinkEnemySpriteSheet, 16, 20)
  enemySpritesGreen = generateTiles(greenEnemySpriteSheet, 16, 20)
  createEnemies()

  // friendSpritesYoriichi = generateTiles(yoriichiFriendSpriteSheet, 10, 20) //fix place and size
  createfriend()
}

function draw() {
  background('#80a1f2')
  scale(rez)
  scroll()

  for (let tile of platforms) {
    tile.display()
  }

  alien.display()

  for (let enemy of enemies) {
    enemy.display()
    enemy.update()
  }

  for (let friend of friends) {
    friend.display()
    friend.update()
  }

  resolvePlatformCollisions(alien, platforms)
  checkGameOver()
  displayScore()
  checkExtraLives()
}

function checkGameOver(){
  if (!gameOver) {
    checkDeath()
  }

  if (lives == 0) {
    fill(255, 0, 0)
    textAlign(CENTER)
    text("Game Over!", width/4 + viewX, height/4 + viewY)
    text("Click to Restart.", width/4 + viewX, height/4 + 20 + viewY)
    noLoop()
  }
  else if (coins == coinCount) {
    fill(255, 0, 0)
    textAlign(CENTER)
    text("YOU COLLECTED ALL THE COINS!", width/4 + viewX, height/4 + viewY)
    text("Click to Play Again.", width/4 + viewX, height/4 + 20 + viewY )
    gameOver = true
    noLoop()
  }
}

function mousePressed() {
  if (gameOver) {
    gameOver = false
    init()
    loop()
  }
}

function checkDeath() {
  if (alien.getTop() > rows * 16 + 1000 || checkCollisionList(alien, enemies).length) {
      lives--
      musicSound.stop()
      if (lives == 0) {
        gameOver = true
      }
      else {
        viewX = 0
        viewY = 0
        translate(viewX, viewY)
        alien.x = 160
        alien.y = 188
        deathSound.play()
      }
  }
}

//special function called in draw where it gives extra life if you touch yoriichi
function checkExtraLives() {
  if (checkCollisionList(alien, friends).length < 2  && extraLivesCounter < 2) {
    extraLivesCounter++
    lives++
    heartSound.play()
  }
}

function displayScore() {
  fill(255, 0, 0)
  textAlign(LEFT)
  text("Coins: " + coins, viewX + 15, viewY + 20)
  text("Lives: " + lives, viewX + 15, viewY + 35)
}

function scroll(){
  let rightBound = viewX + width / rez - RIGHT_MARGIN
  if (alien.getRight() > rightBound && viewX < 5000) { //THIS NUMBER placeholder 5000 DEPENDS ON HOW BIG THE MAP IS, WHERE DOES IT END?
      viewX += alien.getRight() - rightBound
  }

  let leftBound = viewX + LEFT_MARGIN
  if (alien.getLeft() < leftBound && viewX > 0) { //THIS NUMBER placeholder 0 DEPENDS ON HOW BIG THE MAP IS, WHERE DOES IT END?
      viewX -= leftBound - alien.getLeft()
  }

  let bottomBound = viewY + height / rez - VERTICAL_MARGIN
  if (alien.getBottom() > bottomBound) {
      viewY += alien.getBottom() - bottomBound
  }

  let topBound = viewY + VERTICAL_MARGIN
  if (alien.getTop() < topBound) {
      viewY -= topBound - alien.getTop()
  }

  translate(-viewX, -viewY)
}

//newest update of aliens place
function resolvePlatformCollisions(s, list) {
  s.dy += GRAVITY
  s.y += s.dy

  let collisions = checkCollisionList(s, list)
  if (collisions.length > 0) {
      let collided = collisions[0]
      if (s.dy > 0) { //sprite falling down so bottom of alien gets top of collided sprite
          s.setBottom(collided.getTop())
      }
      else if (s.dy < 0){ //alien jumps up
          s.setTop(collided.getBottom())

          if (collided.type == JUMP_BLOCK) {
              collided.img = tiles[JUMP_BLOCK_HIT]
              collided.type = JUMP_BLOCK_HIT
              coinSound.play()
              coins++
          }
          else if (collided.type == JUMP_BLOCK_HIT){
              hitSound.play()
          }
      }
      s.dy = 0
  }
  s.x += s.dx
  collisions = checkCollisionList(s, list)
  if (collisions.length > 0) {
      let collided = collisions[0]
      if (s.dx > 0) { //alien check moving right and then left
          s.setRight(collided.getLeft())
      }
      else if (s.dx < 0) {
          s.setLeft(collided.getRight())
      }
  }
}

function keyPressed(){
  if (!gameOver) {
    if (!musicSound.isPlaying()) {
      musicSound.play()
    }
    if (keyCode == LEFT_ARROW) {
        alien.dx = -WALKING_SPEED
        alien.state = 'walking'
    }
    else if (keyCode == RIGHT_ARROW) {
        alien.dx = WALKING_SPEED
        alien.state = 'walking'
    }
    else if (keyCode == SPACE && isOnPlatform(alien, platforms)) {
        alien.dy = -JUMP_VELOCITY
        alien.state = 'jumping'
        jumpSound.play()
    }
    else {
        alien.state = 'idle'
    }
  }
}

function keyReleased() {
  if (keyCode == LEFT_ARROW) {
      alien.dx = 0
      alien.state = "idle"
  }
  else if (keyCode == RIGHT_ARROW) {
      alien.dx = 0
      alien.state = "idle"
  }
  else if (keyCode == SPACE) {
      alien.dy = 0
      alien.state = "idle"
  }
}

function checkCollision(s1, s2) { //s is just a sprite later we can use names like yoriichi to see if it collides and stays along the object or falls through
  let noXOverlap = s1.getRight() <= s2.getLeft() || s1.getLeft() >= s2.getRight()
  let noYOverlap = s1.getBottom() <= s2.getTop() || s1.getTop() >= s2.getBottom()

  if (noXOverlap || noYOverlap) {
      return false
  }
  else {
      return true
  }
}

function checkCollisionList(s, list) {
  let collisionList = []
  for (let sprite of list) {
      if (checkCollision(s, sprite) && sprite.collidable)
          collisionList.push(sprite)
  }
  return collisionList
}

function isOnPlatform(s, list) {
  s.y += 5
  let collisions = checkCollisionList(s, list)
  s.y -= 5
  if (collisions.length > 0) {
      return true
  }
  else {
      return false
  }
}