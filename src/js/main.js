const $ = document.querySelector.bind(document);
const $$ = (sel, con) => Array.prototype.slice.call((con || document).querySelectorAll(sel));
const DEG = Math.PI / 180;

function rotate({ x, y }, a) {
  const { sin, cos } = Math;
  return {
    x: x * cos(a) - y * sin(a),
    y: x * sin(a) + y * cos(a)
  };
}

function translate({ x, y }, tx, ty) {
  return {
    x: x + tx,
    y: y + ty
  }
}

$('.darkmode-checkbox').addEventListener('click', () => {
  document.body.classList.toggle('darkmode');
  if (document.body.classList.contains("darkmode")) {
    setCookie("mode", "darkmode", 365)
  } else {
    setCookie("mode", "lightmode", 365)
  }
  // old msedge compatibility:
  const isDarkmode = (document.body.classList.contains('darkmode'));
  const shadow = $('.moon-shadow');
  shadow.setAttribute('cx', isDarkmode ? '40' : '60');
});

// I could not get the transforms in buggy safari to work
// Workaround: calculate the transformed coords to absolute ones:
const removeTransforms = true;

if (removeTransforms) {
  const rays = $$('.rays path');
  rays.map((ray, i) => {
    const p0 = translate(rotate({ x: 0, y: -28 }, i * 45 * DEG), 32, 32);
    const p1 = translate(rotate({ x: 0, y: -16 }, i * 45 * DEG), 32, 32);
    ray.removeAttribute('transform-origin');
    ray.removeAttribute('transform');
    ray.setAttribute('d', `M${p0.x} ${p0.y} L${p1.x} ${p1.y}`);
  });
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function initializeMode(value) {
  cookieSet = ""
  if (value.length > 0 && value != "darkmode") {
    cookieSet = "lightmode"
    $(".darkmode-checkbox").checked = true
  } else {
    document.body.classList.add("darkmode")
    cookieSet = "darkmode"
  }

  return cookieSet
}

window.onload = () => {
  var cookieName = "mode"
  var cookieValue = getCookie(cookieName)
  setCookie(cookieName, initializeMode(cookieValue), 365)
}

