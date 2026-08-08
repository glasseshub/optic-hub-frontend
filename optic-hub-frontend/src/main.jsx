import React from "react";
import ReactDOM from "react-dom/client";
import OpticApp from "./App.jsx";

// If opened inside Telegram, expand to full height and tell Telegram the
// app is ready. Running outside Telegram (plain browser) is fine too —
// these calls are simply skipped.
if (window.Telegram && window.Telegram.WebApp) {
  window.Telegram.WebApp.ready();
  window.Telegram.WebApp.expand();
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <OpticApp />
  </React.StrictMode>
);
