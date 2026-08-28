// ===== Veckans pussel – Connections-spel =====
const spelElement = document.getElementById("spel");
const LIV_START = 5;

let alla16 = [];
let valda = [];
let hittadeGrupper = [];
let liv = LIV_START;
let last = false;

if (spelElement) {
  fetch("/data/pussel.json")
    .then((r) => r.json())
    .then(function (pussel) {
      pussel.sort((a, b) => new Date(b.datum) - new Date(a.datum));
      startaSpel(pussel[0]);
    })
    .catch(function (fel) {
      console.error(fel);
      spelElement.innerHTML = "<p class='fel'>Pusslet kunde inte laddas just nu.</p>";
    });
}

function startaSpel(pussel) {
  alla16 = [];
  pussel.grupper.forEach(function (grupp, index) {
    grupp.ord.forEach(function (ord) {
      alla16.push({ ord: ord, gruppIndex: index, ledtrad: grupp.ledtrad });
    });
  });

  blanda(alla16);
  ritaAllt(pussel);
}

function blanda(lista) {
  for (let i = lista.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lista[i], lista[j]] = [lista[j], lista[i]];
  }
}

function ritaAllt(pussel) {
  spelElement.innerHTML = `
    <h1 class="spel-titel">${pussel.titel}</h1>
    <div class="spel-hittade" id="spel-hittade"></div>
    <div class="spel-rutnat" id="spel-rutnat"></div>
    <div class="spel-liv" id="spel-liv"></div>
    <div class="spel-knappar">
      <button id="spel-gissa" class="spel-gissa" disabled>Gissa</button>
      <button id="spel-rensa" class="spel-rensa">Rensa val</button>
    </div>
    <p class="spel-resultat" id="spel-resultat" hidden></p>
  `;

  ritaRutnat();
  ritaLiv();

  document.getElementById("spel-gissa").addEventListener("click", gissa);
  document.getElementById("spel-rensa").addEventListener("click", rensaVal);
}

function ritaRutnat() {
  const rutnat = document.getElementById("spel-rutnat");
  rutnat.innerHTML = "";

  alla16.forEach(function (kort) {
    if (hittadeGrupper.includes(kort.gruppIndex)) return;

    const knapp = document.createElement("button");
    knapp.className = "spel-kort";
    knapp.textContent = kort.ord;

    if (valda.includes(kort)) {
      knapp.classList.add("vald");
    }

    knapp.addEventListener("click", function () {
      if (last) return;
      valjKort(kort);
    });

    rutnat.appendChild(knapp);
  });
}

function valjKort(kort) {
  const redanVald = valda.indexOf(kort);
  if (redanVald !== -1) {
    valda.splice(redanVald, 1);
  } else if (valda.length < 4) {
    valda.push(kort);
  }

  document.getElementById("spel-gissa").disabled = valda.length !== 4;
  ritaRutnat();
}

function rensaVal() {
  if (last) return;
  valda = [];
  document.getElementById("spel-gissa").disabled = true;
  ritaRutnat();
}

function gissa() {
  if (valda.length !== 4 || last) return;
  last = true;

  const gruppIndex = valda[0].gruppIndex;
  const alltSamma = valda.every((k) => k.gruppIndex === gruppIndex);

  const kortElement = [...document.querySelectorAll(".spel-kort")].filter((el) =>
    valda.some((v) => v.ord === el.textContent)
  );

  if (alltSamma) {
    kortElement.forEach((el) => el.classList.add("ratt"));
    setTimeout(function () {
      hittadeGrupper.push(gruppIndex);
      const ledtrad = valda[0].ledtrad;
      const ord = valda.map((v) => v.ord).join(", ");
      valda = [];
      visaHittadGrupp(ledtrad, ord);
      ritaRutnat();
      last = false;
      document.getElementById("spel-gissa").disabled = true;

      if (hittadeGrupper.length === 4) vinst();
    }, 800);
  } else {
    kortElement.forEach((el) => el.classList.add("fel"));
    setTimeout(function () {
      kortElement.forEach((el) => el.classList.remove("fel"));
      liv--;
      ritaLiv();
      valda = [];
      ritaRutnat();
      last = false;
      document.getElementById("spel-gissa").disabled = true;

      if (liv <= 0) forlust();
    }, 1200);
  }
}

function visaHittadGrupp(ledtrad, ord) {
  const ruta = document.createElement("div");
  ruta.className = "spel-grupp-hittad";
  ruta.innerHTML = `<strong>${ledtrad}</strong><span>${ord}</span>`;
  document.getElementById("spel-hittade").appendChild(ruta);
}

function ritaLiv() {
  const livElement = document.getElementById("spel-liv");
  let text = "Liv: ";
  for (let i = 0; i < LIV_START; i++) {
    text += i < liv ? "●" : "○";
  }
  livElement.textContent = text;
}

function vinst() {
  const resultat = document.getElementById("spel-resultat");
  const anvandaLiv = LIV_START - liv;
  resultat.textContent = `Klarat! Du använde ${anvandaLiv} felgissning${anvandaLiv === 1 ? "" : "ar"}. 🖤🤍`;
  resultat.hidden = false;
  document.querySelector(".spel-knappar").hidden = true;
}

function forlust() {
  const resultat = document.getElementById("spel-resultat");
  resultat.textContent = "Slut på liv! Bättre lycka nästa vecka.";
  resultat.hidden = false;
  document.querySelector(".spel-knappar").hidden = true;
}