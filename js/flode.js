// ===== 1. Hämta flödet och starta =====
const flodeElement = document.getElementById("flode");

if (flodeElement) {
  fetch("/data/flode.json")
    .then(function (svar) {
      if (!svar.ok) {
        throw new Error("Kunde inte hämta flode.json (status " + svar.status + ")");
      }
      return svar.json();
    })
    .then(function (inlagg) {
      visaFlode(inlagg);
    })
    .catch(function (fel) {
      console.error(fel);
      flodeElement.innerHTML = "<p class='fel'>Flödet kunde inte laddas just nu.</p>";
    });
}

// ===== 2. Rita upp hela flödet =====
function visaFlode(inlagg) {
  // Sortera nyast först
  inlagg.sort(function (a, b) {
    return new Date(b.datum) - new Date(a.datum);
  });

  const senaste = inlagg.slice(0, 10);

  // Töm "Laddar..."-texten
  flodeElement.innerHTML = "";

  senaste.forEach(function (post) {
    let kort;

    switch (post.type) {
      case "artikel":
        kort = skapaArtikelkort(post);
        break;
      case "betyg":
        kort = skapaBetygskort(post);
        break;
      case "quiz":
        kort = skapaQuizkort(post);
        break;
      default:
        console.warn("Okänd inläggstyp:", post.type);
        return; // hoppa över okända typer
    }

    flodeElement.appendChild(kort);
  });
}

// ===== 3. Kortbyggarna – en per inläggstyp =====

function skapaArtikelkort(post) {
  const kort = document.createElement("article");
  kort.className = "kort kort--artikel";

  kort.innerHTML = `
    <div class="kort-topp">
      <span class="kort-kategori">${post.kategori}</span>
      <time datetime="${post.datum}">${formateraDatum(post.datum)}</time>
    </div>
    ${post.bild ? `<img src="${post.bild}" alt="" class="kort-bild">` : ""}
    <div class="kort-innehall">
      <h2>${post.titel}</h2>
      <p>${post.teaser}</p>
      ${post.lank ? `<a href="${post.lank}" class="las-mer">Läs hela artikeln →</a>` : ""}
    </div>
  `;

  return kort;
}

function skapaBetygskort(post) {
  const kort = document.createElement("article");
  kort.className = "kort kort--betyg";

  // Bygg betygsraderna ur spelar-arrayen
  const rader = post.spelare
    .map(function (s) {
      return `<li><span>${s.namn} <small>(${s.position})</small></span><strong>${s.betyg}</strong></li>`;
    })
    .join("");

  kort.innerHTML = `
    <div class="kort-topp">
      <span class="kort-kategori">Spelarbetyg</span>
      <time datetime="${post.datum}">${formateraDatum(post.datum)}</time>
    </div>
    <div class="kort-innehall">
      <h2>${post.match} <span class="resultat">${post.resultat}</span></h2>
      <ul class="betygslista">${rader}</ul>
    </div>
  `;

  return kort;
}

function skapaQuizkort(post) {
  const kort = document.createElement("article");
  kort.className = "kort kort--quiz";

  kort.innerHTML = `
    <div class="kort-topp">
      <span class="kort-kategori">${post.titel}</span>
      <time datetime="${post.datum}">${formateraDatum(post.datum)}</time>
    </div>
    <div class="kort-innehall">
      <p class="quiz-fraga">${post.fraga}</p>
      <div class="quiz-svar"></div>
      <p class="quiz-resultat" hidden></p>
    </div>
  `;

  // Svarsknapparna byggs med createElement (inte innerHTML)
  // eftersom de behöver klick-lyssnare
  const svarsyta = kort.querySelector(".quiz-svar");
  const resultat = kort.querySelector(".quiz-resultat");

  post.svar.forEach(function (svarstext, index) {
    const knapp = document.createElement("button");
    knapp.className = "quiz-knapp";
    knapp.textContent = svarstext;

    knapp.addEventListener("click", function () {
      // Lås alla knappar efter svar
      kort.querySelectorAll(".quiz-knapp").forEach(function (k) {
        k.disabled = true;
      });

      if (index === post.ratt) {
        knapp.classList.add("ratt");
        resultat.textContent = "Rätt! 🎉";
      } else {
        knapp.classList.add("fel");
        resultat.textContent = "Fel – rätt svar var: " + post.svar[post.ratt];
      }
      resultat.hidden = false;
    });

    svarsyta.appendChild(knapp);
  });

  return kort;
}

// ===== 4. Hjälpfunktion för datum =====
function formateraDatum(datumStrang) {
  const datum = new Date(datumStrang);
  return datum.toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "short",
  });
}