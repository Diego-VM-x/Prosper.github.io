// ============================================================
//  route-firebase.js  –  Sincronización de hábitos con Firestore
// ============================================================

import { auth, db } from "./firebase.js";
import {
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

function refRuta(uid) {
  return doc(db, "rutas_usuarios", uid);
}

export async function guardarHabitos(habitos) {
  const usuario = auth.currentUser;
  if (!usuario) return;

  try {
    await setDoc(refRuta(usuario.uid), {
      habitos,
      actualizadoEn: new Date().toISOString(),
      uid: usuario.uid,
    });
  } catch (e) {
    console.warn("Error al guardar:", e.message);
  }
}

export function inicializar({ onSesion, onHabitosListos }) {
  return onAuthStateChanged(auth, async (usuario) => {
    if (usuario) {
      const nombre = usuario.displayName || usuario.email?.split("@")[0] || "Usuario";
      onSesion({ uid: usuario.uid, nombre });

      try {
        const snap = await getDoc(refRuta(usuario.uid));
        if (snap.exists()) {
          // Usuario con datos en la nube
          onHabitosListos(snap.data().habitos || []);
        } else {
          // Usuario nuevo sin datos: mandamos null para que React use los default
          onHabitosListos(null);
        }
      } catch (e) {
        console.warn("Error al cargar:", e.message);
        onHabitosListos(null);
      }
    } else {
      // Cierre de sesión
      onSesion(null);
      onHabitosListos(null);
    }
  });
}

window._firebaseRuta = { guardarHabitos, inicializar };
