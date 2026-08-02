// MarktPlan — Service Worker für Push-Benachrichtigungen im Hintergrund (Firebase Cloud Messaging).
// Muss am Root der Seite liegen (gleiche Ebene wie marktplan.html), damit der Scope passt.

importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDszXWDqzquKJoF4pAN2dexqyv4aY4gTGQ",
  authDomain: "marktplan-winkler.firebaseapp.com",
  projectId: "marktplan-winkler",
  storageBucket: "marktplan-winkler.firebasestorage.app",
  messagingSenderId: "85624571703",
  appId: "1:85624571703:web:4282281fc72386c628bcb2"
});

// Neue Service-Worker-Version sofort aktivieren (nicht erst beim übernächsten Laden) —
// wichtig, damit Fixes wie dieser hier ohne doppelten Neustart wirksam werden.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

// Reiner "push"-Event-Handler statt messaging.onBackgroundMessage(): Unsere Nachrichten
// sind bewusst reine Daten-Nachrichten (kein "notification"-Feld im FCM-Payload), damit
// der Browser sie nicht zusätzlich automatisch anzeigt — wir zeigen sie genau einmal hier.
self.addEventListener("push", (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch { data = {}; }
  const payload = data.data ?? data; // FCM verpackt Daten-Nachrichten unter "data"
  const title = payload.title ?? "Neuer Schichtplan";
  const body = payload.body ?? "";
  event.waitUntil(self.registration.showNotification(title, { body, icon: "icon-192.png" }));
});
