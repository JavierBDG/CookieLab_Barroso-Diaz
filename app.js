// Constantes y auxiliares
const DIAS_30_SEG = 30 * 24 * 60 * 60;

/**
 * Guarda o actualiza una cookie.
 */
function setCookie(nombre, valor, maxAgeSegundos = DIAS_30_SEG) {
  document.cookie = `${nombre}=${encodeURIComponent(valor)}; max-age=${maxAgeSegundos}; path=/`;
}

/**
 * Lee una cookie por su nombre. Devuelve null si no existe.
 */
function getCookie(nombre) {
  const cookies = document.cookie.split("; ");
  for (let c of cookies) {
    const [clave, valor] = c.split("=");
    if (clave === nombre) {
      return decodeURIComponent(valor);
    }
  }
  return null;
}

/**
 * Borra una cookie estableciendo max-age=0.
 */
function deleteCookie(nombre) {
  document.cookie = `${nombre}=; max-age=0; path=/`;
}

// Elementos del DOM
const elSaludo = document.getElementById("saludo");
const elContador = document.getElementById("contador");
const elUltimaVisita = document.getElementById("ultimaVisita");
const selectTema = document.getElementById("selectTema");
const selectIdioma = document.getElementById("selectIdioma");
const btnCambiarNombre = document.getElementById("btnCambiarNombre");
const btnOlvidarme = document.getElementById("btnOlvidarme");

// --- Fase 1 y 2: Guard del usuario ---
function gestionarUsuario() {
  let usuario = getCookie("usuario");

  if (!usuario) {
    usuario = prompt("¡Bienvenido/a a CookieLab! Por favor, introduce tu nombre:");
    if (usuario && usuario.trim() !== "") {
      setCookie("usuario", usuario.trim());
      alert(`¡Bienvenido/a, ${usuario.trim()}!`);
    } else {
      usuario = "Invitado";
      setCookie("usuario", usuario);
    }
  }

  actualizarTextoSaludo(usuario);
}

function actualizarTextoSaludo(nombre) {
  const idioma = getCookie("idioma") || "es";
  if (idioma === "en") {
    elSaludo.textContent = `Hello again, ${nombre}!`;
  } else {
    elSaludo.textContent = `Hola de nuevo, ${nombre}`;
  }
}

// --- Fase 3: Preferencias (Tema e Idioma) ---
function aplicarPreferencias() {
  const tema = getCookie("tema") || "claro";
  const idioma = getCookie("idioma") || "es";

  // Aplicar Tema
  if (tema === "oscuro") {
    document.body.classList.add("oscuro");
  } else {
    document.body.classList.remove("oscuro");
  }
  selectTema.value = tema;

  // Aplicar Idioma
  selectIdioma.value = idioma;
  const usuario = getCookie("usuario");
  if (usuario) actualizarTextoSaludo(usuario);
}

selectTema.addEventListener("change", (e) => {
  const nuevoTema = e.target.value;
  setCookie("tema", nuevoTema);
  aplicarPreferencias();
});

selectIdioma.addEventListener("change", (e) => {
  const nuevoIdioma = e.target.value;
  setCookie("idioma", nuevoIdioma);
  aplicarPreferencias();
});

// --- Fase 4: Contador de visitas ---
function gestionarVisitas() {
  let visitas = getCookie("visitas");
  visitas = visitas ? Number(visitas) + 1 : 1;
  setCookie("visitas", visitas);
  
  elContador.textContent = `Has visitado esta página ${visitas} ${visitas === 1 ? 'vez' : 'veces'}.`;
}

// --- Extra Nota: Fecha de la última visita ---
function gestionarUltimaVisita() {
  const fechaAnterior = getCookie("ultimaVisita");
  const ahora = new Date().toLocaleString();

  if (fechaAnterior) {
    elUltimaVisita.textContent = `Tu última visita fue el: ${fechaAnterior}`;
  } else {
    elUltimaVisita.textContent = "Esta es tu primera visita registrada.";
  }

  setCookie("ultimaVisita", ahora);
}

// --- Fase 5: Panel de control ---
btnCambiarNombre.addEventListener("click", () => {
  const nuevoNombre = prompt("Introduce tu nuevo nombre:");
  if (nuevoNombre && nuevoNombre.trim() !== "") {
    setCookie("usuario", nuevoNombre.trim());
    actualizarTextoSaludo(nuevoNombre.trim());
  }
});       
     
btnOlvidarme.addEventListener("click", () => {
  const confirmar = confirm("¿Estás seguro/a de que quieres borrar todos tus datos?");
  if (confirmar) {
    deleteCookie("usuario");
    deleteCookie("tema");
    deleteCookie("idioma");
    deleteCookie("visitas");
    deleteCookie("ultimaVisita");
    location.reload(); // Recarga para volver a comportarse como un usuario nuevo
  }
});

// --- Inicialización ---
console.log("CookieLab iniciado");
aplicarPreferencias();
gestionarUsuario();
gestionarVisitas();
gestionarUltimaVisita();