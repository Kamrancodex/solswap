import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Buffer } from "buffer";
globalThis.Buffer = Buffer;
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
