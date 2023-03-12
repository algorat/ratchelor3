import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./variables.css";
import RatchelorApp from "./components/App/App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RatchelorApp />
  </React.StrictMode>
);

// TODO(connie): Revisit web vitals at a later time. https://bit.ly/CRA-vitals
// reportWebVitals();
