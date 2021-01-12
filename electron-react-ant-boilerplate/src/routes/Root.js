// Libs
import React from "react";
import { HashRouter, Switch, Route } from "react-router-dom";
// Screens
import Home from "@/screens/Home/Home";
import Projects from "../screens/Projects/Projects";
import ProjectPage from "../screens/ProjectPage/ProjectPage";

const Routes = () => (
  <HashRouter>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/projects" component={Projects}/>
      <Route exact path="/projectPage" component={ProjectPage}/>
    </Switch>
  </HashRouter>
);

export default Routes;
