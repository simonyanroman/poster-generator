// Generate noise seed
let seed = Math.random();

// Get poster
let poster = document.getElementById("poster");
let ctx = poster.getContext("2d");

let background = document.getElementById("background");

// Set poster margin
let posterMargin = 100;

// Set poster size
let posterWidth = 1000;
let posterHeight = 300;

// Get AspectRatio
let aspectRatio = posterWidth / posterHeight;

// Generate background frame
background.width = posterWidth + posterMargin * 2;
background.height = posterHeight + posterMargin * 2;

poster.width = posterWidth;
poster.height = posterHeight;

let imageData = ctx.createImageData(poster.width, poster.height);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function setPixel(x, y, r, g, b, a) {
  var index = 4 * (x + y * imageData.width);
  imageData.data[index + 0] = r;
  imageData.data[index + 1] = g;
  imageData.data[index + 2] = b;
  imageData.data[index + 3] = a;
}

function generatePoster(t) {
  noise.seed(seed);
  for (let x = 0; x < poster.width; x++) {
    for (let y = 0; y < poster.height; y++) {
      let number = noise.perlin3(
        (x / poster.width) * scale,
        ((y / poster.height) * scale) / aspectRatio,
        t
      );
      number = (number * contrast + 1) * 100;
      number = Math.min(Math.max(number, 0), 255);
      setPixel(x, y, number, number, number, 255);
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

let increment = 0.01;
let isAnimationStopped = false;

function animationToggle() {
  isAnimationStopped = !isAnimationStopped;
  increment = isAnimationStopped ? 0 : 0.01;
}

// Declare Scale and Contarts
let scale;
let contrast;

async function update() {
  for (let t = 0; t < 100; t += increment) {
    // Set noise scale
    scale = document.getElementById("scale").value;

    // Set noise contrast
    contrast = document.getElementById("contrast").value;
    generatePoster(t);
    await sleep(16);
  }
}

document
  .getElementById("stopAnimation")
  .addEventListener("click", function (e) {
    animationToggle();
  });

update();
