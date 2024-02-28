import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

import { ModalViewChannel } from './Modal/ModalViewChannel';
import { ConfirmationDialogViewChannel } from './ConfirmationDialog/ConfirmationDialogViewChannel';
import { FlashMessageViewChannel } from './FlashMessages/FlashMessageViewChannel';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    <ModalViewChannel />
    <FlashMessageViewChannel />
    <ConfirmationDialogViewChannel />
  </React.StrictMode>,
);
