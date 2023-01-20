// Generate noise seed
let seed = Math.random();

// Get poster
let poster = document.getElementById("poster");
let ctx = poster.getContext("2d");

let background = document.getElementById("background");

// Get AspectRatio
let aspectRatio = poster.width / poster.height;

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

let imageData;

let posterMargin;

function changeBorder(posterMargin, r, g, b, a) {
  let frame = document.getElementById("poster");
  frame.style = `border-width: ${posterMargin}px; border-style: solid; border-color: rgb(${r}, ${g}, ${b}, ${a})`;
}

function downloadPoster() {
  let poster = document.getElementById("poster");
  let finalPoster = document.createElement("canvas");
  let context = finalPoster.getContext("2d");

  let fPw = poster.width + posterMargin * 2;
  let fPh = poster.height + posterMargin * 2;

  finalPoster.width = fPw;
  finalPoster.height = fPh;

  context.drawImage(poster, posterMargin, posterMargin);
  context.beginPath();
  context.rect(0, 0, fPw, posterMargin);
  context.fillStyle = "rgb(175, 64, 64, 255)";
  context.fill();
  context.rect(0, 0, posterMargin, fPh);
  context.fill();
  context.rect(0, fPh - posterMargin, fPw, posterMargin);
  context.fill();
  context.rect(fPw - posterMargin, 0, fPw, fPh);
  context.fill();

  let canvasUrl = finalPoster.toDataURL("image/png");
  const createEl = document.createElement("a");
  createEl.href = canvasUrl;
  createEl.download = "My new poster";
  createEl.click();
  createEl.remove();
}

async function update() {
  for (let t = 0; t < 100; t += increment) {
    // Set noise scale
    scale = document.getElementById("scale").value;
    // Set noise contrast
    contrast = document.getElementById("contrast").value;
    // Set poster width
    poster.width =
      document.getElementById("posterWidth").value === 0 ||
      document.getElementById("posterWidth").value === ""
        ? 1
        : document.getElementById("posterWidth").value;
    // Set poster height
    poster.height =
      document.getElementById("posterHeight").value === 0 ||
      document.getElementById("posterHeight").value === ""
        ? 1
        : document.getElementById("posterHeight").value;

    posterMargin = document.getElementById("posterMargin").value;

    changeBorder(posterMargin, 175, 64, 64, 255);

    imageData = ctx.createImageData(poster.width, poster.height);

    generatePoster(t);
    await sleep(16);
  }
}

document
  .getElementById("stopAnimation")
  .addEventListener("click", function (e) {
    animationToggle();
  });

document.getElementById("download").addEventListener("click", function (e) {
  downloadPoster();
});

update();
