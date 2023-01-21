// Generating and remembering the Seed
let seed = Math.random();

// Setting animation toggle
let increment = 0.01;
let isAnimationStopped = false;

// Recieve poster context
let poster = document.getElementById("poster");
let ctx = poster.getContext("2d");

// Declare Scale and Contarst Global
let scale;
let contrast;

// Declare overall poster dimensions scale
let posterScale = 10;

// Declare Corner radius Global
//let cornerRadius;

// Declare Aspect ratio Global
let aspectRatio;

// Declare Image data Global
let imageData;

// Declare Frame
let leftFrame, topFrame, rightFrame, bottomFrame;
let frameWidth;

async function update() {
  for (let t = 0; t < 100; t += increment) {
    frameWidth = document.getElementById("frameWidth").value * posterScale;

    // Get each frame width
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

    // Refreshing noise scale
    scale = document.getElementById("scale").value;
    // Refreshing noise contrast
    contrast = document.getElementById("contrast").value;
    // Refreshing corner radius
    // cornerRadius = document.getElementById("cornerRadius").value * posterScale;
    // poster.style.setProperty("border-radius", `${cornerRadius}px`);

    // Refreshing poster dimensions according to entered size and frames
    poster.width =
      document.getElementById("posterWidth").value * posterScale <= 0 ||
      document.getElementById("posterWidth").value * posterScale === ""
        ? 1
        : document.getElementById("posterWidth").value * posterScale -
          leftFrame -
          rightFrame;
    poster.height =
      document.getElementById("posterHeight").value * posterScale <= 0 ||
      document.getElementById("posterHeight").value * posterScale === ""
        ? 1
        : document.getElementById("posterHeight").value * posterScale -
          topFrame -
          bottomFrame;
    // Refrashing Image Data dimensions
    imageData = ctx.createImageData(poster.width, poster.height);

    generatePoster(t);

    await sleep(33);
  }
}

function seedRandom() {
  seed = Math.random();
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

// html2canvas poster downloader
function downloadPoster() {
  let actualScale = 11.8;
  html2canvas(poster, { scale: actualScale }, { backgroundColor: null }).then(
    function (canvas) {
      let canvasUrl = canvas.toDataURL("image/png");
      const createEl = document.createElement("a");
      createEl.href = canvasUrl;
      createEl.download = "My new poster";
      createEl.click();
      createEl.remove();
    }
  );
}

function animationToggle() {
  isAnimationStopped = !isAnimationStopped;
  increment = isAnimationStopped ? 0 : 0.01;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Waiting to download poster
document.getElementById("download").addEventListener("click", function (e) {
  downloadPoster();
});

// Waiting to randomize seed
document.getElementById("seedRandom").addEventListener("click", function (e) {
  seedRandom();
});

// Waiting to stop animation
document
  .getElementById("stopAnimation")
  .addEventListener("click", function (e) {
    animationToggle();
  });

// Looking for frames
let leftFrameVisible,
  topFrameVisible,
  rightFrameVisible,
  bottomFrameVisible = false;

document.getElementById("frameWidth").addEventListener("change", function (e) {
  leftFrameVisible === true
    ? poster.style.setProperty("border-left-width", `${frameWidth}px`)
    : poster.style.setProperty("border-left-width", "0px");

  topFrameVisible === true
    ? poster.style.setProperty("border-top-width", `${frameWidth}px`)
    : poster.style.setProperty("border-top-width", "0px");

  rightFrameVisible === true
    ? poster.style.setProperty("border-right-width", `${frameWidth}px`)
    : poster.style.setProperty("border-right-width", "0px");

  bottomFrameVisible === true
    ? poster.style.setProperty("border-bottom-width", `${frameWidth}px`)
    : poster.style.setProperty("border-bottom-width", "0px");
});

document.getElementById("leftFrame").addEventListener("change", function (e) {
  if (this.checked) {
    leftFrameVisible = true;
    poster.style.setProperty("border-left-width", `${frameWidth}px`);
  } else {
    leftFrameVisible = false;
    poster.style.setProperty("border-left-width", "0px");
  }
});
document.getElementById("topFrame").addEventListener("change", function (e) {
  if (this.checked) {
    topFrameVisible = true;
    poster.style.setProperty("border-top-width", `${frameWidth}px`);
  } else {
    topFrameVisible = false;
    poster.style.setProperty("border-top-width", "0px");
  }
});
document.getElementById("rightFrame").addEventListener("change", function (e) {
  if (this.checked) {
    rightFrameVisible = true;
    poster.style.setProperty("border-right-width", `${frameWidth}px`);
  } else {
    rightFrameVisible = false;
    poster.style.setProperty("border-right-width", "0px");
  }
});
document.getElementById("bottomFrame").addEventListener("change", function (e) {
  if (this.checked) {
    bottomFrameVisible = true;
    poster.style.setProperty("border-bottom-width", `${frameWidth}px`);
  } else {
    bottomFrameVisible = false;
    poster.style.setProperty("border-bottom-width", "0px");
  }
});

update();
