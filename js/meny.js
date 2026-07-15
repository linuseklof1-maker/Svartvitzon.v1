const menyKnapp = document.querySelector(".meny-knapp");
const huvudMeny = document.querySelector(".huvudmeny");

if (menyKnapp && huvudMeny) {
  menyKnapp.addEventListener("click", function () {
    const oppen = huvudMeny.classList.toggle("oppen");
    menyKnapp.setAttribute("aria-expanded", oppen);
  });
}