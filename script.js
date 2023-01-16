function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function coordinateRandomizer(max) {
  let result = Math.floor(Math.random() * max);
  return result;
}

function arrayGenerator(mapSize) {
  let array = [];
  for (var i = 0; i < mapSize; i++) {
    array[i] = [];
  }
  return array;
}

function mapGenerator(mapSize) {
  let map = arrayGenerator(mapSize);

  for (let i = 0; i < mapSize; i++) {
    for (let j = 0; j < mapSize; j++) {
      let random = Math.floor(Math.random() * floor.length);
      map[i][j] = floor[random];
    }
  }

  return map;
}

async function mapRender(map, heroes) {
  let canvas = arrayGenerator(map.length);
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map.length; j++) {
      canvas[i][j] = map[i][j];
    }
  }

  for (const i in heroes) {
    const hero = heroes[i];
    canvas[hero.row][hero.column] = hero.character;
  }

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

class Hero {
  constructor(r, c, character) {
    this.row = r;
    this.column = c;
    this.character = character;
  }
}

function followHero(hero, target) {
  if (target.row !== hero.row) target.row > hero.row ? hero.row++ : hero.row--;
  if (target.column !== hero.column)
    target.column > hero.column ? hero.column++ : hero.column--;
}

function checkPosition(hero, target, mapSize) {
  if (target.row === hero.row && target.column === hero.column) {
    target.row = Math.floor(Math.random() * mapSize);
    target.column = Math.floor(Math.random() * mapSize);
  }
}

const mapSize = 10;
const floor = ["🟩", "🟫"];

async function update() {
  let dog = new Hero(
    coordinateRandomizer(mapSize),
    coordinateRandomizer(mapSize),
    "🐕"
  );
  let cat = new Hero(
    coordinateRandomizer(mapSize),
    coordinateRandomizer(mapSize),
    "🐈"
  );
  let roma = new Hero(
    coordinateRandomizer(mapSize),
    coordinateRandomizer(mapSize),
    "😤"
  );
  let map = mapGenerator(mapSize);
  let heroes = [dog, roma, cat];

  let frame = 0;

  while (true) {
    // Game logic
    followHero(dog, cat);

    if (frame % 1.5 === 0) followHero(roma, dog);
    checkPosition(dog, cat, mapSize);

    // Render
    mapRender(map, heroes);
    await sleep(500);

    frame++;
  }
}

update();
