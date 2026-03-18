// ============================================================
//  firebase.js  –  Núcleo de Firebase para Prosper
//  Importa y exporta las instancias que necesita toda la app.
//  Usa: <script type="module" src="firebase.js"></script>
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

// ─── Configuración del proyecto ───────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyBmrDThJ-J40ktiSWDkex1yjB-fa4lkDyg",
  authDomain: "prosper-197d4.firebaseapp.com",
  projectId: "prosper-197d4",
  storageBucket: "prosper-197d4.firebasestorage.app",
  messagingSenderId: "183396372863",
  appId: "1:183396372863:web:1b3a5c2d1d5288c7a28a4a",
  measurementId: "G-PW6SZ1WP5Y",
};

// ─── Inicialización ──────────────────────────────────────────────────────────
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ─── Módulo de Autenticación ─────────────────────────────────────────────────

/**
 * Registra un nuevo usuario con email y contraseña.
 * Opcionalmente asigna un displayName al perfil.
 *
 * @param {string} email
 * @param {string} password
 * @param {string} displayName  - Nombre visible del usuario (opcional)
 * @returns {Promise<import("firebase/auth").UserCredential>}
 */
export async function registrarUsuario(email, password, displayName = "") {
  const credencial = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(credencial.user, { displayName });
  }
  return credencial;
}

/**
 * Inicia sesión con email y contraseña.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import("firebase/auth").UserCredential>}
 */
export async function iniciarSesion(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Cierra la sesión del usuario actualmente autenticado.
 *
 * @returns {Promise<void>}
 */
export async function cerrarSesion() {
  return signOut(auth);
}

/**
 * Escucha cambios en el estado de autenticación.
 * Llama al callback con el objeto User (o null si no hay sesión).
 *
 * @param {function(import("firebase/auth").User|null): void} callback
 * @returns {function} unsubscribe – llama esta función para dejar de escuchar
 */
export function escucharSesion(callback) {
  return onAuthStateChanged(auth, callback);
}

// ─── Módulo de Firestore ─────────────────────────────────────────────────────

/**
 * Guarda una meta de ahorro en la colección "metas_usuarios".
 * El documento se vincula al UID del usuario autenticado.
 *
 * @param {number|string} monto       - Monto objetivo de la meta
 * @param {string}        descripcion - Descripción de la meta
 * @returns {Promise<import("firebase/firestore").DocumentReference>}
 * @throws {Error} Si no hay ningún usuario con sesión iniciada
 */
export async function guardarMetaAhorro(monto, descripcion) {
  const usuario = auth.currentUser;
  if (!usuario) {
    throw new Error("Debes iniciar sesión antes de guardar una meta.");
  }

  const docRef = await addDoc(collection(db, "metas_usuarios"), {
    uid: usuario.uid,           // Vincula la meta al usuario
    email: usuario.email,         // Útil para consultas de admin
    monto: Number(monto),         // Normalizado a número
    descripcion: descripcion.trim(),
    creadoEn: serverTimestamp(),     // Timestamp del servidor (no del cliente)
  });

  console.log("✅ Meta guardada con ID:", docRef.id);
  return docRef;
}
