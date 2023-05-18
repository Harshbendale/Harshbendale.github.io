var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var stars = [], // Array that contains the stars
    FPS = 120, // Frames per second
    x = 97, // Number of stars
    mouse = {
      x: 0,
      y: 0
    };  // mouse location

// Push stars to array
for (var i = 0; i < x; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1 + 1,
    angle: Math.random() * Math.PI * 2, // New property for the angle of motion
    speed: (Math.random() * 0.02 + 0.01) * 10, // Make the movement 10% faster
    glowing: false, // New property to indicate glowing state
    glowTimeout: 0 // New property to hold the timeout reference
  });
}

// Draw the scene
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation = "lighter";

  for (var i = 0, x = stars.length; i < x; i++) {
    var s = stars[i];

    if (s.glowing) {
      ctx.fillStyle = "#fff"; // White color
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius * 2, 0, 2 * Math.PI); // Increase the size by 10%
      ctx.fill();
    } else {
      ctx.fillStyle = "#fff"; // White color
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);
      ctx.fill();
    }

    ctx.fillStyle = 'black';
    ctx.stroke();
  }

  ctx.beginPath();
  for (var i = 0, x = stars.length; i < x; i++) {
    var starI = stars[i];
    ctx.moveTo(starI.x, starI.y);
    if (distance(mouse, starI) < 150) ctx.lineTo(mouse.x, mouse.y);
    for (var j = 0, x = stars.length; j < x; j++) {
      var starII = stars[j];
      if (distance(starI, starII) < 150) {
        ctx.lineTo(starII.x, starII.y);
      }
    }
  }
  ctx.lineWidth = 0.05;
  ctx.strokeStyle = 'white';
  ctx.stroke();
}

function distance(point1, point2) {
  var xs = 0;
  var ys = 0;

  xs = point2.x - point1.x;
  xs = xs * xs;

  ys = point2.y - point1.y;
  ys = ys * ys;

  return Math.sqrt(xs + ys);
}

// Update star locations
function update() {
  for (var i = 0, x = stars.length; i < x; i++) {
    var s = stars[i];

    // Update the position based on angle and speed
    s.x += Math.cos(s.angle) * s.speed;
    s.y += Math.sin(s.angle) * s.speed;

    if (s.x < 0 || s.x > canvas.width || s.y < 0 || s.y > canvas.height) {
      // If the particle goes outside the canvas, reset its position and angle
      s.x = Math.random() * canvas.width;
      s.y = Math.random() * canvas.height;
      s.angle = Math.random() * Math.PI * 2;
    }

    // Check if the particle should start glowing
    if (!s.glowing && Math.random() < 0.005 && countGlowingStars() < 5) {
      s.glowing = true;
      s.glowTimeout = 100; // 100 frames = 1 second
    }

    // Check if the glowing timeout has expired
    if (s.glowTimeout > 0) {
      s.glowTimeout--;
    } else {
      s.glowing = false;
    }
  }
}

function countGlowingStars() {
  var count = 0;
  for (var i = 0, x = stars.length; i < x; i++) {
    if (stars[i].glowing) {
      count++;
    }
  }
  return count;
}

canvas.addEventListener('mousemove', function (e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// Update and draw
function tick() {
  draw();
  update();
  requestAnimationFrame(tick);
}

tick();
