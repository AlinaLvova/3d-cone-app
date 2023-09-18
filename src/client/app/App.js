import React from "react";
import classes from "./App.module.scss";
import Main from "../components/Main"

function App() {
  return (
    <div className={classes.app}>
      <header className={classes["app-header"]}>3D Cone Viewer</header>
      <Main />
      <footer className={classes["app-footer"]}>
        <a href='https://github.com/AlinaLvova' className={classes["app-footer__author"]}>by mAlina Lvova</a>
      </footer>
    </div>
  );
}

export default App;
