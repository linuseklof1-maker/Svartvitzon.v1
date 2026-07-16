// ===== Arkivet: hämta, rita och filtrera =====
const arkivLista = document.getElementById("arkiv-lista");
const filterYta = document.getElementById("filter");

let allaInlagg = []; // sparas här så filtren kan återanvända listan

if (arkivLista) {
  fetch("data/flode.json")
    .then(function (svar) {
      if (!svar.ok) {
        throw new Error("Kunde inte hämta flode.json (status " + svar.status + ")");
      }
      return svar.json();
    })
    .then(function (inlagg) {
      inlagg.sort(function (a, b) {
        return new Date(b.datum) - new Date(a.datum);
      });
      allaInlagg = inlagg;
      visaArkiv("alla");
    })
    .catch(function (fel) {
      console.error(fel);
      arkivLista.innerHTML = "<li class='fel'>Arkivet kunde inte laddas just nu.</li>";
    });
}

// ===== Rita listan, filtrerad på typ =====
function visaArkiv(typ) {
  let urval;

  if (typ === "alla") {
    urval = allaInlagg;
  } else {
    urval = allaInlagg.filter(function (post) {
      return post.type === typ;
    });
  }

  arkivLista.innerHTML = "";

  if (urval.length === 0) {
    arkivLista.innerHTML = "<li class='tomt'>Inget här ännu.</li>";
    return;
  }

  urval.forEach(function (post) {
    const rad = document.createElement("li");
    rad.className = "arkiv-rad";

    const etikett = typEtikett(post.type);
    const titel = post.titel || post.match || "Utan titel";

    if (post.type === "artikel" && post.lank) {
      rad.innerHTML = `
        <span class="arkiv-typ">${etikett}</span>
        <a href="${post.lank}" class="arkiv-titel">${titel}</a>
        <time datetime="${post.datum}">${formateraArkivDatum(post.datum)}</time>
      `;
    } else {
      rad.innerHTML = `
        <span class="arkiv-typ">${etikett}</span>
        <span class="arkiv-titel">${titel}</span>
        <time datetime="${post.datum}">${formateraArkivDatum(post.datum)}</time>
      `;
    }

    arkivLista.appendChild(rad);
  });
}

// ===== Filterknapparna =====
if (filterYta) {
  filterYta.addEventListener("click", function (handelse) {
    const knapp = handelse.target.closest(".filter-knapp");
    if (!knapp) return;

    filterYta.querySelectorAll(".filter-knapp").forEach(function (k) {
      k.classList.remove("aktiv");
    });
    knapp.classList.add("aktiv");

    visaArkiv(knapp.dataset.typ);
  });
}

// ===== Hjälpfunktioner =====
function typEtikett(type) {
  if (type === "artikel") return "Artikel";
  if (type === "betyg") return "Betyg";
  if (type === "quiz") return "Quiz";
  return type;
}

function formateraArkivDatum(datumStrang) {
  const datum = new Date(datumStrang);
  return datum.toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}