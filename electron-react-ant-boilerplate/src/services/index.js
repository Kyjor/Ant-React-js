// Libs
import React from "react";
import { render } from "react-dom";
// Root
import Root from "@/routes/Root";
import TimerRoot from "@/routes/TimerRoot";
// Styles
import "@/themes/App.global.scss";

const App = Root;
//const NewApp = TimerRoot;
render(<App />, document.getElementById("new"));
//render(<NewApp />, document.getElementById("new"));

if (module.hot) {
  module.hot.accept("./routes/Root", () => {
    require("@/routes/Root");
    render(<App />, document.getElementById("app"));
  });

}
s
