function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function coordinateRandomizer(max) {
  let result = Math.floor(Math.random() * max);
  return result;
}

function drawTile(canvas, x, y, tile) {
  let bound = canvas.length;
  if (y < 0 || x < 0 || x > bound - 1 || y > bound - 1) return;
  canvas[x][y] = tile;
}

function checkBounds(canvas, x, y) {
  let bound = canvas.length;
  return !(y < 0 || x < 0 || x > bound - 1 || y > bound - 1);
}

function spawnCharacter(waterMap, name, type) {
  let character = new Character(
    name,
    coordinateRandomizer(mapSize),
    coordinateRandomizer(mapSize),
    type
  );
  while (waterMap[character.row][character.column] !== undefined) {
    character.row = coordinateRandomizer(mapSize);
    character.column = coordinateRandomizer(mapSize);
  }

  return character;
}

function respawnCharacter(waterMap, character, target) {
  if (character.row === target.row && character.column === target.column) {
    do {
      target.row = coordinateRandomizer(mapSize);
      target.column = coordinateRandomizer(mapSize);
    } while (waterMap[target.row][target.column] !== undefined);
  }
}

function arrayGenerator(mapSize) {
  let array = [];
  for (var i = 0; i < mapSize; i++) {
    array[i] = [];
  }
  return array;
}

function backgroundGenerator(mapSize) {
  let background = arrayGenerator(mapSize);

  for (let i = 0; i < mapSize; i++) {
    for (let j = 0; j < mapSize; j++) {
      background[i][j] = backgroundTile;
    }
  }

  return background;
}

function waterGenerator(mapSize) {
  let water = arrayGenerator(mapSize);
  let x0 = coordinateRandomizer(mapSize);
  let y0 = coordinateRandomizer(mapSize);

  water[x0][y0] = waterTile;

  let r = 3;
  let x = r;
  let y = 0;
  let error = 1 - x;

  while (x >= y) {
    drawTile(water, x + x0, y + y0, waterTile);
    drawTile(water, y + x0, x + y0, waterTile);
    drawTile(water, -x + x0, y + y0, waterTile);
    drawTile(water, -y + x0, x + y0, waterTile);
    drawTile(water, -x + x0, -y + y0, waterTile);
    drawTile(water, -y + x0, -x + y0, waterTile);
    drawTile(water, x + x0, -y + y0, waterTile);
    drawTile(water, y + x0, -x + y0, waterTile);
    y++;

    if (error < 0) {
      error += 2 * y + 1;
    } else {
      x--;
      error += 2 * (y - x + 1);
    }
  }

  let border = [{ x: x0, y: y0 }];
  let filled = [];

  while (border.length !== 0) {
    let i = 0;
    console.log(border[i]);
    let x = border[i].x;
    let y = border[i].y;
    if (checkBounds(water, x + 1, y) && water[x + 1][y] !== waterTile) {
      border.push({ x: x + 1, y: y });
    }
    if (checkBounds(water, x - 1, y) && water[x - 1][y] !== waterTile) {
      border.push({ x: x - 1, y: y });
    }
    if (checkBounds(water, x, y + 1) && water[x][y + 1] !== waterTile) {
      border.push({ x: x, y: y + 1 });
    }
    if (checkBounds(water, x, y - 1) && water[x][y - 1] !== waterTile) {
      border.push({ x: x, y: y - 1 });
    }
    water[x][y] = waterTile;
    filled.push(border.shift());
  }

  return water;
}

async function mapRender(map, waterMap, characters) {
  // Generating canvas
  let canvas = arrayGenerator(map.length);
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map.length; j++) {
      canvas[i][j] = map[i][j];
    }
  }

  // Adding water map to canvas
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map.length; j++) {
      if (waterMap[i][j] !== undefined) canvas[i][j] = waterMap[i][j];
    }
  }

  //Characters spawn
  for (const i in characters) {
    const character = characters[i];
    canvas[character.row][character.column] = character.type;
  }

  // Render map in HTML
  let indexCanvas = document.getElementById("canvas");
  let renderedMap = "";

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map.length; j++) {
      renderedMap += canvas[i][j];
    }
    renderedMap += "<br>";
  }

  indexCanvas.innerHTML = renderedMap;
}

function followTarget(character, target) {
  if (target.row !== character.row)
    target.row > character.row ? character.row++ : character.row--;
  if (target.column !== character.column)
    target.column > character.column ? character.column++ : character.column--;
}

class Character {
  constructor(name, r, c, type) {
    this.name = name;
    this.row = r;
    this.column = c;
    this.type = type;
  }
}

class Structure {
  constructor(r, c, type) {
    this.row = r;
    this.column = c;
    this.type = type;
  }
}

const mapSize = 30;
const backgroundTile = "🟩";
const waterTile = "🌊";

async function update() {
  // Generate water map
  const waterMap = waterGenerator(mapSize);

  let dog = spawnCharacter(waterMap, "Dog", "🐕");
  let cat = spawnCharacter(waterMap, "Cat", "🐈");

  let map = backgroundGenerator(mapSize);
  let heroes = [dog, cat];
  let frame = 0;

  while (true) {
    // Game logic
    followTarget(dog, cat);

    // if (frame % 1.5 === 0) followHero(roma, dog);
    respawnCharacter(waterMap, dog, cat);

    // Render
    mapRender(map, waterMap, heroes);
    await sleep(500);

    frame++;
  }
}

update();
