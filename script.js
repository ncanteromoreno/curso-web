const mensajes = [
  "¡Qué bueno tenerte por aquí!",
  "Cada gran proyecto empieza con una idea.",
  "¡Sigue aprendiendo y creando!",
];

const boton = document.querySelector("#saludo");
const texto = document.querySelector("#mensaje");
let indiceMensaje = 0;
texto.textContent = mensajes[indiceMensaje];

const botonTema = document.querySelector("#cambiar-tema");
const temaGuardado = localStorage.getItem("tema");

function aplicarTema(tema) {
  const temaOscuro = tema === "oscuro";
  document.documentElement.dataset.tema = temaOscuro ? "oscuro" : "claro";
  botonTema.setAttribute("aria-pressed", String(temaOscuro));
  botonTema.textContent = temaOscuro ? "Activar tema claro" : "Activar tema oscuro";
}

aplicarTema(temaGuardado === "oscuro" ? "oscuro" : "claro");

botonTema.addEventListener("click", () => {
  const nuevoTema = document.documentElement.dataset.tema === "oscuro" ? "claro" : "oscuro";
  aplicarTema(nuevoTema);
  localStorage.setItem("tema", nuevoTema);
});

boton.addEventListener("click", () => {
  indiceMensaje = (indiceMensaje + 1) % mensajes.length;
  texto.textContent = mensajes[indiceMensaje];
});

const manecillaHora = document.querySelector("#manecilla-hora");
const manecillaMinuto = document.querySelector("#manecilla-minuto");
const manecillaSegundo = document.querySelector("#manecilla-segundo");

function actualizarReloj() {
  const ahora = new Date();
  const segundos = ahora.getSeconds();
  const minutos = ahora.getMinutes();
  const horas = ahora.getHours() % 12;

  manecillaSegundo.style.transform = `translateX(-50%) rotate(${segundos * 6}deg)`;
  manecillaMinuto.style.transform = `translateX(-50%) rotate(${minutos * 6 + segundos * 0.1}deg)`;
  manecillaHora.style.transform = `translateX(-50%) rotate(${horas * 30 + minutos * 0.5}deg)`;
}

actualizarReloj();
window.setInterval(actualizarReloj, 1000);
