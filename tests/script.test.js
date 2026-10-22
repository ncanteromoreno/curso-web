const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const projectRoot = path.join(__dirname, "..");
const script = fs.readFileSync(path.join(projectRoot, "script.js"), "utf8");

function createElement() {
  return {
    attributes: {},
    listeners: {},
    style: {},
    textContent: "",
    addEventListener(event, listener) {
      this.listeners[event] = listener;
    },
    setAttribute(name, value) {
      this.attributes[name] = value;
    },
  };
}

function loadApp(savedTheme = null) {
  const ids = [
    "#saludo",
    "#mensaje",
    "#cambiar-tema",
    "#manecilla-hora",
    "#manecilla-minuto",
    "#manecilla-segundo",
  ];
  const elements = Object.fromEntries(ids.map((id) => [id, createElement()]));
  const documentElement = { dataset: {} };
  const storage = new Map();
  const intervals = [];

  if (savedTheme !== null) {
    storage.set("tema", savedTheme);
  }

  class FixedDate {
    getSeconds() {
      return 30;
    }

    getMinutes() {
      return 15;
    }

    getHours() {
      return 3;
    }
  }

  vm.runInNewContext(script, {
    Date: FixedDate,
    document: {
      documentElement,
      querySelector: (selector) => elements[selector],
    },
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    },
    window: {
      setInterval(callback, delay) {
        intervals.push({ callback, delay });
      },
    },
  });

  return { documentElement, elements, intervals, storage };
}

test("la página carga los recursos y contiene los controles accesibles", () => {
  const html = fs.readFileSync(path.join(projectRoot, "index.html"), "utf8");

  assert.match(html, /href="styles\.css"/);
  assert.match(html, /src="script\.js" defer/);
  assert.match(html, /id="saludo"/);
  assert.match(html, /id="mensaje" class="mensaje" aria-live="polite"/);
  assert.match(html, /id="cambiar-tema"/);
  assert.match(html, /id="manecilla-hora"/);
  assert.match(html, /id="manecilla-minuto"/);
  assert.match(html, /id="manecilla-segundo"/);
});

test("muestra los mensajes en orden y vuelve al primero", () => {
  const { elements } = loadApp();
  const boton = elements["#saludo"];
  const mensaje = elements["#mensaje"];

  assert.equal(mensaje.textContent, "¡Qué bueno tenerte por aquí!");

  boton.listeners.click();
  assert.equal(mensaje.textContent, "Cada gran proyecto empieza con una idea.");

  boton.listeners.click();
  assert.equal(mensaje.textContent, "¡Sigue aprendiendo y creando!");

  boton.listeners.click();
  assert.equal(mensaje.textContent, "¡Qué bueno tenerte por aquí!");
});

test("restaura el tema guardado y persiste el cambio al alternarlo", () => {
  const { documentElement, elements, storage } = loadApp("oscuro");
  const botonTema = elements["#cambiar-tema"];

  assert.equal(documentElement.dataset.tema, "oscuro");
  assert.equal(botonTema.attributes["aria-pressed"], "true");
  assert.equal(botonTema.textContent, "Activar tema claro");

  botonTema.listeners.click();

  assert.equal(documentElement.dataset.tema, "claro");
  assert.equal(botonTema.attributes["aria-pressed"], "false");
  assert.equal(botonTema.textContent, "Activar tema oscuro");
  assert.equal(storage.get("tema"), "claro");
});

test("actualiza las manecillas del reloj cada segundo", () => {
  const { elements, intervals } = loadApp();

  assert.equal(elements["#manecilla-segundo"].style.transform, "translateX(-50%) rotate(180deg)");
  assert.equal(elements["#manecilla-minuto"].style.transform, "translateX(-50%) rotate(93deg)");
  assert.equal(elements["#manecilla-hora"].style.transform, "translateX(-50%) rotate(97.5deg)");
  assert.equal(intervals.length, 1);
  assert.equal(intervals[0].delay, 1000);
});
