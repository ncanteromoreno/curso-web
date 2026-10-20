const mensajes = [
  "¡Qué bueno tenerte por aquí!",
  "Cada gran proyecto empieza con una idea.",
  "¡Sigue aprendiendo y creando!",
];

const boton = document.querySelector("#saludo");
const texto = document.querySelector("#mensaje");
let indiceMensaje = 0;

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
