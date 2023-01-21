let seed = Math.random();

// Get poster
let poster = document.getElementById("poster");
let ctx = poster.getContext("2d");

let background = document.getElementById("background");

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
  aspectRatio = poster.width / poster.height;
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

let cornerRadius;

let aspectRatio;

let imageData;

let leftFrame, topFrame, rightFrame, bottomFrame;

let frameWidth;

async function update() {
  for (let t = 0; t < 100; t += increment) {
    frameWidth = document.getElementById("frameWidth").value * 10;

    // Get frame width
    leftFrame = poster.style
      .getPropertyValue("border-left-width")
      .replace("px", "");
    topFrame = poster.style
      .getPropertyValue("border-top-width")
      .replace("px", "");
    rightFrame = poster.style
      .getPropertyValue("border-right-width")
      .replace("px", "");
    bottomFrame = poster.style
      .getPropertyValue("border-bottom-width")
      .replace("px", "");

    // Set noise scale
    scale = document.getElementById("scale").value;
    // Set noise contrast
    contrast = document.getElementById("contrast").value;

    cornerRadius = document.getElementById("cornerRadius").value * 10;

    poster.width =
      document.getElementById("posterWidth").value * 10 <= 0 ||
      document.getElementById("posterWidth").value * 10 === ""
        ? 1
        : document.getElementById("posterWidth").value * 10 -
          leftFrame -
          rightFrame;
    poster.height =
      document.getElementById("posterHeight").value * 10 <= 0 ||
      document.getElementById("posterHeight").value * 10 === ""
        ? 1
        : document.getElementById("posterHeight").value * 10 -
          topFrame -
          bottomFrame;

    poster.style.setProperty("border-radius", `${cornerRadius}px`);

    imageData = ctx.createImageData(poster.width, poster.height);
    generatePoster(t);
    await sleep(33);
  }
}

function downloadPoster() {
  html2canvas(poster, { scale: 10 }, { backgroundColor: null }).then(function (
    canva
  ) {
    let canvasUrl = canva.toDataURL("image/png");
    const createEl = document.createElement("a");
    createEl.href = canvasUrl;
    createEl.download = "My new poster";
    createEl.click();
    createEl.remove();
  });
}

document.getElementById("download").addEventListener("click", function (e) {
  downloadPoster();
});

document
  .getElementById("stopAnimation")
  .addEventListener("click", function (e) {
    animationToggle();
  });

document.getElementById("frameWidth").addEventListener("change", function (e) {
  if (this) {
    lF === true
      ? poster.style.setProperty("border-left-width", `${frameWidth}px`)
      : poster.style.setProperty("border-left-width", "0px");

    tF === true
      ? poster.style.setProperty("border-top-width", `${frameWidth}px`)
      : poster.style.setProperty("border-top-width", "0px");

    rF === true
      ? poster.style.setProperty("border-right-width", `${frameWidth}px`)
      : poster.style.setProperty("border-right-width", "0px");

    bF === true
      ? poster.style.setProperty("border-bottom-width", `${frameWidth}px`)
      : poster.style.setProperty("border-bottom-width", "0px");
  }
});

let lF = false,
  tF = false,
  rF = false,
  bF = false;
document.getElementById("leftFrame").addEventListener("change", function (e) {
  if (this.checked) {
    lF = true;
    poster.style.setProperty("border-left-width", `${frameWidth}px`);
  } else {
    lF = false;
    poster.style.setProperty("border-left-width", "0px");
  }
});

document.getElementById("topFrame").addEventListener("change", function (e) {
  if (this.checked) {
    tF = true;
    poster.style.setProperty("border-top-width", `${frameWidth}px`);
  } else {
    tF = false;
    poster.style.setProperty("border-top-width", "0px");
  }
});
document.getElementById("rightFrame").addEventListener("change", function (e) {
  if (this.checked) {
    rF = true;
    poster.style.setProperty("border-right-width", `${frameWidth}px`);
  } else {
    rF = false;
    poster.style.setProperty("border-right-width", "0px");
  }
});
document.getElementById("bottomFrame").addEventListener("change", function (e) {
  if (this.checked) {
    bF = true;
    poster.style.setProperty("border-bottom-width", `${frameWidth}px`);
  } else {
    bF = false;
    poster.style.setProperty("border-bottom-width", "0px");
  }
});

update();
