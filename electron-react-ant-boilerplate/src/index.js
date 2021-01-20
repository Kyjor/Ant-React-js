// Libs
import React from "react";
import { render } from "react-dom";
// Root
import Root from "@/routes/Root";
import TimerRoot from "@/routes/TimerRoot";
// Styles
import "@/themes/App.global.scss";
import NewApp from "./layouts/NewApp";

const App = Root;
const TimerWindow = TimerRoot;
render(<App />, document.getElementById("app"));
render(<TimerWindow />, document.getElementById("newapp"));

if (module.hot) {
  module.hot.accept("./routes/Root", () => {
    require("@/routes/Root");
    render(<App />, document.getElementById("app"));
  });
  module.hot.accept("./routes/TimerRoot", () => {
    require("@/routes/TimerRoot");
    render(<NewApp />, document.getElementById("newapp"));
  });
}
