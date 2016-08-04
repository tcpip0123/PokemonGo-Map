function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees + 90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function backArc(x, y, radius, startAngle, endAngle) {

  var start = polarToCartesian(x, y, radius, endAngle);
  var end = polarToCartesian(x, y, radius, startAngle);

  var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

  var d = [
  "M", start.x, start.y,
  "A", radius, radius, 0, arcSweep, 0, end.x, end.y
].join(" ");

  return d;
}

function arcNode(x, y, radius, startAngle, endAngle, length) {

  var start = polarToCartesian(x, y, radius - 3, endAngle);
  var linestart = polarToCartesian(x, y, radius - length, endAngle);
  var end = polarToCartesian(x, y, radius, startAngle);

  var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

  var d = [
  "M", linestart.x, linestart.y,
  "L", start.x, start.y
].join(" ");

  return d;
}

var saved_trainer_level = localStorage.getItem('trainer_level');
var saved_pokemon_level = localStorage.getItem('pokemon_level');

var trainer_level_slider = document.getElementById("trainer_level");
if (saved_trainer_level) {
  trainer_level_slider.value = saved_trainer_level;
}
trainer_level_slider.addEventListener("mousemove", function (data) {
  if (trainer_level_slider.value != trainer_level) {
    drawImage();
  }
});
trainer_level_slider.addEventListener("touchmove", function (data) {
  if (trainer_level_slider.value != trainer_level) {
    drawImage();
  }
});
trainer_level_slider.addEventListener("change", drawImage);

var pokemon_level_slider = document.getElementById("pokemon_level");
if (saved_pokemon_level) {
  pokemon_level_slider.value = saved_pokemon_level;
}
pokemon_level_slider.addEventListener("mousemove", function (data) {
  if (pokemon_level_slider.value != pokemon_level) {
    drawImage();
  }
});
pokemon_level_slider.addEventListener("touchmove", function (data) {
  if (pokemon_level_slider.value != pokemon_level) {
    drawImage();
  }
});
pokemon_level_slider.addEventListener("change", drawImage);

window.onresize = function (event) {
  drawImage();
};

function drawImage() {

  var arc = document.getElementById("arc");
  while (arc.firstChild) {
    arc.removeChild(arc.firstChild);
  }

  var trainer_level = trainer_level_slider.value;
  document.getElementById("trainer_level_label").innerHTML = trainer_level;
  pokemon_level_slider.max = Math.min(parseInt(trainer_level) + 1.5, 40);
  localStorage.setItem('trainer_level', trainer_level);
  
  var pokemon_level = pokemon_level_slider.value;
  document.getElementById("pokemon_level_label").innerHTML = pokemon_level;
  document.getElementById("candy").innerHTML = candy[Math.floor(pokemon_level - 1)];
  document.getElementById("stardust").innerHTML = stardust[Math.floor(pokemon_level - 1)];
  localStorage.setItem('pokemon_level', pokemon_level);

  width = document.getElementById("arc_section").offsetWidth;

  arc.setAttribute('width', width + "px");
  arc.setAttribute('height', (width / 2 + 8) + "px");

  for (var i = 0; i < Math.min((trainer_level) * 2 + 2, 79); i++) {
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    if ((i / 2 + 1) % 10 == 0) {
      path.setAttribute("stroke", "hsla(0, 0%, 100%, .2)");
      length = 50;
    } else if ((i / 2 + 1) % 1 == 0) {
      path.setAttribute("stroke", "hsla(0, 0%, 100%, .2)");
      length = 30;
    } else {
      path.setAttribute("stroke", "hsla(0, 0%, 100%, .2)");
      length = 10;
    }
    path.setAttribute("fill", "hsla(0, 0%, 0%, 0)");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("d", arcNode(width / 2, width / 2, width / 2 - 40, 90, 90 + ((CpM[i] - 0.094) * 202.037116 / CpM[trainer_level * 2 - 2]), length));
    arc.appendChild(path);
  }

  var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("stroke", "hsla(0, 0%, 100%, .2)");
  path.setAttribute("fill", "hsla(0, 0%, 0%, 0)");
  path.setAttribute("stroke-width", "4");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("d", backArc(width / 2, width / 2, width / 2 - 40, 90, 270));
  arc.appendChild(path);

  var start = polarToCartesian(width / 2, width / 2, width / 2 - 40, 90 + ((CpM[pokemon_level * 2 - 2] - 0.094) * 202.037116 / CpM[trainer_level * 2 - 2]));

  var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("stroke", "hsla(0, 0%, 100%, 1)");
  path.setAttribute("fill", "hsla(0, 0%, 0%, 0)");
  path.setAttribute("stroke-width", "4");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("d", backArc(width / 2, width / 2, width / 2 - 40, 90, 90 + ((CpM[pokemon_level * 2 - 2] - 0.094) * 202.037116 / CpM[trainer_level * 2 - 2])));
  arc.appendChild(path);

  var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("stroke", "hsla(0, 0%, 0%, 0)");
  circle.setAttribute("fill", "hsla(0, 0%, 100%, 1)");
  circle.setAttribute("stroke-width", "0");
  circle.setAttribute("cx", start.x);
  circle.setAttribute("cy", start.y);
  circle.setAttribute("r", "3");
  arc.appendChild(circle);
}

drawImage();
