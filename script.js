import "./noise.js";
import "./astar.js";

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
    return true;
  }
  return false;
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

function waterGenerator(mapSize, scale, humidity) {
  perlin.seed();
  let water = arrayGenerator(mapSize);
  scale += 0.01;
  for (let i = 0; i < mapSize; i++) {
    for (let j = 0; j < mapSize; j++) {
      if (
        perlin.get((i / mapSize) * scale, (j / mapSize) * scale) + 1 <
        humidity * 2
      ) {
        water[i][j] = waterTile;
      }
    }
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

function buildGraph(waterMap) {
  let graph = arrayGenerator(waterMap.length);
  for (let i = 0; i < waterMap.length; i++) {
    for (let j = 0; j < waterMap.length; j++) {
      graph[i][j] = waterMap[i][j] === undefined ? 1 : 0;
    }
  }

  return graph;
}

function followTarget(character, target, graph) {
  let startPoint = graph.grid[character.row][character.column];
  let endPoint = graph.grid[target.row][target.column];

  let path = astar.search(graph, startPoint, endPoint, {
    heuristic: astar.heuristics.diagonal,
  });
  if (path.length > 0) {
    character.row = path[0].x;
    character.column = path[0].y;
    return true;
  } else {
    return false;
  }
}

class Character {
  constructor(name, r, c, type) {
    this.name = name;
    this.row = r;
    this.column = c;
    this.type = type;
  }
}

const mapSize = 50;
const backgroundTile = "🌾";
const waterTile = "🌊";

// Generate water map
let waterMap;

// Generate graph
let graph;
let dog;
let cat;
let map;
let heroes;
let frame;
let isIsolated;

let scene = {
  start() {
    // Generate water map
    waterMap = waterGenerator(mapSize, 10, 0.5); // Humidity 0 to 0.5 is recomended

    // Generate graph
    graph = new Graph(buildGraph(waterMap), { diagonal: true });

    dog = spawnCharacter(waterMap, "Dog", "🐕");
    cat = spawnCharacter(waterMap, "Cat", "🐈");

    map = backgroundGenerator(mapSize);
    heroes = [dog, cat];
    frame = 0;

    isIsolated = false;
  },

  async update() {
    let isRespawned = false;
    do {
      // Game logic
      isIsolated = !followTarget(dog, cat, graph);

      isRespawned = respawnCharacter(waterMap, dog, cat);
      // Render
      mapRender(map, waterMap, heroes);
      await sleep(50); // Frame Rate

      if (isRespawned) {
        console.log(1);
        await sleep(1000);
        isRespawned = !isRespawned;
      }

      frame++;
    } while (!isIsolated);
    await sleep(1000);
    console.log(0);
    return 0;
  },
};

async function gameCycle() {
  do {
    scene.start();
    await scene.update();
  } while (true);
}

gameCycle();
