// ============================================================
//  route-firebase.js  –  Sincronización de hábitos con Firestore
//  Importado como ES Module desde route.html
// ============================================================

import { auth, db } from "./firebase.js";
import {
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

// ─── Referencia al documento del usuario en Firestore ────────────────────────
// Estructura: rutas_usuarios/{uid}  →  { habitos: [...], actualizadoEn: string }
function refRuta(uid) {
  return doc(db, "rutas_usuarios", uid);
}

// ─── Guardar hábitos en Firestore ────────────────────────────────────────────
async function guardarHabitos(habitos) {
  const usuario = auth.currentUser;
  if (!usuario) return;

  try {
    await setDoc(refRuta(usuario.uid), {
      habitos,
      actualizadoEn: new Date().toISOString(),
      uid: usuario.uid,
    });
  } catch (e) {
    console.warn("No se pudieron guardar los hábitos en Firestore:", e.message);
  }
}

// ─── Escuchar Auth + cargar hábitos automáticamente ──────────────────────────
/**
 * Este es el punto de entrada principal.
 * Espera a que Firebase Auth resuelva el estado de sesión (puede tardar 1-2s
 * en dispositivos nuevos mientras restaura el token de IndexedDB).
 *
 * Llama a onSesion(usuario | null) cuando se conoce el estado de auth.
 * Llama a onHabitosListos(habitos) si hay sesión activa y se cargaron los datos.
 *
 * @param {{ onSesion: function, onHabitosListos: function }} callbacks
 */
function inicializar({ onSesion, onHabitosListos }) {
  // onAuthStateChanged garantiza que el callback se llama SOLO cuando Firebase
  // ha terminado de restaurar la sesión. Nunca antes.
  const unsubscribe = onAuthStateChanged(auth, async (usuario) => {
    if (usuario) {
      // ✅ Hay sesión: informar a la UI
      const nombre = usuario.displayName || usuario.email?.split("@")[0] || "Usuario";
      onSesion({ uid: usuario.uid, nombre, email: usuario.email });

      // ✅ Cargar hábitos desde Firestore
      try {
        const snap = await getDoc(refRuta(usuario.uid));
        if (snap.exists()) {
          const habitos = snap.data().habitos || [];
          onHabitosListos(habitos); // <- Aquí le pasamos los datos a React
        }
        // Si no existe documento: primera vez, dejamos los hábitos por defecto
      } catch (e) {
        console.warn("Error al cargar hábitos:", e.message);
      }

    } else {
      // Sin sesión
      onSesion(null);
    }
  });

  return unsubscribe; // Permitir cancelar el listener si es necesario
}

// ─── Exponer en window para que React (Babel) pueda usarlo ───────────────────
window._firebaseRuta = {
  guardarHabitos,
  inicializar,
};

console.log("✅ route-firebase.js cargado correctamente");
