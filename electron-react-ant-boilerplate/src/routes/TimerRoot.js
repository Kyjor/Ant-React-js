// Libs
import React from "react";
import { HashRouter, Switch, Route } from "react-router-dom";
// Screens
import Timer from "@/screens/Timer/Timer";
import Projects from "../screens/Projects/Projects";
import NewProjectPage from "../screens/ProjectPage/NewProjectPage";

const TimerRoutes = () => (
  <HashRouter>
    <Switch>
      <Route exact path="/" component={Timer} />
    </Switch>
  </HashRouter>
);

export default TimerRoutes;
