import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThirdwebProvider } from "thirdweb/react";
import "./index.css";
import App from "./App.tsx";

const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error("Root element not found");
}

createRoot(rootElement).render(
    <StrictMode>
        <ThirdwebProvider>
            <App />
        </ThirdwebProvider>
    </StrictMode>
);
