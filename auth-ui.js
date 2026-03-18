// ============================================================
//  auth-ui.js  –  Controlador de la UI de autenticación
//  Se conecta al DOM del modal de auth en index.html.
//  Debe importarse como: <script type="module" src="auth-ui.js"></script>
// ============================================================

import {
  registrarUsuario,
  iniciarSesion,
  cerrarSesion,
  escucharSesion,
} from "./firebase.js";

// ─── Helpers de mensajes ─────────────────────────────────────────────────────
function mostrarMensaje(elementId, texto, tipo = "error") {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = texto;
  el.className = `auth-mensaje ${tipo}`; // CSS define .error y .exito
  el.style.display = "block";
  if (tipo === "exito") {
    setTimeout(() => (el.style.display = "none"), 3000);
  }
}

function traducirError(codigo) {
  const errores = {
    "auth/email-already-in-use": "Este correo ya está registrado. Intenta iniciar sesión.",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
    "auth/invalid-email": "El formato del correo no es válido.",
    "auth/user-not-found": "No encontramos una cuenta con ese correo.",
    "auth/wrong-password": "Contraseña incorrecta. Inténtalo de nuevo.",
    "auth/invalid-credential": "Credenciales inválidas. Verifica tu correo y contraseña.",
    "auth/too-many-requests": "Demasiados intentos fallidos. Espera un momento.",
    "auth/network-request-failed": "Sin conexión. Revisa tu internet.",
  };
  return errores[codigo] || "Algo salió mal. Por favor intenta de nuevo.";
}

// ─── Formulario de REGISTRO ──────────────────────────────────────────────────
const formRegistro = document.getElementById("form-registro");
if (formRegistro) {
  formRegistro.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = formRegistro.querySelector("button[type='submit']");
    const nombre = document.getElementById("reg-nombre").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value;

    btn.disabled = true;
    btn.textContent = "Registrando...";

    try {
      await registrarUsuario(email, password, nombre);
      mostrarMensaje("msg-registro", "¡Cuenta creada con éxito! Bienvenido/a a Prosper 🎉", "exito");
      formRegistro.reset();
      // Opcional: cerrar modal o redirigir
      setTimeout(() => cerrarModal("modal-auth"), 2000);
    } catch (error) {
      mostrarMensaje("msg-registro", traducirError(error.code));
    } finally {
      btn.disabled = false;
      btn.textContent = "Crear cuenta";
    }
  });
}

// ─── Formulario de LOGIN ─────────────────────────────────────────────────────
const formLogin = document.getElementById("form-login");
if (formLogin) {
  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = formLogin.querySelector("button[type='submit']");
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    btn.disabled = true;
    btn.textContent = "Ingresando...";

    try {
      await iniciarSesion(email, password);
      mostrarMensaje("msg-login", "¡Sesión iniciada! 👋", "exito");
      setTimeout(() => cerrarModal("modal-auth"), 1500);
    } catch (error) {
      mostrarMensaje("msg-login", traducirError(error.code));
    } finally {
      btn.disabled = false;
      btn.textContent = "Iniciar sesión";
    }
  });
}

// ─── Botón de Cerrar Sesión ──────────────────────────────────────────────────
const btnLogout = document.getElementById("btn-logout");
if (btnLogout) {
  btnLogout.addEventListener("click", async () => {
    await cerrarSesion();
  });
}

// ─── Escuchar cambios de sesión → actualizar UI ───────────────────────────────
escucharSesion((usuario) => {
  const panelInvitado = document.getElementById("ui-invitado");
  const panelUsuario = document.getElementById("ui-usuario");
  const nombreUsuario = document.getElementById("nombre-usuario");

  if (usuario) {
    // Usuario autenticado
    const nombre = usuario.displayName || usuario.email.split("@")[0];
    if (nombreUsuario) nombreUsuario.textContent = nombre;
    if (panelInvitado) panelInvitado.style.display = "none";
    if (panelUsuario) panelUsuario.style.display = "block";

    // Compatibilidad con el sistema previo de localStorage
    localStorage.setItem("userName", nombre);
    localStorage.setItem("isLoggedIn", "true");
  } else {
    // Sin sesión
    if (panelInvitado) panelInvitado.style.display = "flex";
    if (panelUsuario) panelUsuario.style.display = "none";

    localStorage.removeItem("userName");
    localStorage.setItem("isLoggedIn", "false");
  }
});

// ─── Helpers del modal ────────────────────────────────────────────────────────
export function abrirModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = "flex";
}

export function cerrarModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = "none";
}

// Tabs del modal (Registro / Login)
document.querySelectorAll(".auth-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".auth-tab").forEach((t) => t.classList.remove("activo"));
    document.querySelectorAll(".auth-panel").forEach((p) => (p.style.display = "none"));
    tab.classList.add("activo");
    const target = document.getElementById(tab.dataset.target);
    if (target) target.style.display = "block";
  });
});

// Cerrar modal al hacer click en el overlay
document.getElementById("modal-auth")?.addEventListener("click", (e) => {
  if (e.target.id === "modal-auth") cerrarModal("modal-auth");
});

// Exponer función globalmente (para botones inline con onclick)
window.abrirModalAuth = () => abrirModal("modal-auth");
window.cerrarModalAuth = () => cerrarModal("modal-auth");
window.cerrarSesionFirebase = async () => {
  await cerrarSesion();
  // El observer onAuthStateChanged actualizará el localStorage automáticamente,
  // y React lo leerá en el próximo render o al recargar.
  window.location.reload();
};
