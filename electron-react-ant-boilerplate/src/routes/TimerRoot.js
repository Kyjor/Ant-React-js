// Libs
import React from "react";
import { HashRouter, Switch, Route } from "react-router-dom";
// Screens
import Home from "@/screens/Home/Home";
import Projects from "../screens/Projects/Projects";
import NewProjectPage from "../screens/ProjectPage/NewProjectPage";

const TimerRoutes = () => (
  <HashRouter>
    <Switch>
      <Route exact path="/" component={{NewProjectPage}} />
    </Switch>
  </HashRouter>
);

export default TimerRoutes;
