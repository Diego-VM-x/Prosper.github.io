// ============================================================
//  route-firebase.js  –  Sincronización de hábitos con Firestore
//  Importado como ES Module desde route.html
// ============================================================

import { auth, db } from "./firebase.js";
import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

// ─── Referencia al documento del usuario en Firestore ────────────────────────
// Estructura: rutas_usuarios/{uid}  →  { habitos: [...], actualizadoEn: timestamp }
function refRuta(uid) {
  return doc(db, "rutas_usuarios", uid);
}

// ─── Guardar hábitos en Firestore ────────────────────────────────────────────
/**
 * Guarda (o sobreescribe) el array de hábitos del usuario autenticado.
 * @param {Array} habitos
 */
export async function guardarHabitos(habitos) {
  const usuario = auth.currentUser;
  if (!usuario) return; // Sin sesión, no hacemos nada

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

// ─── Cargar hábitos desde Firestore (una sola vez) ───────────────────────────
/**
 * Obtiene el array de hábitos guardados del usuario.
 * @returns {Promise<Array|null>}  null si no existe documento aún
 */
export async function cargarHabitos() {
  const usuario = auth.currentUser;
  if (!usuario) return null;

  try {
    const snap = await getDoc(refRuta(usuario.uid));
    if (snap.exists()) {
      return snap.data().habitos || [];
    }
    return null; // Primera vez: no hay datos, usar defaults
  } catch (e) {
    console.warn("No se pudieron cargar los hábitos desde Firestore:", e.message);
    return null;
  }
}

// ─── Escuchar cambios de autenticación y notificar a la UI ───────────────────
/**
 * Llama al callback cuando el estado de auth cambia.
 * Callback recibe { uid, nombre } o null (si no hay sesión).
 * @param {function} callback
 */
export function escucharAuth(callback) {
  return onAuthStateChanged(auth, (usuario) => {
    if (usuario) {
      callback({
        uid:    usuario.uid,
        nombre: usuario.displayName || usuario.email?.split("@")[0] || "Usuario",
        email:  usuario.email,
      });
    } else {
      callback(null);
    }
  });
}

// ─── Exponer funciones globales para que React (Babel) las use ───────────────
// React no puede importar ES Modules directamente, así que las exponemos en window.
window._firebaseRuta = {
  guardarHabitos,
  cargarHabitos,
  escucharAuth,
};

console.log("✅ route-firebase.js cargado correctamente");
